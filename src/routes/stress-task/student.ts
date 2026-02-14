import { AssignToStudentBody, AssignToStudentReply, UnassignFromStudentBody, UnassignFromStudentReply } from './student.schema.js';
import { assignToStudent } from '#/services/stressTask/index.js';
import { AppErrorSchema } from '#/utils/AppError.js';
import type { FastifyZodInstance } from '#/server.js';

export async function stressTaskStudentRoutes (app: FastifyZodInstance) {
  app.post('/assign', {
    preHandler: app.requireAdmin,
    schema: {
      body: AssignToStudentBody,
      response: {
        200: AssignToStudentReply,
        default: AppErrorSchema,
      },
    },
  }, async (req, reply) => {
    const { created, skipped } = await assignToStudent(app.prisma, req.body);
    return reply.status(200).send({ created, skipped });
  });

  app.delete('/unassign', {
    preHandler: app.requireAdmin,
    schema: {
      body: UnassignFromStudentBody,
      response: {
        200: UnassignFromStudentReply,
        default: AppErrorSchema,
      },
    },
  }, async (_req, _reply) => {
    // TODO /stress/student/remove
  });
}
