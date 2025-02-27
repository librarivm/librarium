import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'settings';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('key').notNullable();
      table.text('values', 'longtext').nullable();
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
