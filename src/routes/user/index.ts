import { createUserRoutes } from './create.js';
import { updateUserRoutes } from './update.js';
import { disableUserRoutes } from './disable.js';
import { enableUserRoutes } from './enable.js';
import { deleteUserRoutes } from './delete.js';
import type { FastifyZodInstance } from '#/server.js';

export async function userRoutes (app: FastifyZodInstance) {
  app.register(createUserRoutes);
  app.register(updateUserRoutes);
  app.register(disableUserRoutes);
  app.register(enableUserRoutes);
  app.register(deleteUserRoutes);
}
