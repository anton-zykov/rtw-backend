import { loginSuperAdminAndGetCookie } from 'test/helpers/auth.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { afterAll, beforeAll, describe, it } from 'vitest';
import { de } from 'zod/v4/locales';

describe('genitive-task/student', () => {
  const redisMock = createRedisMock();
  const app = buildTestServer(prismaClient, redisMock);
  let adminCookie: string;
  beforeAll(async () => {
    await app.ready();
    adminCookie = await loginSuperAdminAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('/assign', () => {
    describe('when valid student id and task ids are provided', async () => {
      it.todo('then should assign tasks to student and return created and skipped task ids', async () => {});
    });

    describe('when student id doesn\'t exist', async () => {
      it.todo('then should return 404', async () => {});
    });

    describe('when one of the task ids doesn\'t exist', async () => {
      it.todo('then should not create any tasks and return 404', async () => {});
    });
  });
});
