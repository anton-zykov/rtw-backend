import { z } from 'zod';
import { TaskType } from '@prisma/client';

export const CreateTeacherBody = z.object({
  id: z.uuidv4('User id is required'),
}).strict();

export const CreateTeacherReply = z.object({
  id: z.uuidv4(),
});

export const DeleteTeacherBody = z.object({
  id: z.uuidv4(),
});

export const GetMyStudentsParams = z.object({
  teacherId: z.uuidv4(),
});

export const GetMyStudentsReply = z.array(z.object({
  id: z.uuidv4(),
  login: z.string(),
  active: z.boolean(),
  fullName: z.string().nullable(),
  email: z.email().nullable(),
  telegramId: z.string().nullable(),
  taskTypes: z.array(z.enum(TaskType)),
}));
