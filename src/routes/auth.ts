import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
// import bcrypt from 'bcrypt';
import type { FastifyZodInstance } from '#/server.js';

const prisma = new PrismaClient();

const loginBodySchema = z.object({
  login: z.string(),
  password: z.string(),
});

export async function authRoutes (app: FastifyZodInstance) {
  app.post('/login', async (request, reply) => {
    const parsed = loginBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ message: 'Invalid body' });
    }
    const { login, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { login } });
    if (!user) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    const ok = password === user.passwordHash; // await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    request.session.userId = user.id;

    return reply.send({ ok: true });
  });

  app.post('/logout', async (request, reply) => {
    await request.session.destroy();
    return reply.clearCookie('sid').send({ ok: true });
  });

  app.get('/me', async (request, reply) => {
    if (!request.session.userId) {
      return reply.code(401).send({ message: 'Not logged in' });
    }

    const user = await prisma.user.findUnique({
      where: { id: request.session.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return reply.code(401).send({ message: 'User not found' });
    }

    return reply.send(user);
  });
}
