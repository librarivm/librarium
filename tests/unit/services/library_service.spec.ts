import { test } from '@japa/runner';
import { Service } from '#services/service';
import LibraryService from '#services/library_service';
import { LibraryFactory } from '#database/factories/library_factory';

test.group('Services / LibraryService', (group) => {
  group.each.setup(async () => {
    await LibraryFactory.createMany(20);
  });

  test('it extends the Service class', async ({ assert }) => {
    const service: LibraryService = new LibraryService();
    assert.instanceOf(service, Service);
  });

  test('it should return a paginated list of libraries', async ({ assert }) => {
    // Arrangements
    const service: LibraryService = new LibraryService();
    const pageCount: number = 40;

    // Actions
    service.setPageCount(pageCount);
    const libraries = await service.list();

    // Assertions
    assert.equal(libraries.perPage, pageCount);
    libraries.forEach((library) => {
      assert.isNotEmpty(library.name);
      assert.isTrue(Object.hasOwn(library.toObject(), 'name'));
      assert.isTrue(Object.hasOwn(library.toObject(), 'slug'));
      assert.isTrue(Object.hasOwn(library.toObject(), 'description'));
    });
  });
});
