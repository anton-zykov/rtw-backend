import { trickyTaskExerciseRoutes } from './exercise.js';
import { trickyTaskPoolRoutes } from './pool.js';
import { trickyTaskStudentRoutes } from './student.js';
import type { FastifyZodInstance } from '#/server.js';

export async function trickyTaskRoutes (app: FastifyZodInstance) {
  app.register(trickyTaskExerciseRoutes, { prefix: '/exercise' });
  app.register(trickyTaskPoolRoutes, { prefix: '/pool' });
  app.register(trickyTaskStudentRoutes, { prefix: '/student' });
}
