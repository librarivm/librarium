import type { HttpContext } from '@adonisjs/core/http';
import PermissionService from '#services/permission_service';
import Permission from '#models/permission';
import { inject } from '@adonisjs/core';
import PermissionResource from '#resources/permission_resource';
import PermissionPolicy from '#policies/permission_policy';

@inject()
export default class GetAllPermissions {
  constructor(protected $service: PermissionService) {}

  async handle({ bouncer, response }: HttpContext) {
    if (await bouncer.with(PermissionPolicy).denies('all')) {
      return response.notFound();
    }

    const permissions: Permission[] = await this.$service.all();

    return response.ok(PermissionResource.collection(permissions));
  }
}
