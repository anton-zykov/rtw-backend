import { teacherCreateRoutes } from './create.js';
import { teacherDeleteRoutes } from './delete.js';
import { teacherMyStudentsRoutes } from './my-students.js';
import type { FastifyZodInstance } from '#/server.js';

export async function teacherRoutes (app: FastifyZodInstance) {
  app.register(teacherCreateRoutes);
  app.register(teacherDeleteRoutes);
  app.register(teacherMyStudentsRoutes);
}
