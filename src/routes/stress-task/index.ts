import type { FastifyPluginAsync } from 'fastify';
import { stressTaskExerciseRoutes } from './exercise.js';
import { stressTaskPoolRoutes } from './pool.js';
import { stressTaskStudentRoutes } from './student.js';

export const stressTaskRoutes: FastifyPluginAsync = async (app) => {
  app.register(stressTaskExerciseRoutes, { prefix: '/exercise' });
  app.register(stressTaskPoolRoutes, { prefix: '/pool' });
  app.register(stressTaskStudentRoutes, { prefix: '/student' });
};
