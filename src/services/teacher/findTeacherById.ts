import { Prisma, type PrismaClient, type Teacher } from '@prisma/client';
import { AppError } from '#/utils/AppError.js';

export async function findTeacherById (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<Teacher> {
  try {
    return await prisma.teacher.findUniqueOrThrow({
      where: {
        id: input.id,
      }
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('USER_NOT_FOUND', 'User not found');
    }
    throw err;
  }
}
