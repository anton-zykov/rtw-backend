import type { PrismaClient, StudentAdverbsTask } from '@prisma/client';
import type { RedisClientType } from 'redis';

export async function checkAnswers (
  prisma: PrismaClient,
  redis: RedisClientType,
  input: {
    userId: string;
    exercise: {
      taskId: string;
      answer: string;
    }[]
  }
): Promise<{
  taskId: string;
  correct: boolean;
}[]> {
  const tasks = await prisma.studentAdverbsTask.findMany({
    where: {
      studentId: input.userId,
      taskId: {
        in: input.exercise.map(t => t.taskId)
      }
    },
    include: {
      task: true
    }
  });

  const dbUpdates: StudentAdverbsTask[] = [];

  const results = tasks.map(t => {
    const answer = input.exercise.find(e => e.taskId === t.taskId)!.answer;
    const correct = !!(t.task.options as { word: string, correct: boolean }[]).find(o => o.word === answer)?.correct;
    dbUpdates.push({
      studentId: t.studentId,
      taskId: t.taskId,
      weight: correct ? Math.max(1, t.weight - 1) : Math.min(50, t.weight + 10),
      timesSeen: t.timesSeen + 1,
      lastSeenAt: new Date(),
    });

    return {
      taskId: t.taskId,
      correct
    };
  });

  await prisma.$transaction([
    ...dbUpdates.map(u => prisma.studentAdverbsTask.update({
      where: {
        studentId_taskId: {
          studentId: u.studentId,
          taskId: u.taskId
        }
      },
      data: u
    })),
    prisma.student.update({
      where: {
        id: input.userId
      },
      data: {
        adverbsTrainings: {
          push: new Date()
        }
      }
    })
  ]);

  await redis.del(`${input.userId}:adverbs`);

  return results;
}
