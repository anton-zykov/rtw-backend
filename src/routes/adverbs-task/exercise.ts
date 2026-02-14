import { GetAdverbsExerciseParams, GetAdverbsExerciseQuery, GetAdverbsExerciseReply, CheckAdverbsExerciseBody, CheckAdverbsExerciseReply } from './exercise.schema.js';
import { checkAnswers, selectForExercise } from '#/services/adverbsTask/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function adverbsTaskExerciseRoutes (app: FastifyZodInstance) {
  app.get('/:userId', {
    preHandler: app.requireOwner,
    schema: {
      params: GetAdverbsExerciseParams,
      querystring: GetAdverbsExerciseQuery,
      response: {
        200: GetAdverbsExerciseReply,
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    const tasks = await selectForExercise(app.prisma, app.redis, {
      studentId: req.params.userId,
      amount: req.query.amount
    });
    return reply.status(200).send(tasks);
  });

  app.post('/check', {
    preHandler: app.requireOwner,
    schema: {
      body: CheckAdverbsExerciseBody,
      response: {
        200: CheckAdverbsExerciseReply,
        default: AppErrorSchema
      }
    }
  }, async (req, reply) => {
    const tasks = await checkAnswers(app.prisma, app.redis, req.body);
    return reply.status(200).send(tasks);
  });
}
