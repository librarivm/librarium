import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'libraries';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('name').notNullable();
      table.text('description', 'longtext').nullable();
      table.string('slug').unique();
      table.text('metadata', 'longtext').nullable();
      table.boolean('is_private').defaultTo(false);
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users');
      table.integer('type_id').notNullable().unsigned().references('id').inTable('types');
      table.timestamp('created_at');
      table.timestamp('updated_at');
      table.timestamp('deleted_at').nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
