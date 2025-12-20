import { CreateTeacherReply } from '#/routes/teacher.js';
import type { FastifyZodInstance } from '#/server.js';
import type z from 'zod';

export async function createTeacher (
  app: FastifyZodInstance,
  adminCookie: string,
  id: string
) {
  return (await app.inject({
    method: 'POST',
    url: '/api/teacher/create',
    payload: {
      id,
    },
    headers: {
      cookie: adminCookie
    }
  })).json<z.infer<typeof CreateTeacherReply>>();
}
