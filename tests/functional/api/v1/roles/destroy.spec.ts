import { RoleFactory } from '#database/factories/role_factory';
import Permission from '#models/permission';
import Role from '#models/role';
import User from '#models/user';
import { createSuperadminUser } from '#tests/helpers';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'roles.destroy';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $user: User;

  group.each.setup(async () => {
    await Role.truncate();
    await Permission.truncate();

    $user = await createSuperadminUser();
  });

  test('it should permanently delete a role successfully', async ({ client, route, assert }) => {
    // Arrangements
    const role: Role = await RoleFactory.create();

    // Actions
    const response: ApiResponse = await client
      .delete(route(API_URL_NAME, { id: role.id }))
      .loginAs($user);

    // Assertions
    response.assertStatus(204);
    assert.isEmpty(response.body());
  });
});
