import { loginSuperAdminAndGetCookie } from 'test/helpers/auth.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('/user', () => {
  const redisMock = createRedisMock();
  const app = buildTestServer(prismaClient, redisMock);
  let adminCookie: string;
  beforeAll(async () => {
    await app.ready();
    adminCookie = await loginSuperAdminAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('/create', () => {
    describe('when just login and password are provided', async () => {
      it.todo('then should create user and not expose password hash', async () => {});
    });

    describe('when all fields are provided', async () => {
      it.todo('then should create user and save them', async () => {});
    });

    describe('when login is <3 characters long', async () => {
      it('then should return 400 and validation error', async () => {
        const res = await app.inject({
          method: 'POST',
          url: '/api/user/create',
          payload: {
            login: 'AB'
          },
          headers: {
            cookie: adminCookie
          }
        });

        expect(res.statusCode).toBe(400);
        expect(res.json()).toMatchObject({ code: 'FST_ERR_VALIDATION' });
      });
    });

    describe('when login is not provided', async () => {
      it('then should return 400', async () => {
        const res = await app.inject({
          method: 'POST',
          url: '/api/user/create',
          payload: {},
        });

        expect(res.statusCode).toBe(400);
      });
    });

    describe('when custom id is provided while other fields are valid', async () => {
      it('then should return 400', async () => {
        const res = await app.inject({
          method: 'POST',
          url: '/api/user/create',
          payload: {
            id: 2,
            login: 'Rich'
          },
          headers: {
            cookie: adminCookie
          }
        });

        expect(res.statusCode).toBe(400);
      });
    });
  });

  describe('/update', () => {
    describe('when admin updates a user and provides valid id', async () => {
      it.todo('then should update user', async () => {
        const res = await app.inject({
          method: 'PATCH',
          url: '/api/user/update',
          payload: {
            id: 1,
            login: 'Rich',
            fullName: 'Richard',
            email: 'exa@ple.com',
            telegramId: '@rich'
          },
          headers: {
            cookie: adminCookie
          }
        });

        expect(res.statusCode).toBe(200);
        expect(res.json()).toStrictEqual({
          id: 1,
          login: 'Rich',
          fullName: 'Richard',
          email: 'exa@ple.com',
          telegramId: '@rich',
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        });
      });
    });
  });
});
