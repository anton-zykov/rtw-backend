import { GetStressExerciseParams, GetStressExerciseQuery, GetStressExerciseReply, CheckStressExerciseBody, CheckStressExerciseReply } from './exercise.schema.js';
import { checkAnswers, selectForExercise } from '#/services/stressTask/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function stressTaskExerciseRoutes (app: FastifyZodInstance) {
  app.get('/:userId', {
    preHandler: app.requireOwner,
    schema: {
      params: GetStressExerciseParams,
      querystring: GetStressExerciseQuery,
      response: {
        200: GetStressExerciseReply,
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
      body: CheckStressExerciseBody,
      response: {
        200: CheckStressExerciseReply,
        default: AppErrorSchema
      }
    }
  }, async (req, reply) => {
    const tasks = await checkAnswers(app.prisma, app.redis, req.body);
    return reply.status(200).send(tasks);
  });
}
