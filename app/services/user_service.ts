import User from '#models/user';
import { Service } from '#services/service';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { ExtractScopes, ModelPaginatorContract } from '@adonisjs/lucid/types/model';

export type UserAuthAttributes = {
  email: string;
  password: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  username?: string;
};

export type CredentialsAttributes =
  | { email: string; password: string; username?: never }
  | { username: string; password: string; email?: never };

export type UserAttributes = UserAuthAttributes & {
  [key: string]: any;
};

@inject()
export default class UserService extends Service {
  supportedColumnKeys: string[] = [
    'first_name',
    'last_name',
    'username',
    'email',
    'created_at',
    'updated_at',
  ];

  preloads: string[] = ['roles'];

  constructor(ctx?: HttpContext) {
    super(ctx);
    this.setModel(User);
  }

  /**
   * List resources with pagination.
   *
   * @returns {Promise<ModelPaginatorContract<User>>} Paginated results.
   */
  async list(): Promise<ModelPaginatorContract<User>> {
    return this.withQueryAware(
      this.model.query().apply((scopes: ExtractScopes<typeof User>) => scopes.notSoftDeleted())
    ).paginate(this.getPage(), this.getPageCount());
  }

  /**
   * Find a resource by ID.
   *
   * @param {number} id - The ID of the resource.
   * @returns {Promise<User|null>} The resource if found, otherwise null.
   */
  async find(id: number): Promise<User | null> {
    return await this.model.find(id);
  }

  /**
   * Find a resource by ID.
   *
   * @param {number} id - The ID of the resource.
   * @returns {Promise<User|null>} The resource if found, otherwise null.
   */
  async findOrFail(id: number): Promise<User | any> {
    return this.withPreload(this.model.query().where('id', id)).firstOrFail();
  }

  /**
   * Create or update a resource.
   *
   * @param {User} model - The model to use to save the resource.
   * @param {UserAttributes} attributes - The attributes for the new resource.
   * @returns {Promise<User>} The created resource.
   */
  async save(model: User, attributes: UserAttributes): Promise<User> {
    let user: User = model;

    user.firstName = attributes.firstName;
    user.middleName = attributes.middleName;
    user.lastName = attributes.lastName;
    user.email = attributes.email;
    user.username = attributes.username ?? attributes.email;
    user.password = attributes.password;

    user = await user.save();

    return user;
  }

  /**
   * Create an existing resource.
   *
   * @param {UserAttributes} attributes - The new attributes for the resource.
   * @returns {Promise<User>} The updated resource.
   */
  async store(attributes: UserAttributes): Promise<User> {
    return this.save(new this.model(), attributes);
  }

  /**
   * Update an existing resource.
   *
   * @param {number | User} model - The model or ID of the resource.
   * @param {UserAttributes} attributes - The new attributes for the resource.
   * @returns {Promise<User>} The updated resource.
   */
  async update(model: number | User, attributes: UserAttributes): Promise<User> {
    const user: User = model instanceof User ? model : await this.model.find(model);

    return this.save(user, attributes);
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
   * @param {CredentialsAttributes} credentials - The credentials to verify
   * @returns {Promise<User>} The user if the credentials are valid
   */
  async verifyCredentials(credentials: CredentialsAttributes): Promise<User> {
    return await this.model.verifyCredentials(credentials.email, credentials.password);
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
