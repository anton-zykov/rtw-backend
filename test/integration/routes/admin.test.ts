import { loginSuperAdminAndGetCookie } from 'test/helpers/auth.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { createUser, cleanUpUser } from 'test/hooks/index.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('/admin', () => {
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
      it('then should create admin', async () => {
        const user = await createUser(app, adminCookie);

        const res = await app.inject({
          method: 'POST',
          url: '/api/admin/create',
          payload: {
            id: user.id,
          },
          headers: {
            cookie: adminCookie,
          },
        });

        expect(res.statusCode).toBe(201);
        expect(res.json()).toEqual({ id: user.id });

        await cleanUpUser(app, adminCookie, user.id);
      });
    });

    describe('when id is not provided', async () => {
      it('then should receive 400 with proper message', async () => {
        const resNoId = await app.inject({
          method: 'POST',
          url: '/api/admin/create',
          payload: {},
          headers: {
            cookie: adminCookie,
          },
        });

        expect(resNoId.statusCode).toBe(400);
        expect(resNoId.json()).toMatchObject({ message: 'Request validation failed' });

        const resInvalidType = await app.inject({
          method: 'POST',
          url: '/api/admin/create',
          payload: {
            id: 1234,
          },
          headers: {
            cookie: adminCookie,
          },
        });

        expect(resInvalidType.statusCode).toBe(400);
        expect(resInvalidType.json()).toMatchObject({ message: 'Request validation failed' });
      });
    });

    describe('when user id is valid but doesn\'t exist', async () => {
      it('then should return 404 with proper message', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/api/admin/create',
          payload: {
            id: 'a2c6858a-130a-42e8-8b87-e89f89c4d887' // non-existent id
          },
          headers: {
            cookie: adminCookie,
          },
        });

        expect(response.statusCode).toBe(404);
        expect(response.json()).toEqual({ message: 'User not found' });
      });
    });

    describe('when user is already someone else', async () => {
      it('then should return 409 with proper message', async () => {
        const user = await createUser(app, adminCookie);
        await app.inject({
          method: 'POST',
          url: '/api/teacher/create',
          payload: {
            id: user.id,
          },
          headers: {
            cookie: adminCookie,
          },
        });

        const res = await app.inject({
          method: 'POST',
          url: '/api/admin/create',
          headers: {
            cookie: adminCookie,
          },
          payload: {
            id: user.id,
          },
        });

        expect(res.statusCode).toBe(409);
        expect(res.json()).toEqual({ message: 'The user already has other role' });

        await cleanUpUser(app, adminCookie, user.id);
      });
    });

    describe('when user is already an admin', async () => {
      it('then should return 409 with proper message', async () => {
        const user = await createUser(app, adminCookie);
        await app.inject({
          method: 'POST',
          url: '/api/admin/create',
          payload: {
            id: user.id,
          },
          headers: {
            cookie: adminCookie,
          },
        });

        const res = await app.inject({
          method: 'POST',
          url: '/api/admin/create',
          headers: {
            cookie: adminCookie,
          },
          payload: {
            id: user.id,
          },
        });

        expect(res.statusCode).toBe(409);
        expect(res.json()).toEqual({ message: 'The user is already admin' });

        await cleanUpUser(app, adminCookie, user.id);
      });
    });
  });
});
