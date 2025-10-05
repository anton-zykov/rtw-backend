import { createUser } from '#/services/users/createUser.js';
import { prismaMock } from '#/../test/prismaMock.js';

test('should create new user ', async () => {
  const user = {
    login: 'Rich',
    // passwordHash: 'placeholder',
    // passwordVersion: 0,
    // createdAt: new Date(),
    // updatedAt: new Date(),
    // id: 1,
    // fullName: null,
    // email: null,
    // telegramId: null
  };

  prismaMock.user.create.mockResolvedValue(user);

  await expect(createUser(user)).resolves.toEqual({
    login: 'Rich',
  });
});
