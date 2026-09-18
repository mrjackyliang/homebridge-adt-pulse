import { VitestSetup } from '@cbnventures/nova/toolkit';
import { afterEach, beforeEach, vi } from 'vitest';

/**
 * Vitest setup.
 *
 * Registers Nova's shared process-output suppression, exit-code reset,
 * and mock restoration so each test starts and finishes cleanly.
 *
 * @since 1.0.0
 */
VitestSetup.register({
  afterEach,
  beforeEach,
  vi,
});
