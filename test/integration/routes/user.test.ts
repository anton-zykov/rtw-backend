import { buildServer, type FastifyZodInstance } from '#/server.js';
import { prismaPlugin } from '#/plugins/prisma.js';
import { telegramPlugin } from '#/plugins/__mocks__/telegram.js';
import type { PrismaClient } from '@prisma/client';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

describe('user create', () => {
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

  it('uses the mocked prisma', async () => {
    prismaMock.user.create.mockResolvedValue({
      id: 1,
      login: 'Rich',
      fullName: null,
      email: null,
      telegramId: null,
      passwordHash: '',
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
  });
});
