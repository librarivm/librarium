import Role from '#models/role';
import { Service } from '#services/service';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { ExtractScopes, ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import kebabCase from 'lodash/kebabCase.js';
import { DateTime } from 'luxon';

export interface RoleAttributes {
  name: string;
  slug?: string;
  description?: string;
  permissions?: number[] | any[];
  users?: number[] | any[];
}

@inject()
export default class RoleService extends Service {
  constructor(ctx?: HttpContext) {
    super(ctx);
    this.setModel(Role);
  }

  /**
   * List resources with pagination.
   *
   * @returns {Promise<ModelPaginatorContract<Role>>} Paginated results.
   */
  async list(): Promise<ModelPaginatorContract<Role>> {
    return this.withQueryAware(
      this.model.query().apply((scopes: ExtractScopes<typeof Role>) => scopes.notSoftDeleted())
    ).paginate(this.getPage(), this.getPageCount());
  }

  /**
   * Find a resource by ID.
   *
   * @param {number} id - The ID of the resource.
   * @returns {Promise<Role|null>} The resource if found, otherwise null.
   */
  async find(id: number): Promise<Role | null> {
    return await this.model.find(id);
  }

  /**
   * Find a resource by ID.
   *
   * @param {number} id - The ID of the resource.
   * @returns {Promise<Role|null>} The resource if found, otherwise null.
   */
  async findOrFail(id: number): Promise<Role | any> {
    return this.withPreload(this.model.query().where('id', id)).firstOrFail();
  }

  /**
   * Create or update a resource.
   *
   * @param {Role} model - The model to use to save the resource.
   * @param {RoleAttributes} attributes - The attributes for the new resource.
   * @returns {Promise<Role>} The created resource.
   */
  async save(model: Role, attributes: RoleAttributes): Promise<Role> {
    const role: Role = model;

    role.name = attributes.name;
    role.slug = kebabCase(attributes.name);
    role.description = attributes.description;

    return await role.save();
  }

  /**
   * Create an existing resource.
   *
   * @param {RoleAttributes} attributes - The new attributes for the resource.
   * @returns {Promise<Role>} The updated resource.
   */
  async store(attributes: RoleAttributes): Promise<Role> {
    return this.save(new this.model(), attributes);
  }

  /**
   * Update an existing resource.
   *
   * @param {number} id - The ID of the resource.
   * @param {RoleAttributes} attributes - The new attributes for the resource.
   * @returns {Promise<Role>} The updated resource.
   */
  async update(id: number, attributes: RoleAttributes): Promise<Role> {
    const role: Role = await this.model.find(id);

    return this.save(role, attributes);
  }

  /**
   * Trash a resource by updating the deleted_at column.
   *
   * @param {number} id - The ID of the resource.
   * @returns {Promise<void>}
   */
  async archive(id: number): Promise<void> {
    const role: Role = await this.model.findOrFail(id);

    role.deletedAt = DateTime.local();

    await role.save();
  }

  /**
   * Permanently delete a resource by ID.
   *
   * @param {number} id - The ID of the resource.
   * @returns {Promise<void>}
   */
  async delete(id: number): Promise<void> {
    const role = await this.model.findOrFail(id);
    await role.delete();
  }
}
