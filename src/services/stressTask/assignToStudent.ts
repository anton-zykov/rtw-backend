import { PrismaClient } from '@prisma/client';

export async function assignToStudent (
  prisma: PrismaClient,
  input: {
    studentId: string;
    stressTaskIds: string[];
  }
): Promise<{
  created: string[];
  skipped: number;
}> {
  const existing = await prisma.studentStressTask.findMany({
    where: {
      studentId: input.studentId,
      taskId: {
        in: input.stressTaskIds
      },
    },
    select: {
      taskId: true
    },
  });

  const existingIds = new Set(existing.map(e => e.taskId));
  const idsToCreate = input.stressTaskIds.filter(id => !existingIds.has(id));

  const created = await prisma.studentStressTask.createManyAndReturn({
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
