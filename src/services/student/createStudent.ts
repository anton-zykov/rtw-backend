import { CustomError } from '#/utils/CustomError.js';
import type { PrismaClient, Student } from '@prisma/client';

export async function createStudent (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<Student> {
  const user = await prisma.user.findUnique({
    where: {
      id: input.id,
    },
  });
  if (!user) throw new CustomError('User not found', 404);

  const existingStudent = await prisma.student.findUnique({
    where: {
      id: input.id,
    },
  });
  if (existingStudent) throw new CustomError('Student cannot be admin', 400);

  const student = await prisma.student.create({
    data: input,
  });

  return student;
}
