import { test } from '@japa/runner';
import { ApiResponse } from '@japa/api-client';
import User from '#models/user';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import Library from '#models/library';
import { LibraryFactory } from '#database/factories/library_factory';

const API_URL_NAME: string = 'libraries.restore';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $user: User;

  group.each.setup(async () => {
    await resetForAuthenticatedUser();
    $user = await createSuperadminUser();
  });

  test('it should restore a deleted library successfully', async ({ client, route }) => {
    // Arrangements
    const library: Library = await LibraryFactory.with('user').with('type').create();

    // Actions
    const response: ApiResponse = await client
      .patch(route(API_URL_NAME, { id: library.id }))
      .loginAs($user);

    // Assertions
    response.assertStatus(204);
  });
});
