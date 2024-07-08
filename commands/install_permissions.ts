import PermissionService from '#services/permission_service';
import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';

export default class InstallPermissions extends BaseCommand {
  static commandName = 'install:permissions';
  static description = 'This command sets up the necessary permissions for the application';

  static options: CommandOptions = {
    startApp: true,
  };

  async run() {
    const service: PermissionService = new PermissionService();
    await service.install();
  }

  async completed() {
    console.log('Successfully installed permissions');
  }
}
