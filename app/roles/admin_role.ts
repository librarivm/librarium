import { UserPermission } from '#permissions/user_permission';
import { RoleContract } from './roles.js';

export const AdminRole: RoleContract = {
  NAME: 'Administrator',
  CODE: 'admin',
  DESCRIPTION: 'somebody who has access to all the administration features',
  PERMISSIONS: [
    UserPermission.CREATE,
    UserPermission.READ,
    UserPermission.UPDATE,
    UserPermission.DELETE,
    UserPermission.LIST,
  ],
} as const;
