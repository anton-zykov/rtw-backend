import 'dotenv/config';
import fs from 'fs';
import { buildServer } from '#/server.js';
import { prismaPlugin } from '#/plugins/prisma.js';
import { redisPlugin } from '#/plugins/redis.js';
import { telegramPlugin } from '#/plugins/telegram.js';
import { createRedisClient } from '#/libs/redis.js';
import { PrismaClient } from '@prisma/client';
import { RedisSessionStore } from '#/plugins/session.js';

const port = Number(process.env['PORT'] ?? 3000);
const host = process.env['HOST'] ?? '0.0.0.0';

if (process.env['COOKIE_SECRET'] === undefined) {
  throw new Error('COOKIE_SECRET is not defined');
}
if (process.env['SESSION_SECRET'] === undefined) {
  throw new Error('SESSION_SECRET is not defined');
}

const redisClient = createRedisClient(process.env['REDIS_PORT'] ?? '6379');

const app = buildServer({
  prismaPlugin,
  redisPlugin,
  telegramPlugin,
  config: {
    logger: true,
    https: process.env['HTTPS'] === 'true'
      ? {
          key: fs.readFileSync(process.env['HTTPS_KEY'] ?? ''),
          cert: fs.readFileSync(process.env['HTTPS_CERT'] ?? ''),
        }
      : null,
    cors: process.env['CORS_FRONTEND_URL'] ? { frontendUrl: process.env['CORS_FRONTEND_URL'] } : null,
    cookie: {
      secret: process.env['COOKIE_SECRET'],
    },
    session: {
      secret: process.env['SESSION_SECRET'],
      store: new RedisSessionStore(redisClient, {
        prefix: 'sess:',
        ttl: 7 * 24 * 60 * 60 * 1000,
      })
    },
    telegram: {
      token: process.env['TELEGRAM_BOT_TOKEN']
    },
    prisma: {
      prismaClient: new PrismaClient()
    },
    redis: {
      redisClient,
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
