import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import Library from '#models/library';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

export default class Folder extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare path: string;

  @column()
  declare libraryId: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @belongsTo(() => Library)
  declare library: BelongsTo<typeof Library>;
}
