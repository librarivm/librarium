// noinspection SuspiciousTypeOfGuard

import FolderService from '#services/folder_service';
import { Service as BaseService } from '#services/service';
import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import fs from 'node:fs';
import path from 'node:path';

type File = {
  dir: string;
  file: [fileName: string, content: string];
};

test.group('Services / FolderService', (group) => {
  let dir: string = path.join('tmp', 'tests');
  let files: File[] = faker.helpers.multiple(
    (): File => ({
      dir,
      file: [`${faker.lorem.slug()}.txt`, faker.lorem.sentences()],
    }),
    { count: 10 }
  );

  group.setup(async (): Promise<void> => {
    files.forEach((item: File) => {
      fs.mkdirSync(item.dir, { recursive: true });
      fs.writeFileSync(path.join(item.dir, item.file[0]), item.file[1]);
    });
  });

  group.teardown(async (): Promise<void> => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test('it extends the Service class', async ({ assert }) => {
    const service: FolderService | any = new FolderService();
    assert.isTrue(service instanceof BaseService, 'FolderService should extend Service');
  });

  test('it should return an array of files from a given directory path', async ({ assert }) => {
    const service: FolderService = new FolderService();
    const items: string[] | Buffer[] = await service.scan(dir);

    assert.isArray(items);
    items.forEach((item: string | Buffer) =>
      assert.exists(files.some((file) => item.includes(file.file[0])))
    );
  });
});
