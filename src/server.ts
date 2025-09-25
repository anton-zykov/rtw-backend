import Fastify from 'fastify';
import healthRoutes from './routes/health.js';

export function buildServer () {
  const app = Fastify({ logger: true });

  // register routes/plugins here
  app.register(healthRoutes, { prefix: '/api' });

  return app;
}
