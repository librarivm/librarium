import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'role_user';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('role_id')
        .notNullable()
        .index()
        .unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE');
      table
        .integer('user_id')
        .notNullable()
        .index()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
