import { z } from 'zod';
import { DeleteTeacherBody } from './delete.schema.js';
import { deleteTeacher } from '#/services/teacher/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function teacherDeleteRoutes (app: FastifyZodInstance) {
  app.delete('/delete', {
    preHandler: app.requireAdmin,
    schema: {
      body: DeleteTeacherBody,
      response: {
        200: z.void(),
        default: AppErrorSchema
      }
    }
  }, async (req, reply) => {
    await deleteTeacher(app.prisma, req.body);
    return reply.status(200).send();
  });
}
