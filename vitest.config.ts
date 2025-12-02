import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    // setupFiles: ['test/setup.ts'],
    globalSetup: [
      'test/setup.ts'
    ],
    clearMocks: true,
    reporters: [['tree']],
    coverage: {
      reporter: ['text', 'html'],
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx,js}'],
      exclude: ['**/*.test.*', 'test/**', 'node_modules/**']
    },
  },
  resolve: {
    alias: {
      '#': path.resolve(__dirname, 'src'),
      test: path.resolve(__dirname, 'test'),
    }
  }
});
