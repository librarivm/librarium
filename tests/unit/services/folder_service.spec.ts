import FolderService from '#services/folder_service';
import { Service as BaseService } from '#services/service';
import { test } from '@japa/runner';
import path from 'node:path';
import fs from 'node:fs';
import { faker } from '@faker-js/faker';

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
    const service: FolderService = new FolderService();
    assert.instanceOf(service, BaseService);
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
