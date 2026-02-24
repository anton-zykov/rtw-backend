import { AppError } from '#/utils/AppError.js';
import { Prisma, TaskType, type PrismaClient } from '@prisma/client';

export async function updateTaskTypes (
  prisma: PrismaClient,
  input: {
    studentId: string;
    action: 'add' | 'remove';
    taskType: TaskType;
  }
): Promise<void> {
  try {
    const student = await prisma.student.findUniqueOrThrow({
      where: {
        id: input.studentId,
      }
    });

    let existingTaskTypes = student.taskTypes;
    if (input.action === 'add') {
      if (existingTaskTypes.includes(input.taskType)) return;
      existingTaskTypes.push(input.taskType);
    } else {
      if (!existingTaskTypes.includes(input.taskType)) return;
      existingTaskTypes = existingTaskTypes.filter(t => t !== input.taskType);
    }

    await prisma.student.update({
      where: {
        id: input.studentId
      },
      data: {
        taskTypes: existingTaskTypes
      }
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('USER_NOT_FOUND', 'User not found');
    }
    throw err;
  }
}
