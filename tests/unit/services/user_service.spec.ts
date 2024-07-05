import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import { Service } from '#services/service';
import UserService, { UserAuthAttributes } from '#services/user_service';
import SandboxModel from '#tests/mocks/models/sandbox_model';
import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { SinonStub } from 'sinon';

test.group('Services / UserService / Authentication / Registration', (group) => {
  let $service: UserService;
  let $users: User[];
  let $sandbox: SandboxModel;

  group.each.setup(async () => {
    $users = await UserFactory.makeMany(10);
    $service = new UserService();
    $sandbox = new SandboxModel();
  });

  group.each.teardown(() => {
    $users = [];
    $sandbox.restore();
  });

  test('it should register a new user successfully', async ({ assert }) => {
    // Arrangements
    const attributes: UserAuthAttributes = {
      email: faker.internet.email(),
      password: 'password',
    };
    const item: User = await UserFactory.merge(attributes).make();
    const userId: number = $users.length + 1;
    const user: User & { id: number } = {
      ...item,
      username: attributes.email,
      id: userId,
    };

    const stub: SinonStub<any, any> = $sandbox
      .stub(User, 'create')
      .withArgs(attributes)
      .resolves(user);

    // Actions
    const registered: User = await $service.register(attributes);

    // Assertions
    assert.equal(registered.email, attributes.email);
    assert.equal(registered.username, attributes.email);
    assert.exists(registered.id, 'User ID must be set in the stub');
    assert.isTrue(stub.calledOnceWithExactly(attributes));
  });
});

test.group('Services / UserService', (group) => {
  let $service: UserService;
  let $users: User[];
  let $sandbox: SandboxModel;

  group.each.setup(async () => {
    $users = await UserFactory.makeMany(10);
    $service = new UserService();
    $sandbox = new SandboxModel();
  });

  group.each.teardown(() => {
    $users = [];
    $sandbox.restore();
  });

  test('it extends the Service class', async ({ assert }) => {
    const service: UserService = new UserService();
    assert.isTrue(service instanceof Service, 'UserService should extend Service');
  });
});
