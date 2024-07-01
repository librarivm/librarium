import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { LibraryFactory } from '#database/factories/library_factory';

export default class extends BaseSeeder {
  async run() {
    await LibraryFactory.with('user').with('type').createMany(20);
  }
}
