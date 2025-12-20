import { CreateUserReply } from '#/routes/user/index.js';
import type { FastifyZodInstance } from '#/server.js';
import type z from 'zod';

export async function createUser (
  app: FastifyZodInstance,
  adminCookie: string
) {
  const random = Math.floor(Math.random() * 1000);
  return (await app.inject({
    method: 'POST',
    url: '/api/user/create',
    payload: {
      login: `Tester${random}`,
      password: 'correct-password',
    },
    headers: {
      cookie: adminCookie
    }
  })).json<z.infer<typeof CreateUserReply>>();
}
