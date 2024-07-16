import { test } from '@japa/runner';
import { SubscriberRole } from '#roles/subscriber_role';
import { LibraryPermission } from '#permissions/library_permission';

test.group('Roles / SubscriberRole', () => {
  test('it should have `subscriber` code', async ({ assert }) => {
    assert.equal(SubscriberRole.CODE, 'subscriber');
  });

  test('it should have permissions', async ({ assert }) => {
    const permissions: string[] = [LibraryPermission.READ, LibraryPermission.LIST];

    assert.deepEqual(SubscriberRole.PERMISSIONS, permissions);
  });
});
