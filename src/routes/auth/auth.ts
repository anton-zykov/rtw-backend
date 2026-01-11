import { z } from 'zod';
import bcrypt from 'bcrypt';
import { LoginBody, LoginReply, MeReply } from './auth.schema.js';
import { findUserById, findUserByLogin } from '#/services/user/index.js';
import { AppError, AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function authRoutes (app: FastifyZodInstance) {
  app.post('/login', {
    schema: {
      body: LoginBody,
      response: {
        200: LoginReply,
        default: AppErrorSchema
      },
    }
  }, async (req, reply) => {
    const parsed = LoginBody.safeParse(req.body);
    if (!parsed.success) throw new AppError('VALIDATION', 'Invalid body');

    const { login, password } = parsed.data;
    const user = await findUserByLogin(app.prisma, { login });
    if (!user) throw new AppError('UNAUTHORIZED', 'Invalid credentials');
    if (!user.active) throw new AppError('FORBIDDEN', 'User is disabled');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new AppError('UNAUTHORIZED', 'Invalid credentials');

    req.session.userId = user.id;
    req.session.role = user.role;

    return reply.status(200).send({
      role: req.session.role
    });
  });

  app.post('/logout', {
    schema: {
      response: {
        200: z.void(),
        default: AppErrorSchema
      },
    }
  }, async (req, reply) => {
    await req.session.destroy();
    return reply.clearCookie('sid').status(200).send();
  });

  app.get('/me', {
    preHandler: app.requireSession,
    schema: {
      response: {
        200: MeReply,
        default: AppErrorSchema,
      },
    }
  }, async (req, reply) => {
    const user = await findUserById(app.prisma, { id: req.session.userId });
    if (!user) throw new AppError('USER_NOT_FOUND', 'User not found');
    return reply.status(200).send(user);
  });
}
