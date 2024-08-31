import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { UserFactory } from '#database/factories/user_factory';
import Role from '#models/role';
import sample from 'lodash/sample.js';
import { SuperadminRole } from '#roles/superadmin_role';
import User from '#models/user';

export default class extends BaseSeeder {
  static environment = ['development', 'testing'];

  async run() {
    await this.seedDefaultSuperAdmin();
    await this.seedForDevelopment();
  }

  async seedDefaultSuperAdmin() {
    const exist = await User.query().where('username', 'librarium').first();

    if (exist) {
      return;
    }

    const user = await UserFactory.merge({
      firstName: 'Librarium',
      middleName: '',
      lastName: 'Superadmin',
      email: 'admin@librarium.io',
      username: 'librarium',
      password: 'password',
    }).create();
    const role = await Role.query().select('id').where('slug', SuperadminRole.CODE).first();
    await user.related('roles').attach([role!.id as number]);
  }

  async seedForDevelopment() {
    const roles = await Role.query().select('id');
    const users = await UserFactory.createMany(20);

    for (const user of users) {
      const roleId = sample(roles.map((role) => role.id));
      await user.related('roles').attach([roleId as number]);
    }
  }
}
