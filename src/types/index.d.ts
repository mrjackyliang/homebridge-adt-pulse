import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type {
  API,
  Characteristic,
  CharacteristicValue,
  DynamicPlatformPlugin,
  HapStatusError,
  Logger,
  Nullable,
  PlatformAccessory,
  PlatformConfig,
  Service,
} from 'homebridge';
import type { JSDOM } from 'jsdom';
import type repl from 'node:repl';
import type { ErrorObject } from 'serialize-error';
import type { z } from 'zod';

import type { ADTPulseAccessory } from '@/lib/accessory.js';
import type { ADTPulseAPI } from '@/lib/api.js';
import type { ADTPulseAuth } from '@/lib/auth.js';
import type { multiFactorAuth, platformConfig } from '@/lib/schema.js';
import type {
  PluginDeviceCategory,
  PluginDeviceId,
  PluginDeviceSensorType,
  PluginLogLevel,
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
  PortalSubdomain,
  PortalSyncCode,
  PortalVersion,
} from '@/types/constant.d.ts';
import type {
  ApiResponse,
  ApiResponseFail,
  AxiosResponseNodeJs,
  BaseUrl,
  Config,
  Connection,
  Credentials,
  DebugParser,
  Device,
  Devices,
  DoSubmitHandlers,
  GatewayInformation,
  InternalConfig,
  MfaDevice,
  MfaTrustedDevice,
  NetworkId,
  OrbSecurityButtonBase,
  OrbSecurityButtonReady,
  OrbSecurityButtons,
  PanelInformation,
  PanelStatus,
  PanelStatusStates,
  PanelStatusStatuses,
  PortalVersionContent,
  SensorConfig,
  SensorInformation,
  SensorStatus,
  Sessions,
  UUID,
} from '@/types/shared.d.ts';

/**
 * ADT Pulse Accessory - Accessory.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryAccessory = PlatformAccessory<Device>;

/**
 * ADT Pulse Accessory - Activity.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryActivityIsBusy = boolean;

export type ADTPulseAccessoryActivitySetCurrentValue = Nullable<CharacteristicValue>;

export type ADTPulseAccessoryActivitySetTargetValue = Nullable<CharacteristicValue>;

export type ADTPulseAccessoryActivitySetValue = Nullable<CharacteristicValue>;

export type ADTPulseAccessoryActivity = {
  isBusy: ADTPulseAccessoryActivityIsBusy;
  setCurrentValue: ADTPulseAccessoryActivitySetCurrentValue;
  setTargetValue: ADTPulseAccessoryActivitySetTargetValue;
  setValue: ADTPulseAccessoryActivitySetValue;
};

/**
 * ADT Pulse Accessory - Api.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryApi = API;

/**
 * ADT Pulse Accessory - Characteristic.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryCharacteristic = typeof Characteristic;

/**
 * ADT Pulse Accessory - Config.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryConfig = ADTPulsePlatformConfig;

/**
 * ADT Pulse Accessory - Constructor.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryConstructorAccessory = PlatformAccessory<Device>;

export type ADTPulseAccessoryConstructorState = ADTPulsePlatformState;

export type ADTPulseAccessoryConstructorConfig = ADTPulsePlatformConfig;

export type ADTPulseAccessoryConstructorInstance = ADTPulseAPI;

export type ADTPulseAccessoryConstructorService = typeof Service;

export type ADTPulseAccessoryConstructorCharacteristic = typeof Characteristic;

export type ADTPulseAccessoryConstructorApi = API;

export type ADTPulseAccessoryConstructorLog = Logger;

/**
 * ADT Pulse Accessory - Get panel status.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryGetPanelStatusMode = 'alarmType' | 'current' | 'fault' | 'tamper' | 'target';

export type ADTPulseAccessoryGetPanelStatusReturns = HapStatusError | Error | Nullable<CharacteristicValue>;

/**
 * ADT Pulse Accessory - Get panel switch status.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryGetPanelSwitchStatusReturns = HapStatusError | Error | Nullable<CharacteristicValue>;

/**
 * ADT Pulse Accessory - Get sensor status.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryGetSensorStatusMode = 'active' | 'fault' | 'lowBattery' | 'status' | 'tamper';

export type ADTPulseAccessoryGetSensorStatusReturns = HapStatusError | Error | Nullable<CharacteristicValue>;

/**
 * ADT Pulse Accessory - Set panel status.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessorySetPanelStatusArm = CharacteristicValue;

export type ADTPulseAccessorySetPanelStatusReturns = Promise<void>;

/**
 * ADT Pulse Accessory - Set panel switch status.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessorySetPanelSwitchStatusOn = CharacteristicValue;

export type ADTPulseAccessorySetPanelSwitchStatusReturns = Promise<void>;

/**
 * ADT Pulse Accessory - Instance.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryInstance = ADTPulseAPI;

/**
 * ADT Pulse Accessory - Log.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryLog = Logger;

/**
 * ADT Pulse Accessory - Services.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryServices = Record<string, Service | undefined>;

/**
 * ADT Pulse Accessory - State.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryState = ADTPulsePlatformState;

/**
 * ADT Pulse Accessory - Updater.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryUpdaterReturns = void;

/**
 * ADT Pulse API - Arm disarm handler.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIArmDisarmHandlerIsAlarmActive = boolean;

export type ADTPulseAPIArmDisarmHandlerOptionsRelativeUrl = PortalPanelArmButtonRelativeUrl;

export type ADTPulseAPIArmDisarmHandlerOptionsHref = PortalPanelArmButtonHref;

export type ADTPulseAPIArmDisarmHandlerOptionsArmState = PortalPanelArmStateClean | PortalPanelArmStateDirty;

export type ADTPulseAPIArmDisarmHandlerOptionsArm = PortalPanelArmValue;

export type ADTPulseAPIArmDisarmHandlerOptionsSat = UUID;

export type ADTPulseAPIArmDisarmHandlerOptions = {
  relativeUrl: ADTPulseAPIArmDisarmHandlerOptionsRelativeUrl;
  href: ADTPulseAPIArmDisarmHandlerOptionsHref;
  armState: ADTPulseAPIArmDisarmHandlerOptionsArmState;
  arm: ADTPulseAPIArmDisarmHandlerOptionsArm;
  sat: ADTPulseAPIArmDisarmHandlerOptionsSat;
};

export type ADTPulseAPIArmDisarmHandlerReturnsInfoForceArmRequired = boolean;

export type ADTPulseAPIArmDisarmHandlerReturnsInfoReadyButton = OrbSecurityButtonBase & OrbSecurityButtonReady;

export type ADTPulseAPIArmDisarmHandlerReturnsInfoReadyButtons = ADTPulseAPIArmDisarmHandlerReturnsInfoReadyButton[];

export type ADTPulseAPIArmDisarmHandlerReturnsInfo = {
  forceArmRequired: ADTPulseAPIArmDisarmHandlerReturnsInfoForceArmRequired;
  readyButtons: ADTPulseAPIArmDisarmHandlerReturnsInfoReadyButtons;
};

export type ADTPulseAPIArmDisarmHandlerReturns = Promise<ApiResponse<'ARM_DISARM_HANDLER', ADTPulseAPIArmDisarmHandlerReturnsInfo>>;

export type ADTPulseAPIArmDisarmHandlerSessions = Sessions<{
  axiosSetArmMode?: AxiosResponseNodeJs<unknown>;
}>;

export type ADTPulseAPIArmDisarmHandlerReadyButton = OrbSecurityButtonBase & OrbSecurityButtonReady;

/**
 * ADT Pulse API - Connection.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIConnection = Connection;

/**
 * ADT Pulse API - Constructor.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIConstructorConfig = Config;

export type ADTPulseAPIConstructorInternalConfig = InternalConfig;

/**
 * ADT Pulse API - Credentials.
 *
 * @since 1.0.0
 */
export type ADTPulseAPICredentials = Credentials;

/**
 * ADT Pulse API - Force arm handler.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIForceArmHandlerResponse = AxiosResponseNodeJs<unknown>;

export type ADTPulseAPIForceArmHandlerRelativeUrl = PortalPanelArmButtonRelativeUrl;

export type ADTPulseAPIForceArmHandlerReturnsInfoForceArmRequired = boolean;

export type ADTPulseAPIForceArmHandlerReturnsInfo = {
  forceArmRequired: ADTPulseAPIForceArmHandlerReturnsInfoForceArmRequired;
};

export type ADTPulseAPIForceArmHandlerReturns = Promise<ApiResponse<'FORCE_ARM_HANDLER', ADTPulseAPIForceArmHandlerReturnsInfo>>;

export type ADTPulseAPIForceArmHandlerSessions = Sessions<{
  axiosForceArm?: AxiosResponseNodeJs<unknown>;
  jsdomArmDisarm?: JSDOM;
}>;

export type ADTPulseAPIForceArmHandlerTrackerComplete = boolean;

export type ADTPulseAPIForceArmHandlerTrackerErrorMessage = string | null;

export type ADTPulseAPIForceArmHandlerTrackerRequestUrl = string | null;

export type ADTPulseAPIForceArmHandlerTracker = {
  complete: ADTPulseAPIForceArmHandlerTrackerComplete;
  errorMessage: ADTPulseAPIForceArmHandlerTrackerErrorMessage;
  requestUrl: ADTPulseAPIForceArmHandlerTrackerRequestUrl;
};

/**
 * ADT Pulse API - Get gateway information.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIGetGatewayInformationReturnsInfo = GatewayInformation;

export type ADTPulseAPIGetGatewayInformationReturns = Promise<ApiResponse<'GET_GATEWAY_INFORMATION', ADTPulseAPIGetGatewayInformationReturnsInfo>>;

export type ADTPulseAPIGetGatewayInformationSessions = Sessions<{
  axiosSystemGateway?: AxiosResponseNodeJs<unknown>;
  jsdomSystemGateway?: JSDOM;
}>;

export type ADTPulseAPIGetGatewayInformationReturnsStatus = PortalDeviceGatewayStatus | null;

/**
 * ADT Pulse API - Get panel information.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIGetPanelInformationReturnsInfo = PanelInformation;

export type ADTPulseAPIGetPanelInformationReturns = Promise<ApiResponse<'GET_PANEL_INFORMATION', ADTPulseAPIGetPanelInformationReturnsInfo>>;

export type ADTPulseAPIGetPanelInformationSessions = Sessions<{
  axiosSystemDeviceId1?: AxiosResponseNodeJs<unknown>;
  jsdomSystemDeviceId1?: JSDOM;
}>;

export type ADTPulseAPIGetPanelInformationReturnsStatus = PortalDevicePanelStatus | null;

/**
 * ADT Pulse API - Get panel status.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIGetPanelStatusReturnsInfo = PanelStatus;

export type ADTPulseAPIGetPanelStatusReturns = Promise<ApiResponse<'GET_PANEL_STATUS', ADTPulseAPIGetPanelStatusReturnsInfo>>;

export type ADTPulseAPIGetPanelStatusSessions = Sessions<{
  axiosSummary?: AxiosResponseNodeJs<unknown>;
  jsdomSummary?: JSDOM;
}>;

/**
 * ADT Pulse API - Get request config.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIGetRequestConfigExtraConfig = AxiosRequestConfig;

export type ADTPulseAPIGetRequestConfigReturns = AxiosRequestConfig;

export type ADTPulseAPIGetRequestConfigDefaultConfig = AxiosRequestConfig;

/**
 * ADT Pulse API - Get orb security buttons.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIGetOrbSecurityButtonsReturnsInfo = OrbSecurityButtons;

export type ADTPulseAPIGetOrbSecurityButtonsReturns = Promise<ApiResponse<'GET_ORB_SECURITY_BUTTONS', ADTPulseAPIGetOrbSecurityButtonsReturnsInfo>>;

export type ADTPulseAPIGetOrbSecurityButtonsSessions = Sessions<{
  axiosSummary?: AxiosResponseNodeJs<unknown>;
  jsdomSummary?: JSDOM;
}>;

/**
 * ADT Pulse API - Get sensors information.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIGetSensorsInformationReturnsInfoSensor = SensorInformation;

export type ADTPulseAPIGetSensorsInformationReturnsInfoSensors = ADTPulseAPIGetSensorsInformationReturnsInfoSensor[];

export type ADTPulseAPIGetSensorsInformationReturnsInfo = {
  sensors: ADTPulseAPIGetSensorsInformationReturnsInfoSensors;
};

export type ADTPulseAPIGetSensorsInformationReturns = Promise<ApiResponse<'GET_SENSORS_INFORMATION', ADTPulseAPIGetSensorsInformationReturnsInfo>>;

export type ADTPulseAPIGetSensorsInformationSessions = Sessions<{
  axiosSystem?: AxiosResponseNodeJs<unknown>;
  jsdomSystem?: JSDOM;
}>;

export type ADTPulseAPIGetSensorsInformationParsedSensorsInformationTable = SensorInformation[];

/**
 * ADT Pulse API - Get sensors status.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIGetSensorsStatusReturnsInfoSensor = SensorStatus;

export type ADTPulseAPIGetSensorsStatusReturnsInfoSensors = ADTPulseAPIGetSensorsStatusReturnsInfoSensor[];

export type ADTPulseAPIGetSensorsStatusReturnsInfo = {
  sensors: ADTPulseAPIGetSensorsStatusReturnsInfoSensors;
};

export type ADTPulseAPIGetSensorsStatusReturns = Promise<ApiResponse<'GET_SENSORS_STATUS', ADTPulseAPIGetSensorsStatusReturnsInfo>>;

export type ADTPulseAPIGetSensorsStatusSessions = Sessions<{
  axiosSummary?: AxiosResponseNodeJs<unknown>;
  jsdomSummary?: JSDOM;
}>;

/**
 * ADT Pulse API - Handle login failure.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIHandleLoginFailureRequestPath = string | null;

export type ADTPulseAPIHandleLoginFailureSession = AxiosResponseNodeJs<unknown> | undefined;

export type ADTPulseAPIHandleLoginFailureReturns = void;

/**
 * ADT Pulse API - Internal.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIInternalBaseUrl = BaseUrl;

export type ADTPulseAPIInternalDebug = boolean;

export type ADTPulseAPIInternalLogger = Logger | null;

export type ADTPulseAPIInternalReportedHash = string;

export type ADTPulseAPIInternalReportedHashes = ADTPulseAPIInternalReportedHash[];

export type ADTPulseAPIInternalTestModeEnabled = boolean;

export type ADTPulseAPIInternalTestModeIsSystemDisarmedBeforeTest = boolean;

export type ADTPulseAPIInternalTestMode = {
  enabled: ADTPulseAPIInternalTestModeEnabled;
  isSystemDisarmedBeforeTest: ADTPulseAPIInternalTestModeIsSystemDisarmedBeforeTest;
};

export type ADTPulseAPIInternalWaitTimeAfterArm = number;

export type ADTPulseAPIInternal = {
  baseUrl: ADTPulseAPIInternalBaseUrl;
  debug: ADTPulseAPIInternalDebug;
  logger: ADTPulseAPIInternalLogger;
  reportedHashes: ADTPulseAPIInternalReportedHashes;
  testMode: ADTPulseAPIInternalTestMode;
  waitTimeAfterArm: ADTPulseAPIInternalWaitTimeAfterArm;
};

/**
 * ADT Pulse API - Is authenticated.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIIsAuthenticatedReturns = boolean;

/**
 * ADT Pulse API - Login.
 *
 * @since 1.0.0
 */
export type ADTPulseAPILoginReturnsInfoBackupSatCode = UUID | null;

export type ADTPulseAPILoginReturnsInfoNetworkId = NetworkId | null;

export type ADTPulseAPILoginReturnsInfoPortalVersion = PortalVersion | null;

export type ADTPulseAPILoginReturnsInfo = {
  backupSatCode: ADTPulseAPILoginReturnsInfoBackupSatCode;
  networkId: ADTPulseAPILoginReturnsInfoNetworkId;
  portalVersion: ADTPulseAPILoginReturnsInfoPortalVersion;
};

export type ADTPulseAPILoginReturns = Promise<ApiResponse<'LOGIN', ADTPulseAPILoginReturnsInfo>>;

export type ADTPulseAPILoginSessions = Sessions<{
  axiosIndex?: AxiosResponseNodeJs<unknown>;
  axiosSignIn?: AxiosResponseNodeJs<unknown>;
}>;

export type ADTPulseAPILoginPortalVersion = PortalVersion;

/**
 * ADT Pulse API - Logout.
 *
 * @since 1.0.0
 */
export type ADTPulseAPILogoutReturnsInfoBackupSatCode = UUID | null;

export type ADTPulseAPILogoutReturnsInfoNetworkId = NetworkId | null;

export type ADTPulseAPILogoutReturnsInfoPortalVersion = PortalVersion | null;

export type ADTPulseAPILogoutReturnsInfo = {
  backupSatCode: ADTPulseAPILogoutReturnsInfoBackupSatCode;
  networkId: ADTPulseAPILogoutReturnsInfoNetworkId;
  portalVersion: ADTPulseAPILogoutReturnsInfoPortalVersion;
};

export type ADTPulseAPILogoutReturns = Promise<ApiResponse<'LOGOUT', ADTPulseAPILogoutReturnsInfo>>;

export type ADTPulseAPILogoutSessions = Sessions<{
  axiosSignout?: AxiosResponseNodeJs<unknown>;
}>;

/**
 * ADT Pulse API - New information dispatcher.
 *
 * @since 1.0.0
 */
export type ADTPulseAPINewInformationDispatcherType = 'debug-parser' | 'do-submit-handlers' | 'gateway-information' | 'orb-security-buttons' | 'panel-information' | 'panel-status' | 'portal-version' | 'sensors-information' | 'sensors-status';

export type ADTPulseAPINewInformationDispatcherData<Type extends ADTPulseAPINewInformationDispatcherType> =
  Type extends 'debug-parser' ? DebugParser<'forceArmHandler'> | DebugParser<'getGatewayInformation'> | DebugParser<'getOrbSecurityButtons'> | DebugParser<'getPanelInformation'> | DebugParser<'getPanelStatus'> | DebugParser<'getSensorsInformation'> | DebugParser<'getSensorsStatus'>
    : Type extends 'do-submit-handlers' ? DoSubmitHandlers
      : Type extends 'gateway-information' ? GatewayInformation
        : Type extends 'orb-security-buttons' ? OrbSecurityButtons
          : Type extends 'panel-information' ? PanelInformation
            : Type extends 'panel-status' ? PanelStatus
              : Type extends 'portal-version' ? PortalVersionContent
                : Type extends 'sensors-information' ? SensorInformation[]
                  : Type extends 'sensors-status' ? SensorStatus[]
                    : never;

export type ADTPulseAPINewInformationDispatcherReturns = Promise<void>;

/**
 * ADT Pulse API - Perform keep alive.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIPerformKeepAliveReturnsInfo = null;

export type ADTPulseAPIPerformKeepAliveReturns = Promise<ApiResponse<'PERFORM_KEEP_ALIVE', ADTPulseAPIPerformKeepAliveReturnsInfo>>;

export type ADTPulseAPIPerformKeepAliveSessions = Sessions<{
  axiosKeepAlive?: AxiosResponseNodeJs<unknown>;
}>;

/**
 * ADT Pulse API - Perform sync check.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIPerformSyncCheckReturnsInfoSyncCode = PortalSyncCode;

export type ADTPulseAPIPerformSyncCheckReturnsInfo = {
  syncCode: ADTPulseAPIPerformSyncCheckReturnsInfoSyncCode;
};

export type ADTPulseAPIPerformSyncCheckReturns = Promise<ApiResponse<'PERFORM_SYNC_CHECK', ADTPulseAPIPerformSyncCheckReturnsInfo>>;

export type ADTPulseAPIPerformSyncCheckSessions = Sessions<{
  axiosSyncCheck?: AxiosResponseNodeJs<unknown>;
}>;

/**
 * ADT Pulse API - Reset session.
 *
 * @since 1.0.0
 */
export type ADTPulseAPIResetSessionReturns = void;

/**
 * ADT Pulse API - Session.
 *
 * @since 1.0.0
 */
export type ADTPulseAPISessionBackupSatCode = UUID | null;

export type ADTPulseAPISessionHttpClient = AxiosInstance;

export type ADTPulseAPISessionIsAuthenticated = boolean;

export type ADTPulseAPISessionIsCleanState = boolean;

export type ADTPulseAPISessionNetworkId = NetworkId | null;

export type ADTPulseAPISessionPortalVersion = PortalVersion | null;

export type ADTPulseAPISession = {
  backupSatCode: ADTPulseAPISessionBackupSatCode;
  httpClient: ADTPulseAPISessionHttpClient;
  isAuthenticated: ADTPulseAPISessionIsAuthenticated;
  isCleanState: ADTPulseAPISessionIsCleanState;
  networkId: ADTPulseAPISessionNetworkId;
  portalVersion: ADTPulseAPISessionPortalVersion;
};

/**
 * ADT Pulse API - Set panel status.
 *
 * @since 1.0.0
 */
export type ADTPulseAPISetPanelStatusArmFrom = PortalPanelArmValue;

export type ADTPulseAPISetPanelStatusArmTo = PortalPanelArmValue;

export type ADTPulseAPISetPanelStatusIsAlarmActive = boolean;

export type ADTPulseAPISetPanelStatusReturnsInfoForceArmRequired = boolean;

export type ADTPulseAPISetPanelStatusReturnsInfo = {
  forceArmRequired: ADTPulseAPISetPanelStatusReturnsInfoForceArmRequired;
};

export type ADTPulseAPISetPanelStatusReturns = Promise<ApiResponse<'SET_PANEL_STATUS', ADTPulseAPISetPanelStatusReturnsInfo>>;

export type ADTPulseAPISetPanelStatusReadyButton = OrbSecurityButtonBase & OrbSecurityButtonReady;

/**
 * ADT Pulse Auth - Add trusted device.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthAddTrustedDeviceDeviceName = string;

export type ADTPulseAuthAddTrustedDeviceReturnsInfo = null;

export type ADTPulseAuthAddTrustedDeviceReturns = Promise<ApiResponse<'ADD_TRUSTED_DEVICE', ADTPulseAuthAddTrustedDeviceReturnsInfo>>;

export type ADTPulseAuthAddTrustedDeviceSessions = Sessions<{
  axiosAddDevice?: AxiosResponseNodeJs<unknown>;
}>;

/**
 * ADT Pulse Auth - Complete sign in.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthCompleteSignInReturnsInfo = null;

export type ADTPulseAuthCompleteSignInReturns = Promise<ApiResponse<'COMPLETE_SIGN_IN', ADTPulseAuthCompleteSignInReturnsInfo>>;

export type ADTPulseAuthCompleteSignInSessions = Sessions<{
  axiosPostSignIn?: AxiosResponseNodeJs<unknown>;
}>;

/**
 * ADT Pulse Auth - Connection.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthConnection = Connection;

/**
 * ADT Pulse Auth - Constructor.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthConstructorConfigPassword = string;

export type ADTPulseAuthConstructorConfigSubdomain = PortalSubdomain;

export type ADTPulseAuthConstructorConfigUsername = string;

export type ADTPulseAuthConstructorConfig = {
  password: ADTPulseAuthConstructorConfigPassword;
  subdomain: ADTPulseAuthConstructorConfigSubdomain;
  username: ADTPulseAuthConstructorConfigUsername;
};

export type ADTPulseAuthConstructorInternalConfig = Omit<InternalConfig, 'testMode'>;

/**
 * ADT Pulse Auth - Credentials.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthCredentials = Credentials;

/**
 * ADT Pulse Auth - Get fingerprint.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthGetFingerprintReturns = string;

/**
 * ADT Pulse Auth - Get request config.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthGetRequestConfigExtraConfig = AxiosRequestConfig;

export type ADTPulseAuthGetRequestConfigReturns = AxiosRequestConfig;

export type ADTPulseAuthGetRequestConfigDefaultConfig = AxiosRequestConfig;

/**
 * ADT Pulse Auth - Get sensors.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthGetSensorsReturnsInfoSensors = SensorConfig[];

export type ADTPulseAuthGetSensorsReturnsInfo = {
  sensors: ADTPulseAuthGetSensorsReturnsInfoSensors;
};

export type ADTPulseAuthGetSensorsReturns = Promise<ApiResponse<'GET_SENSORS', ADTPulseAuthGetSensorsReturnsInfo>>;

export type ADTPulseAuthGetSensorsSessions = Sessions<{
  axiosSystem?: AxiosResponseNodeJs<unknown>;
  jsdomSystem?: JSDOM;
}>;

export type ADTPulseAuthGetSensorsParsedSensorsConfigTable = SensorConfig[];

/**
 * ADT Pulse Auth - Get trusted devices.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthGetTrustedDevicesReturnsInfoTrustedDevices = MfaTrustedDevice[];

export type ADTPulseAuthGetTrustedDevicesReturnsInfo = {
  trustedDevices: ADTPulseAuthGetTrustedDevicesReturnsInfoTrustedDevices;
};

export type ADTPulseAuthGetTrustedDevicesReturns = Promise<ApiResponse<'GET_TRUSTED_DEVICES', ADTPulseAuthGetTrustedDevicesReturnsInfo>>;

export type ADTPulseAuthGetTrustedDevicesSessions = Sessions<{
  axiosDevicePoll?: AxiosResponseNodeJs<unknown>;
}>;

export type ADTPulseAuthGetTrustedDevicesParsedTrustedDevices = MfaTrustedDevice[];

/**
 * ADT Pulse Auth - Get verification methods.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthGetVerificationMethodsReturnsInfoMethods = MfaDevice[];

export type ADTPulseAuthGetVerificationMethodsReturnsInfoStatus = 'complete' | 'not-required';

export type ADTPulseAuthGetVerificationMethodsReturnsInfo = {
  methods: ADTPulseAuthGetVerificationMethodsReturnsInfoMethods;
  status: ADTPulseAuthGetVerificationMethodsReturnsInfoStatus;
};

export type ADTPulseAuthGetVerificationMethodsReturns = Promise<ApiResponse<'GET_VERIFICATION_METHODS', ADTPulseAuthGetVerificationMethodsReturnsInfo>>;

export type ADTPulseAuthGetVerificationMethodsSessions = Sessions<{
  axiosIndex?: AxiosResponseNodeJs<unknown>;
  axiosSignIn?: AxiosResponseNodeJs<unknown>;
  axiosMethods?: AxiosResponseNodeJs<unknown>;
}>;

export type ADTPulseAuthGetVerificationMethodsPortalVersion = PortalVersion;

/**
 * ADT Pulse Auth - Handle login failure.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthHandleLoginFailureRequestPath = string | null;

export type ADTPulseAuthHandleLoginFailureSession = AxiosResponseNodeJs<unknown> | undefined;

export type ADTPulseAuthHandleLoginFailureReturns = void;

/**
 * ADT Pulse Auth - Internal.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthInternalBaseUrl = BaseUrl;

export type ADTPulseAuthInternalDebug = boolean;

export type ADTPulseAuthInternalLogger = Logger | null;

export type ADTPulseAuthInternalReportedHash = string;

export type ADTPulseAuthInternalReportedHashes = ADTPulseAuthInternalReportedHash[];

export type ADTPulseAuthInternal = {
  baseUrl: ADTPulseAuthInternalBaseUrl;
  debug: ADTPulseAuthInternalDebug;
  logger: ADTPulseAuthInternalLogger;
  reportedHashes: ADTPulseAuthInternalReportedHashes;
};

/**
 * ADT Pulse Auth - New information dispatcher.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthNewInformationDispatcherType = 'debug-parser' | 'portal-version';

export type ADTPulseAuthNewInformationDispatcherData<Type extends ADTPulseAuthNewInformationDispatcherType> =
  Type extends 'debug-parser' ? DebugParser<'generateSensorsConfig'>
    : Type extends 'portal-version' ? PortalVersionContent
      : Type extends 'sensors-config' ? SensorConfig[]
        : never;

export type ADTPulseAuthNewInformationDispatcherReturns = Promise<void>;

/**
 * ADT Pulse Auth - Request code.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthRequestCodeMethodId = string;

export type ADTPulseAuthRequestCodeReturnsInfo = null;

export type ADTPulseAuthRequestCodeReturns = Promise<ApiResponse<'REQUEST_CODE', ADTPulseAuthRequestCodeReturnsInfo>>;

export type ADTPulseAuthRequestCodeSessions = Sessions<{
  axiosRequestCode?: AxiosResponseNodeJs<unknown>;
}>;

/**
 * ADT Pulse Auth - Reset session.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthResetSessionReturns = void;

/**
 * ADT Pulse Auth - Session.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthSessionHttpClient = AxiosInstance;

export type ADTPulseAuthSessionMfaClientType = string | null;

export type ADTPulseAuthSessionMfaLocale = string | null;

export type ADTPulseAuthSessionMfaLogin = string | null;

export type ADTPulseAuthSessionMfaPreAuthToken = string | null;

export type ADTPulseAuthSessionMfaSatCode = UUID | null;

export type ADTPulseAuthSessionMfaToken = string | null;

export type ADTPulseAuthSessionMfaTrustedDevices = MfaTrustedDevice[];

export type ADTPulseAuthSessionMfaVerificationMethods = MfaDevice[];

export type ADTPulseAuthSessionMfa = {
  clientType: ADTPulseAuthSessionMfaClientType;
  locale: ADTPulseAuthSessionMfaLocale;
  login: ADTPulseAuthSessionMfaLogin;
  preAuthToken: ADTPulseAuthSessionMfaPreAuthToken;
  satCode: ADTPulseAuthSessionMfaSatCode;
  token: ADTPulseAuthSessionMfaToken;
  trustedDevices: ADTPulseAuthSessionMfaTrustedDevices;
  verificationMethods: ADTPulseAuthSessionMfaVerificationMethods,
};

export type ADTPulseAuthSessionPortalVersion = PortalVersion | null;

export type ADTPulseAuthSessionStatus = 'complete' | 'logged-out' | 'not-required';

export type ADTPulseAuthSession = {
  httpClient: ADTPulseAuthSessionHttpClient;
  mfa: ADTPulseAuthSessionMfa;
  portalVersion: ADTPulseAuthSessionPortalVersion;
  status: ADTPulseAuthSessionStatus;
};

/**
 * ADT Pulse Auth - Validate code.
 *
 * @since 1.0.0
 */
export type ADTPulseAuthValidateCodeOtpCode = string;

export type ADTPulseAuthValidateCodeReturnsInfo = null;

export type ADTPulseAuthValidateCodeReturns = Promise<ApiResponse<'VALIDATE_CODE', ADTPulseAuthValidateCodeReturnsInfo>>;

export type ADTPulseAuthValidateCodeSessions = Sessions<{
  axiosValidateCode?: AxiosResponseNodeJs<unknown>;
}>;

/**
 * ADT Pulse Platform.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformPlugin = DynamicPlatformPlugin;

/**
 * ADT Pulse Platform - Accessories.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformAccessory = PlatformAccessory<Device>;

export type ADTPulsePlatformAccessories = ADTPulsePlatformAccessory[];

/**
 * ADT Pulse Platform - Add accessory.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformAddAccessoryDevice = Device;

export type ADTPulsePlatformAddAccessoryReturns = void;

export type ADTPulsePlatformAddAccessoryTypedAccessory = PlatformAccessory<Device>;

/**
 * ADT Pulse Platform - Api.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformApi = API;

/**
 * ADT Pulse Platform - Characteristic.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformCharacteristic = typeof Characteristic;

/**
 * ADT Pulse Platform - Config.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformConfig = z.infer<typeof platformConfig> | null;

/**
 * ADT Pulse Platform - Configure accessory.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformConfigureAccessoryAccessory = PlatformAccessory<Device>;

export type ADTPulsePlatformConfigureAccessoryReturns = void;

/**
 * ADT Pulse Platform - Constants.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformConstantsTimestampsAdtKeepAlive = number;

export type ADTPulsePlatformConstantsTimestampsAdtSessionLifespan = number;

export type ADTPulsePlatformConstantsTimestampsAdtSyncCheck = number;

export type ADTPulsePlatformConstantsTimestampsSuspendSyncing = number;

export type ADTPulsePlatformConstantsTimestampsSynchronize = number;

export type ADTPulsePlatformConstantsTimestamps = {
  adtKeepAlive: ADTPulsePlatformConstantsTimestampsAdtKeepAlive;
  adtSessionLifespan: ADTPulsePlatformConstantsTimestampsAdtSessionLifespan;
  adtSyncCheck: ADTPulsePlatformConstantsTimestampsAdtSyncCheck;
  suspendSyncing: ADTPulsePlatformConstantsTimestampsSuspendSyncing;
  synchronize: ADTPulsePlatformConstantsTimestampsSynchronize;
};

export type ADTPulsePlatformConstantsMaxLoginRetries = number;

export type ADTPulsePlatformConstants = {
  intervalTimestamps: ADTPulsePlatformConstantsTimestamps;
  maxLoginRetries: ADTPulsePlatformConstantsMaxLoginRetries;
};

/**
 * ADT Pulse Platform - Constructor.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformConstructorLog = Logger;

export type ADTPulsePlatformConstructorConfig = PlatformConfig;

export type ADTPulsePlatformConstructorApi = API;

/**
 * ADT Pulse Platform - Debug mode.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformDebugMode = boolean | null;

/**
 * ADT Pulse Platform - Fetch updated information.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformFetchUpdatedInformationReturns = Promise<void>;

/**
 * ADT Pulse Platform - Handlers.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformHandlers = Record<string, ADTPulseAccessory>;

/**
 * ADT Pulse Platform - Instance.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformInstance = ADTPulseAPI | null;

/**
 * ADT Pulse Platform - Log.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformLog = Logger;

/**
 * ADT Pulse Platform - Log status changes.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformLogStatusChangesOldCache = ADTPulsePlatformStateData;

export type ADTPulsePlatformLogStatusChangesNewCache = ADTPulsePlatformStateData;

export type ADTPulsePlatformLogStatusChangesReturns = Promise<void>;

/**
 * ADT Pulse Platform - Poll accessories.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformPollAccessoriesDevices = Devices;

export type ADTPulsePlatformPollAccessoriesReturns = Promise<void>;

/**
 * ADT Pulse Platform - Print system information.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformPrintSystemInformationReturns = void;

/**
 * ADT Pulse Platform - Remove accessory.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformRemoveAccessoryAccessory = PlatformAccessory<Device>;

export type ADTPulsePlatformRemoveAccessoryReason = string;

export type ADTPulsePlatformRemoveAccessoryReturns = void;

/**
 * ADT Pulse Platform - Service.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformService = typeof Service;

/**
 * ADT Pulse Platform - State.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformStateActivityIsAdtKeepingAlive = boolean;

export type ADTPulsePlatformStateActivityIsAdtSyncChecking = boolean;

export type ADTPulsePlatformStateActivityIsLoggingIn = boolean;

export type ADTPulsePlatformStateActivityIsSyncing = boolean;

export type ADTPulsePlatformStateActivity = {
  isAdtKeepingAlive: ADTPulsePlatformStateActivityIsAdtKeepingAlive;
  isAdtSyncChecking: ADTPulsePlatformStateActivityIsAdtSyncChecking;
  isLoggingIn: ADTPulsePlatformStateActivityIsLoggingIn;
  isSyncing: ADTPulsePlatformStateActivityIsSyncing;
};

export type ADTPulsePlatformStateDataGatewayInfo = GatewayInformation | null;

export type ADTPulsePlatformStateDataOrbSecurityButtons = OrbSecurityButtons;

export type ADTPulsePlatformStateDataPanelInfo = PanelInformation | null;

export type ADTPulsePlatformStateDataPanelStatus = PanelStatus | null;

export type ADTPulsePlatformStateDataSensorInfo = SensorInformation;

export type ADTPulsePlatformStateDataSensorsInfo = ADTPulsePlatformStateDataSensorInfo[];

export type ADTPulsePlatformStateDataSensorStatus = SensorStatus;

export type ADTPulsePlatformStateDataSensorsStatus = ADTPulsePlatformStateDataSensorStatus[];

export type ADTPulsePlatformStateDataSyncCode = PortalSyncCode;

export type ADTPulsePlatformStateData = {
  gatewayInfo: ADTPulsePlatformStateDataGatewayInfo;
  orbSecurityButtons: ADTPulsePlatformStateDataOrbSecurityButtons;
  panelInfo: ADTPulsePlatformStateDataPanelInfo;
  panelStatus: ADTPulsePlatformStateDataPanelStatus;
  sensorsInfo: ADTPulsePlatformStateDataSensorsInfo;
  sensorsStatus: ADTPulsePlatformStateDataSensorsStatus;
  syncCode: ADTPulsePlatformStateDataSyncCode;
};

export type ADTPulsePlatformStateEventCountersFailedLogins = number;

export type ADTPulsePlatformStateEventCounters = {
  failedLogins: ADTPulsePlatformStateEventCountersFailedLogins;
};

export type ADTPulsePlatformStateIntervalsSynchronize = NodeJS.Timeout | undefined;

export type ADTPulsePlatformStateIntervals = {
  synchronize: ADTPulsePlatformStateIntervalsSynchronize;
};

export type ADTPulsePlatformStateLastRunOnAdtKeepAlive = number;

export type ADTPulsePlatformStateLastRunOnAdtLastLogin = number;

export type ADTPulsePlatformStateLastRunOnAdtSyncCheck = number;

export type ADTPulsePlatformStateLastRunOn = {
  adtKeepAlive: ADTPulsePlatformStateLastRunOnAdtKeepAlive;
  adtLastLogin: ADTPulsePlatformStateLastRunOnAdtLastLogin;
  adtSyncCheck: ADTPulsePlatformStateLastRunOnAdtSyncCheck;
};

export type ADTPulsePlatformStateReportedHash = string;

export type ADTPulsePlatformStateReportedHashes = ADTPulsePlatformStateReportedHash[];

export type ADTPulsePlatformState = {
  activity: ADTPulsePlatformStateActivity;
  data: ADTPulsePlatformStateData;
  eventCounters: ADTPulsePlatformStateEventCounters;
  intervals: ADTPulsePlatformStateIntervals;
  lastRunOn: ADTPulsePlatformStateLastRunOn;
  reportedHashes: ADTPulsePlatformStateReportedHashes;
};

/**
 * ADT Pulse Platform - Synchronize.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformSynchronizeReturns = void;

/**
 * ADT Pulse Platform - Synchronize keep alive.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformSynchronizeKeepAliveReturns = void;

/**
 * ADT Pulse Platform - Synchronize sync check.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformSynchronizeSyncCheckReturns = void;

/**
 * ADT Pulse Platform - Unify devices.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformUnifyDevicesReturns = Promise<void>;

export type ADTPulsePlatformUnifyDevicesDevices = Devices;

export type ADTPulsePlatformUnifyDevicesId = PluginDeviceId;

/**
 * ADT Pulse Platform - Unknown information dispatcher.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformUnknownInformationDispatcherReturns = Promise<void>;

export type ADTPulsePlatformUnknownInformationDispatcherSensors = DetectPlatformUnknownSensorsActionSensors;

/**
 * ADT Pulse Platform - Update accessory.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformUpdateAccessoryDevice = Device;

export type ADTPulsePlatformUpdateAccessoryReturns = void;

/**
 * ADT Pulse Repl - Api.
 *
 * @since 1.0.0
 */
export type ADTPulseReplApi = ADTPulseAPI | undefined;

/**
 * ADT Pulse Repl - Auth.
 *
 * @since 1.0.0
 */
export type ADTPulseReplAuth = ADTPulseAuth | undefined;

/**
 * ADT Pulse Repl - Display help header.
 *
 * @since 1.0.0
 */
export type ADTPulseDisplayHelpHeaderReturns = void;

/**
 * ADT Pulse Repl - Display help menu.
 *
 * @since 1.0.0
 */
export type ADTPulseDisplayHelpMenuReturns = void;

/**
 * ADT Pulse Repl - Display startup header.
 *
 * @since 1.0.0
 */
export type ADTPulseDisplayStartupHeaderReturns = void;

/**
 * ADT Pulse Repl - Repl server.
 *
 * @since 1.0.0
 */
export type ADTPulseReplReplServer = repl.REPLServer | undefined;

/**
 * ADT Pulse Repl - Set api instance.
 *
 * @since 1.0.0
 */
export type ADTPulseReplSetApiInstanceSubdomain = unknown;

export type ADTPulseReplSetApiInstanceUsername = unknown;

export type ADTPulseReplSetApiInstancePassword = unknown;

export type ADTPulseReplSetApiInstanceFingerprint = unknown;

export type ADTPulseReplSetApiInstanceReturns = void;

/**
 * ADT Pulse Repl - Set auth instance.
 *
 * @since 1.0.0
 */
export type ADTPulseReplSetAuthInstanceSubdomain = unknown;

export type ADTPulseReplSetAuthInstanceUsername = unknown;

export type ADTPulseReplSetAuthInstancePassword = unknown;

export type ADTPulseReplSetAuthInstanceReturns = void;

/**
 * ADT Pulse Test - Ask question.
 *
 * @since 1.0.0
 */
export type ADTPulseTestAskQuestionMode = 'disclaimer';

export type ADTPulseTestAskQuestionReturns = Promise<boolean>;

/**
 * ADT Pulse Test - Find config.
 *
 * @since 1.0.0
 */
export type ADTPulseTestFindConfigReturns = boolean;

export type ADTPulseTestFindConfigPossibleLocation = string;

export type ADTPulseTestFindConfigPossibleLocations = ADTPulseTestFindConfigPossibleLocation[];

export type ADTPulseTestFindConfigParsedFile = unknown;

/**
 * ADT Pulse Test - Print test output.
 *
 * @since 1.0.0
 */
export type ADTPulseTestPrintTestOutputIsSuccess = boolean;

export type ADTPulseTestPrintTestOutputReturns = void;

/**
 * ADT Pulse Test - Selected config location.
 *
 * @since 1.0.0
 */
export type ADTPulseTestSelectedConfigLocation = string | undefined;

/**
 * ADT Pulse Test - Selected platform.
 *
 * @since 1.0.0
 */
export type ADTPulseTestSelectedPlatform = Config | undefined;

/**
 * ADT Pulse Test - Zod parse response.
 *
 * @since 1.0.0
 */
export type ADTPulseTestZodParseResponse = z.SafeParseReturnType<any, any> | undefined;

/**
 * Clear html line break.
 *
 * @since 1.0.0
 */
export type ClearHtmlLineBreakData = string;

export type ClearHtmlLineBreakReturns = string;

/**
 * Clear whitespace.
 *
 * @since 1.0.0
 */
export type ClearWhitespaceData = string;

export type ClearWhitespaceReturns = string;

/**
 * Collection do submit handlers.
 *
 * @since 1.0.0
 */
export type CollectionDoSubmitHandlerDescription = string;

export type CollectionDoSubmitHandlerHandlerHref = PortalPanelForceArmButtonHref;

export type CollectionDoSubmitHandlerHandler = {
  href: CollectionDoSubmitHandlerHandlerHref;
};

export type CollectionDoSubmitHandlerHandlers = CollectionDoSubmitHandlerHandler[];

export type CollectionDoSubmitHandler = {
  description: CollectionDoSubmitHandlerDescription;
  handlers: CollectionDoSubmitHandlerHandlers;
};

export type CollectionDoSubmitHandlers = CollectionDoSubmitHandler[];

/**
 * Collection orb security buttons.
 *
 * @since 1.0.0
 */
export type CollectionOrbSecurityButtonDescription = string;

export type CollectionOrbSecurityButtonButtonButtonDisabled = boolean;

export type CollectionOrbSecurityButtonButtonButtonText = PortalPanelArmButtonText | PortalPanelArmButtonLoadingText;

export type CollectionOrbSecurityButtonButtonLoadingText = PortalPanelArmButtonLoadingText | null;

export type CollectionOrbSecurityButtonButton = {
  buttonDisabled: CollectionOrbSecurityButtonButtonButtonDisabled;
  buttonText: CollectionOrbSecurityButtonButtonButtonText;
  loadingText: CollectionOrbSecurityButtonButtonLoadingText;
};

export type CollectionOrbSecurityButtonButtons = CollectionOrbSecurityButtonButton[];

export type CollectionOrbSecurityButton = {
  description: CollectionOrbSecurityButtonDescription;
  buttons: CollectionOrbSecurityButtonButtons;
};

export type CollectionOrbSecurityButtons = CollectionOrbSecurityButton[];

/**
 * Collection sensor actions.
 *
 * @since 1.0.0
 */
export type CollectionSensorActionType = PluginDeviceSensorType;

export type CollectionSensorActionStatus = string;

export type CollectionSensorActionStatuses = CollectionSensorActionStatus[];

export type CollectionSensorAction = {
  type: CollectionSensorActionType;
  statuses: CollectionSensorActionStatuses;
};

export type CollectionSensorActions = CollectionSensorAction[];

/**
 * Condense panel states.
 *
 * @since 1.0.0
 */
export type CondensePanelStatesCharacteristic = typeof Characteristic;

export type CondensePanelStatesPanelStates = PanelStatusStates;

export type CondensePanelStatesReturns = CondensePanelStatesCondensed;

export type CondensePanelStatesCondensedArmValue = PortalPanelArmValue;

export type CondensePanelStatesCondensedCharacteristicValueCurrent = CharacteristicValue;

export type CondensePanelStatesCondensedCharacteristicValueTarget = CharacteristicValue;

export type CondensePanelStatesCondensedCharacteristicValue = {
  current: CondensePanelStatesCondensedCharacteristicValueCurrent;
  target: CondensePanelStatesCondensedCharacteristicValueTarget;
};

export type CondensePanelStatesCondensed = {
  armValue: CondensePanelStatesCondensedArmValue;
  characteristicValue: CondensePanelStatesCondensedCharacteristicValue;
} | undefined;

/**
 * Condense sensor type.
 *
 * @since 1.0.0
 */
export type CondenseSensorTypeSensorType = PortalSensorDeviceType;

export type CondenseSensorTypeReturns = PluginDeviceSensorType | undefined;

export type CondenseSensorTypeCondensed = PluginDeviceSensorType | undefined;

/**
 * Convert panel characteristic value.
 *
 * @since 1.0.0
 */
export type ConvertPanelCharacteristicValueMode = 'current-to-target' | 'target-to-current';

export type ConvertPanelCharacteristicValueCharacteristic = typeof Characteristic;

export type ConvertPanelCharacteristicValueValue = CharacteristicValue;

export type ConvertPanelCharacteristicValueReturns = CharacteristicValue | undefined;

/**
 * Debug log.
 *
 * @since 1.0.0
 */
export type DebugLogLogger = Logger | null;

export type DebugLogCaller = `${string}.ts / ${string}()` | `${string}.tsx / ${string}()`;

export type DebugLogType = PluginLogLevel;

export type DebugLogMessage = string;

export type DebugLogReturns = void;

/**
 * Detect api do submit handlers.
 *
 * @since 1.0.0
 */
export type DetectApiDoSubmitHandlersHandlers = DoSubmitHandlers;

export type DetectApiDoSubmitHandlersLogger = Logger | null;

export type DetectApiDoSubmitHandlersDebugMode = boolean | null;

export type DetectApiDoSubmitHandlersReturns = Promise<boolean>;

/**
 * Detect api gateway information.
 *
 * @since 1.0.0
 */
export type DetectApiGatewayInformationDevice = GatewayInformation;

export type DetectApiGatewayInformationLogger = Logger | null;

export type DetectApiGatewayInformationDebugMode = boolean | null;

export type DetectApiGatewayInformationReturns = Promise<boolean>;

/**
 * Detect api orb security buttons.
 *
 * @since 1.0.0
 */
export type DetectApiOrbSecurityButtonsButtons = OrbSecurityButtons;

export type DetectApiOrbSecurityButtonsLogger = Logger | null;

export type DetectApiOrbSecurityButtonsDebugMode = boolean | null;

export type DetectApiOrbSecurityButtonsReturns = Promise<boolean>;

/**
 * Detect api panel information.
 *
 * @since 1.0.0
 */
export type DetectApiPanelInformationDevice = PanelInformation;

export type DetectApiPanelInformationLogger = Logger | null;

export type DetectApiPanelInformationDebugMode = boolean | null;

export type DetectApiPanelInformationReturns = Promise<boolean>;

/**
 * Detect api panel status.
 *
 * @since 1.0.0
 */
export type DetectApiPanelStatusSummary = PanelStatus;

export type DetectApiPanelStatusLogger = Logger | null;

export type DetectApiPanelStatusDebugMode = boolean | null;

export type DetectApiPanelStatusReturns = Promise<boolean>;

/**
 * Detect api sensors information.
 *
 * @since 1.0.0
 */
export type DetectApiSensorsInformationSensor = SensorInformation;

export type DetectApiSensorsInformationSensors = DetectApiSensorsInformationSensor[];

export type DetectApiSensorsInformationLogger = Logger | null;

export type DetectApiSensorsInformationDebugMode = boolean | null;

export type DetectApiSensorsInformationReturns = Promise<boolean>;

/**
 * Detect api sensors status.
 *
 * @since 1.0.0
 */
export type DetectApiSensorsStatusSensor = SensorStatus;

export type DetectApiSensorsStatusSensors = DetectApiSensorsStatusSensor[];

export type DetectApiSensorsStatusLogger = Logger | null;

export type DetectApiSensorsStatusDebugMode = boolean | null;

export type DetectApiSensorsStatusReturns = Promise<boolean>;

/**
 * Detect global debug parser.
 *
 * @since 1.0.0
 */
export type DetectGlobalDebugParserData = DebugParser<'forceArmHandler'> | DebugParser<'generateSensorsConfig'> | DebugParser<'getGatewayInformation'> | DebugParser<'getOrbSecurityButtons'> | DebugParser<'getPanelInformation'> | DebugParser<'getPanelStatus'> | DebugParser<'getSensorsInformation'> | DebugParser<'getSensorsStatus'>;

export type DetectGlobalDebugParserLogger = Logger | null;

export type DetectGlobalDebugParserDebugMode = boolean | null;

export type DetectGlobalDebugParserReturns = Promise<boolean>;

/**
 * Detect global portal version.
 *
 * @since 1.0.0
 */
export type DetectGlobalPortalVersionVersion = PortalVersionContent;

export type DetectGlobalPortalVersionLogger = Logger | null;

export type DetectGlobalPortalVersionDebugMode = boolean | null;

export type DetectGlobalPortalVersionReturns = Promise<boolean>;

/**
 * Detect platform unknown sensors action.
 *
 * @since 1.0.0
 */
export type DetectPlatformUnknownSensorsActionSensorInfo = SensorInformation;

export type DetectPlatformUnknownSensorsActionSensorStatus = SensorStatus;

export type DetectPlatformUnknownSensorsActionSensorType = PluginDeviceSensorType | undefined;

export type DetectPlatformUnknownSensorsActionSensor = {
  info: DetectPlatformUnknownSensorsActionSensorInfo;
  status: DetectPlatformUnknownSensorsActionSensorStatus;
  type: DetectPlatformUnknownSensorsActionSensorType;
};

export type DetectPlatformUnknownSensorsActionSensors = DetectPlatformUnknownSensorsActionSensor[];

export type DetectPlatformUnknownSensorsActionLogger = Logger | null;

export type DetectPlatformUnknownSensorsActionDebugMode = boolean | null;

export type DetectPlatformUnknownSensorsActionReturns = Promise<boolean>;

/**
 * Device gateways.
 *
 * @since 1.0.0
 */
export type DeviceGatewayDescription = string;

export type DeviceGatewayGatewayManufacturer = string | null;

export type DeviceGatewayGatewayModel = string | null;

export type DeviceGatewayGatewayPrimaryConnectionType = string | null;

export type DeviceGatewayGateway = {
  manufacturer: DeviceGatewayGatewayManufacturer;
  model: DeviceGatewayGatewayModel;
  primaryConnectionType: DeviceGatewayGatewayPrimaryConnectionType;
};

export type DeviceGateway = {
  description: DeviceGatewayDescription;
  gateway: DeviceGatewayGateway;
};

export type DeviceGateways = DeviceGateway[];

/**
 * Device security panels.
 *
 * @since 1.0.0
 */
export type DeviceSecurityPanelDescription = string;

export type DeviceSecurityPanelPanelManufacturerProvider = string | null;

export type DeviceSecurityPanelPanelTypeModel = string | null;

export type DeviceSecurityPanelPanel = {
  manufacturerProvider: DeviceSecurityPanelPanelManufacturerProvider;
  typeModel: DeviceSecurityPanelPanelTypeModel;
};

export type DeviceSecurityPanel = {
  description: DeviceSecurityPanelDescription;
  panel: DeviceSecurityPanelPanel;
};

export type DeviceSecurityPanels = DeviceSecurityPanel[];

/**
 * Fetch error message.
 *
 * @since 1.0.0
 */
export type FetchErrorMessageResponse = AxiosResponseNodeJs<unknown> | undefined;

export type FetchErrorMessageReturns = string | null;

/**
 * Fetch missing sat code.
 *
 * @since 1.0.0
 */
export type FetchMissingSatCodeResponse = AxiosResponseNodeJs<unknown>;

export type FetchMissingSatCodeReturns = UUID | null;

/**
 * Fetch table cells.
 *
 * @since 1.0.0
 */
export type FetchTableCellsNodeElements = NodeListOf<HTMLTableCellElement>;

export type FetchTableCellsMatchItem = string;

export type FetchTableCellsMatchItems = FetchTableCellsMatchItem[];

export type FetchTableCellsIncrementFrom = number;

export type FetchTableCellsIncrementTo = number;

export type FetchTableCellsReturns = Record<string, string[]>;

export type FetchTableCellsMatched = Record<string, string[]>;

/**
 * Find gateway manufacturer model.
 *
 * @since 1.0.0
 */
export type FindGatewayManufacturerModelMode = 'manufacturer' | 'model';

export type FindGatewayManufacturerModelManufacturer = string | null;

export type FindGatewayManufacturerModelModel = string | null;

export type FindGatewayManufacturerModelReturns = string | null;

/**
 * Find index with value.
 *
 * @since 1.0.0
 */
export type FindIndexWithValueArray<Value> = Value[];

export type FindIndexWithValueCondition<Value> = (value: Value) => boolean;

export type FindIndexWithValueReturnsIndex = number;

export type FindIndexWithValueReturnsValue<Value> = Value | undefined;

export type FindIndexWithValueReturns<Value> = {
  index: FindIndexWithValueReturnsIndex;
  value: FindIndexWithValueReturnsValue<Value>;
};

/**
 * Find null keys.
 *
 * @since 1.0.0
 */
export type FindNullKeysProperties = object;

export type FindNullKeysParentKey = string;

export type FindNullKeysReturns = string[];

export type FindNullKeysFound = string[];

/**
 * Find panel manufacturer.
 *
 * @since 1.0.0
 */
export type FindPanelManufacturerManufacturerProvider = string | null;

export type FindPanelManufacturerTypeModel = string | null;

export type FindPanelManufacturerReturns = string | null;

/**
 * Generate fake dynatrace pc header value.
 *
 * @since 1.0.0
 */
export type GenerateFakeDynatracePCHeaderValueMode = 'force-arm' | 'keep-alive' | 'multi-factor';

export type GenerateFakeDynatracePCHeaderValueReturns = string;

/**
 * Generate fake fingerprint fonts.
 *
 * @since 1.0.0
 */
export type GenerateFakeFingerprintFontsReturns = string[];

/**
 * Generate fake fingerprint plugins.
 *
 * @since 1.0.0
 */
export type GenerateFakeFingerprintPluginsReturns = string[];

/**
 * Generate fake fingerprint screen resolution.
 *
 * @since 1.0.0
 */
export type GenerateFakeFingerprintScreenResolutionReturnWidth = number;

export type GenerateFakeFingerprintScreenResolutionReturnHeight = number;

export type GenerateFakeFingerprintScreenResolutionReturns = {
  width: GenerateFakeFingerprintScreenResolutionReturnWidth;
  height: GenerateFakeFingerprintScreenResolutionReturnHeight;
};

/**
 * Generate fake fingerprint timezone.
 *
 * @since 1.0.0
 */
export type GenerateFakeFingerprintTimezoneReturnsTimezone = string;

export type GenerateFakeFingerprintTimezoneReturnsTimezoneOffset = number;

export type GenerateFakeFingerprintTimezoneReturns = {
  timezone: GenerateFakeFingerprintTimezoneReturnsTimezone;
  timezoneOffset: GenerateFakeFingerprintTimezoneReturnsTimezoneOffset;
};

/**
 * Generate fake fingerprint user agent.
 *
 * @since 1.0.0
 */
export type GenerateFakeFingerprintUserAgentReturnsBrowserMajor = string | null;

export type GenerateFakeFingerprintUserAgentReturnsBrowserName = string | null;

export type GenerateFakeFingerprintUserAgentReturnsBrowserVersion = string | null;

export type GenerateFakeFingerprintUserAgentReturnsBrowser = {
  major: GenerateFakeFingerprintUserAgentReturnsBrowserMajor;
  name: GenerateFakeFingerprintUserAgentReturnsBrowserName;
  version: GenerateFakeFingerprintUserAgentReturnsBrowserVersion;
};

export type GenerateFakeFingerprintUserAgentReturnsCpuArchitecture = string | null;

export type GenerateFakeFingerprintUserAgentReturnsCpu = {
  architecture: GenerateFakeFingerprintUserAgentReturnsCpuArchitecture;
};

export type GenerateFakeFingerprintUserAgentReturnsDeviceModel = string | null;

export type GenerateFakeFingerprintUserAgentReturnsDeviceType = string | null;

export type GenerateFakeFingerprintUserAgentReturnsDeviceVendor = string | null;

export type GenerateFakeFingerprintUserAgentReturnsDevice = {
  model: GenerateFakeFingerprintUserAgentReturnsDeviceModel;
  type: GenerateFakeFingerprintUserAgentReturnsDeviceType;
  vendor: GenerateFakeFingerprintUserAgentReturnsDeviceVendor;
};

export type GenerateFakeFingerprintUserAgentReturnsEngineName = string | null;

export type GenerateFakeFingerprintUserAgentReturnsEngineVersion = string | null;

export type GenerateFakeFingerprintUserAgentReturnsEngine = {
  name: GenerateFakeFingerprintUserAgentReturnsEngineName;
  version: GenerateFakeFingerprintUserAgentReturnsEngineVersion;
};

export type GenerateFakeFingerprintUserAgentReturnsOsName = string | null;

export type GenerateFakeFingerprintUserAgentReturnsOsVersion = string | null;

export type GenerateFakeFingerprintUserAgentReturnsOs = {
  name: GenerateFakeFingerprintUserAgentReturnsOsName;
  version: GenerateFakeFingerprintUserAgentReturnsOsVersion;
};

export type GenerateFakeFingerprintUserAgentReturnsPlatform = string | null;

export type GenerateFakeFingerprintUserAgentReturnsUa = string;

export type GenerateFakeFingerprintUserAgentReturns = {
  browser: GenerateFakeFingerprintUserAgentReturnsBrowser;
  cpu: GenerateFakeFingerprintUserAgentReturnsCpu;
  device: GenerateFakeFingerprintUserAgentReturnsDevice;
  engine: GenerateFakeFingerprintUserAgentReturnsEngine;
  os: GenerateFakeFingerprintUserAgentReturnsOs;
  platform: GenerateFakeFingerprintUserAgentReturnsPlatform;
  ua: GenerateFakeFingerprintUserAgentReturnsUa;
};

/**
 * Generate fake login fingerprint.
 *
 * @since 1.0.0
 */
export type GenerateFakeLoginFingerprintReturns = string;

/**
 * Generate fake ready buttons.
 *
 * @since 1.0.0
 */
export type GenerateFakeReadyButtonsButtons = OrbSecurityButtons;

export type GenerateFakeReadyButtonsIsCleanState = ADTPulseAPISessionIsCleanState;

export type GenerateFakeReadyButtonsOptionsRelativeUrl = PortalPanelArmButtonRelativeUrl;

export type GenerateFakeReadyButtonsOptionsHref = PortalPanelArmButtonHref;

export type GenerateFakeReadyButtonsOptionsSat = UUID;

export type GenerateFakeReadyButtonsOptions = {
  relativeUrl: GenerateFakeReadyButtonsOptionsRelativeUrl;
  href: GenerateFakeReadyButtonsOptionsHref;
  sat: GenerateFakeReadyButtonsOptionsSat;
};

export type GenerateFakeReadyButtonsReturns = (OrbSecurityButtonBase & OrbSecurityButtonReady)[];

export type GenerateFakeReadyButtonsReadyButtons = (OrbSecurityButtonBase & OrbSecurityButtonReady)[];

export type GenerateFakeReadyButtonsDisplayedButtonButtonText = PortalPanelArmButtonText;

export type GenerateFakeReadyButtonsDisplayedButtonLoadingText = PortalPanelArmButtonLoadingText;

export type GenerateFakeReadyButtonsDisplayedButtonArm = PortalPanelArmValue;

export type GenerateFakeReadyButtonsDisplayedButton = {
  buttonText: GenerateFakeReadyButtonsDisplayedButtonButtonText;
  loadingText: GenerateFakeReadyButtonsDisplayedButtonLoadingText;
  arm: GenerateFakeReadyButtonsDisplayedButtonArm;
};

export type GenerateFakeReadyButtonsDisplayedButtons = GenerateFakeReadyButtonsDisplayedButton[];

/**
 * Generate hash.
 *
 * @since 1.0.0
 */
export type GenerateHashData = object | object[];

export type GenerateHashReturns = string;

/**
 * Get accessory category.
 *
 * @since 1.0.0
 */
export type GetAccessoryCategoryDeviceCategory = PluginDeviceCategory;

export type GetAccessoryCategoryReturns = number;

/**
 * Get detect report url.
 *
 * @since 1.0.0
 */
export type GetDetectReportUrlReturns = `https://${string}.ntfy.mrjackyliang.com`;

/**
 * Get package version.
 *
 * @since 1.0.0
 */
export type GetPackageVersionReturns = string;

/**
 * Get plural form.
 *
 * @since 1.0.0
 */
export type GetPluralFormCount = number;

export type GetPluralFormSingular = string;

export type GetPluralFormPlural = string;

export type GetPluralFormReturns = string;

/**
 * Initialize.
 *
 * @since 1.0.0
 */
export type InitializeApi = API;

export type InitializeReturns = void;

/**
 * Is empty orb text summary.
 *
 * @since 1.0.0
 */
export type IsEmptyOrbTextSummaryInput = PanelStatus;

export type IsEmptyOrbTextSummaryReturns = boolean;

export type IsEmptyOrbTextSummaryMatch = PanelStatus;

/**
 * Is forward slash os.
 *
 * @since 1.0.0
 */
export type IsForwardSlashOSReturns = boolean;

/**
 * Is maintenance period.
 *
 * @since 1.0.0
 */
export type IsMaintenancePeriodReturns = boolean;

/**
 * Is panel alarm active.
 *
 * @since 1.0.0
 */
export type IsPanelAlarmActivePanelStatuses = PanelStatusStatuses;

export type IsPanelAlarmActiveOrbSecurityButtons = OrbSecurityButtons;

export type IsPanelAlarmActiveIgnoreSensorProblem = boolean;

export type IsPanelAlarmActiveReturns = boolean;

/**
 * Is plugin outdated.
 *
 * @since 1.0.0
 */
export type IsPluginOutdatedReturns = Promise<boolean>;

/**
 * Is portal sync code.
 *
 * @since 1.0.0
 */
export type IsPortalSyncCodeSyncCode = string;

export type IsPortalSyncCodeTypeGuard = PortalSyncCode;

/**
 * Is session clean state.
 *
 * @since 1.0.0
 */
export type IsSessionCleanStateOrbSecurityButtons = OrbSecurityButtons;

export type IsSessionCleanStateReturns = boolean;

export type IsSessionCleanStateReadyButton = OrbSecurityButtonBase & OrbSecurityButtonReady;

/**
 * Is unknown do submit handler collection.
 *
 * @since 1.0.0
 */
export type IsUnknownDoSubmitHandlerCollectionHandlers = DoSubmitHandlers;

export type IsUnknownDoSubmitHandlerCollectionReturns = boolean;

/**
 * Is unknown gateway device.
 *
 * @since 1.0.0
 */
export type IsUnknownGatewayDeviceGateway = Record<string, string[]>;

export type IsUnknownGatewayDeviceReturns = boolean;

/**
 * Is unknown orb security button collection.
 *
 * @since 1.0.0
 */
export type IsUnknownOrbSecurityButtonCollectionButtons = OrbSecurityButtons;

export type IsUnknownOrbSecurityButtonCollectionReturns = boolean;

/**
 * Is unknown panel device.
 *
 * @since 1.0.0
 */
export type IsUnknownPanelDevicePanel = Record<string, string[]>;

export type IsUnknownPanelDeviceReturns = boolean;

/**
 * Item condensed sensor types.
 *
 * @since 1.0.0
 */
export type ItemCondensedSensorType = PluginDeviceSensorType;

export type ItemCondensedSensorTypes = ItemCondensedSensorType[];

/**
 * Item do submit handler relative urls.
 *
 * @since 1.0.0
 */
export type ItemDoSubmitHandlerRelativeUrl = PortalPanelForceArmButtonRelativeUrl;

export type ItemDoSubmitHandlerRelativeUrls = ItemDoSubmitHandlerRelativeUrl[];

/**
 * Item do submit handler url params arm states.
 *
 * @since 1.0.0
 */
export type ItemDoSubmitHandlerUrlParamsArmState = PortalPanelArmStateForce;

export type ItemDoSubmitHandlerUrlParamsArmStates = ItemDoSubmitHandlerUrlParamsArmState[];

/**
 * Item do submit handler url params arms.
 *
 * @since 1.0.0
 */
export type ItemDoSubmitHandlerUrlParamsArm = Exclude<PortalPanelArmValue, 'off'>;

export type ItemDoSubmitHandlerUrlParamsArms = ItemDoSubmitHandlerUrlParamsArm[];

/**
 * Item do submit handler url params hrefs.
 *
 * @since 1.0.0
 */
export type ItemDoSubmitHandlerUrlParamsHref = PortalPanelForceArmButtonHref;

export type ItemDoSubmitHandlerUrlParamsHrefs = ItemDoSubmitHandlerUrlParamsHref[];

/**
 * Item gateway information statuses.
 *
 * @since 1.0.0
 */
export type ItemGatewayInformationStatus = PortalDeviceGatewayStatus;

export type ItemGatewayInformationStatuses = ItemGatewayInformationStatus[];

/**
 * Item orb security button button texts.
 *
 * @since 1.0.0
 */
export type ItemOrbSecurityButtonButtonText = PortalPanelArmButtonText;

export type ItemOrbSecurityButtonButtonTexts = ItemOrbSecurityButtonButtonText[];

/**
 * Item orb security button loading texts.
 *
 * @since 1.0.0
 */
export type ItemOrbSecurityButtonLoadingText = PortalPanelArmButtonLoadingText;

export type ItemOrbSecurityButtonLoadingTexts = ItemOrbSecurityButtonLoadingText[];

/**
 * Item orb security button relative urls.
 *
 * @since 1.0.0
 */
export type ItemOrbSecurityButtonRelativeUrl = PortalPanelArmButtonRelativeUrl;

export type ItemOrbSecurityButtonRelativeUrls = ItemOrbSecurityButtonRelativeUrl[];

/**
 * Item orb security button url params arm states.
 *
 * @since 1.0.0
 */
export type ItemOrbSecurityButtonUrlParamsArmState = PortalPanelArmStateClean | PortalPanelArmStateDirty;

export type ItemOrbSecurityButtonUrlParamsArmStates = ItemOrbSecurityButtonUrlParamsArmState[];

/**
 * Item orb security button url params arms.
 *
 * @since 1.0.0
 */
export type ItemOrbSecurityButtonUrlParamsArm = PortalPanelArmValue;

export type ItemOrbSecurityButtonUrlParamsArms = ItemOrbSecurityButtonUrlParamsArm[];

/**
 * Item orb security button url params hrefs.
 *
 * @since 1.0.0
 */
export type ItemOrbSecurityButtonUrlParamsHref = PortalPanelArmButtonHref;

export type ItemOrbSecurityButtonUrlParamsHrefs = ItemOrbSecurityButtonUrlParamsHref[];

/**
 * Item panel information statuses.
 *
 * @since 1.0.0
 */
export type ItemPanelInformationStatus = PortalDevicePanelStatus;

export type ItemPanelInformationStatuses = ItemPanelInformationStatus[];

/**
 * Item panel status notes.
 *
 * @since 1.0.0
 */
export type ItemPanelStatusNote = PortalPanelNote;

export type ItemPanelStatusNotes = ItemPanelStatusNote[];

/**
 * Item panel status states.
 *
 * @since 1.0.0
 */
export type ItemPanelStatusState = PortalPanelState;

export type ItemPanelStatusStates = ItemPanelStatusState[];

/**
 * Item panel status statuses.
 *
 * @since 1.0.0
 */
export type ItemPanelStatusStatus = PortalPanelStatus;

export type ItemPanelStatusStatuses = ItemPanelStatusStatus[];

export type ItemPanelStatusStatusesSensorsOpen = `${number} Sensors Open`;

/**
 * Item portal versions.
 *
 * @since 1.0.0
 */
export type ItemPortalVersion = PortalVersion;

export type ItemPortalVersions = ItemPortalVersion[];

/**
 * Item sensor information device types.
 *
 * @since 1.0.0
 */
export type ItemSensorInformationDeviceType = PortalSensorDeviceType;

export type ItemSensorInformationDeviceTypes = ItemSensorInformationDeviceType[];

/**
 * Item sensor information statuses.
 *
 * @since 1.0.0
 */
export type ItemSensorInformationStatus = PortalDeviceSensorStatus;

export type ItemSensorInformationStatuses = ItemSensorInformationStatus[];

/**
 * Item sensor status icons.
 *
 * @since 1.0.0
 */
export type ItemSensorStatusIcon = PortalSensorStatusIcon;

export type ItemSensorStatusIcons = ItemSensorStatusIcon[];

/**
 * Item sensor status statuses.
 *
 * @since 1.0.0
 */
export type ItemSensorStatusStatus = PortalSensorStatusText;

export type ItemSensorStatusStatuses = ItemSensorStatusStatus[];

/**
 * Parse arm disarm message.
 *
 * @since 1.0.0
 */
export type ParseArmDisarmMessageElement = Element | null;

export type ParseArmDisarmMessageReturns = string | null;

/**
 * Parse do submit handlers.
 *
 * @since 1.0.0
 */
export type ParseDoSubmitHandlersElements = NodeListOf<Element>;

export type ParseDoSubmitHandlersReturns = DoSubmitHandlers;

export type ParseDoSubmitHandlersHandlers = DoSubmitHandlers;

export type ParseDoSubmitHandlersRelativeUrl = PortalPanelForceArmButtonRelativeUrl;

export type ParseDoSubmitHandlersUrlParamsHref = PortalPanelForceArmButtonHref;

export type ParseDoSubmitHandlersUrlParamsArmState = PortalPanelArmStateForce | '';

export type ParseDoSubmitHandlersUrlParamsArm = Exclude<PortalPanelArmValue, 'off'> | '';

/**
 * Parse multi factor methods.
 *
 * @since 1.0.0
 */
export type ParseMultiFactorMethodsResponse = z.infer<typeof multiFactorAuth>;

export type ParseMultiFactorMethodsReturns = MfaDevice[];

export type ParseMultiFactorMethodsMethods = MfaDevice[];

/**
 * Parse multi factor trusted devices.
 *
 * @since 1.0.0
 */
export type ParseMultiFactorTrustedDevicesResponse = z.infer<typeof multiFactorAuth>;

export type ParseMultiFactorTrustedDevicesReturns = MfaTrustedDevice[];

export type ParseMultiFactorTrustedDevicesDevices = MfaTrustedDevice[];

/**
 * Parse orb sensors.
 *
 * @since 1.0.0
 */
export type ParseOrbSensorsElements = NodeListOf<Element>;

export type ParseOrbSensorsReturns = SensorStatus[];

export type ParseOrbSensorsSensors = SensorStatus[];

export type ParseOrbSensorsCleanedIcon = PortalSensorStatusIcon;

export type ParseOrbSensorsCleanedStatus = PortalSensorStatusText;

export type ParseOrbSensorsCleanedStatuses = ParseOrbSensorsCleanedStatus[];

/**
 * Parse orb text summary.
 *
 * @since 1.0.0
 */
export type ParseOrbTextSummaryElement = Element | null;

export type ParseOrbTextSummaryReturns = PanelStatus;

export type ParseOrbTextSummaryFinalParsed = PanelStatus;

export type ParseOrbTextSummaryStateItem = PortalPanelState;

export type ParseOrbTextSummaryStatusItem = PortalPanelStatus;

export type ParseOrbTextSummaryNoteItem = PortalPanelNote;

/**
 * Parse orb security buttons.
 *
 * @since 1.0.0
 */
export type ParseOrbSecurityButtonsElements = NodeListOf<Element>;

export type ParseOrbSecurityButtonsReturns = OrbSecurityButtons;

export type ParseOrbSecurityButtonsButtons = OrbSecurityButtons;

export type ParseOrbSecurityButtonsButtonId = PortalPanelArmButtonId | null;

export type ParseOrbSecurityButtonsPendingButtonText = PortalPanelArmButtonLoadingText | null;

export type ParseOrbSecurityButtonsReadyButtonText = PortalPanelArmButtonText | null;

export type ParseOrbSecurityButtonsRelativeUrl = PortalPanelArmButtonRelativeUrl;

export type ParseOrbSecurityButtonsLoadingText = PortalPanelArmButtonLoadingText;

export type ParseOrbSecurityButtonsHref = PortalPanelArmButtonHref;

export type ParseOrbSecurityButtonsArmState = PortalPanelArmStateClean | PortalPanelArmStateDirty;

export type ParseOrbSecurityButtonsArm = PortalPanelArmValue;

/**
 * Parse sensors table.
 *
 * @since 1.0.0
 */
export type ParseOrbSensorsTableType = 'sensors-config' | 'sensors-information';

export type ParseOrbSensorsTableElements = NodeListOf<Element>;

export type ParseOrbSensorsTableReturns<Type extends ParseOrbSensorsTableType> =
  Type extends 'sensors-config' ? SensorConfig[]
    : Type extends 'sensors-information' ? SensorInformation[]
      : never;

export type ParseOrbSensorsTableSensors<Type extends ParseOrbSensorsTableType> =
  Type extends 'sensors-config' ? SensorConfig[]
    : Type extends 'sensors-information' ? SensorInformation[]
      : never;

export type ParseOrbSensorsTableDeviceType = PortalSensorDeviceType;

export type ParseOrbSensorsTableStatus = PortalDeviceSensorStatus;

/**
 * Remove personal identifiable information.
 *
 * @since 1.0.0
 */
export type RemovePersonalIdentifiableInformationModifiedObject = Record<string, unknown>;

export type RemovePersonalIdentifiableInformationData = RemovePersonalIdentifiableInformationModifiedObject | RemovePersonalIdentifiableInformationModifiedObject[];

export type RemovePersonalIdentifiableInformationReturns = RemovePersonalIdentifiableInformationModifiedObject | RemovePersonalIdentifiableInformationModifiedObject[];

export type RemovePersonalIdentifiableInformationReplaceValueObject = RemovePersonalIdentifiableInformationModifiedObject;

export type RemovePersonalIdentifiableInformationReplaceValueReturns = RemovePersonalIdentifiableInformationModifiedObject;

/**
 * Sleep.
 *
 * @since 1.0.0
 */
export type SleepMilliseconds = number;

export type SleepReturns = Promise<void>;

/**
 * Stack tracer.
 *
 * @since 1.0.0
 */
export type StackTracerType = 'api-response' | 'config-content' | 'detect-content' | 'fake-ready-buttons' | 'log-status-changes' | 'serialize-error' | 'zod-error';

export type StackTracerError<Type extends StackTracerType> =
  Type extends 'api-response' ? ApiResponseFail<any>
    : Type extends 'config-content' ? unknown
      : Type extends 'detect-content' ? Record<string, unknown> | Record<string, unknown>[]
        : Type extends 'fake-ready-buttons' ? { before: OrbSecurityButtons; after: OrbSecurityButtonBase & OrbSecurityButtonReady; }
          : Type extends 'log-status-changes' ? { old: SensorInformation[]; new: SensorInformation[]; }
            : Type extends 'serialize-error' ? ErrorObject
              : Type extends 'zod-error' ? z.ZodIssue[]
                : never;

export type StackTracerReturns = void;
