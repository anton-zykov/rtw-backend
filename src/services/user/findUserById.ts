import type { PrismaClient, User } from '@prisma/client';
import type { Role } from '#/utils/types.js';

export async function findUserById (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<Pick<User, 'id' | 'login'> & { role: Role } | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true,
      login: true,
      role: true,
    }
  });

  if (!user) return null;

  return {
    id: user.id,
    login: user.login,
    role: user.role satisfies Role,
  };
}
