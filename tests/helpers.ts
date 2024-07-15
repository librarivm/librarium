import { UserFactory } from '#database/factories/user_factory';
import Permission from '#models/permission';
import Role from '#models/role';
import User from '#models/user';
import { CustomPermissionConstants, PermissionConstants } from '#permissions/.permission';
import { SuperadminRole } from '#roles/superadmin_role';
import PermissionService from '#services/permission_service';

export const resetForAuthenticatedUser = async () => {
  await Role.truncate();
  await Permission.truncate();
};

export const createAuthenticatedUser = async (
  permissions: PermissionConstants[] | CustomPermissionConstants[]
) => {
  const user: User = await UserFactory.with('roles', 1).create();

  const service: PermissionService = new PermissionService();
  await service.install();

  for (let i = 0; i < user.roles.length; i++) {
    for (const permission of permissions) {
      const p: Permission[] = await Permission.query()
        .select('id')
        .whereIn('code', Object.values(permission));
      const r: Role = user.roles[i];
      await r.related('permissions').sync(p.map((item: Permission) => item.id));
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
