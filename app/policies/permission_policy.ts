import User from '#models/user';
import { BasePolicy } from '@adonisjs/bouncer';
import { AuthorizerResponse } from '@adonisjs/bouncer/types';
import { PermissionPermission } from '#permissions/permission_permission';

export default class PermissionPolicy extends BasePolicy {
  /**
   * Checks if the user is permitted to list resources.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  all(user: User): AuthorizerResponse {
    return user.isSuperAdmin() || user.isPermittedTo(PermissionPermission.ALL);
  }
}
