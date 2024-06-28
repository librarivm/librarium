import { Service } from '#services/service';
import Library from '#models/library';

export default class LibraryService extends Service {
  model: typeof Library = Library;

  async list() {
    return this.model.query().paginate(this.getPage(), this.getPageCount());
  }
}
