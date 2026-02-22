import { PrismaClient } from '@prisma/client';

export async function assignToStudent (
  prisma: PrismaClient,
  input: {
    studentId: string;
    adverbsTaskIds: string[];
  }
): Promise<{
  created: string[];
  skipped: number;
}> {
  if (input.adverbsTaskIds.length === 0) {
    const existing = await prisma.studentAdverbsTask.findMany({
      where: {
        studentId: input.studentId,
      },
      select: {
        taskId: true
      },
    });

    const allTasks = await prisma.adverbsTask.findMany({ select: { id: true } });
    const existingIds = new Set(existing.map(e => e.taskId));
    const idsToCreate = allTasks.map(t => t.id).filter(id => !existingIds.has(id));

    const created = await prisma.studentAdverbsTask.createManyAndReturn({
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

  const existing = await prisma.studentAdverbsTask.findMany({
    where: {
      studentId: input.studentId,
      taskId: {
        in: input.adverbsTaskIds
      },
    },
    select: {
      taskId: true
    },
  });

  const existingIds = new Set(existing.map(e => e.taskId));
  const idsToCreate = input.adverbsTaskIds.filter(id => !existingIds.has(id));

  const created = await prisma.studentAdverbsTask.createManyAndReturn({
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
