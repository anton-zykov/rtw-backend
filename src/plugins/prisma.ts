import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import type { PrismaClient } from '@prisma/client';
import { prisma } from '#/libs/prisma.js';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

export const prismaPlugin: FastifyPluginAsync = fp(
  async (server, _opts) => {
    await prisma.$connect();

    server.decorate('prisma', prisma);

    server.addHook('onClose', async (server) => {
      await server.prisma.$disconnect();
    });
  }
);
