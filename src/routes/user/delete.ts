import { z } from 'zod';
import { DeleteUserBody } from './delete.schema.js';
import { deleteUser } from '#/services/user/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function deleteUserRoutes (app: FastifyZodInstance) {
  app.delete('/delete', {
    preHandler: app.requireAdmin,
    schema: {
      body: DeleteUserBody,
      response: {
        200: z.void(),
        default: AppErrorSchema
      }
    }
  }, async (req, reply) => {
    await deleteUser(app.prisma, req.body);
    return reply.status(200).send();
  });
}
