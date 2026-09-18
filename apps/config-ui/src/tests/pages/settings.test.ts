// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import Settings from '../../pages/settings';

import type {
  Tests_Pages_Settings_Settings_SwitchesEveryPanelWithoutBootstrapJavaScript_Button,
  Tests_Pages_Settings_Settings_SwitchesEveryPanelWithoutBootstrapJavaScript_Container,
  Tests_Pages_Settings_Settings_SwitchesEveryPanelWithoutBootstrapJavaScript_Panel,
  Tests_Pages_Settings_Settings_SwitchesEveryPanelWithoutBootstrapJavaScript_Root,
} from '../../types/tests/pages/settings.test.d.ts';

vi.mock('../../pages/settings-general', () => ({ default: () => React.createElement('p', {}, 'General panel') }));
vi.mock('../../pages/settings-login', () => ({ default: () => React.createElement('p', {}, 'Login panel') }));
vi.mock('../../pages/settings-fingerprint', () => ({ default: () => React.createElement('p', {}, 'Fingerprint panel') }));
vi.mock('../../pages/settings-sensors', () => ({ default: () => React.createElement('p', {}, 'Sensors panel') }));
vi.mock('../../pages/settings-plugin', () => ({ default: () => React.createElement('p', {}, 'Plugin panel') }));

describe('Settings', () => {
  it('switches every panel without Bootstrap JavaScript', async () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);

    const container: Tests_Pages_Settings_Settings_SwitchesEveryPanelWithoutBootstrapJavaScript_Container = document.createElement('div');
    const root: Tests_Pages_Settings_Settings_SwitchesEveryPanelWithoutBootstrapJavaScript_Root = createRoot(container);

    document.body.append(container);

    await act(async () => {
      root.render(React.createElement(Settings, {
        homebridge: undefined,
        setView: vi.fn(),
      }));

      return;
    });

    for (const name of [
      'general',
      'login',
      'fingerprint',
      'sensors',
      'plugin',
    ]) {
      const button: Tests_Pages_Settings_Settings_SwitchesEveryPanelWithoutBootstrapJavaScript_Button = container.querySelector<HTMLButtonElement>(`#settings-${name}-tab`);
      const panel: Tests_Pages_Settings_Settings_SwitchesEveryPanelWithoutBootstrapJavaScript_Panel = container.querySelector(`#settings-${name}`);

      expect(button).not.toBeNull();

      if (button === null || panel === null) {
        throw new Error(`Missing ${name} settings tab or panel.`);
      }

      await act(async () => {
        button.click();

        return;
      });

      expect(button.getAttribute('aria-selected')).toBe('true');

      expect(panel.hasAttribute('hidden')).toBe(false);

      expect(container.querySelectorAll('.tab-pane.active')).toHaveLength(1);
    }

    await act(async () => {
      root.unmount();

      return;
    });

    container.remove();

    vi.unstubAllGlobals();

    return;
  });

  return;
});
