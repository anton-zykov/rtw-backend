import { CreateTeacherBody, CreateTeacherReply } from './create.schema.js';
import { createTeacher } from '#/services/teacher/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function teacherCreateRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    preHandler: app.requireAdmin,
    schema: {
      body: CreateTeacherBody,
      response: {
        201: CreateTeacherReply,
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    const teacher = await createTeacher(app.prisma, req.body);
    return reply.status(201).send(teacher);
  });
}
