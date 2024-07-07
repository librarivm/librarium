import vine from '@vinejs/vine';

export const createLibraryValidator = vine.compile(
  vine.object({
    name: vine.string(),
    slug: vine.string(),
    description: vine.string().optional(),
    metadata: vine.string().optional(),
    isPrivate: vine.boolean(),
    userId: vine.number(),
    typeId: vine.number(),
  })
);
