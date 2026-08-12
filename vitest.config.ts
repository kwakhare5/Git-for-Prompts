import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    fileParallelism: false,
    maxConcurrency: 1,
    sequence: {
      concurrent: false,
    },
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'packages/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
