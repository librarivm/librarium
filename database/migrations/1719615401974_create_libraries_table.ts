import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'libraries';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('name');
      table.string('slug');
      table.text('description');
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
