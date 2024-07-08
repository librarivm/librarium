import { Database } from '@adonisjs/lucid/database';
import vine from '@vinejs/vine';
import isNil from 'lodash/isNil.js';
import kebabCase from 'lodash/kebabCase.js';

const roleValidator = (id?: number) =>
  vine.object({
    name: vine.string(),
    slug: vine.string().unique(async (db: Database, value: string, field): Promise<boolean> => {
      const matched = await db
        .from('roles')
        .select('id')
        .if(
          isNil(id),
          (query) => {
            query.where('slug', value).orWhere('slug', kebabCase(field.data.name));
          },
          (query) => {
            query.whereNot('id', id as number);
          }
        )
        .first();

      return !matched;
    }),
    description: vine.string().escape().optional(),
    users: vine.array(vine.number()).optional(),
    permissions: vine.array(vine.number()).notEmpty(),
  });

export const createRoleValidator = vine.compile(roleValidator());
