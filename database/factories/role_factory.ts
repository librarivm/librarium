import Role from '#models/role';
import factory from '@adonisjs/lucid/factories';
import kebabCase from 'lodash/kebabCase.js';
import startCase from 'lodash/startCase.js';
import { UserRole, UserRoleDescription } from '../../app/enums/user_role.js';

export const RoleFactory = factory
  .define(Role, async ({ faker }) => {
    const name = faker.lorem.word();
    return {
      name: startCase(name),
      slug: kebabCase(name),
      description: faker.lorem.sentence(),
    };
  })
  .state(UserRole.SUPERADMIN, (role: Role) => {
    role.name = startCase(UserRole.SUPERADMIN);
    role.slug = kebabCase(UserRole.SUPERADMIN);
    role.description = UserRoleDescription.SUPERADMIN;
  })
  .state(UserRole.ADMIN, (role: Role) => {
    role.name = startCase(UserRole.ADMIN);
    role.slug = kebabCase(UserRole.ADMIN);
    role.description = UserRoleDescription.ADMIN;
  })
  .state(UserRole.SUBSCRIBER, (role: Role) => {
    role.name = startCase(UserRole.SUBSCRIBER);
    role.slug = kebabCase(UserRole.SUBSCRIBER);
    role.description = UserRoleDescription.SUBSCRIBER;
  })
  .build();
