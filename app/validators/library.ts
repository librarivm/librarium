import vine from '@vinejs/vine';

const libraryValidator = vine.object({
  name: vine.string(),
  slug: vine.string(),
  description: vine.string().optional(),
  metadata: vine.string().optional(),
  isPrivate: vine.boolean(),
  userId: vine.number(),
  typeId: vine.number(),
});

export const createLibraryValidator = vine.compile(libraryValidator);

export const updateLibraryValidator = vine.compile(libraryValidator.clone());
