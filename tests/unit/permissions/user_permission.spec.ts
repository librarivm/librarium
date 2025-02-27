import { UserPermission } from '#permissions/user_permission';
import { test } from '@japa/runner';

test.group('Permissions / UserPermission', () => {
  test('it should have users.store permission', async ({ assert }) => {
    assert.equal(UserPermission.CREATE, 'users.create');
  });

  test('it should have users.show permission', async ({ assert }) => {
    assert.equal(UserPermission.READ, 'users.read');
  });

  test('it should have users.update permission', async ({ assert }) => {
    assert.equal(UserPermission.UPDATE, 'users.update');
  });

  test('it should have users.delete permission', async ({ assert }) => {
    assert.equal(UserPermission.DELETE, 'users.delete');
  });

  test('it should have users.index permission', async ({ assert }) => {
    assert.equal(UserPermission.LIST, 'users.list');
  });

  test('it should have users.archive permission', async ({ assert }) => {
    assert.equal(UserPermission.ARCHIVE, 'users.archive');
  });

  test('it should have users.restore permission', async ({ assert }) => {
    assert.equal(UserPermission.RESTORE, 'users.restore');
  });
});
