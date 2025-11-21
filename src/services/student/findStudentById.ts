import type { PrismaClient, Student } from '@prisma/client';

export async function findStudentById (
  prisma: PrismaClient,
  input: {
    id: number;
  }
): Promise<Student | null> {
  const student = await prisma.student.findUnique({
    where: {
      id: input.id,
    }
  });

  return student;
}
