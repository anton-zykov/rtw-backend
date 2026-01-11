import { Prisma, type PrismaClient, type User } from '@prisma/client';
import { AppError } from '#/utils/AppError.js';
import type { Role } from '#/utils/types.js';

export async function findUserById (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<Pick<User, 'id' | 'login'> & { role: Role }> {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: input.id,
      },
      select: {
        id: true,
        login: true,
        role: true,
      }
    });

    return {
      id: user.id,
      login: user.login,
      role: user.role satisfies Role,
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('USER_NOT_FOUND', 'User not found');
    }
    throw err;
  }
}
