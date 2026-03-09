import { AppError } from '#/utils/AppError.js';
import { Prisma, type PrismaClient } from '@prisma/client';

export async function increaseAgeAndAssignTricky (
  prisma: PrismaClient,
  input: {
    studentId: string;
    age: number;
  }
): Promise<void> {
  try {
    const student = await prisma.student.findUniqueOrThrow({
      where: {
        id: input.studentId,
      }
    });

    const trickyTasks = await prisma.trickyTask.findMany({
      where: {
        age: {
          gt: student.age,
          lte: input.age
        }
      }
    });

    await prisma.$transaction([
      prisma.student.update({
        where: {
          id: input.studentId
        },
        data: {
          age: input.age
        }
      }),
      prisma.studentTrickyTask.createMany({
        data: trickyTasks.map(task => ({
          studentId: input.studentId,
          taskId: task.id
        }))
      })
    ]);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('USER_NOT_FOUND', 'User not found');
    }
    throw err;
  }
}
