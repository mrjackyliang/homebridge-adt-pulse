/**
 * Plugin config platform.
 *
 * @since 1.0.0
 */
export type PluginConfigPlatform =
  'ADTPulse';

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
 * Plugin device id.
 *
 * @since 1.0.0
 */
export type PluginDeviceId =
  `adt-device-${number}`;

/**
 * Portal device status.
 *
 * @since 1.0.0
 */
export type PortalDeviceStatus =
  'Online'
  | 'Status Unknown';

/**
 * Plugin device type.
 *
 * @since 1.0.0
 */
export type PluginDeviceType =
  'co'
  | 'doorWindow'
  | 'fire'
  | 'flood'
  | 'gateway'
  | 'glass'
  | 'keypad'
  | 'motion'
  | 'panel'
  | 'panic'
  | 'temperature';

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
 * Portal panel arm button id.
 *
 * @since 1.0.0
 */
export type PortalPanelArmButtonId =
  `security_button_${number}`;

/**
 * Portal panel arm button href.
 *
 * @since 1.0.0
 */
export type PortalPanelArmButtonHref =
  'rest/adt/ui/client/security/setArmState';

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
  `/myhome/${PortalVersion}/quickcontrol/serv/RunRRACommand`;

/**
 * Portal panel force arm response.
 *
 * @since 1.0.0
 */
export type PortalPanelForceArmResponse =
  'Could not process the request!</br></br>Error: 1.0-OKAY'
  | 'Could not process the request!</br></br>Error: Method not allowed.  Allowed methods GET, HEAD';

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
  | 'Sensors Bypassed'
  | 'Sensors Tripped'
  | 'Sensor Tripped'
  | 'Uncleared Alarm'
  | 'WATER ALARM'
  | '';

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
  | 'Keypad/Touchpad'
  | 'Motion Sensor'
  | 'Motion Sensor (Notable Events Only)'
  | 'Silent Panic Button/Pendant'
  | 'Temperature Sensor'
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
  'ALARM, Okay'
  | 'ALARM, Open'
  | 'Bypassed, Open'
  | 'Closed'
  | 'Motion'
  | 'No Motion'
  | 'Okay'
  | 'Open'
  | 'Tripped'
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
