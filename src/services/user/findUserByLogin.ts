import type { PrismaClient, User } from '@prisma/client';

export async function findUserByLogin (
  prisma: PrismaClient,
  input: {
    login: string;
  }
): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      login: input.login,
    },
  });

  return user;
}
