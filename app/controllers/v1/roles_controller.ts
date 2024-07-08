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
  async index({ response }: HttpContext) {
    return response.ok(await this.$service.list());
  }

  /**
   * Handle form submission for the create action
   */

  async store({ request, response }: HttpContext) {
    const attributes: RoleAttributes = await request.validateUsing(createRoleValidator);
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
  async update({ params, request, response }: HttpContext) {
    const attributes: RoleAttributes = await request.validateUsing(updateRoleValidator(params.id));
    return response.ok(await this.$service.update(params.id, attributes));
  }

  /**
   * Soft delete record
   */
  async archive({ params, response }: HttpContext) {
    await this.$service.archive(params.id);
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
