import { BaseModel } from '@adonisjs/lucid/orm';
import { HttpContext, Request } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';
import isNil from 'lodash/isNil.js';

export type ServiceContext = {
  model?: typeof BaseModel | any;
  ctx?: HttpContext;
};

export type HttpQueries = {
  page?: number | string | any;
  per_page?: number | string | any;
  order_by?: string;
  q?: string;
  [key: string]: any;
};

@inject()
export abstract class Service {
  protected declare request: Request | any;
  protected declare qs: HttpQueries | null;
  protected declare model: typeof BaseModel | any;
  private page?: number | string = 1;
  private pageCount?: number | string = 15;

  constructor(protected ctx?: HttpContext) {
    this.setUpRequest(ctx?.request);
  }

  setUpRequest(request: Request | undefined) {
    this.request = request;
    const input: { [key: string]: any } | null = this.request && this.request.qs();

    if (input) {
      this.qs = {
        ...input,
        page: input.page ?? this.page,
        per_page: input.per_page ?? this.pageCount,
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
    this.page = page;
  }

  getPage(): number | string | any {
    return this.page;
  }

  setPageCount(pageCount: number): void {
    this.pageCount = pageCount;
  }

  getPageCount(): number | string | any {
    return this.pageCount;
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

  getOrderBy(): string | any {
    return this.qs?.order_by;
  }

  /**
   * Create or update a resource.
   *
   * @param {any} model - The model to use to save the resource.
   * @param {any} attributes - The attributes for the new resource.
   * @returns {Promise<any>} The created resource.
   */
  abstract save(model: any, attributes: any): Promise<any>;
}
