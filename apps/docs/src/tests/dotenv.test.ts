import { resolve } from 'node:path';

import { registerDotenvSuite } from '@cbnventures/nova/rules/vitest';
import * as vitest from 'vitest';

/**
 * Tests - Dotenv.
 *
 * This site self-checks the repository's environment files THROUGH the
 * published kit. The quote-convention logic lives in
 * @cbnventures/nova/rules/vitest; this wrapper points it at the repo-root
 * `.env` and `.env.sample`, which sit two levels up from this workspace.
 *
 * @since 0.20.0
 */
registerDotenvSuite({
  vitest,
  enable: 'all',
  rootDir: resolve(process.cwd(), '..', '..'),
  envPaths: [
    '.env',
    '.env.sample',
  ],
});

/**
 * Tests - Dotenv.
 *
 * Covers the docs workspace's own `.env` and `.env.sample`, which live
 * alongside this test file's workspace root.
 *
 * @since 1.0.0
 */
registerDotenvSuite({
  vitest,
  enable: 'all',
  envPaths: [
    '.env',
    '.env.sample',
  ],
});
