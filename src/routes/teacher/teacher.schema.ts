import { z } from 'zod';

export const CreateTeacherBody = z.object({
  id: z.uuidv4('User id is required'),
}).strict();

export const CreateTeacherReply = z.object({
  id: z.uuidv4(),
});

export const DeleteTeacherBody = z.object({
  id: z.uuidv4(),
});
