import { z } from 'zod';
import { createGenitiveTasks } from '#/services/genitiveTask/createGenitiveTasks.js';
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

export async function genitiveTaskPoolRoutes (app: FastifyZodInstance) {
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

  app.delete('/delete', {
    schema: {
      body: {},
      response: {
        200: {}
      }
    }
  }, async (_req, _reply) => {
    // TODO
  });
}
