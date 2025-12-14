import { CustomError } from '#/utils/CustomError.js';
import type { PrismaClient, Admin } from '@prisma/client';

export async function createAdmin (
  prisma: PrismaClient,
  input: {
    id: string;
  }
): Promise<Admin> {
  const user = await prisma.user.findUnique({
    where: {
      id: input.id,
    },
    include: {
      admin: true,
      teacher: true,
      student: true
    }
  });
  if (!user) throw new CustomError('User not found', 404);
  if (user.teacher || user.student) throw new CustomError('The user already has other role', 409);
  if (user.admin) throw new CustomError('The user is already admin', 409);

  const admin = await prisma.admin.create({
    data: input,
  });

  return admin;
}
