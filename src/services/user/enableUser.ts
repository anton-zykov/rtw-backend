import { Prisma, type PrismaClient } from '@prisma/client';
import { AppError } from '#/utils/AppError.js';

export async function enableUser (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<void> {
  try {
    await prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        active: true
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('USER_NOT_FOUND', 'User not found');
    }
    throw err;
  }
}
