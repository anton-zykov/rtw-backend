import { buildServerWithMocks } from 'test/helpers/buildServerWithMocks.js';
import { createPrismaMock } from 'test/helpers/createPrismaMock.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { afterAll, assert, beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('#/services/user/index.js', () => ({
  findUserByLogin: vi.fn(({ login }) => ({
    id: 1,
    login,
    passwordHash: '$2a$10$kcbWuJ6BMZ8Rigofi6YC0.DXrVJ9sagxxYZKCe5jVbd3M6EHkcwM6' // hash for 'test-password'
  })),
}));

describe('auth', () => {
  const prismaMock = createPrismaMock();
  const redisMock = createRedisMock();
  const app = buildServerWithMocks(prismaMock, redisMock);
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it('should be able to login and get session', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        login: 'tester',
        password: 'test-password',
      }
    });

    expect(res.headers['set-cookie']).toBeDefined();
    assert.equal(res.statusCode, 200);
  });
});
