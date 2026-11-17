import { registerPackageScriptsSuite } from '@cbnventures/nova/rules/vitest';
import * as vitest from 'vitest';
import {
  describe,
  expect,
  it,
} from 'vitest';

import novaConfigJson from '../nova.config.json' with { type: 'json' };
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

/**
 * Project - Project Identity.
 *
 * Protects the product name while keeping stable repository identifiers intact.
 * Generated metadata and publishing links depend on this distinction.
 *
 * @since 0.0.0
 */
describe('Project identity', () => {
  it('separates the product name from the repository slug', () => {
    expect(novaConfigJson['project']['name']['title']).toBe('ADT Pulse for Homebridge');

    expect(novaConfigJson['project']['name']['slug']).toBe('homebridge-adt-pulse');

    return;
  });

  return;
});

registerPackageScriptsSuite({
  vitest,
  requireRootScripts: true,
  enable: 'all',
});
