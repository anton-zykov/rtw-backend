import { AppError } from '#/utils/AppError.js';
import { Prisma, TaskType, type PrismaClient } from '@prisma/client';
import { assignToStudent as assignAdverbsTaskToStudent } from '#/services/adverbsTask/assignToStudent.js';
import { assignToStudent as assignGenitiveTaskToStudent } from '#/services/genitiveTask/assignToStudent.js';
import { assignToStudent as assignStressTaskToStudent } from '#/services/stressTask/assignToStudent.js';

export async function updateTaskTypes (
  prisma: PrismaClient,
  input: {
    studentId: string;
    taskTypes: TaskType[];
  }
): Promise<void> {
  try {
    const student = await prisma.student.findUniqueOrThrow({
      where: {
        id: input.studentId,
      }
    });

    const existingTaskTypes = student.taskTypes;
    const newTaskTypes = input.taskTypes;

    await prisma.student.update({
      where: {
        id: input.studentId
      },
      data: {
        taskTypes: newTaskTypes
      }
    });

    const toAdd = newTaskTypes.filter(t => !existingTaskTypes.includes(t));
    // const toRemove = existingTaskTypes.filter(t => !newTaskTypes.includes(t));

    if (toAdd.includes(TaskType.adverbs)) await assignAdverbsTaskToStudent(prisma, { studentId: input.studentId, adverbsTaskIds: [] });
    if (toAdd.includes(TaskType.genitive)) await assignGenitiveTaskToStudent(prisma, { studentId: input.studentId, genitiveTaskIds: [] });
    if (toAdd.includes(TaskType.stress)) await assignStressTaskToStudent(prisma, { studentId: input.studentId, stressTaskIds: [] });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('USER_NOT_FOUND', 'User not found');
    }
    throw err;
  }
}
