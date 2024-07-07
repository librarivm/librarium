import { LibraryFactory } from '#database/factories/library_factory';
import { UserFactory } from '#database/factories/user_factory';
import Library from '#models/library';
import User from '#models/user';
import LibraryService from '#services/library_service';
import { ExtractScopes } from '@adonisjs/lucid/types/model';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'libraries.archive';

test.group(API_URL_NAME, (group) => {
  let $user: User;
  let $service: LibraryService;

  group.each.setup(async () => {
    $user = await UserFactory.create();
    $service = new LibraryService();
  });

  test('it should archive the given library', async ({ client, route, assert }) => {
    // Arrangements
    const library: Library = await LibraryFactory.merge({ userId: $user.id }).with('type').create();

    // Actions
    const response: ApiResponse = await client
      .delete(route(API_URL_NAME, { id: library.id }))
      .loginAs($user);

    const deleted: Library | null = await $service.find(library.id);
    const libraries: any = await $service
      .getModel()
      .query()
      .apply((scope: ExtractScopes<typeof Library>) => scope.softDeleted())
      .where('id', library.id);
    const inDb = libraries.find((item: Library) => item.id === library.id);

    // Assertions
    response.assertStatus(204);
    response.assertBodyNotContains(library.toJSON());
    assert.isNull(deleted);
    assert.exists(inDb);
  });
});
