import { HttpContext } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';
import ProfileService from '#services/profile_service';

@inject()
export default class MeController {
  constructor(protected $service: ProfileService) {}

  /**
   * Handles the incoming request to fetch the authenticated user's details.
   *
   * @param {HttpContext} context - The HTTP context object containing auth and response.
   * @returns {Promise<void>} The response object containing the authenticated user's details.
   */
  async handle({ auth, response }: HttpContext) {
    await auth.check();

    return response.ok(this.$service.me());
  }
}
