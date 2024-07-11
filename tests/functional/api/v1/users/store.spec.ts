import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import { UserAttributes } from '#services/user_service';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'users.store';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $user: User;

  group.each.setup(async () => {
    await resetForAuthenticatedUser();
    $user = await createSuperadminUser();
  });

  test('it should create a new user entry', async ({ client, route, assert }) => {
    // Arrangements
    const user: User = await UserFactory.make();
    const attributes: Partial<UserAttributes> = {
      ...user.serialize(),
      email: user.email.toLowerCase(),
      password: 'password',
    };

    // Actions
    const response: ApiResponse = await client
      .post(route(API_URL_NAME))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(201);
    assert.isNumber(response.body().id);
    response.assertBodyContains({
      email: attributes.email,
      username: attributes.username,
      firstName: attributes.firstName,
    });
  });

  test('it should return 422 error for incorrect data', async ({ client, route }) => {
    // Arrangements
    const user: User = await UserFactory.make();
    const attributes: Partial<UserAttributes> = {
      ...user.serialize(),
      email: '',
      password: 'password',
    };

    // Actions
    const response: ApiResponse = await client
      .post(route(API_URL_NAME))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(422);
    response.assertBodyContains({ errors: [{ rule: 'required', field: 'email' }] });
  });
});
