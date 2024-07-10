import Permission from '#models/permission';
import Role from '#models/role';
import { SuperPermission } from '#permissions/super_permission';
import { SuperadminRole } from '#roles/superadmin_role';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { compose } from '@adonisjs/core/helpers';
import hash from '@adonisjs/core/services/hash';
import { BaseModel, beforeFetch, beforeFind, column, manyToMany } from '@adonisjs/lucid/orm';
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import type { ManyToMany } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
});

export default class User extends compose(BaseModel, AuthFinder) {
  static accessTokens = DbAccessTokensProvider.forModel(User);

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare firstName: string | null;

  @column()
  declare middleName: string | null;

  @column()
  declare lastName: string | null;

  @column()
  declare email: string;

  @column()
  declare username: string;

  @column({ serializeAs: null })
  declare password: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @manyToMany(() => Role)
  declare roles: ManyToMany<typeof Role>;

  @beforeFetch()
  @beforeFind()
  static async preloadRoles(query: ModelQueryBuilderContract<typeof User>) {
    query.preload('roles');
  }

  /**
   * Checks if the user is permitted based on the given permission code.
   *
   * @param code - The permission code to check.
   * @returns A boolean indicating if the user has the permission.
   */
  isPermittedTo(code: string): boolean {
    return this.roles.some((role: any) =>
      role.permissions.some(
        (permission: Permission) =>
          permission.code === code || permission.code === SuperPermission.ALL
      )
    );
  }

  isSuperAdmin(): boolean {
    return this.roles.some((role: Role): boolean => role.slug === SuperadminRole.CODE);
  }

  /**
   * Check if the given resource is owned by the user.
   * @param resource - The resource to check if user owns.
   * @returns A boolean indicating if the user owns the resource.
   */
  owns(resource: Partial<{ userId: number }>): boolean {
    return this.id === resource.userId;
  }
}
