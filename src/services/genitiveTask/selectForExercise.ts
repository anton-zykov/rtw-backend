import { PrismaClient, type GenitiveTask, type StudentGenitiveTask } from '@prisma/client';

export type SelectGenitiveTasksForExerciseInput = {
  studentId: number;
  amount?: number;
};

type StudentGenitiveTaskWithTaskDetails =
  Pick<StudentGenitiveTask, 'taskId' | 'weight'> &
  Pick<GenitiveTask, 'nominative' | 'options'>;

export async function selectForExercise (
  prisma: PrismaClient,
  input: SelectGenitiveTasksForExerciseInput
): Promise<StudentGenitiveTaskWithTaskDetails[]> {
  const tasks = await prisma.$queryRaw<StudentGenitiveTaskWithTaskDetails[]>`
    SELECT "taskId", "weight", "nominative", "options" FROM "StudentGenitiveTask"
    JOIN "GenitiveTask" ON "StudentGenitiveTask"."taskId" = "GenitiveTask"."id"
    WHERE "studentId" = ${input.studentId}
    ORDER BY -LN(RANDOM()) / weight
    LIMIT ${input.amount || 10};
  `;

  return tasks;
}
