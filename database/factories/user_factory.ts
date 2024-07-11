import { RoleFactory } from '#database/factories/role_factory';
import User from '#models/user';
import factory from '@adonisjs/lucid/factories';

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      first_name: firstName,
      middle_name: faker.person.middleName(),
      last_name: lastName,
      email: `fake.${faker.number.int()}.${faker.internet.email({
        firstName,
        lastName,
      })}`.toLowerCase(),
      username: faker.internet.userName().toLowerCase(),
      password: 'password',
    };
  })
  .relation('roles', () => RoleFactory)
  .build();
