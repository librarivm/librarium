import LibraryService from '#services/library_service';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class LibrariesController {
  constructor(protected $service: LibraryService) {}

  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    return response.json(await this.$service.list());
  }

  /**
   * Handle form submission for the create action
   */

  // async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ response, params }: HttpContext) {
    return response.json(await this.$service.findOrFail(params.id));
  }

  /**
   * Handle form submission for the edit action
   */
  // async update({ params, request }: HttpContext) {}

  /**
   * Soft delete record
   */
  // async archive({ params }: HttpContext) {}

  /**
   * Delete record
   */
  // async destroy({ params }: HttpContext) {}
}
