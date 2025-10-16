import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import type { PrismaClient } from '@prisma/client';

export type PrismaPluginOptions = {
  prismaClient: PrismaClient;
};

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

export const prismaPlugin: FastifyPluginAsync<{ prismaClient: PrismaClient }> = fp(
  async (app: FastifyInstance, opts: PrismaPluginOptions) => {
    await opts.prismaClient.$connect();
    app.decorate('prisma', opts.prismaClient);
    app.addHook('onClose', () => opts.prismaClient.$disconnect());
  }, {
    name: 'prisma',
  }
);
