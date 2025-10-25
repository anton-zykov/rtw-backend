import { z } from 'zod';
import { createTrickyTasks } from '#/services/trickyTask/createTrickyTasks.js';
import type { FastifyZodInstance } from '#/server.js';

const CreateTrickyTasksBody = z.array(
  z.object({
    age: z.number().int().positive(),
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

const CreateTrickyTasksReply = z.array(
  z.object({
    id: z.uuid(),
  })
);

export async function trickyTaskRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    schema: {
      body: CreateTrickyTasksBody,
      response: {
        201: CreateTrickyTasksReply,
        400: z.object({ message: z.string() }),
      },
    },
  }, async (req, reply) => {
    const tasks = await createTrickyTasks(app.prisma, req.body);
    reply.status(201).send(tasks);
  });
}
