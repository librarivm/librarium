import factory from '@adonisjs/lucid/factories';
import Test from '#tests/mocks/models/mock_model';
import startCase from 'lodash/startCase.js';
import snakeCase from 'lodash/snakeCase.js';

export const TestFactory = factory
  .define(Test, async ({ faker }) => {
    const name = faker.lorem.words();
    return {
      name: startCase(name),
      code: snakeCase(name),
      description: faker.lorem.sentences(),
    };
  })
  .build();
