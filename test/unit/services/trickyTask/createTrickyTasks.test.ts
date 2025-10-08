import { createTrickyTasks } from '#/services/trickyTask/createTrickyTasks.js';
import { prisma } from '#/libs/__mocks__/prisma.js';
import { vi, beforeEach, test, expect } from 'vitest';
import { mockReset } from 'vitest-mock-extended';
import { randomUUID } from 'node:crypto';

vi.mock('#/libs/prisma.js');

beforeEach(() => {
  mockReset(prisma);
});

test('should create tricky tasks', async () => {
  const id1 = randomUUID();
  const id2 = randomUUID();
  const task1 = {
    age: 1,
    options: [
      {
        word: 'option1',
        correct: true
      },
      {
        word: 'option2',
        correct: false
      }
    ]
  };
  const task2 = {
    age: 2,
    options: [
      {
        word: 'option3',
        correct: true
      },
      {
        word: 'option4',
        correct: false
      }
    ]
  };
  prisma.trickyTask.createManyAndReturn.mockResolvedValue([
    {
      id: id1,
      ...task1
    }, {
      id: id2,
      ...task2
    }
  ]);

  const tasks = await createTrickyTasks([{ ...task1 }, { ...task2 }]);
  expect(tasks).toEqual([{
    id: id1,
    ...task1
  }, {
    id: id2,
    ...task2
  }]);
});
