import { Prisma, type PrismaClient, type User } from '@prisma/client';
import { AppError } from '#/utils/AppError.js';

export async function updateUser (
  prisma: PrismaClient,
  input: {
    id: string;
    login?: string;
    fullName?: string;
    email?: string;
    telegramId?: string;
  }
): Promise<User> {
  // TODO: add specific logic for updating telegramId and email
  try {
    return await prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        ...input,
        id: undefined
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('USER_NOT_FOUND', 'User not found');
    }
    throw err;
  }
}
