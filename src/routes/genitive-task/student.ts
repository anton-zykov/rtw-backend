import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { assignGenitiveTasksToStudent } from '#/services/genitiveTask/assignGenitiveTasksToStudent.js';
import type { FastifyZodInstance } from '#/server.js';

const AssignToStudentBody = z.object({
  studentId: z.number(),
  genitiveTaskIds: z.array(z.string()),
}).strict();

const AssignToStudentReply = z.object({
  created: z.array(z.string()),
  skipped: z.number(),
});

export async function genitiveTaskStudentRoutes (app: FastifyZodInstance) {
  app.post('/assign', {
    schema: {
      body: AssignToStudentBody,
      response: {
        200: AssignToStudentReply,
        404: z.object({ message: z.string() }),
        500: z.null(),
      },
    },
  }, async (req, reply) => {
    try {
      const { created, skipped } = await assignGenitiveTasksToStudent(app.prisma, req.body);
      reply.status(200).send({ created, skipped });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          reply.status(404).send({
            message: 'Student or tasks not found'
          });
        }
      }

      reply.status(500);
    }
  });
}
