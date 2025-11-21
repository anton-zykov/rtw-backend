import { z } from 'zod';
import { createStressTasks } from '#/services/stressTask/index.js';
import type { FastifyZodInstance } from '#/server.js';

const CreateStressTasksBody = z.array(
  z.object({
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

const CreateStressTasksReply = z.array(
  z.object({
    id: z.uuid(),
  })
);

export async function stressTaskPoolRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    schema: {
      body: CreateStressTasksBody,
      response: {
        201: CreateStressTasksReply,
        400: z.object({ message: z.string() }),
      },
    },
  }, async (req, reply) => {
    const tasks = await createStressTasks(app.prisma, req.body);
    reply.status(201).send(tasks);
  });
}
