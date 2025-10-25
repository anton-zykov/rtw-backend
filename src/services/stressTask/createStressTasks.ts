import { PrismaClient, type StressTask } from '@prisma/client';

export type CreateStressTasksInput = {
  options: {
    word: string;
    correct: boolean;
  }[];
}[];

export async function createStressTasks (
  prisma: PrismaClient,
  input: CreateStressTasksInput
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
