import type { FastifyPluginAsync } from 'fastify';
import { genitiveTaskExerciseRoutes } from './exercise.js';
import { genitiveTaskPoolRoutes } from './pool.js';
import { genitiveTaskStudentRoutes } from './student.js';

export const genitiveTaskRoutes: FastifyPluginAsync = async (app) => {
  app.register(genitiveTaskExerciseRoutes, { prefix: '/exercise' });
  app.register(genitiveTaskPoolRoutes, { prefix: '/pool' });
  app.register(genitiveTaskStudentRoutes, { prefix: '/student' });
};
