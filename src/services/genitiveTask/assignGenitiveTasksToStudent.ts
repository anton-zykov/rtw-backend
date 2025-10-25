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

  await prisma.student.update({
    where: {
      id: input.studentId
    },
    data: {
      genitiveTasks: {
        create: idsToCreate
          .map(id => ({
            task: {
              connect: {
                id
              }
            },
          })),
      },
    },
  });

  return {
    created: idsToCreate,
    skipped: existingIds.size
  };
}
