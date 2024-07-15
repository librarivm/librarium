import type { PermissionConstants } from '#permissions/.permission';

export const UserPermission: PermissionConstants = {
  CREATE: 'users.create',
  READ: 'users.read',
  UPDATE: 'users.update',
  DELETE: 'users.delete',
  LIST: 'users.list',
  ARCHIVE: 'users.archive',
  RESTORE: 'users.restore',
} as const;
