import { PermissionFactory } from '#database/factories/permission_factory';
import Permission from '#models/permission';
import PermissionService, { PermissionAttributes } from '#services/permission_service';
import { Service } from '#services/service';
import SandboxModel from '#tests/mocks/models/sandbox_model';
import { test } from '@japa/runner';
import { SinonStub } from 'sinon';

test.group('Services / PermissionService', (group) => {
  let $service: PermissionService;
  let $sandbox: SandboxModel;

  group.each.setup(async () => {
    $service = new PermissionService();
    $sandbox = new SandboxModel();
  });

  group.each.teardown(async () => {
    $sandbox.restore();
  });

  test('it extends the Service class', async ({ assert }) => {
    const service: PermissionService | any = new PermissionService();
    assert.isTrue(service instanceof Service, 'PermissionService should extend Service');
  });

  test('it retrieves the permissions path of permissions', async ({ assert }) => {
    const path: string = $service.path();
    assert.isString(path);
  });

  test('it retrieves the list of permissions from disk', async ({ assert }) => {
    // Actions
    const permissions: PermissionAttributes[] = await $service.permissions();

    // Assertions
    assert.isArray(permissions);
    permissions.forEach((permission: PermissionAttributes) => {
      assert.isTrue(permission.hasOwnProperty('code'));
      assert.isTrue(permission.hasOwnProperty('group'));
    });
  });

  test('it installs the retrieved permissions list', async ({ assert }) => {
    // Arrangements
    const permissions: Permission[] = await PermissionFactory.makeMany(10);

    $sandbox.stub(PermissionService.prototype, 'permissions').resolves(permissions);
    const stub: SinonStub<any, any> = $sandbox.stub(Permission, 'create').resolvesThis();

    // Actions
    await $service.install();

    // Assertions
    assert.isTrue(stub.called);
  });

  test('it skips installing already installed permissions', async ({ assert }) => {
    // Arrangements
    const permission: Permission = await PermissionFactory.make();

    $sandbox.stub($service, 'permissions').resolves([permission]);
    $sandbox.stub($service.getModel(), 'query').callsFake(() => ({
      where: () => ({
        first: () => Promise.resolve(permission),
      }),
    }));

    const stub: SinonStub<any, any> = $sandbox.stub(Permission, 'create').resolvesThis();

    // Actions
    await $service.install();

    // Assertions
    assert.isTrue(stub.callCount === 0);
  });
});
