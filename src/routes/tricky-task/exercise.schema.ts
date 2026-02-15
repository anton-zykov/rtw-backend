import { z } from 'zod';

export const GetTrickyExerciseParams = z.object({
  userId: z.uuidv4(),
}).strict();

export const GetTrickyExerciseQuery = z.object({
  amount: z.number().int().positive().optional(),
}).strict();

export const GetTrickyExerciseReply = z.array(
  z.object({
    taskId: z.uuid(),
    age: z.number(),
    incorrectWord: z.string(),
  })
);

export const CheckTrickyExerciseBody = z.object({
  userId: z.uuidv4(),
  exercise: z.array(
    z.object({
      taskId: z.uuid(),
      answer: z.string(),
    })
  ),
}).strict();

export const CheckTrickyExerciseReply = z.array(
  z.object({
    taskId: z.uuid(),
    correct: z.boolean(),
  })
);
