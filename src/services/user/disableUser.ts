import type { PrismaClient } from '@prisma/client';

export async function disableUser (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<void> {
  await prisma.user.update({
    where: {
      id: input.id,
    },
    data: {
      active: false
    },
  });
}
