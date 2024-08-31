import Role from '#models/role';
import factory from '@adonisjs/lucid/factories';
import kebabCase from 'lodash/kebabCase.js';
import startCase from 'lodash/startCase.js';
import { AdminRole } from '#roles/admin_role';
import { PermissionFactory } from '#database/factories/permission_factory';
import { SubscriberRole } from '#roles/subscriber_role';
import { SuperadminRole } from '#roles/superadmin_role';
import { UserFactory } from '#database/factories/user_factory';

export const RoleFactory = factory
  .define(Role, async ({ faker }) => {
    const name = faker.lorem.word();
    return {
      name: startCase(name),
      slug: kebabCase(name),
      description: faker.lorem.sentence(),
    };
  })
  .state(SuperadminRole.CODE, (role: Role) => {
    role.name = startCase(SuperadminRole.NAME);
    role.slug = kebabCase(SuperadminRole.CODE);
    role.description = SuperadminRole.DESCRIPTION;
  })
  .state(AdminRole.CODE, (role: Role) => {
    role.name = startCase(AdminRole.NAME);
    role.slug = kebabCase(AdminRole.CODE);
    role.description = AdminRole.DESCRIPTION;
  })
  .state(SubscriberRole.CODE, (role: Role) => {
    role.name = startCase(SubscriberRole.NAME);
    role.slug = kebabCase(SubscriberRole.CODE);
    role.description = SubscriberRole.DESCRIPTION;
  })
  .relation('users', () => UserFactory)
  .relation('permissions', () => PermissionFactory)
  .build();
