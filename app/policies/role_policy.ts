import User from '#models/user';
import { RolePermission } from '#permissions/role_permission';
import { BasePolicy } from '@adonisjs/bouncer';
import { AuthorizerResponse } from '@adonisjs/bouncer/types';

export default class RolePolicy extends BasePolicy {
  /**
   * Checks if the user is permitted to list resources.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  list(user: User): AuthorizerResponse {
    return user.isPermittedTo(RolePermission.LIST);
  }

  /**
   * Checks if the user is permitted to create a resource.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  create(user: User): AuthorizerResponse {
    return user.isPermittedTo(RolePermission.CREATE);
  }

  /**
   * Checks if the user is permitted to find a resource.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  show(user: User): AuthorizerResponse {
    return user.isPermittedTo(RolePermission.READ);
  }

  /**
   * Checks if the user is permitted to update a resource.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  update(user: User): AuthorizerResponse {
    return user.isPermittedTo(RolePermission.UPDATE);
  }

  /**
   * Checks if the user is permitted to archive a resource.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  archive(user: User): AuthorizerResponse {
    return user.isPermittedTo(RolePermission.ARCHIVE as string);
  }

  /**
   * Checks if the user is permitted to delete a resource.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  destroy(user: User): AuthorizerResponse {
    return user.isPermittedTo(RolePermission.DELETE);
  }
}
