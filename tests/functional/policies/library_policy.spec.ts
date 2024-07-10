import User from '#models/user';
import { LibraryPermission } from '#permissions/library_permission';
import { createAuthenticatedUser, createUnauthenticatedUser } from '#tests/helpers';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

test.group('Policies / LibraryPolicy', (group) => {
  let $user: User;
  let $unauthorized: User;

  group.each.setup(async () => {
    $user = await createAuthenticatedUser();
    $unauthorized = await createUnauthenticatedUser();
  });

  test(`it should allow to retrieve for users with "${LibraryPermission.LIST} permission`, async ({
    client,
    route,
  }) => {
    // Actions
    const unauthorized: ApiResponse = await client
      .get(route('libraries.index'))
      .loginAs($unauthorized);
    const authorized: ApiResponse = await client.get(route('libraries.index')).loginAs($user);

    // Assertions
    unauthorized.assertStatus(404);
    authorized.assertStatus(200);
  });
});
