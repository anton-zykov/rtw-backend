import { prisma } from '#/prisma.js';

export interface CreateUserInput {
  login: string;
}

export async function createUser (input: CreateUserInput) {
  const user = await prisma.user.create({
    data: {
      login: input.login,
    },
  });

  return user;
}
