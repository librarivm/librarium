import factory from '@adonisjs/lucid/factories';
import Folder from '#models/folder';
import { LibraryFactory } from '#database/factories/library_factory';

export const FolderFactory = factory
  .define(Folder, async ({ faker }) => {
    return {
      path: `/tmp/${faker.lorem.slug()}`,
    };
  })
  .relation('library', () => LibraryFactory)
  .build();
