import UserPolicy from '#policies/user_policy';
import UserService, { UserAttributes } from '#services/user_service';
import { createUserValidator, updateUserValidator } from '#validators/user_validator';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import UserResource from '#collections/user_resource';

@inject()
export default class UsersController {
  constructor(protected $service: UserService) {}

  /**
   * Display a list of resource
   */
  async index({ bouncer, response }: HttpContext) {
    if (await bouncer.with(UserPolicy).denies('list')) {
      return response.notFound();
    }

    return response.ok(UserResource.collection(await this.$service.list()));
  }

  /**
   * Handle form submission for the 'create' action
   */
  async store({ bouncer, request, response }: HttpContext) {
    if (await bouncer.with(UserPolicy).denies('create')) {
      return response.forbidden();
    }

    const attributes: UserAttributes = await request.validateUsing(createUserValidator);
    return response.created(await this.$service.store(attributes as UserAttributes));
  }

  /**
   * Show individual record
   */
  async show({ bouncer, params, response }: HttpContext) {
    if (await bouncer.with(UserPolicy).denies('show')) {
      return response.notFound();
    }

    return response.ok(await this.$service.findOrFail(params.id));
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ bouncer, params, request, response }: HttpContext) {
    if (await bouncer.with(UserPolicy).denies('update')) {
      return response.forbidden();
    }

    const attributes: UserAttributes = await request.validateUsing(updateUserValidator(params.id));
    return response.ok(await this.$service.update(params.id, attributes as UserAttributes));
  }

  /**
   * Soft delete record
   */
  async archive({ bouncer, params, response }: HttpContext) {
    if (await bouncer.with(UserPolicy).denies('archive')) {
      return response.forbidden();
    }

    await this.$service.archive(params.id);

    return response.noContent();
  }

  /**
   * Delete record
   */
  async destroy({ bouncer, params, response }: HttpContext) {
    if (await bouncer.with(UserPolicy).denies('destroy')) {
      return response.forbidden();
    }

    await this.$service.delete(params.id);

    return response.noContent();
  }
}
