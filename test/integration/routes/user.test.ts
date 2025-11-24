import { loginAndGetCookie } from 'test/helpers/auth.js';
import { buildServerWithMocks } from 'test/helpers/buildServerWithMocks.js';
import { createPrismaMock } from 'test/helpers/createPrismaMock.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

describe('user routes', () => {
  const prismaMock = createPrismaMock();
  const redisMock = createRedisMock();
  const app = buildServerWithMocks(prismaMock, redisMock);
  let authCookie: string;
  beforeAll(async () => {
    await app.ready();
    authCookie = await loginAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('user create', () => {
    afterEach(() => prismaMock.user.create.mockReset());

    it('creates a user with login only and doesn\'t expose password hash', async () => {
      prismaMock.user.create.mockResolvedValue({
        id: 1,
        login: 'Rich',
        fullName: null,
        email: null,
        telegramId: null,
        passwordHash: 'placeholder',
        passwordVersion: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const res = await app.inject({
        method: 'POST',
        url: '/api/user/create',
        payload: { login: 'Rich', password: 'test-password' },
        headers: {
          cookie: authCookie
        }
      });

      expect(res.statusCode).toBe(201);
      expect(res.json()).toStrictEqual({
        id: 1,
        login: 'Rich',
        fullName: null,
        email: null,
        telegramId: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it('creates a user with all fields', async () => {
      prismaMock.user.create.mockResolvedValue({
        id: 1,
        login: 'Rich',
        fullName: 'Richard',
        email: 'exa@ple.com',
        telegramId: '@rich',
        passwordHash: 'placeholder',
        passwordVersion: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const res = await app.inject({
        method: 'POST',
        url: '/api/user/create',
        payload: {
          login: 'Rich',
          fullName: 'Richard',
          email: 'exa@ple.com',
          telegramId: '@rich',
          password: 'test-password'
        },
        headers: {
          cookie: authCookie
        }
      });

      expect(res.statusCode).toBe(201);
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

    it('fails to create a user with short <3 characters login', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/user/create',
        payload: { login: 'AB' },
        headers: {
          cookie: authCookie
        }
      });

      expect(res.statusCode).toBe(400);
      expect(res.json()).toMatchObject({ code: 'FST_ERR_VALIDATION' });
    });

    it('fails to create a user with no login', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/user/create',
        payload: {},
      });

      expect(res.statusCode).toBe(400);
    });

    it('doesn\'t allow custom id', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/user/create',
        payload: {
          id: 2,
          login: 'Rich'
        },
        headers: {
          cookie: authCookie
        }
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('user update', () => {
    afterEach(() => prismaMock.user.update.mockReset());

    it('updates a user', async () => {
      prismaMock.user.update.mockResolvedValue({
        id: 1,
        login: 'Rich',
        fullName: 'Richard',
        email: 'exa@ple.com',
        telegramId: '@rich',
        passwordHash: 'placeholder',
        passwordVersion: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });

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
          cookie: authCookie
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
