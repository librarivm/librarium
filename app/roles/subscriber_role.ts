import { RoleConstants } from '#roles/.role';
import { LibraryPermission } from '#permissions/library_permission';

export const SubscriberRole: RoleConstants = {
  NAME: 'Subscriber',
  CODE: 'subscriber',
  DESCRIPTION: 'somebody who can only manage their profile and view resources',
  PERMISSIONS: [LibraryPermission.READ, LibraryPermission.LIST],
} as const;
