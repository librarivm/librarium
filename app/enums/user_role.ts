export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  SUBSCRIBER = 'subscriber',
}

export enum UserRoleDescription {
  SUPERADMIN = 'somebody with full access to all application features without restrictions',
  ADMIN = 'somebody who has access to all the administration features',
  SUBSCRIBER = 'somebody who can only manage their profile and view resources',
}
