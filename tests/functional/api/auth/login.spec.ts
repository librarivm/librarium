import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import { CredentialsAttributes } from '#services/user_service';
import { faker } from '@faker-js/faker';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'auth.login';

test.group(API_URL_NAME, (group) => {
  group.each.setup(async () => {
    await User.truncate();
  });

  test('it should login an existing user successfully', async ({ client, route, assert }) => {
    // Arrangements
    const credentials: CredentialsAttributes = {
      email: faker.internet.email().toLowerCase(),
      password: 'password',
    };
    const user: User = await UserFactory.merge(credentials).create();

    // Actions
    const response: ApiResponse = await client.post(route(API_URL_NAME)).json(credentials);
    const data = response.body();
    console.log(12, data);

    // Assertions
    response.assertStatus(200);
    assert.isNotNull(data.token);
    response.assertBodyContains({
      user: { email: user.email },
      token: {},
    });
  });

  test('it should throw an error for unknown user', async ({ client, route }) => {
    // Arrangements
    const credentials: CredentialsAttributes = {
      email: faker.internet.email().toLowerCase(),
      password: 'password',
    };

    await UserFactory.merge({
      ...credentials,
      email: `modified.${faker.internet.email().toLowerCase()}`,
    }).create();

    // Actions
    const response: ApiResponse = await client.post(route(API_URL_NAME)).json(credentials);

    // Assertions
    response.assertStatus(401);
  });
});
