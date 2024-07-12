import RoleService from '#services/role_service';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class extends BaseSeeder {
  async run() {
    const service: RoleService = new RoleService();

    await service.install();
  }
}
