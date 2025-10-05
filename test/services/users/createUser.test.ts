import { createUser } from '#/services/users/createUser.js';
import { prismaMock } from '#/../test/prismaMock.js';
import { test, expect } from 'vitest';

test('should create new user ', async () => {
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

  const user = await createUser({ login: 'Rich' });
  expect(user.login).toBe('Rich');
  expect(prismaMock.user.create).toHaveBeenCalledWith({ data: { login: 'Rich' } });
});
