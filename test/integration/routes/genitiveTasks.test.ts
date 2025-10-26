import { buildServer, type FastifyZodInstance } from '#/server.js';
import { prismaPlugin } from '#/plugins/prisma.js';
import { telegramPlugin } from '#/plugins/__mocks__/telegram.js';
import { Prisma, type PrismaClient } from '@prisma/client';

import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { assignGenitiveTasksToStudent } from '#/services/genitiveTask/assignGenitiveTasksToStudent.js';

vi.mock('#/services/genitiveTask/assignGenitiveTasksToStudent.js', () => ({
  assignGenitiveTasksToStudent: vi.fn(),
}));

describe('genitive task routes', () => {
  let app: FastifyZodInstance;
  const prismaMock = mockDeep<PrismaClient>();
  Object.defineProperty(prismaMock, 'getter', { value: () => prismaMock });

  beforeAll(async () => {
    app = buildServer({
      prismaPlugin,
      telegramPlugin,
      config: {
        logger: false,
        telegram: {
          token: undefined
        },
        prisma: {
          prismaClient: prismaMock
        }
      }
    });
    await app.ready();
  });

  afterAll(async () => await app.close());

  describe('genitive task assign', () => {
    afterEach(() => prismaMock.genitiveTask.create.mockReset());

    it('should assign tasks to student and return created and skipped task ids', async () => {
      const input = {
        studentId: 1,
        genitiveTaskIds: ['task1', 'task2', 'task3'],
      };

      vi.mocked(assignGenitiveTasksToStudent).mockResolvedValue({
        created: ['task3'],
        skipped: 2
      });

      const res = await app.inject({
        method: 'POST',
        url: '/api/genitive/student/assign',
        payload: input,
      });

      expect(res.statusCode).toBe(200);
      expect(res.json()).toStrictEqual({
        created: ['task3'],
        skipped: 2,
      });
    });

    it('should reply 404 if student or tasts not found', async () => {
      const input = {
        studentId: 1,
        genitiveTaskIds: ['task1', 'task2', 'task3'],
      };

      vi.mocked(assignGenitiveTasksToStudent).mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError(
          '',
          {
            code: 'P2025',
            clientVersion: ''
          }
        )
      );

      const res = await app.inject({
        method: 'POST',
        url: '/api/genitive/student/assign',
        payload: input,
      });

      expect(res.statusCode).toBe(404);
    });
  });
});
