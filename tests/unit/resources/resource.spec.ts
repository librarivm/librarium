import { test } from '@japa/runner';
import Resource, {
  AllowedKeys,
  CollectionMetadata,
  ResourceCollection,
  ResourceItem,
  ResourceLink,
  ResourceLinks,
} from '#resources/resource';
import Test from '#tests/mocks/models/mock_model';
import kebabCase from 'lodash/kebabCase.js';
import { TestFactory } from '#tests/mocks/factories/test_factory';
import sample from 'lodash/sample.js';

type TestAttributes = {
  id?: string | number;
  name: string;
  code: string;
  slug?: string | null;
  description?: string | null;
};

class TestResource extends Resource<TestAttributes> {
  prepare(item: Test): TestAttributes {
    return {
      name: item.name,
      code: item.code,
      description: item.description,
      slug: kebabCase(item.code),
    };
  }

  type(): string {
    return 'tests';
  }

  getRelatedLinks(): AllowedKeys[] {
    return ['self'];
  }
}

test.group('Collections / Resource', (group) => {
  let $items: Test[];
  let $item: Test;
  let $collectionLength: number = 10;

  group.setup(async () => {
    $items = await TestFactory.makeMany($collectionLength);
    $item = sample($items) as Test;
  });

  test('it should accept and get a resource model upon instantiation', async ({ assert }) => {
    // Arrangements
    const collection: TestResource = new TestResource($item);

    // Actions
    const actual: TestAttributes = collection.get();

    // Assertions
    assert.isObject(actual);
    assert.isTrue('name' in actual);
    assert.isTrue('links' in actual);
  });

  test('it should return the prepared items with links via `get` method', async ({ assert }) => {
    // Arrangements
    const collection: TestResource = new TestResource($item);

    // Actions
    const actual: ResourceItem<TestAttributes> = collection.get();

    // Assertions
    assert.isObject(actual);
    assert.isTrue(actual.hasOwnProperty('name'));
    assert.isTrue(actual.hasOwnProperty('code'));
    assert.isTrue(actual.hasOwnProperty('slug'));
    assert.isTrue(actual.hasOwnProperty('description'));
    assert.isTrue(actual.hasOwnProperty('links'));
    assert.isTrue(actual.links?.hasOwnProperty('self'));
    assert.isFalse(actual.links?.hasOwnProperty('archive'));
  });

  test('it should return the transformed item when invoking prepare', async ({ assert }) => {
    // Arrangements
    const collection: TestResource = new TestResource($item);
    const expected: Test = sample($items) as Test;

    // Actions
    const actual: TestAttributes = collection.prepare(expected);

    // Assertions
    assert.equal(actual.code, expected.code);
    assert.equal(actual.slug, kebabCase(expected.code));
  });

  test('it should generate links for the item', async ({ assert }) => {
    // Arrangements
    const collection: TestResource = new TestResource($item);

    // Actions
    const links: ResourceLinks = collection.links($item);

    // Assertions
    assert.isObject(links);
    Object.values(links).forEach((link?: ResourceLink) => {
      assert.property(link, 'rel');
      assert.property(link, 'method');
      assert.property(link, 'href');
      assert.property(link, 'type');
      assert.property(link, 'id');
    });
  });

  test('it should retrieved the modified meta object via `meta` method', async ({ assert }) => {
    // Arrangements
    const collection: TestResource = new TestResource($item);

    // Actions
    const meta: CollectionMetadata = collection.meta();

    // Assertions
    assert.isObject(meta);
    assert.property(meta, 'total');
    assert.property(meta, 'perPage');
    assert.property(meta, 'perPage');
    assert.property(meta, 'currentPage');
    assert.property(meta, 'lastPage');
    assert.property(meta, 'firstPage');
    assert.property(meta, 'firstPageUrl');
    assert.property(meta, 'lastPageUrl');
    assert.property(meta, 'nextPageUrl');
    assert.property(meta, 'previousPageUrl');
  });

  test('it should return the prepared items with links via static `collection` method', async ({
    assert,
  }) => {
    // Actions
    const collection: ResourceCollection<TestAttributes> = TestResource.collection($items);

    // Assertions
    assert.isArray(collection.data);
    collection.data.forEach((item: ResourceItem<TestAttributes>) => {
      assert.property(item, 'links');
      assert.property(item, 'name');
      assert.property(item, 'code');
      assert.property(item, 'slug');
      assert.property(item, 'description');
    });
  });
});
