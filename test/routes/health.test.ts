// test/health.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildServer } from '#/server.js';

test('GET /api/health', async () => {
  const app = buildServer();
  const res = await app.inject({ method: 'GET', url: '/api/health' });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.json(), { status: 'ok' });
  await app.close();
});
