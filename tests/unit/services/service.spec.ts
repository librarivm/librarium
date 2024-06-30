import { test } from '@japa/runner';
import { Service } from '#services/service';
import { faker } from '@faker-js/faker';
import { FakeModel } from '#tests/mocks/models/mock_model';

class TestService extends Service {
  // @ts-ignore
  async save(model: any, attributes: any) {
    return Promise.resolve({ model, attributes });
  }
}

test.group('Services', (group) => {
  let $service: TestService;

  group.each.setup(async () => {
    $service = new TestService({ model: FakeModel });
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

  test('it should get and set queries', async ({ assert }) => {
    // Arrangements
    const queries: object = {
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
    const queries: object = {
      search: faker.lorem.sentence(),
      perPage: faker.number.int(),
    };

    const merging: object = {
      pageCount: 10,
    };

    // Actions
    $service.setQueries(queries);

    // Assertions
    $service.mergeQueries(merging);
    assert.deepEqual($service.getQueries(), Object.assign({}, queries, merging));
  });

  test('it should initialize with default values', async ({ assert }) => {
    // Assertions
    assert.isTrue(Number.isInteger($service.getPage()));
    assert.isTrue(Number.isInteger($service.getPageCount()));

    assert.isTrue($service.getPage() >= 1);
    assert.isTrue($service.getPageCount() >= 1);
  });
});
