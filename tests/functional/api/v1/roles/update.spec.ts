import { PermissionFactory } from '#database/factories/permission_factory';
import { RoleFactory } from '#database/factories/role_factory';
import { UserFactory } from '#database/factories/user_factory';
import Permission from '#models/permission';
import Role from '#models/role';
import User from '#models/user';
import { SuperadminRole } from '#roles/superadmin_role';
import { RoleAttributes } from '#services/role_service';
import { faker } from '@faker-js/faker';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';
import kebabCase from 'lodash/kebabCase.js';

const API_URL_NAME: string = 'roles.update';

test.group(API_URL_NAME, (group) => {
  let $user: User;
  let $permissions: Permission[];

  group.each.setup(async () => {
    await Permission.truncate();
    await Role.truncate();

    $user = await UserFactory.with('roles', 1, (role) => role.apply(SuperadminRole.CODE)).create();
    $permissions = await PermissionFactory.createMany(3);
  });

  test('it should update an existing role successfully', async ({ client, route }) => {
    // Arrangements
    const role: Role = await RoleFactory.create();
    const name: string = faker.lorem.words();
    const attributes: RoleAttributes | any = {
      ...role.serialize(),
      name: name,
      slug: kebabCase(name),
      permissions: $permissions.map((permission: Permission) => permission.id),
    };

    // Actions
    const response: ApiResponse = await client
      .put(route(API_URL_NAME, { id: role.id }))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(200);
    response.assertBodyContains({
      name: attributes.name,
      slug: kebabCase(attributes.name),
    });
  });

  test('it should return 422 error for incorrect data', async ({ client, route }) => {
    // Arrangements
    const role: Role = await RoleFactory.create();
    const name: string = faker.lorem.words();
    const attributes: RoleAttributes | any = {
      ...role.$attributes,
      name: faker.lorem.words(),
      slug: kebabCase(name),
      permissions: [],
    };

    // Actions
    const response: ApiResponse = await client
      .put(route(API_URL_NAME, { id: role.id }))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(422);
  });

  test('it should update successfully if role.slug not modified', async ({ client, route }) => {
    // Arrangements
    const role: Role = await RoleFactory.create();
    const attributes: RoleAttributes | any = {
      name: role.name,
      slug: role.slug,
      description: faker.lorem.sentences(),
      permissions: $permissions.map((permission: Permission) => permission.id),
    };

    // Actions
    const response: ApiResponse = await client
      .put(route(API_URL_NAME, { id: role.id }))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(200);
    response.assertBodyContains({
      slug: role.slug,
    });
  });
});
