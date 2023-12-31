import axios from 'axios';
import { serializeError } from 'serialize-error';

import {
  doSubmitHandlerRelativeUrlItems,
  doSubmitHandlerUrlParamsArmItems,
  doSubmitHandlerUrlParamsArmStateItems,
  doSubmitHandlerUrlParamsHrefItems,
  gatewayInformationStatusItems,
  orbSecurityButtonButtonTextItems,
  orbSecurityButtonLoadingTextItems,
  orbSecurityButtonRelativeUrlItems,
  orbSecurityButtonUrlParamsArmItems,
  orbSecurityButtonUrlParamsArmStateItems,
  orbSecurityButtonUrlParamsHrefItems,
  panelInformationStatusItems,
  portalVersionItems,
  sensorInformationDeviceTypeItems,
  sensorInformationStatusItems,
  sensorStatusIconItems,
  sensorStatusStatusItems,
} from '@/lib/items.js';
import {
  debugLog,
  isPluginOutdated,
  removePersonalIdentifiableInformation,
  stackTracer,
} from '@/lib/utility.js';
import type {
  DetectedNewDoSubmitHandlersDebugMode,
  DetectedNewDoSubmitHandlersHandlers,
  DetectedNewDoSubmitHandlersLogger,
  DetectedNewDoSubmitHandlersReturns,
  DetectedNewGatewayInformationDebugMode,
  DetectedNewGatewayInformationDevice,
  DetectedNewGatewayInformationLogger,
  DetectedNewGatewayInformationReturns,
  DetectedNewOrbSecurityButtonsButtons,
  DetectedNewOrbSecurityButtonsDebugMode,
  DetectedNewOrbSecurityButtonsLogger,
  DetectedNewOrbSecurityButtonsReturns,
  DetectedNewPanelInformationDebugMode,
  DetectedNewPanelInformationDevice,
  DetectedNewPanelInformationLogger,
  DetectedNewPanelInformationReturns,
  DetectedNewPanelStatusDebugMode,
  DetectedNewPanelStatusLogger,
  DetectedNewPanelStatusReturns,
  DetectedNewPanelStatusSummary,
  DetectedNewPortalVersionDebugMode,
  DetectedNewPortalVersionLogger,
  DetectedNewPortalVersionReturns,
  DetectedNewPortalVersionVersion,
  DetectedNewSensorsInformationDebugMode,
  DetectedNewSensorsInformationLogger,
  DetectedNewSensorsInformationReturns,
  DetectedNewSensorsInformationSensors,
  DetectedNewSensorsStatusDebugMode,
  DetectedNewSensorsStatusLogger,
  DetectedNewSensorsStatusReturns,
  DetectedNewSensorsStatusSensors,
  DetectedUnknownAccessoryActionData,
  DetectedUnknownAccessoryActionDebugMode,
  DetectedUnknownAccessoryActionLogger,
  DetectedUnknownAccessoryActionReturns,
} from '@/types/index.d.ts';

/**
 * Detected new do submit handlers.
 *
 * @param {DetectedNewDoSubmitHandlersHandlers}  handlers  - Handlers.
 * @param {DetectedNewDoSubmitHandlersLogger}    logger    - Logger.
 * @param {DetectedNewDoSubmitHandlersDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectedNewDoSubmitHandlersReturns}
 *
 * @since 1.0.0
 */
export async function detectedNewDoSubmitHandlers(handlers: DetectedNewDoSubmitHandlersHandlers, logger: DetectedNewDoSubmitHandlersLogger, debugMode: DetectedNewDoSubmitHandlersDebugMode): DetectedNewDoSubmitHandlersReturns {
  const detectedNewHandlers = handlers.filter((handler) => (
    !doSubmitHandlerRelativeUrlItems.includes(handler.relativeUrl)
    || (
      handler.urlParams.arm !== null
      && !doSubmitHandlerUrlParamsArmItems.includes(handler.urlParams.arm)
    )
    || (
      handler.urlParams.armState !== null
      && !doSubmitHandlerUrlParamsArmStateItems.includes(handler.urlParams.armState)
    )
    || !doSubmitHandlerUrlParamsHrefItems.includes(handler.urlParams.href)
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
          debugLog(logger, 'detect.ts / detectedNewDoSubmitHandlers()', 'warn', 'Plugin has detected new do submit handlers. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewDoSubmitHandlers()', 'error', 'Failed to check if plugin is outdated');
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
      debugLog(logger, 'detect.ts / detectedNewDoSubmitHandlers()', 'warn', 'Plugin has detected new do submit handlers. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        'https://fs65kt4c5xf8.ntfy.mrjackyliang.com',
        [
          'Please update the plugin as soon as possible.',
          JSON.stringify(cleanedData, null, 2),
        ].join('\n\n'),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': 'Detected new do submit handlers',
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewDoSubmitHandlers()', 'error', 'Failed to notify plugin author about the new do submit handlers');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detected new gateway information.
 *
 * @param {DetectedNewGatewayInformationDevice}    device    - Device.
 * @param {DetectedNewGatewayInformationLogger}    logger    - Logger.
 * @param {DetectedNewGatewayInformationDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectedNewGatewayInformationReturns}
 *
 * @since 1.0.0
 */
export async function detectedNewGatewayInformation(device: DetectedNewGatewayInformationDevice, logger: DetectedNewGatewayInformationLogger, debugMode: DetectedNewGatewayInformationDebugMode): DetectedNewGatewayInformationReturns {
  const detectedNewStatus = (device.status !== null && !gatewayInformationStatusItems.includes(device.status));

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
          debugLog(logger, 'detect.ts / detectedNewGatewayInformation()', 'warn', 'Plugin has detected new gateway information. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewGatewayInformation()', 'error', 'Failed to check if plugin is outdated');
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
      debugLog(logger, 'detect.ts / detectedNewGatewayInformation()', 'warn', 'Plugin has detected new gateway information. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        'https://fs65kt4c5xf8.ntfy.mrjackyliang.com',
        [
          'Please update the plugin as soon as possible.',
          JSON.stringify(cleanedData, null, 2),
        ].join('\n\n'),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': 'Detected new gateway information',
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewGatewayInformation()', 'error', 'Failed to notify plugin author about the new gateway information');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detected new orb security buttons.
 *
 * @param {DetectedNewOrbSecurityButtonsButtons}   buttons   - Buttons.
 * @param {DetectedNewOrbSecurityButtonsLogger}    logger    - Logger.
 * @param {DetectedNewOrbSecurityButtonsDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectedNewOrbSecurityButtonsReturns}
 *
 * @since 1.0.0
 */
export async function detectedNewOrbSecurityButtons(buttons: DetectedNewOrbSecurityButtonsButtons, logger: DetectedNewOrbSecurityButtonsLogger, debugMode: DetectedNewOrbSecurityButtonsDebugMode): DetectedNewOrbSecurityButtonsReturns {
  const detectedNewButtons = buttons.filter((button) => (
    (
      !button.buttonDisabled
      && (
        (
          button.buttonText !== null
          && !orbSecurityButtonButtonTextItems.includes(button.buttonText)
        )
        || !orbSecurityButtonLoadingTextItems.includes(button.loadingText)
        || !orbSecurityButtonRelativeUrlItems.includes(button.relativeUrl)
        || !orbSecurityButtonUrlParamsArmItems.includes(button.urlParams.arm)
        || !orbSecurityButtonUrlParamsArmStateItems.includes(button.urlParams.armState)
        || !orbSecurityButtonUrlParamsHrefItems.includes(button.urlParams.href)
      )
    )
    || (
      button.buttonDisabled
      && (
        button.buttonText !== null
        && !orbSecurityButtonLoadingTextItems.includes(button.buttonText)
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
          debugLog(logger, 'detect.ts / detectedNewOrbSecurityButtons()', 'warn', 'Plugin has detected new orb security buttons. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewOrbSecurityButtons()', 'error', 'Failed to check if plugin is outdated');
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
      debugLog(logger, 'detect.ts / detectedNewOrbSecurityButtons()', 'warn', 'Plugin has detected new orb security buttons. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        'https://fs65kt4c5xf8.ntfy.mrjackyliang.com',
        [
          'Please update the plugin as soon as possible.',
          JSON.stringify(cleanedData, null, 2),
        ].join('\n\n'),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': 'Detected new orb security buttons',
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewOrbSecurityButtons()', 'error', 'Failed to notify plugin author about the new orb security buttons');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detected new panel information.
 *
 * @param {DetectedNewPanelInformationDevice}    device    - Device.
 * @param {DetectedNewPanelInformationLogger}    logger    - Logger.
 * @param {DetectedNewPanelInformationDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectedNewPanelInformationReturns}
 *
 * @since 1.0.0
 */
export async function detectedNewPanelInformation(device: DetectedNewPanelInformationDevice, logger: DetectedNewPanelInformationLogger, debugMode: DetectedNewPanelInformationDebugMode): DetectedNewPanelInformationReturns {
  const detectedNewStatus = (device.status !== null && !panelInformationStatusItems.includes(device.status));

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
          debugLog(logger, 'detect.ts / detectedNewPanelInformation()', 'warn', 'Plugin has detected new panel information. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewPanelInformation()', 'error', 'Failed to check if plugin is outdated');
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
      debugLog(logger, 'detect.ts / detectedNewPanelInformation()', 'warn', 'Plugin has detected new panel information. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        'https://fs65kt4c5xf8.ntfy.mrjackyliang.com',
        [
          'Please update the plugin as soon as possible.',
          JSON.stringify(cleanedData, null, 2),
        ].join('\n\n'),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': 'Detected new panel information',
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewPanelInformation()', 'error', 'Failed to notify plugin author about the new panel information');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detected new panel status.
 *
 * @param {DetectedNewPanelStatusSummary}   summary   - Summary.
 * @param {DetectedNewPanelStatusLogger}    logger    - Logger.
 * @param {DetectedNewPanelStatusDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectedNewPanelStatusReturns}
 *
 * @since 1.0.0
 */
export async function detectedNewPanelStatus(summary: DetectedNewPanelStatusSummary, logger: DetectedNewPanelStatusLogger, debugMode: DetectedNewPanelStatusDebugMode): DetectedNewPanelStatusReturns {
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
          debugLog(logger, 'detect.ts / detectedNewPanelStatus()', 'warn', 'Plugin has detected a new panel state and/or status. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewPanelStatus()', 'error', 'Failed to check if plugin is outdated');
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
      debugLog(logger, 'detect.ts / detectedNewPanelStatus()', 'warn', 'Plugin has detected a new panel state and/or status. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        'https://fs65kt4c5xf8.ntfy.mrjackyliang.com',
        [
          'Please update the plugin as soon as possible.',
          JSON.stringify(cleanedData, null, 2),
        ].join('\n\n'),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': 'Detected a new panel state and/or status',
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewPanelStatus()', 'error', 'Failed to notify plugin author about the new panel state and/or status');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detected new portal version.
 *
 * @param {DetectedNewPortalVersionVersion}   version   - Version.
 * @param {DetectedNewPortalVersionLogger}    logger    - Logger.
 * @param {DetectedNewPortalVersionDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectedNewPortalVersionReturns}
 *
 * @since 1.0.0
 */
export async function detectedNewPortalVersion(version: DetectedNewPortalVersionVersion, logger: DetectedNewPortalVersionLogger, debugMode: DetectedNewPortalVersionDebugMode): DetectedNewPortalVersionReturns {
  const detectedNewVersion = (version.version !== null && !portalVersionItems.includes(version.version));

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
          debugLog(logger, 'detect.ts / detectedNewPortalVersion()', 'warn', 'Plugin has detected a new portal version. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewPortalVersion()', 'error', 'Failed to check if plugin is outdated');
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
      debugLog(logger, 'detect.ts / detectedNewPortalVersion()', 'warn', 'Plugin has detected a new portal version. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        'https://fs65kt4c5xf8.ntfy.mrjackyliang.com',
        [
          'Please update the plugin as soon as possible.',
          JSON.stringify(cleanedData, null, 2),
        ].join('\n\n'),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': 'Detected a new portal version',
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewPortalVersion()', 'error', 'Failed to notify plugin author about the new portal version');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detected new sensors information.
 *
 * @param {DetectedNewSensorsInformationSensors}   sensors   - Sensors.
 * @param {DetectedNewSensorsInformationLogger}    logger    - Logger.
 * @param {DetectedNewSensorsInformationDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectedNewSensorsInformationReturns}
 *
 * @since 1.0.0
 */
export async function detectedNewSensorsInformation(sensors: DetectedNewSensorsInformationSensors, logger: DetectedNewSensorsInformationLogger, debugMode: DetectedNewSensorsInformationDebugMode): DetectedNewSensorsInformationReturns {
  const detectedNewInformation = sensors.filter((sensor) => (
    !sensorInformationDeviceTypeItems.includes(sensor.deviceType)
    || !sensorInformationStatusItems.includes(sensor.status)
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
          debugLog(logger, 'detect.ts / detectedNewSensorsInformation()', 'warn', 'Plugin has detected new sensors information. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewSensorsInformation()', 'error', 'Failed to check if plugin is outdated');
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
      debugLog(logger, 'detect.ts / detectedNewSensorsInformation()', 'warn', 'Plugin has detected new sensors information. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        'https://fs65kt4c5xf8.ntfy.mrjackyliang.com',
        [
          'Please update the plugin as soon as possible.',
          JSON.stringify(cleanedData, null, 2),
        ].join('\n\n'),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': 'Detected new sensors information',
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewSensorsInformation()', 'error', 'Failed to notify plugin author about the new sensors information');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detected new sensors status.
 *
 * @param {DetectedNewSensorsStatusSensors}   sensors   - Sensors.
 * @param {DetectedNewSensorsStatusLogger}    logger    - Logger.
 * @param {DetectedNewSensorsStatusDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectedNewSensorsStatusReturns}
 *
 * @since 1.0.0
 */
export async function detectedNewSensorsStatus(sensors: DetectedNewSensorsStatusSensors, logger: DetectedNewSensorsStatusLogger, debugMode: DetectedNewSensorsStatusDebugMode): DetectedNewSensorsStatusReturns {
  const detectedNewStatuses = sensors.filter((sensor) => !sensorStatusIconItems.includes(sensor.icon) || sensor.statuses.some((sensorStatus) => !sensorStatusStatusItems.includes(sensorStatus)));

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
          debugLog(logger, 'detect.ts / detectedNewSensorsStatus()', 'warn', 'Plugin has detected new sensors status. You are running an older plugin version, please update soon');
        }

        // Do not send analytics for users running outdated plugin versions.
        return false;
      }
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewSensorsStatus()', 'error', 'Failed to check if plugin is outdated');
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
      debugLog(logger, 'detect.ts / detectedNewSensorsStatus()', 'warn', 'Plugin has detected new sensors status. Notifying plugin author about this discovery');
    }

    // Show content being sent to author.
    stackTracer('detect-content', cleanedData);

    try {
      await axios.post(
        'https://fs65kt4c5xf8.ntfy.mrjackyliang.com',
        [
          'Please update the plugin as soon as possible.',
          JSON.stringify(cleanedData, null, 2),
        ].join('\n\n'),
        {
          family: 4,
          headers: {
            'User-Agent': 'homebridge-adt-pulse',
            'X-Title': 'Detected new sensors status',
          },
        },
      );

      return true;
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewSensorsStatus()', 'error', 'Failed to notify plugin author about the new sensors status');
        stackTracer('serialize-error', serializeError(error));
      }

      // Try to send information to author later.
      return false;
    }
  }

  return false;
}

/**
 * Detected unknown accessory action.
 *
 * @param {DetectedUnknownAccessoryActionData}      data      - Data.
 * @param {DetectedUnknownAccessoryActionLogger}    logger    - Logger.
 * @param {DetectedUnknownAccessoryActionDebugMode} debugMode - Debug mode.
 *
 * @returns {DetectedUnknownAccessoryActionReturns}
 *
 * @since 1.0.0
 */
export async function detectedUnknownAccessoryAction(data: DetectedUnknownAccessoryActionData, logger: DetectedUnknownAccessoryActionLogger, debugMode: DetectedUnknownAccessoryActionDebugMode): DetectedUnknownAccessoryActionReturns {
  const cleanedData = removePersonalIdentifiableInformation(data);

  // If outdated, it means plugin may already have support.
  try {
    const outdated = await isPluginOutdated();

    if (outdated) {
      if (logger !== null) {
        logger.warn('Plugin has detected unknown accessory action. You are running an older plugin version, please update soon.');
      }

      // This is intentionally duplicated if using Homebridge debug mode.
      if (debugMode) {
        debugLog(logger, 'detect.ts / detectedUnknownAccessoryAction()', 'warn', 'Plugin has detected unknown accessory action. You are running an older plugin version, please update soon');
      }

      // Do not send analytics for users running outdated plugin versions.
      return false;
    }
  } catch (error) {
    if (debugMode === true) {
      debugLog(logger, 'detect.ts / detectedUnknownAccessoryAction()', 'error', 'Failed to check if plugin is outdated');
      stackTracer('serialize-error', serializeError(error));
    }

    // Try to check if plugin is outdated later on.
    return false;
  }

  if (logger !== null) {
    logger.warn('Plugin has detected unknown accessory action. Notifying plugin author about this discovery ...');
  }

  // This is intentionally duplicated if using Homebridge debug mode.
  if (debugMode) {
    debugLog(logger, 'detect.ts / detectedUnknownAccessoryAction()', 'warn', 'Plugin has detected unknown accessory action. Notifying plugin author about this discovery');
  }

  // Show content being sent to author.
  stackTracer('detect-content', cleanedData);

  try {
    await axios.post(
      'https://fs65kt4c5xf8.ntfy.mrjackyliang.com',
      [
        'Please update the plugin as soon as possible.',
        JSON.stringify(cleanedData, null, 2),
      ].join('\n\n'),
      {
        family: 4,
        headers: {
          'User-Agent': 'homebridge-adt-pulse',
          'X-Title': 'Detected unknown accessory action',
        },
      },
    );

    return true;
  } catch (error) {
    if (debugMode === true) {
      debugLog(logger, 'detect.ts / detectedUnknownAccessoryAction()', 'error', 'Failed to notify plugin author about the unknown accessory action');
      stackTracer('serialize-error', serializeError(error));
    }

    // Try to send information to author later.
    return false;
  }
}
