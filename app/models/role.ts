import { BaseModel, column, scope } from '@adonisjs/lucid/orm';
import { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
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
  declare description: string | undefined;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt: DateTime | null;
}
