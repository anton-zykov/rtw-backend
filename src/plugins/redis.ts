import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import type { RedisClientType } from 'redis';

export type RedisPluginOptions = {
  redisClient: RedisClientType;
};

declare module 'fastify' {
  interface FastifyInstance {
    redis: RedisClientType;
  }
}

export const redisPlugin: FastifyPluginAsync<{ redisClient: RedisClientType }> = fp(
  async (app: FastifyInstance, opts: RedisPluginOptions) => {
    // TODO: replace with logger
    opts.redisClient.on('error', (err) => console.error('Redis Client Error', err));
    await opts.redisClient.connect();
    app.decorate('redis', opts.redisClient);
    app.addHook('onClose', () => opts.redisClient.quit());
  }, {
    name: 'redis',
  }
);
