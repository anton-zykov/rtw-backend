import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '#/libs/__mocks__/prisma.js';

export const prismaPlugin: FastifyPluginAsync = fp(
  async (app) => {
    await prisma.$connect();

    app.decorate('prisma', prisma);

    app.addHook('onClose', async () => {
      await prisma.$disconnect();
    });
  }
);
