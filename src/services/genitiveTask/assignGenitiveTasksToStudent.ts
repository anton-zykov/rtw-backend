import { PrismaClient } from '@prisma/client';

export type AssignGenitiveTasksToStudentInput = {
  studentId: number;
  genitiveTaskIds: string[];
};

export async function assignGenitiveTasksToStudent (
  prisma: PrismaClient,
  input: AssignGenitiveTasksToStudentInput
): Promise<{ created: string[]; skipped: number }> {
  const existing = await prisma.studentGenitiveTask.findMany({
    where: {
      studentId: input.studentId,
      taskId: {
        in: input.genitiveTaskIds
      },
    },
    select: {
      taskId: true
    },
  });

  const existingIds = new Set(existing.map(e => e.taskId));
  const idsToCreate = input.genitiveTaskIds.filter(id => !existingIds.has(id));

  const created = await prisma.studentGenitiveTask.createManyAndReturn({
    data: idsToCreate.map(taskId => ({
      studentId: input.studentId,
      taskId
    })),
    select: {
      taskId: true
    },
  });

  return {
    created: created.map(r => r.taskId),
    skipped: existingIds.size
  };
}
