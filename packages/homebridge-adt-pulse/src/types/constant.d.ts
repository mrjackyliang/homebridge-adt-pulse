/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PluginDeviceCategory =
  'ALARM_SYSTEM'
  | 'OTHER'
  | 'SECURITY_SYSTEM'
  | 'SENSOR'
  | 'SWITCH';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PluginDeviceGatewayType =
  'gateway';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PluginDeviceId =
  `adt-device-${number}`
  | `adt-device-${number}-${string}`;

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PluginDevicePanelType =
  'panel'
  | 'panelSwitch';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PluginDeviceSensorType =
  'co'
  | 'doorWindow'
  | 'fire'
  | 'flood'
  | 'glass'
  | 'heat'
  | 'motion'
  | 'shock'
  | 'temperature';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PluginLogLevel =
  'error'
  | 'info'
  | 'success'
  | 'warn';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PluginSettingOptions =
  'disableAlarmRingingSwitch'
  | 'ignoreSensorProblemStatus';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalDeviceGatewayStatus =
  'Offline'
  | 'Online'
  | 'Status Unknown';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalDevicePanelStatus =
  'Offline'
  | 'Online'
  | 'Status Unknown';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalDeviceSensorStatus =
  'Installing'
  | 'Offline'
  | 'Online'
  | 'Status Unknown';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalPanelArmButtonHref =
  'rest/adt/ui/client/security/setArmState';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalPanelArmButtonId =
  `security_button_${number}`;

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalPanelArmButtonLoadingText =
  'Arming Away'
  | 'Arming Night'
  | 'Arming Stay'
  | 'Disarming';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalPanelArmButtonRelativeUrl =
  'quickcontrol/armDisarm.jsp';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalPanelArmButtonText =
  'Arm Away'
  | 'Arm Night'
  | 'Arm Stay'
  | 'Clear Alarm'
  | 'Disarm';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalPanelArmStateClean =
  'away'
  | 'disarmed_with_alarm'
  | 'night'
  | 'off'
  | 'sensortest'
  | 'stay';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalPanelArmStateDirty =
  'away'
  | 'disarmed'
  | 'disarmed+with+alarm'
  | 'night+stay'
  | 'sensortest'
  | 'stay';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalPanelArmStateForce =
  'forcearm';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalPanelArmValue =
  'away'
  | 'night'
  | 'off'
  | 'stay';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalPanelForceArmButtonHref =
  'rest/adt/ui/client/security/setForceArm'
  | 'rest/adt/ui/client/security/setCancelProtest';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalPanelForceArmButtonRelativeUrl =
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
  | '/myhome/27.0.0-140/quickcontrol/serv/RunRRACommand'
  | '/myhome/28.0.0-57/quickcontrol/serv/RunRRACommand'
  | '/myhome/29.0.0-28/quickcontrol/serv/RunRRACommand'
  | '/myhome/30.0.0-61/quickcontrol/serv/RunRRACommand';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalPanelNote =
  'EXIT FAULT ALARM'
  | 'PERSONAL EMERGENCY ALARM'
  | 'SILENT PANIC ALARM'
  | 'This may take several minutes';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalPanelState =
  'Armed Away'
  | 'Armed Night'
  | 'Armed Stay'
  | 'Disarmed'
  | 'No Entry Delay'
  | 'Status Unavailable';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalPanelStatus =
  '1 Sensor Open'
  | Constant_PortalPanelStatusSensorsOpen
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
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalPanelStatusSensorsOpen =
  `${number} Sensors Open`;

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalSensorDeviceType =
  'Carbon Monoxide Detector'
  | 'Door/Window Sensor'
  | 'Door Sensor'
  | 'Fire (Smoke/Heat) Detector'
  | 'Glass Break Detector'
  | 'Heat (Rate-of-Rise) Detector'
  | 'Motion Sensor'
  | 'Motion Sensor (Notable Events Only)'
  | 'Shock Sensor'
  | 'Temperature Sensor'
  | 'Water/Flood Sensor'
  | 'Window Sensor';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalSensorStatusIcon =
  'devStatAlarm'
  | 'devStatInstalling'
  | 'devStatLowBatt'
  | 'devStatMotion'
  | 'devStatOffline'
  | 'devStatOK'
  | 'devStatOpen'
  | 'devStatTamper'
  | 'devStatUnknown';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalSensorStatusText =
  'ALARM'
  | 'Bypassed'
  | 'Closed'
  | 'Installing'
  | 'Low Battery'
  | 'Motion'
  | 'No Motion'
  | 'Offline'
  | 'Okay'
  | 'Open'
  | 'Tampered'
  | 'Tripped'
  | 'Trouble'
  | 'Unknown';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalSubdomain =
  'portal'
  | 'portal-ca';

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalSyncCode =
  '1-0-0'
  | '2-0-0'
  | `${number}-0-0`
  | `${number}-${number}-0`;

/**
 * Constant.
 *
 * @since 1.0.0
 */
export type Constant_PortalVersion =
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
  | '27.0.0-140'
  | '28.0.0-57'
  | '29.0.0-28'
  | '30.0.0-61';
