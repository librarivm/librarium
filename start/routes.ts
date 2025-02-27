/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const GetAllPermissions = () => import('#controllers/v1/permissions/get_all_permissions');
import RolesController from '#controllers/v1/roles_controller';
import UsersController from '#controllers/v1/users_controller';
import { middleware } from '#start/kernel';
import router from '@adonisjs/core/services/router';

const RegisterController = () => import('#controllers/auth/register_controller');
const LoginController = () => import('#controllers/auth/login_controller');
const MeController = () => import('#controllers/v1/profile/me_controller');

const LibrariesController = () => import('#controllers/v1/libraries_controller');

/**
 * Auth Routes
 *
 * This group of routes handles authentication-related functionalities.
 *
 * - POST /register: Registers a new user.
 * - POST /login: Logs in an existing user.
 * - DELETE /logout: Logs out the authenticated user. Requires authentication.
 * - GET /profile: Retrieves information about the authenticated user.
 */
router
  .group(() => {
    router.post('/register', [RegisterController]).as('auth.register');
    router.post('/login', [LoginController, 'login']).as('auth.login');
    router.delete('/logout', [LoginController, 'logout']).as('auth.logout').use(middleware.auth());
  })
  .prefix('api/v1/auth');

router
  .group(() => {
    router.get('/me', [MeController]).as('profile.me').use(middleware.auth());
  })
  .prefix('api/v1/profile');

router
  .group(() => {
    router.get('permissions', [GetAllPermissions]).as('permissions.all');
  })
  .use(middleware.auth())
  .prefix('api/v1');

router
  .group(() => {
    router.api('users', UsersController);
    router.api('libraries', LibrariesController);
    router.api('roles', RolesController);
  })
  .use(middleware.auth())
  .prefix('api/v1');
