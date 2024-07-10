import { RoleFactory } from '#database/factories/role_factory';
import Role from '#models/role';
import User from '#models/user';
import { HttpQueries } from '#services/service';
import { createSuperadminUser } from '#tests/helpers';
import { faker } from '@faker-js/faker';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';
import sample from 'lodash/sample.js';

const API_URL_NAME: string = 'roles.show';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $roles: Role[] = [];
  let $user: User;

  group.setup(async () => {
    await Role.truncate();

    for (let i = 0; i < 10; i++) {
      const role = await RoleFactory.merge({
        slug: `${faker.lorem.word()}.${i}.${faker.lorem.word()}`,
      })
        .with('users')
        .with('permissions', 1, (permission) => {
          permission.merge({
            code: `${faker.lorem.word()}.${i}.${faker.lorem.word()}`,
          });
        })
        .create();
      $roles.push(role);
    }

    $user = await createSuperadminUser();
  });

  test('it should find and return a role by id', async ({ client, route }) => {
    const role: Role = sample($roles) as Role;
    const response: ApiResponse = await client
      .get(route(API_URL_NAME, { id: role.id }))
      .loginAs($user);

    response.assertStatus(200);
    response.assertBodyContains({
      id: role.id,
      name: role.name,
      slug: role.slug,
    });
  });

  test('it should return a 404 status for a role not found', async ({ client, route, assert }) => {
    const response: ApiResponse = await client
      .get(route(API_URL_NAME, { id: 9999 }))
      .loginAs($user);

    assert.isTrue(response.hasError());
    response.assertStatus(404);
  });

  test('it should find and return a role with preloaded relationship by id', async ({
    client,
    route,
    assert,
  }) => {
    const role: Role = sample($roles) as Role;
    const queries: HttpQueries = {
      with: ['users', 'permissions'],
    };

    const response: ApiResponse = await client
      .get(route(API_URL_NAME, { id: role.id }))
      .qs(queries)
      .loginAs($user);

    const data = response.body();

    response.assertStatus(200);
    assert.isTrue(data.hasOwnProperty('users'));
    assert.isArray(data.users);
    assert.isTrue(data.hasOwnProperty('permissions'));
    assert.isArray(data.permissions);
  });
});
