import { test } from '@japa/runner';
import User from '#models/user';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import { ApiResponse } from '@japa/api-client';
import PermissionService from '#services/permission_service';
import Permission from '#models/permission';
import { CollectionResource } from '#collections/resource';

const API_URL_NAME: string = 'permissions.all';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $user: User;
  let $service: PermissionService;

  group.each.setup(async () => {
    $service = new PermissionService();

    await resetForAuthenticatedUser();
    await $service.install();

    $user = await createSuperadminUser();
  });

  test('it should return the full list of permissions', async ({ client, route, assert }) => {
    const response: ApiResponse = await client.get(route(API_URL_NAME)).loginAs($user);
    const collection: Permission[] = await $service.all();
    const data: CollectionResource<Permission> = response.body();

    response.assertStatus(200);
    assert.lengthOf(data.data, collection.length);
    assert.equal(data.meta.total, collection.length);
  });
});
