import _ from 'lodash';

import type {
  Lib_Items_CollectionDoSubmitHandlers,
  Lib_Items_CollectionOrbSecurityButtons,
  Lib_Items_CollectionSensorActions,
  Lib_Items_DeviceGateways,
  Lib_Items_DeviceSecurityPanels,
  Lib_Items_ItemCondensedSensorTypes,
  Lib_Items_ItemDoSubmitHandlerRelativeUrls,
  Lib_Items_ItemDoSubmitHandlerUrlParamsArms,
  Lib_Items_ItemDoSubmitHandlerUrlParamsArmStates,
  Lib_Items_ItemDoSubmitHandlerUrlParamsHrefs,
  Lib_Items_ItemGatewayInformationStatuses,
  Lib_Items_ItemOrbSecurityButtonButtonTexts,
  Lib_Items_ItemOrbSecurityButtonLoadingTexts,
  Lib_Items_ItemOrbSecurityButtonRelativeUrls,
  Lib_Items_ItemOrbSecurityButtonUrlParamsArms,
  Lib_Items_ItemOrbSecurityButtonUrlParamsArmStates,
  Lib_Items_ItemOrbSecurityButtonUrlParamsHrefs,
  Lib_Items_ItemPanelInformationStatuses,
  Lib_Items_ItemPanelStatusNotes,
  Lib_Items_ItemPanelStatusStates,
  Lib_Items_ItemPanelStatusStatuses,
  Lib_Items_ItemPanelStatusStatuses_SensorsOpen,
  Lib_Items_ItemPortalVersions,
  Lib_Items_ItemSensorInformationDeviceTypes,
  Lib_Items_ItemSensorInformationStatuses,
  Lib_Items_ItemSensorStatusIcons,
  Lib_Items_ItemSensorStatusStatuses,
} from '../types/lib/items.d.ts';

/**
 * Lib - Items - Collection Do Submit Handlers.
 *
 * Catalogs the known do submit handler groups served by the ADT Pulse portal so
 * helper functions can condense scraped handlers into recognized scenarios.
 *
 * @since 1.0.0
 */
export const collectionDoSubmitHandlers: Lib_Items_CollectionDoSubmitHandlers = [{
  description: 'Force arm required',
  handlers: [
    {
      href: 'rest/adt/ui/client/security/setForceArm',
    },
    {
      href: 'rest/adt/ui/client/security/setCancelProtest',
    },
  ],
}];

/**
 * Lib - Items - Collection Orb Security Buttons.
 *
 * Catalogs the known orb security button sets shown for each panel state so helper
 * functions can condense scraped buttons into a recognized arm state scenario.
 *
 * @since 1.0.0
 */
export const collectionOrbSecurityButtons: Lib_Items_CollectionOrbSecurityButtons = [
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
    buttons: [{
      buttonDisabled: false,
      buttonText: 'Clear Alarm',
      loadingText: 'Disarming',
    }],
  },
  {
    description: 'System armed',
    buttons: [{
      buttonDisabled: false,
      buttonText: 'Disarm',
      loadingText: 'Disarming',
    }],
  },
  {
    description: 'System busy / Disarming',
    buttons: [{
      buttonDisabled: true,
      buttonText: 'Disarming',
      loadingText: null,
    }],
  },
  {
    description: 'System busy / Arming Away',
    buttons: [{
      buttonDisabled: true,
      buttonText: 'Arming Away',
      loadingText: null,
    }],
  },
  {
    description: 'System busy / Arming Stay',
    buttons: [{
      buttonDisabled: true,
      buttonText: 'Arming Stay',
      loadingText: null,
    }],
  },
  {
    description: 'System busy / Arming Night',
    buttons: [{
      buttonDisabled: true,
      buttonText: 'Arming Night',
      loadingText: null,
    }],
  },
];

/**
 * Lib - Items - Collection Sensor Actions.
 *
 * Maps each condensed sensor type to the statuses the portal may report for it so
 * detection logic can tell when a sensor returns a status that is not yet known.
 *
 * @since 1.0.0
 */
export const collectionSensorActions: Lib_Items_CollectionSensorActions = [
  {
    type: 'co',
    statuses: [
      'ALARM, Okay',
      'ALARM, Tripped',
      'Bypassed, Okay',
      'Bypassed, Tripped',
      'Installing',
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
      'Installing',
      'Low Battery, Closed',
      'Low Battery, Open',
      'Offline',
      'Open',
      'Tampered, Closed',
      'Tampered, Open',
      'Tripped',
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
      'Installing',
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
      'Installing',
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
      'Installing',
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
      'Installing',
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
      'Installing',
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
      'Installing',
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
      'Installing',
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
 * Lib - Items - Device Gateways.
 *
 * Catalogs the known gateway manufacturer, model, and connection type combinations
 * so unfamiliar gateway hardware reported by the portal can be surfaced for review.
 *
 * @since 1.0.0
 */
export const deviceGateways: Lib_Items_DeviceGateways = [
  {
    description: 'ADT Pulse Gateway iHub-3001 / Broadband',
    gateway: {
      manufacturer: 'ADT Pulse Gateway',
      model: 'iHub-3001',
      primaryConnectionType: 'Broadband',
    },
  },
  {
    description: 'ADT Pulse Gateway PGZNG1 / Broadband',
    gateway: {
      manufacturer: 'ADT Pulse Gateway',
      model: 'PGZNG1',
      primaryConnectionType: 'Broadband',
    },
  },
  {
    description: 'ADT TSSC Lifestyle Module / Broadband',
    gateway: {
      manufacturer: 'ADT',
      model: 'TSSC Lifestyle Module',
      primaryConnectionType: 'Broadband',
    },
  },
  {
    description: 'Compact SMA Protocol Gateway / Broadband',
    gateway: {
      manufacturer: null,
      model: 'Compact SMA Protocol Gateway',
      primaryConnectionType: 'Broadband',
    },
  },
  {
    description: 'Compact SMA Protocol Gateway / Cellular',
    gateway: {
      manufacturer: null,
      model: 'Compact SMA Protocol Gateway',
      primaryConnectionType: 'Cellular',
    },
  },
  {
    description: 'Lynx/QuickConnect Cellular-Only Gateway / Cellular',
    gateway: {
      manufacturer: null,
      model: 'Lynx/QuickConnect Cellular-Only Gateway',
      primaryConnectionType: 'Cellular',
    },
  },
];

/**
 * Lib - Items - Device Security Panels.
 *
 * Catalogs the known security panel manufacturer and model combinations so
 * unfamiliar panel hardware reported by the portal can be surfaced for review.
 *
 * @since 1.0.0
 */
export const deviceSecurityPanels: Lib_Items_DeviceSecurityPanels = [
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
    description: 'DSC Impassa/SCW',
    panel: {
      manufacturerProvider: null,
      typeModel: 'Security Panel - Impassa/SCW',
    },
  },
  {
    description: 'DSC PowerSeries/ADT PremisePro',
    panel: {
      manufacturerProvider: null,
      typeModel: 'Security Panel - PowerSeries/PremisePro',
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
 * Lib - Items - Item Condensed Sensor Types.
 *
 * Lists every condensed sensor type the plugin can expose as a HomeKit accessory
 * so accessory setup can reject sensors with types it does not understand.
 *
 * @since 1.0.0
 */
export const itemCondensedSensorTypes: Lib_Items_ItemCondensedSensorTypes = [
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
 * Lib - Items - Item Do Submit Handler Relative URLs.
 *
 * Lists the known do submit handler relative URLs across supported portal versions
 * so detection logic can flag URLs introduced by newer portal releases.
 *
 * @since 1.0.0
 */
export const itemDoSubmitHandlerRelativeUrls: Lib_Items_ItemDoSubmitHandlerRelativeUrls = [
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
  '/myhome/28.0.0-57/quickcontrol/serv/RunRRACommand',
  '/myhome/29.0.0-28/quickcontrol/serv/RunRRACommand',
  '/myhome/30.0.0-61/quickcontrol/serv/RunRRACommand',
];

/**
 * Lib - Items - Item Do Submit Handler URL Params Arm States.
 *
 * Lists the known arm state URL parameter values for do submit handlers so
 * detection logic can flag values the plugin has not seen before.
 *
 * @since 1.0.0
 */
export const itemDoSubmitHandlerUrlParamsArmStates: Lib_Items_ItemDoSubmitHandlerUrlParamsArmStates = ['forcearm'];

/**
 * Lib - Items - Item Do Submit Handler URL Params Arms.
 *
 * Lists the known arm URL parameter values for do submit handlers so detection
 * logic can flag values the plugin has not seen before.
 *
 * @since 1.0.0
 */
export const itemDoSubmitHandlerUrlParamsArms: Lib_Items_ItemDoSubmitHandlerUrlParamsArms = [
  'away',
  'night',
  'stay',
];

/**
 * Lib - Items - Item Do Submit Handler URL Params Hrefs.
 *
 * Lists the known href URL parameter values for do submit handlers so detection
 * logic can flag endpoints the plugin has not seen before.
 *
 * @since 1.0.0
 */
export const itemDoSubmitHandlerUrlParamsHrefs: Lib_Items_ItemDoSubmitHandlerUrlParamsHrefs = [
  'rest/adt/ui/client/security/setForceArm',
  'rest/adt/ui/client/security/setCancelProtest',
];

/**
 * Lib - Items - Item Gateway Information Statuses.
 *
 * Lists the known gateway status strings reported by the portal so detection
 * logic can flag statuses that may require new handling in the plugin.
 *
 * @since 1.0.0
 */
export const itemGatewayInformationStatuses: Lib_Items_ItemGatewayInformationStatuses = [
  'Offline',
  'Online',
  'Status Unknown',
];

/**
 * Lib - Items - Item Orb Security Button Button Texts.
 *
 * Lists the known button text labels for orb security buttons so detection logic
 * can flag labels introduced by portal changes.
 *
 * @since 1.0.0
 */
export const itemOrbSecurityButtonButtonTexts: Lib_Items_ItemOrbSecurityButtonButtonTexts = [
  'Arm Away',
  'Arm Night',
  'Arm Stay',
  'Clear Alarm',
  'Disarm',
];

/**
 * Lib - Items - Item Orb Security Button Loading Texts.
 *
 * Lists the known loading text labels for orb security buttons so detection logic
 * can flag labels introduced by portal changes.
 *
 * @since 1.0.0
 */
export const itemOrbSecurityButtonLoadingTexts: Lib_Items_ItemOrbSecurityButtonLoadingTexts = [
  'Arming Away',
  'Arming Night',
  'Arming Stay',
  'Disarming',
];

/**
 * Lib - Items - Item Orb Security Button Relative URLs.
 *
 * Lists the known relative URLs used by orb security buttons so detection logic
 * can flag URLs introduced by portal changes.
 *
 * @since 1.0.0
 */
export const itemOrbSecurityButtonRelativeUrls: Lib_Items_ItemOrbSecurityButtonRelativeUrls = ['quickcontrol/armDisarm.jsp'];

/**
 * Lib - Items - Item Orb Security Button URL Params Arm States.
 *
 * Lists the known arm state URL parameter values for orb security buttons so
 * detection logic can flag values the plugin has not seen before.
 *
 * @since 1.0.0
 */
export const itemOrbSecurityButtonUrlParamsArmStates: Lib_Items_ItemOrbSecurityButtonUrlParamsArmStates = [
  '',
  'away',
  'disarmed',
  'disarmed_with_alarm',
  'disarmed+with+alarm',
  'night',
  'night+stay',
  'off',
  'sensortest',
  'stay',
];

/**
 * Lib - Items - Item Orb Security Button URL Params Arms.
 *
 * Lists the known arm URL parameter values for orb security buttons so detection
 * logic can flag values the plugin has not seen before.
 *
 * @since 1.0.0
 */
export const itemOrbSecurityButtonUrlParamsArms: Lib_Items_ItemOrbSecurityButtonUrlParamsArms = [
  'away',
  'night',
  'off',
  'stay',
];

/**
 * Lib - Items - Item Orb Security Button URL Params Hrefs.
 *
 * Lists the known href URL parameter values for orb security buttons so detection
 * logic can flag endpoints the plugin has not seen before.
 *
 * @since 1.0.0
 */
export const itemOrbSecurityButtonUrlParamsHrefs: Lib_Items_ItemOrbSecurityButtonUrlParamsHrefs = ['rest/adt/ui/client/security/setArmState'];

/**
 * Lib - Items - Item Panel Information Statuses.
 *
 * Lists the known security panel status strings reported by the portal so
 * detection logic can flag statuses that may require new handling in the plugin.
 *
 * @since 1.0.0
 */
export const itemPanelInformationStatuses: Lib_Items_ItemPanelInformationStatuses = [
  'Offline',
  'Online',
  'Status Unknown',
];

/**
 * Lib - Items - Item Panel Status Notes.
 *
 * Lists the known note strings that may accompany a panel status so summary
 * parsing can separate notes from states and statuses in the orb text.
 *
 * @since 1.0.0
 */
export const itemPanelStatusNotes: Lib_Items_ItemPanelStatusNotes = [
  'EXIT FAULT ALARM',
  'PERSONAL EMERGENCY ALARM',
  'SILENT PANIC ALARM',
  'This may take several minutes',
];

/**
 * Lib - Items - Item Panel Status States.
 *
 * Lists the known panel state strings shown in the orb text summary so parsing
 * can classify each section as a state, status, or note.
 *
 * @since 1.0.0
 */
export const itemPanelStatusStates: Lib_Items_ItemPanelStatusStates = [
  'Armed Away',
  'Armed Night',
  'Armed Stay',
  'Disarmed',
  'No Entry Delay',
  'Status Unavailable',
];

/**
 * Lib - Items - Item Panel Status Statuses.
 *
 * Lists the known panel status strings, including generated sensors open counts,
 * so orb text summary parsing can classify each section it encounters.
 *
 * @since 1.0.0
 */
export const itemPanelStatusStatuses: Lib_Items_ItemPanelStatusStatuses = [
  '1 Sensor Open',
  ..._.range(148).map((_value, index): Lib_Items_ItemPanelStatusStatuses_SensorsOpen => `${index + 1} Sensors Open`),
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
 * Lib - Items - Item Portal Versions.
 *
 * Lists the portal versions this plugin has been tested against so detection
 * logic can flag untested versions that may change scraped page structure.
 *
 * @since 1.0.0
 */
export const itemPortalVersions: Lib_Items_ItemPortalVersions = [
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
  '28.0.0-57',
  '29.0.0-28',
  '30.0.0-61',
];

/**
 * Lib - Items - Item Sensor Information Device Types.
 *
 * Lists the known sensor device type strings reported by the portal so detection
 * logic can flag device types the plugin does not recognize yet.
 *
 * @since 1.0.0
 */
export const itemSensorInformationDeviceTypes: Lib_Items_ItemSensorInformationDeviceTypes = [
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
 * Lib - Items - Item Sensor Information Statuses.
 *
 * Lists the known sensor information status strings reported by the portal so
 * detection logic can flag statuses that may require new handling.
 *
 * @since 1.0.0
 */
export const itemSensorInformationStatuses: Lib_Items_ItemSensorInformationStatuses = [
  'Installing',
  'Offline',
  'Online',
  'Status Unknown',
];

/**
 * Lib - Items - Item Sensor Status Icons.
 *
 * Lists the known sensor status icon names used by the portal so detection logic
 * can flag icons introduced by portal changes.
 *
 * @since 1.0.0
 */
export const itemSensorStatusIcons: Lib_Items_ItemSensorStatusIcons = [
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
 * Lib - Items - Item Sensor Status Statuses.
 *
 * Lists the known individual sensor status strings reported by the portal so
 * detection logic can flag statuses the plugin does not recognize yet.
 *
 * @since 1.0.0
 */
export const itemSensorStatusStatuses: Lib_Items_ItemSensorStatusStatuses = [
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
