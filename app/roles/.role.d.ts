import type { PermissionConstants } from '#permissions/.permission';

export type RoleConstants = {
  NAME: string;
  CODE: string;
  DESCRIPTION: string;
  PERMISSIONS: PermissionConstants[] | string[] | '*';
};
