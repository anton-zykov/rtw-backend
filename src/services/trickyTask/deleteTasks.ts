import { AppError } from '#/utils/AppError.js';
import { Prisma, PrismaClient } from '@prisma/client';

export async function deleteTasks (
  prisma: PrismaClient,
  input: {
    taskIds: string[];
  }
): Promise<void> {
  try {
    await prisma.trickyTask.deleteMany({
      where: {
        id: { in: input.taskIds }
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError('TASK_NOT_FOUND', 'Task not found');
    }
    throw error;
  }
}
