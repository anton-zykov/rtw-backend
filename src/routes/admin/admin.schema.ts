import { z } from 'zod';

export const CreateAdminBody = z.object({
  id: z.uuidv4(),
}).strict();

export const CreateAdminReply = z.object({
  id: z.uuidv4(),
});
