import { createUser } from '#/services/users/createUser.js';
import { prisma } from '#/libs/__mocks__/prisma.js';
import { vi, beforeEach, test, expect } from 'vitest';
import { mockReset } from 'vitest-mock-extended';

vi.mock('#/libs/prisma.js');

beforeEach(() => {
  mockReset(prisma);
});

test('should create new user ', async () => {
  prisma.user.create.mockResolvedValue({
    id: 1,
    login: 'Rich',
    fullName: null,
    email: null,
    passwordHash: null,
    passwordVersion: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any);

  const user = await createUser({ login: 'Rich' });
  expect(user.login).toBe('Rich');
  expect(prisma.user.create).toHaveBeenCalledWith({ data: { login: 'Rich' } });
});
