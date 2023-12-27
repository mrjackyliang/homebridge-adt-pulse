import axios from 'axios';
import _ from 'lodash';
import { serializeError } from 'serialize-error';

import {
  debugLog,
  isPluginOutdated,
  removePersonalIdentifiableInformation,
  stackTracer,
} from '@/lib/utility.js';
import type {
  DetectedNewDoSubmitHandlersDebugMode,
  DetectedNewDoSubmitHandlersHandlers,
  DetectedNewDoSubmitHandlersKnownRelativeUrls,
  DetectedNewDoSubmitHandlersKnownRelativeUrlsVersion,
  DetectedNewDoSubmitHandlersKnownUrlParamsArm,
  DetectedNewDoSubmitHandlersKnownUrlParamsArmState,
  DetectedNewDoSubmitHandlersKnownUrlParamsHref,
  DetectedNewDoSubmitHandlersLogger,
  DetectedNewDoSubmitHandlersReturns,
  DetectedNewGatewayInformationDebugMode,
  DetectedNewGatewayInformationDevice,
  DetectedNewGatewayInformationKnownStatuses,
  DetectedNewGatewayInformationLogger,
  DetectedNewGatewayInformationReturns,
  DetectedNewOrbSecurityButtonsButtons,
  DetectedNewOrbSecurityButtonsDebugMode,
  DetectedNewOrbSecurityButtonsKnownButtonText,
  DetectedNewOrbSecurityButtonsKnownLoadingText,
  DetectedNewOrbSecurityButtonsKnownRelativeUrl,
  DetectedNewOrbSecurityButtonsKnownUrlParamsArm,
  DetectedNewOrbSecurityButtonsKnownUrlParamsArmState,
  DetectedNewOrbSecurityButtonsKnownUrlParamsHref,
  DetectedNewOrbSecurityButtonsLogger,
  DetectedNewOrbSecurityButtonsReturns,
  DetectedNewPanelInformationDebugMode,
  DetectedNewPanelInformationDevice,
  DetectedNewPanelInformationKnownStatuses,
  DetectedNewPanelInformationLogger,
  DetectedNewPanelInformationReturns,
  DetectedNewPanelStatusDebugMode,
  DetectedNewPanelStatusKnownStates,
  DetectedNewPanelStatusKnownStatuses,
  DetectedNewPanelStatusKnownStatusesSensorsOpen,
  DetectedNewPanelStatusLogger,
  DetectedNewPanelStatusReturns,
  DetectedNewPanelStatusSummary,
  DetectedNewPortalVersionDebugMode,
  DetectedNewPortalVersionKnownVersions,
  DetectedNewPortalVersionLogger,
  DetectedNewPortalVersionReturns,
  DetectedNewPortalVersionVersion,
  DetectedNewSensorsInformationDebugMode,
  DetectedNewSensorsInformationKnownDeviceTypes,
  DetectedNewSensorsInformationKnownStatuses,
  DetectedNewSensorsInformationLogger,
  DetectedNewSensorsInformationReturns,
  DetectedNewSensorsInformationSensors,
  DetectedNewSensorsStatusDebugMode,
  DetectedNewSensorsStatusKnownIcons,
  DetectedNewSensorsStatusKnownStatuses,
  DetectedNewSensorsStatusLogger,
  DetectedNewSensorsStatusReturns,
  DetectedNewSensorsStatusSensors,
} from '@/types/index.d.ts';

/**
 * Detected do submit handlers.
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
  const knownRelativeUrls: DetectedNewDoSubmitHandlersKnownRelativeUrls = [
    '16.0.0-131',
    '17.0.0-69',
    '18.0.0-78',
    '19.0.0-89',
    '20.0.0-221',
    '20.0.0-244',
    '21.0.0-344',
    '21.0.0-353',
    '21.0.0-354',
    '22.0.0-233',
    '23.0.0-99',
    '24.0.0-117',
    '25.0.0-21',
    '26.0.0-32',
    '27.0.0-140',
  ].map((version) => `/myhome/${version}/quickcontrol/serv/RunRRACommand` as DetectedNewDoSubmitHandlersKnownRelativeUrlsVersion);
  const knownUrlParamsArm: DetectedNewDoSubmitHandlersKnownUrlParamsArm = [
    'away',
    'night',
    'stay',
  ];
  const knownUrlParamsArmState: DetectedNewDoSubmitHandlersKnownUrlParamsArmState = [
    'forcearm',
  ];
  const knownUrlParamsHref: DetectedNewDoSubmitHandlersKnownUrlParamsHref = [
    'rest/adt/ui/client/security/setForceArm',
    'rest/adt/ui/client/security/setCancelProtest',
  ];

  // Compare with data above.
  const detectedNewHandlers = handlers.filter((handler) => (
    !knownRelativeUrls.includes(handler.relativeUrl)
    || (
      handler.urlParams.arm !== null
      && !knownUrlParamsArm.includes(handler.urlParams.arm)
    )
    || (
      handler.urlParams.armState !== null
      && !knownUrlParamsArmState.includes(handler.urlParams.armState)
    )
    || !knownUrlParamsHref.includes(handler.urlParams.href)
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
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewDoSubmitHandlers()', 'error', 'Failed to notify plugin author about the new do submit handlers');
        stackTracer('serialize-error', serializeError(error));
      }
    }

    return true;
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
  const knownStatuses: DetectedNewGatewayInformationKnownStatuses = [
    'Offline',
    'Online',
    'Status Unknown',
  ];

  // Compare with data above. Detection does not need to know if values are "null".
  const detectedNewStatus = (device.status !== null && !knownStatuses.includes(device.status));

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
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewGatewayInformation()', 'error', 'Failed to notify plugin author about the new gateway information');
        stackTracer('serialize-error', serializeError(error));
      }
    }

    return true;
  }

  return false;
}

/**
 * Detected orb security buttons.
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
  const knownButtonText: DetectedNewOrbSecurityButtonsKnownButtonText = [
    'Arm Away',
    'Arm Night',
    'Arm Stay',
    'Clear Alarm',
    'Disarm',
  ];
  const knownLoadingText: DetectedNewOrbSecurityButtonsKnownLoadingText = [
    'Arming Away',
    'Arming Night',
    'Arming Stay',
    'Disarming',
  ];
  const knownRelativeUrl: DetectedNewOrbSecurityButtonsKnownRelativeUrl = [
    'quickcontrol/armDisarm.jsp',
  ];
  const knownUrlParamsArm: DetectedNewOrbSecurityButtonsKnownUrlParamsArm = [
    'away',
    'night',
    'off',
    'stay',
  ];
  const knownUrlParamsArmState: DetectedNewOrbSecurityButtonsKnownUrlParamsArmState = [
    'away',
    'disarmed',
    'disarmed_with_alarm',
    'disarmed+with+alarm',
    'night',
    'night+stay',
    'off',
    'stay',
  ];
  const knownUrlParamsHref: DetectedNewOrbSecurityButtonsKnownUrlParamsHref = [
    'rest/adt/ui/client/security/setArmState',
  ];

  // Compare with data above.
  const detectedNewButtons = buttons.filter((button) => (
    (
      !button.buttonDisabled
      && (
        (
          button.buttonText !== null
          && !knownButtonText.includes(button.buttonText)
        )
        || !knownLoadingText.includes(button.loadingText)
        || !knownRelativeUrl.includes(button.relativeUrl)
        || !knownUrlParamsArm.includes(button.urlParams.arm)
        || !knownUrlParamsArmState.includes(button.urlParams.armState)
        || !knownUrlParamsHref.includes(button.urlParams.href)
      )
    )
    || (
      button.buttonDisabled
      && (
        button.buttonText !== null
        && !knownLoadingText.includes(button.buttonText)
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
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewOrbSecurityButtons()', 'error', 'Failed to notify plugin author about the new orb security buttons');
        stackTracer('serialize-error', serializeError(error));
      }
    }

    return true;
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
  const knownStatuses: DetectedNewPanelInformationKnownStatuses = [
    'Online',
    'Status Unknown',
  ];

  // Compare with data above. Detection does not need to know if values are "null".
  const detectedNewStatus = (device.status !== null && !knownStatuses.includes(device.status));

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
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewPanelInformation()', 'error', 'Failed to notify plugin author about the new panel information');
        stackTracer('serialize-error', serializeError(error));
      }
    }

    return true;
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
  const knownStates: DetectedNewPanelStatusKnownStates = [
    'Armed Away',
    'Armed Night',
    'Armed Stay',
    'Disarmed',
    'Status Unavailable',
  ];
  const knownStatuses: DetectedNewPanelStatusKnownStatuses = [
    '1 Sensor Open',
    ..._.range(256).map((_value, index) => `${index + 1} Sensors Open` as DetectedNewPanelStatusKnownStatusesSensorsOpen),
    'All Quiet',
    'BURGLARY ALARM',
    'Carbon Monoxide Alarm',
    'FIRE ALARM',
    'Motion',
    'Sensor Bypassed',
    'Sensor Problem',
    'Sensors Bypassed',
    'Sensors Tripped',
    'Sensor Tripped',
    'Uncleared Alarm',
    'WATER ALARM',
  ];

  // Compare with data above. Detection does not need to know if values are "null".
  const detectedNewState = (summary.state !== null && !knownStates.includes(summary.state));
  const detectedNewStatus = (summary.status !== null && !knownStatuses.includes(summary.status));

  if (detectedNewState || detectedNewStatus) {
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
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewPanelStatus()', 'error', 'Failed to notify plugin author about the new panel state and/or status');
        stackTracer('serialize-error', serializeError(error));
      }
    }

    return true;
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
  const knownVersions: DetectedNewPortalVersionKnownVersions = [
    '16.0.0-131',
    '17.0.0-69',
    '18.0.0-78',
    '19.0.0-89',
    '20.0.0-221',
    '20.0.0-244',
    '21.0.0-344',
    '21.0.0-353',
    '21.0.0-354',
    '22.0.0-233',
    '23.0.0-99',
    '24.0.0-117',
    '25.0.0-21',
    '26.0.0-32',
    '27.0.0-140',
  ];

  // Compare with data above. Detection does not need to know if values are "null".
  const detectedNewVersion = (version.version !== null && !knownVersions.includes(version.version));

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
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewPortalVersion()', 'error', 'Failed to notify plugin author about the new portal version');
        stackTracer('serialize-error', serializeError(error));
      }
    }

    return true;
  }

  return false;
}

/**
 * Detected new sensors' information.
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
  const knownDeviceTypes: DetectedNewSensorsInformationKnownDeviceTypes = [
    'Audible Panic Button/Pendant',
    'Carbon Monoxide Detector',
    'Door/Window Sensor',
    'Door Sensor',
    'Fire (Smoke/Heat) Detector',
    'Glass Break Detector',
    'Keypad/Touchpad',
    'Motion Sensor',
    'Motion Sensor (Notable Events Only)',
    'Shock Sensor',
    'Silent Panic Button/Pendant',
    'System/Supervisory',
    'Temperature Sensor',
    'Unknown Device Type',
    'Water/Flood Sensor',
    'Window Sensor',
  ];
  const knownStatuses: DetectedNewSensorsInformationKnownStatuses = [
    'Online',
    'Status Unknown',
  ];

  // Compare with data above.
  const detectedNewInformation = sensors.filter((sensor) => (
    !knownDeviceTypes.includes(sensor.deviceType)
    || !knownStatuses.includes(sensor.status)
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
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewSensorsInformation()', 'error', 'Failed to notify plugin author about the new sensors information');
        stackTracer('serialize-error', serializeError(error));
      }
    }

    return true;
  }

  return false;
}

/**
 * Detected new sensors' status.
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
  const knownIcons: DetectedNewSensorsStatusKnownIcons = [
    'devStatAlarm',
    'devStatLowBatt',
    'devStatMotion',
    'devStatOK',
    'devStatOpen',
    'devStatTamper',
    'devStatUnknown',
  ];
  const knownStatuses: DetectedNewSensorsStatusKnownStatuses = [
    'ALARM, Closed',
    'ALARM, Okay',
    'ALARM, Open',
    'Bypassed, Closed',
    'Bypassed, Open',
    'Bypassed, Tripped',
    'Closed',
    'Low Battery, Motion',
    'Low Battery, No Motion',
    'Motion',
    'No Motion',
    'Okay',
    'Open',
    'Tripped',
    'Trouble, Open',
    'Trouble, Closed',
    'Unknown',
  ];

  // Compare with data above.
  const detectedNewStatuses = sensors.filter((sensor) => (
    !knownIcons.includes(sensor.icon)
    || !knownStatuses.includes(sensor.status)
  ));

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
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewSensorsStatus()', 'error', 'Failed to notify plugin author about the new sensors status');
        stackTracer('serialize-error', serializeError(error));
      }
    }

    return true;
  }

  return false;
}
