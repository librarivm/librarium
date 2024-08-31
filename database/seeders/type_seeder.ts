import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { TypeFactory } from '#database/factories/type_factory';
import Type from '#models/type';
import { types } from '#config/types';

export default class extends BaseSeeder {
  static environment = ['production', 'development', 'testing'];

  async run() {
    const slugs = await Type.query()
      .select('slug')
      .where('slug', 'in', types.map((type) => type.slug) as string[]);

    const codes = slugs.map((type) => type.slug);

    for (const type of types) {
      if (!codes.includes(type.slug as string)) {
        await TypeFactory.merge({
          name: type.name,
          slug: type.slug,
          description: type.description,
        }).create();
      }
    }
  }
}
