import Resource from '#collections/resource';
import { UserAttributes } from '#services/user_service';

export default class UserResource extends Resource<UserAttributes> {
  prepare(item: UserAttributes): UserAttributes {
    return {
      fullName: `${item.firstName} ${item.lastName}`,
      ...item,
    };
  }

  type(): string {
    return 'users';
  }
}
