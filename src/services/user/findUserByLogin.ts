import { Prisma, type PrismaClient, type User } from '@prisma/client';
import { AppError } from '#/utils/AppError.js';

export async function findUserByLogin (
  prisma: PrismaClient,
  input: {
    login: string;
  }
): Promise<User> {
  try {
    return await prisma.user.findUniqueOrThrow({
      where: {
        login: input.login,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('USER_NOT_FOUND', 'User not found');
    }
    throw err;
  }
}
