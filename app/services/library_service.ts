import { Service } from '#services/service';
import Library from '#models/library';
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import kebabCase from 'lodash/kebabCase.js';
import isObject from 'lodash/isObject.js';
import User from '#models/user';
import Type from '#models/type';
import { DateTime } from 'luxon';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

export interface LibraryAttributes {
  name: string;
  slug?: string;
  description?: string;
  metadata?: JSON | null;
  is_private: boolean;
  userId: number;
  typeId: number;
}

@inject()
export default class LibraryService extends Service {
  constructor(ctx?: HttpContext) {
    super(ctx);
    this.setModel(Library);
  }

  /**
   * List resources with pagination.
   *
   * @returns {Promise<ModelPaginatorContract<Library>>} Paginated results.
   */
  async list(): Promise<ModelPaginatorContract<Library>> {
    return this.model
      .query()
      .apply((scopes: { notSoftDeleted: () => any }) => scopes.notSoftDeleted())
      .if(this.hasSearch(), (query: any) => {
        query.where('slug', 'LIKE', `%${this.getSearch()}%`);
      })
      .if(this.hasOrderBy(), (query: any) => {
        query.orderBy(this.getOrderBy());
      })
      .paginate(this.getPage(), this.getPageCount());
  }

  /**
   * Find a resource by ID.
   *
   * @param {number} id - The ID of the resource.
   * @returns {Promise<Library|null>} The resource if found, otherwise null.
   */
  async find(id: number): Promise<Library | null> {
    return await this.model.find(id);
  }

  /**
   * Create or update a resource.
   *
   * @param {Library} model - The model to use to save the resource.
   * @param {LibraryAttributes} attributes - The attributes for the new resource.
   * @returns {Promise<Library>} The created resource.
   */
  async save(model: Library, attributes: LibraryAttributes): Promise<Library> {
    const library: Library = model;

    library.name = attributes.name;
    library.slug = attributes.slug ? attributes.slug : kebabCase(attributes.name);
    library.description = attributes.description;
    library.metadata = isObject(attributes.metadata)
      ? JSON.stringify(attributes.metadata)
      : attributes.metadata;

    const user: User | null = await User.find(attributes.userId);
    user && (await library.related('user').associate(user));

    const type: Type | null = await Type.find(attributes.typeId);
    type && (await library.related('type').associate(type));

    await library.save();

    return library;
  }

  /**
   * Create an existing resource.
   *
   * @param {LibraryAttributes} attributes - The new attributes for the resource.
   * @returns {Promise<Library>} The updated resource.
   */
  async store(attributes: LibraryAttributes): Promise<Library> {
    return this.save(this.model, attributes);
  }

  /**
   * Update an existing resource.
   *
   * @param {number} id - The ID of the resource.
   * @param {LibraryAttributes} attributes - The new attributes for the resource.
   * @returns {Promise<Library>} The updated resource.
   */
  async update(id: number, attributes: LibraryAttributes): Promise<Library> {
    const library: Library = this.model.find(id);

    return this.save(library, attributes);
  }

  /**
   * Trash a resource by updating the deleted_at column.
   *
   * @param {number} id - The ID of the resource.
   * @returns {Promise<void>}
   */
  async archive(id: number): Promise<void> {
    const library: Library = this.model.findOrFail(id);

    library.deletedAt = DateTime.local();

    await library.save();
  }

  /**
   * Permanently delete a resource by ID.
   *
   * @param {number} id - The ID of the resource.
   * @returns {Promise<void>}
   */
  async delete(id: number): Promise<void> {
    const library = await this.model.findOrFail(id);
    await library.delete();
  }
}
