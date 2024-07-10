import User from '#models/user';
import { LibraryPermission } from '#permissions/library_permission';
import { BasePolicy } from '@adonisjs/bouncer';
import { AuthorizerResponse } from '@adonisjs/bouncer/types';

export default class LibraryPolicy extends BasePolicy {
  list(user: User): AuthorizerResponse {
    return user.isPermittedTo(LibraryPermission.LIST);
  }
}
