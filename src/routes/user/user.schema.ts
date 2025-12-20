import { z } from 'zod';

export const CreateUserBody = z.object({
  login: z.string().min(3, 'login must be at least 3 characters long'),
  password: z.string().min(8, 'password must be at least 8 characters long'),
  fullName: z.string().optional(),
  email: z.email().optional(),
  telegramId: z.string().regex(/^@/).optional(),
}).strict();

export const CreateUserReply = z.object({
  id: z.uuidv4(),
  login: z.string(),
  fullName: z.string().nullable(),
  email: z.email().nullable(),
  telegramId: z.string().regex(/^@/).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpdateUserBody = z.object({
  id: z.uuidv4(),
  login: z.string().min(3, 'new login must be at least 3 characters long').optional(),
  fullName: z.string().optional(),
  email: z.email().optional(),
  telegramId: z.string().regex(/^@/).optional(),
}).strict();

export const UpdateUserReply = z.object({
  id: z.uuidv4(),
  login: z.string().nullable(),
  fullName: z.string().nullable(),
  email: z.email().nullable(),
  telegramId: z.string().regex(/^@/).nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date(),
});
