import type { PrismaClient, User } from '@prisma/client';

export async function findUserById (
  prisma: PrismaClient,
  input: {
    id: number;
  }
): Promise<Pick<User, 'id' | 'login'> | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true,
      login: true,
    }
  });

  return user;
}
