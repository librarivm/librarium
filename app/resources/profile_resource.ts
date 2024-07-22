import Resource from '#resources/resource';
import RoleResource from '#resources/role_resource';
import { UserAttributes } from '#services/user_service';
import { RoleAttributes } from '#services/role_service';

export type ProfileJsonAttributes = UserAttributes & {
  roles: RoleAttributes[];
};

export default class ProfileResource extends Resource<ProfileJsonAttributes> {
  prepare(item: ProfileJsonAttributes): ProfileJsonAttributes {
    return Object.assign({
      ...item,
      roles: RoleResource.collection(item.roles).data,
    });
  }

  type(): string {
    return 'profile';
  }
}
