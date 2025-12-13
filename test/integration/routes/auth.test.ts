import { loginSuperAdminAndGetCookie } from 'test/helpers/auth.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { User } from '@prisma/client';

describe('/auth', () => {
  const redisMock = createRedisMock();
  const app = buildTestServer(prismaClient, redisMock);
  let adminCookie: string;
  beforeAll(async () => {
    await app.ready();
    adminCookie = await loginSuperAdminAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  let user: User;
  beforeAll(async () => {
    const random = Math.floor(Math.random() * 1000);
    user = (await app.inject({
      method: 'POST',
      url: '/api/user/create',
      payload: {
        login: `Tester${random}`,
        password: 'correct-password',
      },
      headers: {
        cookie: adminCookie
      }
    })).json();
  });

  describe('/login', () => {
    describe('when correct credentials are provided', () => {
      it('then should be able to login and recieve working session', async () => {
        const res = await app.inject({
          method: 'POST',
          url: '/api/auth/login',
          payload: {
            login: user.login,
            password: 'correct-password',
          }
        });

        const token = res.cookies.find(cookie => cookie.name === 'sid')?.value;
        expect(typeof token === 'string' && token !== '').toEqual(true);
        expect(res.statusCode).toBe(200);

        const userCookie = 'sid=' + token;
        const meRes = await app.inject({
          method: 'GET',
          url: '/api/auth/me',
          headers: {
            cookie: userCookie
          }
        });

        expect(meRes.statusCode).toBe(200);
        expect(meRes.json()).toStrictEqual({ id: user.id, login: user.login });
      });
    });

    describe('when incorrect credentials are provided', () => {
      it('then should fail to login and recieve 401', async () => {
        const res = await app.inject({
          method: 'POST',
          url: '/api/auth/login',
          payload: {
            login: user.login,
            password: 'incorrect-password',
          }
        });

        expect(res.cookies.find(cookie => cookie.name === 'sid')).toBeUndefined();
        expect(res.statusCode).toBe(401);
      });
    });
  });

  describe('/logout', () => {
    describe('when user has successfully logged in', () => {
      it('then on logout should remove cookie, old session should be invalidated', async () => {
        const loginRes = await app.inject({
          method: 'POST',
          url: '/api/auth/login',
          payload: {
            login: user.login,
            password: 'correct-password',
          }
        });

        const userCookie = 'sid=' + loginRes.cookies.find(cookie => cookie.name === 'sid')?.value;

        const meAuthenticatedRes = await app.inject({
          method: 'GET',
          url: '/api/auth/me',
          headers: {
            cookie: userCookie
          }
        });

        expect(meAuthenticatedRes.statusCode).toBe(200);
        expect(meAuthenticatedRes.json()).toStrictEqual({ id: user.id, login: user.login });

        const logoutRes = await app.inject({
          method: 'POST',
          url: '/api/auth/logout',
          headers: {
            cookie: userCookie
          }
        });

        expect(logoutRes.cookies.find(cookie => cookie.name === 'sid')?.value === '').toEqual(true);
        expect(logoutRes.statusCode).toBe(200);

        const meUnauthenticatedRes = await app.inject({
          method: 'GET',
          url: '/api/auth/me',
          headers: {
            cookie: userCookie
          }
        });

        expect(meUnauthenticatedRes.statusCode).toBe(401);
      });
    });
  });

  describe('/me', () => {
    describe('when there is no logged in user', async () => {
      it.todo('then should return 401 and proper message', async () => {});
    });

    describe('when there is logged in user with no role', async () => {
      it.todo('then should return user\'s id, login and role===not-set', async () => {});
    });

    describe('when there is logged in admin', async () => {
      it.todo('then should return user\'s id, login and role===admin', async () => {});
    });

    describe('when there is logged in student', async () => {
      it.todo('then should return user\'s id, login and role===student', async () => {});
    });
  });
});
