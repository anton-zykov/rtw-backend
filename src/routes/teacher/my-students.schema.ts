import { z } from 'zod';
import { TaskType } from '@prisma/client';

export const GetMyStudentsParams = z.object({
  teacherId: z.uuidv4(),
});

export const GetMyStudentsReply = z.array(z.object({
  id: z.uuidv4(),
  login: z.string(),
  age: z.number(),
  active: z.boolean(),
  fullName: z.string().nullable(),
  email: z.email().nullable(),
  telegramId: z.string().nullable(),
  taskTypes: z.array(z.enum(TaskType)),
  adverbsTrainings: z.array(z.date()),
  genitiveTrainings: z.array(z.date()),
  stressTrainings: z.array(z.date()),
  trickyTrainings: z.array(z.date()),
}));
