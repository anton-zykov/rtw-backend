import type { FastifyPluginAsync } from 'fastify';
import { trickyTaskExerciseRoutes } from './exercise.js';
import { trickyTaskPoolRoutes } from './pool.js';
import { trickyTaskStudentRoutes } from './student.js';

export const trickyTaskRoutes: FastifyPluginAsync = async (app) => {
  app.register(trickyTaskExerciseRoutes, { prefix: '/exercise' });
  app.register(trickyTaskPoolRoutes, { prefix: '/pool' });
  app.register(trickyTaskStudentRoutes, { prefix: '/student' });
};
