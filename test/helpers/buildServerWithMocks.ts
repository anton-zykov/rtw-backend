import { prismaPlugin } from '#/plugins/prisma.js';
import { telegramPlugin } from '#/plugins/__mocks__/telegram.js';
import { redisPlugin } from '#/plugins/redis.js';
import { buildServer, type FastifyZodInstance } from '#/server.js';
import type { PrismaClient } from '@prisma/client';
import type { RedisClientType } from 'redis';
import type { DeepMockProxy } from 'vitest-mock-extended';

export function buildServerWithMocks (
  prismaMock: DeepMockProxy<PrismaClient>,
  redisMock: DeepMockProxy<RedisClientType>
): FastifyZodInstance {
  return buildServer({
    prismaPlugin,
    telegramPlugin,
    redisPlugin,
    config: {
      logger: false,
      telegram: {
        token: undefined
      },
      prisma: {
        prismaClient: prismaMock
      },
      redis: {
        redisClient: redisMock
      }
    }
  });
}
