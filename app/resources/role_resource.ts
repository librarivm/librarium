import Resource from '#resources/resource';
import { RoleAttributes } from '#services/role_service';
import PermissionResource from '#resources/permission_resource';

export default class RoleResource extends Resource<RoleAttributes> {
  prepare(item: RoleAttributes): RoleAttributes {
    return {
      ...item,
      permissions: PermissionResource.collection(item.permissions).data,
    };
  }

  type(): string {
    return 'roles';
  }
}
