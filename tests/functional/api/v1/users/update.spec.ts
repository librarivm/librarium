import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import { UserAttributes } from '#services/user_service';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import { faker } from '@faker-js/faker';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'users.update';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $user: User;

  group.setup(async () => {
    await resetForAuthenticatedUser();
    $user = await createSuperadminUser();
  });

  test('it should update an existing user successfully', async ({ client, route }) => {
    // Arrangements
    const user: User = await UserFactory.create();
    const attributes: UserAttributes | any = {
      ...user.serialize(),
      password: 'password',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };

    // Actions
    const response: ApiResponse = await client
      .put(route(API_URL_NAME, { id: user.id }))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(200);
    response.assertBodyContains({
      firstName: attributes.firstName,
      lastName: attributes.lastName,
    });
  });

  test('it should return 422 error for incorrect data', async ({ client, route }) => {
    // Arrangements
    const user: User = await UserFactory.create();
    const attributes: UserAttributes | any = {
      ...user.serialize(),
      email: '',
      password: 'password',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };

    // Actions
    const response: ApiResponse = await client
      .put(route(API_URL_NAME, { id: user.id }))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(422);
  });

  test('it should update successfully if `email`, `username`, or `password` not modified', async ({
    client,
    route,
  }) => {
    // Arrangements
    const user: User = await UserFactory.create();
    const attributes: UserAttributes | any = {
      ...user.serialize(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };

    // Actions
    const response: ApiResponse = await client
      .put(route(API_URL_NAME, { id: user.id }))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(200);
  });
});
