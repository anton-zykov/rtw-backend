import { vi, beforeEach } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, type DeepMockProxy } from 'vitest-mock-extended';

const prismaMock: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

vi.mock('#/prisma.js', () => ({ prisma: prismaMock }));

beforeEach(() => mockReset(prismaMock));

export { prismaMock };
