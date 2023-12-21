import chalk from 'chalk';
import { Categories } from 'homebridge';
import { JSDOM } from 'jsdom';
import latestVersion from 'latest-version';
import _ from 'lodash';
import { createHash } from 'node:crypto';
import os from 'node:os';
import { env } from 'node:process';
import util from 'node:util';

import {
  characterBackslashForwardSlash,
  characterHtmlLineBreak,
  characterWhitespace,
  functionDoSubmit,
  functionGoToUrl,
  functionSetArmState,
  paramSat,
  textOrbSensorZone,
  textOrbTextSummary,
  textSyncCode,
} from '@/lib/regex.js';
import type {
  ClearHtmlLineBreakData,
  ClearHtmlLineBreakReturns,
  ClearWhitespaceData,
  ClearWhitespaceReturns,
  CondenseSensorTypeCondensed,
  CondenseSensorTypeReturns,
  CondenseSensorTypeSensorType,
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
  FetchTableCellsMatchList,
  FetchTableCellsNodeElements,
  FetchTableCellsReturns,
  FindIndexWithValueArray,
  FindIndexWithValueCondition,
  FindIndexWithValueReturns,
  FindNullKeysFound,
  FindNullKeysParentKey,
  FindNullKeysProperties,
  FindNullKeysReturns,
  GenerateDeviceIdId,
  GenerateDeviceIdReturns,
  GenerateDynatracePCHeaderValueMode,
  GenerateDynatracePCHeaderValueReturns,
  GenerateHashData,
  GenerateHashReturns,
  GetAccessoryCategoryDeviceCategory,
  GetAccessoryCategoryReturns,
  GetPluralFormCount,
  GetPluralFormPlural,
  GetPluralFormReturns,
  GetPluralFormSingular,
  IsForwardSlashOSReturns,
  IsPluginOutdatedReturns,
  IsPortalSyncCodeSyncCode,
  IsPortalSyncCodeVerifiedSyncCode,
  ParseArmDisarmMessageElement,
  ParseArmDisarmMessageReturns,
  ParseDoSubmitHandlersElements,
  ParseDoSubmitHandlersHandlers,
  ParseDoSubmitHandlersRelativeUrl,
  ParseDoSubmitHandlersReturns,
  ParseDoSubmitHandlersUrlParamsArm,
  ParseDoSubmitHandlersUrlParamsArmState,
  ParseDoSubmitHandlersUrlParamsHref,
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
  ParseOrbSensorsCleanedStatus,
  ParseOrbSensorsElements,
  ParseOrbSensorsReturns,
  ParseOrbSensorsSensors,
  ParseOrbSensorsTableDeviceType,
  ParseOrbSensorsTableElements,
  ParseOrbSensorsTableReturns,
  ParseOrbSensorsTableSensors,
  ParseOrbSensorsTableStatus,
  ParseOrbTextSummaryCurrentState,
  ParseOrbTextSummaryCurrentStatus,
  ParseOrbTextSummaryElement,
  ParseOrbTextSummaryReturns,
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
    case 'Keypad/Touchpad':
      condensed = 'keypad';
      break;
    case 'Motion Sensor':
    case 'Motion Sensor (Notable Events Only)':
      condensed = 'motion';
      break;
    case 'Audible Panic Button/Pendant':
    case 'Silent Panic Button/Pendant':
      condensed = 'panic';
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
 * @param {FetchTableCellsMatchList}     matchList     - Match list.
 * @param {FetchTableCellsIncrementFrom} incrementFrom - Increment from.
 * @param {FetchTableCellsIncrementTo}   incrementTo   - Increment to.
 *
 * @returns {FetchTableCellsReturns}
 *
 * @since 1.0.0
 */
export function fetchTableCells(nodeElements: FetchTableCellsNodeElements, matchList: FetchTableCellsMatchList, incrementFrom: FetchTableCellsIncrementFrom, incrementTo: FetchTableCellsIncrementTo): FetchTableCellsReturns {
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

    if (!matchList.includes(currentNodeCleaned)) {
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
     * - nodes[54].textContent = "abcdef"
     *
     * If your criteria is set to the following settings, the result would be:
     * (match: "Example", incrementFrom: 0, incrementTo: 1) ➜ { "Example": ["Example", "12345"] }
     * (match: "Example", incrementFrom: 1, incrementTo: 3) ➜ { "Example": ["12345", "67890"] }
     * (match: "Example", incrementFrom: 0, incrementTo: 4) ➜ { "Example": ["Example", "12345", "67890", "abcdef"] }
     *
     * @since 1.0.0
     */
    for (let i = newIncrementFrom; i <= newIncrementTo; i += 1) {
      const incrementedNode = nodeElements[nodeElementKey + i].textContent;

      // Be aware, this checks for "incrementedNode" not "currentNode"
      if (incrementedNode !== null) {
        const incrementedNodeCleaned = clearWhitespace(incrementedNode);

        collectedNodes.push(incrementedNodeCleaned);
      }
    }

    matched[currentNodeCleaned] = collectedNodes;
  });

  return matched;
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
    const currentKey = parentKey !== '' ? `${parentKey}.${propertyKey}` : propertyKey;

    if (_.isPlainObject(property)) {
      found.push(...findNullKeys(property, currentKey));
    } else if (property == null) {
      found.push(currentKey);
    }
  });

  return found;
}

/**
 * Generate device id.
 *
 * @param {GenerateDeviceIdId} id - Id.
 *
 * @returns {GenerateDeviceIdReturns}
 *
 * @since 1.0.0
 */
export function generateDeviceId(id: GenerateDeviceIdId): GenerateDeviceIdReturns {
  return `adt-device-${id}`;
}

/**
 * Generate dynatrace pc header value.
 *
 * @param {GenerateDynatracePCHeaderValueMode} mode - Mode.
 *
 * @returns {GenerateDynatracePCHeaderValueReturns}
 *
 * @since 1.0.0
 */
export function generateDynatracePCHeaderValue(mode: GenerateDynatracePCHeaderValueMode): GenerateDynatracePCHeaderValueReturns {
  const serverId = _.sample([1, 3, 5, 6]);
  const currentMillis = Date.now().toString();
  const slicedMillis = (mode === 'keep-alive') ? currentMillis.slice(-8) : currentMillis.slice(-9);
  const randomThreeDigit = Math.floor(Math.random() * (932 - 218 + 1)) + 218;
  const randomTwoDigit = Math.floor(Math.random() * (29 - 11 + 1)) + 11;
  const randomAlphabet = _.range(32).map(() => _.sample('ABCDEFGHIJKLMNOPQRSTUVW')).join('');

  /**
   * Some information on how Dynatrace generates the "x-dtpc" header.
   *
   * Structure of "5$12345678_218h20vABCDEFGHIJKLMNOPQRSTUVWABCDEFGHI-0e0":
   * - Server ID (1, 3, 5, 6)
   * - $
   * - Last 8 to 9 digits (depending on mode) of current time in milliseconds
   * - _
   * - Random 3 digit value (from 218 to 932)
   * - h
   * - Random 2 digit value (11 to 29)
   * - v
   * - Random 32 uppercase letters (except X, Y, or Z)
   * - -0e0
   *
   * Purpose: Required to identify proper endpoints for beacon transmission; includes session ID for correlation.
   *
   * https://docs.dynatrace.com/docs/manage/data-privacy-and-security/data-privacy/cookies
   * https://docs.dynatrace.com/docs/platform-modules/digital-experience/web-applications/initial-setup/firewall-constraints-for-rum
   * https://docs.dynatrace.com/docs/whats-new/release-notes/oneagent/sprint-165
   *
   * @since 1.0.0
   */
  return `${serverId}$${slicedMillis}_${randomThreeDigit}h${randomTwoDigit}v${randomAlphabet}-0e0`;
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
  return createHash('sha512').update(data).digest('hex');
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
    default:
      return Categories.OTHER;
  }
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
 * Is plugin outdated.
 *
 * @returns {IsPluginOutdatedReturns}
 *
 * @since 1.0.0
 */
export async function isPluginOutdated(): IsPluginOutdatedReturns {
  const currentVersion = env.npm_package_version;

  // If we cannot compare version, simply return "not outdated".
  if (currentVersion === undefined) {
    return false;
  }

  try {
    const fetchedVersion = await latestVersion('homebridge-adt-pulse');

    if (currentVersion !== fetchedVersion) {
      return true;
    }
  } catch (error) {
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
export function isPortalSyncCode(syncCode: IsPortalSyncCodeSyncCode): syncCode is IsPortalSyncCodeVerifiedSyncCode {
  return textSyncCode.test(syncCode);
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

      if (canvasIcon !== null && nameText !== null && zoneText !== null && statusText !== null) {
        const cleanedIcon = clearWhitespace(canvasIcon) as ParseOrbSensorsCleanedIcon;
        const cleanedName = clearWhitespace(nameText);
        const cleanedZone = Number(clearWhitespace(zoneText).replace(textOrbSensorZone, '$2'));
        const cleanedStatus = clearWhitespace(statusText) as ParseOrbSensorsCleanedStatus;

        sensors.push({
          icon: cleanedIcon,
          name: cleanedName,
          status: cleanedStatus,
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
      state: null,
      status: null,
    };
  }

  const cleanedNode = clearWhitespace(element.textContent);
  const currentState = cleanedNode.replace(textOrbTextSummary, '$1') as ParseOrbTextSummaryCurrentState;
  const currentStatus = cleanedNode.replace(textOrbTextSummary, '$2') as ParseOrbTextSummaryCurrentStatus;

  return {
    state: currentState,
    status: (currentStatus !== '') ? currentStatus : null,
  };
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
 * @param {ParseOrbSensorsTableElements} elements - Elements.
 *
 * @returns {ParseOrbSensorsTableReturns}
 *
 * @since 1.0.0
 */
export function parseSensorsTable(elements: ParseOrbSensorsTableElements): ParseOrbSensorsTableReturns {
  const sensors: ParseOrbSensorsTableSensors = [];

  elements.forEach((element) => {
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
        // If the row does not have a zone, it is NOT a sensor.
        const isSensor = clearWhitespace(zoneText) !== '';

        if (isSensor) {
          const cleanedDeviceId = Number(clearWhitespace(deviceId));
          const cleanedDeviceType = clearWhitespace(deviceTypeText) as ParseOrbSensorsTableDeviceType;
          const cleanedName = clearWhitespace(nameText);
          const cleanedStatus = clearWhitespace(iconTitle) as ParseOrbSensorsTableStatus;
          const cleanedZone = Number(clearWhitespace(zoneText));

          sensors.push({
            deviceId: cleanedDeviceId,
            deviceType: cleanedDeviceType,
            name: cleanedName,
            status: cleanedStatus,
            zone: cleanedZone,
          });
        }
      }
    }
  });

  return sensors.sort((a, b) => a.zone - b.zone);
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
    'ip',
    'lanIp',
    'mac',
    'masterCode',
    'sat',
    'serialNumber',
    'wanIp',
  ];

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
      } else if (redactedKeys.includes(key)) {
        modifiedObject[key] = '*** REDACTED FOR PRIVACY ***';
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
    case 'detect-content':
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
