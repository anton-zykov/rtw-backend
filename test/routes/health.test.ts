import { buildServer } from '#/server.js';
import { telegramPlugin } from '#/plugins/__mocks__/telegram.js';
import { prismaPlugin } from '#/plugins/__mocks__/prisma.js';
import { assert, test } from 'vitest';

// TODO: prisma mock reset??

test('GET /api/health', async () => {
  const app = buildServer({
    prismaPlugin,
    telegramPlugin,
    config: {
      logger: false,
      telegram: {
        token: undefined
      }
    }
  });
  const res = await app.inject({ method: 'GET', url: '/api/health' });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.json(), { status: 'ok' });
  await app.close();
});
