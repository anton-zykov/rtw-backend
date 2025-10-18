import { z } from 'zod';
import { createUser } from '#/services/user/createUser.js';
import type { FastifyZodInstance } from '#/server.js';
import { updateUser } from '#/services/user/updateUser.js';

const CreateUserBody = z.object({
  login: z.string().min(3, 'login must be at least 3 characters long'),
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

const UpdateUserBody = z.object({
  id: z.number().int().positive(),
  login: z.string().min(3, 'new login must be at least 3 characters long').optional(),
  fullName: z.string().optional(),
  email: z.email().optional(),
  telegramId: z.string().regex(/^@/).optional(),
}).strict();

const UpdateUserReply = z.object({
  id: z.number().int().positive(),
  login: z.string().nullable(),
  fullName: z.string().nullable(),
  email: z.email().nullable(),
  telegramId: z.string().regex(/^@/).nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date(),
});

export async function userRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    schema: {
      body: CreateUserBody,
      response: {
        201: CreateUserReply,
      },
    },
  }, async (req, reply) => {
    const user = await createUser(app.prisma, req.body);
    reply.status(201).send(user);
  });

  app.patch('/update', {
    schema: {
      body: UpdateUserBody,
      response: {
        200: UpdateUserReply,
      },
    },
  }, async (req, reply) => {
    const user = await updateUser(app.prisma, req.body);
    reply.status(200).send(user);
  });
}
