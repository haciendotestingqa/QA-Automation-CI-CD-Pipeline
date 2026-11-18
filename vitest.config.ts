import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/contract/**/*.consumer.test.ts'],
    testTimeout: 30000,
  },
});
