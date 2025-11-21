import { z } from 'zod';
import bcrypt from 'bcrypt';
import { findUserById } from '#/services/auth/findUserById.js';
import { findUserByLogin } from '#/services/auth/findUserByLogin.js';
import type { FastifyZodInstance } from '#/server.js';

const LoginBody = z.object({
  login: z.string(),
  password: z.string(),
}).strict();

const MeReply = z.object({
  id: z.number(),
  login: z.string()
}).strict();

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
