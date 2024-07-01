import { BaseModel } from '@adonisjs/lucid/orm';
import { HttpContext } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';

export type ServiceContext = {
  model?: typeof BaseModel | any;
  ctx?: HttpContext;
};

@inject()
export abstract class Service {
  private page: number = 1;
  private pageCount: number = 15;
  private queries: object = {};
  protected declare model: typeof BaseModel | any;
  protected declare ctx: typeof HttpContext | any;

  constructor({ model, ctx }: ServiceContext = {}) {
    if (model) {
      this.model = model;
    }

    if (ctx) {
      this.ctx = ctx;
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

  getPage(): number {
    return this.page;
  }

  setPageCount(pageCount: number): void {
    this.pageCount = pageCount;
  }

  getPageCount(): number {
    return this.pageCount;
  }

  setQueries(queries: object): void {
    this.queries = queries;
  }

  getQueries(): object {
    return this.queries;
  }

  mergeQueries(queries: object): void {
    this.queries = Object.assign({}, this.queries, queries);
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
