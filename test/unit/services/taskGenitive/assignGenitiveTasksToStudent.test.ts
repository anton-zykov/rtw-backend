import { assignToStudent } from '#/services/genitiveTask/index.js';
import type { PrismaClient, StudentGenitiveTask } from '@prisma/client';

import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

describe('assign genitive tasks to student', () => {
  const prismaMock = mockDeep<PrismaClient>();

  it('should assign tasks to student and return created and skipped task ids', async () => {
    const input = {
      studentId: 1,
      genitiveTaskIds: ['task1', 'task2', 'task3'],
    };

    prismaMock.studentGenitiveTask.findMany.mockResolvedValue([
      { taskId: 'task1' },
      { taskId: 'task2' }
    ] as unknown as StudentGenitiveTask[]);

    prismaMock.studentGenitiveTask.createManyAndReturn.mockResolvedValue([
      { taskId: 'task3' }
    ] as unknown as StudentGenitiveTask[]);

    const { created, skipped } = await assignToStudent(prismaMock, input);

    expect(created).toEqual(['task3']);
    expect(skipped).toEqual(2);
  });
});
