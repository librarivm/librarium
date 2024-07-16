import { test } from '@japa/runner';
import { SuperadminRole } from '#roles/superadmin_role';

test.group('Roles / SuperadminRole', () => {
  test('it should have `superadmin` code', async ({ assert }) => {
    assert.equal(SuperadminRole.CODE, 'superadmin');
  });

  test('it should have permissions', async ({ assert }) => {
    const permissions: string[] = ['*'];

    assert.deepEqual(SuperadminRole.PERMISSIONS, permissions);
  });
});
