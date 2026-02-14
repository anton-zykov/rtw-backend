import { GetTrickyExerciseParams, GetTrickyExerciseQuery, GetTrickyExerciseReply, CheckTrickyExerciseBody, CheckTrickyExerciseReply } from './exercise.schema.js';
import { checkAnswers, selectForExercise } from '#/services/trickyTask/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function trickyTaskExerciseRoutes (app: FastifyZodInstance) {
  app.get('/:userId', {
    preHandler: app.requireOwner,
    schema: {
      params: GetTrickyExerciseParams,
      querystring: GetTrickyExerciseQuery,
      response: {
        200: GetTrickyExerciseReply,
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
      body: CheckTrickyExerciseBody,
      response: {
        200: CheckTrickyExerciseReply,
        default: AppErrorSchema
      }
    }
  }, async (req, reply) => {
    const tasks = await checkAnswers(app.prisma, app.redis, req.body);
    return reply.status(200).send(tasks);
  });
}
