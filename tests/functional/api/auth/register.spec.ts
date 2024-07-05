import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import { UserCredentialsAttributes } from '#services/user_service';
import { faker } from '@faker-js/faker';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'auth.register';

test.group(API_URL_NAME, (group) => {
  group.each.setup(async () => {
    await User.truncate();
  });

  test('it should register a new user successfully', async ({ assert, client, route }) => {
    // Arrangements
    const user: User = await UserFactory.make();
    const credentials: UserCredentialsAttributes & { password_confirmation: string } = {
      email: user.email,
      password: 'password',
      password_confirmation: 'password',
    };

    // Actions
    const response: ApiResponse = await client.post(route(API_URL_NAME)).json(credentials);
    const { user: registered, token } = response.body();

    // Assertions
    response.assertStatus(201);
    assert.equal(registered.email, credentials.email.toLowerCase());
    assert.equal(registered.username, credentials.email.toLowerCase());
    assert.exists(token.token);
  });

  test('it should throw 422 error when password mismatched', async ({ assert, client, route }) => {
    // Arrangements
    const user: User = await UserFactory.make();
    const credentials: UserCredentialsAttributes & { password_confirmation: string } = {
      email: user.email,
      password: 'password',
      password_confirmation: 'mismatched',
    };

    // Actions
    const response: ApiResponse = await client.post(route(API_URL_NAME)).json(credentials);
    const { errors } = response.body();

    // Assertions
    response.assertStatus(422);
    assert.exists(errors.find((error: any): boolean => error.rule === 'confirmed'));
  });

  test('it should throw error when email already exists', async ({ assert, client, route }) => {
    // Arrangements
    const user: User = await UserFactory.merge({
      email: faker.internet.email().toLowerCase(),
    }).create();

    const credentials: UserCredentialsAttributes & { password_confirmation: string } = {
      password: 'password',
      password_confirmation: 'password',
      email: user.email,
    };

    // Actions
    const response: ApiResponse = await client.post(route(API_URL_NAME)).json(credentials);
    const { errors } = response.body();

    // Assertions
    response.assertStatus(422);
    assert.exists(errors.find((error: any): boolean => error.rule === 'database.unique'));
  });
});
