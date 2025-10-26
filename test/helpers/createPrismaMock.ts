import { mockDeep } from 'vitest-mock-extended';
import type { PrismaClient } from '@prisma/client';

export function createPrismaMock () {
  const prismaMock = mockDeep<PrismaClient>();
  Object.defineProperty(prismaMock, 'getter', { value: () => prismaMock });
  return prismaMock;
}
