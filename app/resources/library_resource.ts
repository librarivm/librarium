import Resource from '#resources/resource';
import { LibraryAttributes } from '#services/library_service';
import UserResource from '#resources/user_resource';
import { UserAttributes } from '#services/user_service';

export type LibraryJsonAttributes = LibraryAttributes & {
  user?: UserAttributes;
  type?: any;
};

export default class LibraryResource extends Resource<LibraryJsonAttributes> {
  prepare(item: LibraryJsonAttributes): LibraryJsonAttributes {
    return Object.assign({
      ...item,
      user: item.user ? new UserResource(item.user).get() : undefined,
      // TODO: new TypeResource(item.type).get()
      type: item.type,
    });
  }

  type(): string {
    return 'libraries';
  }
}
