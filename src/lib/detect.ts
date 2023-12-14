import axios from 'axios';
import _ from 'lodash';
import { env } from 'node:process';
import { serializeError } from 'serialize-error';

import { debugLog, stackTracer } from '@/lib/utility.js';
import type {
  DetectedNewGatewayInformationDebugMode,
  DetectedNewGatewayInformationDevice,
  DetectedNewGatewayInformationKnownStatuses,
  DetectedNewGatewayInformationLogger,
  DetectedNewGatewayInformationReturns,
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
 * Detected new gateway information.
 *
 * @param {DetectedNewGatewayInformationDevice}    device    - Device.
 * @param {DetectedNewGatewayInformationLogger}    logger    - Logger.
 * @param {DetectedNewGatewayInformationDebugMode} debugMode - Logger.
 *
 * @returns {DetectedNewGatewayInformationReturns}
 *
 * @since 1.0.0
 */
export async function detectedNewGatewayInformation(device: DetectedNewGatewayInformationDevice, logger: DetectedNewGatewayInformationLogger, debugMode: DetectedNewGatewayInformationDebugMode): DetectedNewGatewayInformationReturns {
  const knownStatuses: DetectedNewGatewayInformationKnownStatuses = [
    'Online',
    'Status Unknown',
  ];

  // Compare with data above. Detection does not need to know if values are "null".
  const detectedNewStatus = (device.status !== null && !knownStatuses.includes(device.status));

  if (detectedNewStatus) {
    logger.warn('Plugin has detected new gateway information. Notifying plugin author about this discovery ...');
    stackTracer('detect-content', device);

    try {
      await axios.post(
        'https://9wv5o73w.ntfy.mrjackyliang.com',
        JSON.stringify({
          title: 'Detected new gateway information',
          description: 'New gateway information detected. Please update the plugin as soon as possible.',
          content: JSON.stringify(device, null, 2),
        }),
        {
          family: 4,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': `homebridge-adt-pulse/${env.npm_package_version}`,
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
 * Detected new panel information.
 *
 * @param {DetectedNewPanelInformationDevice}    device    - Device.
 * @param {DetectedNewPanelInformationLogger}    logger    - Logger.
 * @param {DetectedNewPanelInformationDebugMode} debugMode - Logger.
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
    logger.warn('Plugin has detected new panel information. Notifying plugin author about this discovery ...');
    stackTracer('detect-content', device);

    try {
      await axios.post(
        'https://9wv5o73w.ntfy.mrjackyliang.com',
        JSON.stringify({
          title: 'Detected new panel information',
          description: 'New panel information detected. Please update the plugin as soon as possible.',
          content: JSON.stringify(device, null, 2),
        }),
        {
          family: 4,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': `homebridge-adt-pulse/${env.npm_package_version}`,
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
 * @param {DetectedNewPanelStatusDebugMode} debugMode - Logger.
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
  ];

  // Compare with data above. Detection does not need to know if values are "null".
  const detectedNewState = (summary.state !== null && !knownStates.includes(summary.state));
  const detectedNewStatus = (summary.status !== null && !knownStatuses.includes(summary.status));

  if (detectedNewState || detectedNewStatus) {
    logger.warn('Plugin has detected a new panel state and/or status. Notifying plugin author about this discovery ...');
    stackTracer('detect-content', summary);

    try {
      await axios.post(
        'https://9wv5o73w.ntfy.mrjackyliang.com',
        JSON.stringify({
          title: 'Detected a new panel state and/or status',
          description: 'A new panel state and/or status detected. Please update the plugin as soon as possible.',
          content: JSON.stringify(summary, null, 2),
        }),
        {
          family: 4,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': `homebridge-adt-pulse/${env.npm_package_version}`,
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
  const detectedNewVersion = (version !== null && !knownVersions.includes(version));

  if (detectedNewVersion) {
    logger.warn('Plugin has detected a new portal version. Notifying plugin author about this discovery ...');
    stackTracer('detect-content', {
      version,
    });

    try {
      await axios.post(
        'https://9wv5o73w.ntfy.mrjackyliang.com',
        JSON.stringify({
          title: 'Detected a new portal version',
          description: 'A new portal version detected. Please update the plugin as soon as possible.',
          content: JSON.stringify({
            version,
          }, null, 2),
        }),
        {
          family: 4,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': `homebridge-adt-pulse/${env.npm_package_version}`,
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
    'Door Sensor',
    'Door/Window Sensor',
    'Carbon Monoxide Detector',
    'Fire (Smoke/Heat) Detector',
    'Glass Break Detector',
    'Motion Sensor',
    'Motion Sensor (Notable Events Only)',
    'Temperature Sensor',
    'Water/Flood Sensor',
    'Window Sensor',
  ];
  const knownStatuses: DetectedNewSensorsInformationKnownStatuses = [
    'Online',
    'Status Unknown',
  ];

  // Compare with data above.
  const detectedNewInformation = sensors.filter((sensor) => (!knownDeviceTypes.includes(sensor.deviceType) || !knownStatuses.includes(sensor.status)));

  if (detectedNewInformation.length > 0) {
    logger.warn('Plugin has detected new sensors information. Notifying plugin author about this discovery ...');
    stackTracer('detect-content', detectedNewInformation);

    try {
      await axios.post(
        'https://9wv5o73w.ntfy.mrjackyliang.com',
        JSON.stringify({
          title: 'Detected new sensors information',
          description: 'New sensors information detected. Please update the plugin as soon as possible.',
          content: JSON.stringify(detectedNewInformation, null, 2),
        }),
        {
          family: 4,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': `homebridge-adt-pulse/${env.npm_package_version}`,
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
    'Closed',
    'Motion',
    'No Motion',
    'Okay',
    'Open',
    'Tripped',
    'Unknown',
  ];

  // Compare with data above.
  const detectedNewStatuses = sensors.filter((sensor) => (!knownIcons.includes(sensor.icon) || !knownStatuses.includes(sensor.status)));

  if (detectedNewStatuses.length > 0) {
    logger.warn('Plugin has detected new sensors status. Notifying plugin author about this discovery ...');
    stackTracer('detect-content', detectedNewStatuses);

    try {
      await axios.post(
        'https://9wv5o73w.ntfy.mrjackyliang.com',
        JSON.stringify({
          title: 'Detected new sensors status',
          description: 'New sensors status detected. Please update the plugin as soon as possible.',
          content: JSON.stringify(detectedNewStatuses, null, 2),
        }),
        {
          family: 4,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': `homebridge-adt-pulse/${env.npm_package_version}`,
          },
        },
      );
    } catch (error) {
      if (debugMode === true) {
        debugLog(logger, 'detect.ts / detectedNewSensorStatus()', 'error', 'Failed to notify plugin author about the new sensors status');
        stackTracer('serialize-error', serializeError(error));
      }
    }

    return true;
  }

  return false;
}
