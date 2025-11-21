import { z } from 'zod';
import { createStudent } from '#/services/student/index.js';
import { CustomError } from '#/utils/CustomError.js';
import type { FastifyZodInstance } from '#/server.js';

const CreateStudentBody = z.object({
  id: z.number().int().positive(),
}).strict();

const CreateStudentReply = z.object({
  id: z.number().int().positive(),
});

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
}
