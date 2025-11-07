import { CustomError } from '#/utils/CustomError.js';
import type { PrismaClient, Admin } from '@prisma/client';

export async function createAdmin (
  prisma: PrismaClient,
  input: {
    id: number;
  }
): Promise<Admin> {
  const user = await prisma.user.findUnique({
    where: {
      id: input.id,
    },
  });
  if (!user) throw new CustomError('User not found', 404);

  const existingStudent = await prisma.student.findUnique({
    where: {
      id: input.id,
    },
  });
  if (existingStudent) throw new CustomError('Student cannot be admin', 400);

  const admin = await prisma.admin.create({
    data: input,
  });

  return admin;
}
