import Resource from '#resources/resource';
import { UserAttributes } from '#services/user_service';
import RoleResource from '#resources/role_resource';
import omit from 'lodash/omit.js';

export default class UserResource extends Resource<UserAttributes> {
  prepare(item: UserAttributes): UserAttributes {
    const middleInitial: string = item.middleName?.[0] ? `${item.middleName?.[0]}.` : '';
    return {
      id: item.id,
      fullName: [item.firstName, middleInitial, item.lastName]
        .filter((i?: string | null) => i?.length)
        .join(' '),
      ...(omit(item, ['id']) as UserAttributes),
      roles: RoleResource.collection(item.roles).data,
    };
  }

  type(): string {
    return 'users';
  }
}
