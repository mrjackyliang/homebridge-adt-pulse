import { defineConfig } from 'vitest/config';

/**
 * Vitest Configuration.
 *
 * Wires root-owned conformance tests while each workspace retains its own
 * independently configured test suite.
 *
 * @since 1.0.0
 */
export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    exclude: [
      'apps/**',
      'packages/**',
      '**/node_modules/**',
    ],
    globals: false,
    testTimeout: 30000, // 30 seconds.
  },
});
