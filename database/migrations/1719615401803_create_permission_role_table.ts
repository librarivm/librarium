import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'permission_role';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('permission_id')
        .notNullable()
        .index()
        .unsigned()
        .references('id')
        .inTable('permissions');
      table.integer('role_id').notNullable().index().unsigned().references('id').inTable('roles');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
