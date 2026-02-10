import { z } from 'zod';

export const DisableUserBody = z.object({
  id: z.uuidv4(),
}).strict();

export const DisableStudentUserBody = z.object({
  studentId: z.uuidv4(),
}).strict();
