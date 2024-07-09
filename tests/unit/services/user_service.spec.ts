import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import { Service } from '#services/service';
import UserService, { CredentialsAttributes, UserAuthAttributes } from '#services/user_service';
import SandboxModel from '#tests/mocks/models/sandbox_model';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import sample from 'lodash/sample.js';
import { SinonStub } from 'sinon';

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

  // Base
  test('it extends the Service class', async ({ assert }) => {
    const service: UserService | any = new UserService();
    assert.isTrue(service instanceof Service, 'UserService should extend Service');
  });

  // Authentication
  test('it should register a new user successfully', async ({ assert }) => {
    // Arrangements
    const attributes: UserAuthAttributes = {
      email: faker.internet.email(),
      password: 'password',
    };
    const item: User = await UserFactory.merge(attributes).make();
    const userId: number = $users.length + 1;
    const user = {
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

  test('it should verify the credentials of an existing user', async ({ assert }) => {
    // Arrangements
    const user = {
      ...(sample($users) as User),
      id: $users.length,
    };

    const credentials: CredentialsAttributes = {
      email: user.email,
      password: 'password',
    };

    const stub: SinonStub<any, any> = $sandbox
      .stub(User, 'verifyCredentials')
      .withArgs(credentials.email, credentials.password)
      .resolves(user);

    // Actions
    const logged: User = await $service.verifyCredentials(credentials);

    // Assertions
    assert.isTrue(stub.calledOnceWithExactly(credentials.email, credentials.password));
    assert.equal(logged.id, user.id);
  });

  test('it should throw E_INVALID_CREDENTIALS if credentials are invalid', async ({ assert }) => {
    // Arrangements
    const credentials: CredentialsAttributes = {
      username: faker.internet.email(),
      password: 'password',
    };

    try {
      // Actions
      await $service.verifyCredentials(credentials);
    } catch (e) {
      // Assertions
      assert.equal(e.code, 'E_INVALID_CREDENTIALS');
    }
  });

  test('it should return access token provider when invoking tokens method', async ({ assert }) => {
    // Actions
    const tokens: DbAccessTokensProvider<typeof User> = $service.tokens();
    // Assertions
    assert.instanceOf(tokens, DbAccessTokensProvider);
  });

  test('it should delete current access token', async ({ assert }) => {
    // Arrangements
    const user: { [key: string]: any } = {
      currentAccessToken: {
        identifier: faker.lorem.words(),
      },
    };

    const stub: SinonStub<any, any> = $sandbox.stub(User.accessTokens, 'delete').resolves();

    // Actions
    await $service.removeCurrentToken(user);

    // Assertions
    assert.isTrue(stub.calledOnce);
    assert.isTrue(stub.calledWithExactly(user, user.currentAccessToken.identifier));
  });

  // Model
});
