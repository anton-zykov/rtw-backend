import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // setupFiles: ['test/setup.ts'],
    clearMocks: true,
    reporters: ['default'],
    coverage: {
      reporter: ['text', 'html'],
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx,js}'],
      exclude: ['**/*.test.*', 'test/**', 'node_modules/**']
    }
  },
  resolve: {
    alias: { '#': new URL('./src/', import.meta.url).pathname }
  }
});
