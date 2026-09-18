// @vitest-environment jsdom

import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { watch } from '../../lib/theme';

import type {
  Tests_Lib_Theme_Theme_MirrorsHomebridgeChangesWithoutKeepingStaleClasses_Stop,
  Tests_Lib_Theme_Theme_UsesParentThemeDuringLiveChanges_Stop,
} from '../../types/tests/lib/theme.test.d.ts';

describe('Theme', () => {
  it('mirrors Homebridge changes without keeping stale classes', async () => {
    document.body.className = 'config-ui-x-purple modal-content';

    const stop: Tests_Lib_Theme_Theme_MirrorsHomebridgeChangesWithoutKeepingStaleClasses_Stop = watch(document.body);

    expect(document.body.getAttribute('data-bs-theme')).toBe('light');

    document.body.classList.add('config-ui-x-dark-mode-green');

    await vi.waitFor(() => {
      expect(document.body.getAttribute('data-bs-theme')).toBe('dark');

      expect(document.body.classList.contains('config-ui-x-purple')).toBe(false);

      return;
    });

    document.body.classList.add('config-ui-x-blue');

    await vi.waitFor(() => {
      expect(document.body.getAttribute('data-bs-theme')).toBe('light');

      expect(document.body.classList.contains('config-ui-x-dark-mode-green')).toBe(false);

      return;
    });

    stop();
    document.body.className = '';

    return;
  });

  it('uses parent theme during live changes', async () => {
    vi.stubGlobal('parent', { document: document.implementation.createHTMLDocument('Homebridge') });

    document.body.className = 'config-ui-x-purple';
    window.parent.document.body.className = 'config-ui-x-dark-mode-green';

    const stop: Tests_Lib_Theme_Theme_UsesParentThemeDuringLiveChanges_Stop = watch(document.body);

    expect(document.body.getAttribute('data-bs-theme')).toBe('dark');

    expect(document.body.classList.contains('config-ui-x-purple')).toBe(true);

    window.parent.document.body.classList.replace('config-ui-x-dark-mode-green', 'config-ui-x-red');

    await vi.waitFor(() => {
      expect(document.body.getAttribute('data-bs-theme')).toBe('light');

      return;
    });

    stop();

    vi.unstubAllGlobals();

    document.body.className = '';

    return;
  });

  return;
});
