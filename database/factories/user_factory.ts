import factory from '@adonisjs/lucid/factories';
import User from '#models/user';

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      first_name: firstName,
      middle_name: lastName,
      last_name: faker.person.lastName(),
      email: `fake.${faker.number.int()}.${faker.internet.email({
        firstName,
        lastName,
      })}`,
      username: faker.internet.userName(),
      password: 'password',
    };
  })
  .build();
