import User from '#models/user';
import { RolePermission } from '#permissions/role_permission';
import { BasePolicy } from '@adonisjs/bouncer';
import { AuthorizerResponse } from '@adonisjs/bouncer/types';

export default class RolePolicy extends BasePolicy {
  list(user: User): AuthorizerResponse {
    return user.isPermittedTo(RolePermission.READ);
  }

  create(user: User): AuthorizerResponse {
    return user.isPermittedTo(RolePermission.CREATE);
  }

  show(user: User): AuthorizerResponse {
    return user.isPermittedTo(RolePermission.READ);
  }

  update(user: User): AuthorizerResponse {
    return user.isPermittedTo(RolePermission.UPDATE);
  }

  archive(user: User): AuthorizerResponse {
    return user.isPermittedTo(RolePermission.ARCHIVE as string);
  }

  destroy(user: User): AuthorizerResponse {
    return user.isPermittedTo(RolePermission.DELETE);
  }
}
