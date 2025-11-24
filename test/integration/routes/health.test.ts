import { buildServerWithMocks } from 'test/helpers/buildServerWithMocks.js';
import { createPrismaMock } from 'test/helpers/createPrismaMock.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { afterAll, assert, beforeAll, describe, it } from 'vitest';

describe('health', () => {
  const prismaMock = createPrismaMock();
  const redisMock = createRedisMock();
  const app = buildServerWithMocks(prismaMock, redisMock);
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it('GET /api/health', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/health' });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.json(), { status: 'ok' });
  });
});
