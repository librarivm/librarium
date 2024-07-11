import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import { HttpQueries } from '#services/service';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'users.show';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $user: User;

  group.setup(async () => {
    await resetForAuthenticatedUser();
    $user = await createSuperadminUser();
  });

  test('it should find and return a user by id', async ({ client, route }) => {
    // Arrangements
    const user: User = await UserFactory.create();

    // Actions
    const response: ApiResponse = await client
      .get(route(API_URL_NAME, { id: user.id }))
      .loginAs($user);

    // Assertions
    response.assertStatus(200);
    response.assertBodyContains({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  });

  test('it should return a 404 status for a user not found', async ({ client, route, assert }) => {
    const response: ApiResponse = await client
      .get(route(API_URL_NAME, { id: 9999 }))
      .loginAs($user);

    response.assertStatus(404);
    assert.isTrue(response.hasError());
  });

  test('it should find and return a user with preloaded relationship by id', async ({
    client,
    route,
    assert,
  }) => {
    const user: User = await UserFactory.with('roles').create();
    const queries: HttpQueries = { with: ['roles'] };

    const response: ApiResponse = await client
      .get(route(API_URL_NAME, { id: user.id }))
      .qs(queries)
      .loginAs($user);

    const data = response.body();

    response.assertStatus(200);
    assert.isTrue(data.hasOwnProperty('roles'));
    assert.isArray(data.roles);
  });
});
