import { PrismaClient, type GenitiveTask } from '@prisma/client';

export async function createTasks (
  prisma: PrismaClient,
  input: {
    nominative: string;
    options: {
      word: string;
      correct: boolean;
    }[];
  }[]
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
