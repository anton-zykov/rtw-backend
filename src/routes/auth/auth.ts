import { z } from 'zod';
import bcrypt from 'bcrypt';
import { LoginBody, MeReply } from './auth.schema.js';
import { findAdminById } from '#/services/admin/index.js';
import { findStudentById } from '#/services/student/index.js';
import { findUserById, findUserByLogin } from '#/services/user/index.js';
import type { FastifyZodInstance } from '#/server.js';

export async function authRoutes (app: FastifyZodInstance) {
  app.post('/login', {
    schema: {
      body: LoginBody,
      response: {
        200: z.void(),
        400: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
        404: z.object({ message: z.string() })
      },
    }
  }, async (req, reply) => {
    const parsed = LoginBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ message: 'Invalid body' });
    }
    const { login, password } = parsed.data;
    const user = await findUserByLogin(app.prisma, { login });
    if (!user) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    req.session.userId = user.id;

    if (await findStudentById(app.prisma, { id: user.id }) !== null) req.session.role = 'student';
    else if (await findAdminById(app.prisma, { id: user.id }) !== null) req.session.role = 'admin';
    else req.session.role = 'not-set';

    return reply.status(200).send();
  });

  app.post('/logout', {
    schema: {
      response: {
        200: z.void(),
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
        401: z.object({ message: z.string() }),
      },
    }
  }, async (req, reply) => {
    if (!req.session.userId) {
      return reply.code(401).send({ message: 'Not logged in' });
    }

    const user = await findUserById(app.prisma, { id: req.session.userId });

    if (!user) {
      return reply.code(401).send({ message: 'User not found' });
    }

    return reply.send(user);
  });
}
