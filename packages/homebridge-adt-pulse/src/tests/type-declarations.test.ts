import { registerTypeDeclarationSuite } from '@cbnventures/nova/rules/vitest';
import * as vitest from 'vitest';

/**
 * Tests - Type Declarations.
 *
 * This package self-checks its type declarations THROUGH the published kit. The
 * inspector rules live in @cbnventures/nova/rules/vitest; this wrapper
 * supplies the configuration that reproduces this package's conventions.
 *
 * @since 0.20.0
 */
registerTypeDeclarationSuite({
  vitest,
  enable: 'all',
  typeRoots: [
    'src',
  ],
  standaloneTypeFiles: [
    '/constant.d.ts',
    '/shared.d.ts',
  ],
});
