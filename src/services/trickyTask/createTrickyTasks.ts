import { PrismaClient, type TrickyTask } from '@prisma/client';

export type CreateTrickyTasksInput = {
  age: number,
  options: {
    word: string,
    correct: boolean
  }[]
}[];

export async function createTrickyTasks (
  prisma: PrismaClient,
  input: CreateTrickyTasksInput
): Promise<TrickyTask[]> {
  const tasks = await prisma.trickyTask.createManyAndReturn({
    data: input.map((item) => {
      return {
        age: item.age,
        options: item.options
      };
    })
  });

  return tasks;
}
