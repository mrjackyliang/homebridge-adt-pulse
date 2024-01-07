/**
 * Plugin device category.
 *
 * @since 1.0.0
 */
export type PluginDeviceCategory =
  'ALARM_SYSTEM'
  | 'OTHER'
  | 'SECURITY_SYSTEM'
  | 'SENSOR';

/**
 * Plugin device gateway type.
 *
 * @since 1.0.0
 */
export type PluginDeviceGatewayType =
  'gateway';

/**
 * Plugin device id.
 *
 * @since 1.0.0
 */
export type PluginDeviceId =
  `adt-device-${number}`;

/**
 * Plugin device panel type.
 *
 * @since 1.0.0
 */
export type PluginDevicePanelType =
  'panel';

/**
 * Plugin device sensor type.
 *
 * @since 1.0.0
 */
export type PluginDeviceSensorType =
  'co'
  | 'doorWindow'
  | 'fire'
  | 'flood'
  | 'glass'
  | 'heat'
  | 'keypad'
  | 'motion'
  | 'panic'
  | 'shock'
  | 'supervisory'
  | 'temperature'
  | 'unknown';

/**
 * Plugin log level.
 *
 * @since 1.0.0
 */
export type PluginLogLevel =
  'error'
  | 'info'
  | 'success'
  | 'warn';

/**
 * Portal device gateway status.
 *
 * @since 1.0.0
 */
export type PortalDeviceGatewayStatus =
  'Offline'
  | 'Online'
  | 'Status Unknown';

/**
 * Portal device panel status.
 *
 * @since 1.0.0
 */
export type PortalDevicePanelStatus =
  'Offline'
  | 'Online'
  | 'Status Unknown';

/**
 * Portal device sensor status.
 *
 * @since 1.0.0
 */
export type PortalDeviceSensorStatus =
  'Offline'
  | 'Online'
  | 'Status Unknown';

/**
 * Portal panel arm button href.
 *
 * @since 1.0.0
 */
export type PortalPanelArmButtonHref =
  'rest/adt/ui/client/security/setArmState';

/**
 * Portal panel arm button id.
 *
 * @since 1.0.0
 */
export type PortalPanelArmButtonId =
  `security_button_${number}`;

/**
 * Portal panel arm button loading text.
 *
 * @since 1.0.0
 */
export type PortalPanelArmButtonLoadingText =
  'Arming Away'
  | 'Arming Night'
  | 'Arming Stay'
  | 'Disarming';

/**
 * Portal panel arm button relative url.
 *
 * @since 1.0.0
 */
export type PortalPanelArmButtonRelativeUrl =
  'quickcontrol/armDisarm.jsp';

/**
 * Portal panel arm button text.
 *
 * @since 1.0.0
 */
export type PortalPanelArmButtonText =
  'Arm Away'
  | 'Arm Night'
  | 'Arm Stay'
  | 'Clear Alarm'
  | 'Disarm';

/**
 * Portal panel arm state clean.
 *
 * @since 1.0.0
 */
export type PortalPanelArmStateClean =
  'away'
  | 'disarmed_with_alarm'
  | 'night'
  | 'off'
  | 'stay';

/**
 * Portal panel arm state dirty.
 *
 * @since 1.0.0
 */
export type PortalPanelArmStateDirty =
  'away'
  | 'disarmed'
  | 'disarmed+with+alarm'
  | 'night+stay'
  | 'stay';

/**
 * Portal panel arm state force.
 *
 * @since 1.0.0
 */
export type PortalPanelArmStateForce =
  'forcearm';

/**
 * Portal panel arm value.
 *
 * @since 1.0.0
 */
export type PortalPanelArmValue =
  'away'
  | 'night'
  | 'off'
  | 'stay';

/**
 * Portal panel force arm button href.
 *
 * @since 1.0.0
 */
export type PortalPanelForceArmButtonHref =
  'rest/adt/ui/client/security/setForceArm'
  | 'rest/adt/ui/client/security/setCancelProtest';

/**
 * Portal panel force arm button relative url.
 *
 * @since 1.0.0
 */
export type PortalPanelForceArmButtonRelativeUrl =
  '/myhome/16.0.0-131/quickcontrol/serv/RunRRACommand'
  | '/myhome/17.0.0-69/quickcontrol/serv/RunRRACommand'
  | '/myhome/18.0.0-78/quickcontrol/serv/RunRRACommand'
  | '/myhome/19.0.0-89/quickcontrol/serv/RunRRACommand'
  | '/myhome/20.0.0-221/quickcontrol/serv/RunRRACommand'
  | '/myhome/20.0.0-244/quickcontrol/serv/RunRRACommand'
  | '/myhome/21.0.0-344/quickcontrol/serv/RunRRACommand'
  | '/myhome/21.0.0-353/quickcontrol/serv/RunRRACommand'
  | '/myhome/21.0.0-354/quickcontrol/serv/RunRRACommand'
  | '/myhome/22.0.0-233/quickcontrol/serv/RunRRACommand'
  | '/myhome/23.0.0-99/quickcontrol/serv/RunRRACommand'
  | '/myhome/24.0.0-117/quickcontrol/serv/RunRRACommand'
  | '/myhome/25.0.0-21/quickcontrol/serv/RunRRACommand'
  | '/myhome/26.0.0-32/quickcontrol/serv/RunRRACommand'
  | '/myhome/27.0.0-140/quickcontrol/serv/RunRRACommand';

/**
 * Portal panel note.
 *
 * @since 1.0.0
 */
export type PortalPanelNote =
  'This may take several minutes';

/**
 * Portal panel state.
 *
 * @since 1.0.0
 */
export type PortalPanelState =
  'Armed Away'
  | 'Armed Night'
  | 'Armed Stay'
  | 'Disarmed'
  | 'No Entry Delay'
  | 'Status Unavailable';

/**
 * Portal panel status.
 *
 * @since 1.0.0
 */
export type PortalPanelStatus =
  '1 Sensor Open'
  | PortalPanelStatusSensorsOpen
  | 'All Quiet'
  | 'BURGLARY ALARM'
  | 'Carbon Monoxide Alarm'
  | 'FIRE ALARM'
  | 'Motion'
  | 'Sensor Bypassed'
  | 'Sensor Problem'
  | 'Sensor Problems'
  | 'Sensors Bypassed'
  | 'Sensors Tripped'
  | 'Sensor Tripped'
  | 'Uncleared Alarm'
  | 'WATER ALARM';

/**
 * Portal panel status sensors open.
 *
 * @since 1.0.0
 */
export type PortalPanelStatusSensorsOpen =
  `${number} Sensors Open`;

/**
 * Portal sensor device type.
 *
 * @since 1.0.0
 */
export type PortalSensorDeviceType =
  'Audible Panic Button/Pendant'
  | 'Carbon Monoxide Detector'
  | 'Door/Window Sensor'
  | 'Door Sensor'
  | 'Fire (Smoke/Heat) Detector'
  | 'Glass Break Detector'
  | 'Heat (Rate-of-Rise) Detector'
  | 'Keypad/Touchpad'
  | 'Motion Sensor'
  | 'Motion Sensor (Notable Events Only)'
  | 'Shock Sensor'
  | 'Silent Panic Button/Pendant'
  | 'System/Supervisory'
  | 'Temperature Sensor'
  | 'Unknown Device Type'
  | 'Water/Flood Sensor'
  | 'Window Sensor';

/**
 * Portal sensor status icon.
 *
 * @since 1.0.0
 */
export type PortalSensorStatusIcon =
  'devStatAlarm'
  | 'devStatLowBatt'
  | 'devStatMotion'
  | 'devStatOffline'
  | 'devStatOK'
  | 'devStatOpen'
  | 'devStatTamper'
  | 'devStatUnknown';

/**
 * Portal sensor status text.
 *
 * @since 1.0.0
 */
export type PortalSensorStatusText =
  'ALARM'
  | 'Bypassed'
  | 'Closed'
  | 'Low Battery'
  | 'Motion'
  | 'No Motion'
  | 'Offline'
  | 'Okay'
  | 'Open'
  | 'Tripped'
  | 'Trouble'
  | 'Unknown';

/**
 * Portal subdomain.
 *
 * @since 1.0.0
 */
export type PortalSubdomain =
  'portal'
  | 'portal-ca';

/**
 * Portal sync code.
 *
 * @since 1.0.0
 */
export type PortalSyncCode =
  '1-0-0'
  | '2-0-0'
  | `${number}-0-0`
  | `${number}-${number}-0`;

/**
 * Portal version.
 *
 * @since 1.0.0
 */
export type PortalVersion =
  '16.0.0-131'
  | '17.0.0-69'
  | '18.0.0-78'
  | '19.0.0-89'
  | '20.0.0-221'
  | '20.0.0-244'
  | '21.0.0-344'
  | '21.0.0-353'
  | '21.0.0-354'
  | '22.0.0-233'
  | '23.0.0-99'
  | '24.0.0-117'
  | '25.0.0-21'
  | '26.0.0-32'
  | '27.0.0-140';
