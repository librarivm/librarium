import LibraryService, { LibraryAttributes } from '#services/library_service';
import { createLibraryValidator, updateLibraryValidator } from '#validators/library';
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

  async store({ request, response }: HttpContext) {
    const attributes: LibraryAttributes = await request.validateUsing(createLibraryValidator);
    return response.status(201).json(await this.$service.store(attributes));
  }

  /**
   * Show individual record
   */
  async show({ response, params }: HttpContext) {
    return response.json(await this.$service.findOrFail(params.id));
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const attributes: LibraryAttributes = await request.validateUsing(updateLibraryValidator);
    return response.json(await this.$service.update(params.id, attributes));
  }

  /**
   * Soft delete record
   */
  // async archive({ params }: HttpContext) {}

  /**
   * Delete record
   */
  // async destroy({ params }: HttpContext) {}
}
