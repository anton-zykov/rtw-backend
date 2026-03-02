import fastify, {
  type FastifyPluginAsync,
  type FastifyInstance,
  type FastifyBaseLogger,
  type RawReplyDefaultExpression,
  type RawRequestDefaultExpression,
  type RawServerDefault,
} from 'fastify';
import { fastifyCookie } from '@fastify/cookie';
import { authGuardPlugin } from '#/plugins/auth-guard.js';
import { errorHandlerPlugin } from './plugins/error-handler.js';
import type { PrismaPluginOptions } from '#/plugins/prisma.js';
import type { RedisPluginOptions } from '#/plugins/redis.js';
import type { TelegramPluginOptions } from '#/plugins/telegram.js';
import { sessionPlugin, type SessionPluginOptions } from '#/plugins/session.js';
import cors from '@fastify/cors';
import {
  type ZodTypeProvider,
  validatorCompiler,
  serializerCompiler,
} from 'fastify-type-provider-zod';
import {
  adminRoutes,
  adverbsTaskRoutes,
  authRoutes,
  genitiveTaskRoutes,
  healthRoutes,
  stressTaskRoutes,
  studentRoutes,
  teacherRoutes,
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
  redisPlugin: FastifyPluginAsync<RedisPluginOptions>;
  telegramPlugin: FastifyPluginAsync<TelegramPluginOptions>;
  config: {
    logger: boolean;
    https: { key: Buffer; cert: Buffer } | null;
    cors: { frontendUrl: string; } | null;
    cookie: { secret: string };
    session: SessionPluginOptions;
    prisma: PrismaPluginOptions;
    redis: RedisPluginOptions;
    telegram: TelegramPluginOptions;
  };
};

export function buildServer (deps: BuildDeps): FastifyZodInstance {
  const app = fastify({
    logger: deps.config.logger
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          },
        }
      : false,
    https: deps.config.https && {
      key: deps.config.https.key,
      cert: deps.config.https.cert,
    },
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.register(fastifyCookie, { secret: deps.config.cookie.secret });
  app.register(errorHandlerPlugin);
  app.register(deps.prismaPlugin, { prismaClient: deps.config.prisma.prismaClient });
  app.register(deps.redisPlugin, { redisClient: deps.config.redis.redisClient });
  app.register(deps.telegramPlugin, { token: deps.config.telegram.token });
  app.register(sessionPlugin, { secret: deps.config.session.secret, store: deps.config.session.store });
  app.register(authGuardPlugin);
  if (deps.config.cors) {
    app.register(cors, {
      origin: deps.config.cors.frontendUrl,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    });
  }

  app.register(adminRoutes, { prefix: '/api/admin' });
  app.register(adverbsTaskRoutes, { prefix: '/api/adverbs-task' });
  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(genitiveTaskRoutes, { prefix: '/api/genitive-task' });
  app.register(healthRoutes, { prefix: '/api' });
  app.register(studentRoutes, { prefix: '/api/student' });
  app.register(stressTaskRoutes, { prefix: '/api/stress-task' });
  app.register(teacherRoutes, { prefix: '/api/teacher' });
  app.register(trickyTaskRoutes, { prefix: '/api/tricky-task' });
  app.register(userRoutes, { prefix: '/api/user' });

  return app;
}
