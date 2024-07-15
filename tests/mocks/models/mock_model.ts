import { BaseModel, column, scope } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';

export default class Test extends BaseModel {
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
  declare code: string;

  @column()
  declare description: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
