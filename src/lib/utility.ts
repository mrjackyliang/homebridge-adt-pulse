import chalk from 'chalk';
import _ from 'lodash';
import util from 'util';

import {
  backslashForwardSlash,
  doSubmitFunction,
  htmlLineBreakCharacter,
  orbTextSummary,
  setArmStateFunction,
  whitespaceCharacters,
} from '@/lib/regex';
import type {
  ClearHtmlLineBreakData,
  ClearHtmlLineBreakReturns,
  ClearWhitespaceData,
  ClearWhitespaceReturns,
  DebugLogCaller,
  DebugLogMessage,
  DebugLogReturns,
  DebugLogType,
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
  ParseOrbTextSummaryElement,
  ParseOrbTextSummaryReturns,
  SleepMilliseconds,
  SleepReturns,
  StackTraceLogError,
  StackTraceLogReturns,
} from '@/types';

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
  return data.replace(htmlLineBreakCharacter, ' ').trim();
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
  return data.replace(whitespaceCharacters, ' ').trim();
}

/**
 * Debug log.
 *
 * @param {DebugLogCaller}  caller  - Caller.
 * @param {DebugLogType}    type    - Type.
 * @param {DebugLogMessage} message - Message.
 *
 * @returns {DebugLogReturns}
 *
 * @since 1.0.0
 */
export function debugLog(caller: DebugLogCaller, type: DebugLogType, message: DebugLogMessage): DebugLogReturns {
  switch (type) {
    case 'error':
      console.error('[ADT Pulse]', chalk.redBright('ERROR:'), chalk.underline(caller), '-', message, '...');
      break;
    case 'warn':
      console.warn('[ADT Pulse]', chalk.yellowBright('WARN:'), chalk.underline(caller), '-', message, '...');
      break;
    case 'success':
      console.warn('[ADT Pulse]', chalk.greenBright('SUCCESS:'), chalk.underline(caller), '-', message, '...');
      break;
    case 'info':
      console.info('[ADT Pulse]', chalk.blueBright('INFO:'), chalk.underline(caller), '-', message, '...');
      break;
    default:
      break;
  }
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

    const relativeUrl = onClick.replace(doSubmitFunction, '$1');
    const urlParamsSat = onClick.replace(doSubmitFunction, '$2') as ParseDoSubmitHandlersUrlParamsSat;
    const urlParamsHref = onClick.replace(doSubmitFunction, '$3');
    const urlParamsArmState = onClick.replace(doSubmitFunction, '$5');
    const urlParamsArm = onClick.replace(doSubmitFunction, '$6');

    handlers.push({
      relativeUrl,
      urlParams: {
        arm: (urlParamsArm === 'away' || urlParamsArm === 'night' || urlParamsArm === 'stay') ? urlParamsArm : null,
        armState: (urlParamsArmState === 'forcearm') ? urlParamsArmState : null,
        href: urlParamsHref.replace(backslashForwardSlash, '/'),
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
      const iconText = icon.getAttribute('icon');
      const nameText = name.textContent;
      const zoneText = zone.textContent;
      const statusText = status.textContent;

      if (iconText !== null && nameText !== null && zoneText !== null && statusText !== null) {
        sensors.push({
          icon: clearWhitespace(iconText),
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
  const currentState = cleanedNode.replace(orbTextSummary, '$1');
  const currentStatus = cleanedNode.replace(orbTextSummary, '$2');

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
      const relativeUrl = onClick.replace(setArmStateFunction, '$1');
      const loadingText = onClick.replace(setArmStateFunction, '$2');
      const buttonIndex = onClick.replace(setArmStateFunction, '$3');
      const totalButtons = onClick.replace(setArmStateFunction, '$4');
      const changeAccessCode = onClick.replace(setArmStateFunction, '$5');
      const urlParamsHref = onClick.replace(setArmStateFunction, '$6');
      const urlParamsArmState = onClick.replace(setArmStateFunction, '$7');
      const urlParamsArm = onClick.replace(setArmStateFunction, '$8');
      const urlParamsSat = onClick.replace(setArmStateFunction, '$9') as ParseOrbSecurityButtonsUrlParamsSat;

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
 * Stack trace log.
 *
 * @param {StackTraceLogError} error - Error.
 *
 * @returns {StackTraceLogReturns}
 *
 * @since 1.0.0
 */
export function stackTraceLog(error: StackTraceLogError): StackTraceLogReturns {
  console.error(chalk.yellowBright(util.inspect(error)));
}
