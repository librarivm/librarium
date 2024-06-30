import sinon from 'sinon';

export const FakeModel = {
  query: sinon.stub().returnsThis(),

  paginate: sinon.stub().callsFake((page: number, perPage: number) => {
    const meta = {
      total: 0,
      perPage: perPage,
      page: page,
      lastPage: 1,
    };
    return {
      rows: [],
      forEach: () => [],
      meta,
      ...meta,
    };
  }),

  find: sinon.stub().callsFake((id: number) => {
    return id && null;
  }),
};
