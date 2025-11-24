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
      cookie: {
        secret: 'test_cookie_secret'
      },
      session: {
        secret: 'ultimate_very_long_and_secure_test_session_secret',
        store: undefined // default in-memory
      },
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
