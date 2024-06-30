import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'library_settings';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table
        .integer('library_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('libraries')
        .onDelete('CASCADE');
      table.integer('setting_id').notNullable().unsigned().references('id').inTable('settings');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
