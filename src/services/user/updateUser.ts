import type { PrismaClient, User } from '@prisma/client';

export type UpdateUserInput = {
  id: number;
  login?: string;
  fullName?: string;
  email?: string;
  telegramId?: string;
};

export async function updateUser (prisma: PrismaClient, input: UpdateUserInput): Promise<User> {
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
