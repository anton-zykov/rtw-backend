import { Prisma, type PrismaClient, type GenitiveTask } from '@prisma/client';
import { AppError } from '#/utils/AppError.js';

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
  try {
    return await prisma.genitiveTask.createManyAndReturn({
      data: input.map((item) => {
        return {
          nominative: item.nominative,
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
