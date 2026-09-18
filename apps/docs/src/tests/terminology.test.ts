import { registerTerminologySuite } from '@cbnventures/nova/rules/vitest';
import * as vitest from 'vitest';

/**
 * Tests - Terminology.
 *
 * This site self-checks its Terminology components THROUGH the published kit.
 * The suite logic lives in @cbnventures/nova/rules/vitest; this wrapper
 * supplies the configuration that reproduces this site's conventions.
 *
 * @since 0.20.0
 */
registerTerminologySuite({
  vitest,
  enable: 'all',
  terminologyPath: 'docs/reference/terminology.mdx',
  expectedBase: '/docs/reference/terminology',
});
