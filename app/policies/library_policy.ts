import Library from '#models/library';
import User from '#models/user';
import { LibraryPermission } from '#permissions/library_permission';
import { BasePolicy } from '@adonisjs/bouncer';
import { AuthorizerResponse } from '@adonisjs/bouncer/types';

export default class LibraryPolicy extends BasePolicy {
  /**
   * Checks if the user is permitted to list resources.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  list(user: User): AuthorizerResponse {
    return user.isSuperAdmin() || user.isPermittedTo(LibraryPermission.LIST);
  }

  /**
   * Checks if the user is permitted to create a resource.
   * @param {User} user - The user to check permissions for.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  create(user: User): AuthorizerResponse {
    return user.isSuperAdmin() || user.isPermittedTo(LibraryPermission.CREATE);
  }

  /**
   * Checks if the user is permitted to find a resource.
   * @param {User} user - The user to check permissions for.
   * @param {Library} library - The library to check if user owned.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  show(user: User, library: Library): AuthorizerResponse {
    if (user.isSuperAdmin()) {
      return true;
    }

    return user.owns(library);
  }

  /**
   * Checks if the user is permitted to update a resource.
   * @param {User} user - The user to check permissions for.
   * @param {Library} library - The library to check if user owned.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  update(user: User, library: Library): AuthorizerResponse {
    if (user.isSuperAdmin()) {
      return true;
    }

    return user.owns(library);
  }

  /**
   * Checks if the user is permitted to archive a resource.
   * @param {User} user - The user to check permissions for.
   * @param {Library} library - The library to check if user owned.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  archive(user: User, library: Library): AuthorizerResponse {
    if (user.isSuperAdmin()) {
      return true;
    }

    return user.owns(library) && user.isPermittedTo(LibraryPermission.ARCHIVE as string);
  }

  /**
   * Checks if the user is permitted to restore a resource.
   * @param {User} user - The user to check permissions for.
   * @param {Library} library - The library to check if user owned.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  restore(user: User, library: Library): AuthorizerResponse {
    if (user.isSuperAdmin()) {
      return true;
    }

    return user.owns(library) && user.isPermittedTo(LibraryPermission.RESTORE as string);
  }

  /**
   * Checks if the user is permitted to delete a resource.
   * @param {User} user - The user to check permissions for.
   * @param {Library} library - The library to check if user owned.
   * @returns {AuthorizerResponse} - The response indicating if the user is permitted.
   */
  destroy(user: User, library: Library): AuthorizerResponse {
    if (user.isSuperAdmin()) {
      return true;
    }

    return user.owns(library) && user.isPermittedTo(LibraryPermission.DELETE);
  }
}
