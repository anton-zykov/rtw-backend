import { CreateStudentReply } from '#/routes/student/student.schema.js';
import type { FastifyZodInstance } from '#/server.js';
import type z from 'zod';

export async function createStudent (
  app: FastifyZodInstance,
  adminCookie: string,
  id: string,
  teacherId: string
) {
  return (await app.inject({
    method: 'POST',
    url: '/api/student/create',
    payload: {
      id,
      teacherId,
    },
    headers: {
      cookie: adminCookie
    }
  })).json<z.infer<typeof CreateStudentReply>>();
}
