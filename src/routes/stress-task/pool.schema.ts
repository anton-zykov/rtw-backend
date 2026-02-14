import { z } from 'zod';

export const CreateStressTasksBody = z.array(
  z.object({
    options: z.array(
      z.object({
        word: z.string(),
        correct: z.boolean(),
      })
    )
      .min(2, 'task must have at least 2 options')
      .refine((options) => options.filter((option) => option.correct).length === 1, 'task must have exactly one correct option'),
  }).strict()
);

export const CreateStressTasksReply = z.array(
  z.object({ id: z.uuid() }).strict()
);

export const DeleteStressTasksBody = z.array(z.uuid());

export const DeleteStressTasksReply = z.void();
