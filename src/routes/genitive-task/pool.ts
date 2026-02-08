import { CreateGenitiveTasksBody, CreateGenitiveTasksReply, DeleteGenitiveTasksBody, DeleteGenitiveTasksReply } from './pool.schema.js';
import { createTasks, deleteTasks } from '#/services/genitiveTask/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function genitiveTaskPoolRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    preHandler: app.requireAdmin,
    schema: {
      body: CreateGenitiveTasksBody,
      response: {
        201: CreateGenitiveTasksReply,
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
      body: DeleteGenitiveTasksBody,
      response: {
        200: DeleteGenitiveTasksReply,
        default: AppErrorSchema
      }
    }
  }, async (req, reply) => {
    await deleteTasks(app.prisma, { taskIds: req.body });
    return reply.status(200).send();
  });
}
