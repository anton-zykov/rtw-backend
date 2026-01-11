import { z } from 'zod';
import { CreateAdminBody, CreateAdminReply, DeleteAdminBody } from './admin.schema.js';
import { createAdmin, deleteAdmin } from '#/services/admin/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function adminRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    preHandler: app.requireAdmin,
    schema: {
      body: CreateAdminBody,
      response: {
        201: CreateAdminReply,
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    const admin = await createAdmin(app.prisma, req.body);
    return reply.status(201).send(admin);
  });

  app.delete('/delete', {
    preHandler: app.requireAdmin,
    schema: {
      body: DeleteAdminBody,
      response: {
        200: z.void(),
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    await deleteAdmin(app.prisma, req.body);
    return reply.status(200).send();
  });
}
