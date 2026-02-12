import { createRedisMock } from './createRedisMock.js';

export function createRedisMockWithStorage () {
  const store = new Map<string, string>();
  const redisMock = createRedisMock();
  redisMock.get.mockImplementation(async (key) => store.get(String(key)) ?? null);
  redisMock.set.mockImplementation(async (key, value) => {
    store.set(String(key), String(value));
    return undefined as never;
  });
  redisMock.del.mockImplementation(async (...keys) => {
    for (const key of keys) store.delete(String(key));
    return keys.length;
  });
  return redisMock;
}
