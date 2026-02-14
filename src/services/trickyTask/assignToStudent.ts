import { PrismaClient } from '@prisma/client';

export async function assignToStudent (
  prisma: PrismaClient,
  input: {
    studentId: string;
    trickyTaskIds: string[];
  }
): Promise<{
  created: string[];
  skipped: number;
}> {
  const existing = await prisma.studentTrickyTask.findMany({
    where: {
      studentId: input.studentId,
      taskId: {
        in: input.trickyTaskIds
      },
    },
    select: {
      taskId: true
    },
  });

  const existingIds = new Set(existing.map(e => e.taskId));
  const idsToCreate = input.trickyTaskIds.filter(id => !existingIds.has(id));

  const created = await prisma.studentTrickyTask.createManyAndReturn({
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
