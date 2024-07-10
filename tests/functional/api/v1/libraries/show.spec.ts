import { LibraryFactory } from '#database/factories/library_factory';
import Library from '#models/library';
import User from '#models/user';
import { HttpQueries } from '#services/service';
import { createSuperadminUser, resetForAuthenticatedUser } from '#tests/helpers';
import { ApiResponse } from '@japa/api-client';
import { test } from '@japa/runner';
import sample from 'lodash/sample.js';

const API_URL_NAME: string = 'libraries.show';

test.group(API_URL_NAME, (group) => {
  let $libraries: Library[] = [];
  let $user: User;

  group.setup(async () => {
    await Library.truncate();
    $libraries = await LibraryFactory.with('user').with('type').createMany(10);
    await resetForAuthenticatedUser();
    $user = await createSuperadminUser();
  });

  test('it should find and return a library by id', async ({ client, route }) => {
    const library: Library = sample($libraries) as Library;
    const response: ApiResponse = await client
      .get(route(API_URL_NAME, { id: library.id }))
      .loginAs($user);

    response.assertStatus(200);
    response.assertBodyContains({
      id: library.id,
      name: library.name,
      slug: library.slug,
    });
  });

  test('it should return a 404 status for a library not found', async ({
    client,
    route,
    assert,
  }) => {
    const response: ApiResponse = await client
      .get(route(API_URL_NAME, { id: 9999 }))
      .loginAs($user);

    assert.isTrue(response.hasError());
    response.assertStatus(404);
  });

  test('it should find and return a library with preloaded relationship by id', async ({
    client,
    route,
    assert,
  }) => {
    const library: Library = sample($libraries) as Library;
    const queries: HttpQueries = {
      with: ['user', 'type'],
    };

    const response: ApiResponse = await client
      .get(route(API_URL_NAME, { id: library.id }))
      .qs(queries)
      .loginAs($user);

    const { user, type } = response.body();

    response.assertStatus(200);
    response.assertBodyContains({
      id: library.id,
      user: {},
      type: {},
    });
    assert.isObject(user);
    assert.isObject(type);
    assert.isString(user.firstName);
    assert.isString(type.name);
  });
});
