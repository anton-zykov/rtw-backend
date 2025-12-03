import { PrismaClient, type GenitiveTask, type StudentGenitiveTask } from '@prisma/client';
import type { RedisClientType } from 'redis';

type StudentGenitiveTaskWithTaskDetails =
  Pick<StudentGenitiveTask, 'taskId' | 'weight'> &
  Pick<GenitiveTask, 'nominative' | 'options'>;

export async function selectForExercise (
  prisma: PrismaClient,
  redis: RedisClientType,
  input: {
    studentId: string;
    amount?: number;
  }
): Promise<StudentGenitiveTaskWithTaskDetails[]> {
  const cacheKey = `${input.studentId}:genitive`;
  const cache = await redis.get(cacheKey);
  // We trust the cache here
  const existingExercise = JSON.parse(cache || '[]') as StudentGenitiveTaskWithTaskDetails[];
  // TODO: extract the 10 constant
  const amountToBeRetrieved = (input.amount || 10) - existingExercise.length;

  if (amountToBeRetrieved === 0) return existingExercise;
  if (amountToBeRetrieved < 0) {
    const spliced = existingExercise.slice(0, amountToBeRetrieved);
    await redis.set(cacheKey, JSON.stringify(spliced));
    return spliced;
  }

  const retrievedTasks = await prisma.$queryRaw<StudentGenitiveTaskWithTaskDetails[]>`
    SELECT "taskId", "weight", "nominative", "options" FROM "StudentGenitiveTask"
    JOIN "GenitiveTask" ON "StudentGenitiveTask"."taskId" = "GenitiveTask"."id"
    WHERE "studentId" = ${input.studentId}
    ORDER BY -LN(RANDOM()) / weight
    LIMIT ${amountToBeRetrieved};
  `;

  const finalExercise = existingExercise.concat(retrievedTasks);
  await redis.set(cacheKey, JSON.stringify(finalExercise));
  return finalExercise;
}
