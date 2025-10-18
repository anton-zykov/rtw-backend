import fastify, {
  type FastifyPluginAsync,
  type FastifyInstance,
  type FastifyBaseLogger,
  type RawReplyDefaultExpression,
  type RawRequestDefaultExpression,
  type RawServerDefault,
} from 'fastify';
import type { TelegramPluginOptions } from '#/plugins/telegram.js';
import type { PrismaPluginOptions } from '#/plugins/prisma.js';
import {
  type ZodTypeProvider,
  validatorCompiler,
  serializerCompiler,
} from 'fastify-type-provider-zod';
import { healthRoutes } from '#/routes/health.js';
import { userRoutes } from '#/routes/user.js';

export type FastifyZodInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>;

type BuildDeps = {
  prismaPlugin: FastifyPluginAsync<PrismaPluginOptions>;
  telegramPlugin: FastifyPluginAsync<TelegramPluginOptions>;
  config: {
    logger: boolean;
    telegram: TelegramPluginOptions;
    prisma: PrismaPluginOptions;
  };
};

export function buildServer (deps: BuildDeps): FastifyZodInstance {
  const app = fastify({ logger: deps.config.logger });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.register(deps.prismaPlugin, { prismaClient: deps.config.prisma.prismaClient });
  app.register(deps.telegramPlugin, { token: deps.config.telegram.token });
  app.register(healthRoutes, { prefix: '/api' });
  app.register(userRoutes, { prefix: '/api/user' });

  return app;
}
