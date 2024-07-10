import { LibraryFactory } from '#database/factories/library_factory';
import { TypeFactory } from '#database/factories/type_factory';
import { UserFactory } from '#database/factories/user_factory';
import Library from '#models/library';
import Type from '#models/type';
import User from '#models/user';
import { LibraryAttributes } from '#services/library_service';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

const API_URL_NAME: string = 'libraries.store';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $user: User;

  group.setup(async () => {
    await resetForAuthenticatedUser();
    $user = await createSuperadminUser();
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
    const response: ApiResponse = await client
      .post(route(API_URL_NAME))
      .json(attributes.toJSON())
      .loginAs($user);

    // Assertions
    assert.equal(response.body().id, 1);
    response.assertStatus(201);
    response.assertBodyContains({
      id: 1,
      name: attributes.name,
      slug: attributes.slug,
    });
  });

  test('it should return 422 error for incorrect data', async ({ client, route, assert }) => {
    // Arrangements
    const type: Type = await TypeFactory.create();
    const attributes: Library = await LibraryFactory.merge({
      userId: $user.id,
      typeId: type.id,
      name: '',
    }).make();

    // Actions
    const response: ApiResponse = await client
      .post(route(API_URL_NAME))
      .json(attributes.toJSON())
      .loginAs($user);

    // Assertions
    response.assertStatus(422);
    response.assertBodyContains({ errors: [] });
    assert.exists(response.body().errors.find((error: any) => error.rule === 'required'));
  });

  test('it should return 422 if slug already exists', async ({ client, route }) => {
    // Arrangements
    const type: Type = await TypeFactory.create();
    const library: Library = await LibraryFactory.merge({
      userId: $user.id,
      typeId: type.id,
    }).create();

    const attributes: LibraryAttributes = await LibraryFactory.merge({
      userId: $user.id,
      typeId: type.id,
      name: library.name,
    }).make();

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
