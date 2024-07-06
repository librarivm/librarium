import InvalidCredentialsException from '#exceptions/invalid_credentials_exception';
import User from '#models/user';
import UserService, { CredentialsAttributes } from '#services/user_service';
import { loginValidator } from '#validators/auth';
import { AccessToken } from '@adonisjs/auth/access_tokens';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class LoginController {
  constructor(protected $service: UserService) {}

  async login({ request, response }: HttpContext) {
    try {
      const { email, password }: CredentialsAttributes =
        await request.validateUsing(loginValidator);
      const user: User = await this.$service.verifyCredentials({ email, password });
      const token: AccessToken = await this.$service.tokens().create(user);

      return response.ok({ user, token });
    } catch (error: any | unknown) {
      if (error?.code === 'E_INVALID_CREDENTIALS') {
        throw new InvalidCredentialsException();
      }
      throw error;
    }
  }

  async logout({ auth }: HttpContext) {
    const user = auth.user!;
    await $service.accessTokens().delete(user, user.currentAccessToken.identifier);
    return { message: 'success' };
  }
}
