import { LibraryFactory } from '#database/factories/library_factory';
import { UserFactory } from '#database/factories/user_factory';
import Library from '#models/library';
import User from '#models/user';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'libraries.delete';

test.group(API_URL_NAME, (group) => {
  let $user: User;

  group.each.setup(async () => {
    await Library.truncate();
    $user = await UserFactory.create();
  });

  test('it should permanently delete a library successfully', async ({ client, route, assert }) => {
    // Arrangements
    const library: Library = await LibraryFactory.merge({ userId: $user.id }).with('type').create();

    // Actions
    const response: ApiResponse = await client
      .delete(route(API_URL_NAME, { id: library.id }))
      .loginAs($user);

    // Assertions
    response.assertStatus(204);
    assert.isEmpty(response.body());
  });
});
