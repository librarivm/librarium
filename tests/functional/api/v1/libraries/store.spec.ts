import { LibraryFactory } from '#database/factories/library_factory';
import { TypeFactory } from '#database/factories/type_factory';
import { UserFactory } from '#database/factories/user_factory';
import Library from '#models/library';
import Type from '#models/type';
import User from '#models/user';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'libraries.store';

test.group(API_URL_NAME, (group) => {
  group.setup(async () => {
    await Library.truncate();
  });

  test('it should create a new library entry', async ({ client, route, assert }) => {
    // Arrangements
    const user: User = await UserFactory.create();
    const type: Type = await TypeFactory.create();
    const attributes: Library = await LibraryFactory.merge({
      userId: user.id,
      typeId: type.id,
    }).make();

    // Actions
    const response: ApiResponse = await client.post(route(API_URL_NAME)).json(attributes.toJSON());

    // Assertions
    assert.equal(response.body().id, 1);
    response.assertStatus(201);
    response.assertBodyContains({
      id: 1,
      name: attributes.name,
      slug: attributes.slug,
    });
  });
});
