import type { FastifyZodInstance } from '#/server.js';
import { expect } from 'vitest';

export async function cleanUpGenitiveTasks (
  app: FastifyZodInstance,
  adminCookie: string,
  ids: string[]
) {
  const res = await app.inject({
    method: 'DELETE',
    url: '/api/genitive-task/pool/delete',
    payload: ids,
    headers: {
      cookie: adminCookie
    }
  });

  expect(res.statusCode).toBe(200);
}
