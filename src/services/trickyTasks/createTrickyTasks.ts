import { prisma } from '#/libs/prisma.js';
import type { TrickyTask } from '@prisma/client';

export type CreateTrickyTaskInput = {
  age: number,
  options: {
    word: string,
    correct: boolean
  }[]
}[];

export async function createTrickyTasks (input: CreateTrickyTaskInput): Promise<TrickyTask[]> {
  // TODO: think if validation is needed
  const tasks = await prisma.trickyTask.createManyAndReturn({
    data: input.map((item) => {
      return {
        age: item.age,
        options: {
          createMany: {
            data: item.options.map((option) => {
              return {
                word: option.word,
                correct: option.correct
              };
            })
          }
        }
      };
    })
  });

  return tasks;
}
