import { registerPackageScriptsSuite } from '@cbnventures/nova/rules/vitest';
import * as vitest from 'vitest';
import {
  describe,
  expect,
  it,
} from 'vitest';

import packageJson from '../package.json' with { type: 'json' };

/**
 * Project - Project Root.
 *
 * Confirms the repository root remains a private monorepo coordinator.
 *
 * @since 0.0.0
 */
describe('Project root', () => {
  it('stays private', () => {
    expect(packageJson['private']).toBe(true);

    return;
  });

  return;
});

registerPackageScriptsSuite({
  vitest,
  requireRootScripts: true,
  enable: 'all',
});
