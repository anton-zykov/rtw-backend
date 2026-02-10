import { genitiveTaskExerciseRoutes } from './exercise.js';
import { genitiveTaskPoolRoutes } from './pool.js';
import { genitiveTaskStudentRoutes } from './student.js';
import type { FastifyZodInstance } from '#/server.js';

export async function genitiveTaskRoutes (app: FastifyZodInstance) {
  app.register(genitiveTaskExerciseRoutes, { prefix: '/exercise' });
  app.register(genitiveTaskPoolRoutes, { prefix: '/pool' });
  app.register(genitiveTaskStudentRoutes, { prefix: '/student' });
}
