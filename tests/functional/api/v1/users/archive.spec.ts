import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import UserService from '#services/user_service';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import { ExtractScopes } from '@adonisjs/lucid/types/model';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'users.archive';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $user: User;
  let $service: UserService;

  group.each.setup(async () => {
    await resetForAuthenticatedUser();
    $user = await createSuperadminUser();
    $service = new UserService();
  });

  test('it should archive the given user', async ({ client, route, assert }) => {
    // Arrangements
    const user: User = await UserFactory.create();

    // Actions
    const response: ApiResponse = await client
      .delete(route(API_URL_NAME, { id: user.id }))
      .loginAs($user);

    const deleted: User | null = await $service.find(user.id);
    const users: any = await $service
      .getModel()
      .query()
      .apply((scope: ExtractScopes<typeof User>) => scope.softDeleted())
      .where('id', user.id);
    const inDb = users.find((item: User) => item.id === user.id);

    // Assertions
    response.assertStatus(204);
    response.assertBodyNotContains(user.toJSON());
    assert.isNull(deleted);
    assert.exists(inDb);
  });
});
