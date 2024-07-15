import { test } from '@japa/runner';
import User from '#models/user';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import { UserFactory } from '#database/factories/user_factory';
import { ApiResponse } from '@japa/api-client';

const API_URL_NAME: string = 'users.restore';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $user: User;

  group.each.setup(async () => {
    await resetForAuthenticatedUser();
    $user = await createSuperadminUser();
  });

  test('it should restore a deleted user successfully', async ({ client, route }) => {
    // Arrangements
    const user: User = await UserFactory.create();

    // Actions
    const response: ApiResponse = await client
      .patch(route(API_URL_NAME, { id: user.id }))
      .loginAs($user);

    // Assertions
    response.assertStatus(204);
  });
});
