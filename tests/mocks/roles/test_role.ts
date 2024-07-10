import { LibraryPermission } from '#permissions/library_permission';
import { RolePermission } from '#permissions/role_permission';
import { UserPermission } from '#permissions/user_permission';
import { RoleConstants } from '#roles/.role';

export const TestRole: RoleConstants = {
  NAME: 'Tester',
  CODE: 'tester',
  DESCRIPTION: 'Test account should implement all permissions explicitly',
  PERMISSIONS: [
    UserPermission.CREATE,
    UserPermission.READ,
    UserPermission.UPDATE,
    UserPermission.DELETE,
    UserPermission.LIST,

    RolePermission.CREATE,
    RolePermission.READ,
    RolePermission.UPDATE,
    RolePermission.DELETE,
    RolePermission.LIST,
    RolePermission.ARCHIVE,

    LibraryPermission.CREATE,
    LibraryPermission.READ,
    LibraryPermission.UPDATE,
    LibraryPermission.DELETE,
    LibraryPermission.LIST,
    LibraryPermission.ARCHIVE,
  ],
} as const;
