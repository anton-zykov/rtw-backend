import { z } from 'zod';
import { CreateStudentBody, CreateStudentReply, DeleteStudentBody, GetTaskTypesParams, GetTaskTypesReply } from './student.schema.js';
import { createStudent, deleteStudent, findStudentById } from '#/services/student/index.js';
import { CustomError } from '#/utils/CustomError.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function studentRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    preHandler: app.requireAdmin,
    schema: {
      body: CreateStudentBody,
      response: {
        201: CreateStudentReply,
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
  }, async (req, reply) => {
    try {
      const student = await createStudent(app.prisma, req.body);
      reply.status(201).send(student);
    } catch (error) {
      if (error instanceof CustomError) {
        reply.status((error.status === 400 || error.status === 404) ? error.status : 400)
          .send({ message: error.message });
      } else throw error;
    }
  });

  app.delete('/delete', {
    preHandler: app.requireOwnTeacherOrAdmin,
    schema: {
      body: DeleteStudentBody,
      response: {
        200: z.void(),
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    await deleteStudent(app.prisma, req.body);
    return reply.status(200).send();
  });

  app.get('/get-task-types/:id', {
    preHandler: app.requireOwner,
    schema: {
      params: GetTaskTypesParams,
      response: {
        200: GetTaskTypesReply,
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    const student = await findStudentById(app.prisma, { id: req.params.id });
    return reply.status(200).send({ taskTypes: student.taskTypes });
  });
}
