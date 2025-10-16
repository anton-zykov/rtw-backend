import { createUser } from '#/services/user/createUser.js';
import type { PrismaClient } from '@prisma/client';

import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

describe('createUser', () => {
  const prismaMock = mockDeep<PrismaClient>();

  it('should create new user ', async () => {
    prismaMock.user.create.mockResolvedValue({
      id: 1,
      login: 'Rich',
      fullName: null,
      email: null,
      passwordHash: null,
      passwordVersion: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const user = await createUser(prismaMock, { login: 'Rich' });
    expect(user.login).toBe('Rich');
    expect(prismaMock.user.create).toHaveBeenCalledWith({ data: { login: 'Rich' } });
  });
});
