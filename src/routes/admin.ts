import { z } from 'zod';
import { createAdmin } from '#/services/admin/index.js';
import { CustomError } from '#/utils/CustomError.js';
import type { FastifyZodInstance } from '#/server.js';

const CreateAdminBody = z.object({
  id: z.uuidv4(),
}).strict();

const CreateAdminReply = z.object({
  id: z.uuidv4(),
});

export async function adminRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    preHandler: app.requireAdmin,
    schema: {
      body: CreateAdminBody,
      response: {
        201: CreateAdminReply,
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
        409: z.object({ message: z.string() }),
      },
    },
  }, async (req, reply) => {
    try {
      const admin = await createAdmin(app.prisma, req.body);
      reply.status(201).send(admin);
    } catch (error) {
      if (error instanceof CustomError) {
        reply.status((error.status === 404 || error.status === 409) ? error.status : 400)
          .send({ message: error.message });
      } else throw error;
    }
  });
}
