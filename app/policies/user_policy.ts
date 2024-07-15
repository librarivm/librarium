import User from '#models/user';
import { UserPermission } from '#permissions/user_permission';
import { BasePolicy } from '@adonisjs/bouncer';
import { AuthorizerResponse } from '@adonisjs/bouncer/types';

export default class UserPolicy extends BasePolicy {
  /**
   * Checks if the user is permitted to list resources.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  list(user: User): AuthorizerResponse {
    return user.isSuperAdmin() || user.isPermittedTo(UserPermission.LIST);
  }

  /**
   * Checks if the user is permitted to create a resource.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  create(user: User): AuthorizerResponse {
    return user.isSuperAdmin() || user.isPermittedTo(UserPermission.CREATE);
  }

  /**
   * Checks if the user is permitted to find a resource.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  show(user: User): AuthorizerResponse {
    return user.isSuperAdmin() || user.isPermittedTo(UserPermission.READ);
  }

  /**
   * Checks if the user is permitted to update a resource.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  update(user: User): AuthorizerResponse {
    return user.isSuperAdmin() || user.isPermittedTo(UserPermission.UPDATE);
  }

  /**
   * Checks if the user is permitted to archive a resource.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  archive(user: User): AuthorizerResponse {
    return user.isSuperAdmin() || user.isPermittedTo(UserPermission.ARCHIVE as string);
  }

  /**
   * Checks if the user is permitted to restore a resource.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  restore(user: User): AuthorizerResponse {
    return user.isSuperAdmin() || user.isPermittedTo(UserPermission.RESTORE as string);
  }

  /**
   * Checks if the user is permitted to delete a resource.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  destroy(user: User): AuthorizerResponse {
    return user.isSuperAdmin() || user.isPermittedTo(UserPermission.DELETE);
  }
}
