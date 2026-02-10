import { z } from 'zod';
import { DisableUserBody, DisableStudentUserBody } from './disable.schema.js';
import { disableUser } from '#/services/user/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function disableUserRoutes (app: FastifyZodInstance) {
  app.patch('/disable', {
    preHandler: app.requireAdmin,
    schema: {
      body: DisableUserBody,
      response: {
        200: z.void(),
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    await disableUser(app.prisma, req.body);
    return reply.status(200).send();
  });

  app.patch('/disable-student', {
    preHandler: app.requireOwnTeacherOrAdmin,
    schema: {
      body: DisableStudentUserBody,
      response: {
        200: z.void(),
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    await disableUser(app.prisma, { id: req.body.studentId });
    return reply.status(200).send();
  });
}
