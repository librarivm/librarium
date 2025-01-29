import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Type from '#models/type';
import sample from 'lodash/sample.js';
import { LibraryFactory } from '#database/factories/library_factory';
import User from '#models/user';

export default class extends BaseSeeder {
  static environment = ['development', 'testing'];

  async run() {
    const types = await Type.query().select('id');
    const typeId = sample(types.map((type) => type.id));

    const users = await User.query().select('id');
    const userId = sample(users.map((user) => user.id));

    const libraries = await LibraryFactory.merge({ typeId, userId })
      .with('folders', 3)
      .createMany(10);

    for (const library of libraries) {
      library.typeId = sample(types.map((item) => item.id)) as number;
      await library.save();
    }
  }
}
