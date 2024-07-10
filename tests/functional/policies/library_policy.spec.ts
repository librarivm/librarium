import { LibraryFactory } from '#database/factories/library_factory';
import { TypeFactory } from '#database/factories/type_factory';
import Library from '#models/library';
import Type from '#models/type';
import User from '#models/user';
import { LibraryPermission } from '#permissions/library_permission';
import { LibraryAttributes } from '#services/library_service';
import {
  createAuthenticatedUser,
  createUnauthenticatedUser,
  resetForAuthenticatedUser,
} from '#tests/helpers';
import { faker } from '@faker-js/faker';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';

test.group('Policies / LibraryPolicy', (group) => {
  let $user: User;
  let $unauthorized: User;

  group.setup(async () => {
    await resetForAuthenticatedUser();
    $user = await createAuthenticatedUser();
    $unauthorized = await createUnauthenticatedUser();
  });

  test(`it should allow to retrieve for users with "${LibraryPermission.LIST}" permission`, async ({
    client,
    route,
  }) => {
    // Actions
    const unauthorized: ApiResponse = await client
      .get(route('libraries.index'))
      .loginAs($unauthorized);
    const authorized: ApiResponse = await client.get(route('libraries.index')).loginAs($user);

    // Assertions
    unauthorized.assertStatus(404);
    authorized.assertStatus(200);
  });

  test(`it should allow to store for users with "${LibraryPermission.CREATE}" permission`, async ({
    client,
    route,
  }) => {
    // Arrangements
    const type: Type = await TypeFactory.create();
    const library: Library = await LibraryFactory.make();
    const attributes: LibraryAttributes = {
      ...library.serialize(),
      isPrivate: library.isPrivate,
      typeId: type.id,
      userId: $user.id,
      name: library.name,
    };

    // Actions
    const unauthorized: ApiResponse = await client
      .post(route('libraries.store'))
      .json(attributes)
      .loginAs($unauthorized);
    const authorized: ApiResponse = await client
      .post(route('libraries.store'))
      .json(attributes)
      .loginAs($user);

    // Assertions
    unauthorized.assertStatus(403);
    authorized.assertStatus(201);
  });

  test(`it should allow to read for users with "${LibraryPermission.READ}" permission`, async ({
    client,
    route,
  }) => {
    // Arrangements
    const library: Library = await LibraryFactory.merge({ userId: $user.id }).with('type').create();

    // Actions
    const unauthorized: ApiResponse = await client
      .get(route('libraries.show', { id: library.id }))
      .loginAs($unauthorized);
    const authorized: ApiResponse = await client
      .get(route('libraries.show', { id: library.id }))
      .loginAs($user);

    // Assertions
    unauthorized.assertStatus(404);
    authorized.assertStatus(200);
  });

  test(`it should allow to update for users with "${LibraryPermission.UPDATE}" permission`, async ({
    client,
    route,
  }) => {
    // Arrangements
    const library: Library = await LibraryFactory.merge({ userId: $user.id }).with('type').create();
    const attributes: LibraryAttributes = {
      ...library.serialize(),
      isPrivate: library.isPrivate,
      typeId: library.typeId,
      userId: $user.id,
      name: library.name,
      description: faker.lorem.sentence(),
    };

    // Actions
    const unauthorized: ApiResponse = await client
      .put(route('libraries.update', { id: library.id }))
      .json(attributes)
      .loginAs($unauthorized);

    const authorized: ApiResponse = await client
      .put(route('libraries.update', { id: library.id }))
      .json(attributes)
      .loginAs($user);

    // Assertions
    unauthorized.assertStatus(403);
    authorized.assertStatus(200);
  });
});
