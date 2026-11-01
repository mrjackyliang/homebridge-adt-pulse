import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { registerDotenvSuite } from '@cbnventures/nova/rules/vitest';
import * as vitest from 'vitest';

/**
 * Tests - Dotenv.
 *
 * This site self-checks its `.env` quote conventions THROUGH the published kit.
 * The inspector rules live in @cbnventures/nova/rules/vitest; this wrapper
 * supplies the configuration that reproduces this site's conventions.
 *
 * The `.env` files live at this site's workspace root, so `rootDir` resolves up
 * from this test file instead of relying on Vitest's working directory.
 *
 * @since 0.20.0
 */
registerDotenvSuite({
  vitest,
  enable: 'all',
  rootDir: join(dirname(fileURLToPath(import.meta.url)), '../..'),
  envPaths: [
    '.env',
    '.env.sample',
  ],
});
