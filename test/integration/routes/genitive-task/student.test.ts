import { Prisma } from '@prisma/client';
import { buildServerWithMocks } from 'test/helpers/buildServerWithMocks.js';
import { createPrismaMock } from 'test/helpers/createPrismaMock.js';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { assignGenitiveTasksToStudent } from '#/services/genitiveTask/assignToStudent.js';

vi.mock('#/services/genitiveTask/assignGenitiveTasksToStudent.js', () => ({
  assignGenitiveTasksToStudent: vi.fn(),
}));

describe('genitive-task/student', () => {
  const prismaMock = createPrismaMock();
  const app = buildServerWithMocks(prismaMock);
  beforeAll(async () => await app.ready());
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
        url: '/api/genitive-task/student/assign',
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
        url: '/api/genitive-task/student/assign',
        payload: input,
      });

      expect(res.statusCode).toBe(404);
    });
  });
});
