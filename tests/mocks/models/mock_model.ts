import sinon from 'sinon';

export const FakeModel = {
  query: sinon.stub().returnsThis(),

  items: [],
  attributes: {},

  mockAttributes: function (attributes: object | any) {
    this.attributes = attributes;

    return this.attributes;
  },

  count: function () {
    return this.items.length;
  },

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

  first: sinon.stub().callsFake(() => {
    return {};
  }),

  create: sinon.stub().callsFake(function (attributes: object) {
    // @ts-ignore
    return { ...attributes, id: this.count() + 1 };
  }),

  save: sinon.stub().callsFake(function () {
    // @ts-ignore
    Object.assign(this, { ...this.attributes, id: this.count() + 1 });

    // @ts-ignore
    return { ...this.attributes, id: this.count() + 1 };
  }),
};
