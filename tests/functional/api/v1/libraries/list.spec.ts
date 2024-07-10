import { LibraryFactory } from '#database/factories/library_factory';
import Library from '#models/library';
import User from '#models/user';
import { HttpQueries } from '#services/service';
import { createAuthenticatedUser } from '#tests/helpers';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';
import camelCase from 'lodash/camelCase.js';
import orderBy from 'lodash/orderBy.js';
import sample from 'lodash/sample.js';
import sortBy from 'lodash/sortBy.js';
import unzip from 'lodash/unzip.js';

const API_URL_NAME: string = 'libraries.index';

test.group(API_URL_NAME, (group) => {
  let $libraries: Library[] = [];
  let $user: User;

  group.setup(async () => {
    await Library.truncate();
    $libraries = await LibraryFactory.with('user').with('type').createMany(10);
    $user = await createAuthenticatedUser();
  });

  test('it should return a paginated list of libraries', async ({ client, route }) => {
    const response: ApiResponse = await client.get(route(API_URL_NAME)).loginAs($user);
    const library: Library = $libraries?.[0];

    response.assertStatus(200);
    response.assertBodyContains({
      data: [{ id: library.id, name: library.name, slug: library.slug }],
    });
  });

  test('it should return a sorted list of libraries', async ({ client, route }) => {
    const queries: HttpQueries = { page: 1, per_page: 3, order_by: 'slug' };
    const response: ApiResponse = await client.get(route(API_URL_NAME)).qs(queries).loginAs($user);
    const items: Library[] = sortBy($libraries, queries.order_by as string).slice(
      0,
      queries.per_page
    );

    response.assertStatus(200);
    response.assertBodyContains({
      meta: { perPage: queries.per_page },
      data: items.map((item: Library) => ({ name: item.name, id: item.id, slug: item.slug })),
    });
  });

  test('it should return a multi-sorted list of libraries', async ({ client, route }) => {
    const queries: HttpQueries = {
      page: 1,
      per_page: 10,
      order_by: {
        0: ['is_private', 'desc'],
        1: ['slug', 'asc'],
      },
    };
    const response: ApiResponse = await client.get(route(API_URL_NAME)).qs(queries).loginAs($user);
    const [columns, orders] = unzip(Object.values(queries.order_by as {}));

    const items: { [key: string]: any }[] = orderBy(
      $libraries.map((item) => ({
        ...item,
        isPrivate: +item.isPrivate,
      })),
      columns.map((column: string | any) => camelCase(column)),
      orders as any[]
    ).slice(0, queries.per_page);

    response.assertStatus(200);
    response.assertBodyContains({
      meta: { perPage: queries.per_page },
      data: items.map((item: { [key: string]: any }) => ({
        isPrivate: item.isPrivate,
        slug: item.slug,
      })),
    });
  });

  test('it should return a filtered list of libraries', async ({ client, route }) => {
    const item: Library = sample($libraries) as Library;
    const queries: HttpQueries = { per_page: 4, page: 1, q: item.slug };
    const response: ApiResponse = await client.get(route(API_URL_NAME)).qs(queries).loginAs($user);

    response.assertStatus(200);
    response.assertBodyContains({
      meta: { perPage: queries.per_page },
      data: [{ name: item.name, id: item.id, slug: item.slug }],
    });
  });
});
