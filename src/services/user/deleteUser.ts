import type { PrismaClient } from '@prisma/client';

export async function deleteUser (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<void> {
  await prisma.user.delete({
    where: {
      id: input.id,
    }
  });
}
