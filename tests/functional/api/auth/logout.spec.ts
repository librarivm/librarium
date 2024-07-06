import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'auth.logout';

test.group(API_URL_NAME, () => {
  test('it logs out a user successfully', async ({ client, route }) => {
    // Arrangements
    const user: User = await UserFactory.merge({ password: 'password' }).create();

    // Actions
    const response: ApiResponse = await client.delete(route(API_URL_NAME)).loginAs(user);

    // Assertions
    response.assertStatus(204);
  });
});
