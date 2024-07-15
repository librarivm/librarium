import Role from '#models/role';
import User from '#models/user';
import { HttpQueries } from '#services/service';
import { createSuperadminUser } from '#tests/helpers';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';
import camelCase from 'lodash/camelCase.js';
import orderBy from 'lodash/orderBy.js';
import sample from 'lodash/sample.js';
import sortBy from 'lodash/sortBy.js';
import unzip from 'lodash/unzip.js';
import sampleSize from 'lodash/sampleSize.js';
import { DateTime } from 'luxon';
import { RoleFactory } from '#database/factories/role_factory';

const API_URL_NAME: string = 'roles.index';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $roles: Role[] = [];
  let $user: User;

  group.each.setup(async () => {
    await Role.truncate();
    $roles = [];

    $user = await createSuperadminUser();
    $roles = $roles.concat($user.roles);
  });

  test('it should return a paginated list of roles', async ({ client, route }) => {
    const response: ApiResponse = await client.get(route(API_URL_NAME)).loginAs($user);
    const role: Role = $roles?.[0];

    response.assertStatus(200);
    response.assertBodyContains({
      data: [{ id: role.id, name: role.name, slug: role.slug }],
    });
  });

  test('it should return a sorted list of roles', async ({ client, route }) => {
    const queries: HttpQueries = { page: 1, per_page: 3, order_by: 'slug' };
    const response: ApiResponse = await client.get(route(API_URL_NAME)).qs(queries).loginAs($user);
    const items: Role[] = sortBy($roles, queries.order_by as string).slice(0, queries.per_page);

    response.assertStatus(200);
    response.assertBodyContains({
      meta: { perPage: queries.per_page },
      data: items.map((item: Role) => ({ name: item.name, id: item.id, slug: item.slug })),
    });
  });

  test('it should return a multi-sorted list of roles', async ({ client, route }) => {
    const queries: HttpQueries = {
      page: 1,
      per_page: 10,
      order_by: {
        0: ['slug', 'desc'],
        1: ['id', 'asc'],
      },
    };
    const response: ApiResponse = await client.get(route(API_URL_NAME)).qs(queries).loginAs($user);
    const [columns, orders] = unzip(Object.values(queries.order_by as {}));

    const items: { [key: string]: any }[] = orderBy(
      $roles,
      columns.map((column: string | any) => camelCase(column)),
      orders as any[]
    ).slice(0, queries.per_page);

    response.assertStatus(200);
    response.assertBodyContains({
      meta: { perPage: queries.per_page },
      data: items.map((item: { [key: string]: any }) => ({
        slug: item.slug,
        id: item.id,
      })),
    });
  });

  test('it should return a filtered list of roles', async ({ client, route }) => {
    const item: Role = sample($roles) as Role;
    const queries: HttpQueries = { page: 1, per_page: 3, q: item.slug };
    const response: ApiResponse = await client.get(route(API_URL_NAME)).qs(queries).loginAs($user);

    response.assertStatus(200);
    response.assertBodyContains({
      meta: { perPage: queries.per_page },
      data: [{ name: item.name, id: item.id, slug: item.slug }],
    });
  });

  test('it should return a list of only archived roles', async ({ client, route, assert }) => {
    // Arrangements
    const items: Role[] = await RoleFactory.createMany(5);
    $roles = $roles.concat(items);
    const queries: HttpQueries = { per_page: 10, page: 1, only_archived: true };
    Object.values(sampleSize(items, 2)).forEach((role: Role) => {
      role.deletedAt = DateTime.local();
      role.save();
    });

    // Actions
    const response: ApiResponse = await client.get(route(API_URL_NAME)).qs(queries).loginAs($user);
    const collection = response.body();

    // Assertions
    response.assertStatus(200);
    assert.lengthOf(collection.data, 2);
    collection.data.forEach((data: Role) => {
      assert.isNotNull(data.deletedAt);
    });
  });

  test('it should return a list of roles and archived ones', async ({ client, route, assert }) => {
    // Arrangements
    const items: Role[] = await RoleFactory.createMany(5);
    $roles = $roles.concat(items);
    const queries: HttpQueries = { per_page: 10, page: 1, with_archived: true };
    Object.values(sampleSize(items, 5)).forEach((role: Role) => {
      role.deletedAt = DateTime.local();
      role.save();
    });

    // Actions
    const response: ApiResponse = await client.get(route(API_URL_NAME)).qs(queries).loginAs($user);
    const collection = response.body();

    // Assertions
    response.assertStatus(200);
    assert.lengthOf(collection.data, $roles.length);
  });
});
