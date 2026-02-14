import { z } from 'zod';

export const GetStressExerciseParams = z.object({
  userId: z.uuidv4(),
}).strict();

export const GetStressExerciseQuery = z.object({
  amount: z.number().int().positive().optional(),
}).strict();

export const GetStressExerciseReply = z.array(
  z.object({
    taskId: z.uuid(),
    options: z.unknown().pipe(
      z.array(
        z.object({
          word: z.string(),
          correct: z.boolean(),
        })
      )
    ),
  })
);

export const CheckStressExerciseBody = z.object({
  userId: z.uuidv4(),
  exercise: z.array(
    z.object({
      taskId: z.uuid(),
      answer: z.string(),
    })
  ),
}).strict();

export const CheckStressExerciseReply = z.array(
  z.object({
    taskId: z.uuid(),
    correct: z.boolean(),
  })
);
