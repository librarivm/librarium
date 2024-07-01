import { test } from '@japa/runner';
import Library from '#models/library';
import { LibraryFactory } from '#database/factories/library_factory';
import { ApiResponse } from '@japa/api-client';
import { HttpQueries } from '#services/service';
import sortBy from 'lodash/sortBy.js';
import sample from 'lodash/sample.js';

const API_URL = '/api/v1/libraries';

test.group(API_URL.replace('/', ''), (group) => {
  let $libraries: Library[] = [];

  group.setup(async () => {
    $libraries = await LibraryFactory.with('user').with('type').createMany(10);
  });

  test('it should return a paginated list of libraries', async ({ client }) => {
    const response: ApiResponse = await client.get(API_URL);
    const library: Library = $libraries?.[0];

    response.assertStatus(200);
    response.assertBodyContains({
      data: [{ id: library.id, name: library.name, slug: library.slug }],
    });
  });

  test('it should return a sorted list of libraries', async ({ client }) => {
    const queries: HttpQueries = { page: 1, per_page: 3, order_by: 'slug' };
    const response: ApiResponse = await client.get(API_URL).qs(queries);
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

  test('it should return a filtered list of libraries', async ({ client }) => {
    const item: Library = sample($libraries) as Library;
    const queries: HttpQueries = { page: 1, per_page: 3, q: item.slug };
    const response: ApiResponse = await client.get(API_URL).qs(queries);

    response.assertStatus(200);
    response.assertBodyContains({
      meta: { perPage: queries.per_page },
      data: [{ name: item.name, id: item.id, slug: item.slug }],
    });
  });
});
