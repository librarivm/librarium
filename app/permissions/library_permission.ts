import { PermissionConstants } from '#permissions/.permission';

export const LibraryPermission: PermissionConstants = {
  CREATE: 'libraries.create',
  READ: 'libraries.read',
  UPDATE: 'libraries.update',
  DELETE: 'libraries.delete',
  LIST: 'libraries.list',
  ARCHIVE: 'libraries.archive',
} as const;
