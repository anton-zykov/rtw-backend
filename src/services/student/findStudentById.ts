import { AppError } from '#/utils/AppError.js';
import { Prisma, type PrismaClient, type Student } from '@prisma/client';

export async function findStudentById (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<Student> {
  try {
    return await prisma.student.findUniqueOrThrow({
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
