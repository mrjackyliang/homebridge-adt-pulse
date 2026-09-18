// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useForm } from 'react-hook-form';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import SettingsSensors from '../../pages/settings-sensors';

import type {
  Tests_Pages_SettingsSensors_SensorHarness_Form,
  Tests_Pages_SettingsSensors_SensorHarness_Values,
  Tests_Pages_SettingsSensors_SettingsSensors_OpensAndClosesASensorWithoutBootstrapJavaScript_Button,
  Tests_Pages_SettingsSensors_SettingsSensors_OpensAndClosesASensorWithoutBootstrapJavaScript_Container,
  Tests_Pages_SettingsSensors_SettingsSensors_OpensAndClosesASensorWithoutBootstrapJavaScript_Panel,
  Tests_Pages_SettingsSensors_SettingsSensors_OpensAndClosesASensorWithoutBootstrapJavaScript_Root,
} from '../../types/tests/pages/settings-sensors.test.d.ts';

/**
 * Tests - Pages - Settings Sensors - Sensor Harness.
 *
 * Provides a real form control so the accordion test covers React Hook Form.
 * It verifies sensor expansion without relying on the host's Bootstrap script.
 *
 * @since 3.5.0
 */
function SensorHarness() {
  const form: Tests_Pages_SettingsSensors_SensorHarness_Form = useForm<Tests_Pages_SettingsSensors_SensorHarness_Values>({
    defaultValues: {
      sensors: [{
        name: 'Test Door',
        adtName: 'Door (1)',
        adtZone: 1,
        adtType: 'doorWindow',
      }],
    },
  });

  return React.createElement(SettingsSensors, { control: form.control });
}

describe('SettingsSensors', () => {
  it('opens and closes a sensor without Bootstrap JavaScript', async () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);

    const container: Tests_Pages_SettingsSensors_SettingsSensors_OpensAndClosesASensorWithoutBootstrapJavaScript_Container = document.createElement('div');
    const root: Tests_Pages_SettingsSensors_SettingsSensors_OpensAndClosesASensorWithoutBootstrapJavaScript_Root = createRoot(container);

    document.body.append(container);

    await act(async () => {
      root.render(React.createElement(SensorHarness));

      return;
    });

    const button: Tests_Pages_SettingsSensors_SettingsSensors_OpensAndClosesASensorWithoutBootstrapJavaScript_Button = container.querySelector('.accordion-button');
    const panel: Tests_Pages_SettingsSensors_SettingsSensors_OpensAndClosesASensorWithoutBootstrapJavaScript_Panel = container.querySelector('.accordion-collapse');

    if (button === null || panel === null) {
      throw new Error('The sensor accordion did not render.');
    }

    expect(button.getAttribute('aria-expanded')).toBe('false');

    expect(panel.hasAttribute('hidden')).toBe(true);

    await act(async () => {
      button.click();

      return;
    });

    expect(button.getAttribute('aria-expanded')).toBe('true');

    expect(panel.hasAttribute('hidden')).toBe(false);

    await act(async () => {
      button.click();

      return;
    });

    expect(button.getAttribute('aria-expanded')).toBe('false');

    expect(panel.hasAttribute('hidden')).toBe(true);

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
