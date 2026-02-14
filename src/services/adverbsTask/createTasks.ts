import { Prisma, type PrismaClient, type AdverbsTask } from '@prisma/client';
import { AppError } from '#/utils/AppError.js';

export async function createTasks (
  prisma: PrismaClient,
  input: {
    options: {
      word: string;
      correct: boolean;
    }[];
  }[]
): Promise<AdverbsTask[]> {
  try {
    return await prisma.adverbsTask.createManyAndReturn({
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
