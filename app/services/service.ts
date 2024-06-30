import { BaseModel } from '@adonisjs/lucid/orm';

type ServiceContext = {
  model: typeof BaseModel | any;
};

export abstract class Service {
  private page: number = 1;
  private pageCount: number = 15;
  private queries: object = {};
  model: typeof BaseModel | any;

  constructor({ model }: ServiceContext) {
    this.model = model;
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
}
