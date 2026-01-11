import { Prisma, type PrismaClient, type Admin } from '@prisma/client';
import { AppError } from '#/utils/AppError.js';

export async function createAdmin (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<Admin> {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: input.id,
      },
      select: {
        role: true
      }
    });
    if (user.role === 'teacher' || user.role === 'student') throw new AppError('CONFLICT', 'The user already has other role');
    if (user.role === 'admin') throw new AppError('CONFLICT', 'The user is already admin');

    const [admin] = await prisma.$transaction([
      prisma.admin.create({
        data: input,
      }),
      prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          role: 'admin',
        }
      })
    ]);

    return admin;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('USER_NOT_FOUND', 'User not found');
    }
    throw err;
  }
}
