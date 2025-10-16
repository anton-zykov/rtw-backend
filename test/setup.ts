import { vi } from 'vitest';

vi.mock('#/libs/prisma.js', async () => {
  const { mockDeep } = await import('vitest-mock-extended');
  const prisma = mockDeep<import('@prisma/client').PrismaClient>();
  // avoid unhandled rejections
  prisma.$connect.mockResolvedValue();
  prisma.$disconnect.mockResolvedValue();
  return { prisma };
});
