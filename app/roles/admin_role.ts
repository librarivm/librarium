import { RolePermission } from '#permissions/role_permission';
import { UserPermission } from '#permissions/user_permission';
import { RoleConstants } from '#roles/.role';
import { PermissionPermission } from '#permissions/permission_permission';

export const AdminRole: RoleConstants = {
  NAME: 'Administrator',
  CODE: 'admin',
  DESCRIPTION: 'somebody who has access to all the administration features',
  PERMISSIONS: [
    UserPermission.CREATE,
    UserPermission.READ,
    UserPermission.UPDATE,
    UserPermission.DELETE,
    UserPermission.LIST,
    UserPermission.RESTORE,

    RolePermission.CREATE,
    RolePermission.READ,
    RolePermission.UPDATE,
    RolePermission.DELETE,
    RolePermission.LIST,
    RolePermission.ARCHIVE,
    RolePermission.RESTORE,

    PermissionPermission.ALL,
  ],
} as const;
