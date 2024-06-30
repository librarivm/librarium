import factory from '@adonisjs/lucid/factories';
import Library from '#models/library';
import kebabCase from 'lodash/kebabCase.js';
import startCase from 'lodash/startCase.js';

export const LibraryFactory = factory
  .define(Library, async ({ faker }) => {
    const name = faker.lorem.words();
    return {
      name: startCase(name),
      description: faker.lorem.sentences(),
      slug: kebabCase(name),
      user_id: 1,
      type_id: 1,
    };
  })
  .build();
