import 'dotenv/config';
import { buildServer } from '#/server.js';
import { prismaPlugin } from '#/plugins/prisma.js';
import { telegramPlugin } from '#/plugins/telegram.js';
import { PrismaClient } from '@prisma/client';

const port = Number(process.env['PORT'] ?? 3000);
const host = process.env['HOST'] ?? '0.0.0.0';

const app = buildServer({
  prismaPlugin,
  telegramPlugin,
  config: {
    logger: true,
    telegram: {
      token: process.env['TELEGRAM_BOT_TOKEN']
    },
    prisma: {
      prismaClient: new PrismaClient()
    }
  }
});

app.listen({ port, host })
  .then(address => {
    app.log.info(`🚀 Server listening at ${address}`);
  })
  .catch(err => {
    app.log.error(err);
    process.exit(1);
  });
