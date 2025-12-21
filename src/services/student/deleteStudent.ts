import { CustomError } from '#/utils/CustomError.js';
import type { PrismaClient } from '@prisma/client';

export async function deleteStudent (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<void> {
  const user = await prisma.student.findUnique({
    where: {
      id: input.id,
    }
  });
  if (!user) throw new CustomError('Student not found', 404);

  await prisma.student.delete({
    where: {
      id: input.id,
    }
  });
}
