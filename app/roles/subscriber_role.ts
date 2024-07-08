import { RoleContract } from '#roles/roles';

export const SubscriberRole: RoleContract = {
  NAME: 'Subscriber',
  CODE: 'subscriber',
  DESCRIPTION: 'somebody who can only manage their profile and view resources',
  PERMISSIONS: [],
} as const;
