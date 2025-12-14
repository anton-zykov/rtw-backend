import type { PrismaClient, Teacher } from '@prisma/client';

export async function findTeacherById (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<Teacher | null> {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: input.id,
    }
  });

  return teacher;
}
