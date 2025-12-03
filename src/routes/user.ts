import { z } from 'zod';
import { createUser, updateUser } from '#/services/user/index.js';
import type { FastifyZodInstance } from '#/server.js';

const CreateUserBody = z.object({
  login: z.string().min(3, 'login must be at least 3 characters long'),
  password: z.string().min(8, 'password must be at least 8 characters long'),
  fullName: z.string().optional(),
  email: z.email().optional(),
  telegramId: z.string().regex(/^@/).optional(),
}).strict();

const CreateUserReply = z.object({
  id: z.uuidv4(),
  login: z.string(),
  fullName: z.string().nullable(),
  email: z.email().nullable(),
  telegramId: z.string().regex(/^@/).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const UpdateUserBody = z.object({
  id: z.uuidv4(),
  login: z.string().min(3, 'new login must be at least 3 characters long').optional(),
  fullName: z.string().optional(),
  email: z.email().optional(),
  telegramId: z.string().regex(/^@/).optional(),
}).strict();

const UpdateUserReply = z.object({
  id: z.uuidv4(),
  login: z.string().nullable(),
  fullName: z.string().nullable(),
  email: z.email().nullable(),
  telegramId: z.string().regex(/^@/).nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date(),
});

export async function userRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    preHandler: app.requireAdmin,
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
    preHandler: app.requireAdmin, // TODO: allow student to update his own data
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
