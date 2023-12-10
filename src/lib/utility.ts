import chalk from 'chalk';
import { JSDOM } from 'jsdom';
import _ from 'lodash';
import { createHash } from 'node:crypto';
import os from 'node:os';
import util from 'node:util';

import {
  characterBackslashForwardSlash,
  characterHtmlLineBreak,
  characterWhitespace,
  functionDoSubmit,
  functionSetArmState,
  paramSat,
  textOrbTextSummary,
} from '@/lib/regex.js';
import type {
  ClearHtmlLineBreakData,
  ClearHtmlLineBreakReturns,
  ClearWhitespaceData,
  ClearWhitespaceReturns,
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
  FindNullKeysFound,
  FindNullKeysParentKey,
  FindNullKeysProperties,
  FindNullKeysReturns,
  GenerateDynatracePCHeaderValueMode,
  GenerateDynatracePCHeaderValueReturns,
  GenerateMd5HashData,
  GenerateMd5HashReturns,
  GetPluralFormCount,
  GetPluralFormPlural,
  GetPluralFormReturns,
  GetPluralFormSingular,
  IsForwardSlashOSReturns,
  ParseArmDisarmMessageElement,
  ParseArmDisarmMessageReturns,
  ParseDoSubmitHandlersElements,
  ParseDoSubmitHandlersHandlers,
  ParseDoSubmitHandlersReturns,
  ParseDoSubmitHandlersUrlParamsSat,
  ParseOrbSecurityButtonsButtons,
  ParseOrbSecurityButtonsElements,
  ParseOrbSecurityButtonsReturns,
  ParseOrbSecurityButtonsUrlParamsSat,
  ParseOrbSensorsElements,
  ParseOrbSensorsReturns,
  ParseOrbSensorsSensors,
  ParseOrbSensorsTableElements,
  ParseOrbSensorsTableReturns,
  ParseOrbSensorsTableSensors,
  ParseOrbTextSummaryElement,
  ParseOrbTextSummaryReturns,
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
  if (typeof response.data !== 'string') {
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

  _.forOwn(properties, (property, propertyKey) => {
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
 * Generate md5 hash.
 *
 * @param {GenerateMd5HashData} data - Data.
 *
 * @returns {GenerateMd5HashReturns}
 *
 * @since 1.0.0
 */
export function generateMd5Hash(data: GenerateMd5HashData): GenerateMd5HashReturns {
  return createHash('md5').update(JSON.stringify(data)).digest('hex');
}

/**
 * Get plural form.
 *
 * @param {GetPluralFormCount} count
 * @param {GetPluralFormSingular} singular
 * @param {GetPluralFormPlural} plural
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

    if (onClick === null) {
      return;
    }

    const relativeUrl = onClick.replace(functionDoSubmit, '$1');
    const urlParamsSat = onClick.replace(functionDoSubmit, '$2') as ParseDoSubmitHandlersUrlParamsSat;
    const urlParamsHref = onClick.replace(functionDoSubmit, '$3');
    const urlParamsArmState = onClick.replace(functionDoSubmit, '$5');
    const urlParamsArm = onClick.replace(functionDoSubmit, '$6');

    handlers.push({
      relativeUrl,
      urlParams: {
        arm: (urlParamsArm === 'away' || urlParamsArm === 'night' || urlParamsArm === 'stay') ? urlParamsArm : null,
        armState: (urlParamsArmState === 'forcearm') ? urlParamsArmState : null,
        href: urlParamsHref.replace(characterBackslashForwardSlash, '/'),
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
    const icon = element.querySelector('td:nth-child(1) canvas');
    const name = element.querySelector('td:nth-child(3) a.p_deviceNameText');
    const zone = element.querySelector('td:nth-child(3) span.p_grayNormalText, td:nth-child(3) div.p_grayNormalText');
    const status = element.querySelector('td:nth-child(4)');

    if (icon !== null && name !== null && zone !== null && status !== null) {
      const iconIcon = icon.getAttribute('icon');
      const nameText = name.textContent;
      const zoneText = zone.textContent;
      const statusText = status.textContent;

      if (iconIcon !== null && nameText !== null && zoneText !== null && statusText !== null) {
        sensors.push({
          icon: clearWhitespace(iconIcon),
          name: clearWhitespace(nameText),
          status: clearWhitespace(statusText),
          zone: Number(clearWhitespace(zoneText).replace(/^(Zone )(.*)$/, '$2').toLowerCase()),
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
  const currentState = cleanedNode.replace(textOrbTextSummary, '$1');
  const currentStatus = cleanedNode.replace(textOrbTextSummary, '$2');

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

    // There is a pending (disabled) button displayed.
    if (disabled !== null && onClick === null) {
      buttons.push({
        buttonDisabled: true,
        buttonId: id,
        buttonTitle: value,
      });

      return;
    }

    // There is a ready (enabled) button displayed.
    if (disabled === null && onClick !== null) {
      const relativeUrl = onClick.replace(functionSetArmState, '$1');
      const loadingText = onClick.replace(functionSetArmState, '$2');
      const buttonIndex = onClick.replace(functionSetArmState, '$3');
      const totalButtons = onClick.replace(functionSetArmState, '$4');
      const changeAccessCode = onClick.replace(functionSetArmState, '$5');
      const urlParamsHref = onClick.replace(functionSetArmState, '$6');
      const urlParamsArmState = onClick.replace(functionSetArmState, '$7');
      const urlParamsArm = onClick.replace(functionSetArmState, '$8');
      const urlParamsSat = onClick.replace(functionSetArmState, '$9') as ParseOrbSecurityButtonsUrlParamsSat;

      if (
        (
          urlParamsArm !== 'away'
          && urlParamsArm !== 'night'
          && urlParamsArm !== 'off'
          && urlParamsArm !== 'stay'
        )
        || (
          urlParamsArmState !== 'away'
          && urlParamsArmState !== 'disarmed'
          && urlParamsArmState !== 'disarmed+with+alarm'
          && urlParamsArmState !== 'disarmed_with_alarm'
          && urlParamsArmState !== 'night'
          && urlParamsArmState !== 'night+stay'
          && urlParamsArmState !== 'off'
          && urlParamsArmState !== 'stay'
        )
      ) {
        return;
      }

      buttons.push({
        buttonDisabled: false,
        buttonId: id,
        buttonIndex: Number(buttonIndex),
        buttonTitle: value,
        changeAccessCode: (changeAccessCode === 'true'),
        loadingText,
        relativeUrl,
        totalButtons: Number(totalButtons),
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
    const icon = element.querySelector('td:nth-child(1) canvas');
    const name = element.querySelector('td:nth-child(2) a');
    const zone = element.querySelector('td:nth-child(3)');
    const deviceType = element.querySelector('td:nth-child(5)');

    if (icon !== null && name !== null && zone !== null && deviceType !== null) {
      const iconTitle = icon.getAttribute('title');
      const nameText = name.textContent;
      const zoneText = zone.textContent;
      const deviceTypeText = deviceType.textContent;

      if (iconTitle !== null && nameText !== null && zoneText !== null && deviceTypeText !== null) {
        // If the row does not have a zone, it is not a sensor.
        const isSensor = clearWhitespace(zoneText) !== '';

        if (isSensor) {
          sensors.push({
            deviceType: clearWhitespace(deviceTypeText),
            name: clearWhitespace(nameText),
            status: clearWhitespace(iconTitle),
            zone: Number(clearWhitespace(zoneText)),
          });
        }
      }
    }
  });

  return sensors.sort((a, b) => a.zone - b.zone);
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
    case 'zod-error':
      stringError = JSON.stringify(error, null, 2).replace(/\\"/g, '\'');
      break;
    case 'serialize-error':
      stringError = util.inspect(error);
      break;
    default:
      break;
  }

  console.error(chalk.yellowBright(stringError));
}
