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
  {
    description: 'Force arm required',
    handlers: [
      {
        href: 'rest/adt/ui/client/security/setForceArm',
      },
      {
        href: 'rest/adt/ui/client/security/setCancelProtest',
      },
    ],
  },
  {
    description: 'No force arm required',
    handlers: [],
  },
];

/**
 * Collection orb security buttons.
 *
 * @since 1.0.0
 */
export const collectionOrbSecurityButtons: CollectionOrbSecurityButtons = [
  {
    description: 'System disarmed / Normal',
    buttons: [
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
  },
  {
    description: 'System disarmed / Unresolved sensor problem',
    buttons: [
      {
        buttonDisabled: false,
        buttonText: 'Disarm',
        loadingText: 'Disarming',
      },
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
  },
  {
    description: 'System disarmed / Uncleared alarm',
    buttons: [
      {
        buttonDisabled: false,
        buttonText: 'Clear Alarm',
        loadingText: 'Disarming',
      },
    ],
  },
  {
    description: 'System armed',
    buttons: [
      {
        buttonDisabled: false,
        buttonText: 'Disarm',
        loadingText: 'Disarming',
      },
    ],
  },
  {
    description: 'System busy / Disarming',
    buttons: [
      {
        buttonDisabled: true,
        buttonText: 'Disarming',
        loadingText: null,
      },
    ],
  },
  {
    description: 'System busy / Arming Away',
    buttons: [
      {
        buttonDisabled: true,
        buttonText: 'Arming Away',
        loadingText: null,
      },
    ],
  },
  {
    description: 'System busy / Arming Stay',
    buttons: [
      {
        buttonDisabled: true,
        buttonText: 'Arming Stay',
        loadingText: null,
      },
    ],
  },
  {
    description: 'System busy / Arming Night',
    buttons: [
      {
        buttonDisabled: true,
        buttonText: 'Arming Night',
        loadingText: null,
      },
    ],
  },
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
    description: 'ADT Pulse Gateway iHub-3001 / HW 3.4 / BL 1.3 / Broadband',
    gateway: {
      firmwareVersion: '24.0.0-9',
      hardwareVersion: 'HW=3.4, BL=ICONTROL_CFE 1.3, PL=24.0.0-9, SKU=0YUC0500MY5',
      manufacturer: 'ADT Pulse Gateway',
      model: 'iHub-3001',
      primaryConnectionType: 'Broadband',
    },
  },
  {
    description: 'ADT Pulse Gateway iHub-3001 / HW 3.4 / BL 1.4 / Broadband',
    gateway: {
      firmwareVersion: '24.0.0-9',
      hardwareVersion: 'HW=3.4, BL=ICONTROL_CFE 1.4, PL=24.0.0-9, SKU=0YUC0500MY5',
      manufacturer: 'ADT Pulse Gateway',
      model: 'iHub-3001',
      primaryConnectionType: 'Broadband',
    },
  },
  {
    description: 'ADT Pulse Gateway PGZNG1 / HW 1 / Broadband',
    gateway: {
      firmwareVersion: '24.0.0-9',
      hardwareVersion: 'HW=1, BL=1.1.9, PL=9.4.0.32.5, SKU=PGZNG1-1ADNAS',
      manufacturer: 'ADT Pulse Gateway',
      model: 'PGZNG1',
      primaryConnectionType: 'Broadband',
    },
  },
  {
    description: 'ADT Pulse Gateway PGZNG1 / HW 2 / Broadband',
    gateway: {
      firmwareVersion: '24.0.0-9',
      hardwareVersion: 'HW=2, BL=1.1.9, PL=9.4.0.32.5, SKU=PGZNG1-1ADNAS',
      manufacturer: 'ADT Pulse Gateway',
      model: 'PGZNG1',
      primaryConnectionType: 'Broadband',
    },
  },
  {
    description: 'ADT TSSC Lifestyle Module / HW 1 / Broadband',
    gateway: {
      firmwareVersion: '24.0.0-9',
      hardwareVersion: 'HW=0001, BL=UBOOT 2009.08-svn99, PL=5.5.0-5, SKU=TSSC-NA-NONE-01',
      manufacturer: 'ADT',
      model: 'TSSC Lifestyle Module',
      primaryConnectionType: 'Broadband',
    },
  },
  {
    description: 'ADT TSSC Lifestyle Module / HW 2 / Broadband',
    gateway: {
      firmwareVersion: '24.0.0-9',
      hardwareVersion: 'HW=0002, BL=UBOOT 2009.08-svn99, PL=5.5.0-5, SKU=TSSC-NA-NONE-01',
      manufacturer: 'ADT',
      model: 'TSSC Lifestyle Module',
      primaryConnectionType: 'Broadband',
    },
  },
  {
    description: 'Compact SMA Protocol Gateway / HW 2 / Broadband',
    gateway: {
      firmwareVersion: '27.0.0-140',
      hardwareVersion: 'HW=02_CSMAP, BL=NA, PL=27.0.0-140',
      manufacturer: null,
      model: 'Compact SMA Protocol Gateway',
      primaryConnectionType: 'Broadband',
    },
  },
  {
    description: 'Compact SMA Protocol Gateway / HW 2 / Cellular',
    gateway: {
      firmwareVersion: '27.0.0-140',
      hardwareVersion: 'HW=02_CSMAP, BL=NA, PL=27.0.0-140',
      manufacturer: null,
      model: 'Compact SMA Protocol Gateway',
      primaryConnectionType: 'Cellular',
    },
  },
  {
    description: 'Lynx/QuickConnect Cellular-Only Gateway / HW 2 / Cellular',
    gateway: {
      firmwareVersion: '27.0.0-140',
      hardwareVersion: 'HW=02_Lynx, BL=ICONTROL_CFE 1.0, PL=27.0.0-140',
      manufacturer: null,
      model: 'Lynx/QuickConnect Cellular-Only Gateway',
      primaryConnectionType: 'Cellular',
    },
  },
];

/**
 * Device security panels.
 *
 * @since 1.0.0
 */
export const deviceSecurityPanels: DeviceSecurityPanels = [
  {
    description: 'ADT Safewatch Pro 3000/3000CN',
    panel: {
      manufacturerProvider: 'ADT',
      typeModel: 'Security Panel - Safewatch Pro 3000/3000CN',
    },
  },
  {
    description: 'ADT TSSC Life Safety Module',
    panel: {
      manufacturerProvider: 'ADT',
      typeModel: 'TSSC Life Safety Module',
    },
  },
  {
    description: 'Ademco LYNX/ADT QuickConnect',
    panel: {
      manufacturerProvider: null,
      typeModel: 'Security Panel - LYNX/QuickConnect',
    },
  },
  {
    description: 'DSC Impassa SCW9057',
    panel: {
      manufacturerProvider: 'DSC',
      typeModel: 'Security Panel - Impassa SCW9057',
    },
  },
  {
    description: 'GE Security Concord 4',
    panel: {
      manufacturerProvider: 'GE Security',
      typeModel: 'Security Panel - Concord 4',
    },
  },
  {
    description: 'Honeywell Security Vista-20PSIA',
    panel: {
      manufacturerProvider: 'Honeywell Security',
      typeModel: 'Security Panel - Vista-20PSIA',
    },
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
