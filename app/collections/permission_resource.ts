import Resource, { AllowedKeys } from '#collections/resource';
import { PermissionAttributes } from '#services/permission_service';

export default class PermissionResource extends Resource<PermissionAttributes> {
  prepare(item: PermissionAttributes): PermissionAttributes {
    return {
      code: item.code,
      group: item.group,
    };
  }

  type(): string {
    return 'permissions';
  }

  meta(options: { items: any[] }): { [key: string]: any } {
    return {
      total: options.items.length,
    };
  }

  getRelatedLinks(): AllowedKeys[] {
    return [];
  }
}
