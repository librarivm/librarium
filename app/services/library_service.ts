import Library from '#models/library';
import { Service } from '#services/service';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { ExtractScopes, ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import kebabCase from 'lodash/kebabCase.js';
import { DateTime } from 'luxon';

export type LibraryAttributes = {
  name: string;
  slug?: string;
  description?: string | null;
  metadata?: JSON | { [key: string]: any } | string | null;
  isPrivate: boolean;
  userId: number;
  typeId: number;
};

@inject()
export default class LibraryService extends Service {
  supportedColumnKeys: string[] = ['name', 'description', 'slug', 'created_at', 'updated_at'];

  preloads: string[] = ['user', 'type'];

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
    return this.withQueryAware(
      this.model.query().apply((scopes: ExtractScopes<typeof Library>) => scopes.notSoftDeleted())
    ).paginate(this.getPage(), this.getPageCount());
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
   * Find a resource by ID.
   *
   * @param {number} id - The ID of the resource.
   * @returns {Promise<Library|null>} The resource if found, otherwise null.
   */
  async findOrFail(id: number): Promise<Library | any> {
    return this.withPreload(this.model.query().where('id', id)).firstOrFail();
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
    library.slug = kebabCase(attributes.name);
    library.description = attributes.description;
    library.isPrivate = attributes.isPrivate;
    library.userId = attributes.userId;
    library.typeId = attributes.typeId;
    library.metadata = attributes.metadata;

    return await library.save();
  }

  /**
   * Create an existing resource.
   *
   * @param {LibraryAttributes} attributes - The new attributes for the resource.
   * @returns {Promise<Library>} The updated resource.
   */
  async store(attributes: LibraryAttributes): Promise<Library> {
    return this.save(new this.model(), attributes);
  }

  /**
   * Update an existing resource.
   *
   * @param {number | Library} model - The model or ID of the resource.
   * @param {LibraryAttributes} attributes - The new attributes for the resource.
   * @returns {Promise<Library>} The updated resource.
   */
  async update(model: number | Library, attributes: LibraryAttributes): Promise<Library> {
    const library: Library = model instanceof Library ? model : await this.model.find(model);

    return this.save(library, attributes);
  }

  /**
   * Trash a resource by updating the deleted_at column.
   *
   * @param {number | Library} model - The model or ID of the resource.
   * @returns {Promise<void>}
   */
  async archive(model: number | Library): Promise<void> {
    const library: Library = model instanceof Library ? model : await this.model.findOrFail(model);

    library.deletedAt = DateTime.local();

    await library.save();
  }

  /**
   * Restore a resource by updating the deleted_at column to null.
   *
   * @param {number | Library} model - The model or ID of the resource.
   * @returns {Promise<void>}
   */
  async restore(model: number | Library): Promise<void> {
    const library: Library = model instanceof Library ? model : await this.model.findOrFail(model);

    library.deletedAt = null;

    await library.save();
  }

  /**
   * Permanently delete a resource by ID.
   *
   * @param {number | Library} model - The model or ID of the resource.
   * @returns {Promise<void>}
   */
  async delete(model: number | Library): Promise<void> {
    const library: Library = model instanceof Library ? model : await this.model.findOrFail(model);
    await library.delete();
  }
}
