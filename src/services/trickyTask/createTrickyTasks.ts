import { Prisma, type PrismaClient, type TrickyTask } from '@prisma/client';
import { AppError } from '#/utils/AppError.js';

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
  try {
    return await prisma.trickyTask.createManyAndReturn({
      data: input.map((item) => {
        return {
          age: item.age,
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
