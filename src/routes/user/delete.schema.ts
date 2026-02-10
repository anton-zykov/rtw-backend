import { z } from 'zod';

export const DeleteUserBody = z.object({
  id: z.uuidv4(),
}).strict();
