export class Service {
  page: number = 1;
  pageCount: number = 15;

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
}
