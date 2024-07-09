import { RoleConstants } from '#roles/.role';

export const SuperadminRole: RoleConstants = {
  NAME: 'Super Administrator',
  CODE: 'superadmin',
  DESCRIPTION: 'somebody with full access to all application features without restrictions',
  PERMISSIONS: '*',
} as const;
