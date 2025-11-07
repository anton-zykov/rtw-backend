import type { PrismaClient, User } from '@prisma/client';

export async function createUser (
  prisma: PrismaClient,
  input: {
    login: string;
    fullName?: string;
    email?: string;
    telegramId?: string;
  }
): Promise<User> {
  const user = await prisma.user.create({
    data: input,
  });

  return user;
}
