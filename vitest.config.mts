import { defineConfig } from 'vitest/config';

/**
 * Vitest Configuration.
 *
 * Wires the root-level test suite that validates dotenv quoting conventions
 * across the project workspace's generated environment files.
 *
 * @since 1.0.0
 */
export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/tests/**/*.test.ts'],
    globals: false,
    testTimeout: 30000, // 30 seconds.
    sequence: {
      concurrent: false,
    },
  },
});
