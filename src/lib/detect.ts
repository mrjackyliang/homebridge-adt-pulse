import axios from 'axios';
import _ from 'lodash';

import type {
  DetectedNewPanelStatusReturns,
  DetectedNewPanelStatusSummary,
  DetectedNewPortalVersionReturns,
  DetectedNewPortalVersionVersion,
  DetectedNewSensorStatusReturns,
  DetectedNewSensorStatusSensors,
} from '@/types';

/**
 * Detected new panel status.
 *
 * @param {DetectedNewPanelStatusSummary} summary - Summary.
 *
 * @returns {DetectedNewPanelStatusReturns}
 *
 * @since 1.0.0
 */
export async function detectedNewPanelStatus(summary: DetectedNewPanelStatusSummary): DetectedNewPanelStatusReturns {
  const knownStates = [
    'Disarmed',
    'Armed Away',
    'Armed Stay',
    'Armed Night',
    'Status Unavailable',
  ];
  const knownStatuses = [
    'All Quiet',
    '1 Sensor Open',
    ..._.range(99).map((value, index) => `${index + 1} Sensors Open`),
    'Sensor Bypassed',
    'Sensors Bypassed',
    'Sensor Tripped',
    'Sensors Tripped',
    'Motion',
    'Uncleared Alarm',
    'Carbon Monoxide Alarm',
    'FIRE ALARM',
    'BURGLARY ALARM',
    'Sensor Problem',
  ];
  const detectedNewState = (summary.state !== null && !knownStates.includes(summary.state));
  const detectedNewStatus = (summary.status !== null && !knownStatuses.includes(summary.status));

  if (detectedNewState || detectedNewStatus) {
    try {
      await axios.post(
        'https://9wv5o73w.ntfy.mrjackyliang.com',
        JSON.stringify({
          title: 'Detected new panel status',
          description: 'New panel statuses detected. Please upgrade the plugin as soon as possible.',
          content: JSON.stringify(summary, null, 2),
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch {
      /* empty */
    }

    return true;
  }

  return false;
}

/**
 * Detected new portal version.
 *
 * @param {DetectedNewPortalVersionVersion} version - Version.
 *
 * @returns {DetectedNewPortalVersionReturns}
 *
 * @since 1.0.0
 */
export async function detectedNewPortalVersion(version: DetectedNewPortalVersionVersion): DetectedNewPortalVersionReturns {
  const knownVersions = [
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
  const detectedNewVersion = !knownVersions.includes(version);

  if (detectedNewVersion) {
    try {
      await axios.post(
        'https://9wv5o73w.ntfy.mrjackyliang.com',
        JSON.stringify({
          title: 'Detected new portal version',
          description: 'New portal version detected. Please upgrade the plugin as soon as possible.',
          content: JSON.stringify({
            version,
          }, null, 2),
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return true;
    } catch {
      /* empty */
    }
  }

  return false;
}

/**
 * Detected new sensor status.
 *
 * @param {DetectedNewSensorStatusSensors} sensors - Sensors.
 *
 * @returns {DetectedNewSensorStatusReturns}
 *
 * @since 1.0.0
 */
export async function detectedNewSensorStatus(sensors: DetectedNewSensorStatusSensors): DetectedNewSensorStatusReturns {
  const knownIcons = [
    'devStatOK',
    'devStatOpen',
    'devStatMotion',
    'devStatTamper',
    'devStatAlarm',
    'devStatLowBatt',
    'devStatInstalling',
    'devStatOffline',
    'devStatUnknown',
  ];
  const knownStatuses = [
    'Okay',
    'Open',
    'Closed',
    'Motion',
    'No Motion',
    'Tripped',
  ];
  const detectedNewStatuses = sensors.filter((sensor) => (!knownIcons.includes(sensor.icon) || !knownStatuses.includes(sensor.status)));

  if (detectedNewStatuses.length > 0) {
    try {
      await axios.post(
        'https://9wv5o73w.ntfy.mrjackyliang.com',
        JSON.stringify({
          title: 'Detected new sensor status',
          description: 'New sensor status detected. Please upgrade the plugin as soon as possible.',
          content: JSON.stringify(detectedNewStatuses, null, 2),
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch {
      /* empty */
    }

    return true;
  }

  return false;
}
