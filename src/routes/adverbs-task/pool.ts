import { CreateAdverbsTasksBody, CreateAdverbsTasksReply, DeleteAdverbsTasksBody, DeleteAdverbsTasksReply } from './pool.schema.js';
import { createTasks, deleteTasks } from '#/services/adverbsTask/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function adverbsTaskPoolRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    preHandler: app.requireAdmin,
    schema: {
      body: CreateAdverbsTasksBody,
      response: {
        201: CreateAdverbsTasksReply,
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    const tasks = await createTasks(app.prisma, req.body);
    return reply.status(201).send(tasks.map(t => ({ id: t.id })));
  });

  app.delete('/delete', {
    preHandler: app.requireAdmin,
    schema: {
      body: DeleteAdverbsTasksBody,
      response: {
        200: DeleteAdverbsTasksReply,
        default: AppErrorSchema
      }
    }
  }, async (req, reply) => {
    await deleteTasks(app.prisma, { taskIds: req.body });
    return reply.status(200).send();
  });
}
