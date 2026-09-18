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
} from './items.js';
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
} from './utility.js';

import type {
  Lib_Detect_DetectApiDoSubmitHandlers_CleanedData,
  Lib_Detect_DetectApiDoSubmitHandlers_DebugMode,
  Lib_Detect_DetectApiDoSubmitHandlers_DetectedNewHandlers,
  Lib_Detect_DetectApiDoSubmitHandlers_Handlers,
  Lib_Detect_DetectApiDoSubmitHandlers_Logger,
  Lib_Detect_DetectApiDoSubmitHandlers_Outdated,
  Lib_Detect_DetectApiDoSubmitHandlers_Returns,
  Lib_Detect_DetectApiGatewayInformation_CleanedData,
  Lib_Detect_DetectApiGatewayInformation_DebugMode,
  Lib_Detect_DetectApiGatewayInformation_Device,
  Lib_Detect_DetectApiGatewayInformation_Logger,
  Lib_Detect_DetectApiGatewayInformation_Outdated,
  Lib_Detect_DetectApiGatewayInformation_Returns,
  Lib_Detect_DetectApiOrbSecurityButtons_Buttons,
  Lib_Detect_DetectApiOrbSecurityButtons_CleanedData,
  Lib_Detect_DetectApiOrbSecurityButtons_DebugMode,
  Lib_Detect_DetectApiOrbSecurityButtons_DetectedNewButtons,
  Lib_Detect_DetectApiOrbSecurityButtons_Logger,
  Lib_Detect_DetectApiOrbSecurityButtons_Outdated,
  Lib_Detect_DetectApiOrbSecurityButtons_Returns,
  Lib_Detect_DetectApiPanelInformation_CleanedData,
  Lib_Detect_DetectApiPanelInformation_DebugMode,
  Lib_Detect_DetectApiPanelInformation_Device,
  Lib_Detect_DetectApiPanelInformation_Logger,
  Lib_Detect_DetectApiPanelInformation_Outdated,
  Lib_Detect_DetectApiPanelInformation_Returns,
  Lib_Detect_DetectApiPanelStatus_CleanedData,
  Lib_Detect_DetectApiPanelStatus_DebugMode,
  Lib_Detect_DetectApiPanelStatus_DetectedUnknownPieces,
  Lib_Detect_DetectApiPanelStatus_Logger,
  Lib_Detect_DetectApiPanelStatus_Outdated,
  Lib_Detect_DetectApiPanelStatus_Returns,
  Lib_Detect_DetectApiPanelStatus_Summary,
  Lib_Detect_DetectApiSensorsInformation_CleanedData,
  Lib_Detect_DetectApiSensorsInformation_DebugMode,
  Lib_Detect_DetectApiSensorsInformation_DetectedNewInformation,
  Lib_Detect_DetectApiSensorsInformation_Logger,
  Lib_Detect_DetectApiSensorsInformation_Outdated,
  Lib_Detect_DetectApiSensorsInformation_Returns,
  Lib_Detect_DetectApiSensorsInformation_Sensors,
  Lib_Detect_DetectApiSensorsStatus_CleanedData,
  Lib_Detect_DetectApiSensorsStatus_DebugMode,
  Lib_Detect_DetectApiSensorsStatus_DetectedNewStatuses,
  Lib_Detect_DetectApiSensorsStatus_Logger,
  Lib_Detect_DetectApiSensorsStatus_Outdated,
  Lib_Detect_DetectApiSensorsStatus_Returns,
  Lib_Detect_DetectApiSensorsStatus_Sensors,
  Lib_Detect_DetectGlobalDebugParser_CleanedData,
  Lib_Detect_DetectGlobalDebugParser_Data,
  Lib_Detect_DetectGlobalDebugParser_DebugMode,
  Lib_Detect_DetectGlobalDebugParser_ForceArmHandlerAnomaly,
  Lib_Detect_DetectGlobalDebugParser_GenerateSensorsConfigAnomaly,
  Lib_Detect_DetectGlobalDebugParser_GetGatewayInformationAnomaly,
  Lib_Detect_DetectGlobalDebugParser_GetOrbSecurityButtonsAnomaly,
  Lib_Detect_DetectGlobalDebugParser_GetPanelInformationAnomaly,
  Lib_Detect_DetectGlobalDebugParser_GetPanelStatusAnomaly,
  Lib_Detect_DetectGlobalDebugParser_GetSensorsInformationAnomaly,
  Lib_Detect_DetectGlobalDebugParser_GetSensorsStatusAnomaly,
  Lib_Detect_DetectGlobalDebugParser_LoggedData,
  Lib_Detect_DetectGlobalDebugParser_Logger,
  Lib_Detect_DetectGlobalDebugParser_Outdated,
  Lib_Detect_DetectGlobalDebugParser_Returns,
  Lib_Detect_DetectGlobalPortalVersion_CleanedData,
  Lib_Detect_DetectGlobalPortalVersion_DebugMode,
  Lib_Detect_DetectGlobalPortalVersion_Logger,
  Lib_Detect_DetectGlobalPortalVersion_Outdated,
  Lib_Detect_DetectGlobalPortalVersion_Returns,
  Lib_Detect_DetectGlobalPortalVersion_Version,
  Lib_Detect_DetectPlatformUnknownSensorsAction_CleanedData,
  Lib_Detect_DetectPlatformUnknownSensorsAction_CurrentType,
  Lib_Detect_DetectPlatformUnknownSensorsAction_DebugMode,
  Lib_Detect_DetectPlatformUnknownSensorsAction_DetectedNewActions,
  Lib_Detect_DetectPlatformUnknownSensorsAction_Logger,
  Lib_Detect_DetectPlatformUnknownSensorsAction_Outdated,
  Lib_Detect_DetectPlatformUnknownSensorsAction_Returns,
  Lib_Detect_DetectPlatformUnknownSensorsAction_Sensors,
  Lib_Detect_DetectPlatformUnknownSensorsAction_SensorStatusStatuses,
  Lib_Detect_DetectPlatformUnknownSensorsAction_SensorType,
  Lib_Detect_DetectPlatformUnknownSensorsAction_StringifiedStatuses,
} from '../types/lib/detect.d.ts';

/**
 * Lib - Detect - API Do Submit Handlers.
 *
 * Checks the parsed do submit handlers against the documented baseline and
 * reports undocumented shapes to the plugin author so support can be added.
 *
 * @param {Lib_Detect_DetectApiDoSubmitHandlers_Handlers}  handlers  - Handlers.
 * @param {Lib_Detect_DetectApiDoSubmitHandlers_Logger}    logger    - Logger.
 * @param {Lib_Detect_DetectApiDoSubmitHandlers_DebugMode} debugMode - Debug mode.
 *
 * @returns {Lib_Detect_DetectApiDoSubmitHandlers_Returns}
 *
 * @since 1.0.0
 */
export async function detectApiDoSubmitHandlers(handlers: Lib_Detect_DetectApiDoSubmitHandlers_Handlers, logger: Lib_Detect_DetectApiDoSubmitHandlers_Logger, debugMode: Lib_Detect_DetectApiDoSubmitHandlers_DebugMode): Lib_Detect_DetectApiDoSubmitHandlers_Returns {
  const detectedNewHandlers: Lib_Detect_DetectApiDoSubmitHandlers_DetectedNewHandlers = handlers.filter((handler) => (
    itemDoSubmitHandlerRelativeUrls.includes(handler['relativeUrl']) === false
    || (
      handler['urlParams']['arm'] !== null
      && itemDoSubmitHandlerUrlParamsArms.includes(handler['urlParams']['arm']) === false
    )
    || (
      handler['urlParams']['armState'] !== null
      && itemDoSubmitHandlerUrlParamsArmStates.includes(handler['urlParams']['armState']) === false
    )
    || itemDoSubmitHandlerUrlParamsHrefs.includes(handler['urlParams']['href']) === false
  ));

  if (detectedNewHandlers.length > 0) {
    const cleanedData: Lib_Detect_DetectApiDoSubmitHandlers_CleanedData = removePersonalIdentifiableInformation(detectedNewHandlers);

    // If outdated, it means plugin may already have support.
    try {
      const outdated: Lib_Detect_DetectApiDoSubmitHandlers_Outdated = await isPluginOutdated();

      if (outdated === true) {
        if (logger !== null) {
          logger.warn('Plugin has detected new do submit handlers. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode === true) {
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
    if (debugMode === true) {
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
 * Lib - Detect - API Gateway Information.
 *
 * Compares the parsed gateway status against the documented list and reports
 * undocumented values to the plugin author so support can be added quickly.
 *
 * @param {Lib_Detect_DetectApiGatewayInformation_Device}    device    - Device.
 * @param {Lib_Detect_DetectApiGatewayInformation_Logger}    logger    - Logger.
 * @param {Lib_Detect_DetectApiGatewayInformation_DebugMode} debugMode - Debug mode.
 *
 * @returns {Lib_Detect_DetectApiGatewayInformation_Returns}
 *
 * @since 1.0.0
 */
export async function detectApiGatewayInformation(device: Lib_Detect_DetectApiGatewayInformation_Device, logger: Lib_Detect_DetectApiGatewayInformation_Logger, debugMode: Lib_Detect_DetectApiGatewayInformation_DebugMode): Lib_Detect_DetectApiGatewayInformation_Returns {
  if (device['status'] !== null && itemGatewayInformationStatuses.includes(device['status']) === false) {
    const cleanedData: Lib_Detect_DetectApiGatewayInformation_CleanedData = removePersonalIdentifiableInformation(device);

    // If outdated, it means plugin may already have support.
    try {
      const outdated: Lib_Detect_DetectApiGatewayInformation_Outdated = await isPluginOutdated();

      if (outdated === true) {
        if (logger !== null) {
          logger.warn('Plugin has detected new gateway information. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode === true) {
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
    if (debugMode === true) {
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
 * Lib - Detect - API Orb Security Buttons.
 *
 * Compares the parsed orb security buttons against the documented baseline and
 * reports undocumented values to the plugin author so support can be added.
 *
 * @param {Lib_Detect_DetectApiOrbSecurityButtons_Buttons}   buttons   - Buttons.
 * @param {Lib_Detect_DetectApiOrbSecurityButtons_Logger}    logger    - Logger.
 * @param {Lib_Detect_DetectApiOrbSecurityButtons_DebugMode} debugMode - Debug mode.
 *
 * @returns {Lib_Detect_DetectApiOrbSecurityButtons_Returns}
 *
 * @since 1.0.0
 */
export async function detectApiOrbSecurityButtons(buttons: Lib_Detect_DetectApiOrbSecurityButtons_Buttons, logger: Lib_Detect_DetectApiOrbSecurityButtons_Logger, debugMode: Lib_Detect_DetectApiOrbSecurityButtons_DebugMode): Lib_Detect_DetectApiOrbSecurityButtons_Returns {
  const detectedNewButtons: Lib_Detect_DetectApiOrbSecurityButtons_DetectedNewButtons = buttons.filter((button) => (
    (
      button['buttonDisabled'] === false
      && (
        (
          button['buttonText'] !== null
          && itemOrbSecurityButtonButtonTexts.includes(button['buttonText']) === false
        )
        || itemOrbSecurityButtonLoadingTexts.includes(button['loadingText']) === false
        || itemOrbSecurityButtonRelativeUrls.includes(button['relativeUrl']) === false
        || itemOrbSecurityButtonUrlParamsArms.includes(button['urlParams']['arm']) === false
        || itemOrbSecurityButtonUrlParamsArmStates.includes(button['urlParams']['armState']) === false
        || itemOrbSecurityButtonUrlParamsHrefs.includes(button['urlParams']['href']) === false
      )
    )
    || (
      button['buttonDisabled'] === true
      && (
        button['buttonText'] !== null
        && itemOrbSecurityButtonLoadingTexts.includes(button['buttonText']) === false
      )
    )
  ));

  if (detectedNewButtons.length > 0) {
    const cleanedData: Lib_Detect_DetectApiOrbSecurityButtons_CleanedData = removePersonalIdentifiableInformation(detectedNewButtons);

    // If outdated, it means plugin may already have support.
    try {
      const outdated: Lib_Detect_DetectApiOrbSecurityButtons_Outdated = await isPluginOutdated();

      if (outdated === true) {
        if (logger !== null) {
          logger.warn('Plugin has detected new orb security buttons. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode === true) {
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
    if (debugMode === true) {
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
 * Lib - Detect - API Panel Information.
 *
 * Compares the parsed panel status against the documented list and reports
 * undocumented values to the plugin author so support can be added quickly.
 *
 * @param {Lib_Detect_DetectApiPanelInformation_Device}    device    - Device.
 * @param {Lib_Detect_DetectApiPanelInformation_Logger}    logger    - Logger.
 * @param {Lib_Detect_DetectApiPanelInformation_DebugMode} debugMode - Debug mode.
 *
 * @returns {Lib_Detect_DetectApiPanelInformation_Returns}
 *
 * @since 1.0.0
 */
export async function detectApiPanelInformation(device: Lib_Detect_DetectApiPanelInformation_Device, logger: Lib_Detect_DetectApiPanelInformation_Logger, debugMode: Lib_Detect_DetectApiPanelInformation_DebugMode): Lib_Detect_DetectApiPanelInformation_Returns {
  if (device['status'] !== null && itemPanelInformationStatuses.includes(device['status']) === false) {
    const cleanedData: Lib_Detect_DetectApiPanelInformation_CleanedData = removePersonalIdentifiableInformation(device);

    // If outdated, it means plugin may already have support.
    try {
      const outdated: Lib_Detect_DetectApiPanelInformation_Outdated = await isPluginOutdated();

      if (outdated === true) {
        if (logger !== null) {
          logger.warn('Plugin has detected new panel information. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode === true) {
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
    if (debugMode === true) {
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
 * Lib - Detect - API Panel Status.
 *
 * Watches for unknown pieces inside the parsed panel summary and reports them
 * to the plugin author so new panel states and statuses can be supported.
 *
 * @param {Lib_Detect_DetectApiPanelStatus_Summary}   summary   - Summary.
 * @param {Lib_Detect_DetectApiPanelStatus_Logger}    logger    - Logger.
 * @param {Lib_Detect_DetectApiPanelStatus_DebugMode} debugMode - Debug mode.
 *
 * @returns {Lib_Detect_DetectApiPanelStatus_Returns}
 *
 * @since 1.0.0
 */
export async function detectApiPanelStatus(summary: Lib_Detect_DetectApiPanelStatus_Summary, logger: Lib_Detect_DetectApiPanelStatus_Logger, debugMode: Lib_Detect_DetectApiPanelStatus_DebugMode): Lib_Detect_DetectApiPanelStatus_Returns {
  const detectedUnknownPieces: Lib_Detect_DetectApiPanelStatus_DetectedUnknownPieces = summary['rawData']['unknownPieces'].length > 0;

  if (detectedUnknownPieces === true) {
    const cleanedData: Lib_Detect_DetectApiPanelStatus_CleanedData = removePersonalIdentifiableInformation(summary);

    // If outdated, it means plugin may already have support.
    try {
      const outdated: Lib_Detect_DetectApiPanelStatus_Outdated = await isPluginOutdated();

      if (outdated === true) {
        if (logger !== null) {
          logger.warn('Plugin has detected a new panel state and/or status. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode === true) {
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
    if (debugMode === true) {
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
 * Lib - Detect - API Sensors Information.
 *
 * Compares the parsed sensors information against the documented device types
 * and statuses, then reports undocumented values to the plugin author.
 *
 * @param {Lib_Detect_DetectApiSensorsInformation_Sensors}   sensors   - Sensors.
 * @param {Lib_Detect_DetectApiSensorsInformation_Logger}    logger    - Logger.
 * @param {Lib_Detect_DetectApiSensorsInformation_DebugMode} debugMode - Debug mode.
 *
 * @returns {Lib_Detect_DetectApiSensorsInformation_Returns}
 *
 * @since 1.0.0
 */
export async function detectApiSensorsInformation(sensors: Lib_Detect_DetectApiSensorsInformation_Sensors, logger: Lib_Detect_DetectApiSensorsInformation_Logger, debugMode: Lib_Detect_DetectApiSensorsInformation_DebugMode): Lib_Detect_DetectApiSensorsInformation_Returns {
  const detectedNewInformation: Lib_Detect_DetectApiSensorsInformation_DetectedNewInformation = sensors.filter((sensor) => (
    itemSensorInformationDeviceTypes.includes(sensor['deviceType']) === false
    || itemSensorInformationStatuses.includes(sensor['status']) === false
  ));

  if (detectedNewInformation.length > 0) {
    const cleanedData: Lib_Detect_DetectApiSensorsInformation_CleanedData = removePersonalIdentifiableInformation(detectedNewInformation);

    // If outdated, it means plugin may already have support.
    try {
      const outdated: Lib_Detect_DetectApiSensorsInformation_Outdated = await isPluginOutdated();

      if (outdated === true) {
        if (logger !== null) {
          logger.warn('Plugin has detected new sensors information. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode === true) {
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
    if (debugMode === true) {
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
 * Lib - Detect - API Sensors Status.
 *
 * Compares the parsed sensors status against the documented icons and statuses,
 * then reports undocumented values to the plugin author so support can be added.
 *
 * @param {Lib_Detect_DetectApiSensorsStatus_Sensors}   sensors   - Sensors.
 * @param {Lib_Detect_DetectApiSensorsStatus_Logger}    logger    - Logger.
 * @param {Lib_Detect_DetectApiSensorsStatus_DebugMode} debugMode - Debug mode.
 *
 * @returns {Lib_Detect_DetectApiSensorsStatus_Returns}
 *
 * @since 1.0.0
 */
export async function detectApiSensorsStatus(sensors: Lib_Detect_DetectApiSensorsStatus_Sensors, logger: Lib_Detect_DetectApiSensorsStatus_Logger, debugMode: Lib_Detect_DetectApiSensorsStatus_DebugMode): Lib_Detect_DetectApiSensorsStatus_Returns {
  const detectedNewStatuses: Lib_Detect_DetectApiSensorsStatus_DetectedNewStatuses = sensors.filter((sensor) => itemSensorStatusIcons.includes(sensor['icon']) === false || sensor['statuses'].some((sensorStatus) => itemSensorStatusStatuses.includes(sensorStatus) === false));

  if (detectedNewStatuses.length > 0) {
    const cleanedData: Lib_Detect_DetectApiSensorsStatus_CleanedData = removePersonalIdentifiableInformation(detectedNewStatuses);

    // If outdated, it means plugin may already have support.
    try {
      const outdated: Lib_Detect_DetectApiSensorsStatus_Outdated = await isPluginOutdated();

      if (outdated === true) {
        if (logger !== null) {
          logger.warn('Plugin has detected new sensors status. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode === true) {
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
    if (debugMode === true) {
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
 * Lib - Detect - Global Debug Parser.
 *
 * Watches parser output for anomalies that suggest the portal markup changed
 * and reports them to the plugin author so parsing logic can be updated.
 *
 * @param {Lib_Detect_DetectGlobalDebugParser_Data}      data      - Data.
 * @param {Lib_Detect_DetectGlobalDebugParser_Logger}    logger    - Logger.
 * @param {Lib_Detect_DetectGlobalDebugParser_DebugMode} debugMode - Debug mode.
 *
 * @returns {Lib_Detect_DetectGlobalDebugParser_Returns}
 *
 * @since 1.0.0
 */
export async function detectGlobalDebugParser(data: Lib_Detect_DetectGlobalDebugParser_Data, logger: Lib_Detect_DetectGlobalDebugParser_Logger, debugMode: Lib_Detect_DetectGlobalDebugParser_DebugMode): Lib_Detect_DetectGlobalDebugParser_Returns {
  const forceArmHandlerAnomaly: Lib_Detect_DetectGlobalDebugParser_ForceArmHandlerAnomaly = (
    data['method'] === 'forceArmHandler'
    && isUnknownDoSubmitHandlerCollection(data['response'])
    && data['rawHtml'].includes('p_whiteBoxMiddleCenter') === false
    && data['rawHtml'].includes('p_armDisarmWrapper') === false
  );
  const generateSensorsConfigAnomaly: Lib_Detect_DetectGlobalDebugParser_GenerateSensorsConfigAnomaly = data['method'] === 'generateSensorsConfig' && data['response'].length < 1;
  const getGatewayInformationAnomaly: Lib_Detect_DetectGlobalDebugParser_GetGatewayInformationAnomaly = data['method'] === 'getGatewayInformation' && isUnknownGatewayDevice(data['response']);
  const getOrbSecurityButtonsAnomaly: Lib_Detect_DetectGlobalDebugParser_GetOrbSecurityButtonsAnomaly = (
    data['method'] === 'getOrbSecurityButtons'
    && isUnknownOrbSecurityButtonCollection(data['response'])
    && data['rawHtml'].includes('Status Unavailable') === false
  );
  const getPanelInformationAnomaly: Lib_Detect_DetectGlobalDebugParser_GetPanelInformationAnomaly = data['method'] === 'getPanelInformation' && isUnknownPanelDevice(data['response']);
  const getPanelStatusAnomaly: Lib_Detect_DetectGlobalDebugParser_GetPanelStatusAnomaly = data['method'] === 'getPanelStatus' && isEmptyOrbTextSummary(data['response']);
  const getSensorsInformationAnomaly: Lib_Detect_DetectGlobalDebugParser_GetSensorsInformationAnomaly = data['method'] === 'getSensorsInformation' && data['response'].length < 1;
  const getSensorsStatusAnomaly: Lib_Detect_DetectGlobalDebugParser_GetSensorsStatusAnomaly = (
    data['method'] === 'getSensorsStatus'
    && data['response'].length < 1
    && data['rawHtml'].includes('id="orbSensorsList"') === false
  );

  if (
    forceArmHandlerAnomaly === true
    || generateSensorsConfigAnomaly === true
    || getGatewayInformationAnomaly === true
    || getOrbSecurityButtonsAnomaly === true
    || getPanelInformationAnomaly === true
    || getPanelStatusAnomaly === true
    || getSensorsInformationAnomaly === true
    || getSensorsStatusAnomaly === true
  ) {
    // Unfortunately, modifying "data.rawHtml", which may include PII, would cause more unnecessary complexity.
    const cleanedData: Lib_Detect_DetectGlobalDebugParser_CleanedData = removePersonalIdentifiableInformation(data);
    const loggedData: Lib_Detect_DetectGlobalDebugParser_LoggedData = _.omit(cleanedData, ['rawHtml']);

    // If outdated, it means plugin may already have support.
    try {
      const outdated: Lib_Detect_DetectGlobalDebugParser_Outdated = await isPluginOutdated();

      if (outdated === true) {
        if (logger !== null) {
          logger.warn(`Plugin has detected a parser anomaly for "${data['method']}". You are running an older plugin version, please update soon.`);
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode === true) {
          debugLog(logger, 'detect.ts / detectGlobalDebugParser()', 'warn', `Plugin has detected a parser anomaly for "${data['method']}". You are running an older plugin version, please update soon`);
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
      logger.warn(`Plugin has detected a parser anomaly for "${data['method']}". Notifying plugin author about this discovery ...`);
    }

    // This is intentionally duplicated if using Homebridge debug mode.
    if (debugMode === true) {
      debugLog(logger, 'detect.ts / detectGlobalDebugParser()', 'warn', `Plugin has detected a parser anomaly for "${data['method']}". Notifying plugin author about this discovery`);
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
            'X-Title': `Detected a parser anomaly for "${data['method']}" (v${getPackageVersion()})`,
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectGlobalDebugParser()', 'error', `Failed to notify plugin author about the parser anomaly for "${data['method']}"`);
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Lib - Detect - Global Portal Version.
 *
 * Compares the parsed portal version against the documented list and reports
 * undocumented versions to the plugin author so compatibility can be verified.
 *
 * @param {Lib_Detect_DetectGlobalPortalVersion_Version}   version   - Version.
 * @param {Lib_Detect_DetectGlobalPortalVersion_Logger}    logger    - Logger.
 * @param {Lib_Detect_DetectGlobalPortalVersion_DebugMode} debugMode - Debug mode.
 *
 * @returns {Lib_Detect_DetectGlobalPortalVersion_Returns}
 *
 * @since 1.0.0
 */
export async function detectGlobalPortalVersion(version: Lib_Detect_DetectGlobalPortalVersion_Version, logger: Lib_Detect_DetectGlobalPortalVersion_Logger, debugMode: Lib_Detect_DetectGlobalPortalVersion_DebugMode): Lib_Detect_DetectGlobalPortalVersion_Returns {
  if (version['version'] !== null && itemPortalVersions.includes(version['version']) === false) {
    const cleanedData: Lib_Detect_DetectGlobalPortalVersion_CleanedData = removePersonalIdentifiableInformation(version);

    // If outdated, it means plugin may already have support.
    try {
      const outdated: Lib_Detect_DetectGlobalPortalVersion_Outdated = await isPluginOutdated();

      if (outdated === true) {
        if (logger !== null) {
          logger.warn('Plugin has detected a new portal version. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode === true) {
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
    if (debugMode === true) {
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
 * Lib - Detect - Platform Unknown Sensors Action.
 *
 * Compares each sensor status against the documented actions for its sensor
 * type and reports undocumented combinations to the plugin author.
 *
 * @param {Lib_Detect_DetectPlatformUnknownSensorsAction_Sensors}   sensors   - Sensors.
 * @param {Lib_Detect_DetectPlatformUnknownSensorsAction_Logger}    logger    - Logger.
 * @param {Lib_Detect_DetectPlatformUnknownSensorsAction_DebugMode} debugMode - Debug mode.
 *
 * @returns {Lib_Detect_DetectPlatformUnknownSensorsAction_Returns}
 *
 * @since 1.0.0
 */
export async function detectPlatformUnknownSensorsAction(sensors: Lib_Detect_DetectPlatformUnknownSensorsAction_Sensors, logger: Lib_Detect_DetectPlatformUnknownSensorsAction_Logger, debugMode: Lib_Detect_DetectPlatformUnknownSensorsAction_DebugMode): Lib_Detect_DetectPlatformUnknownSensorsAction_Returns {
  const detectedNewActions: Lib_Detect_DetectPlatformUnknownSensorsAction_DetectedNewActions = sensors.filter((sensor) => {
    const sensorStatusStatuses: Lib_Detect_DetectPlatformUnknownSensorsAction_SensorStatusStatuses = sensor['status']['statuses'];
    const sensorType: Lib_Detect_DetectPlatformUnknownSensorsAction_SensorType = sensor['type'];

    const stringifiedStatuses: Lib_Detect_DetectPlatformUnknownSensorsAction_StringifiedStatuses = sensorStatusStatuses.join(', ');
    const currentType: Lib_Detect_DetectPlatformUnknownSensorsAction_CurrentType = collectionSensorActions.find((collectionSensorAction) => collectionSensorAction['type'] === sensorType);

    // Need to start with a list of documented actions for that sensor type.
    if (currentType === undefined) {
      return false;
    }

    // If status for that sensor type is documented, no need to continue.
    return currentType['statuses'].includes(stringifiedStatuses) === false;
  });

  if (detectedNewActions.length > 0) {
    const cleanedData: Lib_Detect_DetectPlatformUnknownSensorsAction_CleanedData = removePersonalIdentifiableInformation(detectedNewActions);

    // If outdated, it means plugin may already have support.
    try {
      const outdated: Lib_Detect_DetectPlatformUnknownSensorsAction_Outdated = await isPluginOutdated();

      if (outdated === true) {
        if (logger !== null) {
          logger.warn('Plugin has detected unknown sensors action. You are running an older plugin version, please update soon.');
        }

        // This is intentionally duplicated if using Homebridge debug mode.
        if (debugMode === true) {
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
    if (debugMode === true) {
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
