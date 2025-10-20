import type { PrismaClient, Admin } from '@prisma/client';

export type CreateAdminInput = {
  id: number;
};

export async function createAdmin (prisma: PrismaClient, input: CreateAdminInput): Promise<Admin> {
  const user = await prisma.user.findUnique({
    where: {
      id: input.id,
    },
  });
  if (!user) throw new Error('User not found');

  const existingStudent = await prisma.student.findUnique({
    where: {
      id: input.id,
    },
  });
  if (existingStudent) throw new Error('User is already a student');

  const admin = await prisma.admin.create({
    data: input,
  });

  return admin;
}
