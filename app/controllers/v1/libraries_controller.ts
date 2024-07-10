import Library from '#models/library';
import LibraryPolicy from '#policies/library_policy';
import LibraryService, { LibraryAttributes } from '#services/library_service';
import { createLibraryValidator, updateLibraryValidator } from '#validators/library_validator';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class LibrariesController {
  constructor(protected $service: LibraryService) {}

  /**
   * Display a list of resource
   */
  async index({ bouncer, response }: HttpContext) {
    if (await bouncer.with(LibraryPolicy).denies('list')) {
      return response.notFound();
    }

    return response.ok(await this.$service.list());
  }

  /**
   * Handle form submission for the `create` action
   */
  async store({ bouncer, request, response }: HttpContext) {
    if (await bouncer.with(LibraryPolicy).denies('create')) {
      return response.forbidden();
    }

    const attributes: LibraryAttributes = await request.validateUsing(createLibraryValidator);
    return response.created(await this.$service.store(attributes));
  }

  /**
   * Show individual record
   */
  async show({ bouncer, response, params }: HttpContext) {
    const library: Library = await this.$service.findOrFail(params.id);

    if (await bouncer.with(LibraryPolicy).denies('show', library)) {
      return response.notFound();
    }

    return response.ok(library);
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ bouncer, params, request, response }: HttpContext) {
    const library: Library = await this.$service.findOrFail(params.id);

    if (await bouncer.with(LibraryPolicy).denies('update', library)) {
      return response.forbidden();
    }

    const attributes: LibraryAttributes = await request.validateUsing(
      updateLibraryValidator(params.id)
    );

    return response.ok(await this.$service.update(library, attributes));
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
