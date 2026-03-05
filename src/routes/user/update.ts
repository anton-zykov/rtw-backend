import { UpdateUserBody, UpdateUserReply, UpdateStudentUserBody, UpdateStudentUserReply } from './update.schema.js';
import { updateUser } from '#/services/user/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function updateUserRoutes (app: FastifyZodInstance) {
  app.patch('/update', {
    preHandler: app.requireAdmin,
    schema: {
      body: UpdateUserBody,
      response: {
        200: UpdateUserReply,
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    const user = await updateUser(app.prisma, req.body);
    return reply.status(200).send(user);
  });

  app.patch('/update-student', {
    preHandler: app.requireOwnTeacherOrAdmin,
    schema: {
      body: UpdateStudentUserBody,
      response: {
        200: UpdateStudentUserReply,
        default: AppErrorSchema
      },
    }
  }, async (req, reply) => {
    // TODO to refactor
    const user = await updateUser(app.prisma, { id: req.body.studentId, ...Object.fromEntries(Object.entries(req.body).filter(([key]) => key !== 'studentId')) });
    return reply.status(200).send({ ...user, studentId: req.body.studentId });
  });

  app.patch('/update-self', {
    preHandler: app.requireOwner,
    schema: {
      body: UpdateUserBody,
      response: {
        200: UpdateUserReply,
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    const user = await updateUser(app.prisma, req.body);
    return reply.status(200).send(user);
  });
}
