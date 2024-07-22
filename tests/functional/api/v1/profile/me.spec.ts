import { test } from '@japa/runner';
import User from '#models/user';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import { ApiResponse } from '@japa/api-client';

const API_URL_NAME: string = 'profile.me';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $user: User;

  group.each.setup(async () => {
    await resetForAuthenticatedUser();
    $user = await createSuperadminUser();
  });

  test('it should return the authenticated user', async ({ client, route, assert }) => {
    const response: ApiResponse = await client.get(route(API_URL_NAME)).loginAs($user);

    response.assertStatus(200);
    response.assertBodyContains({
      id: $user.id,
      email: $user.email,
    });
    assert.property(response.body(), 'roles');
    assert.property(response.body(), 'links');
  });

  test('it should return error for an unauthenticated request', async ({ client, route }) => {
    // Actions
    const response: ApiResponse = await client.get(route(API_URL_NAME));

    // Assertions
    response.assertStatus(401);
  });
});
