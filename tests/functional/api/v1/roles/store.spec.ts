import { PermissionFactory } from '#database/factories/permission_factory';
import { RoleFactory } from '#database/factories/role_factory';
import { UserFactory } from '#database/factories/user_factory';
import Permission from '#models/permission';
import Role from '#models/role';
import User from '#models/user';
import { RoleAttributes } from '#services/role_service';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';
import kebabCase from 'lodash/kebabCase.js';

const API_URL_NAME: string = 'roles.store';

test.group(API_URL_NAME, (group) => {
  let $user: User;
  let $role: Role;
  let $permissions: Permission[];

  group.each.setup(async () => {
    await Permission.truncate();
    await Role.truncate();

    $user = await UserFactory.create();
    $role = await RoleFactory.make();
    $permissions = await PermissionFactory.createMany(3);
  });

  test('it should create a new role entry', async ({ client, route, assert }) => {
    // Arrangements
    const attributes: RoleAttributes = {
      name: $role.name,
      slug: kebabCase($role.name),
      description: $role.description,
      permissions: $permissions.map((permission: Permission) => permission.id),
    };

    // Actions
    const response: ApiResponse = await client
      .post(route(API_URL_NAME))
      .json(attributes)
      .loginAs($user);

    const role: Role | null = await Role.query()
      .preload('permissions')
      .where('id', response.body().id)
      .first();
    const permissions: any = role?.permissions.map((i: Permission) => i.toObject());

    // Assertions
    assert.equal(response.body().id, 1);
    response.assertStatus(201);
    response.assertBodyContains({
      id: 1,
      name: attributes.name,
      slug: attributes.slug,
    });
    assert.isNotEmpty(permissions);
    assert.containsSubset(permissions, [{ code: $permissions?.[0].code }]);
  });

  test('it should return 422 error for incorrect data', async ({ client, route, assert }) => {
    // Arrangements
    const attributes: RoleAttributes = {
      description: $role.description,
      name: $role.name,
      slug: undefined,
      permissions: [],
    };

    // Actions
    const response: ApiResponse = await client
      .post(route(API_URL_NAME))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(422);
    response.assertBodyContains({ errors: [] });
    assert.exists(response.body().errors.find((error: any) => error.rule === 'required'));
    assert.exists(response.body().errors.find((error: any) => error.rule === 'notEmpty'));
  });

  test('it should return 422 if slug already exists', async ({ client, route }) => {
    // Arrangements
    const role: Role = await RoleFactory.create();
    const item: Role = await RoleFactory.merge({
      name: role.name,
    }).make();
    const attributes: RoleAttributes = {
      name: item.name,
      slug: item.slug,
      permissions: $permissions.map((permission: Permission) => permission.id),
    };

    // Actions
    const response: ApiResponse = await client
      .post(route(API_URL_NAME))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(422);
    response.assertBodyContains({
      errors: [{ rule: 'database.unique', field: 'slug' }],
    });
  });
});
