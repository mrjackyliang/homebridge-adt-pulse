import { registerMarkdownTableSuite } from '@cbnventures/nova/rules/vitest';
import * as vitest from 'vitest';

/**
 * Tests - Markdown Table.
 *
 * This site self-checks its documentation tables THROUGH the published kit. The
 * suite logic lives in @cbnventures/nova/rules/vitest; this wrapper supplies
 * the configuration that reproduces this site's conventions.
 *
 * @since 0.20.0
 */
registerMarkdownTableSuite({
  vitest,
  enable: 'all',
});
