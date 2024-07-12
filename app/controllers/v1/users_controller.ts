import User from '#models/user';
import UserService, { UserAttributes } from '#services/user_service';
import { createUserValidator, updateUserValidator } from '#validators/user_validator';
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
    const attributes: Partial<UserAttributes> = await request.validateUsing(createUserValidator);
    return response.created(await this.$service.store(attributes as UserAttributes));
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
  async update({ params, request, response }: HttpContext) {
    const attributes: Partial<UserAttributes> = await request.validateUsing(
      updateUserValidator(params.id)
    );
    return response.ok(await this.$service.update(params.id, attributes as UserAttributes));
  }

  /**
   * Soft delete record
   */
  async archive({ params, response }: HttpContext) {
    const user: User = await this.$service.findOrFail(params.id);

    await this.$service.archive(user);

    return response.noContent();
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    await this.$service.delete(params.id);

    return response.noContent();
  }
}
