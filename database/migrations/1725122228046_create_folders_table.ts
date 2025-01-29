import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'folders';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.text('path').notNullable();
      table
        .integer('library_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('libraries')
        .onDelete('CASCADE');
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
