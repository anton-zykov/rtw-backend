import { mockDeep } from 'vitest-mock-extended';
import type { RedisClientType } from 'redis';

export function createRedisMock () {
  const redisMock = mockDeep<RedisClientType>();
  Object.defineProperty(redisMock, 'getter', { value: () => redisMock });
  return redisMock;
}
