import { VitestSetup } from '@cbnventures/nova/toolkit';
import { afterEach, beforeEach, vi } from 'vitest';

/**
 * Vitest.
 *
 * Global test hooks suppressing Logger output via stdout/stderr spies
 * and resetting the process exit code so each test starts clean.
 *
 * @since 1.0.0
 */
VitestSetup.register({
  afterEach,
  beforeEach,
  vi,
});
