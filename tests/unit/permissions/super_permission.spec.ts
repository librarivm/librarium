import { SuperPermission } from '#permissions/super_permission';
import { test } from '@japa/runner';

test.group('Permissions / SuperPermission', () => {
  test('it should have `*` permission', async ({ assert }) => {
    assert.equal(SuperPermission.ALL, '*');
  });
});
