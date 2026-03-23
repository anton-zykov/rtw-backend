import { z } from 'zod';

export const DeleteTeacherBody = z.object({
  id: z.uuidv4(),
});
