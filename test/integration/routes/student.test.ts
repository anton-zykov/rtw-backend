import { buildServer, type FastifyZodInstance } from '#/server.js';
import { prismaPlugin } from '#/plugins/prisma.js';
import { telegramPlugin } from '#/plugins/__mocks__/telegram.js';
import type { PrismaClient } from '@prisma/client';

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

describe('student routes', () => {
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

  describe('student create', () => {
    afterEach(() => prismaMock.student.create.mockReset());

    it('creates student', async () => {
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
      prismaMock.student.create.mockResolvedValue({ id: 1 });

      const res = await app.inject({
        method: 'POST',
        url: '/api/student/create',
        payload: { id: 1 },
      });

      expect(res.statusCode).toBe(201);
      expect(res.json()).toStrictEqual({ id: 1 });
    });

    it('fails to create student without id', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/student/create',
        payload: {},
      });

      expect(res.statusCode).toBe(400);
    });

    it('fails to create student if no user with same id', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const res = await app.inject({
        method: 'POST',
        url: '/api/student/create',
        payload: { id: 1 },
      });

      expect(res.statusCode).toBe(404);
    });

    it('fails to create student if user is already student', async () => {
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
        url: '/api/student/create',
        payload: { id: 1 },
      });

      expect(res.statusCode).toBe(400);
    });
  });
});
