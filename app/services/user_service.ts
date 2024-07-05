import User from '#models/user';
import { Service } from '#services/service';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

export type UserAuthAttributes = {
  email: string;
  password: string;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  username?: string;
};

@inject()
export default class UserService extends Service {
  constructor(ctx?: HttpContext) {
    super(ctx);
    this.setModel(User);
  }

  async register(attributes: UserAuthAttributes): Promise<User> {
    const user: User = await this.model.create(this.mergeAttributes(attributes));

    return user;
  }

  save(model: any, attributes: any): Promise<any> {
    return Promise.resolve(undefined);
  }

  private mergeAttributes(attributes: UserAuthAttributes): UserAuthAttributes {
    if (!attributes.hasOwnProperty('username')) {
      attributes = Object.assign(attributes, { username: attributes.email });
    }

    return attributes;
  }
}
