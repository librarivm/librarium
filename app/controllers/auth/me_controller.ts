import { HttpContext } from '@adonisjs/core/http';

export default class MeController {
  /**
   * Handles the incoming request to fetch the authenticated user's details.
   *
   * @param {HttpContext} context - The HTTP context object containing auth and response.
   * @returns {Promise<void>} The response object containing the authenticated user's details.
   */
  async handle({ auth, response }: HttpContext) {
    await auth.check();

    return response.ok(auth.user);
  }
}
