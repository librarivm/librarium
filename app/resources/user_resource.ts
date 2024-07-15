import Resource from '#resources/resource';
import { UserAttributes } from '#services/user_service';

export default class UserResource extends Resource<UserAttributes> {
  prepare(item: UserAttributes): UserAttributes {
    return {
      fullName: [item.firstName, item.lastName].join(' '),
      ...item,
    };
  }

  type(): string {
    return 'users';
  }
}
