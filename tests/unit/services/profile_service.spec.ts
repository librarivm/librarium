import { test } from '@japa/runner';
import SandboxModel from '#tests/mocks/models/sandbox_model';
import User from '#models/user';
import { UserFactory } from '#database/factories/user_factory';
import { Service } from '#services/service';
import ProfileService from '#services/profile_service';

test.group('Services / ProfileService', (group) => {
  let $service: ProfileService;
  let $user: User;
  let $sandbox: SandboxModel;

  group.each.setup(async () => {
    $user = await UserFactory.make();
    $sandbox = new SandboxModel();
    $service = new ProfileService();
  });

  test('it extends the Service class', async ({ assert }) => {
    const service: ProfileService | any = new ProfileService();
    assert.isTrue(service instanceof Service, 'ProfileService should extend Service');
  });

  test('it should retrieve the current authenticated user', async ({ assert }) => {
    // Arrangements
    $sandbox.stub($service, 'auth').callsFake(() => ({ user: $user }));

    // Actions
    const user: User | undefined = $service.me();

    // Assertions
    assert.equal(user?.email, $user.email);
  });
});
