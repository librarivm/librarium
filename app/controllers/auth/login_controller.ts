import InvalidCredentialsException from '#exceptions/invalid_credentials_exception';
import User from '#models/user';
import UserService, { CredentialsAttributes } from '#services/user_service';
import { loginValidator } from '#validators/auth_validator';
import { AccessToken } from '@adonisjs/auth/access_tokens';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import UserResource from '#resources/user_resource';

@inject()
export default class LoginController {
  constructor(protected $service: UserService) {}

  async login({ request, response }: HttpContext) {
    try {
      const { email, password, rememberMe }: CredentialsAttributes = this.$service.toCamelCaseKeys(
        await request.validateUsing(loginValidator)
      ) as CredentialsAttributes;

      const user: User = await this.$service.verifyCredentials({
        email,
        password,
      } as CredentialsAttributes);

      const token: AccessToken = await this.$service.tokens().create(user);

      if (rememberMe) {
        response.cookie('remember_me', await user.generateRememberToken(), { httpOnly: true });
      }

      return response.ok({ user: new UserResource(user).get(), token });
    } catch (error: any | unknown) {
      if (error?.code === 'E_INVALID_CREDENTIALS') {
        const err: InvalidCredentialsException = new InvalidCredentialsException();
        response.abort({ errors: [{ message: err.message }] }, err.status);
      }

      throw error;
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.user!;
    await this.$service.tokens().delete(user, user.currentAccessToken.identifier);
    return response.status(204);
  }
}
