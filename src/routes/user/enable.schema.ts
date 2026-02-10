import { z } from 'zod';

export const EnableUserBody = z.object({
  id: z.uuidv4(),
}).strict();

export const EnableStudentUserBody = z.object({
  studentId: z.uuidv4(),
}).strict();
