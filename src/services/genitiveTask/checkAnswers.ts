import type { PrismaClient, StudentGenitiveTask } from '@prisma/client';

export async function checkAnswers (
  prisma: PrismaClient,
  input: {
    studentId: number;
    exercise: {
      taskId: string;
      answer: string;
    }[]
  }
): Promise<{
  taskId: string;
  correct: boolean;
}[]> {
  const tasks = await prisma.studentGenitiveTask.findMany({
    where: {
      studentId: input.studentId,
      taskId: {
        in: input.exercise.map(t => t.taskId)
      }
    },
    include: {
      task: true
    }
  });

  const dbUpdates: StudentGenitiveTask[] = [];

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

  await prisma.$transaction(
    dbUpdates.map(u => prisma.studentGenitiveTask.update({
      where: {
        studentId_taskId: {
          studentId: u.studentId,
          taskId: u.taskId
        }
      },
      data: u
    }))
  );

  return results;
}
