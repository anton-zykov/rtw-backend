import { CreateTrickyTasksBody, CreateTrickyTasksReply, DeleteTrickyTasksBody, DeleteTrickyTasksReply } from './pool.schema.js';
import { createTrickyTasks, deleteTasks } from '#/services/trickyTask/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function trickyTaskPoolRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    preHandler: app.requireAdmin,
    schema: {
      body: CreateTrickyTasksBody,
      response: {
        201: CreateTrickyTasksReply,
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    const tasks = await createTrickyTasks(app.prisma, req.body);
    return reply.status(201).send(tasks.map(t => ({ id: t.id })));
  });

  app.delete('/delete', {
    preHandler: app.requireAdmin,
    schema: {
      body: DeleteTrickyTasksBody,
      response: {
        200: DeleteTrickyTasksReply,
        default: AppErrorSchema
      }
    }
  }, async (req, reply) => {
    await deleteTasks(app.prisma, { taskIds: req.body });
    return reply.status(200).send();
  });
}
