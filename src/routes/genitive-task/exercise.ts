import { z } from 'zod';
import { checkAnswers, selectForExercise } from '#/services/genitiveTask/index.js';
import type { FastifyZodInstance } from '#/server.js';

const GetGenitiveExerciseBody = z.object({
  studentId: z.number().int().positive(),
  amount: z.number().int().positive().optional(),
}).strict();

const GetGenitiveExerciseReply = z.array(
  z.object({
    taskId: z.uuid(),
    weight: z.number().int().positive(),
    nominative: z.string(),
    options: z.unknown().pipe(
      z.array(
        z.object({
          word: z.string(),
          correct: z.boolean(),
        })
      )
    ),
  })
);

const CheckGenitiveExerciseBody = z.object({
  studentId: z.number(),
  exercise: z.array(
    z.object({
      taskId: z.uuid(),
      answer: z.string(),
    })
  ),
}).strict();

const CheckGenitiveExerciseReply = z.array(
  z.object({
    taskId: z.uuid(),
    correct: z.boolean(),
  })
);

export async function genitiveTaskExerciseRoutes (app: FastifyZodInstance) {
  app.post('/get', {
    schema: {
      body: GetGenitiveExerciseBody,
      response: {
        200: GetGenitiveExerciseReply,
      },
    },
  }, async (req, reply) => {
    const tasks = await selectForExercise(app.prisma, app.redis, req.body);
    reply.status(200).send(tasks);
  });

  app.post('/check', {
    schema: {
      body: CheckGenitiveExerciseBody,
      response: {
        200: CheckGenitiveExerciseReply,
        400: z.object({ message: z.string() }),
      }
    }
  }, async (req, reply) => {
    const tasks = await checkAnswers(app.prisma, req.body);
    reply.status(200).send(tasks);
  });
}
