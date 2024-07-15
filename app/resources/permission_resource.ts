import Resource, { AllowedKeys, CollectionMetadata } from '#resources/resource';
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

  meta(_query?: Partial<CollectionMetadata>, items?: any[]): CollectionMetadata {
    return {
      total: items?.length ?? 0,
    };
  }

  getRelatedLinks(): AllowedKeys[] {
    return [];
  }
}
