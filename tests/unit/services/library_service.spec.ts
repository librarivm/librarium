// noinspection SuspiciousTypeOfGuard
import { LibraryFactory } from '#database/factories/library_factory';
import Library from '#models/library';
import LibraryService, { LibraryAttributes } from '#services/library_service';
import { Service } from '#services/service';
import SandboxModel from '#tests/mocks/models/sandbox_model';
import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import kebabCase from 'lodash/kebabCase.js';
import sample from 'lodash/sample.js';
import startCase from 'lodash/startCase.js';
import { DateTime } from 'luxon';
import { SinonStub } from 'sinon';

test.group('Services / LibraryService', (group) => {
  let $service: LibraryService;
  let $libraries: Library[];
  let $sandbox: SandboxModel;

  group.each.setup(async () => {
    $libraries = await LibraryFactory.with('user').with('type').makeMany(10);
    $service = new LibraryService();
    $sandbox = new SandboxModel();
  });

  group.each.teardown(() => {
    $libraries = [];
    $sandbox.restore();
  });

  test('it extends the Service class', async ({ assert }) => {
    const service: LibraryService = new LibraryService();
    assert.isTrue(service instanceof Service, 'LibraryService should extend Service');
  });

  test('it should return a paginated list of libraries', async ({ assert }) => {
    // Arrangements
    const pageCount: number = 10;
    $sandbox.stub(Library.query(), 'paginate').resolves($libraries);

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
    const item: Library = sample($libraries) as Library;
    $sandbox.stub(Library, 'find').resolves(item);

    // Actions
    const library: Library | null = await $service.find(item.id);

    // Assertions
    assert.equal(library && library.id, item.id);
    assert.equal(library && library.name, item.name);
  });

  test('it should return null if library is not found by id', async ({ assert }) => {
    // Arrangements
    const itemId = 9999;
    $sandbox.stub(Library, 'find').resolves(null);

    // Actions
    const library: Library | null = await $service.find(itemId);

    // Assertions
    assert.isNull(library);
  });

  test('it should store a library and return the created instance', async ({ assert }) => {
    // Arrangements
    const attributes: LibraryAttributes = {
      name: startCase(faker.lorem.word()),
      description: faker.lorem.words(),
      metadata: { key: faker.lorem.sentence() },
      isPrivate: faker.datatype.boolean(),
      userId: 1,
      typeId: 1,
    };

    const library: Library = {
      ...(await LibraryFactory.merge(attributes as object).make()),
      slug: kebabCase(attributes.name),
      id: $libraries.length + 1,
    };

    const stub: SinonStub<any, any> = $sandbox.stub(Library.prototype, 'save').resolves(library);

    // Actions
    const saved: Library = await $service.store(attributes);

    // Assertions
    assert.equal(saved.id, library.id);
    assert.equal(saved.name, library.name);
    assert.equal(saved.slug, library.slug);
    assert.equal(saved.description, library.description);
    assert.equal(saved.userId, library.userId);
    assert.equal(saved.typeId, library.typeId);
    assert.isTrue(stub.calledOnce);
  });

  test('it should update a library and return the updated instance', async ({ assert }) => {
    // Arrangements
    const attributes: Partial<Library> = {
      name: startCase(faker.lorem.sentence()),
      metadata: { [faker.lorem.word()]: faker.lorem.words() },
    };
    const libraryId: number = $libraries.length + 1;
    const item: Library = sample($libraries) as Library;
    const library: Library & { id: number; save: SinonStub<any, any> } = Object.assign(item, {
      id: libraryId,
      save: $sandbox.getInstance().stub().resolves(item),
    });

    $sandbox.stub(Library, 'find').resolves(library);
    $sandbox.stub(Library.prototype, 'save').resolves(item);

    // Actions
    const updated: Library = await $service.update(libraryId, attributes as LibraryAttributes);

    // Assertions
    assert.equal(updated.name, attributes.name);
    assert.deepEqual(updated.metadata, attributes.metadata);
    assert.isTrue(library.save.calledOnce);
  });

  test('it should archive a library', async ({ assert }) => {
    // Arrangements
    const libraryId: number = $libraries.length;
    const item: Library = sample($libraries) as Library;
    const library: Library & { id: number; save: SinonStub<any, any> } = Object.assign(item, {
      id: libraryId,
      deletedAt: DateTime.local(),
      save: $sandbox.getInstance().stub().resolves(item),
    });

    $sandbox.stub(Library, 'findOrFail').resolves(item);
    $sandbox.stub(Library.prototype, 'save').resolves();

    // Actions
    await $service.archive(library.id);

    // Assertions
    assert.isNotNull(library.deletedAt);
    assert.isTrue(library.save.calledOnce);
  });

  test('it should delete a library permanently', async ({ assert }) => {
    // Arrangements
    const libraryId: number = $libraries.length;
    const item: Library = sample($libraries) as Library;
    const library: Library & { id: number; delete: SinonStub<any, any> } = Object.assign(item, {
      id: libraryId,
      deletedAt: DateTime.local(),
      delete: $sandbox.getInstance().stub().resolves(),
    });

    $sandbox.stub(Library, 'findOrFail').resolves(item);

    // Actions
    await $service.delete(library.id);
    const deleted: Library | null = await $service.find(library.id);

    // Assertions
    assert.isTrue(library.delete.calledOnce);
    assert.isNull(deleted);
  });
});
