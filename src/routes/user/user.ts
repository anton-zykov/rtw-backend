import { z } from 'zod';
import {
  CreateUserBody,
  CreateUserReply,
  UpdateUserBody,
  UpdateUserReply,
  UpdateStudentUserBody,
  UpdateStudentUserReply,
  DisableUserBody,
  DisableStudentUserBody,
  EnableUserBody,
  EnableStudentUserBody
} from './user.schema.js';
import { createUser, disableUser, enableUser, updateUser } from '#/services/user/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function userRoutes (app: FastifyZodInstance) {
  app.post('/create', {
    preHandler: app.requireAdmin,
    schema: {
      body: CreateUserBody,
      response: {
        201: CreateUserReply,
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    const user = await createUser(app.prisma, req.body);
    return reply.status(201).send(user);
  });

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
    const user = await updateUser(app.prisma, { ...req.body, id: req.body.studentId });
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

  app.patch('/disable', {
    preHandler: app.requireAdmin,
    schema: {
      body: DisableUserBody,
      response: {
        200: z.void(),
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    await disableUser(app.prisma, req.body);
    return reply.status(200).send();
  });

  app.patch('/disable-student', {
    preHandler: app.requireOwnTeacherOrAdmin,
    schema: {
      body: DisableStudentUserBody,
      response: {
        200: z.void(),
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    await disableUser(app.prisma, { id: req.body.studentId });
    return reply.status(200).send();
  });

  app.patch('/enable', {
    preHandler: app.requireAdmin,
    schema: {
      body: EnableUserBody,
      response: {
        200: z.void(),
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    await enableUser(app.prisma, req.body);
    return reply.status(200).send();
  });

  app.patch('/enable-student', {
    preHandler: app.requireOwnTeacherOrAdmin,
    schema: {
      body: EnableStudentUserBody,
      response: {
        200: z.void(),
        default: AppErrorSchema
      },
    },
  }, async (req, reply) => {
    await enableUser(app.prisma, { id: req.body.studentId });
    return reply.status(200).send();
  });
}
