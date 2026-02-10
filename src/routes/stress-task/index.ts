import { stressTaskExerciseRoutes } from './exercise.js';
import { stressTaskPoolRoutes } from './pool.js';
import { stressTaskStudentRoutes } from './student.js';
import type { FastifyZodInstance } from '#/server.js';

export async function stressTaskRoutes (app: FastifyZodInstance) {
  app.register(stressTaskExerciseRoutes, { prefix: '/exercise' });
  app.register(stressTaskPoolRoutes, { prefix: '/pool' });
  app.register(stressTaskStudentRoutes, { prefix: '/student' });
}
