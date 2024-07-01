import { HttpContext } from '@adonisjs/core/http';
import LibraryService from '#services/library_service';
import { inject } from '@adonisjs/core';

@inject()
export default class LibrariesController {
  // protected $service: LibraryService;

  constructor(protected $service: LibraryService) {}

  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    return response.json(await this.$service.list());
  }

  /**
   * Display form to create a new record
   */
  // async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  // async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  // async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  // async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  // async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  // async destroy({ params }: HttpContext) {}
}
