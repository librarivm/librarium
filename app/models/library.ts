import Type from '#models/type';
import User from '#models/user';
import {
  afterFetch,
  afterFind,
  BaseModel,
  beforeFind,
  beforeSave,
  belongsTo,
  column,
  scope,
} from '@adonisjs/lucid/orm';
import type { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class Library extends BaseModel {
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
  declare name: string;

  @column()
  declare slug: string;

  @column()
  declare description?: string | null;

  @column()
  declare isPrivate: boolean;

  @column()
  declare userId: number;

  @column()
  declare typeId: number;

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
  @column()
  declare metadata: string | { [key: string]: any } | null | undefined;

  @beforeFind()
  static withoutSoftDeletes(query: ModelQueryBuilderContract<typeof Library>): void {
    query.whereNull('deleted_at');
  }

  @beforeSave()
  static async stringifyMetadata(library: Library): Promise<void> {
    if (library.$dirty.metadata && typeof library.metadata !== 'string') {
      library.metadata = JSON.stringify(library.metadata);
    }
  }

  @afterFind()
  @afterFetch()
  static async parseMetadata(library: Library): Promise<void> {
    if (typeof library.metadata === 'string') {
      library.metadata = JSON.parse(library.metadata);
    }
  }
}
