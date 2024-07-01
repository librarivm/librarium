import { test } from '@japa/runner';
import Library from '#models/library';
import { LibraryFactory } from '#database/factories/library_factory';
import { ApiResponse } from '@japa/api-client';

test.group('api/v1/libraries', (group) => {
  let $libraries: Library[] = [];

  group.each.setup(async () => {
    $libraries = await LibraryFactory.with('user').with('type').createMany(20);
  });

  test('it should return a paginated list of libraries', async ({ client }) => {
    const response: ApiResponse = await client.get('/api/v1/libraries');
    const library: Library = $libraries?.[0];

    response.assertStatus(200);
    response.assertBodyContains({
      data: [{ id: library.id, name: library.name, slug: library.slug }],
    });
  });
});
