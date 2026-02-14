import { adverbsTaskExerciseRoutes } from './exercise.js';
import { adverbsTaskPoolRoutes } from './pool.js';
import { adverbsTaskStudentRoutes } from './student.js';
import type { FastifyZodInstance } from '#/server.js';

export async function adverbsTaskRoutes (app: FastifyZodInstance) {
  app.register(adverbsTaskExerciseRoutes, { prefix: '/exercise' });
  app.register(adverbsTaskPoolRoutes, { prefix: '/pool' });
  app.register(adverbsTaskStudentRoutes, { prefix: '/student' });
}
