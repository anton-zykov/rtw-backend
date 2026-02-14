import { z } from 'zod';

export const AssignToStudentBody = z.object({
  studentId: z.uuidv4(),
  adverbsTaskIds: z.array(z.string()),
}).strict();

export const AssignToStudentReply = z.object({
  created: z.array(z.string()),
  skipped: z.number(),
}).strict();

export const UnassignFromStudentBody = z.object({
  studentId: z.uuid(),
  adverbsTaskIds: z.array(z.uuid()),
}).strict();

export const UnassignFromStudentReply = z.void();
