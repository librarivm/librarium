import { inject } from '@adonisjs/core';
import { HttpContext, Request } from '@adonisjs/core/http';
import { BaseModel, ModelQueryBuilder } from '@adonisjs/lucid/orm';
import isNil from 'lodash/isNil.js';
import isString from 'lodash/isString.js';

export type HttpQueriesOrderBy = [column: string, order: 'asc' | 'desc'];

export type HttpQueries = {
  page?: number | string | any;
  per_page?: number | string | any;
  order_by?: string | { [key: number]: HttpQueriesOrderBy };
  q?: string;
  with?: string | string[];
  [key: string]: any;
};

@inject()
export abstract class Service {
  supportedColumnKeys: string[] = [];
  protected declare request: Request | any;
  protected declare qs: HttpQueries | null;
  protected declare model: typeof BaseModel | any;
  #page?: number | string = 1;
  #pageCount?: number | string = 15;

  constructor(protected ctx?: HttpContext) {
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
  withQueryAware(builder: ModelQueryBuilder): typeof BaseModel | any {
    return this.withPreload(
      builder
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
        query.preload(preload);
      });
    });
  }
}
