import { z } from 'zod';

export const CreateTrickyTasksBody = z.array(
  z.object({
    age: z.number().int().positive(),
    correctWord: z.string().min(1),
    incorrectWord: z.string().min(1),
  }).strict()
);

export const CreateTrickyTasksReply = z.array(
  z.object({ id: z.uuid() }).strict()
);

export const DeleteTrickyTasksBody = z.array(z.uuid());

export const DeleteTrickyTasksReply = z.void();
