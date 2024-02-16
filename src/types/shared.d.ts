import type { AxiosResponse } from 'axios';
import type { Logger } from 'homebridge';
import type http from 'http';
import type { JSDOM } from 'jsdom';
import type { ErrorObject } from 'serialize-error';
import z from 'zod';

import type { platformConfig } from '@/lib/schema.js';
import type {
  PluginDeviceCategory,
  PluginDeviceGatewayType,
  PluginDeviceId,
  PluginDevicePanelType,
  PluginDeviceSensorType,
  PortalDeviceGatewayStatus,
  PortalDevicePanelStatus,
  PortalDeviceSensorStatus,
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
  PortalPanelNote,
  PortalPanelState,
  PortalPanelStatus,
  PortalSensorDeviceType,
  PortalSensorStatusIcon,
  PortalSensorStatusText,
  PortalVersion,
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
  | 'LOGIN'
  | 'LOGOUT'
  | 'PERFORM_KEEP_ALIVE'
  | 'PERFORM_SYNC_CHECK'
  | 'SET_PANEL_STATUS';

export type ApiResponseSuccessSuccess = true;

export type ApiResponseSuccessInfo = object | null;

export type ApiResponseSuccess<Action extends ApiResponseAction, Info extends ApiResponseSuccessInfo> = {
  action: Action;
  success: ApiResponseSuccessSuccess;
  info: Info;
};

export type ApiResponseFailSuccess = false;

export type ApiResponseFailInfoError = ErrorObject;

export type ApiResponseFailInfoMessage = string;

export type ApiResponseFailInfo = {
  error?: ApiResponseFailInfoError;
  message?: ApiResponseFailInfoMessage;
};

export type ApiResponseFail<Action extends ApiResponseAction> = {
  action: Action;
  success: ApiResponseFailSuccess;
  info: ApiResponseFailInfo;
};

export type ApiResponse<Action extends ApiResponseAction, Info extends ApiResponseSuccessInfo> =
  ApiResponseSuccess<Action, Info>
  | ApiResponseFail<Action>;

/**
 * Axios response nodejs.
 *
 * @since 1.0.0
 */
export interface AxiosResponseNodeJs<T = any, D = any> extends AxiosResponse<T, D> {
  request?: http.ClientRequest;
}

/**
 * Config.
 *
 * @since 1.0.0
 */
export type Config = z.infer<typeof platformConfig>;

/**
 * Debug parser.
 *
 * @since 1.0.0
 */
export type DebugParserMethod = 'armDisarmHandler' | 'forceArmHandler' | 'getGatewayInformation' | 'getPanelInformation' | 'getPanelStatus' | 'getSensorsInformation' | 'getSensorsStatus' | 'setPanelStatus';

export type DebugParserResponseArmDisarmHandler = OrbSecurityButtons;

export type DebugParserResponseForceArmHandler = DoSubmitHandlers;

export type DebugParserResponseGetGatewayInformation = Record<string, string[]>;

export type DebugParserResponseGetPanelInformation = Record<string, string[]>;

export type DebugParserResponseGetPanelStatus = PanelStatus;

export type DebugParserResponseGetSensorsInformation = SensorInformation[];

export type DebugParserResponseGetSensorsStatus = SensorStatus[];

export type DebugParserResponseSetPanelStatus = OrbSecurityButtons;

export type DebugParserResponse = {
  armDisarmHandler: DebugParserResponseArmDisarmHandler;
  forceArmHandler: DebugParserResponseForceArmHandler;
  getGatewayInformation: DebugParserResponseGetGatewayInformation;
  getPanelInformation: DebugParserResponseGetPanelInformation;
  getPanelStatus: DebugParserResponseGetPanelStatus;
  getSensorsInformation: DebugParserResponseGetSensorsInformation;
  getSensorsStatus: DebugParserResponseGetSensorsStatus;
  setPanelStatus: DebugParserResponseSetPanelStatus;
};

export type DebugParserRawHtml = string;

export type DebugParser<Method extends DebugParserMethod> = {
  method: Method;
  response: DebugParserResponse[Method];
  rawHtml: DebugParserRawHtml;
};

/**
 * Devices.
 *
 * @since 1.0.0
 */
export type DeviceId = PluginDeviceId;

export type DeviceName = string;

export type DeviceOriginalName = string;

export type DeviceType = PluginDeviceGatewayType | PluginDevicePanelType | PluginDeviceSensorType;

export type DeviceZone = number | null;

export type DeviceCategory = PluginDeviceCategory;

export type DeviceManufacturer = string | null;

export type DeviceModel = string | null;

export type DeviceSerial = string | null;

export type DeviceFirmware = string | null;

export type DeviceHardware = string | null;

export type DeviceSoftware = string | null;

export type DeviceUuid = UUID;

export type Device = {
  id: DeviceId;
  name: DeviceName;
  originalName: DeviceOriginalName;
  type: DeviceType;
  zone: DeviceZone;
  category: DeviceCategory;
  manufacturer: DeviceManufacturer;
  model: DeviceModel;
  serial: DeviceSerial;
  firmware: DeviceFirmware;
  hardware: DeviceHardware;
  software: DeviceSoftware;
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
export type GatewayInformationCommunicationPrimaryConnectionType = string | null;

export type GatewayInformationCommunicationBroadbandConnectionStatus = string | null;

export type GatewayInformationCommunicationCellularConnectionStatus = string | null;

export type GatewayInformationCommunicationCellularSignalStrength = string | null;

export type GatewayInformationCommunication = {
  primaryConnectionType: GatewayInformationCommunicationPrimaryConnectionType;
  broadbandConnectionStatus: GatewayInformationCommunicationBroadbandConnectionStatus;
  cellularConnectionStatus: GatewayInformationCommunicationCellularConnectionStatus;
  cellularSignalStrength: GatewayInformationCommunicationCellularSignalStrength;
};

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

export type GatewayInformationNetworkRouterLanIp = string | null;

export type GatewayInformationNetworkRouterWanIp = string | null;

export type GatewayInformationNetworkRouter = {
  lanIp: GatewayInformationNetworkRouterLanIp;
  wanIp: GatewayInformationNetworkRouterWanIp;
};

export type GatewayInformationNetwork = {
  broadband: GatewayInformationNetworkBroadband;
  device: GatewayInformationNetworkDevice;
  router: GatewayInformationNetworkRouter;
};

export type GatewayInformationSerialNumber = string | null;

export type GatewayInformationStatus = PortalDeviceGatewayStatus | null;

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
  communication: GatewayInformationCommunication;
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

export type InternalConfigTestModeIsSystemDisarmedBeforeTest = boolean;

export type InternalConfigTestMode = {
  enabled?: InternalConfigTestModeEnabled;
  isSystemDisarmedBeforeTest?: InternalConfigTestModeIsSystemDisarmedBeforeTest;
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
  buttonDisabled: OrbSecurityButtonReadyButtonDisabled;
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
  buttonDisabled: OrbSecurityButtonPendingButtonDisabled;
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

export type PanelInformationManufacturer = string | null;

export type PanelInformationMasterCode = string | null;

export type PanelInformationModel = string | null;

export type PanelInformationProvider = string | null;

export type PanelInformationStatus = PortalDevicePanelStatus | null;

export type PanelInformationType = string | null;

export type PanelInformation = {
  emergencyKeys: PanelInformationEmergencyKeys;
  manufacturer: PanelInformationManufacturer;
  masterCode: PanelInformationMasterCode;
  model: PanelInformationModel;
  provider: PanelInformationProvider;
  status: PanelInformationStatus;
  type: PanelInformationType;
};

/**
 * Panel status.
 *
 * @since 1.0.0
 */
export type PanelStatusState = PortalPanelState;

export type PanelStatusStates = PanelStatusState[];

export type PanelStatusStatus = PortalPanelStatus;

export type PanelStatusStatuses = PanelStatusStatus[];

export type PanelStatusNote = PortalPanelNote;

export type PanelStatusNotes = PanelStatusNote[];

export type PanelStatusRawDataNode = string;

export type PanelStatusRawDataUnknownPiece = string;

export type PanelStatusRawDataUnknownPieces = PanelStatusRawDataUnknownPiece[];

export type PanelStatusRawData = {
  node: PanelStatusRawDataNode;
  unknownPieces: PanelStatusRawDataUnknownPieces;
};

export type PanelStatus = {
  panelStates: PanelStatusStates;
  panelStatuses: PanelStatusStatuses;
  panelNotes: PanelStatusNotes;
  rawData: PanelStatusRawData;
};

/**
 * Portal version content.
 *
 * @since 1.0.0
 */
export type PortalVersionContent = {
  version: PortalVersion | null;
};

/**
 * Sensor information.
 *
 * @since 1.0.0
 */
export type SensorInformationDeviceId = number;

export type SensorInformationDeviceType = PortalSensorDeviceType;

export type SensorInformationName = string;

export type SensorInformationStatus = PortalDeviceSensorStatus;

export type SensorInformationZone = number;

export type SensorInformation = {
  deviceId: SensorInformationDeviceId;
  deviceType: SensorInformationDeviceType;
  name: SensorInformationName;
  status: SensorInformationStatus;
  zone: SensorInformationZone;
};

/**
 * Sensor status.
 *
 * @since 1.0.0
 */
export type SensorStatusIcon = PortalSensorStatusIcon;

export type SensorStatusName = string;

export type SensorStatusStatus = PortalSensorStatusText;

export type SensorStatusStatuses = SensorStatusStatus[];

export type SensorStatusZone = number;

export type SensorStatus = {
  icon: SensorStatusIcon;
  name: SensorStatusName;
  statuses: SensorStatusStatuses;
  zone: SensorStatusZone;
};

/**
 * Sessions.
 *
 * @since 1.0.0
 */
export type Sessions<Shape extends Record<string, AxiosResponseNodeJs<unknown, unknown> | JSDOM>> = Shape;

/**
 * UUID.
 *
 * @since 1.0.0
 */
export type UUID = string;
