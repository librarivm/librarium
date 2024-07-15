import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import { HttpQueries } from '#services/service';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';
import camelCase from 'lodash/camelCase.js';
import orderBy from 'lodash/orderBy.js';
import sample from 'lodash/sample.js';
import sortBy from 'lodash/sortBy.js';
import unzip from 'lodash/unzip.js';
import sampleSize from 'lodash/sampleSize.js';
import { DateTime } from 'luxon';

const API_URL_NAME: string = 'users.index';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $users: User[] = [];
  let $user: User;

  group.setup(async () => {
    await User.truncate();
    await resetForAuthenticatedUser();
    $users = await UserFactory.createMany(10);
    $user = await createSuperadminUser();
    $users = $users.concat([$user]);
  });

  test('it should return a paginated list of users', async ({ client, route }) => {
    // Arrangements
    const user: User = $users?.[0];

    // Actions
    const response: ApiResponse = await client.get(route(API_URL_NAME)).loginAs($user);

    // Assertions
    response.assertStatus(200);
    response.assertBodyContains({
      data: [
        { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
      ],
    });
  });

  test('it should return a sorted list of users', async ({ client, route }) => {
    const queries: HttpQueries = { page: 1, per_page: 3, order_by: 'email' };
    const response: ApiResponse = await client.get(route(API_URL_NAME)).qs(queries).loginAs($user);
    const items: User[] = sortBy($users, queries.order_by as string).slice(0, queries.per_page);

    response.assertStatus(200);
    response.assertBodyContains({
      meta: { perPage: queries.per_page },
      data: items.map((item: User) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
      })),
    });
  });

  test('it should return a multi-sorted list of users', async ({ client, route }) => {
    const queries: HttpQueries = {
      page: 1,
      per_page: 10,
      order_by: {
        0: ['email', 'desc'],
        1: ['id', 'asc'],
      },
    };
    const response: ApiResponse = await client.get(route(API_URL_NAME)).qs(queries).loginAs($user);
    const [columns, orders] = unzip(Object.values(queries.order_by as {}));

    const items: { [key: string]: any }[] = orderBy(
      $users,
      columns.map((column: string | any) => camelCase(column)),
      orders as any[]
    ).slice(0, queries.per_page);

    response.assertStatus(200);
    response.assertBodyContains({
      meta: { perPage: queries.per_page },
      data: items.map((item: { [key: string]: any }) => ({
        email: item.email,
        id: item.id,
      })),
    });
  });

  test('it should return a filtered list of users', async ({ client, route }) => {
    const item: User = sample($users) as User;
    const queries: HttpQueries = { page: 1, per_page: 3, q: item.email };
    const response: ApiResponse = await client.get(route(API_URL_NAME)).qs(queries).loginAs($user);

    response.assertStatus(200);
    response.assertBodyContains({
      meta: { perPage: queries.per_page },
      data: [{ firstName: item.firstName, id: item.id, email: item.email }],
    });
  });

  test('it should return a list of only archived users', async ({ client, route, assert }) => {
    // Arrangements
    const queries: HttpQueries = { per_page: 10, page: 1, only_archived: true };
    Object.values(sampleSize($users, 5)).forEach((user: User) => {
      user.deletedAt = DateTime.local();
      user.save();
    });

    // Actions
    const response: ApiResponse = await client.get(route(API_URL_NAME)).qs(queries).loginAs($user);
    const collection = response.body();

    // Assertions
    response.assertStatus(200);
    assert.lengthOf(collection.data, 5);
    collection.data.forEach((data: User) => {
      assert.isNotNull(data.deletedAt);
    });
  });

  test('it should return a list of users and archived ones', async ({ client, route, assert }) => {
    // Arrangements
    const queries: HttpQueries = { per_page: 10, page: 1, with_archived: true };
    Object.values(sampleSize($users, 5)).forEach((user: User) => {
      user.deletedAt = DateTime.local();
      user.save();
    });

    // Actions
    const response: ApiResponse = await client.get(route(API_URL_NAME)).qs(queries).loginAs($user);
    const collection = response.body();

    // Assertions
    response.assertStatus(200);
    assert.lengthOf(collection.data, 10);
  });
});
