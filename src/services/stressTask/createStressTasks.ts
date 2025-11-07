import { PrismaClient, type StressTask } from '@prisma/client';

export async function createStressTasks (
  prisma: PrismaClient,
  input: {
    options: {
      word: string;
      correct: boolean;
    }[];
  }[]
): Promise<StressTask[]> {
  const tasks = await prisma.stressTask.createManyAndReturn({
    data: input.map((item) => {
      return {
        options: item.options
      };
    })
  });

  return tasks;
}
