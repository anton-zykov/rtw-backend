import { PrismaClient, type AdverbsTask, type StudentAdverbsTask } from '@prisma/client';
import type { RedisClientType } from 'redis';

type StudentAdverbsTaskWithTaskDetails =
  Pick<StudentAdverbsTask, 'taskId' | 'weight'> &
  Pick<AdverbsTask, 'options'>;

export async function selectForExercise (
  prisma: PrismaClient,
  redis: RedisClientType,
  input: {
    studentId: string,
    amount: number | undefined
  }
): Promise<StudentAdverbsTaskWithTaskDetails[]> {
  // TODO: deal with deleted tasks
  const cacheKey = `${input.studentId}:adverbs`;
  const cache = await redis.get(cacheKey);
  // We trust the cache here
  const existingExercise = JSON.parse(cache || '[]') as StudentAdverbsTaskWithTaskDetails[];
  // TODO: extract the 10 constant
  const amountToBeRetrieved = (input.amount || 10) - existingExercise.length;

  if (amountToBeRetrieved === 0) return existingExercise;
  if (amountToBeRetrieved < 0) {
    const spliced = existingExercise.slice(0, amountToBeRetrieved);
    await redis.set(cacheKey, JSON.stringify(spliced));
    return spliced;
  }

  const retrievedTasks = await prisma.$queryRaw<StudentAdverbsTaskWithTaskDetails[]>`
    SELECT "taskId", "options" FROM "StudentAdverbsTask"
    JOIN "AdverbsTask" ON "StudentAdverbsTask"."taskId" = "AdverbsTask"."id"
    WHERE "studentId" = ${input.studentId}::uuid
    ORDER BY -LN(RANDOM()) / weight
    LIMIT ${amountToBeRetrieved};
  `;

  const finalExercise = existingExercise.concat(retrievedTasks);
  await redis.set(cacheKey, JSON.stringify(finalExercise));
  return finalExercise;
}
