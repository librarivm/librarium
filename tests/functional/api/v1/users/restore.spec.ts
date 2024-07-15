import { test } from '@japa/runner';
import User from '#models/user';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import { UserFactory } from '#database/factories/user_factory';
import { ApiResponse } from '@japa/api-client';
import { DateTime } from 'luxon';

const API_URL_NAME: string = 'users.restore';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $user: User;

  group.each.setup(async () => {
    await resetForAuthenticatedUser();
    $user = await createSuperadminUser();
  });

  test('it should restore a deleted user successfully', async ({ client, route, assert }) => {
    // Arrangements
    const user: User = await UserFactory.create();
    user.deletedAt = DateTime.local();
    await user.save();

    // Actions
    const response: ApiResponse = await client
      .patch(route(API_URL_NAME, { id: user.id }))
      .loginAs($user);

    const actual: User | null = await User.find(user.id);

    // Assertions
    response.assertStatus(204);
    assert.isNull(actual?.deletedAt);
  });
});
