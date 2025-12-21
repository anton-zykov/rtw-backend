import { AppError } from '#/utils/AppError.js';
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
  if (!user) throw new AppError('USER_NOT_FOUND', 'User not found');
  if (user.admin || user.student) throw new AppError('CONFLICT', 'The user already has other role');
  if (user.teacher) throw new AppError('CONFLICT', 'The user is already teacher');

  const teacher = await prisma.teacher.create({
    data: input,
  });

  return teacher;
}
