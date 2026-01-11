import { Prisma, type PrismaClient, type Teacher } from '@prisma/client';
import { AppError } from '#/utils/AppError.js';

export async function createTeacher (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<Teacher> {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: input.id,
      },
      select: {
        role: true
      }
    });
    if (user.role === 'admin' || user.role === 'student') throw new AppError('CONFLICT', 'The user already has other role');
    if (user.role === 'teacher') throw new AppError('CONFLICT', 'The user is already teacher');

    const [teacher] = await prisma.$transaction([
      prisma.teacher.create({
        data: input,
      }),
      prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          role: 'teacher',
        }
      })
    ]);

    return teacher;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('USER_NOT_FOUND', 'User not found');
    }
    throw err;
  }
}
