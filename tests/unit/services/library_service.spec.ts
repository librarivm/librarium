// noinspection SuspiciousTypeOfGuard

import Library from '#models/library';
import LibraryService, { LibraryAttributes } from '#services/library_service';
import { MockLibrary } from '#tests/mocks/models/mock_library';
import { Service } from '#services/service';
import { test } from '@japa/runner';
import { faker } from '@faker-js/faker';
import startCase from 'lodash/startCase.js';
import kebabCase from 'lodash/kebabCase.js';
import { LibraryFactory } from '#database/factories/library_factory';

test.group('Services / LibraryService', (group) => {
  group.each.teardown(() => {
    MockLibrary.find.resetHistory();
    MockLibrary.save.resetHistory();
  });

  test('it extends the Service class', async ({ assert }) => {
    const $service: LibraryService = new LibraryService();
    assert.isTrue($service instanceof Service, 'LibraryService should extend Service');
  });

  test('it should return a paginated list of libraries', async ({ assert }) => {
    // Arrangements
    const $service: LibraryService = new LibraryService({ model: MockLibrary });
    const pageCount: number = 10;

    // Actions
    $service.setPageCount(pageCount);
    const libraries = await $service.list();

    // Assertions
    assert.equal(libraries.perPage, pageCount);
    libraries.forEach((library: Library) => {
      assert.isNotEmpty(library.name);
      assert.isTrue(Object.hasOwn(library.toObject(), 'name'));
      assert.isTrue(Object.hasOwn(library.toObject(), 'slug'));
      assert.isTrue(Object.hasOwn(library.toObject(), 'description'));
    });
  });

  test('it should find a library by id', async ({ assert }) => {
    // Arrangements
    const $service: LibraryService = new LibraryService({ model: MockLibrary });
    const item = MockLibrary.first();

    // Actions
    const library = await $service.find(item.id);

    // Assertions
    assert.equal(library && library.id, item.id);
    assert.equal(library && library.name, item.name);
  });

  test('it should return null if library is not found by id', async ({ assert }) => {
    // Arrangements
    const $service: LibraryService = new LibraryService({ model: MockLibrary });
    const itemId = 9999;

    // Actions
    const library: Library | null = await $service.find(itemId);

    // Assertions
    assert.isNull(library);
  });

  test('it should store a library and return the created instance', async ({ assert }) => {
    // Arrangements
    const $service: LibraryService = new LibraryService({ model: MockLibrary });
    const attributes: LibraryAttributes = MockLibrary.mockAttributes({
      name: startCase(faker.lorem.sentence()),
      description: faker.lorem.sentences(),
      metadata: null,
      is_private: faker.datatype.boolean(),
      userId: 1,
      typeId: 1,
    }) as LibraryAttributes;

    // Actions
    const library = await $service.store(attributes);
    const item = {
      ...attributes,
      id: MockLibrary.count() + 1,
      slug: kebabCase(attributes.name),
    };

    // Assertions
    assert.isTrue(MockLibrary.save.calledOnce);
    assert.equal(item.id, library.id);
    assert.equal(item.name, library.name);
    assert.equal(item.slug, library.slug);
    assert.equal(item.description, library.description);
    assert.equal(item.userId, library.userId);
    assert.equal(item.typeId, library.typeId);
  });

  test('it should update a library and return the updated instance', async ({ assert }) => {
    // Arrangements
    const $service: LibraryService = new LibraryService({ model: MockLibrary });
    const item = MockLibrary.first();
    const attributes: LibraryAttributes = MockLibrary.mockAttributes({
      ...item,
      name: startCase(faker.lorem.sentence()),
      metadata: { [faker.lorem.word()]: faker.lorem.words() },
    }) as LibraryAttributes;

    // Actions
    const library = await $service.update(item.id, attributes);

    // Assertions
    assert.isObject(library);
    assert.isTrue(MockLibrary.save.calledOnce);
    assert.equal(attributes.name, library.name);
    assert.equal(attributes.metadata, library.metadata);
  });

  test('it should archive a library', async ({ assert }) => {
    // Arrangements
    const $service: LibraryService = new LibraryService({ model: MockLibrary });
    const item = MockLibrary.mockAttributes({
      ...MockLibrary.first(),
    }) as Library;

    // Actions
    await $service.archive(item.id);
    const library = MockLibrary.find(item.id);

    // Assertions
    assert.isTrue(MockLibrary.save.calledOnce);
    assert.equal(library?.id, item.id);
    assert.isNotNull(library.deletedAt);
  });

  test('it should delete a library permanently', async ({ assert }) => {
    // Arrangements
    const $service: LibraryService = new LibraryService({ model: MockLibrary });
    const item = await LibraryFactory.make();
    const library = MockLibrary.create(item.toJSON());

    // Actions
    await $service.delete(library.id);
    const deleted = await $service.find(library.id);

    // Assertions
    assert.isTrue(MockLibrary.delete.calledOnce);
    assert.isNull(deleted);
  });
});
