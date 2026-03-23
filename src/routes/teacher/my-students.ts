import { GetMyStudentsParams, GetMyStudentsReply } from './my-students.schema.js';
import { getMyStudents } from '#/services/teacher/index.js';
import type { FastifyZodInstance } from '#/server.js';

export async function teacherMyStudentsRoutes (app: FastifyZodInstance) {
  app.get('/my-students/:teacherId', {
    preHandler: app.requireTeacher,
    schema: {
      params: GetMyStudentsParams,
      response: {
        200: GetMyStudentsReply,
      }
    }
  }, async (req, reply) => {
    const students = await getMyStudents(app.prisma, { teacherId: req.params.teacherId });
    return reply.status(200).send(students);
  });
}
