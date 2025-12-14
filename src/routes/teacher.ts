import { z } from 'zod';
import { createTeacher, deleteTeacher } from '#/services/teacher/index.js';
import { CustomError } from '#/utils/CustomError.js';
import type { FastifyZodInstance } from '#/server.js';

const CreateTeacherBody = z.object({
  id: z.uuidv4(),
}).strict();

const CreateTeacherReply = z.object({
  id: z.uuidv4(),
});

const DeleteTeacherBody = z.object({
  id: z.uuidv4(),
});

export async function teacherRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    preHandler: app.requireAdmin,
    schema: {
      body: CreateTeacherBody,
      response: {
        201: CreateTeacherReply,
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
        409: z.object({ message: z.string() }),
      },
    },
  }, async (req, reply) => {
    try {
      const teacher = await createTeacher(app.prisma, req.body);
      reply.status(201).send(teacher);
    } catch (error) {
      if (error instanceof CustomError) {
        reply.status((error.status === 404 || error.status === 409) ? error.status : 400)
          .send({ message: error.message });
      } else throw error;
    }
  });

  app.delete('/delete', {
    preHandler: app.requireAdmin,
    schema: {
      body: DeleteTeacherBody,
      response: {
        200: z.void(),
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      }
    }
  }, async (req, reply) => {
    try {
      await deleteTeacher(app.prisma, req.body);
      reply.status(200).send();
    } catch (error) {
      if (error instanceof CustomError) {
        reply.status((error.status === 404) ? error.status : 400)
          .send({ message: error.message });
      } else throw error;
    }
  });
}
