import { test } from '@japa/runner';
import { Service } from '#services/service';

class TestService extends Service {}

test.group('Services / Service', () => {
  test('it should get and set pageCount', async ({ assert }) => {
    // Arrangements
    const pageCount: number = 10;
    const service: TestService = new TestService();

    // Actions
    service.setPageCount(pageCount);

    // Assertions
    assert.equal(service.getPageCount(), pageCount);
  });

  test('it should get and set page', async ({ assert }) => {
    // Arrangements
    const page: number = 2;
    const service: TestService = new TestService();

    // Actions
    service.setPage(page);

    // Assertions
    assert.equal(service.getPage(), page);
  });

  test('it should initialize with default values', async ({ assert }) => {
    // Arrangements
    const service: TestService = new TestService();

    // Assertions
    assert.isTrue(Number.isInteger(service.getPage()));
    assert.isTrue(Number.isInteger(service.getPageCount()));

    assert.isTrue(service.getPage() >= 1);
    assert.isTrue(service.getPageCount() >= 1);
  });
});
