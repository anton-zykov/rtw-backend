import type { PrismaClient, User } from '@prisma/client';

export async function updateUser (
  prisma: PrismaClient,
  input: {
    id: string;
    login?: string;
    fullName?: string;
    email?: string;
    telegramId?: string;
  }
): Promise<User> {
  // TODO: add specific logic for updating telegramId and email
  const user = await prisma.user.update({
    where: {
      id: input.id,
    },
    data: {
      ...input,
      id: undefined
    },
  });

  return user;
}
