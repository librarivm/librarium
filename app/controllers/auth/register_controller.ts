import User from '#models/user';
import UserService, { CredentialsAttributes } from '#services/user_service';
import { registerValidator } from '#validators/auth_validator';
import { AccessToken } from '@adonisjs/auth/access_tokens';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class RegisterController {
  constructor(protected $service: UserService) {}

  async handle({ request, response }: HttpContext) {
    const data: CredentialsAttributes = await request.validateUsing(registerValidator);
    const user: User = await this.$service.register(data);
    const token: AccessToken = await this.$service.tokens().create(user);

    return response.status(201).json({ token, user });
  }
}
