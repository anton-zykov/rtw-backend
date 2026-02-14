import { Prisma, type PrismaClient, type StressTask } from '@prisma/client';
import { AppError } from '#/utils/AppError.js';

export async function createStressTasks (
  prisma: PrismaClient,
  input: {
    options: {
      word: string;
      correct: boolean;
    }[];
  }[]
): Promise<StressTask[]> {
  try {
    return await prisma.stressTask.createManyAndReturn({
      data: input.map((item) => {
        return {
          options: item.options
        };
      })
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AppError('CONFLICT', 'Task already exists');
    }
    throw error;
  }
}
