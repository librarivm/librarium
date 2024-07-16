import { RolePermission } from '#permissions/role_permission';
import { test } from '@japa/runner';

test.group('Permissions / RolePermission', () => {
  test('it should have roles.store permission', async ({ assert }) => {
    assert.equal(RolePermission.CREATE, 'roles.create');
  });

  test('it should have roles.show permission', async ({ assert }) => {
    assert.equal(RolePermission.READ, 'roles.read');
  });

  test('it should have roles.update permission', async ({ assert }) => {
    assert.equal(RolePermission.UPDATE, 'roles.update');
  });

  test('it should have roles.delete permission', async ({ assert }) => {
    assert.equal(RolePermission.DELETE, 'roles.delete');
  });

  test('it should have roles.index permission', async ({ assert }) => {
    assert.equal(RolePermission.LIST, 'roles.list');
  });

  test('it should have roles.archive permission', async ({ assert }) => {
    assert.equal(RolePermission.ARCHIVE, 'roles.archive');
  });

  test('it should have roles.restore permission', async ({ assert }) => {
    assert.equal(RolePermission.RESTORE, 'roles.restore');
  });
});
