import { PrismaClient, type TrickyTask } from '@prisma/client';

export async function createTrickyTasks (
  prisma: PrismaClient,
  input: {
    age: number,
    options: {
      word: string,
      correct: boolean
    }[]
  }[]
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
