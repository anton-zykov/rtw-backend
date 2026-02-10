import { z } from 'zod';
import { EnableUserBody, EnableStudentUserBody } from './enable.schema.js';
import { enableUser } from '#/services/user/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function enableUserRoutes (app: FastifyZodInstance) {
  app.patch('/enable', {
    preHandler: app.requireAdmin,
    schema: {
      body: EnableUserBody,
      response: {
        200: z.void(),
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    await enableUser(app.prisma, req.body);
    return reply.status(200).send();
  });

  app.patch('/enable-student', {
    preHandler: app.requireOwnTeacherOrAdmin,
    schema: {
      body: EnableStudentUserBody,
      response: {
        200: z.void(),
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    await enableUser(app.prisma, { id: req.body.studentId });
    return reply.status(200).send();
  });
}
