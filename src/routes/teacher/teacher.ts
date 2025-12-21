import { z } from 'zod';
import { CreateTeacherBody, CreateTeacherReply, DeleteTeacherBody } from './teacher.schema.js';
import { createTeacher, deleteTeacher } from '#/services/teacher/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function teacherRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    preHandler: app.requireAdmin,
    schema: {
      body: CreateTeacherBody,
      response: {
        201: CreateTeacherReply,
        400: AppErrorSchema,
        404: AppErrorSchema,
        409: AppErrorSchema,
      },
    },
  }, async (req, reply) => {
    const teacher = await createTeacher(app.prisma, req.body);
    return reply.status(201).send(teacher);
  });

  app.delete('/delete', {
    preHandler: app.requireAdmin,
    schema: {
      body: DeleteTeacherBody,
      response: {
        200: z.void(),
        400: AppErrorSchema,
        404: AppErrorSchema,
      }
    }
  }, async (req, reply) => {
    await deleteTeacher(app.prisma, req.body);
    return reply.status(200).send();
  });
}
