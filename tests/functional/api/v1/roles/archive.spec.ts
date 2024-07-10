import { RoleFactory } from '#database/factories/role_factory';
import Permission from '#models/permission';
import Role from '#models/role';
import User from '#models/user';
import RoleService from '#services/role_service';
import { createSuperadminUser } from '#tests/helpers';
import { ExtractScopes } from '@adonisjs/lucid/types/model';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'roles.archive';

test.group(API_URL_NAME, (group) => {
  let $user: User;
  let $service: RoleService;

  group.each.setup(async () => {
    await Role.truncate();
    await Permission.truncate();

    $user = await createSuperadminUser();
    $service = new RoleService();
  });

  test('it should archive the given role', async ({ client, route, assert }) => {
    // Arrangements
    const role: Role = await RoleFactory.create();

    // Actions
    const response: ApiResponse = await client
      .delete(route(API_URL_NAME, { id: role.id }))
      .loginAs($user);

    const deleted: Role | null = await $service.find(role.id);
    const roles: any = await $service
      .getModel()
      .query()
      .apply((scope: ExtractScopes<typeof Role>) => scope.softDeleted())
      .where('id', role.id);
    const inDb = roles.find((item: Role) => item.id === role.id);

    // Assertions
    response.assertStatus(204);
    response.assertBodyNotContains(role.toJSON());
    assert.isNull(deleted);
    assert.exists(inDb);
  });
});
