import { loginAndGetCookie } from 'test/helpers/auth.js';
import { buildServerWithMocks } from 'test/helpers/buildServerWithMocks.js';
import { createPrismaMock } from 'test/helpers/createPrismaMock.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

describe('admin routes', () => {
  const prismaMock = createPrismaMock();
  const redisMock = createRedisMock();
  const app = buildServerWithMocks(prismaMock, redisMock);
  let authCookie: string;
  beforeAll(async () => {
    await app.ready();
    authCookie = await loginAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('admin create', () => {
    afterEach(() => prismaMock.admin.create.mockReset());

    it('creates admin', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
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
      prismaMock.admin.create.mockResolvedValue({ id: 1 });

      const res = await app.inject({
        method: 'POST',
        url: '/api/admin/create',
        payload: { id: 1 },
      });

      expect(res.statusCode).toBe(201);
      expect(res.json()).toStrictEqual({ id: 1 });
    });

    it('fails to create admin without id', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/admin/create',
        payload: {},
        headers: {
          cookie: authCookie
        }
      });

      expect(res.statusCode).toBe(400);
    });

    it('fails to create admin if no user with same id', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const res = await app.inject({
        method: 'POST',
        url: '/api/admin/create',
        payload: { id: 1 },
        headers: {
          cookie: authCookie
        }
      });

      expect(res.statusCode).toBe(404);
    });

    it('fails to create admin if user is already student', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
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
      prismaMock.student.findUnique.mockResolvedValue({ id: 1 });

      const res = await app.inject({
        method: 'POST',
        url: '/api/admin/create',
        payload: { id: 1 },
        headers: {
          cookie: authCookie
        }
      });

      expect(res.statusCode).toBe(400);
    });
  });
});
