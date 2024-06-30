import sinon from 'sinon';
import { LibraryFactory } from '#database/factories/library_factory';
import { FakeModel } from '#tests/mocks/models/mock_model';
import Library from '#models/library';

const items = await LibraryFactory.makeMany(20);
const libraries = items.map((item, i) => ({
  ...item,
  id: i + 1,
}));

export const MockLibrary: typeof FakeModel = {
  ...sinon.mock(Library),

  query: sinon.stub().returnsThis(),

  paginate: sinon.stub().callsFake((page: number = 1, perPage: number = 15) => {
    const start = (page - 1) * perPage;
    const end = start + perPage;

    const meta = {
      total: libraries.length,
      perPage: perPage,
      page: page,
      lastPage: Math.ceil(libraries.length / perPage),
    };

    return {
      rows: libraries.slice(start, end),
      forEach: () => libraries.slice(start, end),
      meta,
      ...meta,
    };
  }),

  find: sinon.stub().callsFake((id: number) => {
    return libraries.find((item) => item.id === id) || null;
  }),

  first: sinon.stub().callsFake(() => {
    return libraries?.[0] || null;
  }),
};
