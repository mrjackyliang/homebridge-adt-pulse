import type { Root } from 'react-dom/client';
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';

import type { platformConfig } from '../../../../../../packages/homebridge-adt-pulse/src/lib/schema';

/**
 * Tests - Pages - Settings Sensors - Sensor Harness.
 *
 * @since 3.5.0
 */
export type Tests_Pages_SettingsSensors_SensorHarness_Values = z.input<typeof platformConfig>;

export type Tests_Pages_SettingsSensors_SensorHarness_Form = UseFormReturn<Tests_Pages_SettingsSensors_SensorHarness_Values>;

/**
 * Tests - Pages - Settings Sensors - Settings Sensors - Opens And Closes Sensor Without Bootstrap JavaScript.
 *
 * @since 3.5.0
 */
export type Tests_Pages_SettingsSensors_SettingsSensors_OpensAndClosesASensorWithoutBootstrapJavaScript_Container = HTMLDivElement;

export type Tests_Pages_SettingsSensors_SettingsSensors_OpensAndClosesASensorWithoutBootstrapJavaScript_Root = Root;

export type Tests_Pages_SettingsSensors_SettingsSensors_OpensAndClosesASensorWithoutBootstrapJavaScript_Button = HTMLButtonElement | null;

export type Tests_Pages_SettingsSensors_SettingsSensors_OpensAndClosesASensorWithoutBootstrapJavaScript_Panel = Element | null;
