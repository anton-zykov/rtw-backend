import bcrypt from 'bcrypt';
import { Prisma, type PrismaClient, type User } from '@prisma/client';
import { AppError } from '#/utils/AppError.js';

export async function createUser (
  prisma: PrismaClient,
  input: {
    login: string;
    password: string;
    fullName?: string;
    email?: string;
    telegramId?: string;
  }
): Promise<User> {
  const passwordHash = await bcrypt.hash(input.password, 10);
  try {
    return await prisma.user.create({
      data: {
        login: input.login,
        passwordHash,
        passwordVersion: 1,
        fullName: input.fullName,
        email: input.email,
        telegramId: input.telegramId
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError('CONFLICT', 'User already exists');
    }
    throw err;
  }
}
