import Permission from '#models/permission';
import Role from '#models/role';
import { SuperPermission } from '#permissions/super_permission';
import { RoleConstants } from '#roles/.role';
import { Service } from '#services/service';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { ExtractScopes, ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import { ChainableContract } from '@adonisjs/lucid/types/querybuilder';
import isArray from 'lodash/isArray.js';
import { DateTime } from 'luxon';
import fs from 'node:fs';
import path from 'node:path';

export type RoleAttributes = {
  name: string;
  slug?: string;
  description?: string | null;
  permissions?: number[] | any[] | '*' | null;
  users?: number[] | any[];
};

export const ROLES_PATH: string = path.resolve('app', 'roles');

@inject()
export default class RoleService extends Service {
  supportedColumnKeys: string[] = ['name', 'slug', 'description', 'created_at', 'updated_at'];

  preloads: string[] = ['users', 'permissions'];

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
    let role: Role = model;

    role.name = attributes.name;
    role.slug = attributes.slug as string;
    role.description = attributes.description;

    role = await role.save();

    if (isArray(attributes.permissions)) {
      role.related('permissions').sync(attributes.permissions as (string | number)[]);
    }

    return role;
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

  /**
   * Returns the path to the roles enum files.
   *
   * @returns {string} The path to the roles enum files.
   */
  path(): string {
    return ROLES_PATH;
  }

  /**
   * Reads role enum files from the specified directory
   * and returns an array of role attributes.
   *
   * @returns {Promise<RoleAttributes[]>} A promise that resolves to an array of role attributes,
   *                                           each containing a 'code' and a 'group'.
   */
  async roles(): Promise<RoleAttributes[]> {
    let roles: RoleAttributes[] = [];
    const files: string[] = fs
      .readdirSync(this.path())
      .filter((file: string) => file.endsWith('_role.ts'));

    for (const file of files) {
      const module = await import(path.resolve(this.path(), file));
      const ROLE: RoleConstants = Object.values(module)?.[0] as RoleConstants;

      roles.push({
        name: ROLE.NAME,
        slug: ROLE.CODE,
        description: ROLE.DESCRIPTION,
        permissions: ROLE.PERMISSIONS,
      } as RoleAttributes);
    }

    return roles;
  }

  /**
   * Installs the roles by reading the
   * roles from disk and creating them in the model.
   *
   * @returns {Promise<void>} A promise that resolves when the roles have been created.
   */
  async install(): Promise<void> {
    const roles: RoleAttributes[] = await this.roles();

    for (const role of roles) {
      const exists = await this.model.query().where('slug', role.slug).first();

      if (!exists) {
        console.log('  ✔ Installing role:', role.slug);

        if (role.permissions === SuperPermission.ALL) {
          role.permissions = [SuperPermission.ALL];
        }

        const permissions: Permission[] = await Permission.query().whereIn(
          'code',
          role.permissions as unknown as ChainableContract
        );

        await this.save(new this.model(), {
          ...role,
          permissions: permissions.map((permission: Permission) => permission.id),
        });
      }
    }
  }
}
