import { LibraryFactory } from '#database/factories/library_factory';
import Library from '#models/library';
import User from '#models/user';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'libraries.destroy';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $user: User;

  group.each.setup(async () => {
    await Library.truncate();
    await resetForAuthenticatedUser();
    $user = await createSuperadminUser();
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
