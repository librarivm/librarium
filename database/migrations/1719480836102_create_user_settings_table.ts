import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'user_settings';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.integer('setting_id').notNullable().unsigned().references('id').inTable('settings');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
