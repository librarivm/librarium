import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import { UserAttributes } from '#services/user_service';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import hash from '@adonisjs/core/services/hash';
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

  test('it should store password as hashed', async ({ client, route, assert }) => {
    // Arrangements
    const item: User = await UserFactory.make();
    const attributes: Partial<UserAttributes> = {
      ...item.serialize(),
      password: 'password',
    };

    // Actions
    const response: ApiResponse = await client
      .post(route(API_URL_NAME))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(201);

    const user: User = await User.findByOrFail('email', item.email);
    assert.isTrue(await hash.verify(user.password, 'password'), 'Password is not hashed correctly');
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

  test('it should return 422 if email already exists', async ({ client, route }) => {
    // Arrangements
    const user: User = await UserFactory.create();
    const item: User = await UserFactory.merge({
      email: user.email,
    }).make();
    const attributes: Partial<UserAttributes> = {
      ...item.serialize(),
      email: user.email,
      password: 'password',
    };

    // Actions
    const response: ApiResponse = await client
      .post(route(API_URL_NAME))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(422);
    response.assertBodyContains({
      errors: [{ rule: 'database.unique', field: 'email' }],
    });
  });

  test('it should return 422 if username already exists', async ({ client, route }) => {
    // Arrangements
    const user: User = await UserFactory.create();
    const item: User = await UserFactory.merge({
      username: user.username,
    }).make();
    const attributes: Partial<UserAttributes> = {
      ...item.serialize(),
      username: user.username,
      password: 'password',
    };

    // Actions
    const response: ApiResponse = await client
      .post(route(API_URL_NAME))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(422);
    response.assertBodyContains({
      errors: [{ rule: 'database.unique', field: 'username' }],
    });
  });
});
