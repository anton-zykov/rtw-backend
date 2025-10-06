import { prisma } from '#/libs/prisma.js';
import type { User } from '@prisma/client';

export type CreateUserInput = {
  login: string;
};

export async function createUser (input: CreateUserInput): Promise<User> {
  const user = await prisma.user.create({
    data: {
      login: input.login,
    },
  });

  return user;
}
