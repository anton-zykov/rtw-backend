import type { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, type DeepMockProxy } from 'jest-mock-extended';

const prismaMock: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

jest.mock('#/prisma.js', () => ({ prisma: prismaMock }));

beforeEach(() => mockReset(prismaMock));

export { prismaMock };
