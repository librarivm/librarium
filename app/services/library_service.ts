import { Service } from '#services/service';
import Library from '#models/library';
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model';

export interface LibraryAttributes {
  name: string;
  slug: string;
  description: string;
  metadata: JSON;
  is_private: boolean;
  user_id: bigint;
  type_id: bigint;
}

export default class LibraryService extends Service {
  /**
   * List resources with pagination.
   *
   * @returns {Promise<ModelPaginatorContract<Library>>} Paginated results.
   */
  async list(): Promise<ModelPaginatorContract<Library>> {
    return this.model.query().paginate(this.getPage(), this.getPageCount());
  }

  /**
   * Find a resource by ID.
   *
   * @param {number} id - The ID of the resource.
   * @returns {Promise<Library|null>} The resource if found, otherwise null.
   */
  async find(id: number): Promise<Library | null> {
    // Implementation here
    console.log(id);
    return null;
  }

  /**
   * Create a new resource.
   *
   * @param {LibraryAttributes} attributes - The attributes for the new resource.
   * @returns {Promise<Library>} The created resource.
   */
  async save(attributes: LibraryAttributes): Promise<Library> {
    // Implementation here
    console.log(attributes);
    return Promise.resolve(new Library());
  }

  /**
   * Update an existing resource.
   *
   * @param {number} id - The ID of the resource.
   * @param {LibraryAttributes} attributes - The new attributes for the resource.
   * @returns {Promise<Library>} The updated resource.
   */
  async update(id: number, attributes: LibraryAttributes): Promise<Library> {
    // Implementation here
    console.log(id, attributes);
    return Promise.resolve(new Library());
  }

  /**
   * Trash a resource by updating the deleted_at column.
   *
   * @param {number} id - The ID of the resource.
   * @returns {Promise<void>}
   */
  async archive(id: number): Promise<void> {
    // Implementation here
    console.log(id);
  }

  /**
   * Permanently delete a resource by ID.
   *
   * @param {number} id - The ID of the resource.
   * @returns {Promise<void>}
   */
  async delete(id: number): Promise<void> {
    // Implementation here
    console.log(id);
  }
}
