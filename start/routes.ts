/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';

const LibrariesController = () => import('#controllers/v1/libraries_controller');

router
  .group(() => {
    router.resource('libraries', LibrariesController);
  })
  .prefix('api/v1');
