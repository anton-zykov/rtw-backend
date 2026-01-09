import { z } from 'zod';

export const LoginBody = z.object({
  login: z.string(),
  password: z.string(),
}).strict();

export const LoginReply = z.object({
  role: z.string(),
}).strict();

export const MeReply = z.object({
  id: z.uuidv4(),
  login: z.string(),
  role: z.string(),
}).strict();
