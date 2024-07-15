import { test } from '@japa/runner';
import { ApiResponse } from '@japa/api-client';
import User from '#models/user';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import Role from '#models/role';
import { RoleFactory } from '#database/factories/role_factory';

const API_URL_NAME: string = 'roles.restore';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $user: User;

  group.each.setup(async () => {
    await resetForAuthenticatedUser();
    $user = await createSuperadminUser();
  });

  test('it should restore a deleted role successfully', async ({ client, route }) => {
    // Arrangements
    const role: Role = await RoleFactory.create();

    // Actions
    const response: ApiResponse = await client
      .patch(route(API_URL_NAME, { id: role.id }))
      .loginAs($user);

    // Assertions
    response.assertStatus(204);
  });
});
