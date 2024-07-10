import { Database } from '@adonisjs/lucid/database';
import vine from '@vinejs/vine';
import isNil from 'lodash/isNil.js';
import kebabCase from 'lodash/kebabCase.js';

const libraryValidator = (id?: number) =>
  vine.object({
    name: vine.string(),
    slug: vine.string().unique(async (db: Database, value: string, field): Promise<boolean> => {
      const matched = await db
        .from('libraries')
        .select('id')
        .if(
          isNil(id),
          (query) => {
            query.where('slug', value).orWhere('slug', kebabCase(field.data.name));
          },
          (query) => {
            query.whereNot('id', id as number).where('slug', value);
          }
        )
        .first();

      return !matched;
    }),
    description: vine.string().escape().optional(),
    metadata: vine.string().optional(),
    isPrivate: vine.boolean(),
    userId: vine.number(),
    typeId: vine.number(),
  });

export const createLibraryValidator = vine.compile(libraryValidator());

export const updateLibraryValidator = (id: number) => vine.compile(libraryValidator(id).clone());
