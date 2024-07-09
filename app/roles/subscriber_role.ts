import { RoleConstants } from '#roles/.role';

export const SubscriberRole: RoleConstants = {
  NAME: 'Subscriber',
  CODE: 'subscriber',
  DESCRIPTION: 'somebody who can only manage their profile and view resources',
  PERMISSIONS: [],
} as const;
