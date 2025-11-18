import bcrypt from 'bcrypt';
import type { PrismaClient, User } from '@prisma/client';

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
  const user = await prisma.user.create({
    data: {
      login: input.login,
      passwordHash,
      passwordVersion: 1,
      fullName: input.fullName,
      email: input.email,
      telegramId: input.telegramId
    },
  });

  return user;
}
