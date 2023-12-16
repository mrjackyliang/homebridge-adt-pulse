import { ADTPulsePlatform } from '@/lib/platform.js';
import type { InitializeApi, InitializeReturns } from '@/types/index.d.ts';

/**
 * Initialize.
 *
 * @param {InitializeApi} api - Api.
 *
 * @returns {InitializeReturns}
 *
 * @since 1.0.0
 */
function initialize(api: InitializeApi): InitializeReturns {
  api.registerPlatform('ADTPulse', ADTPulsePlatform);
}

// Tell Homebridge this is the starting point.
export default initialize;
