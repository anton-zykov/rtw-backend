import { CreateUserBody, CreateUserReply } from './create.schema.js';
import { createUser } from '#/services/user/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function createUserRoutes (app: FastifyZodInstance) {
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
}
