import isEmpty from 'lodash/isEmpty.js';

export type AllowedKeys = 'self' | 'update' | 'archive' | 'restore' | 'destroy' | any;

export type ResourceLink = {
  rel: string;
  method: string;
  type: string;
  href?: string;
  id?: string | number;
};

export type ResourceLinks = { [key in AllowedKeys]?: ResourceLink };

export type ResourceItem<T> = T & { links: ResourceLinks | undefined };

export type CollectionMetadata = {
  total?: number;
  perPage?: number;
  currentPage?: number;
  lastPage?: number;
  firstPage?: number;
  firstPageUrl?: string;
  lastPageUrl?: string;
  nextPageUrl?: string;
  previousPageUrl?: string;
  [key: string]: any;
};

export type ResourceCollection<T> = { data: ResourceItem<T>[]; meta: CollectionMetadata };

export default abstract class Resource<T> {
  relatedLinks: AllowedKeys[] = ['self', 'update', 'archive', 'restore', 'destroy'];

  readonly #item: T;

  /**
   * Creates an instance of Resource.
   * @param {Partial<any>} item - The items to be included in the resource.
   */
  constructor(item: Partial<T>) {
    this.#item = this.withLinks(this.prepare(item));
  }

  /**
   * Creates a collection resource.
   * @template T
   * @template R
   * @param {(Partial<{ rows: any[] }> & T) | any} query - The query result containing rows and pagination info.
   * @returns {CollectionResource<T>} The collection resource.
   */
  static collection<T, R extends Resource<T>>(
    this: new (item: Partial<T>) => R,
    query: (Partial<{ rows: any[] }> & T) | any
  ): ResourceCollection<T> {
    const rows: T[] = 'rows' in query ? query.rows : query || [];
    const items: ResourceItem<T>[] = rows
      .map((r: any) => new this(r.serialize()))
      .map((r: any) => r.get());
    const instance: R = new this(items?.[0]);

    return {
      meta: instance.meta(query, items),
      data: items,
    };
  }

  /**
   * Prepares an item for inclusion in the resource.
   * @param {Partial<any>} item - The item to prepare.
   * @returns {any} The prepared item.
   */
  abstract prepare(item: Partial<T>): T;

  /**
   * Returns the type of the resource.
   * @returns {string} The type of the resource.
   */
  abstract type(): string;

  /**
   * Adds links to an item.
   * @param {any} item - The item to add links to.
   * @returns {ResourceItem<any>} The item with added links.
   */
  withLinks(item: T): ResourceItem<T> {
    return Object.assign({
      ...item,
      links: isEmpty(this.getRelatedLinks()) ? undefined : this.links(item),
    });
  }

  /**
   * Filters the links based on allowed keys.
   * @param {ResourceLinks} links - The links to filter.
   * @param {AllowedKeys} keys - The allowed keys.
   * @returns {ResourceLinks} The filtered links.
   */
  filteredLinks(links: ResourceLinks, keys: AllowedKeys): ResourceLinks {
    let filtered: ResourceLinks = {};

    for (const key of keys) {
      if (key in links) {
        filtered[key] = links[key];
      }
    }

    return filtered;
  }

  /**
   * Generates the links for a given item.
   * @param {any} item - The item for which to generate links.
   * @returns {ResourceLinks} The generated links.
   */
  links(item: T): ResourceLinks {
    const id: string | number | undefined = (item as object).hasOwnProperty('id')
      ? (item as { id: number | string }).id
      : undefined;

    return this.filteredLinks(
      {
        self: Object.assign({
          rel: 'self',
          method: 'GET',
          href: id ? `${this.type()}/${id}` : undefined,
          id: id,
          type: this.type(),
        }),
        update: Object.assign({
          rel: 'update',
          method: 'PUT',
          href: id ? `${this.type()}/${id}` : undefined,
          id: id,
          type: this.type(),
        }),
        archive: Object.assign({
          rel: 'archive',
          method: 'DELETE',
          href: id ? `${this.type()}/${id}/archive` : undefined,
          id: id,
          type: this.type(),
        }),
        restore: Object.assign({
          rel: 'restore',
          method: 'PATCH',
          href: id ? `${this.type()}/${id}/restore` : undefined,
          id: id,
          type: this.type(),
        }),
        destroy: Object.assign({
          rel: 'destroy',
          method: 'DELETE',
          href: id ? `${this.type()}/${id}` : undefined,
          id: id,
          type: this.type(),
        }),
      },
      this.getRelatedLinks()
    );
  }

  /**
   * Retrieve the related links array.
   * @returns {AllowedKeys[]} The related links.
   */
  getRelatedLinks(): AllowedKeys[] {
    return this.relatedLinks;
  }

  /**
   * Returns the items in the resource with guaranteed links object,
   * even if it is empty.
   * @returns {ResourceItem<any>} The items in the resource.
   */
  get(): ResourceItem<T> {
    return this.#item as T & { links: ResourceLinks };
  }

  /**
   * Retrieve the metadata of the collection.
   * Metadata can be pagination data or any object
   * deemed appropriate for the resource collection.
   *
   * @param {Partial<CollectionMetadata>} [query] - Optional query object containing pagination information.
   * @param {any[]} [items] - Optional array of items to calculate metadata if not provided in the query.
   * @returns {CollectionMetadata} - The metadata for the collection, including pagination information.
   */
  meta(query?: Partial<CollectionMetadata>, items?: any[]): CollectionMetadata {
    return Object.assign({
      total: query?.total ?? items?.length,
      perPage: query?.perPage,
      currentPage: query?.currentPage,
      lastPage: query?.lastPage,
      firstPage: query?.firstPage,
      firstPageUrl: query?.firstPage ? '/?page=1' : undefined,
      lastPageUrl: query?.lastPage ? '/?page=' + (query?.lastPage ?? '') : undefined,
      nextPageUrl:
        (query?.currentPage ?? 0) < (query?.lastPage ?? 0)
          ? `/?page=${(query?.currentPage ?? 0) + 1}`
          : undefined,
      previousPageUrl:
        (query?.currentPage ?? 0) > 1 ? `/?page=${(query?.currentPage ?? 0) - 1}` : undefined,
    });
  }
}
