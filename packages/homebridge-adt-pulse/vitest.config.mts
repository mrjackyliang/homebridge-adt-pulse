import { defineConfig } from 'vitest/config';

/**
 * Vitest config.
 *
 * @type {import('vitest/config').UserConfig}
 *
 * @since 1.0.0
 */
const vitestConfig = defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['src/tests/**/*.test.ts'],
    setupFiles: [
      './vitest.setup.ts',
    ],
    testTimeout: 30000, // 30 seconds.
    sequence: {
      concurrent: false,
    },
  },
});

export default vitestConfig;
