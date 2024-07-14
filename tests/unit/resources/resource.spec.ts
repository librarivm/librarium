import Resource, { CollectionItem, CollectionLink, CollectionLinks } from '#collections/resource';
import kebabCase from 'lodash/kebabCase.js';
import sample from 'lodash/sample.js';
import { test } from '@japa/runner';
import Test from '#tests/mocks/models/mock_model';
import { TestFactory } from '#tests/mocks/factories/test_factory';

type TestAttributes = {
  id?: string | number;
  name: string;
  code: string;
  slug?: string | null;
  description?: string | null;
};

class TestResource extends Resource<TestAttributes> {
  prepare(item: Test): TestAttributes {
    return { ...item, slug: kebabCase(item.code) };
  }

  type(): string {
    return 'tests';
  }
}

test.group('Collections / Resource', (group) => {
  let $items: TestAttributes[];
  let $collection: TestResource;
  let $collectionLength: number = 10;

  group.setup(async () => {
    $items = await TestFactory.makeMany(10);
    $collection = new TestResource($items);
  });

  test('it should accept an array of resources upon instantiation', async ({ assert }) => {
    // Actions
    const collection: TestResource = new TestResource($items);
    const items: TestAttributes[] = collection.items();

    // Assertions
    assert.isArray(items);
    assert.lengthOf(items, $collectionLength);
  });

  test('it should return the transformed item when invoking prepare', async ({ assert }) => {
    // Arrangements
    const expected: Test = sample($items) as Test;

    // Actions
    const actual: TestAttributes = $collection.prepare(expected);

    // Assertions
    assert.equal(actual.code, expected.code);
    assert.equal(actual.slug, kebabCase(expected.code));
  });

  test('it should generate links for each item', async ({ assert }) => {
    // Arrangements
    const item: Test = sample($items) as Test;
    const collection: TestResource = new TestResource($items);

    // Actions
    const links: CollectionLinks = collection.links(item);

    // Assertions
    assert.isObject(links);
    Object.values(links).forEach((link?: CollectionLink) => {
      assert.isTrue(link?.hasOwnProperty('rel'));
      assert.isTrue(link?.hasOwnProperty('method'));
      assert.isTrue(link?.hasOwnProperty('href'));
      assert.isTrue(link?.hasOwnProperty('type'));
      assert.isTrue(link?.hasOwnProperty('id'));
    });
  });

  test('it should return the prepared items with links via `get` method', async ({ assert }) => {
    // Actions
    const data: TestAttributes[] = $collection.get();

    // Assertions
    assert.isArray(data);
    data.forEach((item: TestAttributes) => {
      assert.isTrue(item.hasOwnProperty('name'));
      assert.isTrue(item.hasOwnProperty('code'));
      assert.isTrue(item.hasOwnProperty('slug'));
      assert.isTrue(item.hasOwnProperty('description'));
      assert.isTrue(item.hasOwnProperty('links'));
    });
  });

  test('it should return the prepared items with links via static `collection` method', async ({
    assert,
  }) => {
    // Actions
    const collection = TestResource.collection($items);

    // Assertions
    assert.isArray(collection.data);
    collection.data.forEach((item: CollectionItem) => {
      assert.isTrue(item.hasOwnProperty('links'));
      assert.isTrue(item.hasOwnProperty('name'));
      assert.isTrue(item.hasOwnProperty('code'));
      assert.isTrue(item.hasOwnProperty('slug'));
      assert.isTrue(item.hasOwnProperty('description'));
    });
  });
});
