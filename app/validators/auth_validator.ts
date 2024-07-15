import { Database } from '@adonisjs/lucid/database';
import vine from '@vinejs/vine';

const passwordSchema = vine.object({
  password: vine.string().minLength(8),
});

const emailNormalizationOptions = {
  gmail_remove_dots: false,
  gmail_remove_subaddress: false,
  icloud_remove_subaddress: false,
  outlookdotcom_remove_subaddress: false,
  yahoo_remove_subaddress: false,
};

export const registerValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .normalizeEmail(emailNormalizationOptions)
      .unique(async (db: Database, value: string): Promise<boolean> => {
        const matched = await db.from('users').select('id').where('email', value).first();
        return !matched;
      }),
    password: passwordSchema.getProperties().password.confirmed(),
  })
);

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(emailNormalizationOptions),
    password: passwordSchema.getProperties().password,
  })
);
