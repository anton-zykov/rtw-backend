import { TaskType } from '@prisma/client';
import { z } from 'zod';

export const CreateStudentBody = z.object({
  id: z.uuidv4(),
  teacherId: z.uuidv4(),
}).strict();

export const CreateStudentReply = z.object({
  id: z.uuidv4(),
});

export const DeleteStudentBody = z.object({
  id: z.uuidv4(),
});

export const GetTaskTypesParams = z.object({
  id: z.uuidv4(),
}).strict();

export const GetTaskTypesReply = z.object({
  taskTypes: z.array(z.enum(TaskType)),
}).strict();

