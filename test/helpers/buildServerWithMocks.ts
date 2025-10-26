import { prismaPlugin } from '#/plugins/prisma.js';
import { telegramPlugin } from '#/plugins/__mocks__/telegram.js';
import { buildServer, type FastifyZodInstance } from '#/server.js';
import type { PrismaClient } from '@prisma/client';
import type { DeepMockProxy } from 'vitest-mock-extended';

export function buildServerWithMocks (
  prismaMock: DeepMockProxy<PrismaClient>
): FastifyZodInstance {
  return buildServer({
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
}
