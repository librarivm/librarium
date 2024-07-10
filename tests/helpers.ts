import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import { SuperadminRole } from '#roles/superadmin_role';

export const createAuthenticatedUser = async (role: string = SuperadminRole.CODE) => {
  const user: User = await UserFactory.with('roles', 1, (item) => item.apply(role)).create();

  return user;
};

export const createUnauthenticatedUser = async () => {
  const user: User = await UserFactory.create();

  return user;
};
