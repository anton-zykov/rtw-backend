import { Prisma } from '@prisma/client';
import { loginAndGetCookie } from 'test/helpers/auth.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { assignToStudent } from '#/services/genitiveTask/index.js';

vi.mock('#/services/genitiveTask/assignToStudent.js', () => ({
  assignToStudent: vi.fn(),
}));

describe('genitive-task/student', () => {
  const redisMock = createRedisMock();
  const app = buildTestServer(prismaClient, redisMock);
  let authCookie: string;
  beforeAll(async () => {
    await app.ready();
    authCookie = await loginAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('genitive task assign', () => {
    it('should assign tasks to student and return created and skipped task ids', async () => {
      const input = {
        studentId: 1,
        genitiveTaskIds: ['task1', 'task2', 'task3'],
      };

      vi.mocked(assignToStudent).mockResolvedValue({
        created: ['task3'],
        skipped: 2
      });

      const res = await app.inject({
        method: 'POST',
        url: '/api/genitive-task/student/assign',
        payload: input,
        headers: {
          cookie: authCookie
        }
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

      vi.mocked(assignToStudent).mockRejectedValue(
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
        url: '/api/genitive-task/student/assign',
        payload: input,
        headers: {
          cookie: authCookie
        }
      });

      expect(res.statusCode).toBe(404);
    });
  });
});
