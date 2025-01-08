import axios from 'axios';
import _ from 'lodash';
import { serializeError } from 'serialize-error';

import {
  collectionSensorActions,
  itemDoSubmitHandlerRelativeUrls,
  itemDoSubmitHandlerUrlParamsArms,
  itemDoSubmitHandlerUrlParamsArmStates,
  itemDoSubmitHandlerUrlParamsHrefs,
  itemGatewayInformationStatuses,
  itemOrbSecurityButtonButtonTexts,
  itemOrbSecurityButtonLoadingTexts,
  itemOrbSecurityButtonRelativeUrls,
  itemOrbSecurityButtonUrlParamsArms,
  itemOrbSecurityButtonUrlParamsArmStates,
  itemOrbSecurityButtonUrlParamsHrefs,
  itemPanelInformationStatuses,
  itemPortalVersions,
  itemSensorInformationDeviceTypes,
  itemSensorInformationStatuses,
  itemSensorStatusIcons,
  itemSensorStatusStatuses,
} from '@/lib/items.js';
import {
  debugLog,
  getDetectReportUrl,
  getPackageVersion,
  isEmptyOrbTextSummary,
  isPluginOutdated,
  isUnknownDoSubmitHandlerCollection,
  isUnknownGatewayDevice,
  isUnknownOrbSecurityButtonCollection,
  isUnknownPanelDevice,
  removePersonalIdentifiableInformation,
  stackTracer,
} from '@/lib/utility.js';
import type {
  DetectApiDoSubmitHandlersDebugMode,
  DetectApiDoSubmitHandlersHandlers,
  DetectApiDoSubmitHandlersLogger,
  DetectApiDoSubmitHandlersReturns,
  DetectApiGatewayInformationDebugMode,
  DetectApiGatewayInformationDevice,
  DetectApiGatewayInformationLogger,
  DetectApiGatewayInformationReturns,
  DetectApiOrbSecurityButtonsButtons,
  DetectApiOrbSecurityButtonsDebugMode,
  DetectApiOrbSecurityButtonsLogger,
  DetectApiOrbSecurityButtonsReturns,
  DetectApiPanelInformationDebugMode,
  DetectApiPanelInformationDevice,
  DetectApiPanelInformationLogger,
  DetectApiPanelInformationReturns,
  DetectApiPanelStatusDebugMode,
  DetectApiPanelStatusLogger,
  DetectApiPanelStatusReturns,
  DetectApiPanelStatusSummary,
  DetectApiSensorsInformationDebugMode,
  DetectApiSensorsInformationLogger,
  DetectApiSensorsInformationReturns,
  DetectApiSensorsInformationSensors,
  DetectApiSensorsStatusDebugMode,
  DetectApiSensorsStatusLogger,
  DetectApiSensorsStatusReturns,
  DetectApiSensorsStatusSensors,
  DetectGlobalDebugParserData,
  DetectGlobalDebugParserDebugMode,
  DetectGlobalDebugParserLogger,
  DetectGlobalDebugParserReturns,
  DetectGlobalPortalVersionDebugMode,
  DetectGlobalPortalVersionLogger,
  DetectGlobalPortalVersionReturns,
  DetectGlobalPortalVersionVersion,
  DetectPlatformUnknownSensorsActionDebugMode,
  DetectPlatformUnknownSensorsActionLogger,
  DetectPlatformUnknownSensorsActionReturns,
  DetectPlatformUnknownSensorsActionSensors,
} from '@/types/index.d.ts';

/**
 * Detect api do submit handlers.
 *
 * @param {DetectApiDoSubmitHandlersHandlers}  handlers  - Handlers.
 * @param {DetectApiDoSubmitHandlersLogger}    logger    - Logger.
 * @param {DetectApiDoSubmitHandlersDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectApiDoSubmitHandlersReturns}
 *
 * @since 1.0.0
 */
export async function detectApiDoSubmitHandlers(handlers: DetectApiDoSubmitHandlersHandlers, logger: DetectApiDoSubmitHandlersLogger, debugMode: DetectApiDoSubmitHandlersDebugMode): DetectApiDoSubmitHandlersReturns {
  const detectedNewHandlers = handlers.filter((handler) => (
    !itemDoSubmitHandlerRelativeUrls.includes(handler.relativeUrl)
    || (
      handler.urlParams.arm !== null
      && !itemDoSubmitHandlerUrlParamsArms.includes(handler.urlParams.arm)
    )
    || (
      handler.urlParams.armState !== null
      && !itemDoSubmitHandlerUrlParamsArmStates.includes(handler.urlParams.armState)
    )
    || !itemDoSubmitHandlerUrlParamsHrefs.includes(handler.urlParams.href)
  ));

  if (detectedNewHandlers.length > 0) {
    const cleanedData = removePersonalIdentifiableInformation(detectedNewHandlers);

    // If outdated, it means plugin may already have support.
    try {
      const outdated = await isPluginOutdated();

      if (outdated) {
        if (logger !== null) {
          logger.warn('Plugin has detected new do submit handlers. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode) {
          debugLog(logger, 'detect.ts / detectApiDoSubmitHandlers()', 'warn', 'Plugin has detected new do submit handlers. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectApiDoSubmitHandlers()', 'error', 'Failed to check if plugin is outdated');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to check if plugin is outdated later on.
      return false;
    }

    if (logger !== null) {
      logger.warn('Plugin has detected new do submit handlers. Notifying plugin author about this discovery ...');
    }

    // This is intentionally duplicated if using Homebridge debug mode.
    if (debugMode) {
      debugLog(logger, 'detect.ts / detectApiDoSubmitHandlers()', 'warn', 'Plugin has detected new do submit handlers. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        getDetectReportUrl(),
        JSON.stringify(cleanedData, null, 2),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': `Detected new do submit handlers (v${getPackageVersion()})`,
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectApiDoSubmitHandlers()', 'error', 'Failed to notify plugin author about the new do submit handlers');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detect api gateway information.
 *
 * @param {DetectApiGatewayInformationDevice}    device    - Device.
 * @param {DetectApiGatewayInformationLogger}    logger    - Logger.
 * @param {DetectApiGatewayInformationDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectApiGatewayInformationReturns}
 *
 * @since 1.0.0
 */
export async function detectApiGatewayInformation(device: DetectApiGatewayInformationDevice, logger: DetectApiGatewayInformationLogger, debugMode: DetectApiGatewayInformationDebugMode): DetectApiGatewayInformationReturns {
  const detectedNewStatus = (device.status !== null && !itemGatewayInformationStatuses.includes(device.status));

  if (detectedNewStatus) {
    const cleanedData = removePersonalIdentifiableInformation(device);

    // If outdated, it means plugin may already have support.
    try {
      const outdated = await isPluginOutdated();

      if (outdated) {
        if (logger !== null) {
          logger.warn('Plugin has detected new gateway information. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode) {
          debugLog(logger, 'detect.ts / detectApiGatewayInformation()', 'warn', 'Plugin has detected new gateway information. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectApiGatewayInformation()', 'error', 'Failed to check if plugin is outdated');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to check if plugin is outdated later on.
      return false;
    }

    if (logger !== null) {
      logger.warn('Plugin has detected new gateway information. Notifying plugin author about this discovery ...');
    }

    // This is intentionally duplicated if using Homebridge debug mode.
    if (debugMode) {
      debugLog(logger, 'detect.ts / detectApiGatewayInformation()', 'warn', 'Plugin has detected new gateway information. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        getDetectReportUrl(),
        JSON.stringify(cleanedData, null, 2),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': `Detected new gateway information (v${getPackageVersion()})`,
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectApiGatewayInformation()', 'error', 'Failed to notify plugin author about the new gateway information');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detect api orb security buttons.
 *
 * @param {DetectApiOrbSecurityButtonsButtons}   buttons   - Buttons.
 * @param {DetectApiOrbSecurityButtonsLogger}    logger    - Logger.
 * @param {DetectApiOrbSecurityButtonsDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectApiOrbSecurityButtonsReturns}
 *
 * @since 1.0.0
 */
export async function detectApiOrbSecurityButtons(buttons: DetectApiOrbSecurityButtonsButtons, logger: DetectApiOrbSecurityButtonsLogger, debugMode: DetectApiOrbSecurityButtonsDebugMode): DetectApiOrbSecurityButtonsReturns {
  const detectedNewButtons = buttons.filter((button) => (
    (
      !button.buttonDisabled
      && (
        (
          button.buttonText !== null
          && !itemOrbSecurityButtonButtonTexts.includes(button.buttonText)
        )
        || !itemOrbSecurityButtonLoadingTexts.includes(button.loadingText)
        || !itemOrbSecurityButtonRelativeUrls.includes(button.relativeUrl)
        || !itemOrbSecurityButtonUrlParamsArms.includes(button.urlParams.arm)
        || !itemOrbSecurityButtonUrlParamsArmStates.includes(button.urlParams.armState)
        || !itemOrbSecurityButtonUrlParamsHrefs.includes(button.urlParams.href)
      )
    )
    || (
      button.buttonDisabled
      && (
        button.buttonText !== null
        && !itemOrbSecurityButtonLoadingTexts.includes(button.buttonText)
      )
    )
  ));

  if (detectedNewButtons.length > 0) {
    const cleanedData = removePersonalIdentifiableInformation(detectedNewButtons);

    // If outdated, it means plugin may already have support.
    try {
      const outdated = await isPluginOutdated();

      if (outdated) {
        if (logger !== null) {
          logger.warn('Plugin has detected new orb security buttons. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode) {
          debugLog(logger, 'detect.ts / detectApiOrbSecurityButtons()', 'warn', 'Plugin has detected new orb security buttons. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectApiOrbSecurityButtons()', 'error', 'Failed to check if plugin is outdated');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to check if plugin is outdated later on.
      return false;
    }

    if (logger !== null) {
      logger.warn('Plugin has detected new orb security buttons. Notifying plugin author about this discovery ...');
    }

    // This is intentionally duplicated if using Homebridge debug mode.
    if (debugMode) {
      debugLog(logger, 'detect.ts / detectApiOrbSecurityButtons()', 'warn', 'Plugin has detected new orb security buttons. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        getDetectReportUrl(),
        JSON.stringify(cleanedData, null, 2),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': `Detected new orb security buttons (v${getPackageVersion()})`,
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectApiOrbSecurityButtons()', 'error', 'Failed to notify plugin author about the new orb security buttons');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detect api panel information.
 *
 * @param {DetectApiPanelInformationDevice}    device    - Device.
 * @param {DetectApiPanelInformationLogger}    logger    - Logger.
 * @param {DetectApiPanelInformationDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectApiPanelInformationReturns}
 *
 * @since 1.0.0
 */
export async function detectApiPanelInformation(device: DetectApiPanelInformationDevice, logger: DetectApiPanelInformationLogger, debugMode: DetectApiPanelInformationDebugMode): DetectApiPanelInformationReturns {
  const detectedNewStatus = (device.status !== null && !itemPanelInformationStatuses.includes(device.status));

  if (detectedNewStatus) {
    const cleanedData = removePersonalIdentifiableInformation(device);

    // If outdated, it means plugin may already have support.
    try {
      const outdated = await isPluginOutdated();

      if (outdated) {
        if (logger !== null) {
          logger.warn('Plugin has detected new panel information. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode) {
          debugLog(logger, 'detect.ts / detectApiPanelInformation()', 'warn', 'Plugin has detected new panel information. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectApiPanelInformation()', 'error', 'Failed to check if plugin is outdated');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to check if plugin is outdated later on.
      return false;
    }

    if (logger !== null) {
      logger.warn('Plugin has detected new panel information. Notifying plugin author about this discovery ...');
    }

    // This is intentionally duplicated if using Homebridge debug mode.
    if (debugMode) {
      debugLog(logger, 'detect.ts / detectApiPanelInformation()', 'warn', 'Plugin has detected new panel information. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        getDetectReportUrl(),
        JSON.stringify(cleanedData, null, 2),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': `Detected new panel information (v${getPackageVersion()})`,
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectApiPanelInformation()', 'error', 'Failed to notify plugin author about the new panel information');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detect api panel status.
 *
 * @param {DetectApiPanelStatusSummary}   summary   - Summary.
 * @param {DetectApiPanelStatusLogger}    logger    - Logger.
 * @param {DetectApiPanelStatusDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectApiPanelStatusReturns}
 *
 * @since 1.0.0
 */
export async function detectApiPanelStatus(summary: DetectApiPanelStatusSummary, logger: DetectApiPanelStatusLogger, debugMode: DetectApiPanelStatusDebugMode): DetectApiPanelStatusReturns {
  const detectedUnknownPieces = summary.rawData.unknownPieces.length > 0;

  if (detectedUnknownPieces) {
    const cleanedData = removePersonalIdentifiableInformation(summary);

    // If outdated, it means plugin may already have support.
    try {
      const outdated = await isPluginOutdated();

      if (outdated) {
        if (logger !== null) {
          logger.warn('Plugin has detected a new panel state and/or status. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode) {
          debugLog(logger, 'detect.ts / detectApiPanelStatus()', 'warn', 'Plugin has detected a new panel state and/or status. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectApiPanelStatus()', 'error', 'Failed to check if plugin is outdated');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to check if plugin is outdated later on.
      return false;
    }

    if (logger !== null) {
      logger.warn('Plugin has detected a new panel state and/or status. Notifying plugin author about this discovery ...');
    }

    // This is intentionally duplicated if using Homebridge debug mode.
    if (debugMode) {
      debugLog(logger, 'detect.ts / detectApiPanelStatus()', 'warn', 'Plugin has detected a new panel state and/or status. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        getDetectReportUrl(),
        JSON.stringify(cleanedData, null, 2),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': `Detected a new panel state and/or status (v${getPackageVersion()})`,
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectApiPanelStatus()', 'error', 'Failed to notify plugin author about the new panel state and/or status');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detect api sensors information.
 *
 * @param {DetectApiSensorsInformationSensors}   sensors   - Sensors.
 * @param {DetectApiSensorsInformationLogger}    logger    - Logger.
 * @param {DetectApiSensorsInformationDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectApiSensorsInformationReturns}
 *
 * @since 1.0.0
 */
export async function detectApiSensorsInformation(sensors: DetectApiSensorsInformationSensors, logger: DetectApiSensorsInformationLogger, debugMode: DetectApiSensorsInformationDebugMode): DetectApiSensorsInformationReturns {
  const detectedNewInformation = sensors.filter((sensor) => (
    !itemSensorInformationDeviceTypes.includes(sensor.deviceType)
    || !itemSensorInformationStatuses.includes(sensor.status)
  ));

  if (detectedNewInformation.length > 0) {
    const cleanedData = removePersonalIdentifiableInformation(detectedNewInformation);

    // If outdated, it means plugin may already have support.
    try {
      const outdated = await isPluginOutdated();

      if (outdated) {
        if (logger !== null) {
          logger.warn('Plugin has detected new sensors information. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode) {
          debugLog(logger, 'detect.ts / detectApiSensorsInformation()', 'warn', 'Plugin has detected new sensors information. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectApiSensorsInformation()', 'error', 'Failed to check if plugin is outdated');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to check if plugin is outdated later on.
      return false;
    }

    if (logger !== null) {
      logger.warn('Plugin has detected new sensors information. Notifying plugin author about this discovery ...');
    }

    // This is intentionally duplicated if using Homebridge debug mode.
    if (debugMode) {
      debugLog(logger, 'detect.ts / detectApiSensorsInformation()', 'warn', 'Plugin has detected new sensors information. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        getDetectReportUrl(),
        JSON.stringify(cleanedData, null, 2),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': `Detected new sensors information (v${getPackageVersion()})`,
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectApiSensorsInformation()', 'error', 'Failed to notify plugin author about the new sensors information');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detect api sensors status.
 *
 * @param {DetectApiSensorsStatusSensors}   sensors   - Sensors.
 * @param {DetectApiSensorsStatusLogger}    logger    - Logger.
 * @param {DetectApiSensorsStatusDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectApiSensorsStatusReturns}
 *
 * @since 1.0.0
 */
export async function detectApiSensorsStatus(sensors: DetectApiSensorsStatusSensors, logger: DetectApiSensorsStatusLogger, debugMode: DetectApiSensorsStatusDebugMode): DetectApiSensorsStatusReturns {
  const detectedNewStatuses = sensors.filter((sensor) => !itemSensorStatusIcons.includes(sensor.icon) || sensor.statuses.some((sensorStatus) => !itemSensorStatusStatuses.includes(sensorStatus)));

  if (detectedNewStatuses.length > 0) {
    const cleanedData = removePersonalIdentifiableInformation(detectedNewStatuses);

    // If outdated, it means plugin may already have support.
    try {
      const outdated = await isPluginOutdated();

      if (outdated) {
        if (logger !== null) {
          logger.warn('Plugin has detected new sensors status. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode) {
          debugLog(logger, 'detect.ts / detectApiSensorsStatus()', 'warn', 'Plugin has detected new sensors status. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectApiSensorsStatus()', 'error', 'Failed to check if plugin is outdated');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to check if plugin is outdated later on.
      return false;
    }

    if (logger !== null) {
      logger.warn('Plugin has detected new sensors status. Notifying plugin author about this discovery ...');
    }

    // This is intentionally duplicated if using Homebridge debug mode.
    if (debugMode) {
      debugLog(logger, 'detect.ts / detectApiSensorsStatus()', 'warn', 'Plugin has detected new sensors status. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        getDetectReportUrl(),
        JSON.stringify(cleanedData, null, 2),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': `Detected new sensors status (v${getPackageVersion()})`,
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectApiSensorsStatus()', 'error', 'Failed to notify plugin author about the new sensors status');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detect global debug parser.
 *
 * @param {DetectGlobalDebugParserData}      data      - Data.
 * @param {DetectGlobalDebugParserLogger}    logger    - Logger.
 * @param {DetectGlobalDebugParserDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectGlobalDebugParserReturns}
 *
 * @since 1.0.0
 */
export async function detectGlobalDebugParser(data: DetectGlobalDebugParserData, logger: DetectGlobalDebugParserLogger, debugMode: DetectGlobalDebugParserDebugMode): DetectGlobalDebugParserReturns {
  const forceArmHandlerAnomaly = data.method === 'forceArmHandler' && isUnknownDoSubmitHandlerCollection(data.response) && !data.rawHtml.includes('p_whiteBoxMiddleCenter') && !data.rawHtml.includes('p_armDisarmWrapper');
  const generateSensorsConfigAnomaly = data.method === 'generateSensorsConfig' && data.response.length < 1;
  const getGatewayInformationAnomaly = data.method === 'getGatewayInformation' && isUnknownGatewayDevice(data.response);
  const getOrbSecurityButtonsAnomaly = data.method === 'getOrbSecurityButtons' && isUnknownOrbSecurityButtonCollection(data.response) && !data.rawHtml.includes('Status Unavailable');
  const getPanelInformationAnomaly = data.method === 'getPanelInformation' && isUnknownPanelDevice(data.response);
  const getPanelStatusAnomaly = data.method === 'getPanelStatus' && isEmptyOrbTextSummary(data.response);
  const getSensorsInformationAnomaly = data.method === 'getSensorsInformation' && data.response.length < 1;
  const getSensorsStatusAnomaly = data.method === 'getSensorsStatus' && data.response.length < 1 && !data.rawHtml.includes('id="orbSensorsList"');

  if (
    forceArmHandlerAnomaly
    || generateSensorsConfigAnomaly
    || getGatewayInformationAnomaly
    || getOrbSecurityButtonsAnomaly
    || getPanelInformationAnomaly
    || getPanelStatusAnomaly
    || getSensorsInformationAnomaly
    || getSensorsStatusAnomaly
  ) {
    // Unfortunately, modifying "data.rawHtml", which may include PII, would cause more unnecessary complexity.
    const cleanedData = removePersonalIdentifiableInformation(data);
    const loggedData = _.omit(cleanedData, ['rawHtml']);

    // If outdated, it means plugin may already have support.
    try {
      const outdated = await isPluginOutdated();

      if (outdated) {
        if (logger !== null) {
          logger.warn(`Plugin has detected a parser anomaly for "${data.method}". You are running an older plugin version, please update soon.`);
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode) {
          debugLog(logger, 'detect.ts / detectGlobalDebugParser()', 'warn', `Plugin has detected a parser anomaly for "${data.method}". You are running an older plugin version, please update soon`);
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectGlobalDebugParser()', 'error', 'Failed to check if plugin is outdated');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to check if plugin is outdated later on.
      return false;
    }

    if (logger !== null) {
      logger.warn(`Plugin has detected a parser anomaly for "${data.method}". Notifying plugin author about this discovery ...`);
    }

    // This is intentionally duplicated if using Homebridge debug mode.
    if (debugMode) {
      debugLog(logger, 'detect.ts / detectGlobalDebugParser()', 'warn', `Plugin has detected a parser anomaly for "${data.method}". Notifying plugin author about this discovery`);
    }

    // Show content being sent to author except for "data.rawHtml".
    stackTracer('detect-content', loggedData);

    try {
      await axios.post(
        getDetectReportUrl(),
        JSON.stringify(cleanedData, null, 2),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': `Detected a parser anomaly for "${data.method}" (v${getPackageVersion()})`,
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectGlobalDebugParser()', 'error', `Failed to notify plugin author about the parser anomaly for "${data.method}"`);
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detect global portal version.
 *
 * @param {DetectGlobalPortalVersionVersion}   version   - Version.
 * @param {DetectGlobalPortalVersionLogger}    logger    - Logger.
 * @param {DetectGlobalPortalVersionDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectGlobalPortalVersionReturns}
 *
 * @since 1.0.0
 */
export async function detectGlobalPortalVersion(version: DetectGlobalPortalVersionVersion, logger: DetectGlobalPortalVersionLogger, debugMode: DetectGlobalPortalVersionDebugMode): DetectGlobalPortalVersionReturns {
  const detectedNewVersion = (version.version !== null && !itemPortalVersions.includes(version.version));

  if (detectedNewVersion) {
    const cleanedData = removePersonalIdentifiableInformation(version);

    // If outdated, it means plugin may already have support.
    try {
      const outdated = await isPluginOutdated();

      if (outdated) {
        if (logger !== null) {
          logger.warn('Plugin has detected a new portal version. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode) {
          debugLog(logger, 'detect.ts / detectGlobalPortalVersion()', 'warn', 'Plugin has detected a new portal version. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectGlobalPortalVersion()', 'error', 'Failed to check if plugin is outdated');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to check if plugin is outdated later on.
      return false;
    }

    if (logger !== null) {
      logger.warn('Plugin has detected a new portal version. Notifying plugin author about this discovery ...');
    }

    // This is intentionally duplicated if using Homebridge debug mode.
    if (debugMode) {
      debugLog(logger, 'detect.ts / detectGlobalPortalVersion()', 'warn', 'Plugin has detected a new portal version. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        getDetectReportUrl(),
        JSON.stringify(cleanedData, null, 2),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': `Detected a new portal version (v${getPackageVersion()})`,
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectGlobalPortalVersion()', 'error', 'Failed to notify plugin author about the new portal version');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detect platform unknown sensors action.
 *
 * @param {DetectPlatformUnknownSensorsActionSensors}   sensors   - Sensors.
 * @param {DetectPlatformUnknownSensorsActionLogger}    logger    - Logger.
 * @param {DetectPlatformUnknownSensorsActionDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectPlatformUnknownSensorsActionReturns}
 *
 * @since 1.0.0
 */
export async function detectPlatformUnknownSensorsAction(sensors: DetectPlatformUnknownSensorsActionSensors, logger: DetectPlatformUnknownSensorsActionLogger, debugMode: DetectPlatformUnknownSensorsActionDebugMode): DetectPlatformUnknownSensorsActionReturns {
  const detectedNewActions = sensors.filter((sensor) => {
    const sensorStatusStatuses = sensor.status.statuses;
    const sensorType = sensor.type;

    const stringifiedStatuses = sensorStatusStatuses.join(', ');
    const currentType = collectionSensorActions.find((collectionSensorAction) => collectionSensorAction.type === sensorType);

    // Need to start with a list of documented actions for that sensor type.
    if (currentType === undefined) {
      return false;
    }

    // If status for that sensor type is documented, no need to continue.
    return !currentType.statuses.includes(stringifiedStatuses);
  });

  if (detectedNewActions.length > 0) {
    const cleanedData = removePersonalIdentifiableInformation(detectedNewActions);

    // If outdated, it means plugin may already have support.
    try {
      const outdated = await isPluginOutdated();

      if (outdated) {
        if (logger !== null) {
          logger.warn('Plugin has detected unknown sensors action. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode) {
          debugLog(logger, 'detect.ts / detectPlatformUnknownSensorsAction()', 'warn', 'Plugin has detected unknown sensors action. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectPlatformUnknownSensorsAction()', 'error', 'Failed to check if plugin is outdated');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to check if plugin is outdated later on.
      return false;
    }

    if (logger !== null) {
      logger.warn('Plugin has detected unknown sensors action. Notifying plugin author about this discovery ...');
    }

    // This is intentionally duplicated if using Homebridge debug mode.
    if (debugMode) {
      debugLog(logger, 'detect.ts / detectPlatformUnknownSensorsAction()', 'warn', 'Plugin has detected unknown sensors action. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        getDetectReportUrl(),
        JSON.stringify(cleanedData, null, 2),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': `Detected unknown sensors action (v${getPackageVersion()})`,
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectPlatformUnknownSensorsAction()', 'error', 'Failed to notify plugin author about the unknown sensors action');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}
