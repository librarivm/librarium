import Library from '#models/library';
import LibraryService from '#services/library_service';
import { MockLibrary } from '#tests/mocks/models/mock_library';
import { Service } from '#services/service';
import { test } from '@japa/runner';

test.group('Services / LibraryService', () => {
  test('it extends the Service class', async ({ assert }) => {
    const $service = new LibraryService({ model: MockLibrary });
    assert.isTrue($service instanceof Service, 'LibraryService should extend Service');
  });

  test('it should return a paginated list of libraries', async ({ assert }) => {
    // Arrangements
    const $service = new LibraryService({ model: MockLibrary });
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
});
