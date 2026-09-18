import type http from 'node:http';

import type { AxiosResponse } from 'axios';
import type { Logger } from 'homebridge';
import type { JSDOM } from 'jsdom';
import type { ErrorObject } from 'serialize-error';
import type { z } from 'zod';

import type { platformConfig } from '../lib/schema.js';
import type {
  Constant_PluginDeviceCategory,
  Constant_PluginDeviceGatewayType,
  Constant_PluginDeviceId,
  Constant_PluginDevicePanelType,
  Constant_PluginDeviceSensorType,
  Constant_PortalDeviceGatewayStatus,
  Constant_PortalDevicePanelStatus,
  Constant_PortalDeviceSensorStatus,
  Constant_PortalPanelArmButtonHref,
  Constant_PortalPanelArmButtonId,
  Constant_PortalPanelArmButtonLoadingText,
  Constant_PortalPanelArmButtonRelativeUrl,
  Constant_PortalPanelArmButtonText,
  Constant_PortalPanelArmStateClean,
  Constant_PortalPanelArmStateDirty,
  Constant_PortalPanelArmStateForce,
  Constant_PortalPanelArmValue,
  Constant_PortalPanelForceArmButtonHref,
  Constant_PortalPanelForceArmButtonRelativeUrl,
  Constant_PortalPanelNote,
  Constant_PortalPanelState,
  Constant_PortalPanelStatus,
  Constant_PortalSensorDeviceType,
  Constant_PortalSensorStatusIcon,
  Constant_PortalSensorStatusText,
  Constant_PortalSubdomain,
  Constant_PortalSyncCode,
  Constant_PortalVersion,
} from './constant.d.ts';

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_ApiResponseAction =
  'ADD_TRUSTED_DEVICE'
  | 'ARM_DISARM_HANDLER'
  | 'COMPLETE_SIGN_IN'
  | 'FORCE_ARM_HANDLER'
  | 'GET_GATEWAY_INFORMATION'
  | 'GET_ORB_SECURITY_BUTTONS'
  | 'GET_PANEL_INFORMATION'
  | 'GET_PANEL_STATUS'
  | 'GET_SENSORS'
  | 'GET_SENSORS_INFORMATION'
  | 'GET_SENSORS_STATUS'
  | 'GET_TRUSTED_DEVICES'
  | 'GET_VERIFICATION_METHODS'
  | 'INITIALIZE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'PERFORM_KEEP_ALIVE'
  | 'PERFORM_SYNC_CHECK'
  | 'REQUEST_CODE'
  | 'SET_PANEL_STATUS'
  | 'UI_GENERATE_CONFIG'
  | 'UI_GET_METHODS'
  | 'UI_INITIALIZE'
  | 'UI_REQUEST_CODE'
  | 'UI_VALIDATE'
  | 'VALIDATE_CODE';

export type Shared_ApiResponseSuccess_Success = true;

export type Shared_ApiResponseSuccess_Info = object | null;

export type Shared_ApiResponseSuccess<Action extends Shared_ApiResponseAction, Info extends Shared_ApiResponseSuccess_Info> = {
  action: Action;
  success: Shared_ApiResponseSuccess_Success;
  info: Info;
};

export type Shared_ApiResponseFail_Success = false;

export type Shared_ApiResponseFail_Info_Error = ErrorObject;

export type Shared_ApiResponseFail_Info_Message = string;

export type Shared_ApiResponseFail_Info = {
  error?: Shared_ApiResponseFail_Info_Error;
  message?: Shared_ApiResponseFail_Info_Message;
};

export type Shared_ApiResponseFail<Action extends Shared_ApiResponseAction> = {
  action: Action;
  success: Shared_ApiResponseFail_Success;
  info: Shared_ApiResponseFail_Info;
};

export type Shared_ApiResponse<Action extends Shared_ApiResponseAction, Info extends Shared_ApiResponseSuccess_Info> =
  Shared_ApiResponseSuccess<Action, Info>
  | Shared_ApiResponseFail<Action>;

/**
 * Shared.
 *
 * @since 1.0.0
 */
export interface AxiosResponseNodeJs<T = unknown, D = unknown> extends AxiosResponse<T, D> {
  request?: http.ClientRequest;
}

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_BaseUrl = `https://${string}`;

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_CachedState_GatewayInfo = Shared_GatewayInformation | null;

export type Shared_CachedState_OrbSecurityButtons = Shared_OrbSecurityButtons;

export type Shared_CachedState_PanelInfo = Shared_PanelInformation | null;

export type Shared_CachedState_PanelStatus = Shared_PanelStatus | null;

export type Shared_CachedState_SensorInfo = Shared_SensorInformation;

export type Shared_CachedState_SensorsInfo = Shared_CachedState_SensorInfo[];

export type Shared_CachedState_SensorStatus = Shared_SensorStatus;

export type Shared_CachedState_SensorsStatus = Shared_CachedState_SensorStatus[];

export type Shared_CachedState_SyncCode = Constant_PortalSyncCode;

export type Shared_CachedState = {
  gatewayInfo: Shared_CachedState_GatewayInfo;
  orbSecurityButtons: Shared_CachedState_OrbSecurityButtons;
  panelInfo: Shared_CachedState_PanelInfo;
  panelStatus: Shared_CachedState_PanelStatus;
  sensorsInfo: Shared_CachedState_SensorsInfo;
  sensorsStatus: Shared_CachedState_SensorsStatus;
  syncCode: Shared_CachedState_SyncCode;
};

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_Config = z.infer<typeof platformConfig>;

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_Connection_Subdomain = Constant_PortalSubdomain;

export type Shared_Connection = {
  subdomain: Shared_Connection_Subdomain;
};

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_Credentials_Fingerprint = string;

export type Shared_Credentials_Password = string;

export type Shared_Credentials_Username = string;

export type Shared_Credentials = {
  fingerprint: Shared_Credentials_Fingerprint;
  password: Shared_Credentials_Password;
  username: Shared_Credentials_Username;
};

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_CurrentView = 'settings' | 'settings-classic' | 'setup' | undefined;

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_Device_Id = Constant_PluginDeviceId;

export type Shared_Device_Name = string;

export type Shared_Device_OriginalName = string;

export type Shared_Device_Type = Constant_PluginDeviceGatewayType | Constant_PluginDevicePanelType | Constant_PluginDeviceSensorType;

export type Shared_Device_Zone = number | null;

export type Shared_Device_Category = Constant_PluginDeviceCategory;

export type Shared_Device_Manufacturer = string | null;

export type Shared_Device_Model = string | null;

export type Shared_Device_Serial = string | null;

export type Shared_Device_Firmware = string | null;

export type Shared_Device_Hardware = string | null;

export type Shared_Device_Software = string | null;

export type Shared_Device_Uuid = Shared_Uuid;

export type Shared_Device = {
  id: Shared_Device_Id;
  name: Shared_Device_Name;
  originalName: Shared_Device_OriginalName;
  type: Shared_Device_Type;
  zone: Shared_Device_Zone;
  category: Shared_Device_Category;
  manufacturer: Shared_Device_Manufacturer;
  model: Shared_Device_Model;
  serial: Shared_Device_Serial;
  firmware: Shared_Device_Firmware;
  hardware: Shared_Device_Hardware;
  software: Shared_Device_Software;
  uuid: Shared_Device_Uuid;
};

export type Shared_Devices = Shared_Device[];

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_DoSubmitHandler_RelativeUrl = Constant_PortalPanelForceArmButtonRelativeUrl;

export type Shared_DoSubmitHandler_UrlParams_Arm = Exclude<Constant_PortalPanelArmValue, 'off'> | null;

export type Shared_DoSubmitHandler_UrlParams_ArmState = Constant_PortalPanelArmStateForce | null;

export type Shared_DoSubmitHandler_UrlParams_Href = Constant_PortalPanelForceArmButtonHref;

export type Shared_DoSubmitHandler_UrlParams_Sat = Shared_Uuid;

export type Shared_DoSubmitHandler_UrlParams = {
  arm: Shared_DoSubmitHandler_UrlParams_Arm;
  armState: Shared_DoSubmitHandler_UrlParams_ArmState;
  href: Shared_DoSubmitHandler_UrlParams_Href;
  sat: Shared_DoSubmitHandler_UrlParams_Sat;
};

export type Shared_DoSubmitHandler = {
  relativeUrl: Shared_DoSubmitHandler_RelativeUrl;
  urlParams: Shared_DoSubmitHandler_UrlParams;
};

export type Shared_DoSubmitHandlers = Shared_DoSubmitHandler[];

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_GatewayInformation_Communication_PrimaryConnectionType = string | null;

export type Shared_GatewayInformation_Communication_BroadbandConnectionStatus = string | null;

export type Shared_GatewayInformation_Communication_CellularConnectionStatus = string | null;

export type Shared_GatewayInformation_Communication_CellularSignalStrength = string | null;

export type Shared_GatewayInformation_Communication = {
  primaryConnectionType: Shared_GatewayInformation_Communication_PrimaryConnectionType;
  broadbandConnectionStatus: Shared_GatewayInformation_Communication_BroadbandConnectionStatus;
  cellularConnectionStatus: Shared_GatewayInformation_Communication_CellularConnectionStatus;
  cellularSignalStrength: Shared_GatewayInformation_Communication_CellularSignalStrength;
};

export type Shared_GatewayInformation_Manufacturer = string | null;

export type Shared_GatewayInformation_Model = string | null;

export type Shared_GatewayInformation_Network_Broadband_Ip = string | null;

export type Shared_GatewayInformation_Network_Broadband_Mac = string | null;

export type Shared_GatewayInformation_Network_Broadband = {
  ip: Shared_GatewayInformation_Network_Broadband_Ip;
  mac: Shared_GatewayInformation_Network_Broadband_Mac;
};

export type Shared_GatewayInformation_Network_Device_Ip = string | null;

export type Shared_GatewayInformation_Network_Device_Mac = string | null;

export type Shared_GatewayInformation_Network_Device = {
  ip: Shared_GatewayInformation_Network_Device_Ip;
  mac: Shared_GatewayInformation_Network_Device_Mac;
};

export type Shared_GatewayInformation_Network_Router_LanIp = string | null;

export type Shared_GatewayInformation_Network_Router_WanIp = string | null;

export type Shared_GatewayInformation_Network_Router = {
  lanIp: Shared_GatewayInformation_Network_Router_LanIp;
  wanIp: Shared_GatewayInformation_Network_Router_WanIp;
};

export type Shared_GatewayInformation_Network = {
  broadband: Shared_GatewayInformation_Network_Broadband;
  device: Shared_GatewayInformation_Network_Device;
  router: Shared_GatewayInformation_Network_Router;
};

export type Shared_GatewayInformation_SerialNumber = string | null;

export type Shared_GatewayInformation_Status = Constant_PortalDeviceGatewayStatus | null;

export type Shared_GatewayInformation_Update_Last = string | null;

export type Shared_GatewayInformation_Update_Next = string | null;

export type Shared_GatewayInformation_Update = {
  last: Shared_GatewayInformation_Update_Last;
  next: Shared_GatewayInformation_Update_Next;
};

export type Shared_GatewayInformation_Versions_Firmware = string | null;

export type Shared_GatewayInformation_Versions_Hardware = string | null;

export type Shared_GatewayInformation_Versions = {
  firmware: Shared_GatewayInformation_Versions_Firmware;
  hardware: Shared_GatewayInformation_Versions_Hardware;
};

export type Shared_GatewayInformation = {
  communication: Shared_GatewayInformation_Communication;
  manufacturer: Shared_GatewayInformation_Manufacturer;
  model: Shared_GatewayInformation_Model;
  network: Shared_GatewayInformation_Network;
  serialNumber: Shared_GatewayInformation_SerialNumber;
  status: Shared_GatewayInformation_Status;
  update: Shared_GatewayInformation_Update;
  versions: Shared_GatewayInformation_Versions;
};

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_InternalConfig_BaseUrl = Shared_BaseUrl;

export type Shared_InternalConfig_Debug = boolean;

export type Shared_InternalConfig_Logger = Logger | null;

export type Shared_InternalConfig_TestMode_Enabled = boolean;

export type Shared_InternalConfig_TestMode_IsSystemDisarmedBeforeTest = boolean;

export type Shared_InternalConfig_TestMode = {
  enabled?: Shared_InternalConfig_TestMode_Enabled;
  isSystemDisarmedBeforeTest?: Shared_InternalConfig_TestMode_IsSystemDisarmedBeforeTest;
};

export type Shared_InternalConfig = {
  baseUrl?: Shared_InternalConfig_BaseUrl;
  debug?: Shared_InternalConfig_Debug;
  logger?: Shared_InternalConfig_Logger;
  testMode?: Shared_InternalConfig_TestMode;
};

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_MfaDevice_Id = string;

export type Shared_MfaDevice_Type = 'EMAIL' | 'SMS';

export type Shared_MfaDevice_Label = string;

export type Shared_MfaDevice = {
  id: Shared_MfaDevice_Id;
  type: Shared_MfaDevice_Type;
  label: Shared_MfaDevice_Label;
};

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_MfaTrustedDevice_Id = string;

export type Shared_MfaTrustedDevice_Name = string;

export type Shared_MfaTrustedDevice = {
  id: Shared_MfaTrustedDevice_Id;
  name: Shared_MfaTrustedDevice_Name;
};

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_NetworkId = string;

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_OrbSecurityButtonBase_ButtonId = Constant_PortalPanelArmButtonId | null;

export type Shared_OrbSecurityButtonBase = {
  buttonId: Shared_OrbSecurityButtonBase_ButtonId;
};

export type Shared_OrbSecurityButtonReady_ButtonDisabled = false;

export type Shared_OrbSecurityButtonReady_ButtonIndex = number;

export type Shared_OrbSecurityButtonReady_ButtonText = Constant_PortalPanelArmButtonText | null;

export type Shared_OrbSecurityButtonReady_ChangeAccessCode = boolean;

export type Shared_OrbSecurityButtonReady_LoadingText = Constant_PortalPanelArmButtonLoadingText;

export type Shared_OrbSecurityButtonReady_RelativeUrl = Constant_PortalPanelArmButtonRelativeUrl;

export type Shared_OrbSecurityButtonReady_TotalButtons = number;

export type Shared_OrbSecurityButtonReady_UrlParams_Arm = Constant_PortalPanelArmValue;

export type Shared_OrbSecurityButtonReady_UrlParams_ArmState = '' | Constant_PortalPanelArmStateClean | Constant_PortalPanelArmStateDirty;

export type Shared_OrbSecurityButtonReady_UrlParams_Href = Constant_PortalPanelArmButtonHref;

export type Shared_OrbSecurityButtonReady_UrlParams_Sat = Shared_Uuid;

export type Shared_OrbSecurityButtonReady_UrlParams = {
  arm: Shared_OrbSecurityButtonReady_UrlParams_Arm;
  armState: Shared_OrbSecurityButtonReady_UrlParams_ArmState;
  href: Shared_OrbSecurityButtonReady_UrlParams_Href;
  sat: Shared_OrbSecurityButtonReady_UrlParams_Sat;
};

export type Shared_OrbSecurityButtonReady = {
  buttonDisabled: Shared_OrbSecurityButtonReady_ButtonDisabled;
  buttonIndex: Shared_OrbSecurityButtonReady_ButtonIndex;
  buttonText: Shared_OrbSecurityButtonReady_ButtonText;
  changeAccessCode: Shared_OrbSecurityButtonReady_ChangeAccessCode;
  loadingText: Shared_OrbSecurityButtonReady_LoadingText;
  relativeUrl: Shared_OrbSecurityButtonReady_RelativeUrl;
  totalButtons: Shared_OrbSecurityButtonReady_TotalButtons;
  urlParams: Shared_OrbSecurityButtonReady_UrlParams;
};

export type Shared_OrbSecurityButtonPending_ButtonDisabled = true;

export type Shared_OrbSecurityButtonPending_ButtonText = Constant_PortalPanelArmButtonLoadingText | null;

export type Shared_OrbSecurityButtonPending = {
  buttonDisabled: Shared_OrbSecurityButtonPending_ButtonDisabled;
  buttonText: Shared_OrbSecurityButtonPending_ButtonText;
};

export type Shared_OrbSecurityButton = (Shared_OrbSecurityButtonBase & Shared_OrbSecurityButtonReady) | (Shared_OrbSecurityButtonBase & Shared_OrbSecurityButtonPending);

export type Shared_OrbSecurityButtons = Shared_OrbSecurityButton[];

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_PanelInformation_EmergencyKeys = RegExpMatchArray | null;

export type Shared_PanelInformation_Manufacturer = string | null;

export type Shared_PanelInformation_MasterCode = string | null;

export type Shared_PanelInformation_Model = string | null;

export type Shared_PanelInformation_Provider = string | null;

export type Shared_PanelInformation_Status = Constant_PortalDevicePanelStatus | null;

export type Shared_PanelInformation_Type = string | null;

export type Shared_PanelInformation = {
  emergencyKeys: Shared_PanelInformation_EmergencyKeys;
  manufacturer: Shared_PanelInformation_Manufacturer;
  masterCode: Shared_PanelInformation_MasterCode;
  model: Shared_PanelInformation_Model;
  provider: Shared_PanelInformation_Provider;
  status: Shared_PanelInformation_Status;
  type: Shared_PanelInformation_Type;
};

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_PanelStatus_PanelState = Constant_PortalPanelState;

export type Shared_PanelStatus_PanelStates = Shared_PanelStatus_PanelState[];

export type Shared_PanelStatus_PanelStatus = Constant_PortalPanelStatus;

export type Shared_PanelStatus_PanelStatuses = Shared_PanelStatus_PanelStatus[];

export type Shared_PanelStatus_PanelNote = Constant_PortalPanelNote;

export type Shared_PanelStatus_PanelNotes = Shared_PanelStatus_PanelNote[];

export type Shared_PanelStatus_RawData_Node = string;

export type Shared_PanelStatus_RawData_UnknownPiece = string;

export type Shared_PanelStatus_RawData_UnknownPieces = Shared_PanelStatus_RawData_UnknownPiece[];

export type Shared_PanelStatus_RawData = {
  node: Shared_PanelStatus_RawData_Node;
  unknownPieces: Shared_PanelStatus_RawData_UnknownPieces;
};

export type Shared_PanelStatus = {
  panelStates: Shared_PanelStatus_PanelStates;
  panelStatuses: Shared_PanelStatus_PanelStatuses;
  panelNotes: Shared_PanelStatus_PanelNotes;
  rawData: Shared_PanelStatus_RawData;
};

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_PortalVersionContent_Version = Constant_PortalVersion | null;

export type Shared_PortalVersionContent = {
  version: Shared_PortalVersionContent_Version;
};

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_SensorConfig_AdtName = string;

export type Shared_SensorConfig_AdtZone = number;

export type Shared_SensorConfig_AdtType = Constant_PluginDeviceSensorType;

export type Shared_SensorConfig = {
  adtName: Shared_SensorConfig_AdtName;
  adtZone: Shared_SensorConfig_AdtZone;
  adtType: Shared_SensorConfig_AdtType;
};

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_SensorInformation_DeviceId = number;

export type Shared_SensorInformation_DeviceType = Constant_PortalSensorDeviceType;

export type Shared_SensorInformation_Name = string;

export type Shared_SensorInformation_Status = Constant_PortalDeviceSensorStatus;

export type Shared_SensorInformation_Zone = number;

export type Shared_SensorInformation = {
  deviceId: Shared_SensorInformation_DeviceId;
  deviceType: Shared_SensorInformation_DeviceType;
  name: Shared_SensorInformation_Name;
  status: Shared_SensorInformation_Status;
  zone: Shared_SensorInformation_Zone;
};

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_SensorStatus_Icon = Constant_PortalSensorStatusIcon;

export type Shared_SensorStatus_Name = string;

export type Shared_SensorStatus_Status = Constant_PortalSensorStatusText;

export type Shared_SensorStatus_Statuses = Shared_SensorStatus_Status[];

export type Shared_SensorStatus_Zone = number;

export type Shared_SensorStatus = {
  icon: Shared_SensorStatus_Icon;
  name: Shared_SensorStatus_Name;
  statuses: Shared_SensorStatus_Statuses;
  zone: Shared_SensorStatus_Zone;
};

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_Sessions<Shape extends Record<string, AxiosResponseNodeJs<unknown, unknown> | JSDOM>> = Shape;

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_Uuid = string;

/**
 * Shared.
 *
 * @since 1.0.0
 */
export type Shared_DebugParserMethod = 'forceArmHandler' | 'generateSensorsConfig' | 'getGatewayInformation' | 'getOrbSecurityButtons' | 'getPanelInformation' | 'getPanelStatus' | 'getSensorsInformation' | 'getSensorsStatus';

export type Shared_DebugParserResponse_ForceArmHandler = Shared_DoSubmitHandlers;

export type Shared_DebugParserResponse_GenerateSensorsConfig = Shared_SensorConfig[];

export type Shared_DebugParserResponse_GetGatewayInformation = Record<string, string[]>;

export type Shared_DebugParserResponse_GetOrbSecurityButtons = Shared_OrbSecurityButtons;

export type Shared_DebugParserResponse_GetPanelInformation = Record<string, string[]>;

export type Shared_DebugParserResponse_GetPanelStatus = Shared_PanelStatus;

export type Shared_DebugParserResponse_GetSensorsInformation = Shared_SensorInformation[];

export type Shared_DebugParserResponse_GetSensorsStatus = Shared_SensorStatus[];

export type Shared_DebugParserResponse = {
  forceArmHandler: Shared_DebugParserResponse_ForceArmHandler;
  generateSensorsConfig: Shared_DebugParserResponse_GenerateSensorsConfig;
  getGatewayInformation: Shared_DebugParserResponse_GetGatewayInformation;
  getOrbSecurityButtons: Shared_DebugParserResponse_GetOrbSecurityButtons;
  getPanelInformation: Shared_DebugParserResponse_GetPanelInformation;
  getPanelStatus: Shared_DebugParserResponse_GetPanelStatus;
  getSensorsInformation: Shared_DebugParserResponse_GetSensorsInformation;
  getSensorsStatus: Shared_DebugParserResponse_GetSensorsStatus;
};

export type Shared_DebugParserRawHtml = string;

export type Shared_DebugParser<Method extends Shared_DebugParserMethod> = {
  method: Method;
  response: Shared_DebugParserResponse[Method];
  rawHtml: Shared_DebugParserRawHtml;
};

/**
 * Shared - Browser Release.
 *
 * Browser identities and release snapshots are used across auth, fingerprint
 * generation, and the build-time snapshot generator.
 *
 * @since 3.5.0
 */
export type Shared_BrowserName = 'chrome' | 'edge' | 'firefox' | 'opera';

export type Shared_BrowserRelease_Browser = Shared_BrowserName;

export type Shared_BrowserRelease_Version = string;

export type Shared_BrowserRelease_ChromiumVersion = string | undefined;

export type Shared_BrowserRelease = {
  browser: Shared_BrowserRelease_Browser;
  version: Shared_BrowserRelease_Version;
  chromiumVersion?: Shared_BrowserRelease_ChromiumVersion;
};

export type Shared_BrowserReleaseSnapshot_SchemaVersion = 1;

export type Shared_BrowserReleaseSnapshot_GeneratedAt = string;

export type Shared_BrowserReleaseSnapshot_Releases = Record<Shared_BrowserName, Shared_BrowserRelease>;

export type Shared_BrowserReleaseSnapshot = {
  schemaVersion: Shared_BrowserReleaseSnapshot_SchemaVersion;
  generatedAt: Shared_BrowserReleaseSnapshot_GeneratedAt;
  releases: Shared_BrowserReleaseSnapshot_Releases;
};

export type Shared_ResolvedBrowserRelease_Release = Shared_BrowserRelease;

export type Shared_ResolvedBrowserRelease_Source = 'live' | 'cache' | 'package';

export type Shared_ResolvedBrowserRelease = {
  release: Shared_ResolvedBrowserRelease_Release;
  source: Shared_ResolvedBrowserRelease_Source;
};

/**
 * Shared - CLI Identity.
 *
 * The REPL, API tester, and build snapshot share these project metadata
 * fields while keeping their local variable types in their own files.
 *
 * @since 3.5.0
 */
export type Shared_CliIdentity_Repository = string;

export type Shared_CliIdentity_Copyright = string;

export type Shared_CliIdentity = {
  repository: Shared_CliIdentity_Repository;
  copyright: Shared_CliIdentity_Copyright;
};
