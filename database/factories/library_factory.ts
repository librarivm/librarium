import factory from '@adonisjs/lucid/factories';
import Library from '#models/library';
import kebabCase from 'lodash/kebabCase.js';
import startCase from 'lodash/startCase.js';
import { UserFactory } from '#database/factories/user_factory';
import { TypeFactory } from '#database/factories/type_factory';

export const LibraryFactory = factory
  .define(Library, async ({ faker }) => {
    const name = faker.lorem.words();
    return {
      name: startCase(name),
      description: faker.lorem.sentences(),
      slug: kebabCase(name),
    };
  })
  .relation('user', () => UserFactory)
  .relation('type', () => TypeFactory)
  .build();
