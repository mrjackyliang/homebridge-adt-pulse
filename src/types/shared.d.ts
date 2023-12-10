import type { AxiosResponse } from 'axios';
import type { Logger } from 'homebridge';
import type { JSDOM } from 'jsdom';
import type { ErrorObject } from 'serialize-error';

/**
 * Api response.
 *
 * @since 1.0.0
 */
export type ApiResponseAction = 'ARM_DISARM_HANDLER' | 'FORCE_ARM_HANDLER' | 'GET_GATEWAY_INFORMATION' | 'GET_PANEL_INFORMATION' | 'GET_PANEL_STATUS' | 'GET_SENSORS_INFORMATION' | 'GET_SENSORS_STATUS' | 'IS_PORTAL_ACCESSIBLE' | 'LOGIN' | 'LOGOUT' | 'PERFORM_KEEP_ALIVE' | 'PERFORM_SYNC_CHECK' | 'SET_PANEL_STATUS';

export type ApiResponseSuccessSuccess = true;

export type ApiResponseSuccessInfo = object | null;

export type ApiResponseSuccessFail = false;

export type ApiResponseErrorInfoError = ErrorObject;

export type ApiResponseErrorInfoMessage = string;

export type ApiResponseErrorInfo = {
  error?: ApiResponseErrorInfoError,
  message?: ApiResponseErrorInfoMessage;
} | undefined;

export type ApiResponseSuccess<Action extends ApiResponseAction, Info extends ApiResponseSuccessInfo> = {
  action: Action,
  success: ApiResponseSuccessSuccess,
  info: Info,
};

export type ApiResponseFail<Action extends ApiResponseAction> = {
  action: Action,
  success: ApiResponseSuccessFail,
  info: ApiResponseErrorInfo,
};

export type ApiResponse<Action extends ApiResponseAction, Info extends ApiResponseSuccessInfo> = ApiResponseSuccess<Action, Info> | ApiResponseFail<Action>;

/**
 * Arm actions.
 *
 * @since 1.0.0
 */
export type ArmActions = 'away' | 'night' | 'off' | 'stay';

/**
 * Arm states.
 *
 * @since 1.0.0
 */
export type ArmStates = 'away' | 'disarmed' | 'disarmed+with+alarm' | 'disarmed_with_alarm' | 'night' | 'night+stay' | 'off' | 'stay';

/**
 * Config.
 *
 * @since 1.0.0
 */
export type ConfigPlatform = string;

export type ConfigName = string;

export type ConfigSubdomain = 'portal' | 'portal-ca';

export type ConfigUsername = string;

export type ConfigPassword = string;

export type ConfigFingerprint = string;

export type ConfigSensorName = string;

export type ConfigSensorAdtName = string;

export type ConfigSensorAdtType = 'co' | 'door' | 'fire' | 'flood' | 'glass' | 'motion' | 'window';

export type ConfigSensorAdtZone = number;

export type ConfigSensor = {
  name?: ConfigSensorName;
  adtName: ConfigSensorAdtName;
  adtType: ConfigSensorAdtType;
  adtZone: ConfigSensorAdtZone;
};

export type ConfigSensors = ConfigSensor[];

export type ConfigPause = boolean;

export type ConfigReset = boolean;

export type Config = {
  platform: ConfigPlatform;
  name?: ConfigName;
  subdomain: ConfigSubdomain;
  username: ConfigUsername;
  password: ConfigPassword;
  fingerprint: ConfigFingerprint;
  sensors: ConfigSensors;
  pause?: ConfigPause;
  reset?: ConfigReset;
};

/**
 * Do submit handlers.
 *
 * @since 1.0.0
 */
export type DoSubmitHandlerRelativeUrl = string;

export type DoSubmitHandlerUrlParamsArm = Exclude<ArmActions, 'off'> | null;

export type DoSubmitHandlerUrlParamsArmState = ForceArmStates | null;

export type DoSubmitHandlerUrlParamsHref = string;

export type DoSubmitHandlerUrlParamsSat = UUID;

export type DoSubmitHandlerUrlParams = {
  arm: DoSubmitHandlerUrlParamsArm;
  armState: DoSubmitHandlerUrlParamsArmState;
  href: DoSubmitHandlerUrlParamsHref;
  sat: DoSubmitHandlerUrlParamsSat;
};

export type DoSubmitHandler = {
  relativeUrl: DoSubmitHandlerRelativeUrl;
  urlParams: DoSubmitHandlerUrlParams;
};

export type DoSubmitHandlers = DoSubmitHandler[];

/**
 * Force arm states.
 *
 * @since 1.0.0
 */
export type ForceArmStates = 'forcearm';

/**
 * Gateway information.
 *
 * @since 1.0.0
 */
export type GatewayInformationManufacturer = string | null;

export type GatewayInformationModel = string | null;

export type GatewayInformationNetworkBroadbandIp = string | null;

export type GatewayInformationNetworkBroadbandMac = string | null;

export type GatewayInformationNetworkBroadband = {
  ip: GatewayInformationNetworkBroadbandIp;
  mac: GatewayInformationNetworkBroadbandMac;
};

export type GatewayInformationNetworkDeviceIp = string | null;

export type GatewayInformationNetworkDeviceMac = string | null;

export type GatewayInformationNetworkDevice = {
  ip: GatewayInformationNetworkDeviceIp;
  mac: GatewayInformationNetworkDeviceMac;
};

export type GatewayInformationNetwork = {
  broadband: GatewayInformationNetworkBroadband;
  device: GatewayInformationNetworkDevice;
};

export type GatewayInformationSerialNumber = string | null;

export type GatewayInformationStatus = string | null;

export type GatewayInformationUpdateLast = string | null;

export type GatewayInformationUpdateNext = string | null;

export type GatewayInformationUpdate = {
  last: GatewayInformationUpdateLast;
  next: GatewayInformationUpdateNext;
};

export type GatewayInformationVersionsFirmware = string | null;

export type GatewayInformationVersionsHardware = string | null;

export type GatewayInformationVersions = {
  firmware: GatewayInformationVersionsFirmware;
  hardware: GatewayInformationVersionsHardware;
};

export type GatewayInformation = {
  manufacturer: GatewayInformationManufacturer;
  model: GatewayInformationModel;
  network: GatewayInformationNetwork;
  serialNumber: GatewayInformationSerialNumber;
  status: GatewayInformationStatus;
  update: GatewayInformationUpdate;
  versions: GatewayInformationVersions;
};

/**
 * Internal config.
 *
 * @since 1.0.0
 */
export type InternalConfigBaseUrl = `https://${string}`;

export type InternalConfigDebug = boolean;

export type InternalConfigLogger = Logger | null;

export type InternalConfigTestModeEnabled = boolean;

export type InternalConfigTestModeIsDisarmChecked = boolean;

export type InternalConfigTestMode = {
  enabled?: InternalConfigTestModeEnabled;
  isDisarmChecked?: InternalConfigTestModeIsDisarmChecked;
};

export type InternalConfig = {
  baseUrl?: InternalConfigBaseUrl;
  debug?: InternalConfigDebug;
  logger?: InternalConfigLogger;
  testMode?: InternalConfigTestMode;
};

/**
 * Null keys locations.
 *
 * @since 1.0.0
 */
export type NullKeysLocations = string[];

/**
 * Orb security buttons.
 *
 * @since 1.0.0
 */
export type OrbSecurityButtonReadyButtonDisabled = false;

export type OrbSecurityButtonReadyButtonId = string | null;

export type OrbSecurityButtonReadyButtonIndex = number;

export type OrbSecurityButtonReadyButtonTitle = string | null;

export type OrbSecurityButtonReadyChangeAccessCode = boolean;

export type OrbSecurityButtonReadyLoadingText = string;

export type OrbSecurityButtonReadyRelativeUrl = string;

export type OrbSecurityButtonReadyTotalButtons = number;

export type OrbSecurityButtonReadyUrlParamsArm = ArmActions;

export type OrbSecurityButtonReadyUrlParamsArmState = ArmStates;

export type OrbSecurityButtonReadyUrlParamsHref = string;

export type OrbSecurityButtonReadyUrlParamsSat = UUID;

export type OrbSecurityButtonReadyUrlParams = {
  arm: OrbSecurityButtonReadyUrlParamsArm;
  armState: OrbSecurityButtonReadyUrlParamsArmState;
  href: OrbSecurityButtonReadyUrlParamsHref;
  sat: OrbSecurityButtonReadyUrlParamsSat;
};

export type OrbSecurityButtonReady = {
  buttonDisabled: OrbSecurityButtonReadyButtonDisabled,
  buttonId: OrbSecurityButtonReadyButtonId;
  buttonIndex: OrbSecurityButtonReadyButtonIndex;
  buttonTitle: OrbSecurityButtonReadyButtonTitle;
  changeAccessCode: OrbSecurityButtonReadyChangeAccessCode;
  loadingText: OrbSecurityButtonReadyLoadingText;
  relativeUrl: OrbSecurityButtonReadyRelativeUrl;
  totalButtons: OrbSecurityButtonReadyTotalButtons;
  urlParams: OrbSecurityButtonReadyUrlParams;
};

export type OrbSecurityButtonPendingButtonDisabled = true;

export type OrbSecurityButtonPendingButtonId = string | null;

export type OrbSecurityButtonPendingButtonTitle = string | null;

export type OrbSecurityButtonPending = {
  buttonDisabled: OrbSecurityButtonPendingButtonDisabled,
  buttonId: OrbSecurityButtonPendingButtonId;
  buttonTitle: OrbSecurityButtonPendingButtonTitle;
};

export type OrbSecurityButton = OrbSecurityButtonReady | OrbSecurityButtonPending;

export type OrbSecurityButtons = OrbSecurityButton[];

/**
 * Orb text summary.
 *
 * @since 1.0.0
 */
export type OrbTextSummaryState = string | null;

export type OrbTextSummaryStatus = string | null;

export type OrbTextSummary = {
  state: OrbTextSummaryState;
  status: OrbTextSummaryStatus;
};

/**
 * Panel information.
 *
 * @since 1.0.0
 */
export type PanelInformationEmergencyKeys = RegExpMatchArray | null;

export type PanelInformationManufacturerProvider = string | null;

export type PanelInformationTypeModel = string | null;

export type PanelInformationStatus = string | null;

export type PanelInformation = {
  emergencyKeys: PanelInformationEmergencyKeys;
  manufacturerProvider: PanelInformationManufacturerProvider;
  typeModel: PanelInformationTypeModel;
  status: PanelInformationStatus;
};

/**
 * Sensors information.
 *
 * @since 1.0.0
 */
export type SensorInformationDeviceType = string;

export type SensorInformationName = string;

export type SensorInformationStatus = string;

export type SensorInformationZone = number;

export type SensorInformation = {
  deviceType: SensorInformationDeviceType;
  name: SensorInformationName;
  status: SensorInformationStatus;
  zone: SensorInformationZone;
};

export type SensorsInformation = SensorInformation[];

/**
 * Sensors status.
 *
 * @since 1.0.0
 */
export type SensorStatusIcon = string;

export type SensorStatusName = string;

export type SensorStatusStatus = string;

export type SensorStatusZone = number;

export type SensorStatus = {
  icon: SensorStatusIcon;
  name: SensorStatusName;
  status: SensorStatusStatus;
  zone: SensorStatusZone;
};

export type SensorsStatus = SensorStatus[];

/**
 * Sessions.
 *
 * @since 1.0.0
 */
export type SessionsAxiosAxios = AxiosResponse[];

export type SessionsAxios = {
  axios: SessionsAxiosAxios;
};

export type SessionsJsdomJsdom = JSDOM[];

export type SessionsJsdom = {
  jsdom: SessionsJsdomJsdom;
};

export type Sessions<IncludeAxios extends boolean, IncludeJsdom extends boolean> = (IncludeAxios extends true ? SessionsAxios : object) & (IncludeJsdom extends true ? SessionsJsdom : object);

/**
 * Sync code.
 *
 * @since 1.0.0
 */
export type SyncCode = string;

/**
 * Table cells with surrounding data.
 *
 * @since 1.0.0
 */
export type TableCellsWithSurroundingData = {
  [key: string]: string[];
};

/**
 * UUID.
 *
 * @since 1.0.0
 */
export type UUID = string;
