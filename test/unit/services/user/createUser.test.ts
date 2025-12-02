import { createUser } from '#/services/user/createUser.js';
import { PrismaClient } from '@prisma/client';

import { describe, expect, it } from 'vitest';

describe('createUser', () => {
  const prisma = new PrismaClient();

  it('should create new user ', async () => {
    const user = await createUser(prisma, {
      login: 'Rich',
      password: 'password'
    });
    expect(user.login).toBe('Rich');
  });
});
