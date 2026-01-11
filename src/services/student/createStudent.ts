import { Prisma, type PrismaClient, type Student } from '@prisma/client';
import { AppError } from '#/utils/AppError.js';

export async function createStudent (
  prisma: PrismaClient,
  input: {
    id: string;
    teacherId: string;
  }
): Promise<Student> {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: input.id,
      },
      select: {
        role: true
      }
    });
    if (user.role === 'admin' || user.role === 'teacher') throw new AppError('CONFLICT', 'The user already has other role');
    if (user.role === 'student') throw new AppError('CONFLICT', 'The user is already student');

    const [student] = await prisma.$transaction([
      prisma.student.create({
        data: input,
      }),
      prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          role: 'student',
        }
      })
    ]);

    return student;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('USER_NOT_FOUND', 'User not found');
    }
    throw err;
  }
}
