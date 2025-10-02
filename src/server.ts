import fastify from 'fastify';
import { healthRoutes } from '#/routes/health.js';
import { prismaPlugin } from '#/plugins/prisma.js';
import { telegramPlugin } from '#/plugins/telegram.js';

export function buildServer () {
  const app = fastify({ logger: true });

  app.register(prismaPlugin);
  app.register(telegramPlugin, { token: process.env['TELEGRAM_BOT_TOKEN'] });
  app.register(healthRoutes, { prefix: '/api' });

  return app;
}
