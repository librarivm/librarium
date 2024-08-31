import { BaseSeeder } from '@adonisjs/lucid/seeders';
import app from '@adonisjs/core/services/app';

export default class DatabaseSeeder extends BaseSeeder {
  async run() {
    await this.seed(await import('#database/seeders/permission_seeder'));
    await this.seed(await import('#database/seeders/role_seeder'));
    await this.seed(await import('#database/seeders/type_seeder'));

    await this.seed(await import('#database/seeders/user_seeder'));
    await this.seed(await import('#database/seeders/library_seeder'));
  }

  private async seed(Seeder: { default: typeof BaseSeeder }) {
    if (
      Seeder.default.environment &&
      ((!Seeder.default.environment.includes('development') && app.inDev) ||
        (!Seeder.default.environment.includes('testing') && app.inTest) ||
        (!Seeder.default.environment.includes('production') && app.inProduction))
    ) {
      return;
    }

    await new Seeder.default(this.client).run();
  }
}
