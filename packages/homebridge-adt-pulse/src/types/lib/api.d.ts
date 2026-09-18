import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { Logger } from 'homebridge';
import type { JSDOM } from 'jsdom';
import type { ErrorObject } from 'serialize-error';

import type {
  Constant_PortalDeviceGatewayStatus,
  Constant_PortalDevicePanelStatus,
  Constant_PortalPanelArmButtonHref,
  Constant_PortalPanelArmButtonRelativeUrl,
  Constant_PortalPanelArmStateClean,
  Constant_PortalPanelArmStateDirty,
  Constant_PortalPanelArmStateForce,
  Constant_PortalPanelArmValue,
  Constant_PortalPanelForceArmButtonHref,
  Constant_PortalPanelForceArmButtonRelativeUrl,
  Constant_PortalSyncCode,
  Constant_PortalVersion,
} from '../constant.d.ts';
import type {
  AxiosResponseNodeJs,
  Shared_ApiResponse,
  Shared_BaseUrl,
  Shared_Config,
  Shared_Connection,
  Shared_Credentials,
  Shared_DebugParser,
  Shared_DoSubmitHandlers,
  Shared_GatewayInformation,
  Shared_InternalConfig,
  Shared_NetworkId,
  Shared_OrbSecurityButtonBase,
  Shared_OrbSecurityButtonReady,
  Shared_OrbSecurityButtons,
  Shared_PanelInformation,
  Shared_PanelStatus,
  Shared_PortalVersionContent,
  Shared_SensorInformation,
  Shared_SensorStatus,
  Shared_Sessions,
  Shared_Uuid,
} from '../shared.d.ts';

/**
 * Lib - API.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_Connection = Shared_Connection;

/**
 * Lib - API.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_Credentials = Shared_Credentials;

/**
 * Lib - API.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_Internal_BaseUrl = Shared_BaseUrl;

export type Lib_Api_ADTPulseAPI_Internal_Debug = boolean;

export type Lib_Api_ADTPulseAPI_Internal_Logger = Logger | null;

export type Lib_Api_ADTPulseAPI_Internal_ReportedHash = string;

export type Lib_Api_ADTPulseAPI_Internal_ReportedHashes = Lib_Api_ADTPulseAPI_Internal_ReportedHash[];

export type Lib_Api_ADTPulseAPI_Internal_TestMode_Enabled = boolean;

export type Lib_Api_ADTPulseAPI_Internal_TestMode_IsSystemDisarmedBeforeTest = boolean;

export type Lib_Api_ADTPulseAPI_Internal_TestMode = {
  enabled: Lib_Api_ADTPulseAPI_Internal_TestMode_Enabled;
  isSystemDisarmedBeforeTest: Lib_Api_ADTPulseAPI_Internal_TestMode_IsSystemDisarmedBeforeTest;
};

export type Lib_Api_ADTPulseAPI_Internal_WaitTimeAfterArm = number;

export type Lib_Api_ADTPulseAPI_Internal = {
  baseUrl: Lib_Api_ADTPulseAPI_Internal_BaseUrl;
  debug: Lib_Api_ADTPulseAPI_Internal_Debug;
  logger: Lib_Api_ADTPulseAPI_Internal_Logger;
  reportedHashes: Lib_Api_ADTPulseAPI_Internal_ReportedHashes;
  testMode: Lib_Api_ADTPulseAPI_Internal_TestMode;
  waitTimeAfterArm: Lib_Api_ADTPulseAPI_Internal_WaitTimeAfterArm;
};

/**
 * Lib - API.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_Session_BackupSatCode = Shared_Uuid | null;

export type Lib_Api_ADTPulseAPI_Session_HttpClient = AxiosInstance;

export type Lib_Api_ADTPulseAPI_Session_IsAuthenticated = boolean;

export type Lib_Api_ADTPulseAPI_Session_IsCleanState = boolean;

export type Lib_Api_ADTPulseAPI_Session_NetworkId = Shared_NetworkId | null;

export type Lib_Api_ADTPulseAPI_Session_PortalVersion = Constant_PortalVersion | null;

export type Lib_Api_ADTPulseAPI_Session = {
  backupSatCode: Lib_Api_ADTPulseAPI_Session_BackupSatCode;
  httpClient: Lib_Api_ADTPulseAPI_Session_HttpClient;
  isAuthenticated: Lib_Api_ADTPulseAPI_Session_IsAuthenticated;
  isCleanState: Lib_Api_ADTPulseAPI_Session_IsCleanState;
  networkId: Lib_Api_ADTPulseAPI_Session_NetworkId;
  portalVersion: Lib_Api_ADTPulseAPI_Session_PortalVersion;
};

/**
 * Lib - API - Arm Disarm Handler.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_IsAlarmActive = boolean;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_Options_RelativeUrl = Constant_PortalPanelArmButtonRelativeUrl;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_Options_Href = Constant_PortalPanelArmButtonHref;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_Options_ArmState = '' | Constant_PortalPanelArmStateClean | Constant_PortalPanelArmStateDirty;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_Options_Arm = Constant_PortalPanelArmValue;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_Options_Sat = Shared_Uuid;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_Options = {
  relativeUrl: Lib_Api_ADTPulseAPI_ArmDisarmHandler_Options_RelativeUrl;
  href: Lib_Api_ADTPulseAPI_ArmDisarmHandler_Options_Href;
  armState: Lib_Api_ADTPulseAPI_ArmDisarmHandler_Options_ArmState;
  arm: Lib_Api_ADTPulseAPI_ArmDisarmHandler_Options_Arm;
  sat: Lib_Api_ADTPulseAPI_ArmDisarmHandler_Options_Sat;
};

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_ReturnsInfo_ForceArmRequired = boolean;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_ReturnsInfo_ReadyButton = Shared_OrbSecurityButtonBase & Shared_OrbSecurityButtonReady;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_ReturnsInfo_ReadyButtons = Lib_Api_ADTPulseAPI_ArmDisarmHandler_ReturnsInfo_ReadyButton[];

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_ReturnsInfo = {
  forceArmRequired: Lib_Api_ADTPulseAPI_ArmDisarmHandler_ReturnsInfo_ForceArmRequired;
  readyButtons: Lib_Api_ADTPulseAPI_ArmDisarmHandler_ReturnsInfo_ReadyButtons;
};

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_Returns = Promise<Shared_ApiResponse<'ARM_DISARM_HANDLER', Lib_Api_ADTPulseAPI_ArmDisarmHandler_ReturnsInfo>>;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_ErrorObject = ErrorObject | undefined;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_Sessions = Shared_Sessions<{
  axiosSetArmMode?: AxiosResponseNodeJs<unknown>;
}>;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_ArmDisarmForm = URLSearchParams;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_AxiosSetArmModeRequestPath = string;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_AxiosSetArmModeRequestPathValid = boolean;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_ForceArmRequired = boolean;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_ForceArmResponseInfo_ForceArmRequired = boolean;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_ForceArmResponseInfo = {
  forceArmRequired: Lib_Api_ADTPulseAPI_ArmDisarmHandler_ForceArmResponseInfo_ForceArmRequired;
};

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_ForceArmResponse = Shared_ApiResponse<'FORCE_ARM_HANDLER', Lib_Api_ADTPulseAPI_ArmDisarmHandler_ForceArmResponseInfo>;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_SecurityButtonsResponse = Shared_ApiResponse<'GET_ORB_SECURITY_BUTTONS', Shared_OrbSecurityButtons>;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_SecurityButtons = Shared_OrbSecurityButtons;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_ReadyButton = Shared_OrbSecurityButtonBase & Shared_OrbSecurityButtonReady;

export type Lib_Api_ADTPulseAPI_ArmDisarmHandler_ReadyButtons = Lib_Api_ADTPulseAPI_ArmDisarmHandler_ReadyButton[];

/**
 * Lib - API - Constructor.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_Constructor_Config = Shared_Config;

export type Lib_Api_ADTPulseAPI_Constructor_InternalConfig = Shared_InternalConfig;

/**
 * Lib - API - Force Arm Handler.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_ForceArmHandler_Response = AxiosResponseNodeJs<unknown>;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_RelativeUrl = Constant_PortalPanelArmButtonRelativeUrl;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_ReturnsInfo_ForceArmRequired = boolean;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_ReturnsInfo = {
  forceArmRequired: Lib_Api_ADTPulseAPI_ForceArmHandler_ReturnsInfo_ForceArmRequired;
};

export type Lib_Api_ADTPulseAPI_ForceArmHandler_Returns = Promise<Shared_ApiResponse<'FORCE_ARM_HANDLER', Lib_Api_ADTPulseAPI_ForceArmHandler_ReturnsInfo>>;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_ErrorObject = ErrorObject | undefined;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_Sessions = Shared_Sessions<{
  axiosForceArm?: AxiosResponseNodeJs<unknown>;
  jsdomArmDisarm?: JSDOM;
}>;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_JsdomArmDisarmDoSubmitHandlers = NodeListOf<Element>;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_JsdomArmDisarmArmDisarmMessage = Element | null;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_ParsedArmDisarmMessage = string | null;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_ParsedDoSubmitHandlers = Shared_DoSubmitHandlers;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_Tracker_Complete = boolean;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_Tracker_ErrorMessage = string | null;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_Tracker_RequestUrl = string | null;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_Tracker = {
  complete: Lib_Api_ADTPulseAPI_ForceArmHandler_Tracker_Complete;
  errorMessage: Lib_Api_ADTPulseAPI_ForceArmHandler_Tracker_ErrorMessage;
  requestUrl: Lib_Api_ADTPulseAPI_ForceArmHandler_Tracker_RequestUrl;
};

export type Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmRelativeUrl = Constant_PortalPanelForceArmButtonRelativeUrl;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmSat = Shared_Uuid;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmHref = Constant_PortalPanelForceArmButtonHref;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmArmState = Constant_PortalPanelArmStateForce | null;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmArm = Exclude<Constant_PortalPanelArmValue, 'off'> | null;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmForm = URLSearchParams;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_AxiosForceArmRequestPath = string;

export type Lib_Api_ADTPulseAPI_ForceArmHandler_AxiosForceArmRequestPathValid = boolean;

/**
 * Lib - API - Get Gateway Information.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_GetGatewayInformation_ReturnsInfo = Shared_GatewayInformation;

export type Lib_Api_ADTPulseAPI_GetGatewayInformation_Returns = Promise<Shared_ApiResponse<'GET_GATEWAY_INFORMATION', Lib_Api_ADTPulseAPI_GetGatewayInformation_ReturnsInfo>>;

export type Lib_Api_ADTPulseAPI_GetGatewayInformation_ErrorObject = ErrorObject | undefined;

export type Lib_Api_ADTPulseAPI_GetGatewayInformation_Sessions = Shared_Sessions<{
  axiosSystemGateway?: AxiosResponseNodeJs<unknown>;
  jsdomSystemGateway?: JSDOM;
}>;

export type Lib_Api_ADTPulseAPI_GetGatewayInformation_AxiosSystemGatewayRequestPath = string;

export type Lib_Api_ADTPulseAPI_GetGatewayInformation_AxiosSystemGatewayRequestPathValid = boolean;

export type Lib_Api_ADTPulseAPI_GetGatewayInformation_JsdomSystemGatewayTableCells = NodeListOf<HTMLTableCellElement>;

export type Lib_Api_ADTPulseAPI_GetGatewayInformation_FetchedTableCells = Record<string, string[]>;

export type Lib_Api_ADTPulseAPI_GetGatewayInformation_Manufacturer = string | null;

export type Lib_Api_ADTPulseAPI_GetGatewayInformation_Model = string | null;

export type Lib_Api_ADTPulseAPI_GetGatewayInformation_ParsedManufacturer = string | null;

export type Lib_Api_ADTPulseAPI_GetGatewayInformation_ParsedModel = string | null;

export type Lib_Api_ADTPulseAPI_GetGatewayInformation_GatewayInformation = Shared_GatewayInformation;

export type Lib_Api_ADTPulseAPI_GetGatewayInformation_ReturnsStatus = Constant_PortalDeviceGatewayStatus | null;

/**
 * Lib - API - Get Orb Security Buttons.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_ReturnsInfo = Shared_OrbSecurityButtons;

export type Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_Returns = Promise<Shared_ApiResponse<'GET_ORB_SECURITY_BUTTONS', Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_ReturnsInfo>>;

export type Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_ErrorObject = ErrorObject | undefined;

export type Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_Sessions = Shared_Sessions<{
  axiosSummary?: AxiosResponseNodeJs<unknown>;
  jsdomSummary?: JSDOM;
}>;

export type Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_AxiosSummaryRequestPath = string;

export type Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_AxiosSummaryRequestPathValid = boolean;

export type Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_MissingSatCode = Shared_Uuid | null;

export type Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_JsdomSummaryOrbSecurityButtons = NodeListOf<Element>;

export type Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_ParsedOrbSecurityButtons = Shared_OrbSecurityButtons;

/**
 * Lib - API - Get Panel Information.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_GetPanelInformation_ReturnsInfo = Shared_PanelInformation;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_Returns = Promise<Shared_ApiResponse<'GET_PANEL_INFORMATION', Lib_Api_ADTPulseAPI_GetPanelInformation_ReturnsInfo>>;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_ErrorObject = ErrorObject | undefined;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_Sessions = Shared_Sessions<{
  axiosSystemDeviceId1?: AxiosResponseNodeJs<unknown>;
  jsdomSystemDeviceId1?: JSDOM;
}>;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_AxiosSystemDeviceId1RequestPath = string;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_AxiosSystemDeviceId1RequestPathValid = boolean;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_JsdomSystemDeviceId1TableCells = NodeListOf<HTMLTableCellElement>;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_FetchedTableCells = Record<string, string[]>;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_EmergencyKeys = string | null;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_ManufacturerProvider = string | null;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_TypeModel = string | null;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_ParsedEmergencyKeys = RegExpMatchArray | null;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_ParsedManufacturer = string | null;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_ParsedType = string | null;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_ParsedModel = string | null;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_PanelInformation = Shared_PanelInformation;

export type Lib_Api_ADTPulseAPI_GetPanelInformation_ReturnsStatus = Constant_PortalDevicePanelStatus | null;

/**
 * Lib - API - Get Panel Status.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_GetPanelStatus_ReturnsInfo = Shared_PanelStatus;

export type Lib_Api_ADTPulseAPI_GetPanelStatus_Returns = Promise<Shared_ApiResponse<'GET_PANEL_STATUS', Lib_Api_ADTPulseAPI_GetPanelStatus_ReturnsInfo>>;

export type Lib_Api_ADTPulseAPI_GetPanelStatus_ErrorObject = ErrorObject | undefined;

export type Lib_Api_ADTPulseAPI_GetPanelStatus_Sessions = Shared_Sessions<{
  axiosSummary?: AxiosResponseNodeJs<unknown>;
  jsdomSummary?: JSDOM;
}>;

export type Lib_Api_ADTPulseAPI_GetPanelStatus_AxiosSummaryRequestPath = string;

export type Lib_Api_ADTPulseAPI_GetPanelStatus_AxiosSummaryRequestPathValid = boolean;

export type Lib_Api_ADTPulseAPI_GetPanelStatus_MissingSatCode = Shared_Uuid | null;

export type Lib_Api_ADTPulseAPI_GetPanelStatus_JsdomSummaryOrbTextSummary = Element | null;

export type Lib_Api_ADTPulseAPI_GetPanelStatus_ParsedOrbTextSummary = Shared_PanelStatus;

/**
 * Lib - API - Get Request Config.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_GetRequestConfig_ExtraConfig = AxiosRequestConfig;

export type Lib_Api_ADTPulseAPI_GetRequestConfig_Returns = AxiosRequestConfig;

export type Lib_Api_ADTPulseAPI_GetRequestConfig_DefaultConfig = AxiosRequestConfig;

/**
 * Lib - API - Get Sensors Information.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_GetSensorsInformation_ReturnsInfo_Sensor = Shared_SensorInformation;

export type Lib_Api_ADTPulseAPI_GetSensorsInformation_ReturnsInfo_Sensors = Lib_Api_ADTPulseAPI_GetSensorsInformation_ReturnsInfo_Sensor[];

export type Lib_Api_ADTPulseAPI_GetSensorsInformation_ReturnsInfo = {
  sensors: Lib_Api_ADTPulseAPI_GetSensorsInformation_ReturnsInfo_Sensors;
};

export type Lib_Api_ADTPulseAPI_GetSensorsInformation_Returns = Promise<Shared_ApiResponse<'GET_SENSORS_INFORMATION', Lib_Api_ADTPulseAPI_GetSensorsInformation_ReturnsInfo>>;

export type Lib_Api_ADTPulseAPI_GetSensorsInformation_ErrorObject = ErrorObject | undefined;

export type Lib_Api_ADTPulseAPI_GetSensorsInformation_Sessions = Shared_Sessions<{
  axiosSystem?: AxiosResponseNodeJs<unknown>;
  jsdomSystem?: JSDOM;
}>;

export type Lib_Api_ADTPulseAPI_GetSensorsInformation_AxiosSystemRequestPath = string;

export type Lib_Api_ADTPulseAPI_GetSensorsInformation_AxiosSystemRequestPathValid = boolean;

export type Lib_Api_ADTPulseAPI_GetSensorsInformation_JsdomSystemSensorsTable = NodeListOf<Element>;

export type Lib_Api_ADTPulseAPI_GetSensorsInformation_ParsedSensorsInformationTable = Shared_SensorInformation[];

/**
 * Lib - API - Get Sensors Status.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_GetSensorsStatus_ReturnsInfo_Sensor = Shared_SensorStatus;

export type Lib_Api_ADTPulseAPI_GetSensorsStatus_ReturnsInfo_Sensors = Lib_Api_ADTPulseAPI_GetSensorsStatus_ReturnsInfo_Sensor[];

export type Lib_Api_ADTPulseAPI_GetSensorsStatus_ReturnsInfo = {
  sensors: Lib_Api_ADTPulseAPI_GetSensorsStatus_ReturnsInfo_Sensors;
};

export type Lib_Api_ADTPulseAPI_GetSensorsStatus_Returns = Promise<Shared_ApiResponse<'GET_SENSORS_STATUS', Lib_Api_ADTPulseAPI_GetSensorsStatus_ReturnsInfo>>;

export type Lib_Api_ADTPulseAPI_GetSensorsStatus_ErrorObject = ErrorObject | undefined;

export type Lib_Api_ADTPulseAPI_GetSensorsStatus_Sessions = Shared_Sessions<{
  axiosSummary?: AxiosResponseNodeJs<unknown>;
  jsdomSummary?: JSDOM;
}>;

export type Lib_Api_ADTPulseAPI_GetSensorsStatus_AxiosSummaryRequestPath = string;

export type Lib_Api_ADTPulseAPI_GetSensorsStatus_AxiosSummaryRequestPathValid = boolean;

export type Lib_Api_ADTPulseAPI_GetSensorsStatus_MissingSatCode = Shared_Uuid | null;

export type Lib_Api_ADTPulseAPI_GetSensorsStatus_JsdomSummaryOrbSensors = NodeListOf<Element>;

export type Lib_Api_ADTPulseAPI_GetSensorsStatus_ParsedOrbSensors = Shared_SensorStatus[];

/**
 * Lib - API - Handle Login Failure.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_HandleLoginFailure_RequestPath = string | null;

export type Lib_Api_ADTPulseAPI_HandleLoginFailure_Session = AxiosResponseNodeJs<unknown> | undefined;

export type Lib_Api_ADTPulseAPI_HandleLoginFailure_Returns = void;

export type Lib_Api_ADTPulseAPI_HandleLoginFailure_ErrorMessage = string | null;

/**
 * Lib - API - Is Authenticated.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_IsAuthenticated_Returns = boolean;

/**
 * Lib - API - Login.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_Login_ReturnsInfo_BackupSatCode = Shared_Uuid | null;

export type Lib_Api_ADTPulseAPI_Login_ReturnsInfo_NetworkId = Shared_NetworkId | null;

export type Lib_Api_ADTPulseAPI_Login_ReturnsInfo_PortalVersion = Constant_PortalVersion | null;

export type Lib_Api_ADTPulseAPI_Login_ReturnsInfo = {
  backupSatCode: Lib_Api_ADTPulseAPI_Login_ReturnsInfo_BackupSatCode;
  networkId: Lib_Api_ADTPulseAPI_Login_ReturnsInfo_NetworkId;
  portalVersion: Lib_Api_ADTPulseAPI_Login_ReturnsInfo_PortalVersion;
};

export type Lib_Api_ADTPulseAPI_Login_Returns = Promise<Shared_ApiResponse<'LOGIN', Lib_Api_ADTPulseAPI_Login_ReturnsInfo>>;

export type Lib_Api_ADTPulseAPI_Login_ErrorObject = ErrorObject | undefined;

export type Lib_Api_ADTPulseAPI_Login_Sessions = Shared_Sessions<{
  axiosIndex?: AxiosResponseNodeJs<unknown>;
  axiosSignIn?: AxiosResponseNodeJs<unknown>;
}>;

export type Lib_Api_ADTPulseAPI_Login_AxiosIndexRequestPath = string;

export type Lib_Api_ADTPulseAPI_Login_AxiosIndexRequestPathValid = boolean;

export type Lib_Api_ADTPulseAPI_Login_LoginForm = URLSearchParams;

export type Lib_Api_ADTPulseAPI_Login_PortalVersion = Constant_PortalVersion;

export type Lib_Api_ADTPulseAPI_Login_AxiosSignInRequestPath = string;

export type Lib_Api_ADTPulseAPI_Login_AxiosSignInRequestPathValid = boolean;

export type Lib_Api_ADTPulseAPI_Login_MatchNetworkId = RegExpMatchArray | null;

export type Lib_Api_ADTPulseAPI_Login_MatchSatCode = RegExpMatchArray | null;

/**
 * Lib - API - Logout.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_Logout_ReturnsInfo_BackupSatCode = Shared_Uuid | null;

export type Lib_Api_ADTPulseAPI_Logout_ReturnsInfo_NetworkId = Shared_NetworkId | null;

export type Lib_Api_ADTPulseAPI_Logout_ReturnsInfo_PortalVersion = Constant_PortalVersion | null;

export type Lib_Api_ADTPulseAPI_Logout_ReturnsInfo = {
  backupSatCode: Lib_Api_ADTPulseAPI_Logout_ReturnsInfo_BackupSatCode;
  networkId: Lib_Api_ADTPulseAPI_Logout_ReturnsInfo_NetworkId;
  portalVersion: Lib_Api_ADTPulseAPI_Logout_ReturnsInfo_PortalVersion;
};

export type Lib_Api_ADTPulseAPI_Logout_Returns = Promise<Shared_ApiResponse<'LOGOUT', Lib_Api_ADTPulseAPI_Logout_ReturnsInfo>>;

export type Lib_Api_ADTPulseAPI_Logout_ErrorObject = ErrorObject | undefined;

export type Lib_Api_ADTPulseAPI_Logout_Sessions = Shared_Sessions<{
  axiosSignout?: AxiosResponseNodeJs<unknown>;
}>;

export type Lib_Api_ADTPulseAPI_Logout_AxiosSignoutRequestPath = string;

export type Lib_Api_ADTPulseAPI_Logout_AxiosSignoutRequestPathValid = boolean;

/**
 * Lib - API - New Information Dispatcher.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_NewInformationDispatcher_Type = 'debug-parser' | 'do-submit-handlers' | 'gateway-information' | 'orb-security-buttons' | 'panel-information' | 'panel-status' | 'portal-version' | 'sensors-information' | 'sensors-status';

export type Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataByType<Type extends Lib_Api_ADTPulseAPI_NewInformationDispatcher_Type> =
  Type extends 'debug-parser' ? Shared_DebugParser<'forceArmHandler'> | Shared_DebugParser<'getGatewayInformation'> | Shared_DebugParser<'getOrbSecurityButtons'> | Shared_DebugParser<'getPanelInformation'> | Shared_DebugParser<'getPanelStatus'> | Shared_DebugParser<'getSensorsInformation'> | Shared_DebugParser<'getSensorsStatus'>
    : Type extends 'do-submit-handlers' ? Shared_DoSubmitHandlers
      : Type extends 'gateway-information' ? Shared_GatewayInformation
        : Type extends 'orb-security-buttons' ? Shared_OrbSecurityButtons
          : Type extends 'panel-information' ? Shared_PanelInformation
            : Type extends 'panel-status' ? Shared_PanelStatus
              : Type extends 'portal-version' ? Shared_PortalVersionContent
                : Type extends 'sensors-information' ? Shared_SensorInformation[]
                  : Type extends 'sensors-status' ? Shared_SensorStatus[]
                    : never;

export type Lib_Api_ADTPulseAPI_NewInformationDispatcher_Data = Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataByType<Lib_Api_ADTPulseAPI_NewInformationDispatcher_Type>;

export type Lib_Api_ADTPulseAPI_NewInformationDispatcher_Returns = Promise<void>;

export type Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataHash = string;

export type Lib_Api_ADTPulseAPI_NewInformationDispatcher_DetectedNew = boolean;

export type Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataDebugParser = Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataByType<'debug-parser'>;

export type Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataDoSubmitHandlers = Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataByType<'do-submit-handlers'>;

export type Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataGatewayInformation = Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataByType<'gateway-information'>;

export type Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataOrbSecurityButtons = Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataByType<'orb-security-buttons'>;

export type Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataPanelInformation = Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataByType<'panel-information'>;

export type Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataPanelStatus = Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataByType<'panel-status'>;

export type Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataPortalVersion = Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataByType<'portal-version'>;

export type Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataSensorsInformation = Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataByType<'sensors-information'>;

export type Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataSensorsStatus = Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataByType<'sensors-status'>;

/**
 * Lib - API - Perform Keep Alive.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_PerformKeepAlive_ReturnsInfo = null;

export type Lib_Api_ADTPulseAPI_PerformKeepAlive_Returns = Promise<Shared_ApiResponse<'PERFORM_KEEP_ALIVE', Lib_Api_ADTPulseAPI_PerformKeepAlive_ReturnsInfo>>;

export type Lib_Api_ADTPulseAPI_PerformKeepAlive_ErrorObject = ErrorObject | undefined;

export type Lib_Api_ADTPulseAPI_PerformKeepAlive_Sessions = Shared_Sessions<{
  axiosKeepAlive?: AxiosResponseNodeJs<unknown>;
}>;

export type Lib_Api_ADTPulseAPI_PerformKeepAlive_AxiosKeepAliveRequestPath = string;

export type Lib_Api_ADTPulseAPI_PerformKeepAlive_AxiosKeepAliveRequestPathValid = boolean;

/**
 * Lib - API - Perform Sync Check.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_PerformSyncCheck_ReturnsInfo_SyncCode = Constant_PortalSyncCode;

export type Lib_Api_ADTPulseAPI_PerformSyncCheck_ReturnsInfo = {
  syncCode: Lib_Api_ADTPulseAPI_PerformSyncCheck_ReturnsInfo_SyncCode;
};

export type Lib_Api_ADTPulseAPI_PerformSyncCheck_Returns = Promise<Shared_ApiResponse<'PERFORM_SYNC_CHECK', Lib_Api_ADTPulseAPI_PerformSyncCheck_ReturnsInfo>>;

export type Lib_Api_ADTPulseAPI_PerformSyncCheck_ErrorObject = ErrorObject | undefined;

export type Lib_Api_ADTPulseAPI_PerformSyncCheck_Sessions = Shared_Sessions<{
  axiosSyncCheck?: AxiosResponseNodeJs<unknown>;
}>;

export type Lib_Api_ADTPulseAPI_PerformSyncCheck_AxiosSyncCheckRequestPath = string;

export type Lib_Api_ADTPulseAPI_PerformSyncCheck_AxiosSyncCheckRequestPathValid = boolean;

/**
 * Lib - API - Reset Session.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_ResetSession_Returns = void;

/**
 * Lib - API - Set Panel Status.
 *
 * @since 1.0.0
 */
export type Lib_Api_ADTPulseAPI_SetPanelStatus_ArmFrom = Constant_PortalPanelArmValue;

export type Lib_Api_ADTPulseAPI_SetPanelStatus_ArmTo = Constant_PortalPanelArmValue;

export type Lib_Api_ADTPulseAPI_SetPanelStatus_IsAlarmActive = boolean;

export type Lib_Api_ADTPulseAPI_SetPanelStatus_ReturnsInfo_ForceArmRequired = boolean;

export type Lib_Api_ADTPulseAPI_SetPanelStatus_ReturnsInfo = {
  forceArmRequired: Lib_Api_ADTPulseAPI_SetPanelStatus_ReturnsInfo_ForceArmRequired;
};

export type Lib_Api_ADTPulseAPI_SetPanelStatus_Returns = Promise<Shared_ApiResponse<'SET_PANEL_STATUS', Lib_Api_ADTPulseAPI_SetPanelStatus_ReturnsInfo>>;

export type Lib_Api_ADTPulseAPI_SetPanelStatus_ErrorObject = ErrorObject | undefined;

export type Lib_Api_ADTPulseAPI_SetPanelStatus_IsAlarmCurrentlyActive = boolean;

export type Lib_Api_ADTPulseAPI_SetPanelStatus_SecurityButtonsResponse = Shared_ApiResponse<'GET_ORB_SECURITY_BUTTONS', Shared_OrbSecurityButtons>;

export type Lib_Api_ADTPulseAPI_SetPanelStatus_SecurityButtons = Shared_OrbSecurityButtons;

export type Lib_Api_ADTPulseAPI_SetPanelStatus_ReadyButton = Shared_OrbSecurityButtonBase & Shared_OrbSecurityButtonReady;

export type Lib_Api_ADTPulseAPI_SetPanelStatus_ReadyButtons = Lib_Api_ADTPulseAPI_SetPanelStatus_ReadyButton[];

export type Lib_Api_ADTPulseAPI_SetPanelStatus_ArmDisarmResponseInfo_ForceArmRequired = boolean;

export type Lib_Api_ADTPulseAPI_SetPanelStatus_ArmDisarmResponseInfo_ReadyButton = Shared_OrbSecurityButtonBase & Shared_OrbSecurityButtonReady;

export type Lib_Api_ADTPulseAPI_SetPanelStatus_ArmDisarmResponseInfo_ReadyButtons = Lib_Api_ADTPulseAPI_SetPanelStatus_ArmDisarmResponseInfo_ReadyButton[];

export type Lib_Api_ADTPulseAPI_SetPanelStatus_ArmDisarmResponseInfo = {
  forceArmRequired: Lib_Api_ADTPulseAPI_SetPanelStatus_ArmDisarmResponseInfo_ForceArmRequired;
  readyButtons: Lib_Api_ADTPulseAPI_SetPanelStatus_ArmDisarmResponseInfo_ReadyButtons;
};

export type Lib_Api_ADTPulseAPI_SetPanelStatus_DisarmResponse = Shared_ApiResponse<'ARM_DISARM_HANDLER', Lib_Api_ADTPulseAPI_SetPanelStatus_ArmDisarmResponseInfo>;

export type Lib_Api_ADTPulseAPI_SetPanelStatus_ForceArmRequired = boolean;

export type Lib_Api_ADTPulseAPI_SetPanelStatus_ArmDisarmResponse = Shared_ApiResponse<'ARM_DISARM_HANDLER', Lib_Api_ADTPulseAPI_SetPanelStatus_ArmDisarmResponseInfo>;
