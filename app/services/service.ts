import { inject } from '@adonisjs/core';
import { HttpContext, Request } from '@adonisjs/core/http';
import { BaseModel, ModelQueryBuilder } from '@adonisjs/lucid/orm';
import camelCase from 'lodash/camelCase.js';
import isNil from 'lodash/isNil.js';
import isPlainObject from 'lodash/isPlainObject.js';
import isString from 'lodash/isString.js';
import reduce from 'lodash/reduce.js';
import { Authenticator } from '@adonisjs/auth';
import { Authenticators } from '@adonisjs/auth/types';

export type HttpQueriesOrderBy = [column: string, order: 'asc' | 'desc'];

export type HttpQueries = {
  page?: number | string | any;
  per_page?: number | string | any;
  order_by?: string | { [key: number]: HttpQueriesOrderBy };
  q?: string;
  with?: string | string[];
  with_archived?: string | boolean;
  only_archived?: string | boolean;
  [key: string]: any;
};

@inject()
export abstract class Service {
  supportedColumnKeys: string[] = [];
  preloads: string[] = [];
  protected declare request: Request | any;
  protected declare qs: HttpQueries | null;
  protected declare model: typeof BaseModel | any;
  #auth?: Authenticator<Authenticators>;
  #page?: number | string = 1;
  #pageCount?: number | string = 15;

  constructor(protected ctx?: HttpContext) {
    this.setUpAuth(ctx?.auth);
    this.setUpRequest(ctx?.request);
  }

  setUpRequest(request: Request | undefined) {
    this.request = request;
    const input: { [key: string]: any } | null = this.request && this.request.qs();

    if (input) {
      this.qs = {
        ...input,
        page: input.page ?? this.#page,
        per_page: input.per_page ?? this.#pageCount,
      };
      this.setPage(this.qs.page);
      this.setPageCount(this.qs.per_page);
    }
  }

  setUpAuth(auth: any): void {
    this.#auth = auth;
  }

  auth(): Authenticator<Authenticators> | undefined {
    return this.#auth;
  }

  setModel(model: typeof BaseModel | any): void {
    this.model = model;
  }

  getModel(): typeof BaseModel {
    return this.model;
  }

  setPage(page: number): void {
    this.#page = page;
  }

  getPage(): number | string | any {
    return this.#page;
  }

  setPageCount(pageCount: number): void {
    this.#pageCount = pageCount;
  }

  getPageCount(): number | string | any {
    return this.#pageCount;
  }

  setQueries(qs: HttpQueries): void {
    this.qs = qs;
  }

  getQueries(): HttpQueries | null {
    return this.qs;
  }

  mergeQueries(qs: HttpQueries): void {
    this.qs = Object.assign({}, this.qs, qs);
  }

  hasSearch(): boolean {
    return !isNil(this.qs?.q);
  }

  getSearch(): string | any {
    return this.qs?.q;
  }

  hasOrderBy(): boolean {
    return !isNil(this.qs?.order_by);
  }

  getSupportedColumnKeys() {
    return this.supportedColumnKeys;
  }

  getSupportedOrderBy(): string | string[] | any {
    if (!this.qs?.order_by) {
      return [];
    }

    return Object.values(
      isString(this.qs?.order_by) ? [[this.qs?.order_by, 'asc']] : this.qs?.order_by
    ).filter(([key]: any) => this.supportedColumnKeys.includes(key));
  }

  hasWithPreload(): boolean {
    return !isNil(this.qs?.with);
  }

  getWithPreload(): string | string[] | any {
    return this.qs?.with;
  }

  /**
   * Enhances the provided model query builder with search and ordering capabilities.
   *
   * This method takes a ModelQueryBuilder instance and conditionally applies search and ordering
   * logic based on the presence of search and order-by parameters.
   *
   * - If a search term is provided (via `this.hasSearch()`), it adds a `WHERE` clause to search for
   *   the term within the `slug` field using a `LIKE` condition.
   *
   * - If ordering parameters are present (via `this.hasOrderBy()`), it adds `ORDER BY` clauses to
   *   the query:
   *     - If `orderBy` is an array, it iterates through the array and adds each column-order pair
   *       to the query.
   *     - If `orderBy` is a string, it adds a single `ORDER BY` clause using the string value.
   *
   * @param {ModelQueryBuilder} builder - The model query builder instance to enhance.
   * @returns {typeof BaseModel | any} - The enhanced model query builder with search and ordering applied.
   */
  withQueryAware<T extends typeof BaseModel>(builder: ModelQueryBuilder): T | any {
    return this.withPreload(
      builder
        .if(
          this.isOnlyArchived(),
          (query: ModelQueryBuilder): void => {
            if (this.onlyArchived()) {
              query.apply((scopes) => scopes.softDeleted());
            } else {
              query.apply((scopes) => scopes.notSoftDeleted());
            }
          },
          (query: ModelQueryBuilder): void => {
            query.apply((scopes) => scopes.notSoftDeleted());
          }
        )
        .if(this.isWithArchived(), (query: ModelQueryBuilder): void => {
          if (this.withArchived()) {
            query.apply((scopes) => scopes.orSoftDeleted());
          }
        })
        .if(this.hasSearch(), (query: ModelQueryBuilder): void => {
          // TODO: write better search/scout
          const columns: string[] = this.getSupportedColumnKeys();
          const first: string | undefined = columns.shift();
          first && query.where(first, 'LIKE', `%${this.getSearch()}%`);
          columns.forEach((column: string) => {
            query.orWhere(column, 'LIKE', `%${this.getSearch()}%`);
          });
        })
        .if(this.hasOrderBy(), (query: ModelQueryBuilder): void => {
          this.getSupportedOrderBy().forEach(([column, order]: HttpQueriesOrderBy) => {
            query.orderBy(column, order);
          });
        })
    );
  }

  /**
   * This method modifies the query builder to include related models (preload)
   * if the condition specified by `this.hasWithPreload()` is true. It supports
   * both single preload and multiple preloads.
   *
   * @param {ModelQueryBuilder} builder - The model query builder instance to enhance.
   * @returns {typeof BaseModel | any} - The enhanced model query builder with search and ordering applied.
   */
  withPreload(builder: ModelQueryBuilder): typeof BaseModel | any {
    return builder.if(this.hasWithPreload(), async (query: ModelQueryBuilder): Promise<void> => {
      const preloads: string[] = isString(this.getWithPreload())
        ? [this.getWithPreload()]
        : [...this.getWithPreload()];

      preloads.map(async (preload: string) => {
        if (this.isValidPreload(preload)) {
          query.preload(preload);
        }
      });
    });
  }

  /**
   * Checks if the provided preload string is valid.
   *
   * This method takes a preload string and checks whether it is included in the
   * list of preloads. It returns true if the preload string is found in the list,
   * indicating it is a valid preload. Otherwise, it returns false.
   *
   * @param {string} preload - The preload string to be validated.
   * @returns {boolean} - Returns true if the preload string is valid, otherwise false.
   */
  isValidPreload(preload: string): boolean {
    return this.preloads.includes(preload);
  }

  toCamelCaseKeys(attributes: string | { [key: string]: any }): string | { [key: string]: any } {
    if (isPlainObject(attributes)) {
      return reduce(
        attributes as unknown as string[],
        (result: { [key: string]: any }, value: string, key: string | number) => {
          const camelKey: string = camelCase(key.toString());
          result[camelKey] = this.toCamelCaseKeys(value);
          return result;
        },
        {}
      );
    }

    return attributes;
  }

  /**
   * Check query value of `only_archived`.
   *
   * @returns {boolean} - Returns true if the query string has `only_archived`.
   */
  isOnlyArchived(): boolean {
    return 'only_archived' in (this.qs || {});
  }

  /**
   * Check if `only_archived` is true or false.
   *
   * @returns {boolean} - Returns true if the query string has `only_archived`.
   */
  onlyArchived(): boolean {
    return this.qs?.only_archived === 'true' || this.qs?.only_archived === true;
  }

  /**
   * Check query value of `with_archived`.
   *
   * @returns {boolean} - Returns true if the query string has `with_archived`.
   */
  isWithArchived(): boolean {
    return 'with_archived' in (this.qs || {});
  }

  /**
   * Check if `with_archived` is true or false.
   *
   * @returns {boolean} - Returns true if the query string has `with_archived`.
   */
  withArchived(): boolean {
    return this.qs?.with_archived === 'true' || this.qs?.with_archived === true;
  }
}
