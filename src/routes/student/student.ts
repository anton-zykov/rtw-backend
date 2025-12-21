import { z } from 'zod';
import { CreateStudentBody, CreateStudentReply, DeleteStudentBody } from './student.schema.js';
import { createStudent, deleteStudent } from '#/services/student/index.js';
import { CustomError } from '#/utils/CustomError.js';
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
    preHandler: app.canModifyStudent,
    schema: {
      body: DeleteStudentBody,
      response: {
        200: z.void(),
      },
    },
  }, async (req, reply) => {
    await deleteStudent(app.prisma, req.body);
    return reply.status(200).send();
  });
}
