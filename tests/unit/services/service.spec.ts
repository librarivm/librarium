import { HttpQueries, Service } from '#services/service';
import { FakeModel } from '#tests/mocks/models/mock_model';
import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';

class TestService extends Service {
  // @ts-ignore
  async save(model: any, attributes: any) {
    return Promise.resolve({ model, attributes });
  }
}

test.group('Services', (group) => {
  let $service: TestService;

  group.each.setup(async () => {
    $service = new TestService();
  });

  test('it should initialize with default values', async ({ assert }) => {
    // Assertions
    assert.isTrue(Number.isInteger($service.getPage()));
    assert.isTrue(Number.isInteger($service.getPageCount()));

    assert.isTrue($service.getPage() >= 1);
    assert.isTrue($service.getPageCount() >= 1);
  });

  test('it should get and set pageCount', async ({ assert }) => {
    // Arrangements
    const pageCount: number = 10;

    // Actions
    $service.setPageCount(pageCount);

    // Assertions
    assert.equal($service.getPageCount(), pageCount);
  });

  test('it should get and set page', async ({ assert }) => {
    // Arrangements
    const page: number = 2;

    // Actions
    $service.setPage(page);

    // Assertions
    assert.equal($service.getPage(), page);
  });

  test('it should get and set model', async ({ assert }) => {
    // Arrangements
    const model: typeof FakeModel = FakeModel;

    // Actions
    $service.setModel(model);

    // Assertions
    assert.equal($service.getModel(), model);
  });

  test('it should get and set queries', async ({ assert }) => {
    // Arrangements
    const queries: HttpQueries = {
      search: faker.lorem.sentence(),
      perPage: faker.number.int(),
    };

    // Actions
    $service.setQueries(queries);

    // Assertions
    assert.equal($service.getQueries(), queries);
  });

  test('it should merge queries', async ({ assert }) => {
    // Arrangements
    const queries: HttpQueries = {
      search: faker.lorem.sentence(),
      perPage: faker.number.int(),
    };

    const merging: HttpQueries = {
      pageCount: 10,
    };

    // Actions
    $service.setQueries(queries);

    // Assertions
    $service.mergeQueries(merging);
    assert.deepEqual($service.getQueries(), Object.assign({}, queries, merging));
  });

  test('it should get and check search query parameter', async ({ assert }) => {
    // Arrangements
    const queries: HttpQueries = {
      q: faker.lorem.sentence(),
      per_page: faker.number.int(),
    };

    // Actions
    $service.setQueries(queries);

    // Assertions
    assert.isTrue($service.hasSearch());
    assert.equal($service.getSearch(), queries.q);
  });

  test('it should get and check order_by query parameter', async ({ assert }) => {
    // Arrangements
    const queries: HttpQueries = {
      order_by: faker.lorem.word(),
    };

    // Actions
    $service.setQueries(queries);

    // Assertions
    assert.isTrue($service.hasOrderBy());
    assert.equal($service.getOrderBy(), queries.order_by);
  });

  test('it should get and check withPreload query parameter', async ({ assert }) => {
    // Arrangements
    const queries: HttpQueries = {
      with: [faker.lorem.word(), faker.lorem.word()],
    };

    // Actions
    $service.setQueries(queries);

    // Assertions
    assert.isTrue($service.hasWithPreload());
    assert.equal($service.getWithPreload(), queries.with);
  });

  test('it should accept and return the model when invoking withQueryAware', async ({ assert }) => {
    // Arrangements
    $service.setModel(FakeModel);
    const model: typeof FakeModel | any = $service.getModel();

    // Actions
    const query = $service.withQueryAware(model.query());

    // Assertions
    assert.equal(query, FakeModel);
  });

  test('it should accept and return the model when invoking withPreload', async ({ assert }) => {
    // Arrangements
    $service.setModel(FakeModel);
    const model: typeof FakeModel | any = $service.getModel();

    // Actions
    const query = $service.withPreload(model.query());

    // Assertions
    assert.equal(query, FakeModel);
  });
});
