import { CreateStressTasksBody, CreateStressTasksReply, DeleteStressTasksBody, DeleteStressTasksReply } from './pool.schema.js';
import { createStressTasks, deleteTasks } from '#/services/stressTask/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function stressTaskPoolRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    preHandler: app.requireAdmin,
    schema: {
      body: CreateStressTasksBody,
      response: {
        201: CreateStressTasksReply,
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    const tasks = await createStressTasks(app.prisma, req.body);
    return reply.status(201).send(tasks.map(t => ({ id: t.id })));
  });

  app.delete('/delete', {
    preHandler: app.requireAdmin,
    schema: {
      body: DeleteStressTasksBody,
      response: {
        200: DeleteStressTasksReply,
        default: AppErrorSchema
      }
    }
  }, async (req, reply) => {
    await deleteTasks(app.prisma, { taskIds: req.body });
    return reply.status(200).send();
  });
}
