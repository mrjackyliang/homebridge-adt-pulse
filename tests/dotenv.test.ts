import { registerDotenvSuite } from '@cbnventures/nova/rules/vitest';
import * as vitest from 'vitest';

/**
 * Dotenv.
 *
 * @since 1.0.0
 */
registerDotenvSuite({
  vitest,
  enable: 'all',
});
