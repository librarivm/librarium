/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const RegisterController = () => import('#controllers/auth/register_controller');
const LoginController = () => import('#controllers/auth/login_controller');
const MeController = () => import('#controllers/auth/me_controller');
import { middleware } from '#start/kernel';
import router from '@adonisjs/core/services/router';

const LibrariesController = () => import('#controllers/v1/libraries_controller');

/**
 * Auth Routes
 *
 * This group of routes handles authentication-related functionalities.
 *
 * - POST /register: Registers a new user.
 * - POST /login: Logs in an existing user.
 * - DELETE /logout: Logs out the authenticated user. Requires authentication.
 * - GET /me: Retrieves information about the authenticated user.
 */
router
  .group(() => {
    router.post('/register', [RegisterController]).as('auth.register');
    router.post('/login', [LoginController, 'login']).as('auth.login');
    router.delete('/logout', [LoginController, 'logout']).as('auth.logout').use(middleware.auth());
    router.get('/me', [MeController]).as('auth.me').use(middleware.auth());
  })
  .prefix('api/v1/auth');

router
  .group(() => {
    router.api('libraries', LibrariesController);
  })
  .use(middleware.auth())
  .prefix('api/v1');
