import { createClient, type RedisClientType } from 'redis';

export function createRedisClient (port: string): RedisClientType {
  return createClient({
    url: `redis://localhost:${port}`,
  });
}
