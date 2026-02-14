import { PrismaClient, type StressTask, type StudentStressTask } from '@prisma/client';
import type { RedisClientType } from 'redis';

type StudentStressTaskWithTaskDetails =
  Pick<StudentStressTask, 'taskId' | 'weight'> &
  Pick<StressTask, 'options'>;

export async function selectForExercise (
  prisma: PrismaClient,
  redis: RedisClientType,
  input: {
    studentId: string,
    amount: number | undefined
  }
): Promise<StudentStressTaskWithTaskDetails[]> {
  // TODO: deal with deleted tasks
  const cacheKey = `${input.studentId}:stress`;
  const cache = await redis.get(cacheKey);
  // We trust the cache here
  const existingExercise = JSON.parse(cache || '[]') as StudentStressTaskWithTaskDetails[];
  // TODO: extract the 10 constant
  const amountToBeRetrieved = (input.amount || 10) - existingExercise.length;

  if (amountToBeRetrieved === 0) return existingExercise;
  if (amountToBeRetrieved < 0) {
    const spliced = existingExercise.slice(0, amountToBeRetrieved);
    await redis.set(cacheKey, JSON.stringify(spliced));
    return spliced;
  }

  const retrievedTasks = await prisma.$queryRaw<StudentStressTaskWithTaskDetails[]>`
    SELECT "taskId", "options" FROM "StudentStressTask"
    JOIN "StressTask" ON "StudentStressTask"."taskId" = "StressTask"."id"
    WHERE "studentId" = ${input.studentId}::uuid
    ORDER BY -LN(RANDOM()) / weight
    LIMIT ${amountToBeRetrieved};
  `;

  const finalExercise = existingExercise.concat(retrievedTasks);
  await redis.set(cacheKey, JSON.stringify(finalExercise));
  return finalExercise;
}
