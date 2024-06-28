import { Service } from '#services/service';
import fs from 'node:fs';

export default class FolderService extends Service {
  /**
   * Scans a directory and returns its contents.
   *
   * @param {string} dir - The directory path to scan.
   * @param {Object} [options={ recursive: true }] - Options for scanning the directory.
   * @param {boolean} [options.recursive=true] - Whether to scan directories recursively.
   * @returns {Promise<string[] | Buffer[]>} - A promise that resolves to an array of filenames or Buffer objects.
   */
  async scan(
    dir: string,
    options: { recursive?: boolean } = { recursive: true }
  ): Promise<string[] | Buffer[]> {
    return fs.readdirSync(dir, options);
  }
}
