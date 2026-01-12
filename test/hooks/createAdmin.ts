import { CreateAdminReply } from '#/routes/admin/index.js';
import type { FastifyZodInstance } from '#/server.js';
import type z from 'zod';

export async function createAdmin (
  app: FastifyZodInstance,
  adminCookie: string,
  id: string
) {
  return (await app.inject({
    method: 'POST',
    url: '/api/admin/create',
    payload: {
      id,
    },
    headers: {
      cookie: adminCookie
    }
  })).json<z.infer<typeof CreateAdminReply>>();
}
