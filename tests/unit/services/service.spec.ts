import { HttpQueries, Service } from '#services/service';
import Test from '#tests/mocks/models/mock_model';
import SandboxModel from '#tests/mocks/models/sandbox_model';
import { ModelQueryBuilder } from '@adonisjs/lucid/orm';
import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { SinonStub } from 'sinon';

class TestService extends Service {
  // @ts-ignore
  async save(model: any, attributes: any) {
    return Promise.resolve({ model, attributes });
  }
}

test.group('Services', (group) => {
  let $service: TestService;
  let $sandbox: SandboxModel;

  group.each.setup(async () => {
    $service = new TestService();
    $sandbox = new SandboxModel();
  });

  group.each.teardown(async () => {
    $sandbox.restore();
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
    const model: typeof Test = Test;

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
    assert.isArray($service.getSupportedOrderBy());
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

  test('it should accept and return the query builder when invoking withQueryAware', async ({
    assert,
  }) => {
    // Arrangements
    $service.setModel(Test);
    const model: typeof Test | any = $service.getModel();

    // Actions
    const query = $service.withQueryAware(model.query());

    // Assertions
    assert.isTrue(query instanceof ModelQueryBuilder);
  });

  test('it should accept and return the query builder when invoking withPreload', async ({
    assert,
  }) => {
    // Arrangements
    $service.setModel(Test);
    const model: typeof Test | any = $service.getModel();
    const hasWithPreloadStub: SinonStub<any, any> = $sandbox
      .stub($service, 'hasWithPreload')
      .returns(false);
    $sandbox.stub(model, 'query').returns({
      if: $sandbox.getInstance().stub().resolves(ModelQueryBuilder),
    });

    // Actions
    const query = await $service.withPreload(model.query());

    // Assertions
    assert.isTrue(model.query().if.calledOnce);
    assert.isTrue(hasWithPreloadStub.calledOnce);
    assert.equal(query, ModelQueryBuilder);
  });
});
