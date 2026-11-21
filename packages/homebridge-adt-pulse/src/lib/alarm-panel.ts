import { ADTPulseAPI } from './api.js';

import type {
  Lib_AlarmPanel_CreateAlarmPanel_Config,
  Lib_AlarmPanel_CreateAlarmPanel_InternalConfig,
  Lib_AlarmPanel_CreateAlarmPanel_Returns,
} from '../types/lib/alarm-panel.d.ts';

/**
 * Lib - Alarm Panel - Create Alarm Panel.
 *
 * Builds the alarm panel backend the platform talks to. This is the one place
 * the ADT Pulse portal driver is constructed for the running plugin.
 *
 * @param {Lib_AlarmPanel_CreateAlarmPanel_Config}         config         - Config.
 * @param {Lib_AlarmPanel_CreateAlarmPanel_InternalConfig} internalConfig - Internal config.
 *
 * @returns {Lib_AlarmPanel_CreateAlarmPanel_Returns}
 *
 * @since 3.5.11
 */
export function createAlarmPanel(config: Lib_AlarmPanel_CreateAlarmPanel_Config, internalConfig: Lib_AlarmPanel_CreateAlarmPanel_InternalConfig): Lib_AlarmPanel_CreateAlarmPanel_Returns {
  return new ADTPulseAPI(config, internalConfig);
}
