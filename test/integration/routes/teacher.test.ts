import { loginSuperAdminAndGetCookie } from 'test/helpers/auth.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { afterAll, beforeAll, describe, it } from 'vitest';

describe('/teacher', () => {
  const redisMock = createRedisMock();
  const app = buildTestServer(prismaClient, redisMock);
  let adminCookie: string;
  beforeAll(async () => {
    await app.ready();
    adminCookie = await loginSuperAdminAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('/create', () => {
    describe('when valid id of a user without a role', async () => {
      it.todo('then should create admin', async () => {});
    });

    describe('when id is not provided', async () => {
      it.todo('then should receive 400 with proper message', async () => {});
    });

    describe('when user id doesn\'t exist', async () => {
      it.todo('then should return 404 with proper message', async () => {});
    });

    describe('when user is already someone else', async () => {
      it.todo('then should return 409 with proper message', async () => {});
    });

    describe('when user is already a teacher', async () => {
      it.todo('then should return 409 with proper message', async () => {});
    });
  });

  describe('/delete', () => {
    describe('when valid id of a teacher', async () => {
      it.todo('then should delete teacher', async () => {});
      it.todo('then all connected students should be removed', async () => {});
      it.todo('then all connected tasks should be removed', async () => {});
    });

    describe('when id is not provided', async () => {
      it.todo('then should return 400 with proper message', async () => {});
    });

    describe('when teacher id doesn\'t exist', async () => {
      it.todo('then should return 404 with proper message', async () => {});
    });
  });

  describe('/disable', () => {
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
});
