import { z } from 'zod';
import { selectGenitiveTasksForExercise } from '#/services/genitiveTask/selectGenitiveTasksForExercise.js';
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

export async function genitiveTaskExerciseRoutes (app: FastifyZodInstance) {
  app.post('/get', {
    schema: {
      body: GetGenitiveExerciseBody,
      response: {
        200: GetGenitiveExerciseReply,
      },
    },
  }, async (req, reply) => {
    const tasks = await selectGenitiveTasksForExercise(app.prisma, req.body);
    reply.status(200).send(tasks);
  });
}
