import RoleService from '#services/role_service';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class extends BaseSeeder {
  static environment = ['production', 'development', 'testing'];

  async run() {
    const service: RoleService = new RoleService();

    await service.install();
  }
}
