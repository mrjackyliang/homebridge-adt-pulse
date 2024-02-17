import _ from 'lodash';

import type {
  CollectionDoSubmitHandlers,
  CollectionOrbSecurityButtons,
  CollectionSensorActions,
  DeviceGateways,
  DeviceSecurityPanels,
  ItemCondensedSensorTypes,
  ItemDoSubmitHandlerRelativeUrls,
  ItemDoSubmitHandlerUrlParamsArms,
  ItemDoSubmitHandlerUrlParamsArmStates,
  ItemDoSubmitHandlerUrlParamsHrefs,
  ItemGatewayInformationStatuses,
  ItemOrbSecurityButtonButtonTexts,
  ItemOrbSecurityButtonLoadingTexts,
  ItemOrbSecurityButtonRelativeUrls,
  ItemOrbSecurityButtonUrlParamsArms,
  ItemOrbSecurityButtonUrlParamsArmStates,
  ItemOrbSecurityButtonUrlParamsHrefs,
  ItemPanelInformationStatuses,
  ItemPanelStatusNotes,
  ItemPanelStatusStates,
  ItemPanelStatusStatuses,
  ItemPanelStatusStatusesSensorsOpen,
  ItemPortalVersions,
  ItemSensorInformationDeviceTypes,
  ItemSensorInformationStatuses,
  ItemSensorStatusIcons,
  ItemSensorStatusStatuses,
} from '@/types/index.d.ts';

/**
 * Collection do submit handlers.
 *
 * @since 1.0.0
 */
export const collectionDoSubmitHandlers: CollectionDoSubmitHandlers = [
  [],
  [
    {
      href: 'rest/adt/ui/client/security/setForceArm',
    },
    {
      href: 'rest/adt/ui/client/security/setCancelProtest',
    },
  ],
];

/**
 * Collection orb security buttons.
 *
 * @since 1.0.0
 */
export const collectionOrbSecurityButtons: CollectionOrbSecurityButtons = [
  [
    {
      buttonDisabled: false,
      buttonText: 'Arm Away',
      loadingText: 'Arming Away',
    },
    {
      buttonDisabled: false,
      buttonText: 'Arm Stay',
      loadingText: 'Arming Stay',
    },
  ],
  [
    {
      buttonDisabled: false,
      buttonText: 'Disarm',
      loadingText: 'Disarming',
    },
  ],
  [
    {
      buttonDisabled: true,
      buttonText: 'Arming Night',
      loadingText: null,
    },
  ],
];

/**
 * Collection sensor actions.
 *
 * @since 1.0.0
 */
export const collectionSensorActions: CollectionSensorActions = [
  {
    type: 'co',
    statuses: [
      'ALARM, Okay',
      'ALARM, Tripped',
      'Bypassed, Okay',
      'Bypassed, Tripped',
      'Low Battery, Okay',
      'Low Battery, Tripped',
      'Offline',
      'Okay',
      'Tampered, Okay',
      'Tampered, Tripped',
      'Tripped',
      'Trouble, Okay',
      'Trouble, Tripped',
      'Unknown',
    ],
  },
  {
    type: 'doorWindow',
    statuses: [
      'ALARM, Closed',
      'ALARM, Open',
      'Bypassed, Closed',
      'Bypassed, Open',
      'Closed',
      'Low Battery, Closed',
      'Low Battery, Open',
      'Offline',
      'Open',
      'Tampered, Closed',
      'Tampered, Open',
      'Trouble, Closed',
      'Trouble, Open',
      'Unknown',
    ],
  },
  {
    type: 'fire',
    statuses: [
      'ALARM, Okay',
      'ALARM, Tripped',
      'Bypassed, Okay',
      'Bypassed, Tripped',
      'Low Battery, Okay',
      'Low Battery, Tripped',
      'Offline',
      'Okay',
      'Tampered, Okay',
      'Tampered, Tripped',
      'Tripped',
      'Trouble, Okay',
      'Trouble, Tripped',
      'Unknown',
    ],
  },
  {
    type: 'flood',
    statuses: [
      'ALARM, Okay',
      'ALARM, Tripped',
      'Bypassed, Okay',
      'Bypassed, Tripped',
      'Low Battery, Okay',
      'Low Battery, Tripped',
      'Offline',
      'Okay',
      'Tampered, Okay',
      'Tampered, Tripped',
      'Tripped',
      'Trouble, Okay',
      'Trouble, Tripped',
      'Unknown',
    ],
  },
  {
    type: 'glass',
    statuses: [
      'ALARM, Okay',
      'ALARM, Tripped',
      'Bypassed, Okay',
      'Bypassed, Tripped',
      'Low Battery, Okay',
      'Low Battery, Tripped',
      'Offline',
      'Okay',
      'Tampered, Okay',
      'Tampered, Tripped',
      'Tripped',
      'Trouble, Okay',
      'Trouble, Tripped',
      'Unknown',
    ],
  },
  {
    type: 'heat',
    statuses: [
      'ALARM, Okay',
      'ALARM, Tripped',
      'Bypassed, Okay',
      'Bypassed, Tripped',
      'Low Battery, Okay',
      'Low Battery, Tripped',
      'Offline',
      'Okay',
      'Tampered, Okay',
      'Tampered, Tripped',
      'Tripped',
      'Trouble, Okay',
      'Trouble, Tripped',
      'Unknown',
    ],
  },
  {
    type: 'motion',
    statuses: [
      'ALARM, Motion',
      'ALARM, No Motion',
      'ALARM, Okay',
      'Bypassed, Motion',
      'Bypassed, No Motion',
      'Bypassed, Okay',
      'Low Battery, Motion',
      'Low Battery, No Motion',
      'Low Battery, Okay',
      'Motion',
      'No Motion',
      'Offline',
      'Okay',
      'Tampered, Motion',
      'Tampered, No Motion',
      'Tampered, Okay',
      'Trouble, Motion',
      'Trouble, No Motion',
      'Trouble, Okay',
      'Unknown',
    ],
  },
  {
    type: 'shock',
    statuses: [
      'Offline',
      'Unknown',
    ],
  },
  {
    type: 'temperature',
    statuses: [
      'ALARM, Okay',
      'ALARM, Tripped',
      'Bypassed, Okay',
      'Bypassed, Tripped',
      'Low Battery, Okay',
      'Low Battery, Tripped',
      'Offline',
      'Okay',
      'Tampered, Okay',
      'Tampered, Tripped',
      'Tripped',
      'Trouble, Okay',
      'Trouble, Tripped',
      'Unknown',
    ],
  },
];

/**
 * Device gateways.
 *
 * @since 1.0.0
 */
export const deviceGateways: DeviceGateways = [
  {
    broadbandConnectionStatus: 'Active',
    cellularConnectionStatus: 'N/A',
    cellularSignalStrength: 'N/A',
    firmwareVersion: '24.0.0-9',
    hardwareVersion: 'HW=2, BL=1.1.9, PL=9.4.0.32.5, SKU=PGZNG1-1ADNAS',
    manufacturer: 'ADT Pulse Gateway',
    model: 'PGZNG1',
    primaryConnectionType: 'Broadband',
  },
];

/**
 * Device security panels.
 *
 * @since 1.0.0
 */
export const deviceSecurityPanels: DeviceSecurityPanels = [
  {
    emergencyKeys: 'Button: Fire Alarm (Zone 95) Button: Audible Panic Alarm (Zone 99)',
    manufacturerProvider: 'ADT',
    typeModel: 'Security Panel - Safewatch Pro 3000/3000CN',
  },
  {
    emergencyKeys: 'Button: Fire Alarm (Zone 95) Button: Personal Emergency (Zone 96) Button: Audible Panic Alarm (Zone 99)',
    manufacturerProvider: 'ADT',
    typeModel: 'Security Panel - Safewatch Pro 3000/3000CN',
  },
];

/**
 * Item condensed sensor types.
 *
 * @since 1.0.0
 */
export const itemCondensedSensorTypes: ItemCondensedSensorTypes = [
  'co',
  'doorWindow',
  'fire',
  'flood',
  'glass',
  'heat',
  'motion',
  'shock',
  'temperature',
];

/**
 * Item do submit handler relative urls.
 *
 * @since 1.0.0
 */
export const itemDoSubmitHandlerRelativeUrls: ItemDoSubmitHandlerRelativeUrls = [
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
 * Item do submit handler url params arm states.
 *
 * @since 1.0.0
 */
export const itemDoSubmitHandlerUrlParamsArmStates: ItemDoSubmitHandlerUrlParamsArmStates = [
  'forcearm',
];

/**
 * Item do submit handler url params arms.
 *
 * @since 1.0.0
 */
export const itemDoSubmitHandlerUrlParamsArms: ItemDoSubmitHandlerUrlParamsArms = [
  'away',
  'night',
  'stay',
];

/**
 * Item do submit handler url params hrefs.
 *
 * @since 1.0.0
 */
export const itemDoSubmitHandlerUrlParamsHrefs: ItemDoSubmitHandlerUrlParamsHrefs = [
  'rest/adt/ui/client/security/setForceArm',
  'rest/adt/ui/client/security/setCancelProtest',
];

/**
 * Item gateway information statuses.
 *
 * @since 1.0.0
 */
export const itemGatewayInformationStatuses: ItemGatewayInformationStatuses = [
  'Offline',
  'Online',
  'Status Unknown',
];

/**
 * Item orb security button button texts.
 *
 * @since 1.0.0
 */
export const itemOrbSecurityButtonButtonTexts: ItemOrbSecurityButtonButtonTexts = [
  'Arm Away',
  'Arm Night',
  'Arm Stay',
  'Clear Alarm',
  'Disarm',
];

/**
 * Item orb security button loading texts.
 *
 * @since 1.0.0
 */
export const itemOrbSecurityButtonLoadingTexts: ItemOrbSecurityButtonLoadingTexts = [
  'Arming Away',
  'Arming Night',
  'Arming Stay',
  'Disarming',
];

/**
 * Item orb security button relative urls.
 *
 * @since 1.0.0
 */
export const itemOrbSecurityButtonRelativeUrls: ItemOrbSecurityButtonRelativeUrls = [
  'quickcontrol/armDisarm.jsp',
];

/**
 * Item orb security button url params arm states.
 *
 * @since 1.0.0
 */
export const itemOrbSecurityButtonUrlParamsArmStates: ItemOrbSecurityButtonUrlParamsArmStates = [
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
 * Item orb security button url params arms.
 *
 * @since 1.0.0
 */
export const itemOrbSecurityButtonUrlParamsArms: ItemOrbSecurityButtonUrlParamsArms = [
  'away',
  'night',
  'off',
  'stay',
];

/**
 * Item orb security button url params hrefs.
 *
 * @since 1.0.0
 */
export const itemOrbSecurityButtonUrlParamsHrefs: ItemOrbSecurityButtonUrlParamsHrefs = [
  'rest/adt/ui/client/security/setArmState',
];

/**
 * Item panel information statuses.
 *
 * @since 1.0.0
 */
export const itemPanelInformationStatuses: ItemPanelInformationStatuses = [
  'Offline',
  'Online',
  'Status Unknown',
];

/**
 * Item panel status notes.
 *
 * @since 1.0.0
 */
export const itemPanelStatusNotes: ItemPanelStatusNotes = [
  'This may take several minutes',
];

/**
 * Item panel status states.
 *
 * @since 1.0.0
 */
export const itemPanelStatusStates: ItemPanelStatusStates = [
  'Armed Away',
  'Armed Night',
  'Armed Stay',
  'Disarmed',
  'No Entry Delay',
  'Status Unavailable',
];

/**
 * Item panel status statuses.
 *
 * @since 1.0.0
 */
export const itemPanelStatusStatuses: ItemPanelStatusStatuses = [
  '1 Sensor Open',
  ..._.range(148).map((_value, index) => `${index + 1} Sensors Open` as ItemPanelStatusStatusesSensorsOpen),
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
 * Item portal versions.
 *
 * @since 1.0.0
 */
export const itemPortalVersions: ItemPortalVersions = [
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
 * Item sensor information device types.
 *
 * @since 1.0.0
 */
export const itemSensorInformationDeviceTypes: ItemSensorInformationDeviceTypes = [
  'Carbon Monoxide Detector',
  'Door/Window Sensor',
  'Door Sensor',
  'Fire (Smoke/Heat) Detector',
  'Glass Break Detector',
  'Heat (Rate-of-Rise) Detector',
  'Motion Sensor',
  'Motion Sensor (Notable Events Only)',
  'Shock Sensor',
  'Temperature Sensor',
  'Water/Flood Sensor',
  'Window Sensor',
];

/**
 * Item sensor information statuses.
 *
 * @since 1.0.0
 */
export const itemSensorInformationStatuses: ItemSensorInformationStatuses = [
  'Installing',
  'Offline',
  'Online',
  'Status Unknown',
];

/**
 * Item sensor status icons.
 *
 * @since 1.0.0
 */
export const itemSensorStatusIcons: ItemSensorStatusIcons = [
  'devStatAlarm',
  'devStatInstalling',
  'devStatLowBatt',
  'devStatMotion',
  'devStatOffline',
  'devStatOK',
  'devStatOpen',
  'devStatTamper',
  'devStatUnknown',
];

/**
 * Item sensor status statuses.
 *
 * @since 1.0.0
 */
export const itemSensorStatusStatuses: ItemSensorStatusStatuses = [
  'ALARM',
  'Bypassed',
  'Closed',
  'Installing',
  'Low Battery',
  'Motion',
  'No Motion',
  'Offline',
  'Okay',
  'Open',
  'Tampered',
  'Tripped',
  'Trouble',
  'Unknown',
];
