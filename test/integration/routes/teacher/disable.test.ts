import { loginSuperAdminAndGetCookie } from 'test/helpers/auth.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { afterAll, beforeAll, describe, it } from 'vitest';

describe('/teacher/disable', () => {
  const redisMock = createRedisMock();
  const app = buildTestServer(prismaClient, redisMock);
  beforeAll(async () => {
    await app.ready();
    await loginSuperAdminAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('when valid id of a teacher', async () => {
    it.todo('then user should have disabled status and not be able to login', async () => {});
    it.todo('then all connected students should remain but not be able to login', async () => {});
    it.todo('then all connected tasks should remain', async () => {});
  });

  describe('when id is not provided', async () => {
    it.todo('then should return 400 with proper message', async () => {});
  });

  describe('when teacher id doesn\'t exist', async () => {
    it.todo('then should return 404 with proper message', async () => {});
  });
});
