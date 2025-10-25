import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { createGenitiveTasks } from '#/services/genitiveTask/createGenitiveTasks.js';
import { assignGenitiveTasksToStudent } from '#/services/genitiveTask/assignGenitiveTasksToStudent.js';
import type { FastifyZodInstance } from '#/server.js';

const CreateGenitiveTasksBody = z.array(
  z.object({
    nominative: z.string(),
    options: z.array(
      z.object({
        word: z.string(),
        correct: z.boolean(),
      })
    )
      .min(2, 'task must have at least 2 options')
      .refine((options) => options.filter((option) => option.correct).length === 1, 'task must have exactly one correct option'),
  }).strict()
);

const CreateGenitiveTasksReply = z.array(
  z.object({ id: z.uuid() })
);

const AssignToStudentBody = z.object({
  studentId: z.number(),
  genitiveTaskIds: z.array(z.string()),
}).strict();

const AssignToStudentReply = z.object({
  created: z.array(z.string()),
  skipped: z.number(),
});

export async function genitiveTaskRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    schema: {
      body: CreateGenitiveTasksBody,
      response: {
        201: CreateGenitiveTasksReply,
        400: z.object({ message: z.string() }),
      },
    },
  }, async (req, reply) => {
    const tasks = await createGenitiveTasks(app.prisma, req.body);
    reply.status(201).send(tasks);
  });

  app.post('/assign-to-student', {
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
