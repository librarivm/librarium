import { Database } from '@adonisjs/lucid/database';
import vine from '@vinejs/vine';
import isNil from 'lodash/isNil.js';

vine.convertEmptyStringsToNull = false;

export const userValidator = (id?: number) =>
  vine.object({
    first_name: vine.string().optional().nullable(),
    middle_name: vine.string().optional().nullable(),
    last_name: vine.string().optional().nullable(),
    firstName: vine.string().optional().nullable(),
    middleName: vine.string().optional().nullable(),
    lastName: vine.string().optional().nullable(),
    email: vine
      .string()
      .email()
      .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false })
      .unique(async (db: Database, value: string): Promise<boolean> => {
        const matched = await db
          .from('users')
          .select('id')
          .if(
            isNil(id),
            (query) => {
              query.where('email', value);
            },
            (query) => {
              query.whereNot('id', id as number).where('email', value);
            }
          )
          .first();

        return !matched;
      }),
    username: vine.string().unique(async (db: Database, value: string): Promise<boolean> => {
      const matched = await db
        .from('users')
        .select('id')
        .if(
          isNil(id),
          (query) => {
            query.where('username', value);
          },
          (query) => {
            query.whereNot('id', id as number).where('username', value);
          }
        )
        .first();

      return !matched;
    }),
    password: isNil(id) ? vine.string().minLength(8) : vine.string().minLength(8).optional(),
  });

export const createUserValidator = vine.compile(userValidator());

export const updateUserValidator = (id: number) => vine.compile(userValidator(id).clone());
