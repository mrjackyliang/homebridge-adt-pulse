import { createHash, randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import os from 'node:os';
import util from 'node:util';

import axios from 'axios';
import chalk from 'chalk';
import { Categories } from 'homebridge';
import { JSDOM } from 'jsdom';
import _ from 'lodash';
import { DateTime } from 'luxon';
import semver from 'semver';

import {
  collectionDoSubmitHandlers,
  collectionOrbSecurityButtons,
  deviceGateways,
  deviceSecurityPanels,
  itemPanelStatusNotes,
  itemPanelStatusStates,
  itemPanelStatusStatuses,
} from './items.js';
import {
  characterBackslashDoubleQuote,
  characterBackslashForwardSlash,
  characterHtmlLineBreak,
  characterWhitespace,
  functionDoSubmit,
  functionGoToUrl,
  functionSetArmState,
  paramSat,
  textOrbSensorZone,
  textOrbTextSummarySections,
  textSyncCode,
} from './regex.js';

import type {
  Lib_Utility_ClearHtmlLineBreak_Data,
  Lib_Utility_ClearHtmlLineBreak_Returns,
  Lib_Utility_ClearWhitespace_Data,
  Lib_Utility_ClearWhitespace_Returns,
  Lib_Utility_CondensePanelStates_Characteristic,
  Lib_Utility_CondensePanelStates_Condensed,
  Lib_Utility_CondensePanelStates_PanelStates,
  Lib_Utility_CondensePanelStates_Returns,
  Lib_Utility_CondenseSensorType_Condensed,
  Lib_Utility_CondenseSensorType_Returns,
  Lib_Utility_CondenseSensorType_SensorType,
  Lib_Utility_ConvertPanelCharacteristicValue_Characteristic,
  Lib_Utility_ConvertPanelCharacteristicValue_Mode,
  Lib_Utility_ConvertPanelCharacteristicValue_Returns,
  Lib_Utility_ConvertPanelCharacteristicValue_Value,
  Lib_Utility_CreateTrustedDeviceName_InstanceName,
  Lib_Utility_CreateTrustedDeviceName_Prefix,
  Lib_Utility_CreateTrustedDeviceName_Returns,
  Lib_Utility_DebugLog_Caller,
  Lib_Utility_DebugLog_Logger,
  Lib_Utility_DebugLog_LogMessage,
  Lib_Utility_DebugLog_Message,
  Lib_Utility_DebugLog_Returns,
  Lib_Utility_DebugLog_Type,
  Lib_Utility_FetchErrorMessage_Jsdom,
  Lib_Utility_FetchErrorMessage_Response,
  Lib_Utility_FetchErrorMessage_Returns,
  Lib_Utility_FetchErrorMessage_WarnMessage,
  Lib_Utility_FetchMissingSatCode_Response,
  Lib_Utility_FetchMissingSatCode_Returns,
  Lib_Utility_FetchMissingSatCode_SatCode,
  Lib_Utility_FetchTableCells_CollectedNodes,
  Lib_Utility_FetchTableCells_CurrentNode,
  Lib_Utility_FetchTableCells_CurrentNodeCleaned,
  Lib_Utility_FetchTableCells_IncrementedNode,
  Lib_Utility_FetchTableCells_IncrementedNodeCleaned,
  Lib_Utility_FetchTableCells_IncrementFrom,
  Lib_Utility_FetchTableCells_IncrementTo,
  Lib_Utility_FetchTableCells_Matched,
  Lib_Utility_FetchTableCells_MatchItems,
  Lib_Utility_FetchTableCells_NewIncrementFrom,
  Lib_Utility_FetchTableCells_NewIncrementTo,
  Lib_Utility_FetchTableCells_NodeElements,
  Lib_Utility_FetchTableCells_Returns,
  Lib_Utility_FindGatewayManufacturerModel_Manufacturer,
  Lib_Utility_FindGatewayManufacturerModel_Mode,
  Lib_Utility_FindGatewayManufacturerModel_Model,
  Lib_Utility_FindGatewayManufacturerModel_NewManufacturer,
  Lib_Utility_FindGatewayManufacturerModel_NewModel,
  Lib_Utility_FindGatewayManufacturerModel_Returns,
  Lib_Utility_FindIndexWithValue_Array,
  Lib_Utility_FindIndexWithValue_Condition,
  Lib_Utility_FindIndexWithValue_Index,
  Lib_Utility_FindIndexWithValue_Returns,
  Lib_Utility_FindIndexWithValue_Value,
  Lib_Utility_FindNullKeys_CurrentKey,
  Lib_Utility_FindNullKeys_Found,
  Lib_Utility_FindNullKeys_ParentKey,
  Lib_Utility_FindNullKeys_Properties,
  Lib_Utility_FindNullKeys_Property,
  Lib_Utility_FindNullKeys_PropertyKey,
  Lib_Utility_FindNullKeys_Returns,
  Lib_Utility_FindPanelManufacturer_ManufacturerProvider,
  Lib_Utility_FindPanelManufacturer_Returns,
  Lib_Utility_FindPanelManufacturer_TypeModel,
  Lib_Utility_GenerateHash_Data,
  Lib_Utility_GenerateHash_Returns,
  Lib_Utility_GenerateHash_StaticData,
  Lib_Utility_GetAccessoryCategory_DeviceCategory,
  Lib_Utility_GetAccessoryCategory_Returns,
  Lib_Utility_GetDetectReportUrl_Returns,
  Lib_Utility_GetPackageVersion_PackageJson,
  Lib_Utility_GetPackageVersion_Require,
  Lib_Utility_GetPackageVersion_Returns,
  Lib_Utility_GetPluralForm_Count,
  Lib_Utility_GetPluralForm_Plural,
  Lib_Utility_GetPluralForm_Returns,
  Lib_Utility_GetPluralForm_Singular,
  Lib_Utility_IsEmptyOrbTextSummary_Input,
  Lib_Utility_IsEmptyOrbTextSummary_Match,
  Lib_Utility_IsEmptyOrbTextSummary_Returns,
  Lib_Utility_IsForwardSlashOS_CurrentOS,
  Lib_Utility_IsForwardSlashOS_Returns,
  Lib_Utility_IsMaintenancePeriod_EndTime,
  Lib_Utility_IsMaintenancePeriod_Now,
  Lib_Utility_IsMaintenancePeriod_Returns,
  Lib_Utility_IsMaintenancePeriod_StartTime,
  Lib_Utility_IsPanelAlarmActive_HasDisarmedTroubleButtons,
  Lib_Utility_IsPanelAlarmActive_IgnoreSensorProblem,
  Lib_Utility_IsPanelAlarmActive_OrbSecurityButtonButtonText,
  Lib_Utility_IsPanelAlarmActive_OrbSecurityButtons,
  Lib_Utility_IsPanelAlarmActive_PanelStatuses,
  Lib_Utility_IsPanelAlarmActive_Returns,
  Lib_Utility_IsPluginOutdated_CurrentVersion,
  Lib_Utility_IsPluginOutdated_FetchedVersion,
  Lib_Utility_IsPluginOutdated_Response,
  Lib_Utility_IsPluginOutdated_ResponseData,
  Lib_Utility_IsPluginOutdated_Returns,
  Lib_Utility_IsPortalSyncCode_SyncCode,
  Lib_Utility_IsPortalSyncCode_TypeGuard,
  Lib_Utility_IsSessionCleanState_OrbSecurityButtons,
  Lib_Utility_IsSessionCleanState_ReadyButton,
  Lib_Utility_IsSessionCleanState_Returns,
  Lib_Utility_IsUnknownDoSubmitHandlerCollection_CurrentHandlerCollection,
  Lib_Utility_IsUnknownDoSubmitHandlerCollection_Handlers,
  Lib_Utility_IsUnknownDoSubmitHandlerCollection_Returns,
  Lib_Utility_IsUnknownGatewayDevice_CurrentGateway,
  Lib_Utility_IsUnknownGatewayDevice_Gateway,
  Lib_Utility_IsUnknownGatewayDevice_Returns,
  Lib_Utility_IsUnknownOrbSecurityButtonCollection_Buttons,
  Lib_Utility_IsUnknownOrbSecurityButtonCollection_CurrentButtonCollection,
  Lib_Utility_IsUnknownOrbSecurityButtonCollection_Returns,
  Lib_Utility_IsUnknownPanelDevice_CurrentPanel,
  Lib_Utility_IsUnknownPanelDevice_Panel,
  Lib_Utility_IsUnknownPanelDevice_Returns,
  Lib_Utility_ParseArmDisarmMessage_Element,
  Lib_Utility_ParseArmDisarmMessage_Returns,
  Lib_Utility_ParseDoSubmitHandlers_Elements,
  Lib_Utility_ParseDoSubmitHandlers_Handlers,
  Lib_Utility_ParseDoSubmitHandlers_OnClick,
  Lib_Utility_ParseDoSubmitHandlers_RelativeUrl,
  Lib_Utility_ParseDoSubmitHandlers_Returns,
  Lib_Utility_ParseDoSubmitHandlers_UrlParamsArm,
  Lib_Utility_ParseDoSubmitHandlers_UrlParamsArmState,
  Lib_Utility_ParseDoSubmitHandlers_UrlParamsHref,
  Lib_Utility_ParseDoSubmitHandlers_UrlParamsSat,
  Lib_Utility_ParseMultiFactorMethods_Methods,
  Lib_Utility_ParseMultiFactorMethods_MfaPropertyId,
  Lib_Utility_ParseMultiFactorMethods_MfaPropertyLabel,
  Lib_Utility_ParseMultiFactorMethods_MfaPropertyType,
  Lib_Utility_ParseMultiFactorMethods_Response,
  Lib_Utility_ParseMultiFactorMethods_Returns,
  Lib_Utility_ParseMultiFactorTrustedDevices_Devices,
  Lib_Utility_ParseMultiFactorTrustedDevices_Response,
  Lib_Utility_ParseMultiFactorTrustedDevices_Returns,
  Lib_Utility_ParseMultiFactorTrustedDevices_TrustedDeviceId,
  Lib_Utility_ParseMultiFactorTrustedDevices_TrustedDeviceName,
  Lib_Utility_ParseOrbSecurityButtons_ButtonId,
  Lib_Utility_ParseOrbSecurityButtons_ButtonIndex,
  Lib_Utility_ParseOrbSecurityButtons_Buttons,
  Lib_Utility_ParseOrbSecurityButtons_ChangeAccessCode,
  Lib_Utility_ParseOrbSecurityButtons_Disabled,
  Lib_Utility_ParseOrbSecurityButtons_Elements,
  Lib_Utility_ParseOrbSecurityButtons_Id,
  Lib_Utility_ParseOrbSecurityButtons_LoadingText,
  Lib_Utility_ParseOrbSecurityButtons_OnClick,
  Lib_Utility_ParseOrbSecurityButtons_PendingButtonText,
  Lib_Utility_ParseOrbSecurityButtons_ReadyButtonText,
  Lib_Utility_ParseOrbSecurityButtons_RelativeUrl,
  Lib_Utility_ParseOrbSecurityButtons_Returns,
  Lib_Utility_ParseOrbSecurityButtons_TotalButtons,
  Lib_Utility_ParseOrbSecurityButtons_UrlParamsArm,
  Lib_Utility_ParseOrbSecurityButtons_UrlParamsArmState,
  Lib_Utility_ParseOrbSecurityButtons_UrlParamsHref,
  Lib_Utility_ParseOrbSecurityButtons_UrlParamsSat,
  Lib_Utility_ParseOrbSecurityButtons_Value,
  Lib_Utility_ParseOrbSensors_Canvas,
  Lib_Utility_ParseOrbSensors_CanvasIcon,
  Lib_Utility_ParseOrbSensors_CleanedIcon,
  Lib_Utility_ParseOrbSensors_CleanedName,
  Lib_Utility_ParseOrbSensors_CleanedStatuses,
  Lib_Utility_ParseOrbSensors_CleanedZone,
  Lib_Utility_ParseOrbSensors_Elements,
  Lib_Utility_ParseOrbSensors_Name,
  Lib_Utility_ParseOrbSensors_NameText,
  Lib_Utility_ParseOrbSensors_Returns,
  Lib_Utility_ParseOrbSensors_Sensors,
  Lib_Utility_ParseOrbSensors_Status,
  Lib_Utility_ParseOrbSensors_StatusText,
  Lib_Utility_ParseOrbSensors_Zone,
  Lib_Utility_ParseOrbSensors_ZoneText,
  Lib_Utility_ParseOrbTextSummary_CleanedNode,
  Lib_Utility_ParseOrbTextSummary_Element,
  Lib_Utility_ParseOrbTextSummary_FinalParsed,
  Lib_Utility_ParseOrbTextSummary_NoteItem,
  Lib_Utility_ParseOrbTextSummary_RawSections,
  Lib_Utility_ParseOrbTextSummary_Returns,
  Lib_Utility_ParseOrbTextSummary_StateItem,
  Lib_Utility_ParseOrbTextSummary_StatusItem,
  Lib_Utility_ParseSensorsTable_AtSensorsSection,
  Lib_Utility_ParseSensorsTable_CleanedDeviceId,
  Lib_Utility_ParseSensorsTable_CleanedDeviceType,
  Lib_Utility_ParseSensorsTable_CleanedName,
  Lib_Utility_ParseSensorsTable_CleanedStatus,
  Lib_Utility_ParseSensorsTable_CleanedTitle,
  Lib_Utility_ParseSensorsTable_CleanedZone,
  Lib_Utility_ParseSensorsTable_CondensedType,
  Lib_Utility_ParseSensorsTable_ConfigSensors,
  Lib_Utility_ParseSensorsTable_DeviceId,
  Lib_Utility_ParseSensorsTable_DeviceType,
  Lib_Utility_ParseSensorsTable_DeviceTypeText,
  Lib_Utility_ParseSensorsTable_ElementCount,
  Lib_Utility_ParseSensorsTable_Elements,
  Lib_Utility_ParseSensorsTable_Icon,
  Lib_Utility_ParseSensorsTable_IconTitle,
  Lib_Utility_ParseSensorsTable_InformationSensors,
  Lib_Utility_ParseSensorsTable_Name,
  Lib_Utility_ParseSensorsTable_NameText,
  Lib_Utility_ParseSensorsTable_Onclick,
  Lib_Utility_ParseSensorsTable_Returns,
  Lib_Utility_ParseSensorsTable_Sensors,
  Lib_Utility_ParseSensorsTable_Title,
  Lib_Utility_ParseSensorsTable_TitleText,
  Lib_Utility_ParseSensorsTable_Type,
  Lib_Utility_ParseSensorsTable_Zone,
  Lib_Utility_ParseSensorsTable_ZoneText,
  Lib_Utility_RemovePersonalIdentifiableInformation_Data,
  Lib_Utility_RemovePersonalIdentifiableInformation_Object,
  Lib_Utility_RemovePersonalIdentifiableInformation_RedactedKeys,
  Lib_Utility_RemovePersonalIdentifiableInformation_ReplacementText,
  Lib_Utility_RemovePersonalIdentifiableInformation_ReplaceValue,
  Lib_Utility_RemovePersonalIdentifiableInformation_ReplaceValue_ModifiedObject,
  Lib_Utility_RemovePersonalIdentifiableInformation_ReplaceValue_Returns,
  Lib_Utility_RemovePersonalIdentifiableInformation_ReplaceValue_Value,
  Lib_Utility_RemovePersonalIdentifiableInformation_Returns,
  Lib_Utility_Sleep_Milliseconds,
  Lib_Utility_Sleep_Returns,
  Lib_Utility_StackTracer_Error,
  Lib_Utility_StackTracer_Returns,
  Lib_Utility_StackTracer_StringError,
  Lib_Utility_StackTracer_Type,
} from '../types/lib/utility.d.ts';

/**
 * Lib - Utility - Create Trusted Device Name.
 *
 * Combines the Homebridge instance label with a random UUID. The label is
 * bounded so the complete name fits the portal's 100-character limit.
 *
 * @param {string} instanceName - Instance name.
 *
 * @returns {Lib_Utility_CreateTrustedDeviceName_Returns}
 *
 * @since 3.5.0
 */
export function createTrustedDeviceName(instanceName: Lib_Utility_CreateTrustedDeviceName_InstanceName): Lib_Utility_CreateTrustedDeviceName_Returns {
  const prefix: Lib_Utility_CreateTrustedDeviceName_Prefix = (instanceName.trim() || 'Homebridge').slice(0, 63);

  return `${prefix}.${randomUUID()}`;
}

/**
 * Lib - Utility - Clear HTML Line Break.
 *
 * Replaces HTML line break tags with spaces so scraped portal markup can be
 * read as a single line of text before further processing.
 *
 * @param {Lib_Utility_ClearHtmlLineBreak_Data} data - Data.
 *
 * @returns {Lib_Utility_ClearHtmlLineBreak_Returns}
 *
 * @since 1.0.0
 */
export function clearHtmlLineBreak(data: Lib_Utility_ClearHtmlLineBreak_Data): Lib_Utility_ClearHtmlLineBreak_Returns {
  return data.replace(new RegExp(characterHtmlLineBreak, 'g'), ' ').trim();
}

/**
 * Lib - Utility - Clear Whitespace.
 *
 * Collapses consecutive whitespace characters into single spaces so text
 * scraped from the portal compares reliably against known values.
 *
 * @param {Lib_Utility_ClearWhitespace_Data} data - Data.
 *
 * @returns {Lib_Utility_ClearWhitespace_Returns}
 *
 * @since 1.0.0
 */
export function clearWhitespace(data: Lib_Utility_ClearWhitespace_Data): Lib_Utility_ClearWhitespace_Returns {
  return data.replace(new RegExp(characterWhitespace, 'g'), ' ').trim();
}

/**
 * Lib - Utility - Condense Panel States.
 *
 * Maps the scraped list of panel states to the matching HomeKit arm value and
 * characteristic pair so the plugin can sync accessories with the portal.
 *
 * @param {Lib_Utility_CondensePanelStates_Characteristic} characteristic - Characteristic.
 * @param {Lib_Utility_CondensePanelStates_PanelStates}    panelStates    - Panel states.
 *
 * @returns {Lib_Utility_CondensePanelStates_Returns}
 *
 * @since 1.0.0
 */
export function condensePanelStates(characteristic: Lib_Utility_CondensePanelStates_Characteristic, panelStates: Lib_Utility_CondensePanelStates_PanelStates): Lib_Utility_CondensePanelStates_Returns {
  let condensed: Lib_Utility_CondensePanelStates_Condensed = undefined;

  // Only detect panel states used for arming/disarming system.
  switch (true) {
    case panelStates.includes('Armed Away'): {
      condensed = {
        armValue: 'away',
        characteristicValue: {
          current: characteristic.SecuritySystemCurrentState.AWAY_ARM,
          target: characteristic.SecuritySystemTargetState.AWAY_ARM,
        },
      };
      break;
    }

    case panelStates.includes('Armed Night'): {
      condensed = {
        armValue: 'night',
        characteristicValue: {
          current: characteristic.SecuritySystemCurrentState.NIGHT_ARM,
          target: characteristic.SecuritySystemTargetState.NIGHT_ARM,
        },
      };
      break;
    }

    case panelStates.includes('Armed Stay'): {
      condensed = {
        armValue: 'stay',
        characteristicValue: {
          current: characteristic.SecuritySystemCurrentState.STAY_ARM,
          target: characteristic.SecuritySystemTargetState.STAY_ARM,
        },
      };
      break;
    }

    case panelStates.includes('Disarmed'): {
      condensed = {
        armValue: 'off',
        characteristicValue: {
          current: characteristic.SecuritySystemCurrentState.DISARMED,
          target: characteristic.SecuritySystemTargetState.DISARM,
        },
      };
      break;
    }

    default: {
      break;
    }
  }

  return condensed;
}

/**
 * Lib - Utility - Condense Sensor Type.
 *
 * Maps the verbose sensor type shown in the portal to the short identifier
 * used throughout the plugin configuration and accessory setup.
 *
 * @param {Lib_Utility_CondenseSensorType_SensorType} sensorType - Sensor type.
 *
 * @returns {Lib_Utility_CondenseSensorType_Returns}
 *
 * @since 1.0.0
 */
export function condenseSensorType(sensorType: Lib_Utility_CondenseSensorType_SensorType): Lib_Utility_CondenseSensorType_Returns {
  let condensed: Lib_Utility_CondenseSensorType_Condensed = undefined;

  // Sort by "condensed" first, then switch cases, both in alphabet order.
  switch (sensorType) {
    case 'Carbon Monoxide Detector': {
      condensed = 'co';
      break;
    }

    case 'Door/Window Sensor':
    case 'Door Sensor':
    case 'Window Sensor': {
      condensed = 'doorWindow';
      break;
    }

    case 'Fire (Smoke/Heat) Detector': {
      condensed = 'fire';
      break;
    }

    case 'Water/Flood Sensor': {
      condensed = 'flood';
      break;
    }

    case 'Glass Break Detector': {
      condensed = 'glass';
      break;
    }

    case 'Heat (Rate-of-Rise) Detector': {
      condensed = 'heat';
      break;
    }

    case 'Motion Sensor':
    case 'Motion Sensor (Notable Events Only)': {
      condensed = 'motion';
      break;
    }

    case 'Shock Sensor': {
      condensed = 'shock';
      break;
    }

    case 'Temperature Sensor': {
      condensed = 'temperature';
      break;
    }

    default: {
      break;
    }
  }

  return condensed;
}

/**
 * Lib - Utility - Convert Panel Characteristic Value.
 *
 * Translates a security system characteristic value between the current and
 * target state formats because HomeKit uses different constants for each.
 *
 * @param {Lib_Utility_ConvertPanelCharacteristicValue_Mode}           mode           - Mode.
 * @param {Lib_Utility_ConvertPanelCharacteristicValue_Characteristic} characteristic - Characteristic.
 * @param {Lib_Utility_ConvertPanelCharacteristicValue_Value}          value          - Value.
 *
 * @returns {Lib_Utility_ConvertPanelCharacteristicValue_Returns}
 *
 * @since 1.0.0
 */
export function convertPanelCharacteristicValue(mode: Lib_Utility_ConvertPanelCharacteristicValue_Mode, characteristic: Lib_Utility_ConvertPanelCharacteristicValue_Characteristic, value: Lib_Utility_ConvertPanelCharacteristicValue_Value): Lib_Utility_ConvertPanelCharacteristicValue_Returns {
  switch (true) {
    case mode === 'current-to-target' && value === characteristic.SecuritySystemCurrentState.AWAY_ARM: {
      return characteristic.SecuritySystemTargetState.AWAY_ARM;
    }

    case mode === 'current-to-target' && value === characteristic.SecuritySystemCurrentState.STAY_ARM: {
      return characteristic.SecuritySystemTargetState.STAY_ARM;
    }

    case mode === 'current-to-target' && value === characteristic.SecuritySystemCurrentState.NIGHT_ARM: {
      return characteristic.SecuritySystemTargetState.NIGHT_ARM;
    }

    case mode === 'current-to-target' && value === characteristic.SecuritySystemCurrentState.DISARMED: {
      return characteristic.SecuritySystemTargetState.DISARM;
    }

    case mode === 'target-to-current' && value === characteristic.SecuritySystemTargetState.AWAY_ARM: {
      return characteristic.SecuritySystemCurrentState.AWAY_ARM;
    }

    case mode === 'target-to-current' && value === characteristic.SecuritySystemTargetState.STAY_ARM: {
      return characteristic.SecuritySystemCurrentState.STAY_ARM;
    }

    case mode === 'target-to-current' && value === characteristic.SecuritySystemTargetState.NIGHT_ARM: {
      return characteristic.SecuritySystemCurrentState.NIGHT_ARM;
    }

    case mode === 'target-to-current' && value === characteristic.SecuritySystemTargetState.DISARM: {
      return characteristic.SecuritySystemCurrentState.DISARMED;
    }

    default: {
      return undefined;
    }
  }
}

/**
 * Lib - Utility - Debug Log.
 *
 * Centralizes debug output so every message is consistently styled and routed
 * to the Homebridge logger when available or the console otherwise.
 *
 * @param {Lib_Utility_DebugLog_Logger}  logger  - Logger.
 * @param {Lib_Utility_DebugLog_Caller}  caller  - Caller.
 * @param {Lib_Utility_DebugLog_Type}    type    - Type.
 * @param {Lib_Utility_DebugLog_Message} message - Message.
 *
 * @returns {Lib_Utility_DebugLog_Returns}
 *
 * @since 1.0.0
 */
export function debugLog(logger: Lib_Utility_DebugLog_Logger, caller: Lib_Utility_DebugLog_Caller, type: Lib_Utility_DebugLog_Type, message: Lib_Utility_DebugLog_Message): Lib_Utility_DebugLog_Returns {
  const logMessage: Lib_Utility_DebugLog_LogMessage = chalk.reset(chalk.underline(caller), '-', message, '...');

  switch (type) {
    case 'error': {
      if (logger !== null) {
        logger.error(chalk.gray('DEBUG'), chalk.redBright('ERROR:'), logMessage);
      } else {
        console.error('[ADT Pulse]', chalk.redBright('ERROR:'), logMessage);
      }
      break;
    }

    case 'warn': {
      if (logger !== null) {
        logger.warn(chalk.gray('DEBUG'), chalk.yellowBright('WARNING:'), logMessage);
      } else {
        console.warn('[ADT Pulse]', chalk.yellowBright('WARNING:'), logMessage);
      }
      break;
    }

    case 'success': {
      if (logger !== null) {
        logger.info(chalk.gray('DEBUG'), chalk.greenBright('SUCCESS:'), logMessage);
      } else {
        console.info('[ADT Pulse]', chalk.greenBright('SUCCESS:'), logMessage);
      }
      break;
    }

    case 'info': {
      if (logger !== null) {
        logger.info(chalk.gray('DEBUG'), chalk.blueBright('INFO:'), logMessage);
      } else {
        console.info('[ADT Pulse]', chalk.blueBright('INFO:'), logMessage);
      }
      break;
    }

    default: {
      break;
    }
  }

  return;
}

/**
 * Lib - Utility - Fetch Error Message.
 *
 * Extracts the warning message displayed on the portal sign-in page so login
 * failures can be reported with the exact reason shown to users.
 *
 * @param {Lib_Utility_FetchErrorMessage_Response} response - Response.
 *
 * @returns {Lib_Utility_FetchErrorMessage_Returns}
 *
 * @since 1.0.0
 */
export function fetchErrorMessage(response: Lib_Utility_FetchErrorMessage_Response): Lib_Utility_FetchErrorMessage_Returns {
  if (response === undefined || typeof response.data !== 'string') {
    return null;
  }

  // Parse the response (normally it should be the sign-in page).
  const jsdom: Lib_Utility_FetchErrorMessage_Jsdom = new JSDOM(
    response.data,
    {
      url: response.config.url,
      referrer: response.config.headers['Referer'],
      contentType: 'text/html',
      pretendToBeVisual: true,
    },
  );

  // Find the warn message contents.
  const warnMessage: Lib_Utility_FetchErrorMessage_WarnMessage = jsdom.window.document.querySelector('#warnMsgContents');

  if (warnMessage !== null) {
    return clearWhitespace(clearHtmlLineBreak(warnMessage.innerHTML));
  }

  return null;
}

/**
 * Lib - Utility - Fetch Missing Sat Code.
 *
 * Recovers the sat code from the raw response body when it is not exposed
 * through the usual elements, keeping arm and disarm requests working.
 *
 * @param {Lib_Utility_FetchMissingSatCode_Response} response - Response.
 *
 * @returns {Lib_Utility_FetchMissingSatCode_Returns}
 *
 * @since 1.0.0
 */
export function fetchMissingSatCode(response: Lib_Utility_FetchMissingSatCode_Response): Lib_Utility_FetchMissingSatCode_Returns {
  if (typeof response.data !== 'string') {
    return null;
  }

  // Find the sat code.
  const satCode: Lib_Utility_FetchMissingSatCode_SatCode = response.data.match(paramSat);

  /**
   * Original matches for the sat code.
   *
   * Matches include "sat=3b59d412-0dcb-41fb-b925-3fcfe3144633" and
   * "3b59d412-0dcb-41fb-b925-3fcfe3144633", so only the sat code is stored.
   * It is loosely matched to take unexpected changes into account.
   *
   * @since 1.0.0
   */
  if (satCode !== null && satCode.length >= 2) {
    return satCode[1]!;
  }

  return null;
}

/**
 * Lib - Utility - Fetch Table Cells.
 *
 * Collects the values of table cells that follow a matched label so device
 * information laid out in loose HTML tables can be read as key-value pairs.
 *
 * @param {Lib_Utility_FetchTableCells_NodeElements}  nodeElements  - Node elements.
 * @param {Lib_Utility_FetchTableCells_MatchItems}    matchItems    - Match items.
 * @param {Lib_Utility_FetchTableCells_IncrementFrom} incrementFrom - Increment from.
 * @param {Lib_Utility_FetchTableCells_IncrementTo}   incrementTo   - Increment to.
 *
 * @returns {Lib_Utility_FetchTableCells_Returns}
 *
 * @since 1.0.0
 */
export function fetchTableCells(nodeElements: Lib_Utility_FetchTableCells_NodeElements, matchItems: Lib_Utility_FetchTableCells_MatchItems, incrementFrom: Lib_Utility_FetchTableCells_IncrementFrom, incrementTo: Lib_Utility_FetchTableCells_IncrementTo): Lib_Utility_FetchTableCells_Returns {
  const matched: Lib_Utility_FetchTableCells_Matched = {};

  let newIncrementFrom: Lib_Utility_FetchTableCells_NewIncrementFrom = incrementFrom;
  let newIncrementTo: Lib_Utility_FetchTableCells_NewIncrementTo = incrementTo;

  // Prevent negative numbers.
  if (incrementFrom < 0) {
    newIncrementFrom = 0;
  }

  // Prevent numbers smaller than "incrementFrom".
  if (incrementTo < incrementFrom) {
    newIncrementTo = incrementFrom;
  }

  nodeElements.forEach((nodeElement, nodeElementKey) => {
    const currentNode: Lib_Utility_FetchTableCells_CurrentNode = nodeElement.textContent;

    if (currentNode === null) {
      return;
    }

    const currentNodeCleaned: Lib_Utility_FetchTableCells_CurrentNodeCleaned = clearWhitespace(currentNode);
    const collectedNodes: Lib_Utility_FetchTableCells_CollectedNodes = [];

    if (matchItems.includes(currentNodeCleaned) === false) {
      return;
    }

    /**
     * Capture all table cells within the increment range.
     *
     * Cells from "match index + incrementFrom" to "match index + incrementTo"
     * are collected, skipping null or empty content, then organized under the
     * current matched list value.
     *
     * @since 1.0.0
     */
    for (let i = newIncrementFrom; i <= newIncrementTo; i += 1) {
      if (nodeElementKey + i >= nodeElements.length) {
        break;
      }

      const incrementedNode: Lib_Utility_FetchTableCells_IncrementedNode = nodeElements[nodeElementKey + i]!.textContent;

      // Be aware, this checks for "incrementedNode" not "currentNode"
      if (incrementedNode !== null) {
        const incrementedNodeCleaned: Lib_Utility_FetchTableCells_IncrementedNodeCleaned = clearWhitespace(incrementedNode);

        // If content of "incrementedNode" is not empty.
        if (incrementedNodeCleaned !== '') {
          collectedNodes.push(incrementedNodeCleaned);
        }
      }
    }

    // If the current node is not empty.
    if (collectedNodes.length > 0) {
      Reflect.set(matched, currentNodeCleaned, collectedNodes);
    }

    return;
  });

  return matched;
}

/**
 * Lib - Utility - Find Gateway Manufacturer Model.
 *
 * Rewrites generic gateway manufacturer and model names into their real
 * branding so accessories show accurate information inside HomeKit.
 *
 * @param {Lib_Utility_FindGatewayManufacturerModel_Mode}         mode         - Mode.
 * @param {Lib_Utility_FindGatewayManufacturerModel_Manufacturer} manufacturer - Manufacturer.
 * @param {Lib_Utility_FindGatewayManufacturerModel_Model}        model        - Model.
 *
 * @returns {Lib_Utility_FindGatewayManufacturerModel_Returns}
 *
 * @since 1.0.0
 */
export function findGatewayManufacturerModel(mode: Lib_Utility_FindGatewayManufacturerModel_Mode, manufacturer: Lib_Utility_FindGatewayManufacturerModel_Manufacturer, model: Lib_Utility_FindGatewayManufacturerModel_Model): Lib_Utility_FindGatewayManufacturerModel_Returns {
  let newManufacturer: Lib_Utility_FindGatewayManufacturerModel_NewManufacturer = manufacturer;
  let newModel: Lib_Utility_FindGatewayManufacturerModel_NewModel = model;

  switch (true) {
    case manufacturer === 'ADT Pulse Gateway' && model === 'iHub-3001': {
      newManufacturer = 'iControl';
      newModel = 'ADT Pulse Gateway iHub-3001';
      break;
    }

    case manufacturer === 'ADT Pulse Gateway' && model === 'PGZNG1': {
      newManufacturer = 'NETGEAR';
      newModel = 'ADT Pulse Gateway PGZNG1';
      break;
    }

    case manufacturer === null && model === 'Compact SMA Protocol Gateway': {
      newManufacturer = 'iControl';
      newModel = 'Compact SMA Protocol Gateway';
      break;
    }

    case manufacturer === null && model === 'Lynx/QuickConnect Cellular-Only Gateway': {
      newManufacturer = 'Ademco/ADT';
      newModel = 'Lynx/QuickConnect Cellular-Only Gateway';
      break;
    }

    default: {
      break;
    }
  }

  return (mode === 'manufacturer') ? newManufacturer : newModel;
}

/**
 * Lib - Utility - Find Index With Value.
 *
 * Works like the built-in findIndex method but also returns the matched value
 * so callers do not need to look up the array a second time.
 *
 * @param {Lib_Utility_FindIndexWithValue_Array}     array     - Array.
 * @param {Lib_Utility_FindIndexWithValue_Condition} condition - Condition.
 *
 * @returns {Lib_Utility_FindIndexWithValue_Returns}
 *
 * @since 1.0.0
 */
export function findIndexWithValue<Value>(array: Lib_Utility_FindIndexWithValue_Array<Value>, condition: Lib_Utility_FindIndexWithValue_Condition<Value>): Lib_Utility_FindIndexWithValue_Returns<Value> {
  let index: Lib_Utility_FindIndexWithValue_Index = -1;
  let value: Lib_Utility_FindIndexWithValue_Value<Value> = undefined;

  for (let i = 0; i < array.length; i += 1) {
    // If the current iteration matches the condition given, return that.
    if (condition(array[i]!) === true) {
      index = i;
      value = array[i];

      break;
    }
  }

  return {
    index,
    value,
  };
}

/**
 * Lib - Utility - Find Null Keys.
 *
 * Recursively walks an object and records the dot-notated paths of keys set
 * to null or undefined so incomplete configurations can be reported.
 *
 * @param {Lib_Utility_FindNullKeys_Properties} properties - Properties.
 * @param {Lib_Utility_FindNullKeys_ParentKey}  parentKey  - Parent key.
 *
 * @returns {Lib_Utility_FindNullKeys_Returns}
 *
 * @since 1.0.0
 */
export function findNullKeys(properties: Lib_Utility_FindNullKeys_Properties, parentKey: Lib_Utility_FindNullKeys_ParentKey = ''): Lib_Utility_FindNullKeys_Returns {
  const found: Lib_Utility_FindNullKeys_Found = [];

  Object.entries(properties).forEach((propertyEntry) => {
    const propertyKey: Lib_Utility_FindNullKeys_PropertyKey = propertyEntry[0];
    const property: Lib_Utility_FindNullKeys_Property = propertyEntry[1];
    const currentKey: Lib_Utility_FindNullKeys_CurrentKey = (parentKey !== '') ? `${parentKey}.${propertyKey}` : propertyKey;

    if (_.isPlainObject(property) === true) {
      found.push(...findNullKeys(property as Lib_Utility_FindNullKeys_Properties, currentKey));
    } else if (property === null || property === undefined) {
      found.push(currentKey);
    }

    return;
  });

  return found;
}

/**
 * Lib - Utility - Find Panel Manufacturer.
 *
 * Determines the security panel manufacturer from the provider field when
 * available, falling back to known type and model combinations.
 *
 * @param {Lib_Utility_FindPanelManufacturer_ManufacturerProvider} manufacturerProvider - Manufacturer provider.
 * @param {Lib_Utility_FindPanelManufacturer_TypeModel}            typeModel            - Type model.
 *
 * @returns {Lib_Utility_FindPanelManufacturer_Returns}
 *
 * @since 1.0.0
 */
export function findPanelManufacturer(manufacturerProvider: Lib_Utility_FindPanelManufacturer_ManufacturerProvider, typeModel: Lib_Utility_FindPanelManufacturer_TypeModel): Lib_Utility_FindPanelManufacturer_Returns {
  if (manufacturerProvider !== null) {
    return manufacturerProvider;
  }

  switch (typeModel) {
    case 'Security Panel - LYNX/QuickConnect': {
      return 'Ademco/ADT';
    }

    default: {
      return null;
    }
  }
}

/**
 * Lib - Utility - Generate Hash.
 *
 * Builds a stable fingerprint of device data with volatile and personal
 * fields omitted so repeated detections of the same device can be deduped.
 *
 * @param {Lib_Utility_GenerateHash_Data} data - Data.
 *
 * @returns {Lib_Utility_GenerateHash_Returns}
 *
 * @since 1.0.0
 */
export function generateHash(data: Lib_Utility_GenerateHash_Data): Lib_Utility_GenerateHash_Returns {
  const staticData: Lib_Utility_GenerateHash_StaticData = _.omit(data, [
    'masterCode',
    'network.broadband.ip',
    'network.broadband.mac',
    'network.device.ip',
    'network.device.mac',
    'network.router.lanIp',
    'network.router.wanIp',
    'rawHtml',
    'response.Broadband LAN IP Address:',
    'response.Broadband LAN MAC:',
    'response.Device LAN IP Address:',
    'response.Device LAN MAC:',
    'response.Last Update:',
    'response.Next Update:',
    'response.Router LAN IP Address:',
    'response.Router WAN IP Address:',
    'response.Security Panel Master Code:',
    'response.Serial Number:',
    'serialNumber',
    'update.last',
    'update.next',
  ]);

  return createHash('sha512').update(JSON.stringify(staticData)).digest('hex');
}

/**
 * Lib - Utility - Get Accessory Category.
 *
 * Converts the plugin's device category names into the matching Homebridge
 * Categories constant used when registering accessories.
 *
 * @param {Lib_Utility_GetAccessoryCategory_DeviceCategory} deviceCategory - Device category.
 *
 * @returns {Lib_Utility_GetAccessoryCategory_Returns}
 *
 * @since 1.0.0
 */
export function getAccessoryCategory(deviceCategory: Lib_Utility_GetAccessoryCategory_DeviceCategory): Lib_Utility_GetAccessoryCategory_Returns {
  switch (deviceCategory) {
    case 'ALARM_SYSTEM': {
      return Categories.ALARM_SYSTEM;
    }

    case 'OTHER': {
      return Categories.OTHER;
    }

    case 'SECURITY_SYSTEM': {
      return Categories.SECURITY_SYSTEM;
    }

    case 'SENSOR': {
      return Categories.SENSOR;
    }

    case 'SWITCH': {
      return Categories.SWITCH;
    }

    default: {
      return Categories.OTHER;
    }
  }
}

/**
 * Lib - Utility - Get Detect Report URL.
 *
 * Provides the endpoint where detection reports for unknown devices and
 * statuses are sent so the plugin author can add support for them.
 *
 * @returns {Lib_Utility_GetDetectReportUrl_Returns}
 *
 * @since 1.0.0
 */
export function getDetectReportUrl(): Lib_Utility_GetDetectReportUrl_Returns {
  return 'https://mhQKf8mFu6LJQtYwRDAc.ntfy.mrjackyliang.com';
}

/**
 * Lib - Utility - Get Package Version.
 *
 * Reads the version straight from package.json so version checks always
 * reflect the installed release without relying on a hardcoded value.
 *
 * @returns {Lib_Utility_GetPackageVersion_Returns}
 *
 * @since 1.0.0
 */
export function getPackageVersion(): Lib_Utility_GetPackageVersion_Returns {
  const require: Lib_Utility_GetPackageVersion_Require = createRequire(import.meta.url);
  const packageJson: Lib_Utility_GetPackageVersion_PackageJson = require('../../package.json');

  return packageJson['version'];
}

/**
 * Lib - Utility - Get Plural Form.
 *
 * Selects the singular or plural word for a count so log messages read
 * naturally without duplicating conditional logic at every call site.
 *
 * @param {Lib_Utility_GetPluralForm_Count}    count    - Count.
 * @param {Lib_Utility_GetPluralForm_Singular} singular - Singular.
 * @param {Lib_Utility_GetPluralForm_Plural}   plural   - Plural.
 *
 * @returns {Lib_Utility_GetPluralForm_Returns}
 *
 * @since 1.0.0
 */
export function getPluralForm(count: Lib_Utility_GetPluralForm_Count, singular: Lib_Utility_GetPluralForm_Singular, plural: Lib_Utility_GetPluralForm_Plural): Lib_Utility_GetPluralForm_Returns {
  if (count === 1) {
    return singular;
  }

  return plural;
}

/**
 * Lib - Utility - Is Empty Orb Text Summary.
 *
 * Checks whether a parsed orb text summary contains no usable data so
 * callers can tell an empty portal response apart from a real one.
 *
 * @param {Lib_Utility_IsEmptyOrbTextSummary_Input} input - Input.
 *
 * @returns {Lib_Utility_IsEmptyOrbTextSummary_Returns}
 *
 * @since 1.0.0
 */
export function isEmptyOrbTextSummary(input: Lib_Utility_IsEmptyOrbTextSummary_Input): Lib_Utility_IsEmptyOrbTextSummary_Returns {
  const match: Lib_Utility_IsEmptyOrbTextSummary_Match = {
    panelStates: [],
    panelStatuses: [],
    panelNotes: [],
    rawData: {
      node: '',
      unknownPieces: [],
    },
  };

  return _.isEqual(match, input);
}

/**
 * Lib - Utility - Is Forward Slash OS.
 *
 * Detects operating systems that use forward slashes in file paths so
 * path-sensitive logic can adjust for Windows-style separators.
 *
 * @returns {Lib_Utility_IsForwardSlashOS_Returns}
 *
 * @since 1.0.0
 */
export function isForwardSlashOS(): Lib_Utility_IsForwardSlashOS_Returns {
  const currentOS: Lib_Utility_IsForwardSlashOS_CurrentOS = os.platform();

  return [
    'aix',
    'android',
    'darwin',
    'freebsd',
    'haiku',
    'linux',
    'openbsd',
    'sunos',
    'netbsd',
  ].includes(currentOS);
}

/**
 * Lib - Utility - Is Maintenance Period.
 *
 * Determines if the current time falls inside the nightly portal maintenance
 * window so failed requests during it are not treated as real errors.
 *
 * @returns {Lib_Utility_IsMaintenancePeriod_Returns}
 *
 * @since 1.0.0
 */
export function isMaintenancePeriod(): Lib_Utility_IsMaintenancePeriod_Returns {
  // Assumes a timezone of "America/Los_Angeles" because Icontrol One headquarters in Redwood City, CA.
  const now: Lib_Utility_IsMaintenancePeriod_Now = DateTime.now().setZone('America/Los_Angeles');

  const startTime: Lib_Utility_IsMaintenancePeriod_StartTime = now.set({
    hour: 22,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const endTime: Lib_Utility_IsMaintenancePeriod_EndTime = now.set({
    hour: 4,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  // Current time is between 10 PM and 4 AM PST.
  return (now >= startTime || now < endTime);
}

/**
 * Lib - Utility - Is Panel Alarm Active.
 *
 * Determines whether the panel is actively alarming by checking the scraped
 * panel statuses, optionally treating sensor problems as active alarms.
 *
 * @param {Lib_Utility_IsPanelAlarmActive_PanelStatuses}       panelStatuses       - Panel statuses.
 * @param {Lib_Utility_IsPanelAlarmActive_OrbSecurityButtons}  orbSecurityButtons  - Orb security buttons.
 * @param {Lib_Utility_IsPanelAlarmActive_IgnoreSensorProblem} ignoreSensorProblem - Ignore sensor problem.
 *
 * @returns {Lib_Utility_IsPanelAlarmActive_Returns}
 *
 * @since 1.0.0
 */
export function isPanelAlarmActive(panelStatuses: Lib_Utility_IsPanelAlarmActive_PanelStatuses, orbSecurityButtons: Lib_Utility_IsPanelAlarmActive_OrbSecurityButtons, ignoreSensorProblem: Lib_Utility_IsPanelAlarmActive_IgnoreSensorProblem): Lib_Utility_IsPanelAlarmActive_Returns {
  const hasDisarmedTroubleButtons: Lib_Utility_IsPanelAlarmActive_HasDisarmedTroubleButtons = orbSecurityButtons.filter((orbSecurityButton) => {
    const orbSecurityButtonButtonText: Lib_Utility_IsPanelAlarmActive_OrbSecurityButtonButtonText = orbSecurityButton['buttonText'];

    return orbSecurityButtonButtonText !== null && [
      'Disarm',
      'Arm Away',
      'Arm Stay',
    ].includes(orbSecurityButtonButtonText);
  }).length === 3;

  return (
    panelStatuses.includes('BURGLARY ALARM')
    || panelStatuses.includes('Carbon Monoxide Alarm')
    || panelStatuses.includes('FIRE ALARM')
    || (
      ignoreSensorProblem === false
      && panelStatuses.includes('Sensor Problem')
      && hasDisarmedTroubleButtons
    )
    || (
      ignoreSensorProblem === false
      && panelStatuses.includes('Sensor Problems')
      && hasDisarmedTroubleButtons
    )
    || panelStatuses.includes('Uncleared Alarm')
    || panelStatuses.includes('WATER ALARM')
  );
}

/**
 * Lib - Utility - Is Plugin Outdated.
 *
 * Compares the installed plugin version against the latest npm release so
 * detect reports coming from outdated installations can be skipped.
 *
 * @returns {Lib_Utility_IsPluginOutdated_Returns}
 *
 * @since 1.0.0
 */
export async function isPluginOutdated(): Lib_Utility_IsPluginOutdated_Returns {
  const currentVersion: Lib_Utility_IsPluginOutdated_CurrentVersion = getPackageVersion();

  try {
    const response: Lib_Utility_IsPluginOutdated_Response = await axios.get(
      'https://registry.npmjs.org/homebridge-adt-pulse/latest',
      {
        family: 4,
        timeout: 5000,
      },
    );
    const responseData: Lib_Utility_IsPluginOutdated_ResponseData = response.data;

    const fetchedVersion: Lib_Utility_IsPluginOutdated_FetchedVersion = (responseData !== undefined && responseData !== null) ? responseData['version'] : undefined;

    // Treat missing/invalid version as outdated to avoid reports from stale installations.
    if (typeof fetchedVersion !== 'string') {
      return true;
    }

    // Check if plugin is outdated.
    return semver.gt(fetchedVersion, currentVersion);
  } catch {
    /* empty */
  }

  // If latest version cannot be parsed, assume plugin is outdated.
  return true;
}

/**
 * Lib - Utility - Is Portal Sync Code.
 *
 * Validates that a string matches the portal sync code format and narrows
 * its type so downstream code can rely on the stricter shape.
 *
 * @param {Lib_Utility_IsPortalSyncCode_SyncCode} syncCode - Sync code.
 *
 * @returns {boolean}
 *
 * @since 1.0.0
 */
export function isPortalSyncCode(syncCode: Lib_Utility_IsPortalSyncCode_SyncCode): syncCode is Lib_Utility_IsPortalSyncCode_TypeGuard {
  return textSyncCode.test(syncCode);
}

/**
 * Lib - Utility - Is Session Clean State.
 *
 * Inspects the orb security buttons to verify the panel is not busy changing
 * state and is not sitting in a state that needs special handling.
 *
 * @param {Lib_Utility_IsSessionCleanState_OrbSecurityButtons} orbSecurityButtons - Orb security buttons.
 *
 * @returns {Lib_Utility_IsSessionCleanState_Returns}
 *
 * @since 1.0.0
 */
export function isSessionCleanState(orbSecurityButtons: Lib_Utility_IsSessionCleanState_OrbSecurityButtons): Lib_Utility_IsSessionCleanState_Returns {
  // When at least 1 security button is disabled, it means the system is busy changing state.
  if (orbSecurityButtons.some((orbSecurityButton) => orbSecurityButton['buttonDisabled']) === true) {
    return false;
  }

  return orbSecurityButtons
    .filter((orbSecurityButton): orbSecurityButton is Lib_Utility_IsSessionCleanState_ReadyButton => orbSecurityButton['buttonDisabled'] === false)
    .every((orbSecurityButton) => [
      'disarmed',
      'disarmed+with+alarm',
      'night+stay',
    ].includes(orbSecurityButton['urlParams']['armState']) === false);
}

/**
 * Lib - Utility - Is Unknown Do Submit Handler Collection.
 *
 * Compares parsed do submit handlers against the known collections so new
 * or changed portal button layouts can be flagged for review.
 *
 * @param {Lib_Utility_IsUnknownDoSubmitHandlerCollection_Handlers} handlers - Handlers.
 *
 * @returns {Lib_Utility_IsUnknownDoSubmitHandlerCollection_Returns}
 *
 * @since 1.0.0
 */
export function isUnknownDoSubmitHandlerCollection(handlers: Lib_Utility_IsUnknownDoSubmitHandlerCollection_Handlers): Lib_Utility_IsUnknownDoSubmitHandlerCollection_Returns {
  const currentHandlerCollection: Lib_Utility_IsUnknownDoSubmitHandlerCollection_CurrentHandlerCollection = handlers.map((handler) => ({
    href: handler['urlParams']['href'],
  }));

  return collectionDoSubmitHandlers
    .map((collectionDoSubmitHandler) => collectionDoSubmitHandler['handlers'])
    .some((collectionDoSubmitHandler) => _.isEqual(collectionDoSubmitHandler, currentHandlerCollection)) === false;
}

/**
 * Lib - Utility - Is Unknown Gateway Device.
 *
 * Compares gateway details against the list of known gateways so
 * unrecognized hardware can be reported and added to the plugin.
 *
 * @param {Lib_Utility_IsUnknownGatewayDevice_Gateway} gateway - Gateway.
 *
 * @returns {Lib_Utility_IsUnknownGatewayDevice_Returns}
 *
 * @since 1.0.0
 */
export function isUnknownGatewayDevice(gateway: Lib_Utility_IsUnknownGatewayDevice_Gateway): Lib_Utility_IsUnknownGatewayDevice_Returns {
  const currentGateway: Lib_Utility_IsUnknownGatewayDevice_CurrentGateway = {
    manufacturer: _.get(gateway, [
      'Manufacturer:',
      0,
    ], null),
    model: _.get(gateway, [
      'Model:',
      0,
    ], null),
    primaryConnectionType: _.get(gateway, [
      'Primary Connection Type:',
      0,
    ], null),
  };

  return deviceGateways
    .map((deviceGateway) => deviceGateway['gateway'])
    .some((deviceGateway) => _.isEqual(deviceGateway, currentGateway)) === false;
}

/**
 * Lib - Utility - Is Unknown Orb Security Button Collection.
 *
 * Compares parsed orb security buttons against known button collections so
 * unrecognized portal layouts can be reported and added to the plugin.
 *
 * @param {Lib_Utility_IsUnknownOrbSecurityButtonCollection_Buttons} buttons - Buttons.
 *
 * @returns {Lib_Utility_IsUnknownOrbSecurityButtonCollection_Returns}
 *
 * @since 1.0.0
 */
export function isUnknownOrbSecurityButtonCollection(buttons: Lib_Utility_IsUnknownOrbSecurityButtonCollection_Buttons): Lib_Utility_IsUnknownOrbSecurityButtonCollection_Returns {
  const currentButtonCollection: Lib_Utility_IsUnknownOrbSecurityButtonCollection_CurrentButtonCollection = buttons.map((button) => ({
    buttonDisabled: button['buttonDisabled'],
    buttonText: button['buttonText'],
    loadingText: ('loadingText' in button) ? button['loadingText'] : null,
  }));

  return collectionOrbSecurityButtons
    .map((collectionOrbSecurityButton) => collectionOrbSecurityButton['buttons'])
    .some((collectionOrbSecurityButton) => _.isEqual(collectionOrbSecurityButton, currentButtonCollection)) === false;
}

/**
 * Lib - Utility - Is Unknown Panel Device.
 *
 * Compares panel details against the list of known security panels so
 * unrecognized hardware can be reported and added to the plugin.
 *
 * @param {Lib_Utility_IsUnknownPanelDevice_Panel} panel - Panel.
 *
 * @returns {Lib_Utility_IsUnknownPanelDevice_Returns}
 *
 * @since 1.0.0
 */
export function isUnknownPanelDevice(panel: Lib_Utility_IsUnknownPanelDevice_Panel): Lib_Utility_IsUnknownPanelDevice_Returns {
  const currentPanel: Lib_Utility_IsUnknownPanelDevice_CurrentPanel = {
    manufacturerProvider: _.get(panel, [
      'Manufacturer/Provider:',
      0,
    ], null),
    typeModel: _.get(panel, [
      'Type/Model:',
      0,
    ], null),
  };

  return deviceSecurityPanels
    .map((deviceSecurityPanel) => deviceSecurityPanel['panel'])
    .some((deviceSecurityPanel) => _.isEqual(deviceSecurityPanel, currentPanel)) === false;
}

/**
 * Lib - Utility - Parse Arm Disarm Message.
 *
 * Extracts and normalizes the confirmation message shown after an arm or
 * disarm request so responses can be matched against expected text.
 *
 * @param {Lib_Utility_ParseArmDisarmMessage_Element} element - Element.
 *
 * @returns {Lib_Utility_ParseArmDisarmMessage_Returns}
 *
 * @since 1.0.0
 */
export function parseArmDisarmMessage(element: Lib_Utility_ParseArmDisarmMessage_Element): Lib_Utility_ParseArmDisarmMessage_Returns {
  if (element === null || element.textContent === null) {
    return null;
  }

  return clearWhitespace(element.textContent);
}

/**
 * Lib - Utility - Parse Do Submit Handlers.
 *
 * Extracts the URLs and parameters wired into the portal's force arm
 * buttons so the plugin can reproduce those requests programmatically.
 *
 * @param {Lib_Utility_ParseDoSubmitHandlers_Elements} elements - Elements.
 *
 * @returns {Lib_Utility_ParseDoSubmitHandlers_Returns}
 *
 * @since 1.0.0
 */
export function parseDoSubmitHandlers(elements: Lib_Utility_ParseDoSubmitHandlers_Elements): Lib_Utility_ParseDoSubmitHandlers_Returns {
  const handlers: Lib_Utility_ParseDoSubmitHandlers_Handlers = [];

  elements.forEach((element) => {
    const onClick: Lib_Utility_ParseDoSubmitHandlers_OnClick = element.getAttribute('onclick');

    // None of the force arm buttons are disabled, so if "onClick" is null, this button is useless.
    if (onClick === null || functionDoSubmit.test(onClick) === false) {
      return;
    }

    const relativeUrl: Lib_Utility_ParseDoSubmitHandlers_RelativeUrl = onClick.replace(functionDoSubmit, '$1') as Lib_Utility_ParseDoSubmitHandlers_RelativeUrl;
    const urlParamsSat: Lib_Utility_ParseDoSubmitHandlers_UrlParamsSat = onClick.replace(functionDoSubmit, '$2');
    const urlParamsHref: Lib_Utility_ParseDoSubmitHandlers_UrlParamsHref = onClick.replace(functionDoSubmit, '$3').replace(new RegExp(characterBackslashForwardSlash, 'g'), '/') as Lib_Utility_ParseDoSubmitHandlers_UrlParamsHref;
    const urlParamsArmState: Lib_Utility_ParseDoSubmitHandlers_UrlParamsArmState = onClick.replace(functionDoSubmit, '$5') as Lib_Utility_ParseDoSubmitHandlers_UrlParamsArmState;
    const urlParamsArm: Lib_Utility_ParseDoSubmitHandlers_UrlParamsArm = onClick.replace(functionDoSubmit, '$6') as Lib_Utility_ParseDoSubmitHandlers_UrlParamsArm;

    handlers.push({
      relativeUrl,
      urlParams: {
        arm: (urlParamsArm !== '') ? urlParamsArm : null,
        armState: (urlParamsArmState !== '') ? urlParamsArmState : null,
        href: urlParamsHref,
        sat: urlParamsSat,
      },
    });

    return;
  });

  return handlers;
}

/**
 * Lib - Utility - Parse Multi Factor Methods.
 *
 * Extracts the available multi-factor verification methods from the portal
 * response so users can choose how to verify their identity.
 *
 * @param {Lib_Utility_ParseMultiFactorMethods_Response} response - Response.
 *
 * @returns {Lib_Utility_ParseMultiFactorMethods_Returns}
 *
 * @since 1.0.0
 */
export function parseMultiFactorMethods(response: Lib_Utility_ParseMultiFactorMethods_Response): Lib_Utility_ParseMultiFactorMethods_Returns {
  const methods: Lib_Utility_ParseMultiFactorMethods_Methods = [];

  // Parse the multi-factor methods.
  response['state']['mfaProperties'].forEach((mfaProperty) => {
    const mfaPropertyId: Lib_Utility_ParseMultiFactorMethods_MfaPropertyId = mfaProperty['id'];
    const mfaPropertyType: Lib_Utility_ParseMultiFactorMethods_MfaPropertyType = mfaProperty['type'];
    const mfaPropertyLabel: Lib_Utility_ParseMultiFactorMethods_MfaPropertyLabel = mfaProperty['label'];

    methods.push({
      id: mfaPropertyId,
      type: mfaPropertyType,
      label: mfaPropertyLabel,
    });

    return;
  });

  return methods;
}

/**
 * Lib - Utility - Parse Multi Factor Trusted Devices.
 *
 * Extracts the trusted devices from the multi-factor portal response so the
 * plugin can confirm whether this machine is already trusted.
 *
 * @param {Lib_Utility_ParseMultiFactorTrustedDevices_Response} response - Response.
 *
 * @returns {Lib_Utility_ParseMultiFactorTrustedDevices_Returns}
 *
 * @since 1.0.0
 */
export function parseMultiFactorTrustedDevices(response: Lib_Utility_ParseMultiFactorTrustedDevices_Response): Lib_Utility_ParseMultiFactorTrustedDevices_Returns {
  const devices: Lib_Utility_ParseMultiFactorTrustedDevices_Devices = [];

  // If "trustedDevices" do not exist, return an empty array.
  if (response['state']['trustedDevices'] === undefined) {
    return devices;
  }

  // Parse the multi-factor trusted devices.
  response['state']['trustedDevices'].forEach((trustedDevice) => {
    const trustedDeviceId: Lib_Utility_ParseMultiFactorTrustedDevices_TrustedDeviceId = trustedDevice['id'];
    const trustedDeviceName: Lib_Utility_ParseMultiFactorTrustedDevices_TrustedDeviceName = trustedDevice['name'];

    devices.push({
      id: trustedDeviceId,
      name: trustedDeviceName,
    });

    return;
  });

  return devices;
}

/**
 * Lib - Utility - Parse Orb Sensors.
 *
 * Extracts sensor names, zones, icons, and statuses from the summary page
 * orb so each sensor can be mapped to its HomeKit accessory.
 *
 * @param {Lib_Utility_ParseOrbSensors_Elements} elements - Elements.
 *
 * @returns {Lib_Utility_ParseOrbSensors_Returns}
 *
 * @since 1.0.0
 */
export function parseOrbSensors(elements: Lib_Utility_ParseOrbSensors_Elements): Lib_Utility_ParseOrbSensors_Returns {
  const sensors: Lib_Utility_ParseOrbSensors_Sensors = [];

  elements.forEach((element) => {
    const canvas: Lib_Utility_ParseOrbSensors_Canvas = element.querySelector('td:nth-child(1) canvas');
    const name: Lib_Utility_ParseOrbSensors_Name = element.querySelector('td:nth-child(3) a.p_deviceNameText');
    const zone: Lib_Utility_ParseOrbSensors_Zone = element.querySelector('td:nth-child(3) span.p_grayNormalText, td:nth-child(3) div.p_grayNormalText');
    const status: Lib_Utility_ParseOrbSensors_Status = element.querySelector('td:nth-child(4)');

    if (
      canvas !== null
      && name !== null
      && zone !== null
      && status !== null
    ) {
      const canvasIcon: Lib_Utility_ParseOrbSensors_CanvasIcon = canvas.getAttribute('icon');
      const nameText: Lib_Utility_ParseOrbSensors_NameText = name.textContent;
      const zoneText: Lib_Utility_ParseOrbSensors_ZoneText = zone.textContent;
      const statusText: Lib_Utility_ParseOrbSensors_StatusText = status.textContent;

      if (
        canvasIcon !== null
        && nameText !== null
        && zoneText !== null
        && zoneText.startsWith('Zone') === true
        && statusText !== null
      ) {
        const cleanedIcon: Lib_Utility_ParseOrbSensors_CleanedIcon = clearWhitespace(canvasIcon) as Lib_Utility_ParseOrbSensors_CleanedIcon;
        const cleanedName: Lib_Utility_ParseOrbSensors_CleanedName = clearWhitespace(nameText);
        const cleanedZone: Lib_Utility_ParseOrbSensors_CleanedZone = Number(clearWhitespace(zoneText).replace(textOrbSensorZone, '$2'));
        const cleanedStatuses: Lib_Utility_ParseOrbSensors_CleanedStatuses = clearWhitespace(statusText).split(', ') as Lib_Utility_ParseOrbSensors_CleanedStatuses;

        /**
         * Only support sensors with zones between 1 and 99.
         *
         * Anything above Zone 99 is mostly a rogue sensor that does not
         * belong to the user, like "KEYPAD #1".
         *
         * @since 1.0.0
         */
        if (
          Number.isNaN(cleanedZone) === true
          || cleanedZone < 1
          || cleanedZone > 99
        ) {
          return;
        }

        sensors.push({
          icon: cleanedIcon,
          name: cleanedName,
          statuses: cleanedStatuses,
          zone: cleanedZone,
        });
      }
    }

    return;
  });

  return sensors.sort((a, b) => a['zone'] - b['zone']);
}

/**
 * Lib - Utility - Parse Orb Text Summary.
 *
 * Splits the orb text summary node into panel states, statuses, and notes so
 * status changes can be tracked, keeping unknown pieces for reporting.
 *
 * @param {Lib_Utility_ParseOrbTextSummary_Element} element - Element.
 *
 * @returns {Lib_Utility_ParseOrbTextSummary_Returns}
 *
 * @since 1.0.0
 */
export function parseOrbTextSummary(element: Lib_Utility_ParseOrbTextSummary_Element): Lib_Utility_ParseOrbTextSummary_Returns {
  if (element === null || element.textContent === null) {
    return {
      panelStates: [],
      panelStatuses: [],
      panelNotes: [],
      rawData: {
        node: '',
        unknownPieces: [],
      },
    };
  }

  const cleanedNode: Lib_Utility_ParseOrbTextSummary_CleanedNode = clearWhitespace(element.textContent);
  const rawSections: Lib_Utility_ParseOrbTextSummary_RawSections = cleanedNode.split(textOrbTextSummarySections).filter(Boolean).map((section) => section.split(', '));
  const finalParsed: Lib_Utility_ParseOrbTextSummary_FinalParsed = {
    panelStates: [],
    panelStatuses: [],
    panelNotes: [],
    rawData: {
      node: cleanedNode,
      unknownPieces: [],
    },
  };

  // Match the sections and organize them to where they belong.
  for (let i = 0; i < rawSections.length; i += 1) {
    for (let j = 0; j < rawSections[i]!.length; j += 1) {
      // Don't forget, we are matching arrays against strings here; "rawSections[i][j]" is a string not an array.
      switch (true) {
        case itemPanelStatusStates.includes(<Lib_Utility_ParseOrbTextSummary_StateItem>rawSections[i]![j]): {
          finalParsed['panelStates'].push(<Lib_Utility_ParseOrbTextSummary_StateItem>rawSections[i]![j]);
          break;
        }

        case itemPanelStatusStatuses.includes(<Lib_Utility_ParseOrbTextSummary_StatusItem>rawSections[i]![j]): {
          finalParsed['panelStatuses'].push(<Lib_Utility_ParseOrbTextSummary_StatusItem>rawSections[i]![j]);
          break;
        }

        case itemPanelStatusNotes.includes(<Lib_Utility_ParseOrbTextSummary_NoteItem>rawSections[i]![j]): {
          finalParsed['panelNotes'].push(<Lib_Utility_ParseOrbTextSummary_NoteItem>rawSections[i]![j]);
          break;
        }

        default: {
          finalParsed['rawData']['unknownPieces'].push(rawSections[i]![j]!);
          break;
        }
      }
    }
  }

  return finalParsed;
}

/**
 * Lib - Utility - Parse Orb Security Buttons.
 *
 * Extracts both pending and ready security buttons with their URL params
 * from the summary page so arm and disarm actions can be replayed.
 *
 * @param {Lib_Utility_ParseOrbSecurityButtons_Elements} elements - Elements.
 *
 * @returns {Lib_Utility_ParseOrbSecurityButtons_Returns}
 *
 * @since 1.0.0
 */
export function parseOrbSecurityButtons(elements: Lib_Utility_ParseOrbSecurityButtons_Elements): Lib_Utility_ParseOrbSecurityButtons_Returns {
  const buttons: Lib_Utility_ParseOrbSecurityButtons_Buttons = [];

  elements.forEach((element) => {
    const disabled: Lib_Utility_ParseOrbSecurityButtons_Disabled = element.getAttribute('disabled');
    const id: Lib_Utility_ParseOrbSecurityButtons_Id = element.getAttribute('id');
    const value: Lib_Utility_ParseOrbSecurityButtons_Value = element.getAttribute('value');
    const onClick: Lib_Utility_ParseOrbSecurityButtons_OnClick = element.getAttribute('onclick');

    // Type asserted variables for both pending (disabled) and ready (enabled) buttons.
    const buttonId: Lib_Utility_ParseOrbSecurityButtons_ButtonId = id as Lib_Utility_ParseOrbSecurityButtons_ButtonId;

    // There is a pending (disabled) button displayed.
    if (disabled !== null && onClick === null) {
      const pendingButtonText: Lib_Utility_ParseOrbSecurityButtons_PendingButtonText = value as Lib_Utility_ParseOrbSecurityButtons_PendingButtonText;

      buttons.push({
        buttonDisabled: true,
        buttonId,
        buttonText: pendingButtonText,
      });

      return;
    }

    // There is a ready (enabled) button displayed.
    if (
      disabled === null
      && onClick !== null
      && functionSetArmState.test(onClick) === true
    ) {
      const readyButtonText: Lib_Utility_ParseOrbSecurityButtons_ReadyButtonText = value as Lib_Utility_ParseOrbSecurityButtons_ReadyButtonText;

      const relativeUrl: Lib_Utility_ParseOrbSecurityButtons_RelativeUrl = onClick.replace(functionSetArmState, '$1') as Lib_Utility_ParseOrbSecurityButtons_RelativeUrl;
      const loadingText: Lib_Utility_ParseOrbSecurityButtons_LoadingText = onClick.replace(functionSetArmState, '$2') as Lib_Utility_ParseOrbSecurityButtons_LoadingText;
      const buttonIndex: Lib_Utility_ParseOrbSecurityButtons_ButtonIndex = Number(onClick.replace(functionSetArmState, '$3'));
      const totalButtons: Lib_Utility_ParseOrbSecurityButtons_TotalButtons = Number(onClick.replace(functionSetArmState, '$4'));
      const changeAccessCode: Lib_Utility_ParseOrbSecurityButtons_ChangeAccessCode = onClick.replace(functionSetArmState, '$5') === 'true';
      const urlParamsHref: Lib_Utility_ParseOrbSecurityButtons_UrlParamsHref = onClick.replace(functionSetArmState, '$6') as Lib_Utility_ParseOrbSecurityButtons_UrlParamsHref;
      const urlParamsArmState: Lib_Utility_ParseOrbSecurityButtons_UrlParamsArmState = onClick.replace(functionSetArmState, '$7') as Lib_Utility_ParseOrbSecurityButtons_UrlParamsArmState;
      const urlParamsArm: Lib_Utility_ParseOrbSecurityButtons_UrlParamsArm = onClick.replace(functionSetArmState, '$8') as Lib_Utility_ParseOrbSecurityButtons_UrlParamsArm;
      const urlParamsSat: Lib_Utility_ParseOrbSecurityButtons_UrlParamsSat = onClick.replace(functionSetArmState, '$9');

      buttons.push({
        buttonDisabled: false,
        buttonId,
        buttonIndex,
        buttonText: readyButtonText,
        changeAccessCode,
        loadingText,
        relativeUrl,
        totalButtons,
        urlParams: {
          arm: urlParamsArm,
          armState: urlParamsArmState,
          href: urlParamsHref,
          sat: urlParamsSat,
        },
      });
    }

    return;
  });

  return buttons;
}

/**
 * Lib - Utility - Parse Sensors Table.
 *
 * Extracts sensor rows from the system devices table, shaping each entry
 * for config generation or information display based on the mode.
 *
 * @param {Lib_Utility_ParseSensorsTable_Type}     type     - Type.
 * @param {Lib_Utility_ParseSensorsTable_Elements} elements - Elements.
 *
 * @returns {Lib_Utility_ParseSensorsTable_Returns}
 *
 * @since 1.0.0
 */
export function parseSensorsTable(type: Lib_Utility_ParseSensorsTable_Type, elements: Lib_Utility_ParseSensorsTable_Elements): Lib_Utility_ParseSensorsTable_Returns {
  const sensors: Lib_Utility_ParseSensorsTable_Sensors = [];

  let atSensorsSection: Lib_Utility_ParseSensorsTable_AtSensorsSection = false;

  elements.forEach((element) => {
    const elementCount: Lib_Utility_ParseSensorsTable_ElementCount = element.childElementCount;
    const title: Lib_Utility_ParseSensorsTable_Title = element.querySelector('td.p_listRow h2.p_boldNormalText');

    // If we are looking at a row that is a sensor.
    if (atSensorsSection === true) {
      // This is a blank row, and it means we are done fetching all sensors.
      if (title === null && elementCount === 1) {
        atSensorsSection = false;

        // Don't proceed further.
        return;
      }

      const onclick: Lib_Utility_ParseSensorsTable_Onclick = element.getAttribute('onclick');
      const icon: Lib_Utility_ParseSensorsTable_Icon = element.querySelector('td:nth-child(1) canvas');
      const name: Lib_Utility_ParseSensorsTable_Name = element.querySelector('td:nth-child(2) a');
      const zone: Lib_Utility_ParseSensorsTable_Zone = element.querySelector('td:nth-child(3)');
      const deviceType: Lib_Utility_ParseSensorsTable_DeviceType = element.querySelector('td:nth-child(5)');

      if (
        onclick !== null
        && icon !== null
        && name !== null
        && zone !== null
        && deviceType !== null
      ) {
        const deviceId: Lib_Utility_ParseSensorsTable_DeviceId = onclick.replace(functionGoToUrl, '$1');
        const iconTitle: Lib_Utility_ParseSensorsTable_IconTitle = icon.getAttribute('title');
        const nameText: Lib_Utility_ParseSensorsTable_NameText = name.textContent;
        const zoneText: Lib_Utility_ParseSensorsTable_ZoneText = zone.textContent;
        const deviceTypeText: Lib_Utility_ParseSensorsTable_DeviceTypeText = deviceType.textContent;

        if (
          iconTitle !== null
          && nameText !== null
          && zoneText !== null
          && deviceTypeText !== null
        ) {
          const cleanedDeviceId: Lib_Utility_ParseSensorsTable_CleanedDeviceId = Number(clearWhitespace(deviceId));
          const cleanedDeviceType: Lib_Utility_ParseSensorsTable_CleanedDeviceType = clearWhitespace(deviceTypeText) as Lib_Utility_ParseSensorsTable_CleanedDeviceType;
          const cleanedName: Lib_Utility_ParseSensorsTable_CleanedName = clearWhitespace(nameText);
          const cleanedStatus: Lib_Utility_ParseSensorsTable_CleanedStatus = clearWhitespace(iconTitle) as Lib_Utility_ParseSensorsTable_CleanedStatus;
          const cleanedZone: Lib_Utility_ParseSensorsTable_CleanedZone = Number(clearWhitespace(zoneText));

          // These devices are not supported because they do not display a status in the summary page.
          if ([
            'System/Supervisory',
            'Unknown Device Type',
            'Unknown Device Type (Notable Events Only)',
          ].includes(cleanedDeviceType) === true) {
            return;
          }

          // Generate a different sensor object based on the type.
          if (type === 'sensors-config') {
            const condensedType: Lib_Utility_ParseSensorsTable_CondensedType = condenseSensorType(cleanedDeviceType);

            if (condensedType !== undefined) {
              (sensors as Lib_Utility_ParseSensorsTable_ConfigSensors).push({
                adtName: cleanedName,
                adtZone: cleanedZone,
                adtType: condensedType,
              });
            }
          } else {
            (sensors as Lib_Utility_ParseSensorsTable_InformationSensors).push({
              deviceId: cleanedDeviceId,
              deviceType: cleanedDeviceType,
              name: cleanedName,
              status: cleanedStatus,
              zone: cleanedZone,
            });
          }
        }
      }
    }

    // If we are looking at a row that isn't a sensor.
    if (atSensorsSection === false) {
      // This is a title row, and on the next row, we begin capturing sensors information.
      if (title !== null && elementCount === 1) {
        const titleText: Lib_Utility_ParseSensorsTable_TitleText = title.textContent;

        if (titleText !== null) {
          const cleanedTitle: Lib_Utility_ParseSensorsTable_CleanedTitle = clearWhitespace(titleText);

          if (cleanedTitle === 'Sensors') {
            atSensorsSection = true;
          }
        }
      }
    }

    return;
  });

  if (type === 'sensors-config') {
    return (sensors as Lib_Utility_ParseSensorsTable_ConfigSensors).sort((a, b) => a['adtZone'] - b['adtZone']);
  }

  return (sensors as Lib_Utility_ParseSensorsTable_InformationSensors).sort((a, b) => a['zone'] - b['zone']);
}

/**
 * Lib - Utility - Remove Personal Identifiable Information.
 *
 * Deep clones logged objects while masking values under keys known to hold
 * personal information so debug output stays safe to share.
 *
 * @param {Lib_Utility_RemovePersonalIdentifiableInformation_Data} data - Data.
 *
 * @returns {Lib_Utility_RemovePersonalIdentifiableInformation_Returns}
 *
 * @since 1.0.0
 */
export function removePersonalIdentifiableInformation(data: Lib_Utility_RemovePersonalIdentifiableInformation_Data): Lib_Utility_RemovePersonalIdentifiableInformation_Returns {
  const redactedKeys: Lib_Utility_RemovePersonalIdentifiableInformation_RedactedKeys = [
    'Broadband LAN IP Address:',
    'Broadband LAN MAC:',
    'Device LAN IP Address:',
    'Device LAN MAC:',
    'ip',
    'Last Update:',
    'lanIp',
    'last',
    'mac',
    'masterCode',
    'Next Update:',
    'next',
    'Router LAN IP Address:',
    'Router WAN IP Address:',
    'sat',
    'Security Panel Master Code:',
    'serial',
    'serialNumber',
    'Serial Number:',
    'wanIp',
  ];
  const replacementText: Lib_Utility_RemovePersonalIdentifiableInformation_ReplacementText = '*** REDACTED FOR PRIVACY ***';

  /**
   * Lib - Utility - Remove Personal Identifiable Information - Replace Value.
   *
   * Recursively rebuilds an object, swapping values under redacted keys with
   * placeholder text while leaving all other values untouched.
   *
   * @param {Lib_Utility_RemovePersonalIdentifiableInformation_Object} object - Object.
   *
   * @returns {Lib_Utility_RemovePersonalIdentifiableInformation_ReplaceValue_Returns}
   *
   * @since 1.0.0
   */
  const replaceValue: Lib_Utility_RemovePersonalIdentifiableInformation_ReplaceValue = (object: Lib_Utility_RemovePersonalIdentifiableInformation_Object): Lib_Utility_RemovePersonalIdentifiableInformation_ReplaceValue_Returns => {
    const modifiedObject: Lib_Utility_RemovePersonalIdentifiableInformation_ReplaceValue_ModifiedObject = {};

    Object.keys(object).forEach((key) => {
      const value: Lib_Utility_RemovePersonalIdentifiableInformation_ReplaceValue_Value = object[key];

      if (_.isPlainObject(value) === true) {
        Reflect.set(modifiedObject, key, replaceValue(value as Lib_Utility_RemovePersonalIdentifiableInformation_Object));
      } else if (Array.isArray(value) === true) {
        Reflect.set(modifiedObject, key, value.map((item) => {
          if (_.isPlainObject(item) === true) {
            return replaceValue(item);
          }

          if (redactedKeys.includes(key) === true) {
            return replacementText;
          }

          return item;
        }));
      } else if (redactedKeys.includes(key) === true) {
        Reflect.set(modifiedObject, key, replacementText);
      } else {
        Reflect.set(modifiedObject, key, value);
      }

      return;
    });

    return modifiedObject;
  };

  if (Array.isArray(data) === true) {
    return data.map(replaceValue);
  }

  return replaceValue(data);
}

/**
 * Lib - Utility - Sleep.
 *
 * Pauses async execution for the given number of milliseconds so requests
 * can be spaced out to mimic natural portal usage.
 *
 * @param {Lib_Utility_Sleep_Milliseconds} milliseconds - Milliseconds.
 *
 * @returns {Lib_Utility_Sleep_Returns}
 *
 * @since 1.0.0
 */
export async function sleep(milliseconds: Lib_Utility_Sleep_Milliseconds): Lib_Utility_Sleep_Returns {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);

    return;
  });
}

/**
 * Lib - Utility - Stack Tracer.
 *
 * Serializes errors of various shapes into readable text and prints them so
 * users can include meaningful traces in bug reports.
 *
 * @param {Lib_Utility_StackTracer_Type}  type  - Type.
 * @param {Lib_Utility_StackTracer_Error} error - Error.
 *
 * @returns {Lib_Utility_StackTracer_Returns}
 *
 * @since 1.0.0
 */
export function stackTracer(type: Lib_Utility_StackTracer_Type, error: Lib_Utility_StackTracer_Error): Lib_Utility_StackTracer_Returns {
  let stringError: Lib_Utility_StackTracer_StringError = undefined;

  switch (type) {
    case 'api-response':
    case 'config-content':
    case 'detect-content':
    case 'fake-ready-buttons':
    case 'log-status-changes':
    case 'serialize-error': {
      stringError = util.inspect(error, {
        showHidden: false,
        depth: Infinity,
        colors: false,
      });
      break;
    }

    case 'zod-error': {
      stringError = JSON.stringify(error, null, 2).replace(new RegExp(characterBackslashDoubleQuote, 'g'), '\'');
      break;
    }

    default: {
      break;
    }
  }

  console.error(chalk.yellowBright(stringError));

  return;
}
