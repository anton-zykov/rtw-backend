import { z } from 'zod';
import { CreateTeacherBody, CreateTeacherReply, DeleteTeacherBody, GetMyStudentsParams, GetMyStudentsReply } from './teacher.schema.js';
import { createTeacher, deleteTeacher, getMyStudents } from '#/services/teacher/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function teacherRoutes (app: FastifyZodInstance) {
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

  app.get('/my-students/:teacherId', {
    preHandler: app.requireTeacher,
    schema: {
      params: GetMyStudentsParams,
      response: {
        200: GetMyStudentsReply,
      }
    }
  }, async (req, reply) => {
    const students = await getMyStudents(app.prisma, { teacherId: req.params.teacherId });
    return reply.status(200).send(students);
  });
}
