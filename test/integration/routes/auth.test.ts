import { loginAndGetCookie } from 'test/helpers/auth.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { afterAll, assert, beforeAll, describe, expect, it } from 'vitest';

describe('/auth', () => {
  const redisMock = createRedisMock();
  const app = buildTestServer(prismaClient, redisMock);
  let authCookie: string;
  beforeAll(async () => {
    await app.ready();
    authCookie = await loginAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  it('should be able to login and get session', async () => {
    const random = Math.floor(Math.random() * 1000);
    const user = await app.inject({
      method: 'POST',
      url: '/api/user/create',
      payload: {
        login: `Tester${random}`,
        password: 'test-password',
      },
      headers: {
        cookie: authCookie
      }
    });

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        login: user.json().login,
        password: 'test-password',
      }
    });

    expect(res.headers['set-cookie']).toBeDefined();
    assert.equal(res.statusCode, 200);
  });
});
