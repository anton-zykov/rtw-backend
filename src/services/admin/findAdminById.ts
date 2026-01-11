import { Prisma, type PrismaClient, type Admin } from '@prisma/client';
import { AppError } from '#/utils/AppError.js';

export async function findAdminById (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<Admin> {
  try {
    return await prisma.admin.findUniqueOrThrow({
      where: {
        id: input.id,
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError('USER_NOT_FOUND', 'Admin not found');
    }
    throw error;
  }
}
