import { Prisma, type PrismaClient, type TrickyTask } from '@prisma/client';
import { AppError } from '#/utils/AppError.js';

export async function createTrickyTasks (
  prisma: PrismaClient,
  input: {
    age: number,
    correctWord: string,
    incorrectWord: string
  }[]
): Promise<TrickyTask[]> {
  try {
    return await prisma.trickyTask.createManyAndReturn({
      data: input.map((item) => ({
        age: item.age,
        correctWord: item.correctWord,
        incorrectWord: item.incorrectWord
      }))
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AppError('CONFLICT', 'Task already exists');
    }
    throw error;
  }
}
