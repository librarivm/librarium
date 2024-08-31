import PermissionService from '#services/permission_service';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class extends BaseSeeder {
  static environment = ['production', 'development', 'testing'];

  async run() {
    const service: PermissionService = new PermissionService();

    await service.install();
  }
}
