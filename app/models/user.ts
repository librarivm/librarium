import Permission from '#models/permission';
import Role from '#models/role';
import hash from '@adonisjs/core/services/hash';
import string from '@adonisjs/core/helpers/string';
import type { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import type { ManyToMany } from '@adonisjs/lucid/types/relations';
import { BaseModel, beforeFetch, beforeFind, column, manyToMany, scope } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import { SuperPermission } from '#permissions/super_permission';
import { SuperadminRole } from '#roles/superadmin_role';
import { compose } from '@adonisjs/core/helpers';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
});

export default class User extends compose(BaseModel, AuthFinder) {
  static accessTokens = DbAccessTokensProvider.forModel(User);

  static notSoftDeleted = scope((query: ModelQueryBuilderContract<LucidModel>): void => {
    query.whereNull('deleted_at');
  });

  static softDeleted = scope((query: ModelQueryBuilderContract<LucidModel>): void => {
    query.whereNotNull('deleted_at');
  });

  static orSoftDeleted = scope((query: ModelQueryBuilderContract<LucidModel>): void => {
    query.orWhereNotNull('deleted_at');
  });

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare firstName?: string | null;

  @column()
  declare middleName?: string | null;

  @column()
  declare lastName?: string | null;

  @column()
  declare email: string;

  @column()
  declare username: string;

  @column({ serializeAs: null })
  declare password?: string;

  @column()
  declare avatar?: string;

  @column()
  declare rememberToken?: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @column.dateTime()
  declare deletedAt: DateTime | null;

  @manyToMany(() => Role)
  declare roles: ManyToMany<typeof Role>;

  static withoutSoftDeletes(query: ModelQueryBuilderContract<typeof User>): void {
    query.whereNull('deleted_at');
  }

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

  async generateRememberToken(): Promise<string> {
    this.rememberToken = `${this.id}|${crypto.randomUUID() + string.random(32)}`;
    await this.save();

    return this.rememberToken;
  }
}
