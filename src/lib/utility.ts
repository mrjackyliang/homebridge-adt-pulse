import chalk from 'chalk';
import { Categories } from 'homebridge';
import { JSDOM } from 'jsdom';
import latestVersion from 'latest-version';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import os from 'node:os';
import util from 'node:util';
import semver from 'semver';

import {
  collectionDoSubmitHandlers,
  collectionOrbSecurityButtons,
  deviceGateways,
  deviceSecurityPanels,
  itemPanelStatusNotes,
  itemPanelStatusStates,
  itemPanelStatusStatuses,
} from '@/lib/items.js';
import {
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
} from '@/lib/regex.js';
import type {
  ClearHtmlLineBreakData,
  ClearHtmlLineBreakReturns,
  ClearWhitespaceData,
  ClearWhitespaceReturns,
  CondensePanelStatesCharacteristic,
  CondensePanelStatesCondensed,
  CondensePanelStatesPanelStates,
  CondensePanelStatesReturns,
  CondenseSensorTypeCondensed,
  CondenseSensorTypeReturns,
  CondenseSensorTypeSensorType,
  ConvertPanelCharacteristicValueCharacteristic,
  ConvertPanelCharacteristicValueMode,
  ConvertPanelCharacteristicValueReturns,
  ConvertPanelCharacteristicValueValue,
  DebugLogCaller,
  DebugLogLogger,
  DebugLogMessage,
  DebugLogReturns,
  DebugLogType,
  FetchErrorMessageResponse,
  FetchErrorMessageReturns,
  FetchMissingSatCodeResponse,
  FetchMissingSatCodeReturns,
  FetchTableCellsIncrementFrom,
  FetchTableCellsIncrementTo,
  FetchTableCellsMatched,
  FetchTableCellsMatchItems,
  FetchTableCellsNodeElements,
  FetchTableCellsReturns,
  FindGatewayManufacturerModelManufacturer,
  FindGatewayManufacturerModelMode,
  FindGatewayManufacturerModelModel,
  FindGatewayManufacturerModelReturns,
  FindIndexWithValueArray,
  FindIndexWithValueCondition,
  FindIndexWithValueReturns,
  FindNullKeysFound,
  FindNullKeysParentKey,
  FindNullKeysProperties,
  FindNullKeysReturns,
  FindPanelManufacturerManufacturerProvider,
  FindPanelManufacturerReturns,
  FindPanelManufacturerTypeModel,
  GenerateHashData,
  GenerateHashReturns,
  GetAccessoryCategoryDeviceCategory,
  GetAccessoryCategoryReturns,
  GetDetectReportUrlReturns,
  GetPackageVersionReturns,
  GetPluralFormCount,
  GetPluralFormPlural,
  GetPluralFormReturns,
  GetPluralFormSingular,
  IsEmptyOrbTextSummaryInput,
  IsEmptyOrbTextSummaryMatch,
  IsEmptyOrbTextSummaryReturns,
  IsForwardSlashOSReturns,
  IsMaintenancePeriodReturns,
  IsPanelAlarmActiveIgnoreSensorProblem,
  IsPanelAlarmActiveOrbSecurityButtons,
  IsPanelAlarmActivePanelStatuses,
  IsPanelAlarmActiveReturns,
  IsPluginOutdatedReturns,
  IsPortalSyncCodeSyncCode,
  IsPortalSyncCodeTypeGuard,
  IsSessionCleanStateOrbSecurityButtons,
  IsSessionCleanStateReadyButton,
  IsSessionCleanStateReturns,
  IsUnknownDoSubmitHandlerCollectionHandlers,
  IsUnknownDoSubmitHandlerCollectionReturns,
  IsUnknownGatewayDeviceGateway,
  IsUnknownGatewayDeviceReturns,
  IsUnknownOrbSecurityButtonCollectionButtons,
  IsUnknownOrbSecurityButtonCollectionReturns,
  IsUnknownPanelDevicePanel,
  IsUnknownPanelDeviceReturns,
  ParseArmDisarmMessageElement,
  ParseArmDisarmMessageReturns,
  ParseDoSubmitHandlersElements,
  ParseDoSubmitHandlersHandlers,
  ParseDoSubmitHandlersRelativeUrl,
  ParseDoSubmitHandlersReturns,
  ParseDoSubmitHandlersUrlParamsArm,
  ParseDoSubmitHandlersUrlParamsArmState,
  ParseDoSubmitHandlersUrlParamsHref,
  ParseMultiFactorMethodsMethods,
  ParseMultiFactorMethodsResponse,
  ParseMultiFactorMethodsReturns,
  ParseMultiFactorTrustedDevicesDevices,
  ParseMultiFactorTrustedDevicesResponse,
  ParseMultiFactorTrustedDevicesReturns,
  ParseOrbSecurityButtonsArm,
  ParseOrbSecurityButtonsArmState,
  ParseOrbSecurityButtonsButtonId,
  ParseOrbSecurityButtonsButtons,
  ParseOrbSecurityButtonsElements,
  ParseOrbSecurityButtonsHref,
  ParseOrbSecurityButtonsLoadingText,
  ParseOrbSecurityButtonsPendingButtonText,
  ParseOrbSecurityButtonsReadyButtonText,
  ParseOrbSecurityButtonsRelativeUrl,
  ParseOrbSecurityButtonsReturns,
  ParseOrbSensorsCleanedIcon,
  ParseOrbSensorsCleanedStatuses,
  ParseOrbSensorsElements,
  ParseOrbSensorsReturns,
  ParseOrbSensorsSensors,
  ParseOrbSensorsTableDeviceType,
  ParseOrbSensorsTableElements,
  ParseOrbSensorsTableReturns,
  ParseOrbSensorsTableSensors,
  ParseOrbSensorsTableStatus,
  ParseOrbSensorsTableType,
  ParseOrbTextSummaryElement,
  ParseOrbTextSummaryFinalParsed,
  ParseOrbTextSummaryNoteItem,
  ParseOrbTextSummaryReturns,
  ParseOrbTextSummaryStateItem,
  ParseOrbTextSummaryStatusItem,
  RemovePersonalIdentifiableInformationData,
  RemovePersonalIdentifiableInformationModifiedObject,
  RemovePersonalIdentifiableInformationReplaceValueObject,
  RemovePersonalIdentifiableInformationReplaceValueReturns,
  RemovePersonalIdentifiableInformationReturns,
  SleepMilliseconds,
  SleepReturns,
  StackTracerError,
  StackTracerReturns,
  StackTracerType,
} from '@/types/index.d.ts';

/**
 * Clear html line break.
 *
 * @param {ClearHtmlLineBreakData} data - Data.
 *
 * @returns {ClearHtmlLineBreakReturns}
 *
 * @since 1.0.0
 */
export function clearHtmlLineBreak(data: ClearHtmlLineBreakData): ClearHtmlLineBreakReturns {
  return data.replace(characterHtmlLineBreak, ' ').trim();
}

/**
 * Clear whitespace.
 *
 * @param {ClearWhitespaceData} data - Data.
 *
 * @returns {ClearWhitespaceReturns}
 *
 * @since 1.0.0
 */
export function clearWhitespace(data: ClearWhitespaceData): ClearWhitespaceReturns {
  return data.replace(characterWhitespace, ' ').trim();
}

/**
 * Condense panel states.
 *
 * @param {CondensePanelStatesCharacteristic} characteristic - Characteristic.
 * @param {CondensePanelStatesPanelStates}    panelStates    - Panel states.
 *
 * @returns {CondensePanelStatesReturns}
 *
 * @since 1.0.0
 */
export function condensePanelStates(characteristic: CondensePanelStatesCharacteristic, panelStates: CondensePanelStatesPanelStates): CondensePanelStatesReturns {
  let condensed: CondensePanelStatesCondensed;

  // Only detect panel states used for arming/disarming system.
  switch (true) {
    case panelStates.includes('Armed Away'):
      condensed = {
        armValue: 'away',
        characteristicValue: {
          current: characteristic.SecuritySystemCurrentState.AWAY_ARM,
          target: characteristic.SecuritySystemTargetState.AWAY_ARM,
        },
      };
      break;
    case panelStates.includes('Armed Night'):
      condensed = {
        armValue: 'night',
        characteristicValue: {
          current: characteristic.SecuritySystemCurrentState.NIGHT_ARM,
          target: characteristic.SecuritySystemTargetState.NIGHT_ARM,
        },
      };
      break;
    case panelStates.includes('Armed Stay'):
      condensed = {
        armValue: 'stay',
        characteristicValue: {
          current: characteristic.SecuritySystemCurrentState.STAY_ARM,
          target: characteristic.SecuritySystemTargetState.STAY_ARM,
        },
      };
      break;
    case panelStates.includes('Disarmed'):
      condensed = {
        armValue: 'off',
        characteristicValue: {
          current: characteristic.SecuritySystemCurrentState.DISARMED,
          target: characteristic.SecuritySystemTargetState.DISARM,
        },
      };
      break;
    default:
      break;
  }

  return condensed;
}

/**
 * Condense sensor type.
 *
 * @param {CondenseSensorTypeSensorType} sensorType - Sensor type.
 *
 * @returns {CondenseSensorTypeReturns}
 *
 * @since 1.0.0
 */
export function condenseSensorType(sensorType: CondenseSensorTypeSensorType): CondenseSensorTypeReturns {
  let condensed: CondenseSensorTypeCondensed;

  // Sort by "condensed" first, then switch cases, both in alphabet order.
  switch (sensorType) {
    case 'Carbon Monoxide Detector':
      condensed = 'co';
      break;
    case 'Door/Window Sensor':
    case 'Door Sensor':
    case 'Window Sensor':
      condensed = 'doorWindow';
      break;
    case 'Fire (Smoke/Heat) Detector':
      condensed = 'fire';
      break;
    case 'Water/Flood Sensor':
      condensed = 'flood';
      break;
    case 'Glass Break Detector':
      condensed = 'glass';
      break;
    case 'Heat (Rate-of-Rise) Detector':
      condensed = 'heat';
      break;
    case 'Motion Sensor':
    case 'Motion Sensor (Notable Events Only)':
      condensed = 'motion';
      break;
    case 'Shock Sensor':
      condensed = 'shock';
      break;
    case 'Temperature Sensor':
      condensed = 'temperature';
      break;
    default:
      break;
  }

  return condensed;
}

/**
 * Convert panel characteristic value.
 *
 * @param {ConvertPanelCharacteristicValueMode}           mode           - Mode.
 * @param {ConvertPanelCharacteristicValueCharacteristic} characteristic - Characteristic.
 * @param {ConvertPanelCharacteristicValueValue}          value          - Value.
 *
 * @returns {ConvertPanelCharacteristicValueReturns}
 *
 * @since 1.0.0
 */
export function convertPanelCharacteristicValue(mode: ConvertPanelCharacteristicValueMode, characteristic: ConvertPanelCharacteristicValueCharacteristic, value: ConvertPanelCharacteristicValueValue): ConvertPanelCharacteristicValueReturns {
  switch (true) {
    case mode === 'current-to-target' && value === characteristic.SecuritySystemCurrentState.AWAY_ARM:
      return characteristic.SecuritySystemTargetState.AWAY_ARM;
    case mode === 'current-to-target' && value === characteristic.SecuritySystemCurrentState.STAY_ARM:
      return characteristic.SecuritySystemTargetState.STAY_ARM;
    case mode === 'current-to-target' && value === characteristic.SecuritySystemCurrentState.NIGHT_ARM:
      return characteristic.SecuritySystemTargetState.NIGHT_ARM;
    case mode === 'current-to-target' && value === characteristic.SecuritySystemCurrentState.DISARMED:
      return characteristic.SecuritySystemTargetState.DISARM;
    case mode === 'target-to-current' && value === characteristic.SecuritySystemTargetState.AWAY_ARM:
      return characteristic.SecuritySystemCurrentState.AWAY_ARM;
    case mode === 'target-to-current' && value === characteristic.SecuritySystemTargetState.STAY_ARM:
      return characteristic.SecuritySystemCurrentState.STAY_ARM;
    case mode === 'target-to-current' && value === characteristic.SecuritySystemTargetState.NIGHT_ARM:
      return characteristic.SecuritySystemCurrentState.NIGHT_ARM;
    case mode === 'target-to-current' && value === characteristic.SecuritySystemTargetState.DISARM:
      return characteristic.SecuritySystemCurrentState.DISARMED;
    default:
      return undefined;
  }
}

/**
 * Debug log.
 *
 * @param {DebugLogLogger}  logger  - Logger.
 * @param {DebugLogCaller}  caller  - Caller.
 * @param {DebugLogType}    type    - Type.
 * @param {DebugLogMessage} message - Message.
 *
 * @returns {DebugLogReturns}
 *
 * @since 1.0.0
 */
export function debugLog(logger: DebugLogLogger, caller: DebugLogCaller, type: DebugLogType, message: DebugLogMessage): DebugLogReturns {
  const logMessage = chalk.reset(chalk.underline(caller), '-', message, '...');

  switch (type) {
    case 'error':
      if (logger !== null) {
        logger.error(chalk.gray('DEBUG'), chalk.redBright('ERROR:'), logMessage);
      } else {
        console.error('[ADT Pulse]', chalk.redBright('ERROR:'), logMessage);
      }
      break;
    case 'warn':
      if (logger !== null) {
        logger.warn(chalk.gray('DEBUG'), chalk.yellowBright('WARNING:'), logMessage);
      } else {
        console.warn('[ADT Pulse]', chalk.yellowBright('WARNING:'), logMessage);
      }
      break;
    case 'success':
      if (logger !== null) {
        logger.info(chalk.gray('DEBUG'), chalk.greenBright('SUCCESS:'), logMessage);
      } else {
        console.info('[ADT Pulse]', chalk.greenBright('SUCCESS:'), logMessage);
      }
      break;
    case 'info':
      if (logger !== null) {
        logger.info(chalk.gray('DEBUG'), chalk.blueBright('INFO:'), logMessage);
      } else {
        console.info('[ADT Pulse]', chalk.blueBright('INFO:'), logMessage);
      }
      break;
    default:
      break;
  }
}

/**
 * Fetch error message.
 *
 * @param {FetchErrorMessageResponse} response - Response.
 *
 * @returns {FetchErrorMessageReturns}
 *
 * @since 1.0.0
 */
export function fetchErrorMessage(response: FetchErrorMessageResponse): FetchErrorMessageReturns {
  if (response === undefined || typeof response.data !== 'string') {
    return null;
  }

  // Parse the response (normally it should be the sign-in page).
  const jsdom = new JSDOM(
    response.data,
    {
      url: response.config.url,
      referrer: response.config.headers.Referer,
      contentType: 'text/html',
      pretendToBeVisual: true,
    },
  );

  // Find the warn message contents.
  const warnMessage = jsdom.window.document.querySelector('#warnMsgContents');

  if (warnMessage !== null) {
    return clearWhitespace(clearHtmlLineBreak(warnMessage.innerHTML));
  }

  return null;
}

/**
 * Fetch missing sat code.
 *
 * @param {FetchMissingSatCodeResponse} response - Response.
 *
 * @returns {FetchMissingSatCodeReturns}
 *
 * @since 1.0.0
 */
export function fetchMissingSatCode(response: FetchMissingSatCodeResponse): FetchMissingSatCodeReturns {
  if (typeof response.data !== 'string') {
    return null;
  }

  // Find the sat code.
  const satCode = response.data.match(paramSat);

  /**
   * Original matches for the sat code.
   *
   * - "sat=3b59d412-0dcb-41fb-b925-3fcfe3144633"
   * - "3b59d412-0dcb-41fb-b925-3fcfe3144633"
   *
   * Only need to store the sat code, and should be two elements.
   * It is loosely matched for more to take unexpected changes into
   * account. Used in case sat code is not found.
   *
   * @since 1.0.0
   */
  if (satCode !== null && satCode.length >= 2) {
    return satCode[1];
  }

  return null;
}

/**
 * Fetch table cells.
 *
 * @param {FetchTableCellsNodeElements}  nodeElements  - Node elements.
 * @param {FetchTableCellsMatchItems}    matchItems    - Match items.
 * @param {FetchTableCellsIncrementFrom} incrementFrom - Increment from.
 * @param {FetchTableCellsIncrementTo}   incrementTo   - Increment to.
 *
 * @returns {FetchTableCellsReturns}
 *
 * @since 1.0.0
 */
export function fetchTableCells(nodeElements: FetchTableCellsNodeElements, matchItems: FetchTableCellsMatchItems, incrementFrom: FetchTableCellsIncrementFrom, incrementTo: FetchTableCellsIncrementTo): FetchTableCellsReturns {
  const matched: FetchTableCellsMatched = {};

  let newIncrementFrom = incrementFrom;
  let newIncrementTo = incrementTo;

  // Prevent negative numbers.
  if (incrementFrom < 0) {
    newIncrementFrom = 0;
  }

  // Prevent numbers smaller than "incrementFrom".
  if (incrementTo < incrementFrom) {
    newIncrementTo = incrementFrom;
  }

  nodeElements.forEach((nodeElement, nodeElementKey) => {
    const currentNode = nodeElement.textContent;

    if (currentNode === null) {
      return;
    }

    const currentNodeCleaned = clearWhitespace(currentNode);
    const collectedNodes = [];

    if (!matchItems.includes(currentNodeCleaned)) {
      return;
    }

    /**
     * Purpose of this loop is to capture all table cells starting
     * from the "match index + incrementFrom" to "match index + incrementTo", then
     * organize them based on the current matched list value.
     *
     * Using this as an example:
     * - nodes[50].textContent = "Example"
     * - nodes[51].textContent = "12345"
     * - nodes[52].textContent = "67890"
     * - nodes[53].textContent = null
     * - nodes[54].textContent = ""
     * - nodes[55].textContent = "abcdef"
     *
     * If your criteria is set to the following settings, the result would be:
     * (match: "Example", incrementFrom: 0, incrementTo: 1) ➜ { "Example": ["Example", "12345"] }
     * (match: "Example", incrementFrom: 1, incrementTo: 3) ➜ { "Example": ["12345", "67890"] }
     * (match: "Example", incrementFrom: 0, incrementTo: 5) ➜ { "Example": ["Example", "12345", "67890", "abcdef"] }
     *
     * @since 1.0.0
     */
    for (let i = newIncrementFrom; i <= newIncrementTo; i += 1) {
      const incrementedNode = nodeElements[nodeElementKey + i].textContent;

      // Be aware, this checks for "incrementedNode" not "currentNode"
      if (incrementedNode !== null) {
        const incrementedNodeCleaned = clearWhitespace(incrementedNode);

        // If content of "incrementedNode" is not empty.
        if (incrementedNodeCleaned !== '') {
          collectedNodes.push(incrementedNodeCleaned);
        }
      }
    }

    // If the current node is not empty.
    if (collectedNodes.length > 0) {
      matched[currentNodeCleaned] = collectedNodes;
    }
  });

  return matched;
}

/**
 * Find gateway manufacturer model.
 *
 * @param {FindGatewayManufacturerModelMode}         mode         - Mode.
 * @param {FindGatewayManufacturerModelManufacturer} manufacturer - Manufacturer.
 * @param {FindGatewayManufacturerModelModel}        model        - Model.
 *
 * @returns {FindGatewayManufacturerModelReturns}
 *
 * @since 1.0.0
 */
export function findGatewayManufacturerModel(mode: FindGatewayManufacturerModelMode, manufacturer: FindGatewayManufacturerModelManufacturer, model: FindGatewayManufacturerModelModel): FindGatewayManufacturerModelReturns {
  let newManufacturer = manufacturer;
  let newModel = model;

  switch (true) {
    case manufacturer === 'ADT Pulse Gateway' && model === 'iHub-3001':
      newManufacturer = 'iControl';
      newModel = 'ADT Pulse Gateway iHub-3001';
      break;
    case manufacturer === 'ADT Pulse Gateway' && model === 'PGZNG1':
      newManufacturer = 'NETGEAR';
      newModel = 'ADT Pulse Gateway PGZNG1';
      break;
    case manufacturer === null && model === 'Compact SMA Protocol Gateway':
      newManufacturer = 'iControl';
      newModel = 'Compact SMA Protocol Gateway';
      break;
    case manufacturer === null && model === 'Lynx/QuickConnect Cellular-Only Gateway':
      newManufacturer = 'Ademco/ADT';
      newModel = 'Lynx/QuickConnect Cellular-Only Gateway';
      break;
    default:
      break;
  }

  return (mode === 'manufacturer') ? newManufacturer : newModel;
}

/**
 * Find index with value.
 *
 * @param {FindIndexWithValueArray}     array     - Array.
 * @param {FindIndexWithValueCondition} condition - Condition.
 *
 * @returns {FindIndexWithValueReturns}
 *
 * @since 1.0.0
 */
export function findIndexWithValue<Value>(array: FindIndexWithValueArray<Value>, condition: FindIndexWithValueCondition<Value>): FindIndexWithValueReturns<Value> {
  let index = -1;
  let value;

  for (let i = 0; i < array.length; i += 1) {
    // If the current iteration matches the condition given, return that.
    if (condition(array[i])) {
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
 * Find null keys.
 *
 * @param {FindNullKeysProperties} properties - Properties.
 * @param {FindNullKeysParentKey}  parentKey  - Parent key.
 *
 * @returns {FindNullKeysReturns}
 *
 * @since 1.0.0
 */
export function findNullKeys(properties: FindNullKeysProperties, parentKey: FindNullKeysParentKey = ''): FindNullKeysReturns {
  const found: FindNullKeysFound = [];

  Object.entries(properties).forEach(([propertyKey, property]) => {
    const currentKey = (parentKey !== '') ? `${parentKey}.${propertyKey}` : propertyKey;

    if (_.isPlainObject(property)) {
      found.push(...findNullKeys(property, currentKey));
    } else if (property == null) {
      found.push(currentKey);
    }
  });

  return found;
}

/**
 * Find panel manufacturer.
 *
 * @param {FindPanelManufacturerManufacturerProvider} manufacturerProvider - Manufacturer provider.
 * @param {FindPanelManufacturerTypeModel}            typeModel            - Type model.
 *
 * @returns {FindPanelManufacturerReturns}
 *
 * @since 1.0.0
 */
export function findPanelManufacturer(manufacturerProvider: FindPanelManufacturerManufacturerProvider, typeModel: FindPanelManufacturerTypeModel): FindPanelManufacturerReturns {
  if (manufacturerProvider !== null) {
    return manufacturerProvider;
  }

  switch (typeModel) {
    case 'Security Panel - LYNX/QuickConnect':
      return 'Ademco/ADT';
    default:
      return null;
  }
}

/**
 * Generate hash.
 *
 * @param {GenerateHashData} data - Data.
 *
 * @returns {GenerateHashReturns}
 *
 * @since 1.0.0
 */
export function generateHash(data: GenerateHashData): GenerateHashReturns {
  const staticData = _.omit(data, [
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
 * Get accessory category.
 *
 * @param {GetAccessoryCategoryDeviceCategory} deviceCategory - Device category.
 *
 * @returns {GetAccessoryCategoryReturns}
 *
 * @since 1.0.0
 */
export function getAccessoryCategory(deviceCategory: GetAccessoryCategoryDeviceCategory): GetAccessoryCategoryReturns {
  switch (deviceCategory) {
    case 'ALARM_SYSTEM':
      return Categories.ALARM_SYSTEM;
    case 'OTHER':
      return Categories.OTHER;
    case 'SECURITY_SYSTEM':
      return Categories.SECURITY_SYSTEM;
    case 'SENSOR':
      return Categories.SENSOR;
    case 'SWITCH':
      return Categories.SWITCH;
    default:
      return Categories.OTHER;
  }
}

/**
 * Get detect report url.
 *
 * @returns {GetDetectReportUrlReturns}
 *
 * @since 1.0.0
 */
export function getDetectReportUrl(): GetDetectReportUrlReturns {
  return 'https://b4ch8ibuidp0wv68c3x9.ntfy.mrjackyliang.com';
}

/**
 * Get package version.
 *
 * @returns {GetPackageVersionReturns}
 *
 * @since 1.0.0
 */
export function getPackageVersion(): GetPackageVersionReturns {
  const require = createRequire(import.meta.url);
  const packageJson = require('../../package.json');

  return packageJson.version;
}

/**
 * Get plural form.
 *
 * @param {GetPluralFormCount}    count    - Count.
 * @param {GetPluralFormSingular} singular - Singular.
 * @param {GetPluralFormPlural}   plural   - Plural.
 *
 * @returns {GetPluralFormReturns}
 *
 * @since 1.0.0
 */
export function getPluralForm(count: GetPluralFormCount, singular: GetPluralFormSingular, plural: GetPluralFormPlural): GetPluralFormReturns {
  if (count === 1) {
    return singular;
  }

  return plural;
}

/**
 * Is empty orb text summary.
 *
 * @param {IsEmptyOrbTextSummaryInput} input - Input.
 *
 * @returns {IsEmptyOrbTextSummaryReturns}
 *
 * @since 1.0.0
 */
export function isEmptyOrbTextSummary(input: IsEmptyOrbTextSummaryInput): IsEmptyOrbTextSummaryReturns {
  const match: IsEmptyOrbTextSummaryMatch = {
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
 * Is forward slash os.
 *
 * @returns {IsForwardSlashOSReturns}
 *
 * @since 1.0.0
 */
export function isForwardSlashOS(): IsForwardSlashOSReturns {
  const currentOS = os.platform();

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
 * Is maintenance period.
 *
 * @returns {IsMaintenancePeriodReturns}
 *
 * @since 1.0.0
 */
export function isMaintenancePeriod(): IsMaintenancePeriodReturns {
  // Assumes a timezone of "America/Los_Angeles" because Icontrol One headquarters in Redwood City, CA.
  const now = DateTime.now().setZone('America/Los_Angeles');

  const startTime = now.set({
    hour: 22,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const endTime = now.set({
    hour: 4,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  // Current time is between 10 PM and 4 AM PST.
  return (now >= startTime || now < endTime);
}

/**
 * Is panel alarm active.
 *
 * @param {IsPanelAlarmActivePanelStatuses}       panelStatuses       - Panel statuses.
 * @param {IsPanelAlarmActiveOrbSecurityButtons}  orbSecurityButtons  - Orb security buttons.
 * @param {IsPanelAlarmActiveIgnoreSensorProblem} ignoreSensorProblem - Ignore sensor problem.
 *
 * @returns {IsPanelAlarmActiveReturns}
 *
 * @since 1.0.0
 */
export function isPanelAlarmActive(panelStatuses: IsPanelAlarmActivePanelStatuses, orbSecurityButtons: IsPanelAlarmActiveOrbSecurityButtons, ignoreSensorProblem: IsPanelAlarmActiveIgnoreSensorProblem): IsPanelAlarmActiveReturns {
  const hasDisarmedTroubleButtons = orbSecurityButtons.filter((orbSecurityButton) => {
    const orbSecurityButtonButtonText = orbSecurityButton.buttonText;

    return orbSecurityButtonButtonText !== null && ['Disarm', 'Arm Away', 'Arm Stay'].includes(orbSecurityButtonButtonText);
  }).length === 3;

  return (
    panelStatuses.includes('BURGLARY ALARM')
    || panelStatuses.includes('Carbon Monoxide Alarm')
    || panelStatuses.includes('FIRE ALARM')
    || (
      !ignoreSensorProblem
      && panelStatuses.includes('Sensor Problem')
      && hasDisarmedTroubleButtons
    )
    || (
      !ignoreSensorProblem
      && panelStatuses.includes('Sensor Problems')
      && hasDisarmedTroubleButtons
    )
    || panelStatuses.includes('Uncleared Alarm')
    || panelStatuses.includes('WATER ALARM')
  );
}

/**
 * Is plugin outdated.
 *
 * @returns {IsPluginOutdatedReturns}
 *
 * @since 1.0.0
 */
export async function isPluginOutdated(): IsPluginOutdatedReturns {
  const currentVersion = getPackageVersion();

  // If we cannot compare version, simply return "not outdated".
  if (currentVersion === undefined) {
    return false;
  }

  try {
    const fetchedVersion = await latestVersion('homebridge-adt-pulse');

    // Check if plugin is outdated.
    if (semver.gt(fetchedVersion, currentVersion)) {
      return true;
    }
  } catch {
    /* empty */
  }

  return false;
}

/**
 * Is portal sync code.
 *
 * @param {IsPortalSyncCodeSyncCode} syncCode - Sync code.
 *
 * @returns {boolean}
 *
 * @since 1.0.0
 */
export function isPortalSyncCode(syncCode: IsPortalSyncCodeSyncCode): syncCode is IsPortalSyncCodeTypeGuard {
  return textSyncCode.test(syncCode);
}

/**
 * Is session clean state.
 *
 * @param {IsSessionCleanStateOrbSecurityButtons} orbSecurityButtons - Orb security buttons.
 *
 * @returns {IsSessionCleanStateReturns}
 *
 * @since 1.0.0
 */
export function isSessionCleanState(orbSecurityButtons: IsSessionCleanStateOrbSecurityButtons): IsSessionCleanStateReturns {
  // When at least 1 security button is disabled, it means the system is busy changing state.
  if (orbSecurityButtons.some((orbSecurityButton) => orbSecurityButton.buttonDisabled)) {
    return false;
  }

  return orbSecurityButtons
    .filter((orbSecurityButton): orbSecurityButton is IsSessionCleanStateReadyButton => !orbSecurityButton.buttonDisabled)
    .every((orbSecurityButton) => !['disarmed', 'disarmed+with+alarm', 'night+stay'].includes(orbSecurityButton.urlParams.armState));
}

/**
 * Is unknown do submit handler collection.
 *
 * @param {IsUnknownDoSubmitHandlerCollectionHandlers} handlers - Handlers.
 *
 * @returns {IsUnknownDoSubmitHandlerCollectionReturns}
 *
 * @since 1.0.0
 */
export function isUnknownDoSubmitHandlerCollection(handlers: IsUnknownDoSubmitHandlerCollectionHandlers): IsUnknownDoSubmitHandlerCollectionReturns {
  const currentHandlerCollection = handlers.map((handler) => ({
    href: handler.urlParams.href,
  }));

  return !collectionDoSubmitHandlers
    .map((collectionDoSubmitHandler) => collectionDoSubmitHandler.handlers)
    .some((collectionDoSubmitHandler) => _.isEqual(collectionDoSubmitHandler, currentHandlerCollection));
}

/**
 * Is unknown gateway device.
 *
 * @param {IsUnknownGatewayDeviceGateway} gateway - Gateway.
 *
 * @returns {IsUnknownGatewayDeviceReturns}
 *
 * @since 1.0.0
 */
export function isUnknownGatewayDevice(gateway: IsUnknownGatewayDeviceGateway): IsUnknownGatewayDeviceReturns {
  const currentGateway = {
    manufacturer: _.get(gateway, ['Manufacturer:', 0], null),
    model: _.get(gateway, ['Model:', 0], null),
    primaryConnectionType: _.get(gateway, ['Primary Connection Type:', 0], null),
  };

  return !deviceGateways
    .map((deviceGateway) => deviceGateway.gateway)
    .some((deviceGateway) => _.isEqual(deviceGateway, currentGateway));
}

/**
 * Is unknown orb security button collection.
 *
 * @param {IsUnknownOrbSecurityButtonCollectionButtons} buttons - Buttons.
 *
 * @returns {IsUnknownOrbSecurityButtonCollectionReturns}
 *
 * @since 1.0.0
 */
export function isUnknownOrbSecurityButtonCollection(buttons: IsUnknownOrbSecurityButtonCollectionButtons): IsUnknownOrbSecurityButtonCollectionReturns {
  const currentButtonCollection = buttons.map((button) => ({
    buttonDisabled: button.buttonDisabled,
    buttonText: button.buttonText,
    loadingText: ('loadingText' in button) ? button.loadingText : null,
  }));

  return !collectionOrbSecurityButtons
    .map((collectionOrbSecurityButton) => collectionOrbSecurityButton.buttons)
    .some((collectionOrbSecurityButton) => _.isEqual(collectionOrbSecurityButton, currentButtonCollection));
}

/**
 * Is unknown panel device.
 *
 * @param {IsUnknownPanelDevicePanel} panel - Panel.
 *
 * @returns {IsUnknownPanelDeviceReturns}
 *
 * @since 1.0.0
 */
export function isUnknownPanelDevice(panel: IsUnknownPanelDevicePanel): IsUnknownPanelDeviceReturns {
  const currentPanel = {
    manufacturerProvider: _.get(panel, ['Manufacturer/Provider:', 0], null),
    typeModel: _.get(panel, ['Type/Model:', 0], null),
  };

  return !deviceSecurityPanels
    .map((deviceSecurityPanel) => deviceSecurityPanel.panel)
    .some((deviceSecurityPanel) => _.isEqual(deviceSecurityPanel, currentPanel));
}

/**
 * Parse arm disarm message.
 *
 * @param {ParseArmDisarmMessageElement} element - Element.
 *
 * @returns {ParseArmDisarmMessageReturns}
 *
 * @since 1.0.0
 */
export function parseArmDisarmMessage(element: ParseArmDisarmMessageElement): ParseArmDisarmMessageReturns {
  if (element === null || element.textContent === null) {
    return null;
  }

  return clearWhitespace(element.textContent);
}

/**
 * Parse do submit handlers.
 *
 * @param {ParseDoSubmitHandlersElements} elements - Elements.
 *
 * @returns {ParseDoSubmitHandlersReturns}
 *
 * @since 1.0.0
 */
export function parseDoSubmitHandlers(elements: ParseDoSubmitHandlersElements): ParseDoSubmitHandlersReturns {
  const handlers: ParseDoSubmitHandlersHandlers = [];

  elements.forEach((element) => {
    const onClick = element.getAttribute('onclick');

    // None of the force arm buttons are disabled, so if "onClick" is null, this button is useless.
    if (onClick === null) {
      return;
    }

    const relativeUrl = onClick.replace(functionDoSubmit, '$1') as ParseDoSubmitHandlersRelativeUrl;
    const urlParamsSat = onClick.replace(functionDoSubmit, '$2');
    const urlParamsHref = onClick.replace(functionDoSubmit, '$3').replace(characterBackslashForwardSlash, '/') as ParseDoSubmitHandlersUrlParamsHref;
    const urlParamsArmState = onClick.replace(functionDoSubmit, '$5') as ParseDoSubmitHandlersUrlParamsArmState;
    const urlParamsArm = onClick.replace(functionDoSubmit, '$6') as ParseDoSubmitHandlersUrlParamsArm;

    handlers.push({
      relativeUrl,
      urlParams: {
        arm: (urlParamsArm !== '') ? urlParamsArm : null,
        armState: (urlParamsArmState !== '') ? urlParamsArmState : null,
        href: urlParamsHref,
        sat: urlParamsSat,
      },
    });
  });

  return handlers;
}

/**
 * Parse multi factor methods.
 *
 * @param {ParseMultiFactorMethodsResponse} response - Response.
 *
 * @returns {ParseMultiFactorMethodsReturns}
 *
 * @since 1.0.0
 */
export function parseMultiFactorMethods(response: ParseMultiFactorMethodsResponse): ParseMultiFactorMethodsReturns {
  const methods: ParseMultiFactorMethodsMethods = [];

  // Parse the multi-factor methods.
  response.state.mfaProperties.forEach((mfaProperty) => {
    const mfaPropertyId = mfaProperty.id;
    const mfaPropertyType = mfaProperty.type;
    const mfaPropertyLabel = mfaProperty.label;

    methods.push({
      id: mfaPropertyId,
      type: mfaPropertyType,
      label: mfaPropertyLabel,
    });
  });

  return methods;
}

/**
 * Parse multi factor trusted devices.
 *
 * @param {ParseMultiFactorTrustedDevicesResponse} response - Response.
 *
 * @returns {ParseMultiFactorTrustedDevicesReturns}
 *
 * @since 1.0.0
 */
export function parseMultiFactorTrustedDevices(response: ParseMultiFactorTrustedDevicesResponse): ParseMultiFactorTrustedDevicesReturns {
  const devices: ParseMultiFactorTrustedDevicesDevices = [];

  // If "trustedDevices" do not exist, return an empty array.
  if (response.state.trustedDevices === undefined) {
    return devices;
  }

  // Parse the multi-factor trusted devices.
  response.state.trustedDevices.forEach((trustedDevice) => {
    const trustedDeviceId = trustedDevice.id;
    const trustedDeviceName = trustedDevice.name;

    devices.push({
      id: trustedDeviceId,
      name: trustedDeviceName,
    });
  });

  return devices;
}

/**
 * Parse orb sensors.
 *
 * @param {ParseOrbSensorsElements} elements - Elements.
 *
 * @returns {ParseOrbSensorsReturns}
 *
 * @since 1.0.0
 */
export function parseOrbSensors(elements: ParseOrbSensorsElements): ParseOrbSensorsReturns {
  const sensors: ParseOrbSensorsSensors = [];

  elements.forEach((element) => {
    const canvas = element.querySelector('td:nth-child(1) canvas');
    const name = element.querySelector('td:nth-child(3) a.p_deviceNameText');
    const zone = element.querySelector('td:nth-child(3) span.p_grayNormalText, td:nth-child(3) div.p_grayNormalText');
    const status = element.querySelector('td:nth-child(4)');

    if (canvas !== null && name !== null && zone !== null && status !== null) {
      const canvasIcon = canvas.getAttribute('icon');
      const nameText = name.textContent;
      const zoneText = zone.textContent;
      const statusText = status.textContent;

      if (canvasIcon !== null && nameText !== null && zoneText !== null && zoneText.startsWith('Zone') && statusText !== null) {
        const cleanedIcon = clearWhitespace(canvasIcon) as ParseOrbSensorsCleanedIcon;
        const cleanedName = clearWhitespace(nameText);
        const cleanedZone = Number(clearWhitespace(zoneText).replace(textOrbSensorZone, '$2'));
        const cleanedStatuses = clearWhitespace(statusText).split(', ') as ParseOrbSensorsCleanedStatuses;

        /**
         * Only support sensors with zones between 1 and 99
         * because anything above Zone 99 is mostly a rogue sensor
         * like "KEYPAD #1".
         *
         * @since 1.0.0
         */
        if (cleanedZone < 1 || cleanedZone > 99) {
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
  });

  return sensors.sort((a, b) => a.zone - b.zone);
}

/**
 * Parse orb text summary.
 *
 * @param {ParseOrbTextSummaryElement} element - Element.
 *
 * @returns {ParseOrbTextSummaryReturns}
 *
 * @since 1.0.0
 */
export function parseOrbTextSummary(element: ParseOrbTextSummaryElement): ParseOrbTextSummaryReturns {
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

  const cleanedNode = clearWhitespace(element.textContent);
  const rawSections = cleanedNode.split(textOrbTextSummarySections).filter(Boolean).map((section) => section.split(', '));
  const finalParsed: ParseOrbTextSummaryFinalParsed = {
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
    for (let j = 0; j < rawSections[i].length; j += 1) {
      // Don't forget, we are matching arrays against strings here; "rawSections[i][j]" is a string not an array.
      switch (true) {
        case itemPanelStatusStates.includes(<ParseOrbTextSummaryStateItem>rawSections[i][j]):
          finalParsed.panelStates.push(<ParseOrbTextSummaryStateItem>rawSections[i][j]);
          break;
        case itemPanelStatusStatuses.includes(<ParseOrbTextSummaryStatusItem>rawSections[i][j]):
          finalParsed.panelStatuses.push(<ParseOrbTextSummaryStatusItem>rawSections[i][j]);
          break;
        case itemPanelStatusNotes.includes(<ParseOrbTextSummaryNoteItem>rawSections[i][j]):
          finalParsed.panelNotes.push(<ParseOrbTextSummaryNoteItem>rawSections[i][j]);
          break;
        default:
          finalParsed.rawData.unknownPieces.push(rawSections[i][j]);
          break;
      }
    }
  }

  return finalParsed;
}

/**
 * Parse orb security buttons.
 *
 * @param {ParseOrbSecurityButtonsElements} elements - Elements.
 *
 * @returns {ParseOrbSecurityButtonsReturns}
 *
 * @since 1.0.0
 */
export function parseOrbSecurityButtons(elements: ParseOrbSecurityButtonsElements): ParseOrbSecurityButtonsReturns {
  const buttons: ParseOrbSecurityButtonsButtons = [];

  elements.forEach((element) => {
    const disabled = element.getAttribute('disabled');
    const id = element.getAttribute('id');
    const value = element.getAttribute('value');
    const onClick = element.getAttribute('onclick');

    // Type asserted variables for both pending (disabled) and ready (enabled) buttons.
    const buttonId = id as ParseOrbSecurityButtonsButtonId;

    // There is a pending (disabled) button displayed.
    if (disabled !== null && onClick === null) {
      const pendingButtonText = value as ParseOrbSecurityButtonsPendingButtonText;

      buttons.push({
        buttonDisabled: true,
        buttonId,
        buttonText: pendingButtonText,
      });

      return;
    }

    // There is a ready (enabled) button displayed.
    if (disabled === null && onClick !== null) {
      const readyButtonText = value as ParseOrbSecurityButtonsReadyButtonText;

      const relativeUrl = onClick.replace(functionSetArmState, '$1') as ParseOrbSecurityButtonsRelativeUrl;
      const loadingText = onClick.replace(functionSetArmState, '$2') as ParseOrbSecurityButtonsLoadingText;
      const buttonIndex = Number(onClick.replace(functionSetArmState, '$3'));
      const totalButtons = Number(onClick.replace(functionSetArmState, '$4'));
      const changeAccessCode = Boolean(onClick.replace(functionSetArmState, '$5'));
      const urlParamsHref = onClick.replace(functionSetArmState, '$6') as ParseOrbSecurityButtonsHref;
      const urlParamsArmState = onClick.replace(functionSetArmState, '$7') as ParseOrbSecurityButtonsArmState;
      const urlParamsArm = onClick.replace(functionSetArmState, '$8') as ParseOrbSecurityButtonsArm;
      const urlParamsSat = onClick.replace(functionSetArmState, '$9');

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
  });

  return buttons;
}

/**
 * Parse sensors table.
 *
 * @param {ParseOrbSensorsTableType}     type     - Type.
 * @param {ParseOrbSensorsTableElements} elements - Elements.
 *
 * @returns {ParseOrbSensorsTableReturns}
 *
 * @since 1.0.0
 */
export function parseSensorsTable(type: ParseOrbSensorsTableType, elements: ParseOrbSensorsTableElements): ParseOrbSensorsTableReturns<ParseOrbSensorsTableType> {
  const sensors: ParseOrbSensorsTableSensors<ParseOrbSensorsTableType> = [];

  let atSensorsSection = false;

  elements.forEach((element) => {
    const elementCount = element.childElementCount;
    const title = element.querySelector('td.p_listRow h2.p_boldNormalText');

    // If we are looking at a row that is a sensor.
    if (atSensorsSection) {
      // This is a blank row, and it means we are done fetching all sensors.
      if (title === null && elementCount === 1) {
        atSensorsSection = false;

        // Don't proceed further.
        return;
      }

      const onclick = element.getAttribute('onclick');
      const icon = element.querySelector('td:nth-child(1) canvas');
      const name = element.querySelector('td:nth-child(2) a');
      const zone = element.querySelector('td:nth-child(3)');
      const deviceType = element.querySelector('td:nth-child(5)');

      if (onclick !== null && icon !== null && name !== null && zone !== null && deviceType !== null) {
        const deviceId = onclick.replace(functionGoToUrl, '$1');
        const iconTitle = icon.getAttribute('title');
        const nameText = name.textContent;
        const zoneText = zone.textContent;
        const deviceTypeText = deviceType.textContent;

        if (iconTitle !== null && nameText !== null && zoneText !== null && deviceTypeText !== null) {
          const cleanedDeviceId = Number(clearWhitespace(deviceId));
          const cleanedDeviceType = clearWhitespace(deviceTypeText) as ParseOrbSensorsTableDeviceType;
          const cleanedName = clearWhitespace(nameText);
          const cleanedStatus = clearWhitespace(iconTitle) as ParseOrbSensorsTableStatus;
          const cleanedZone = Number(clearWhitespace(zoneText));

          // These devices are not supported because they do not display a status in the summary page.
          if ([
            'System/Supervisory',
            'Unknown Device Type',
            'Unknown Device Type (Notable Events Only)',
          ].includes(cleanedDeviceType)) {
            return;
          }

          // Generate a different sensor object based on the type.
          if (type === 'sensors-config') {
            const condensedType = condenseSensorType(cleanedDeviceType);

            if (condensedType !== undefined) {
              (sensors as ParseOrbSensorsTableSensors<'sensors-config'>).push({
                adtName: cleanedName,
                adtZone: cleanedZone,
                adtType: condensedType,
              });
            }
          } else {
            (sensors as ParseOrbSensorsTableSensors<'sensors-information'>).push({
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
    if (!atSensorsSection) {
      // This is a title row, and on the next row, we begin capturing sensors information.
      if (title !== null && elementCount === 1) {
        const titleText = title.textContent;

        if (titleText !== null) {
          const cleanedTitle = clearWhitespace(titleText);

          if (cleanedTitle === 'Sensors') {
            atSensorsSection = true;
          }
        }
      }
    }
  });

  if (type === 'sensors-config') {
    return (sensors as ParseOrbSensorsTableSensors<'sensors-config'>).sort((a, b) => a.adtZone - b.adtZone);
  }

  return (sensors as ParseOrbSensorsTableSensors<'sensors-information'>).sort((a, b) => a.zone - b.zone);
}

/**
 * Remove personal identifiable information.
 *
 * @param {RemovePersonalIdentifiableInformationData} data - Data.
 *
 * @returns {RemovePersonalIdentifiableInformationReturns}
 *
 * @since 1.0.0
 */
export function removePersonalIdentifiableInformation(data: RemovePersonalIdentifiableInformationData): RemovePersonalIdentifiableInformationReturns {
  const redactedKeys = [
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
  const replacementText = '*** REDACTED FOR PRIVACY ***';

  /**
   * Remove personal identifiable information - Replace value.
   *
   * @param {RemovePersonalIdentifiableInformationReplaceValueObject} object - Object.
   *
   * @returns {RemovePersonalIdentifiableInformationReplaceValueReturns}
   *
   * @since 1.0.0
   */
  const replaceValue = (object: RemovePersonalIdentifiableInformationReplaceValueObject): RemovePersonalIdentifiableInformationReplaceValueReturns => {
    const modifiedObject: RemovePersonalIdentifiableInformationModifiedObject = {};

    Object.keys(object).forEach((key) => {
      const value = object[key];

      if (_.isPlainObject(value)) {
        modifiedObject[key] = replaceValue(value as RemovePersonalIdentifiableInformationModifiedObject);
      } else if (Array.isArray(value)) {
        modifiedObject[key] = value.map((item) => {
          if (_.isPlainObject(item)) {
            return replaceValue(item);
          }

          if (redactedKeys.includes(key)) {
            return replacementText;
          }

          return item;
        });
      } else if (redactedKeys.includes(key)) {
        modifiedObject[key] = replacementText;
      } else {
        modifiedObject[key] = value;
      }
    });

    return modifiedObject;
  };

  if (Array.isArray(data)) {
    return data.map(replaceValue);
  }

  return replaceValue(data);
}

/**
 * Sleep.
 *
 * @param {SleepMilliseconds} milliseconds - Milliseconds.
 *
 * @returns {SleepReturns}
 *
 * @since 1.0.0
 */
export async function sleep(milliseconds: SleepMilliseconds): SleepReturns {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/**
 * Stack tracer.
 *
 * @param {StackTracerType}  type  - Type.
 * @param {StackTracerError} error - Error.
 *
 * @returns {StackTracerReturns}
 *
 * @since 1.0.0
 */
export function stackTracer(type: StackTracerType, error: StackTracerError<StackTracerType>): StackTracerReturns {
  let stringError;

  switch (type) {
    case 'api-response':
    case 'config-content':
    case 'detect-content':
    case 'fake-ready-buttons':
    case 'log-status-changes':
    case 'serialize-error':
      stringError = util.inspect(error, {
        showHidden: false,
        depth: Infinity,
        colors: false,
      });
      break;
    case 'zod-error':
      stringError = JSON.stringify(error, null, 2).replace(/\\"/g, '\'');
      break;
    default:
      break;
  }

  console.error(chalk.yellowBright(stringError));
}
