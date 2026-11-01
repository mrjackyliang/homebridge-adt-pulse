import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

/**
 * Vitest Configuration.
 *
 * @since 0.15.0
 */
const currentFilePath = fileURLToPath(import.meta.url);

/**
 * Vitest Configuration - Root directory.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 0.0.0
 */
const rootDirectory = dirname(currentFilePath);

export default defineConfig({
  resolve: {
    alias: {
      '@site': rootDirectory,
    },
  },
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
