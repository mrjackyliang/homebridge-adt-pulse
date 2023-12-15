import type { AxiosResponse } from 'axios';
import type { Logger } from 'homebridge';
import type http from 'http';
import type { JSDOM } from 'jsdom';
import type { ErrorObject } from 'serialize-error';

import type {
  PluginConfigPlatform,
  PluginDeviceCategory,
  PluginDeviceId,
  PluginDeviceType,
  PortalDeviceStatus,
  PortalPanelArmButtonHref,
  PortalPanelArmButtonId,
  PortalPanelArmButtonLoadingText,
  PortalPanelArmButtonRelativeUrl,
  PortalPanelArmButtonText,
  PortalPanelArmStateClean,
  PortalPanelArmStateDirty,
  PortalPanelArmStateForce,
  PortalPanelArmValue,
  PortalPanelForceArmButtonHref,
  PortalPanelForceArmButtonRelativeUrl,
  PortalPanelState,
  PortalPanelStatus,
  PortalSensorDeviceType,
  PortalSensorStatusIcon,
  PortalSensorStatusText,
  PortalSubdomain,
} from '@/types/constant.d.ts';

/**
 * Api response.
 *
 * @since 1.0.0
 */
export type ApiResponseAction =
  'ARM_DISARM_HANDLER'
  | 'FORCE_ARM_HANDLER'
  | 'GET_GATEWAY_INFORMATION'
  | 'GET_PANEL_INFORMATION'
  | 'GET_PANEL_STATUS'
  | 'GET_SENSORS_INFORMATION'
  | 'GET_SENSORS_STATUS'
  | 'IS_PORTAL_ACCESSIBLE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'PERFORM_KEEP_ALIVE'
  | 'PERFORM_SYNC_CHECK'
  | 'SET_PANEL_STATUS';

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

export type ApiResponse<Action extends ApiResponseAction, Info extends ApiResponseSuccessInfo> =
  ApiResponseSuccess<Action, Info>
  | ApiResponseFail<Action>;

/**
 * Axios response with request.
 *
 * @since 1.0.0
 */
export interface AxiosResponseWithRequest<T = any, D = any> extends AxiosResponse<T, D> {
  request?: http.ClientRequest;
}

/**
 * Config.
 *
 * @since 1.0.0
 */
export type ConfigPlatform = PluginConfigPlatform;

export type ConfigName = string;

export type ConfigSubdomain = PortalSubdomain;

export type ConfigUsername = string;

export type ConfigPassword = string;

export type ConfigFingerprint = string;

export type ConfigSensorName = string;

export type ConfigSensorAdtName = string;

export type ConfigSensorAdtType = Exclude<PluginDeviceType, 'gateway' | 'panel'>;

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
 * Devices.
 *
 * @since 1.0.0
 */
export type DeviceId = PluginDeviceId;

export type DeviceName = string;

export type DeviceType = PluginDeviceType;

export type DeviceZone = number | null;

export type DeviceCategory = PluginDeviceCategory;

export type DeviceManufacturer = string | null;

export type DeviceModel = string | null;

export type DeviceSerial = string | null;

export type DeviceUuid = UUID;

export type Device = {
  id: DeviceId;
  name: DeviceName;
  type: DeviceType;
  zone: DeviceZone;
  category: DeviceCategory;
  manufacturer: DeviceManufacturer;
  model: DeviceModel;
  serial: DeviceSerial;
  uuid: DeviceUuid;
};

export type Devices = Device[];

/**
 * Do submit handlers.
 *
 * @since 1.0.0
 */
export type DoSubmitHandlerRelativeUrl = PortalPanelForceArmButtonRelativeUrl;

export type DoSubmitHandlerUrlParamsArm = Exclude<PortalPanelArmValue, 'off'> | null;

export type DoSubmitHandlerUrlParamsArmState = PortalPanelArmStateForce | null;

export type DoSubmitHandlerUrlParamsHref = PortalPanelForceArmButtonHref;

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

export type GatewayInformationStatus = PortalDeviceStatus | null;

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
 * Network id.
 *
 * @since 1.0.0
 */
export type NetworkId = string;

/**
 * Orb security buttons.
 *
 * @since 1.0.0
 */
export type OrbSecurityButtonBaseButtonId = PortalPanelArmButtonId | null;

export type OrbSecurityButtonBase = {
  buttonId: OrbSecurityButtonBaseButtonId;
};

export type OrbSecurityButtonReadyButtonDisabled = false;

export type OrbSecurityButtonReadyButtonIndex = number;

export type OrbSecurityButtonReadyButtonText = PortalPanelArmButtonText | null;

export type OrbSecurityButtonReadyChangeAccessCode = boolean;

export type OrbSecurityButtonReadyLoadingText = PortalPanelArmButtonLoadingText;

export type OrbSecurityButtonReadyRelativeUrl = PortalPanelArmButtonRelativeUrl;

export type OrbSecurityButtonReadyTotalButtons = number;

export type OrbSecurityButtonReadyUrlParamsArm = PortalPanelArmValue;

export type OrbSecurityButtonReadyUrlParamsArmState = PortalPanelArmStateClean | PortalPanelArmStateDirty;

export type OrbSecurityButtonReadyUrlParamsHref = PortalPanelArmButtonHref;

export type OrbSecurityButtonReadyUrlParamsSat = UUID;

export type OrbSecurityButtonReadyUrlParams = {
  arm: OrbSecurityButtonReadyUrlParamsArm;
  armState: OrbSecurityButtonReadyUrlParamsArmState;
  href: OrbSecurityButtonReadyUrlParamsHref;
  sat: OrbSecurityButtonReadyUrlParamsSat;
};

export type OrbSecurityButtonReady = {
  buttonDisabled: OrbSecurityButtonReadyButtonDisabled,
  buttonIndex: OrbSecurityButtonReadyButtonIndex;
  buttonText: OrbSecurityButtonReadyButtonText;
  changeAccessCode: OrbSecurityButtonReadyChangeAccessCode;
  loadingText: OrbSecurityButtonReadyLoadingText;
  relativeUrl: OrbSecurityButtonReadyRelativeUrl;
  totalButtons: OrbSecurityButtonReadyTotalButtons;
  urlParams: OrbSecurityButtonReadyUrlParams;
};

export type OrbSecurityButtonPendingButtonDisabled = true;

export type OrbSecurityButtonPendingButtonText = PortalPanelArmButtonLoadingText | null;

export type OrbSecurityButtonPending = {
  buttonDisabled: OrbSecurityButtonPendingButtonDisabled,
  buttonText: OrbSecurityButtonPendingButtonText;
};

export type OrbSecurityButton = (OrbSecurityButtonBase & OrbSecurityButtonReady) | (OrbSecurityButtonBase & OrbSecurityButtonPending);

export type OrbSecurityButtons = OrbSecurityButton[];

/**
 * Panel information.
 *
 * @since 1.0.0
 */
export type PanelInformationEmergencyKeys = RegExpMatchArray | null;

export type PanelInformationManufacturerProvider = string | null;

export type PanelInformationTypeModel = string | null;

export type PanelInformationStatus = PortalDeviceStatus | null;

export type PanelInformation = {
  emergencyKeys: PanelInformationEmergencyKeys;
  manufacturerProvider: PanelInformationManufacturerProvider;
  typeModel: PanelInformationTypeModel;
  status: PanelInformationStatus;
};

/**
 * Panel status.
 *
 * @since 1.0.0
 */
export type PanelStatusState = PortalPanelState | null;

export type PanelStatusStatus = Exclude<PortalPanelStatus, ''> | null;

export type PanelStatus = {
  state: PanelStatusState;
  status: PanelStatusStatus;
};

/**
 * Sensors information.
 *
 * @since 1.0.0
 */
export type SensorInformationDeviceId = number;

export type SensorInformationDeviceType = PortalSensorDeviceType;

export type SensorInformationName = string;

export type SensorInformationStatus = PortalDeviceStatus;

export type SensorInformationZone = number;

export type SensorInformation = {
  deviceId: SensorInformationDeviceId;
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
export type SensorStatusIcon = PortalSensorStatusIcon;

export type SensorStatusName = string;

export type SensorStatusStatus = PortalSensorStatusText;

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
export type Sessions<Shape extends Record<string, AxiosResponseWithRequest<unknown, unknown> | JSDOM>> = Shape;

/**
 * UUID.
 *
 * @since 1.0.0
 */
export type UUID = string;
