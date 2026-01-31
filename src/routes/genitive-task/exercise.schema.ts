import { z } from 'zod';

export const GetGenitiveExerciseParams = z.object({
  userId: z.uuidv4(),
}).strict();

export const GetGenitiveExerciseQuery = z.object({
  amount: z.number().int().positive().optional(),
}).strict();

export const GetGenitiveExerciseReply = z.array(
  z.object({
    taskId: z.uuid(),
    weight: z.number().int().positive(),
    nominative: z.string(),
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

export const CheckGenitiveExerciseBody = z.object({
  userId: z.uuidv4(),
  exercise: z.array(
    z.object({
      taskId: z.uuid(),
      answer: z.string(),
    })
  ),
}).strict();

export const CheckGenitiveExerciseReply = z.array(
  z.object({
    taskId: z.uuid(),
    correct: z.boolean(),
  })
);
