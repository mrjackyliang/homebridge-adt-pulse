import { registerFrontmatterSuite } from '@cbnventures/nova/rules/vitest';
import * as vitest from 'vitest';

/**
 * Tests - Frontmatter.
 *
 * This site self-checks its docs frontmatter THROUGH the published kit. The
 * suite logic lives in @cbnventures/nova/rules/vitest; this wrapper supplies
 * the configuration that reproduces this site's conventions.
 *
 * @since 0.20.0
 */
registerFrontmatterSuite({
  vitest,
  enable: 'all',
  requiredFields: [
    'id',
    'title',
    'description',
    'keywords',
    'tags',
  ],
  indexSlug: 'overview',
  placeholderSentinel: 'x',
  placeholderBodyPrefix: 'Coming soon',
});
