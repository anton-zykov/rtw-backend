import bcrypt from 'bcrypt';
import { AppError } from '#/utils/AppError.js';
import { Prisma, type PrismaClient, type User } from '@prisma/client';

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
  let user: User;
  try {
    user = await prisma.user.create({
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

  return user;
}
