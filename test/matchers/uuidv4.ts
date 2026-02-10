import { expect } from 'vitest';

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

expect.extend({
  toBeUuidV4 (received: unknown) {
    const pass =
      typeof received === 'string' && UUID_V4_REGEX.test(received);

    return {
      pass,
      message: () =>
        pass
          ? 'expected value not to be a valid UUID v4'
          : `expected "${received}" to be a valid UUID v4`,
    };
  },
});
