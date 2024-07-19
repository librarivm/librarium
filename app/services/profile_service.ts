import { Service } from '#services/service';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';

@inject()
export default class ProfileService extends Service {
  constructor(ctx?: HttpContext) {
    super(ctx);
    this.setModel(User);
  }

  me(): any {
    return this.auth().user;
  }
}
