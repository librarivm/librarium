import Type from '#models/type';
import User from '#models/user';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { BaseModel, belongsTo, column, scope } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class Library extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare slug: string;

  @column()
  declare description: string | undefined;

  @column()
  declare metadata: string | null | undefined;

  @column()
  declare user_id: number;

  @column()
  declare type_id: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt: DateTime | null;

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>;

  @belongsTo(() => Type)
  declare type: BelongsTo<typeof Type>;

  static notSoftDeleted = scope((query) => {
    query.whereNull('deleted_at');
  });
}
