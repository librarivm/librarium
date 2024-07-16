import { LibraryPermission } from '#permissions/library_permission';
import { test } from '@japa/runner';

test.group('Permissions / LibraryPermission', () => {
  test('it should have libraries.store permission', async ({ assert }) => {
    assert.equal(LibraryPermission.CREATE, 'libraries.create');
  });

  test('it should have libraries.show permission', async ({ assert }) => {
    assert.equal(LibraryPermission.READ, 'libraries.read');
  });

  test('it should have libraries.update permission', async ({ assert }) => {
    assert.equal(LibraryPermission.UPDATE, 'libraries.update');
  });

  test('it should have libraries.delete permission', async ({ assert }) => {
    assert.equal(LibraryPermission.DELETE, 'libraries.delete');
  });

  test('it should have libraries.index permission', async ({ assert }) => {
    assert.equal(LibraryPermission.LIST, 'libraries.list');
  });

  test('it should have libraries.archive permission', async ({ assert }) => {
    assert.equal(LibraryPermission.ARCHIVE, 'libraries.archive');
  });

  test('it should have libraries.restore permission', async ({ assert }) => {
    assert.equal(LibraryPermission.RESTORE, 'libraries.restore');
  });
});
