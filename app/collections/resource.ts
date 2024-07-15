import type { LucidModel } from '@adonisjs/lucid/types/model';
import isEmpty from 'lodash/isEmpty.js';

export type CollectionItem = Partial<LucidModel> | { [key: string]: any };

export type CollectionResource<M> = { meta: { [key: string]: any }; data: M[] };

export type AllowedKeys = 'self' | 'update' | 'archive' | 'restore' | 'destroy' | any;

export type CollectionLinks = { [key in AllowedKeys]?: CollectionLink };

export type CollectionLink = {
  rel: string;
  method: string;
  href: string;
  type: string;
  id?: string | number;
};

export default abstract class Resource<T> {
  relatedLinks: AllowedKeys[] = ['self', 'update', 'archive', 'restore', 'destroy'];
  readonly #items: T[];

  /**
   * Creates an instance of Resource.
   * @param {Partial<any>[]} items - The items to be included in the resource.
   */
  constructor(items: Partial<T>[]) {
    this.#items = items.map((item: Partial<T>) => this.withLinks(this.prepare(item)));
  }

  /**
   * Creates a collection resource.
   * @template T
   * @template R
   * @param {(Partial<{ rows: any[] }> & T) | any} query - The query result containing rows and pagination info.
   * @returns {CollectionResource<T>} The collection resource.
   */
  static collection<T, R extends Resource<T>>(
    this: new (items: Partial<T>[]) => R,
    query: (Partial<{ rows: any[] }> & T) | any
  ): CollectionResource<T> {
    const rows: T[] = 'rows' in query ? query.rows : query || [];
    const items: T[] = rows.map((r: any) => r.serialize());
    const instance: R = new this(items);

    return {
      meta: !isEmpty(instance.meta({ query, items }))
        ? instance.meta({ query, items })
        : {
            total: query.total ?? items.length,
            perPage: query.perPage,
            currentPage: query.currentPage,
            lastPage: query.lastPage,
            firstPage: query.firstPage,
            firstPageUrl: '/?page=1',
            lastPageUrl: '/?page=' + (query.lastPage ?? ''),
            nextPageUrl:
              query.currentPage < query.lastPage ? `/?page=${query.currentPage + 1}` : null,
            previousPageUrl: query.currentPage > 1 ? `/?page=${query.currentPage - 1}` : null,
          },
      data: instance.get(),
    };
  }

  meta(_opts?: { query?: any; items?: any[] }): { [key: string]: any } {
    return {};
  }

  /**
   * Returns the type of the resource.
   * @returns {string} The type of the resource.
   */
  abstract type(): string;

  /**
   * Prepares an item for inclusion in the resource.
   * @param {Partial<any>} item - The item to prepare.
   * @returns {any} The prepared item.
   */
  abstract prepare(item: Partial<T>): T;

  /**
   * Returns the items in the resource.
   * @returns {any[]} The items in the resource.
   */
  items(): T[] {
    return this.#items;
  }

  /**
   * Generates the links for a given item.
   * @param {any} item - The item for which to generate links.
   * @returns {CollectionLinks} The generated links.
   */
  links(item: T): CollectionLinks {
    const id: string | number | undefined = (item as object).hasOwnProperty('id')
      ? (item as { id: number | string }).id
      : undefined;

    return this.filteredLinks(
      {
        self: {
          rel: 'self',
          method: 'GET',
          href: `${this.type()}/${id}`,
          id: id,
          type: this.type(),
        },
        update: {
          rel: 'update',
          method: 'PUT',
          href: `${this.type()}/${id}`,
          id: id,
          type: this.type(),
        },
        archive: {
          rel: 'archive',
          method: 'DELETE',
          href: `${this.type()}/${id}`,
          id: id,
          type: this.type(),
        },
        restore: {
          rel: 'restore',
          method: 'PATCH',
          href: `${this.type()}/${id}`,
          id: id,
          type: this.type(),
        },
        destroy: {
          rel: 'destroy',
          method: 'DELETE',
          href: `${this.type()}/${id}`,
          id: id,
          type: this.type(),
        },
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
   * Filters the links based on allowed keys.
   * @param {CollectionLinks} links - The links to filter.
   * @param {AllowedKeys} keys - The allowed keys.
   * @returns {CollectionLinks} The filtered links.
   */
  filteredLinks(links: CollectionLinks, keys: AllowedKeys): CollectionLinks {
    let filtered: CollectionLinks = {};

    for (const key of keys) {
      if (key in links) {
        filtered[key] = links[key];
      }
    }

    return filtered;
  }

  /**
   * Adds links to an item.
   * @param {any} item - The item to add links to.
   * @returns {any & { links: CollectionLinks }} The item with added links.
   */
  withLinks(item: T): T & { links: CollectionLinks | undefined } {
    return Object.assign({
      ...item,
      links: isEmpty(this.links(item)) ? undefined : this.links(item),
    });
  }

  /**
   * Returns the items in the resource.
   * @returns {any[]} The items in the resource.
   */
  get(): T[] {
    return this.#items;
  }
}
