import { LibraryFactory } from '#database/factories/library_factory';
import { UserFactory } from '#database/factories/user_factory';
import Library from '#models/library';
import User from '#models/user';
import { LibraryAttributes } from '#services/library_service';
import { faker } from '@faker-js/faker';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';
import kebabCase from 'lodash/kebabCase.js';

const API_URL_NAME: string = 'libraries.update';

test.group(`v1.${API_URL_NAME}`, (group) => {
  let $user: User;

  group.each.setup(async () => {
    await Library.truncate();
    $user = await UserFactory.create();
  });

  test('it should update an existing library successfully', async ({ client, route }) => {
    // Arrangements
    const library: Library = await LibraryFactory.merge({ userId: $user.id }).with('type').create();
    const attributes: LibraryAttributes | any = {
      ...library.$attributes,
      name: faker.lorem.words(),
    };

    // Actions
    const response: ApiResponse = await client
      .put(route(API_URL_NAME, { id: library.id }))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(200);
    response.assertBodyContains({
      name: attributes.name,
      slug: kebabCase(attributes.name),
    });
  });

  test('it should return 422 error for incorrect data', async ({ client, route }) => {
    // Arrangements
    const library: Library = await LibraryFactory.merge({ userId: $user.id }).with('type').create();
    const attributes: LibraryAttributes | any = {
      ...library.$attributes,
      name: '',
    };

    // Actions
    const response: ApiResponse = await client
      .put(route(API_URL_NAME, { id: library.id }))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(422);
  });

  test('it should update successfully if library.slug not modified', async ({ client, route }) => {
    // Arrangements
    const library: Library = await LibraryFactory.merge({ userId: $user.id }).with('type').create();

    const attributes: LibraryAttributes = await LibraryFactory.merge({
      userId: $user.id,
      typeId: library.id,
      name: library.name,
      metadata: JSON.stringify({ key: 'updated' }),
    }).make();

    // Actions
    const response: ApiResponse = await client
      .put(route(API_URL_NAME, { id: library.id }))
      .json(attributes)
      .loginAs($user);

    // Assertions
    response.assertStatus(200);
    response.assertBodyContains({
      slug: library.slug,
    });
  });
});
