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
import {
  adminRoutes,
  genitiveTaskExerciseRoutes,
  genitiveTaskPoolRoutes,
  genitiveTaskStudentRoutes,
  healthRoutes,
  stressTaskRoutes,
  studentRoutes,
  trickyTaskRoutes,
  userRoutes
} from '#/routes/index.js';

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

  app.register(adminRoutes, { prefix: '/api/admin' });
  app.register(genitiveTaskExerciseRoutes, { prefix: '/api/genitive/exercise' });
  app.register(genitiveTaskPoolRoutes, { prefix: '/api/genitive/pool' });
  app.register(genitiveTaskStudentRoutes, { prefix: '/api/genitive/student' });
  app.register(healthRoutes, { prefix: '/api' });
  app.register(studentRoutes, { prefix: '/api/student' });
  app.register(stressTaskRoutes, { prefix: '/api/stress' });
  app.register(trickyTaskRoutes, { prefix: '/api/tricky' });
  app.register(userRoutes, { prefix: '/api/user' });

  return app;
}
