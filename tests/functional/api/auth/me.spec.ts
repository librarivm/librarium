import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'auth.me';

test.group(API_URL_NAME, (group) => {
  group.each.setup(async () => {
    await User.truncate();
  });

  test('it should return the logged in user', async ({ client, route }) => {
    // Arrangements
    const user: User = await UserFactory.create();

    // Actions
    const response: ApiResponse = await client.get(route(API_URL_NAME)).loginAs(user);

    // Assertions
    response.assertStatus(200);
    response.assertBodyContains({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  });

  test('it should return error for an unauthenticated request', async ({ client, route }) => {
    // Actions
    const response: ApiResponse = await client.get(route(API_URL_NAME));

    // Assertions
    response.assertStatus(401);
  });
});
