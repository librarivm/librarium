import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'users.destroy';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $user: User;

  group.each.setup(async () => {
    await resetForAuthenticatedUser();
    $user = await createSuperadminUser();
  });

  test('it should permanently delete a user successfully', async ({ client, route, assert }) => {
    // Arrangements
    const user: User = await UserFactory.create();

    // Actions
    const response: ApiResponse = await client
      .delete(route(API_URL_NAME, { id: user.id }))
      .loginAs($user);

    // Assertions
    response.assertStatus(204);
    assert.isEmpty(response.body());
  });
});
