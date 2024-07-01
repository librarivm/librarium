import isNil from 'lodash/isNil.js';
import sinon from 'sinon';

export const FakeModel = {
  query: sinon.stub().returnsThis(),
  apply: sinon.stub().returnsThis(),
  where: sinon.stub().returnsThis(),
  if: sinon.stub().returnsThis(),

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

  find: sinon.stub().callsFake(function (id: number) {
    // @ts-ignore
    const item = this.items
      .filter((attribute: any) => isNil(attribute.deleted_at))
      .find((attribute: any) => attribute.id === id);

    if (isNil(item)) {
      return null;
    }

    // @ts-ignore
    return Object.assign(this, { ...item });
  }),

  findOrFail: sinon.stub().callsFake(function (id: number) {
    // @ts-ignore
    const item = this.items.find((attribute: any) => attribute.id === id);

    if (isNil(item)) {
      throw new Error('Model Resource not found.');
    }

    // @ts-ignore
    return Object.assign(this, { ...item });
  }),

  first: sinon.stub().callsFake(function () {
    // @ts-ignore
    return this.items?.[0];
  }),

  create: sinon.stub().callsFake(function (attributes: object) {
    // @ts-ignore
    const item = { ...attributes, id: this.count() + 1 };
    // @ts-ignore
    this.items = this.items.concat([item]);
    return item;
  }),

  save: sinon.stub().callsFake(function () {
    // @ts-ignore
    Object.assign(this, { ...this.attributes, id: this.count() + 1 });

    // @ts-ignore
    return this;
  }),

  delete: sinon.stub().callsFake(function () {
    // @ts-ignore
    this.items = this.items.filter((item) => item.id !== this.id);

    // @ts-ignore
    Object.assign(this, { items: this.items });

    // @ts-ignore
    return this;
  }),
};
