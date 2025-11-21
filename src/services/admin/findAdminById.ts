import type { PrismaClient, Admin } from '@prisma/client';

export async function findAdminById (
  prisma: PrismaClient,
  input: {
    id: number;
  }
): Promise<Admin | null> {
  const admin = await prisma.admin.findUnique({
    where: {
      id: input.id,
    }
  });

  return admin;
}
