import { Database } from '@adonisjs/lucid/database';
import vine from '@vinejs/vine';

const passwordSchema = vine.object({
  password: vine.string().minLength(8),
});

export const registerValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .normalizeEmail({ gmail_remove_dots: false })
      .unique(async (db: Database, value: string): Promise<boolean> => {
        const matched = await db.from('users').select('id').where('email', value).first();
        return !matched;
      }),
    password: passwordSchema.getProperties().password.confirmed(),
  })
);

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail({ gmail_remove_dots: false }),
    password: passwordSchema.getProperties().password,
  })
);
