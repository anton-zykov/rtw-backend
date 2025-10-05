import fastify, { type FastifyPluginAsync } from 'fastify';
import type { TelegramPluginOptions } from '#/plugins/telegram.js';
import { healthRoutes } from '#/routes/health.js';

type BuildDeps = {
  prismaPlugin: FastifyPluginAsync;
  telegramPlugin: FastifyPluginAsync<TelegramPluginOptions>;
  config: {
    logger: boolean;
    telegram: TelegramPluginOptions;
  };
};

export function buildServer (deps: BuildDeps) {
  const app = fastify({ logger: deps.config.logger });

  app.register(deps.prismaPlugin);
  app.register(deps.telegramPlugin, { token: deps.config.telegram.token });
  app.register(healthRoutes, { prefix: '/api' });

  return app;
}
