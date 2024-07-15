import Permission from '#models/permission';
import { Service } from '#services/service';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import fs from 'node:fs';
import path from 'node:path';
import env from '#start/env';

export type PermissionAttributes = {
  code: string;
  group: string;
};

export const PERMISSIONS_ENUM_PATH: string = path.resolve('app', 'permissions');

@inject()
export default class PermissionService extends Service {
  constructor(ctx?: HttpContext) {
    super(ctx);
    this.setModel(Permission);
  }

  /**
   * Get all resources.
   *
   * @returns {Promise<Permission[]>} array of permission results.
   */
  async all(): Promise<Permission[]> {
    return this.model.query();
  }

  /**
   * Returns the path to the permissions enum files.
   *
   * @returns {string} The path to the permissions enum files.
   */
  path(): string {
    return PERMISSIONS_ENUM_PATH;
  }

  /**
   * Reads permission enum files from the specified directory
   * and returns an array of permission attributes.
   *
   * @returns {Promise<PermissionAttributes[]>} A promise that resolves to an array of permission attributes,
   *                                           each containing a 'code' and a 'group'.
   */
  async permissions(): Promise<PermissionAttributes[]> {
    let permissions: PermissionAttributes[] = [];
    const files: string[] = fs
      .readdirSync(this.path())
      .filter((file: string) => file.endsWith('_permission.ts'));

    for (const file of files) {
      const module = await import(path.resolve(this.path(), file));
      const codes: any = Object.values(module)?.[0];
      const group: string = Object.keys(module)?.[0];

      Object.entries(codes).forEach(([_, code]) => {
        permissions.push({ code: code as string, group });
      });
    }

    return permissions;
  }

  /**
   * Installs the permissions by reading the
   * permissions from disk and creating them in the model.
   *
   * @returns {Promise<void>} A promise that resolves when the permissions have been created.
   */
  async install(): Promise<void> {
    const permissions: PermissionAttributes[] = await this.permissions();

    for (const permission of permissions) {
      const exists = await this.model.query().where('code', permission.code).first();

      if (!exists) {
        if (env.get('NODE_ENV') === 'development') {
          console.log('  ✔ Installing permission:', permission.code);
        }
        await this.model.create(permission);
      }
    }
  }
}
