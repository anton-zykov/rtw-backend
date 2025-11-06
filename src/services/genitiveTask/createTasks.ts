import { PrismaClient, type GenitiveTask } from '@prisma/client';

export type CreateGenitiveTasksInput = {
  nominative: string;
  options: {
    word: string;
    correct: boolean;
  }[];
}[];

export async function createTasks (
  prisma: PrismaClient,
  input: CreateGenitiveTasksInput
): Promise<GenitiveTask[]> {
  const tasks = await prisma.genitiveTask.createManyAndReturn({
    data: input.map((item) => {
      return {
        nominative: item.nominative,
        options: item.options
      };
    })
  });

  return tasks;
}
