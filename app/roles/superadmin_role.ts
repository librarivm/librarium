import { RoleContract } from './roles.js';

export const SuperadminRole: RoleContract = {
  NAME: 'Super Administrator',
  CODE: 'superadmin',
  DESCRIPTION: 'somebody with full access to all application features without restrictions',
  PERMISSIONS: '*',
} as const;
