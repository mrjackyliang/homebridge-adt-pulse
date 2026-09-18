import { ADTPulsePlatform } from './lib/platform.js';

import type { Index_Initialize_Api, Index_Initialize_Returns } from './types/index.d.ts';

/**
 * Index - Initialize.
 *
 * Entry point that Homebridge calls when it loads this plugin. It registers the
 * ADT Pulse platform class so Homebridge can construct it from the user's config.
 *
 * @param {Index_Initialize_Api} api - Api.
 *
 * @returns {Index_Initialize_Returns}
 *
 * @since 1.0.0
 */
function initialize(api: Index_Initialize_Api): Index_Initialize_Returns {
  api.registerPlatform('ADTPulse', ADTPulsePlatform);

  return;
}

// Tell Homebridge this is the starting point.
export default initialize;
