import { PermissionConstants } from '#permissions/.permission';

export const RolePermission: PermissionConstants = {
  CREATE: 'roles.create',
  READ: 'roles.read',
  UPDATE: 'roles.update',
  DELETE: 'roles.delete',
  LIST: 'roles.list',
  ARCHIVE: 'roles.archive',
  RESTORE: 'roles.restore',
} as const;
