import { z } from 'zod';

export const CreateTrickyTasksBody = z.array(
  z.object({
    age: z.number().int().positive(),
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

export const CreateTrickyTasksReply = z.array(
  z.object({ id: z.uuid() }).strict()
);

export const DeleteTrickyTasksBody = z.array(z.uuid());

export const DeleteTrickyTasksReply = z.void();
