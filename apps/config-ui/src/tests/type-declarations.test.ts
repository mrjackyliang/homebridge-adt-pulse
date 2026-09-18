import { registerTypeDeclarationSuite } from '@cbnventures/nova/rules/vitest';
import * as vitest from 'vitest';

/**
 * Tests - Type Declarations.
 *
 * This app self-checks its type declarations THROUGH the published kit. The
 * inspector rules live in @cbnventures/nova/rules/vitest; this wrapper
 * supplies the configuration that reproduces this app's conventions.
 *
 * @since 3.5.0
 */
registerTypeDeclarationSuite({
  vitest,
  enable: 'all',
  typeRoots: ['src'],
  standaloneTypeFiles: ['/config-ui.d.ts'],
});
