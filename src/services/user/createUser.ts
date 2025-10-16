import type { PrismaClient, User } from '@prisma/client';

export type CreateUserInput = {
  login: string;
  fullName?: string;
  email?: string;
  telegramId?: string;
};

export async function createUser (prisma: PrismaClient, input: CreateUserInput): Promise<User> {
  const user = await prisma.user.create({
    data: input,
  });

  return user;
}
