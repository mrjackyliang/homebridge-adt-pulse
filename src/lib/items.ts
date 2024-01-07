import _ from 'lodash';

import type {
  CondensedSensorTypeItems,
  DoSubmitHandlerRelativeUrlItems,
  DoSubmitHandlerUrlParamsArmItems,
  DoSubmitHandlerUrlParamsArmStateItems,
  DoSubmitHandlerUrlParamsHrefItems,
  GatewayInformationStatusItems,
  OrbSecurityButtonButtonTextItems,
  OrbSecurityButtonLoadingTextItems,
  OrbSecurityButtonRelativeUrlItems,
  OrbSecurityButtonUrlParamsArmItems,
  OrbSecurityButtonUrlParamsArmStateItems,
  OrbSecurityButtonUrlParamsHrefItems,
  PanelInformationStatusItems,
  PanelStatusNoteItems,
  PanelStatusStateItems,
  PanelStatusStatusItems,
  PanelStatusStatusItemsSensorsOpen,
  PortalVersionItems,
  SensorActionItems,
  SensorInformationDeviceTypeItems,
  SensorInformationStatusItems,
  SensorStatusIconItems,
  SensorStatusStatusItems,
} from '@/types/index.d.ts';

/**
 * Condensed sensor type items.
 *
 * @since 1.0.0
 */
export const condensedSensorTypeItems: CondensedSensorTypeItems = [
  'co',
  'doorWindow',
  'fire',
  'flood',
  'glass',
  'heat',
  'keypad',
  'motion',
  'panic',
  'shock',
  'supervisory',
  'temperature',
  'unknown',
];

/**
 * Do submit handler relative url items.
 *
 * @since 1.0.0
 */
export const doSubmitHandlerRelativeUrlItems: DoSubmitHandlerRelativeUrlItems = [
  '/myhome/16.0.0-131/quickcontrol/serv/RunRRACommand',
  '/myhome/17.0.0-69/quickcontrol/serv/RunRRACommand',
  '/myhome/18.0.0-78/quickcontrol/serv/RunRRACommand',
  '/myhome/19.0.0-89/quickcontrol/serv/RunRRACommand',
  '/myhome/20.0.0-221/quickcontrol/serv/RunRRACommand',
  '/myhome/20.0.0-244/quickcontrol/serv/RunRRACommand',
  '/myhome/21.0.0-344/quickcontrol/serv/RunRRACommand',
  '/myhome/21.0.0-353/quickcontrol/serv/RunRRACommand',
  '/myhome/21.0.0-354/quickcontrol/serv/RunRRACommand',
  '/myhome/22.0.0-233/quickcontrol/serv/RunRRACommand',
  '/myhome/23.0.0-99/quickcontrol/serv/RunRRACommand',
  '/myhome/24.0.0-117/quickcontrol/serv/RunRRACommand',
  '/myhome/25.0.0-21/quickcontrol/serv/RunRRACommand',
  '/myhome/26.0.0-32/quickcontrol/serv/RunRRACommand',
  '/myhome/27.0.0-140/quickcontrol/serv/RunRRACommand',
];

/**
 * Do submit handler url params arm items.
 *
 * @since 1.0.0
 */
export const doSubmitHandlerUrlParamsArmItems: DoSubmitHandlerUrlParamsArmItems = [
  'away',
  'night',
  'stay',
];

/**
 * Do submit handler url params arm state items.
 *
 * @since 1.0.0
 */
export const doSubmitHandlerUrlParamsArmStateItems: DoSubmitHandlerUrlParamsArmStateItems = [
  'forcearm',
];

/**
 * Do submit handler url params href items.
 *
 * @since 1.0.0
 */
export const doSubmitHandlerUrlParamsHrefItems: DoSubmitHandlerUrlParamsHrefItems = [
  'rest/adt/ui/client/security/setForceArm',
  'rest/adt/ui/client/security/setCancelProtest',
];

/**
 * Gateway information status items.
 *
 * @since 1.0.0
 */
export const gatewayInformationStatusItems: GatewayInformationStatusItems = [
  'Offline',
  'Online',
  'Status Unknown',
];

/**
 * Orb security button button text items.
 *
 * @since 1.0.0
 */
export const orbSecurityButtonButtonTextItems: OrbSecurityButtonButtonTextItems = [
  'Arm Away',
  'Arm Night',
  'Arm Stay',
  'Clear Alarm',
  'Disarm',
];

/**
 * Orb security button loading text items.
 *
 * @since 1.0.0
 */
export const orbSecurityButtonLoadingTextItems: OrbSecurityButtonLoadingTextItems = [
  'Arming Away',
  'Arming Night',
  'Arming Stay',
  'Disarming',
];

/**
 * Orb security button relative url items.
 *
 * @since 1.0.0
 */
export const orbSecurityButtonRelativeUrlItems: OrbSecurityButtonRelativeUrlItems = [
  'quickcontrol/armDisarm.jsp',
];

/**
 * Orb security button url params arm items.
 *
 * @since 1.0.0
 */
export const orbSecurityButtonUrlParamsArmItems: OrbSecurityButtonUrlParamsArmItems = [
  'away',
  'night',
  'off',
  'stay',
];

/**
 * Orb security button url params arm state items.
 *
 * @since 1.0.0
 */
export const orbSecurityButtonUrlParamsArmStateItems: OrbSecurityButtonUrlParamsArmStateItems = [
  'away',
  'disarmed',
  'disarmed_with_alarm',
  'disarmed+with+alarm',
  'night',
  'night+stay',
  'off',
  'stay',
];

/**
 * Orb security button url params href items.
 *
 * @since 1.0.0
 */
export const orbSecurityButtonUrlParamsHrefItems: OrbSecurityButtonUrlParamsHrefItems = [
  'rest/adt/ui/client/security/setArmState',
];

/**
 * Panel information status items.
 *
 * @since 1.0.0
 */
export const panelInformationStatusItems: PanelInformationStatusItems = [
  'Offline',
  'Online',
  'Status Unknown',
];

/**
 * Panel status note items.
 *
 * @since 1.0.0
 */
export const panelStatusNoteItems: PanelStatusNoteItems = [
  'This may take several minutes',
];

/**
 * Panel status state items.
 *
 * @since 1.0.0
 */
export const panelStatusStateItems: PanelStatusStateItems = [
  'Armed Away',
  'Armed Night',
  'Armed Stay',
  'Disarmed',
  'No Entry Delay',
  'Status Unavailable',
];

/**
 * Panel status status items.
 *
 * @since 1.0.0
 */
export const panelStatusStatusItems: PanelStatusStatusItems = [
  '1 Sensor Open',
  ..._.range(148).map((_value, index) => `${index + 1} Sensors Open` as PanelStatusStatusItemsSensorsOpen),
  'All Quiet',
  'BURGLARY ALARM',
  'Carbon Monoxide Alarm',
  'FIRE ALARM',
  'Motion',
  'Sensor Bypassed',
  'Sensor Problem',
  'Sensor Problems',
  'Sensors Bypassed',
  'Sensors Tripped',
  'Sensor Tripped',
  'Uncleared Alarm',
  'WATER ALARM',
];

/**
 * Portal version items.
 *
 * @since 1.0.0
 */
export const portalVersionItems: PortalVersionItems = [
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

/**
 * Sensor action items.
 *
 * @since 1.0.0
 */
export const sensorActionItems: SensorActionItems = [
  {
    type: 'co',
    statuses: [
      'Okay',
    ],
  },
  {
    type: 'doorWindow',
    statuses: [
      'Closed',
      'Open',
    ],
  },
  {
    type: 'fire',
    statuses: [
      'Okay',
    ],
  },
  {
    type: 'flood',
    statuses: [
      '',
    ],
  },
  {
    type: 'glass',
    statuses: [
      'Okay',
    ],
  },
  {
    type: 'heat',
    statuses: [
      '',
    ],
  },
  {
    type: 'keypad',
    statuses: [
      '',
    ],
  },
  {
    type: 'motion',
    statuses: [
      'Motion',
      'No Motion',
      'Okay',
    ],
  },
  {
    type: 'panic',
    statuses: [
      '',
    ],
  },
  {
    type: 'shock',
    statuses: [
      '',
    ],
  },
  {
    type: 'supervisory',
    statuses: [
      '',
    ],
  },
  {
    type: 'temperature',
    statuses: [
      '',
    ],
  },
  {
    type: 'unknown',
    statuses: [
      '',
    ],
  },
];

/**
 * Sensor information device type items.
 *
 * @since 1.0.0
 */
export const sensorInformationDeviceTypeItems: SensorInformationDeviceTypeItems = [
  'Audible Panic Button/Pendant',
  'Carbon Monoxide Detector',
  'Door/Window Sensor',
  'Door Sensor',
  'Fire (Smoke/Heat) Detector',
  'Glass Break Detector',
  'Heat (Rate-of-Rise) Detector',
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

/**
 * Sensor information status items.
 *
 * @since 1.0.0
 */
export const sensorInformationStatusItems: SensorInformationStatusItems = [
  'Offline',
  'Online',
  'Status Unknown',
];

/**
 * Sensor status icon items.
 *
 * @since 1.0.0
 */
export const sensorStatusIconItems: SensorStatusIconItems = [
  'devStatAlarm',
  'devStatLowBatt',
  'devStatMotion',
  'devStatOffline',
  'devStatOK',
  'devStatOpen',
  'devStatTamper',
  'devStatUnknown',
];

/**
 * Sensor status status items.
 *
 * @since 1.0.0
 */
export const sensorStatusStatusItems: SensorStatusStatusItems = [
  'ALARM',
  'Bypassed',
  'Closed',
  'Low Battery',
  'Motion',
  'No Motion',
  'Offline',
  'Okay',
  'Open',
  'Tripped',
  'Trouble',
  'Unknown',
];
