import UserService, { UserAttributes } from '#services/user_service';
import { createUserValidator } from '#validators/user_validator';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class UsersController {
  constructor(protected $service: UserService) {}

  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    return response.ok(await this.$service.list());
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const attributes: UserAttributes = await request.validateUsing(createUserValidator);
    return response.created(await this.$service.store(attributes));
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    return response.ok(await this.$service.findOrFail(params.id));
  }

  /**
   * Handle form submission for the edit action
   */
  // async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  // async destroy({ params }: HttpContext) {}
}
