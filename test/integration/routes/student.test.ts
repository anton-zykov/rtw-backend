// import { loginSuperAdminAndGetCookie } from 'test/helpers/auth.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { afterAll, beforeAll, describe, it } from 'vitest';

describe('/student', () => {
  const redisMock = createRedisMock();
  const app = buildTestServer(prismaClient, redisMock);
  // let adminCookie: string;
  beforeAll(async () => {
    await app.ready();
    // adminCookie = await loginSuperAdminAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('/create', () => {
    describe('when valid id of a user without a role', async () => {
      it.todo('then should create student', async () => {});
    });

    describe('when id is not provided', async () => {
      it.todo('then should return 400 with proper message', async () => {});
    });

    describe('when user id doesn\'t exist', async () => {
      it.todo('then should return 404 with proper message', async () => {});
    });

    describe('when user is already an admin', async () => {
      it.todo('then should return 400 with proper message', async () => {});
    });

    describe('when user is already a student', async () => {
      it.todo('', async () => {});
    });
  });
});
