import { buildServer, type FastifyZodInstance } from '#/server.js';
import { prismaPlugin } from '#/plugins/prisma.js';
import { telegramPlugin } from '#/plugins/__mocks__/telegram.js';
import type { PrismaClient } from '@prisma/client';

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

describe('user routes', () => {
  let app: FastifyZodInstance;
  const prismaMock = mockDeep<PrismaClient>();
  Object.defineProperty(prismaMock, 'getter', { value: () => prismaMock });

  beforeAll(async () => {
    app = buildServer({
      prismaPlugin,
      telegramPlugin,
      config: {
        logger: false,
        telegram: {
          token: undefined
        },
        prisma: {
          prismaClient: prismaMock
        }
      }
    });
    await app.ready();
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
        payload: { login: 'Rich' },
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
          telegramId: '@rich'
        },
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
