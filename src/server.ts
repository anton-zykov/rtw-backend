import fastify, {
  type FastifyPluginAsync,
  type FastifyInstance,
  type FastifyBaseLogger,
  type RawReplyDefaultExpression,
  type RawRequestDefaultExpression,
  type RawServerDefault,
} from 'fastify';
import { fastifyCookie } from '@fastify/cookie';
import { authGuardPlugin } from '#/plugins/auth-guards.js';
import { errorHandlerPlugin } from './plugins/errorHandler.js';
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
  authRoutes,
  genitiveTaskExerciseRoutes,
  genitiveTaskPoolRoutes,
  genitiveTaskStudentRoutes,
  healthRoutes,
  stressTaskExerciseRoutes,
  stressTaskPoolRoutes,
  stressTaskStudentRoutes,
  studentRoutes,
  teacherRoutes,
  trickyTaskExerciseRoutes,
  trickyTaskPoolRoutes,
  trickyTaskStudentRoutes,
  userRoutes
} from '#/routes/index.js';

export type FastifyZodInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>;
type FastifyCookieOptions = {
  secret: string;
};

type BuildDeps = {
  prismaPlugin: FastifyPluginAsync<PrismaPluginOptions>;
  redisPlugin: FastifyPluginAsync<RedisPluginOptions>;
  telegramPlugin: FastifyPluginAsync<TelegramPluginOptions>;
  config: {
    logger: boolean;
    https: { key: Buffer; cert: Buffer } | null;
    cookie: FastifyCookieOptions;
    session: SessionPluginOptions;
    prisma: PrismaPluginOptions;
    redis: RedisPluginOptions;
    telegram: TelegramPluginOptions;
  };
};

export function buildServer (deps: BuildDeps): FastifyZodInstance {
  const app = fastify({
    logger: deps.config.logger,
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
  app.register(cors, {
    origin: 'https://127.0.0.1:5173',
    credentials: true,
  });

  app.register(adminRoutes, { prefix: '/api/admin' });
  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(genitiveTaskExerciseRoutes, { prefix: '/api/genitive-task/exercise' });
  app.register(genitiveTaskPoolRoutes, { prefix: '/api/genitive-task/pool' });
  app.register(genitiveTaskStudentRoutes, { prefix: '/api/genitive-task/student' });
  app.register(healthRoutes, { prefix: '/api' });
  app.register(studentRoutes, { prefix: '/api/student' });
  app.register(stressTaskExerciseRoutes, { prefix: '/api/stress-task/exercise' });
  app.register(stressTaskPoolRoutes, { prefix: '/api/stress-task/pool' });
  app.register(stressTaskStudentRoutes, { prefix: '/api/stress-task/student' });
  app.register(teacherRoutes, { prefix: '/api/teacher' });
  app.register(trickyTaskExerciseRoutes, { prefix: '/api/tricky-task/exercise' });
  app.register(trickyTaskPoolRoutes, { prefix: '/api/tricky-task/pool' });
  app.register(trickyTaskStudentRoutes, { prefix: '/api/tricky-task/student' });
  app.register(userRoutes, { prefix: '/api/user' });

  return app;
}
