import { PrismaClient, type StudentTrickyTask, type TrickyTask } from '@prisma/client';
import type { RedisClientType } from 'redis';

type StudentTrickyTaskWithTaskDetails =
  Pick<StudentTrickyTask, 'taskId' | 'weight'> &
  Pick<TrickyTask, 'age' | 'options'>;

export async function selectForExercise (
  prisma: PrismaClient,
  redis: RedisClientType,
  input: {
    studentId: string,
    amount: number | undefined
  }
): Promise<StudentTrickyTaskWithTaskDetails[]> {
  // TODO: deal with deleted tasks
  const cacheKey = `${input.studentId}:tricky`;
  const cache = await redis.get(cacheKey);
  // We trust the cache here
  const existingExercise = JSON.parse(cache || '[]') as StudentTrickyTaskWithTaskDetails[];
  // TODO: extract the 10 constant
  const amountToBeRetrieved = (input.amount || 10) - existingExercise.length;

  if (amountToBeRetrieved === 0) return existingExercise;
  if (amountToBeRetrieved < 0) {
    const spliced = existingExercise.slice(0, amountToBeRetrieved);
    await redis.set(cacheKey, JSON.stringify(spliced));
    return spliced;
  }

  const retrievedTasks = await prisma.$queryRaw<StudentTrickyTaskWithTaskDetails[]>`
    SELECT "taskId", "age", "options" FROM "StudentTrickyTask"
    JOIN "TrickyTask" ON "StudentTrickyTask"."taskId" = "TrickyTask"."id"
    WHERE "studentId" = ${input.studentId}::uuid
    ORDER BY -LN(RANDOM()) / weight
    LIMIT ${amountToBeRetrieved};
  `;

  const finalExercise = existingExercise.concat(retrievedTasks);
  await redis.set(cacheKey, JSON.stringify(finalExercise));
  return finalExercise;
}
