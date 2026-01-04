import type { FastifyZodInstance } from '#/server.js';
import { expect } from 'vitest';

export async function cleanUpUser (
  app: FastifyZodInstance,
  adminCookie: string,
  id: string
) {
  const res = await app.inject({
    method: 'DELETE',
    url: '/api/user/delete',
    payload: {
      id,
    },
    headers: {
      cookie: adminCookie
    }
  });

  expect(res.statusCode).toBe(200);
}
