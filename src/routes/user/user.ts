import { CreateUserBody, CreateUserReply, UpdateUserBody, UpdateUserReply } from './user.schema.js';
import { createUser, updateUser } from '#/services/user/index.js';
import type { FastifyZodInstance } from '#/server.js';

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
