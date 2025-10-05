import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyInstance } from 'fastify';

export const telegramPlugin: FastifyPluginAsync = fp(
  async (app: FastifyInstance) => {
    app.log.debug('telegram noop plugin attached');
  }
);
