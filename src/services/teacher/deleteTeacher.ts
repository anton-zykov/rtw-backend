import { AppError } from '#/utils/AppError.js';
import type { PrismaClient } from '@prisma/client';

export async function deleteTeacher (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<void> {
  const user = await prisma.teacher.findUnique({
    where: {
      id: input.id,
    }
  });
  if (!user) throw new AppError('USER_NOT_FOUND', 'Teacher not found');

  await prisma.teacher.delete({
    where: {
      id: input.id,
    }
  });
}
