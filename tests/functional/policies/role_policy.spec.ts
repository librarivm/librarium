import { PermissionFactory } from '#database/factories/permission_factory';
import { RoleFactory } from '#database/factories/role_factory';
import Permission from '#models/permission';
import Role from '#models/role';
import User from '#models/user';
import { RolePermission } from '#permissions/role_permission';
import { RoleAttributes } from '#services/role_service';
import {
  createAuthenticatedUser,
  createUnauthenticatedUser,
  resetForAuthenticatedUser,
} from '#tests/helpers';
import { faker } from '@faker-js/faker';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

test.group('Policies / RolePolicy', (group) => {
  let $user: User;
  let $unauthorized: User;

  group.each.setup(async () => {
    await resetForAuthenticatedUser();
    $user = await createAuthenticatedUser([RolePermission]);
    $unauthorized = await createUnauthenticatedUser();
  });

  test(`it should allow to retrieve for users with "${RolePermission.LIST} permission`, async ({
    client,
    route,
  }) => {
    // Actions
    const unauthorized: ApiResponse = await client.get(route('roles.index')).loginAs($unauthorized);
    const authorized: ApiResponse = await client.get(route('roles.index')).loginAs($user);

    // Assertions
    unauthorized.assertStatus(404);
    authorized.assertStatus(200);
  });

  test(`it should allow to store for users with "${RolePermission.CREATE}" permission`, async ({
    client,
    route,
  }) => {
    // Arrangements
    const permissions: Permission[] = await PermissionFactory.createMany(2);
    const role: Role = await RoleFactory.make();
    const attributes: RoleAttributes = {
      ...role.serialize(),
      name: role.name,
      permissions: permissions.map((permission) => permission.id),
    };

    // Actions
    const unauthorized: ApiResponse = await client
      .post(route('roles.store'))
      .json(attributes)
      .loginAs($unauthorized);
    const authorized: ApiResponse = await client
      .post(route('roles.store'))
      .json(attributes)
      .loginAs($user);

    // Assertions
    unauthorized.assertStatus(403);
    authorized.assertStatus(201);
  });

  test(`it should allow to read for users with "${RolePermission.READ}" permission`, async ({
    client,
    route,
  }) => {
    // Arrangements
    const role: Role = await RoleFactory.create();

    // Actions
    const unauthorized: ApiResponse = await client
      .get(route('roles.show', { id: role.id }))
      .loginAs($unauthorized);
    const authorized: ApiResponse = await client
      .get(route('roles.show', { id: role.id }))
      .loginAs($user);

    // Assertions
    unauthorized.assertStatus(404);
    authorized.assertStatus(200);
  });

  test(`it should allow to update for users with "${RolePermission.UPDATE}" permission`, async ({
    client,
    route,
  }) => {
    // Arrangements
    const role: Role = await RoleFactory.with('permissions').create();
    const attributes: RoleAttributes = {
      ...role.serialize(),
      name: role.name,
      description: faker.lorem.sentence(),
      permissions: role.permissions.map((permission: Permission) => permission.id),
    };

    // Actions
    const unauthorized: ApiResponse = await client
      .put(route('roles.update', { id: role.id }))
      .json(attributes)
      .loginAs($unauthorized);

    const authorized: ApiResponse = await client
      .put(route('roles.update', { id: role.id }))
      .json(attributes)
      .loginAs($user);

    // Assertions
    unauthorized.assertStatus(403);
    authorized.assertStatus(200);
  });

  test(`it should allow to archive for users with "${RolePermission.ARCHIVE}" permission`, async ({
    client,
    route,
  }) => {
    // Arrangements
    const role: Role = await RoleFactory.with('permissions').create();

    // Actions
    const unauthorized: ApiResponse = await client
      .delete(route('roles.archive', { id: role.id }))
      .loginAs($unauthorized);

    const authorized: ApiResponse = await client
      .delete(route('roles.archive', { id: role.id }))
      .loginAs($user);

    // Assertions
    unauthorized.assertStatus(403);
    authorized.assertStatus(204);
  });

  test(`it should allow to delete for users with "${RolePermission.DELETE}" permission`, async ({
    client,
    route,
  }) => {
    // Arrangements
    const role: Role = await RoleFactory.with('permissions').create();

    // Actions
    const unauthorized: ApiResponse = await client
      .delete(route('roles.destroy', { id: role.id }))
      .loginAs($unauthorized);

    const authorized: ApiResponse = await client
      .delete(route('roles.destroy', { id: role.id }))
      .loginAs($user);

    // Assertions
    unauthorized.assertStatus(403);
    authorized.assertStatus(204);
  });
});
