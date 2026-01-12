import { loginSuperAdminAndGetCookie } from 'test/helpers/auth.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createUser, cleanUpUser, createAdmin, createStudent, createTeacher } from 'test/hooks/index.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('/auth', () => {
  const redisMock = createRedisMock();
  const app = buildTestServer(prismaClient, redisMock);
  let adminCookie: string;
  beforeAll(async () => {
    await app.ready();
    adminCookie = await loginSuperAdminAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('/login', () => {
    describe('when correct credentials are provided', () => {
      it('then should be able to login and recieve working session', async () => {
        const user = await createUser(app, adminCookie);
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
        expect(meRes.json()).toStrictEqual({ id: user.id, login: user.login, role: 'not_set' });

        await cleanUpUser(app, adminCookie, user.id);
      });
    });

    describe('when incorrect credentials are provided', () => {
      it('then should fail to login and recieve 401', async () => {
        const user = await createUser(app, adminCookie);
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

        await cleanUpUser(app, adminCookie, user.id);
      });
    });
  });

  describe('/logout', () => {
    describe('when user has successfully logged in', () => {
      it('then on logout should remove cookie, old session should be invalidated', async () => {
        const user = await createUser(app, adminCookie);
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
        expect(meAuthenticatedRes.json()).toStrictEqual({ id: user.id, login: user.login, role: 'not_set' });

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

        await cleanUpUser(app, adminCookie, user.id);
      });
    });
  });

  describe('/me', () => {
    describe('when there is no logged in user', async () => {
      it('then should return 401 and proper message', async () => {
        const user = await createUser(app, adminCookie);
        const res = await app.inject({
          method: 'GET',
          url: '/api/auth/me',
        });

        expect(res.statusCode).toBe(401);
        expect(res.json()).toStrictEqual({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

        await cleanUpUser(app, adminCookie, user.id);
      });
    });

    describe('when there is logged in user with no role', async () => {
      it('then should return user\'s id, login and role===not_set', async () => {
        const user = await createUser(app, adminCookie);
        const loginRes = await app.inject({
          method: 'POST',
          url: '/api/auth/login',
          payload: {
            login: user.login,
            password: 'correct-password',
          }
        });

        const userCookie = 'sid=' + loginRes.cookies.find(cookie => cookie.name === 'sid')?.value;

        const meRes = await app.inject({
          method: 'GET',
          url: '/api/auth/me',
          headers: {
            cookie: userCookie
          }
        });

        expect(meRes.statusCode).toBe(200);
        expect(meRes.json()).toStrictEqual({ id: user.id, login: user.login, role: 'not_set' });

        await cleanUpUser(app, adminCookie, user.id);
      });
    });

    describe('when there is logged in admin', async () => {
      it('then should return user\'s id, login and role===admin', async () => {
        const user = await createUser(app, adminCookie);
        await createAdmin(app, adminCookie, user.id);
        const loginRes = await app.inject({
          method: 'POST',
          url: '/api/auth/login',
          payload: {
            login: user.login,
            password: 'correct-password',
          }
        });

        const userCookie = 'sid=' + loginRes.cookies.find(cookie => cookie.name === 'sid')?.value;

        const meRes = await app.inject({
          method: 'GET',
          url: '/api/auth/me',
          headers: {
            cookie: userCookie
          }
        });

        expect(meRes.statusCode).toBe(200);
        expect(meRes.json()).toStrictEqual({ id: user.id, login: user.login, role: 'admin' });

        await cleanUpUser(app, adminCookie, user.id);
      });
    });

    describe('when there is logged in student', async () => {
      it('then should return user\'s id, login and role===student', async () => {
        const user = await createUser(app, adminCookie);
        const teacher = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacher.id);
        await createStudent(app, adminCookie, user.id, teacher.id);
        const loginRes = await app.inject({
          method: 'POST',
          url: '/api/auth/login',
          payload: {
            login: user.login,
            password: 'correct-password',
          }
        });

        const userCookie = 'sid=' + loginRes.cookies.find(cookie => cookie.name === 'sid')?.value;

        const meRes = await app.inject({
          method: 'GET',
          url: '/api/auth/me',
          headers: {
            cookie: userCookie
          }
        });

        expect(meRes.statusCode).toBe(200);
        expect(meRes.json()).toStrictEqual({ id: user.id, login: user.login, role: 'student' });

        await cleanUpUser(app, adminCookie, user.id);
        await cleanUpUser(app, adminCookie, teacher.id);
      });
    });

    describe('when there is logged in teacher', async () => {
      it('then should return user\'s id, login and role===teacher', async () => {
        const user = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, user.id);
        const loginRes = await app.inject({
          method: 'POST',
          url: '/api/auth/login',
          payload: {
            login: user.login,
            password: 'correct-password',
          }
        });

        const userCookie = 'sid=' + loginRes.cookies.find(cookie => cookie.name === 'sid')?.value;

        const meRes = await app.inject({
          method: 'GET',
          url: '/api/auth/me',
          headers: {
            cookie: userCookie
          }
        });

        expect(meRes.statusCode).toBe(200);
        expect(meRes.json()).toStrictEqual({ id: user.id, login: user.login, role: 'teacher' });

        await cleanUpUser(app, adminCookie, user.id);
      });
    });
  });
});
