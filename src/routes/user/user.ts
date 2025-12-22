import { CreateUserBody, CreateUserReply, UpdateUserBody, UpdateUserReply } from './user.schema.js';
import { createUser, updateUser } from '#/services/user/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function userRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    preHandler: app.requireAdmin,
    schema: {
      body: CreateUserBody,
      response: {
        201: CreateUserReply,
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    const user = await createUser(app.prisma, req.body);
    return reply.status(201).send(user);
  });

  app.patch('/update', {
    preHandler: app.requireAdmin,
    schema: {
      body: UpdateUserBody,
      response: {
        200: UpdateUserReply,
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    const user = await updateUser(app.prisma, req.body);
    return reply.status(200).send(user);
  });

  app.patch('/update-student', {
    preHandler: app.canModifyStudent,
    schema: {
      body: UpdateUserBody,
      response: {
        200: UpdateUserReply,
        default: AppErrorSchema
      },
    }
  }, async (req, reply) => {
    const user = await updateUser(app.prisma, req.body);
    return reply.status(200).send(user);
  });

  app.patch('/update-self', {
    preHandler: app.requireOwner,
    schema: {
      body: UpdateUserBody,
      response: {
        200: UpdateUserReply,
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    const user = await updateUser(app.prisma, req.body);
    return reply.status(200).send(user);
  });
}
