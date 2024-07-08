import RoleService from '#services/role_service';
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

  // async store({ request }: HttpContext) {}

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
