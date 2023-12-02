import type { AxiosResponse } from 'axios';
import type { JSDOM } from 'jsdom';
import type { ErrorObject } from 'serialize-error';

/**
 * Api response.
 *
 * @since 1.0.0
 */
export type ApiResponseAction = 'ARM_DISARM_HANDLER' | 'FORCE_ARM_HANDLER' | 'GET_GATEWAY_INFORMATION' | 'GET_PANEL_INFORMATION' | 'GET_PANEL_STATUS' | 'GET_SENSOR_STATUSES' | 'IS_PORTAL_ACCESSIBLE' | 'LOGIN' | 'LOGOUT' | 'PERFORM_KEEP_ALIVE' | 'PERFORM_SYNC_CHECK' | 'SET_PANEL_STATUS';

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

export type ConfigSensorAdtType = 'co' | 'door' | 'fire' | 'glass' | 'motion' | 'window';

export type ConfigSensorAdtZone = number;

export type ConfigSensor = {
  name?: ConfigSensorName;
  adtName: ConfigSensorAdtName;
  adtType: ConfigSensorAdtType;
  adtZone: ConfigSensorAdtZone;
};

export type ConfigSensors = ConfigSensor[];

export type ConfigDebug = boolean;

export type ConfigReset = boolean;

export type Config = {
  platform: ConfigPlatform;
  name?: ConfigName;
  subdomain: ConfigSubdomain;
  username: ConfigUsername;
  password: ConfigPassword;
  fingerprint: ConfigFingerprint;
  sensors: ConfigSensors;
  debug?: ConfigDebug;
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
 * Internal config.
 *
 * @since 1.0.0
 */
export type InternalConfigBaseUrl = `https://${string}`;

export type InternalConfigTestModeEnabled = boolean;

export type InternalConfigTestModeIsDisarmChecked = boolean;

export type InternalConfigTestMode = {
  enabled: InternalConfigTestModeEnabled;
  isDisarmChecked: InternalConfigTestModeIsDisarmChecked;
};

export type InternalConfig = {
  baseUrl: InternalConfigBaseUrl;
  testMode: InternalConfigTestMode;
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
 * Sensors.
 *
 * @since 1.0.0
 */
export type SensorIcon = string;

export type SensorName = string;

export type SensorStatus = string;

export type SensorZone = number;

export type Sensor = {
  icon: SensorIcon;
  name: SensorName;
  status: SensorStatus;
  zone: SensorZone;
};

export type Sensors = Sensor[];

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

export type SessionsAxiosJsdom = SessionsAxios & SessionsJsdom;

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
