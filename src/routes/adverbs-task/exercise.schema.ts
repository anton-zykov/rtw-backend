import { z } from 'zod';

export const GetAdverbsExerciseParams = z.object({
  userId: z.uuidv4(),
}).strict();

export const GetAdverbsExerciseQuery = z.object({
  amount: z.number().int().positive().optional(),
}).strict();

export const GetAdverbsExerciseReply = z.array(
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

export const CheckAdverbsExerciseBody = z.object({
  userId: z.uuidv4(),
  exercise: z.array(
    z.object({
      taskId: z.uuid(),
      answer: z.string(),
    })
  ),
}).strict();

export const CheckAdverbsExerciseReply = z.array(
  z.object({
    taskId: z.uuid(),
    correct: z.boolean(),
  })
);
