import { CustomError } from '#/utils/CustomError.js';
import type { PrismaClient, Teacher } from '@prisma/client';

export async function createTeacher (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<Teacher> {
  const user = await prisma.user.findUnique({
    where: {
      id: input.id,
    },
    include: {
      admin: true,
      teacher: true,
      student: true
    }
  });
  if (!user) throw new CustomError('User not found', 404);
  if (user.admin || user.student) throw new CustomError('The user already has other role', 409);
  if (user.teacher) throw new CustomError('The user is already teacher', 409);

  const teacher = await prisma.teacher.create({
    data: input,
  });

  return teacher;
}
