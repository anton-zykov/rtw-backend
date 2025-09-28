import fastify from 'fastify';
import { healthRoutes } from '#/routes/health.js';
import { prismaPlugin } from '#/plugins/prisma.js';

export function buildServer () {
  const app = fastify({ logger: true });

  app.register(prismaPlugin);
  app.register(healthRoutes, { prefix: '/api' });

  return app;
}
