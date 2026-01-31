import { GetGenitiveExerciseParams, GetGenitiveExerciseQuery, GetGenitiveExerciseReply, CheckGenitiveExerciseBody, CheckGenitiveExerciseReply } from './exercise.schema.js';
import { checkAnswers, selectForExercise } from '#/services/genitiveTask/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function genitiveTaskExerciseRoutes (app: FastifyZodInstance) {
  app.get('/:userId', {
    preHandler: app.requireOwner,
    schema: {
      params: GetGenitiveExerciseParams,
      querystring: GetGenitiveExerciseQuery,
      response: {
        200: GetGenitiveExerciseReply,
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    const tasks = await selectForExercise(app.prisma, app.redis, req.params.userId, req.query.amount);
    return reply.status(200).send(tasks);
  });

  app.post('/check', {
    preHandler: app.requireOwner,
    schema: {
      body: CheckGenitiveExerciseBody,
      response: {
        200: CheckGenitiveExerciseReply,
        default: AppErrorSchema
      }
    }
  }, async (req, reply) => {
    const tasks = await checkAnswers(app.prisma, app.redis, req.body);
    return reply.status(200).send(tasks);
  });
}
