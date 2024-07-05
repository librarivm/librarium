import User from '#models/user';
import { Service } from '#services/service';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
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

export type UserCredentialsAttributes =
  | { email: string; password: string; username?: never }
  | { username: string; password: string; email?: never };

@inject()
export default class UserService extends Service {
  constructor(ctx?: HttpContext) {
    super(ctx);
    this.setModel(User);
  }

  /**
   * Registers a new user with the provided attributes
   * @param {UserAuthAttributes} attributes - The attributes for the new user
   * @returns {Promise<User>} The newly created user
   */
  async register(attributes: UserAuthAttributes): Promise<User> {
    return await this.model.create(this.mergeAttributes(attributes));
  }

  /**
   * Verifies user credentials and returns the user if valid
   * @param {UserCredentialsAttributes} credentials - The credentials to verify
   * @returns {Promise<User>} The user if the credentials are valid
   */
  async verifyCredentials(credentials: UserCredentialsAttributes): Promise<User> {
    return await this.model.verifyCredentials(credentials);
  }

  /**
   * Returns the access tokens provider for the user model
   * @returns {DbAccessTokensProvider<typeof User>} The access tokens provider
   */
  tokens(): DbAccessTokensProvider<typeof User> {
    return this.model.accessTokens;
  }

  /**
   * Deletes the current access token for the given user
   * @param {User | any} user - The user whose current access token should be deleted
   * @returns {Promise<void>}
   */
  async removeCurrentToken(user: User | any): Promise<void> {
    await this.tokens().delete(user, user.currentAccessToken.identifier);
  }

  save(model: any, attributes: any): Promise<any> {
    return Promise.resolve({ model, attributes });
  }

  /**
   * Merges the provided attributes with default values
   * @param {UserAuthAttributes} attributes - The attributes to merge
   * @returns {UserAuthAttributes} The merged attributes
   */
  private mergeAttributes(attributes: UserAuthAttributes): UserAuthAttributes {
    if (!attributes.hasOwnProperty('username')) {
      attributes = Object.assign(attributes, { username: attributes.email });
    }

    if (!attributes.hasOwnProperty('email')) {
      attributes = Object.assign(attributes, { email: attributes.username });
    }

    return attributes;
  }
}
