import 'vitest';

declare module 'vitest' {
  interface Assertion<T = any> {
    toBeUuidV4(): T;
  }
  interface AsymmetricMatchersContaining {
    toBeUuidV4(): unknown;
  }
}
