import RolePolicy from '#policies/role_policy';
import RoleService, { RoleAttributes } from '#services/role_service';
import { createRoleValidator, updateRoleValidator } from '#validators/role_validator';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class RolesController {
  constructor(protected $service: RoleService) {}

  /**
   * Display a list of resource
   */
  async index({ bouncer, response }: HttpContext) {
    if (await bouncer.with(RolePolicy).denies('list')) {
      return response.notFound();
    }

    return response.ok(await this.$service.list());
  }

  /**
   * Handle form submission for the create action
   */

  async store({ bouncer, request, response }: HttpContext) {
    if (await bouncer.with(RolePolicy).denies('create')) {
      return response.forbidden();
    }

    const attributes: RoleAttributes = await request.validateUsing(createRoleValidator);
    return response.created(await this.$service.store(attributes));
  }

  /**
   * Show individual record
   */
  async show({ bouncer, params, response }: HttpContext) {
    if (await bouncer.with(RolePolicy).denies('show')) {
      return response.notFound();
    }

    return response.ok(await this.$service.findOrFail(params.id));
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ bouncer, params, request, response }: HttpContext) {
    if (await bouncer.with(RolePolicy).denies('update')) {
      return response.forbidden();
    }

    const attributes: RoleAttributes = await request.validateUsing(updateRoleValidator(params.id));
    return response.ok(await this.$service.update(params.id, attributes));
  }

  /**
   * Soft delete record
   */
  async archive({ bouncer, params, response }: HttpContext) {
    if (await bouncer.with(RolePolicy).denies('archive')) {
      return response.forbidden();
    }

    await this.$service.archive(params.id);
    return response.noContent();
  }

  /**
   * Delete record
   */
  async destroy({ bouncer, params, response }: HttpContext) {
    if (await bouncer.with(RolePolicy).denies('destroy')) {
      return response.forbidden();
    }

    await this.$service.delete(params.id);

    return response.noContent();
  }
}
