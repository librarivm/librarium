import Permission from '#models/permission';
import Role from '#models/role';
import { SuperadminRole } from '#roles/superadmin_role';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { compose } from '@adonisjs/core/helpers';
import hash from '@adonisjs/core/services/hash';
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm';
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

  /**
   * Checks if the user is permitted based on the given permission code.
   *
   * @param code - The permission code to check.
   * @returns A promise that resolves to a boolean indicating if the user has the permission.
   */
  async isPermittedTo(code: string): Promise<boolean> {
    const roles = await this.related('roles' as any)
      .query()
      .preload('permissions' as any);

    if (roles.map((role: any) => role.slug).includes(SuperadminRole.CODE)) {
      return true;
    }

    const permissions = roles
      .map((role: any) => role.permissions.map((permission: Permission) => permission.code))
      .flat();

    return permissions.includes(code) || permissions.includes('*');
  }
}
