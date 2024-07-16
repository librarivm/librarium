import { test } from '@japa/runner';
import { UserPermission } from '#permissions/user_permission';
import { RolePermission } from '#permissions/role_permission';
import { AdminRole } from '#roles/admin_role';
import { PermissionPermission } from '#permissions/permission_permission';

test.group('Roles / AdminRole', () => {
  test('it should have `admin` code', async ({ assert }) => {
    assert.equal(AdminRole.CODE, 'admin');
  });

  test('it should have permissions', async ({ assert }) => {
    const permissions: string[] = [
      UserPermission.CREATE,
      UserPermission.READ,
      UserPermission.UPDATE,
      UserPermission.DELETE,
      UserPermission.LIST,
      UserPermission.RESTORE as string,

      RolePermission.CREATE,
      RolePermission.READ,
      RolePermission.UPDATE,
      RolePermission.DELETE,
      RolePermission.LIST,
      RolePermission.ARCHIVE as string,
      RolePermission.RESTORE as string,

      PermissionPermission.ALL,
    ];

    assert.deepEqual(AdminRole.PERMISSIONS, permissions);
  });
});
