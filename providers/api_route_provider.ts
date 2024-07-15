import { RouteGroup, Router } from '@adonisjs/core/http';
import router from '@adonisjs/core/services/router';
import type { ApplicationService } from '@adonisjs/core/types';

declare module '@adonisjs/core/http' {
  interface Router {
    api(name: string, controller: any): RouteGroup;
  }
}

export default class ApiRouteProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * The container bindings have booted
   */
  async boot(): Promise<void> {
    Router.macro('api', function (name: string, controller: string | any): RouteGroup {
      return router.group(() => {
        router.get(`${name}`, [controller, 'index']).as(`${name}.index`);
        router.post(`${name}`, [controller, 'store']).as(`${name}.store`);
        router.get(`${name}/:id`, [controller, 'show']).as(`${name}.show`);
        router.put(`${name}/:id`, [controller, 'update']).as(`${name}.update`);
        router.patch(`${name}/:id/restore`, [controller, 'restore']).as(`${name}.restore`);
        router.patch(`${name}/:id`, [controller, 'update']).as(`${name}.patch`);
        router.delete(`${name}/:id/archive`, [controller, 'archive']).as(`${name}.archive`);
        router.delete(`${name}/:id`, [controller, 'destroy']).as(`${name}.destroy`);
      });
    });
  }
}
