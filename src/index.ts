import 'dotenv/config';
import { buildServer } from '#/server.js';
import { prismaPlugin } from '#/plugins/prisma.js';
import { redisPlugin } from '#/plugins/redis.js';
import { telegramPlugin } from '#/plugins/telegram.js';
import { createRedisClient } from '#/libs/redis.js';
import { PrismaClient } from '@prisma/client';

const port = Number(process.env['PORT'] ?? 3000);
const host = process.env['HOST'] ?? '0.0.0.0';

if (process.env['COOKIE_SECRET'] === undefined) {
  throw new Error('COOKIE_SECRET is not defined');
}
if (process.env['SESSION_SECRET'] === undefined) {
  throw new Error('SESSION_SECRET is not defined');
}

const app = buildServer({
  prismaPlugin,
  redisPlugin,
  telegramPlugin,
  config: {
    logger: true,
    cookie: {
      secret: process.env['COOKIE_SECRET'],
    },
    session: {
      secret: process.env['SESSION_SECRET'],
    },
    telegram: {
      token: process.env['TELEGRAM_BOT_TOKEN']
    },
    prisma: {
      prismaClient: new PrismaClient()
    },
    redis: {
      redisClient: createRedisClient(process.env['REDIS_PORT'] ?? '6379')
    }
  }
});

await app.ready();

app.listen({ port, host })
  .then(address => {
    app.log.info(`🚀 Server listening at ${address}`);
  })
  .catch(err => {
    app.log.error(err);
    process.exit(1);
  });
