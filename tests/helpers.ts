import { UserFactory } from '#database/factories/user_factory';
import { SuperadminRole } from '#roles/superadmin_role';

export const createAuthenticatedUser = async (role: string = SuperadminRole.CODE) => {
  return await UserFactory.with('roles', 1, (item) => item.apply(role)).create();
};

export const createUnauthenticatedUser = async () => {
  return await UserFactory.create();
};
