import { RoleFactory } from '#database/factories/role_factory';
import Role from '#models/role';
import RoleService, { RoleAttributes } from '#services/role_service';
import { Service } from '#services/service';
import SandboxModel from '#tests/mocks/models/sandbox_model';
import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import kebabCase from 'lodash/kebabCase.js';
import sample from 'lodash/sample.js';
import startCase from 'lodash/startCase.js';
import { DateTime } from 'luxon';
import { SinonStub } from 'sinon';

test.group('Services / RoleService', (group) => {
  let $service: RoleService;
  let $roles: Role[];
  let $sandbox: SandboxModel;

  group.each.setup(async () => {
    $roles = await RoleFactory.makeMany(10);
    $service = new RoleService();
    $sandbox = new SandboxModel();
  });

  group.each.teardown(() => {
    $roles = [];
    $sandbox.restore();
  });

  test('it extends the Service class', async ({ assert }) => {
    const service: RoleService | any = new RoleService();
    assert.isTrue(service instanceof Service, 'RoleService should extend Service');
  });

  test('it should return a paginated list of roles', async ({ assert }) => {
    // Arrangements
    const pageCount: number = 10;
    $sandbox.stub(Role.query(), 'paginate').resolves($roles);

    // Actions
    $service.setPageCount(pageCount);
    const roles = await $service.list();

    // Assertions
    assert.equal(roles.perPage, pageCount);
    roles.forEach((role: Role) => {
      assert.isNotEmpty(role.name);
      assert.isTrue(Object.hasOwn(role.toObject(), 'name'));
      assert.isTrue(Object.hasOwn(role.toObject(), 'slug'));
      assert.isTrue(Object.hasOwn(role.toObject(), 'description'));
    });
  });

  test('it should find a role by id', async ({ assert }) => {
    // Arrangements
    const item: Role = sample($roles) as Role;
    $sandbox.stub(Role, 'find').resolves(item);

    // Actions
    const role: Role | null = await $service.find(item.id);

    // Assertions
    assert.equal(role && role.id, item.id);
    assert.equal(role && role.name, item.name);
  });

  test('it should return null if role is not found by id', async ({ assert }) => {
    // Arrangements
    const itemId = 9999;
    $sandbox.stub(Role, 'find').resolves(null);

    // Actions
    const role: Role | null = await $service.find(itemId);

    // Assertions
    assert.isNull(role);
  });

  test('it should store a role and return the created instance', async ({ assert }) => {
    // Arrangements
    const attributes: RoleAttributes = {
      name: startCase(faker.lorem.word()),
      description: faker.lorem.words(),
    };

    const role: Role = {
      ...(await RoleFactory.merge(attributes as object).make()),
      slug: kebabCase(attributes.name),
      id: $roles.length + 1,
    };

    const stub: SinonStub<any, any> = $sandbox.stub(Role.prototype, 'save').resolves(role);

    // Actions
    const saved: Role = await $service.store(attributes);

    // Assertions
    assert.equal(saved.id, role.id);
    assert.equal(saved.name, role.name);
    assert.equal(saved.slug, role.slug);
    assert.equal(saved.description, role.description);
    assert.isTrue(stub.calledOnce);
  });

  test('it should update a role and return the updated instance', async ({ assert }) => {
    // Arrangements
    const attributes: Partial<Role> = {
      name: startCase(faker.lorem.sentence()),
    };
    const roleId: number = $roles.length + 1;
    const item: Role = sample($roles) as Role;
    const role: Role & { id: number; save: SinonStub<any, any> } = Object.assign(item, {
      id: roleId,
      save: $sandbox.getInstance().stub().resolves(item),
    });

    $sandbox.stub(Role, 'find').resolves(role);
    $sandbox.stub(Role.prototype, 'save').resolves(item);

    // Actions
    const updated: Role = await $service.update(roleId, attributes as RoleAttributes);

    // Assertions
    assert.equal(updated.name, attributes.name);
    assert.isTrue(role.save.calledOnce);
  });

  test('it should archive a role', async ({ assert }) => {
    // Arrangements
    const roleId: number = $roles.length;
    const item: Role = sample($roles) as Role;
    const role: Role & { id: number; save: SinonStub<any, any> } = Object.assign(item, {
      id: roleId,
      deletedAt: DateTime.local(),
      save: $sandbox.getInstance().stub().resolves(item),
    });

    $sandbox.stub(Role, 'findOrFail').resolves(item);
    $sandbox.stub(Role.prototype, 'save').resolves();

    // Actions
    await $service.archive(role.id);

    // Assertions
    assert.isNotNull(role.deletedAt);
    assert.isTrue(role.save.calledOnce);
  });

  test('it should delete a role permanently', async ({ assert }) => {
    // Arrangements
    const roleId: number = $roles.length;
    const item: Role = sample($roles) as Role;
    const role: Role & { id: number; delete: SinonStub<any, any> } = Object.assign(item, {
      id: roleId,
      deletedAt: DateTime.local(),
      delete: $sandbox.getInstance().stub().resolves(),
    });

    $sandbox.stub(Role, 'findOrFail').resolves(item);

    // Actions
    await $service.delete(role.id);
    const deleted: Role | null = await $service.find(role.id);

    // Assertions
    assert.isTrue(role.delete.calledOnce);
    assert.isNull(deleted);
  });

  test('it retrieves the roles path of roles', async ({ assert }) => {
    const path: string = $service.path();
    assert.isString(path);
  });

  test('it retrieves the list of roles from disk', async ({ assert }) => {
    // Actions
    const roles: RoleAttributes[] = await $service.roles();

    // Assertions
    assert.isArray(roles);
    roles.forEach((role: RoleAttributes) => {
      assert.isTrue(role.hasOwnProperty('name'));
      assert.isTrue(role.hasOwnProperty('slug'));
      assert.isTrue(role.hasOwnProperty('description'));
      assert.isTrue(role.hasOwnProperty('permissions'));
    });
  });
});
