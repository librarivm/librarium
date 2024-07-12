import Permission from '#models/permission';
import User from '#models/user';
import { BaseModel, beforeFetch, beforeFind, column, manyToMany, scope } from '@adonisjs/lucid/orm';
import type { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import type { ManyToMany } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class Role extends BaseModel {
  static notSoftDeleted = scope((query: ModelQueryBuilderContract<LucidModel>): void => {
    query.whereNull('deleted_at');
  });

  static softDeleted = scope((query: ModelQueryBuilderContract<LucidModel>): void => {
    query.whereNotNull('deleted_at');
  });

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare slug: string;

  @column()
  declare description?: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt: DateTime | null;

  @manyToMany(() => User)
  declare users: ManyToMany<typeof User>;

  @manyToMany(() => Permission)
  declare permissions: ManyToMany<typeof Permission>;

  @beforeFind()
  static withoutSoftDeletes(query: ModelQueryBuilderContract<typeof Role>): void {
    query.whereNull('deleted_at');
  }

  @beforeFetch()
  static async preloadPermissions(query: ModelQueryBuilderContract<typeof Role>) {
    query.preload('permissions');
  }
}
