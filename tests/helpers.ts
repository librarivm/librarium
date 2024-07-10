import { UserFactory } from '#database/factories/user_factory';
import Permission from '#models/permission';
import Role from '#models/role';
import User from '#models/user';
import { SuperadminRole } from '#roles/superadmin_role';
import PermissionService from '#services/permission_service';
import { TestRole } from '#tests/mocks/roles/test_role';

export const resetForAuthenticatedUser = async () => {
  await Role.truncate();
};

export const createAuthenticatedUser = async (role: string = TestRole.CODE) => {
  const user: User =
    role === TestRole.CODE
      ? await UserFactory.with('roles', 1).create()
      : await UserFactory.with('roles', 1, (item) => item.apply(role)).create();

  if (role === TestRole.CODE) {
    const service: PermissionService = new PermissionService();
    await service.install();

    for (let i = 0; i < user.roles.length; i++) {
      const permissions: Permission[] = await Permission.all();
      const r: Role = user.roles[i];
      await r
        .related('permissions')
        .sync(permissions.map((permission: Permission) => permission.id));
    }
  }

  return user;
};

export const createSuperadminUser = async () => {
  return await UserFactory.with('roles', 1, (item) => item.apply(SuperadminRole.CODE)).create();
};

export const createUnauthenticatedUser = async () => {
  return await UserFactory.create();
};
