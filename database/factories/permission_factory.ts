import Permission from '#models/permission';
import factory from '@adonisjs/lucid/factories';
import startCase from 'lodash/startCase.js';

export const PermissionFactory = factory
  .define(Permission, async ({ faker }) => {
    const group: string = faker.lorem.word();
    return {
      code: `${group}.${faker.lorem.word()}`,
      group: `${startCase(group)}Permission`,
    };
  })
  .build();
