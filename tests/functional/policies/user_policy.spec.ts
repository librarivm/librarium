import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import { UserPermission } from '#permissions/user_permission';
import { UserAttributes } from '#services/user_service';
import {
  createAuthenticatedUser,
  createUnauthenticatedUser,
  resetForAuthenticatedUser,
} from '#tests/helpers';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

test.group('Policies / UserPolicy', (group) => {
  let $user: User;
  let $unauthorized: User;

  group.setup(async () => {
    await resetForAuthenticatedUser();
    $user = await createAuthenticatedUser([UserPermission]);
    $unauthorized = await createUnauthenticatedUser();
  });

  test(`it should allow to retrieve for users with "${UserPermission.LIST} permission`, async ({
    client,
    route,
  }) => {
    // Actions
    const unauthorized: ApiResponse = await client.get(route('users.index')).loginAs($unauthorized);
    const authorized: ApiResponse = await client.get(route('users.index')).loginAs($user);

    // Assertions
    unauthorized.assertStatus(404);
    authorized.assertStatus(200);
  });

  test(`it should allow to store for users with "${UserPermission.CREATE}" permission`, async ({
    client,
    route,
  }) => {
    // Arrangements
    const user: User = await UserFactory.make();
    const attributes: Partial<UserAttributes> = {
      ...user.serialize(),
      password: 'password',
    };

    // Actions
    const unauthorized: ApiResponse = await client
      .post(route('users.store'))
      .json(attributes)
      .loginAs($unauthorized);
    const authorized: ApiResponse = await client
      .post(route('users.store'))
      .json(attributes)
      .loginAs($user);

    // Assertions
    unauthorized.assertStatus(403);
    authorized.assertStatus(201);
  });

  test(`it should allow to read for users with "${UserPermission.READ}" permission`, async ({
    client,
    route,
  }) => {
    // Arrangements
    const user: User = await UserFactory.create();

    // Actions
    const unauthorized: ApiResponse = await client
      .get(route('users.show', { id: user.id }))
      .loginAs($unauthorized);
    const authorized: ApiResponse = await client
      .get(route('users.show', { id: user.id }))
      .loginAs($user);

    // Assertions
    unauthorized.assertStatus(404);
    authorized.assertStatus(200);
  });

  test(`it should allow to update for users with "${UserPermission.UPDATE}" permission`, async ({
    client,
    route,
  }) => {
    // Arrangements
    const user: User = await UserFactory.create();
    const attributes: Partial<UserAttributes> = {
      ...user.serialize(),
      password: user.password,
    };

    // Actions
    const unauthorized: ApiResponse = await client
      .put(route('users.update', { id: user.id }))
      .json(attributes)
      .loginAs($unauthorized);

    const authorized: ApiResponse = await client
      .put(route('users.update', { id: user.id }))
      .json(attributes)
      .loginAs($user);

    // Assertions
    unauthorized.assertStatus(403);
    authorized.assertStatus(200);
  });

  test(`it should allow to archive for users with "${UserPermission.ARCHIVE}" permission`, async ({
    client,
    route,
  }) => {
    // Arrangements
    const user: User = await UserFactory.create();

    // Actions
    const unauthorized: ApiResponse = await client
      .delete(route('users.archive', { id: user.id }))
      .loginAs($unauthorized);

    const authorized: ApiResponse = await client
      .delete(route('users.archive', { id: user.id }))
      .loginAs($user);

    // Assertions
    unauthorized.assertStatus(403);
    authorized.assertStatus(204);
  });

  test(`it should allow to delete for users with "${UserPermission.DELETE}" permission`, async ({
    client,
    route,
  }) => {
    // Arrangements
    const user: User = await UserFactory.create();

    // Actions
    const unauthorized: ApiResponse = await client
      .delete(route('users.destroy', { id: user.id }))
      .loginAs($unauthorized);

    const authorized: ApiResponse = await client
      .delete(route('users.destroy', { id: user.id }))
      .loginAs($user);

    // Assertions
    unauthorized.assertStatus(403);
    authorized.assertStatus(204);
  });
});
