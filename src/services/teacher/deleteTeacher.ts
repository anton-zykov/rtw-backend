import { CustomError } from '#/utils/CustomError.js';
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
  if (!user) throw new CustomError('Teacher not found', 404);

  await prisma.teacher.delete({
    where: {
      id: input.id,
    }
  });
}
