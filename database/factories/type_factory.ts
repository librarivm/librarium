import factory from '@adonisjs/lucid/factories';
import Type from '#models/type';
import startCase from 'lodash/startCase.js';
import kebabCase from 'lodash/kebabCase.js';

export const TypeFactory = factory
  .define(Type, async ({ faker }) => {
    const name = faker.lorem.words();
    return {
      name: startCase(name),
      slug: kebabCase(name),
      domain: 'test',
      description: faker.lorem.sentences(),
      metadata: null,
    };
  })
  .build();
