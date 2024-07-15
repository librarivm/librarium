import { test } from '@japa/runner';
import User from '#models/user';
import {
  createAuthenticatedUser,
  createUnauthenticatedUser,
  resetForAuthenticatedUser,
} from '#tests/helpers';
import { PermissionPermission } from '#permissions/permission_permission';
import { ApiResponse } from '@japa/api-client';

test.group('Policies / PermissionPolicy', (group) => {
  let $user: User;
  let $unauthorized: User;

  group.each.setup(async () => {
    await resetForAuthenticatedUser();
    $user = await createAuthenticatedUser([PermissionPermission]);
    $unauthorized = await createUnauthenticatedUser();
  });

  test(`it should allow to retrieve for users with "${PermissionPermission.ALL} permission`, async ({
    client,
    route,
  }) => {
    // Actions
    const unauthorized: ApiResponse = await client
      .get(route('permissions.all'))
      .loginAs($unauthorized);
    const authorized: ApiResponse = await client.get(route('permissions.all')).loginAs($user);

    // Assertions
    unauthorized.assertStatus(404);
    authorized.assertStatus(200);
  });
});
