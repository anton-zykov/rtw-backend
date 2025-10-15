import { z } from 'zod';
import { createUser } from '#/services/user/createUser.js';
import type { FastifyZodInstance } from '#/server.js';

const CreateUserBody = z.object({
  login: z.string().min(3, 'login is required'),
  fullName: z.string().optional(),
  email: z.email().optional(),
  telegramId: z.string().regex(/^@/).optional(),
}).strict();

const CreateUserReply = z.object({
  id: z.number().int().positive(),
  login: z.string(),
  fullName: z.string().nullable(),
  email: z.email().nullable(),
  telegramId: z.string().regex(/^@/).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export async function userRoutes (app: FastifyZodInstance) {
  app.post('/user', {
    schema: {
      body: CreateUserBody,
      response: {
        201: CreateUserReply,
      },
    },
  }, async (req, reply) => {
    const user = await createUser(req.body);
    reply.status(201).send(user);
  });
}
