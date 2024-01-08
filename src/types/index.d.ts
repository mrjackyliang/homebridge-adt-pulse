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
import type { BinaryLike } from 'node:crypto';
import type repl from 'node:repl';
import type { ErrorObject } from 'serialize-error';
import type z from 'zod';

import type { ADTPulseAccessory } from '@/lib/accessory.js';
import type { ADTPulse } from '@/lib/api.js';
import type { platformConfig } from '@/lib/schema.js';
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
  Config,
  Device,
  Devices,
  DoSubmitHandlers,
  GatewayInformation,
  InternalConfig,
  NetworkId,
  OrbSecurityButtonBase,
  OrbSecurityButtonReady,
  OrbSecurityButtons,
  PanelInformation,
  PanelStatus,
  PanelStatusStates,
  PortalVersionContent,
  SensorInformation,
  SensorsInformation,
  SensorsStatus,
  SensorStatus,
  Sessions,
  UUID,
} from '@/types/shared.d.ts';

/**
 * ADT Pulse - Arm disarm handler.
 *
 * @since 1.0.0
 */
export type ADTPulseArmDisarmHandlerRelativeUrl = PortalPanelArmButtonRelativeUrl;

export type ADTPulseArmDisarmHandlerHref = PortalPanelArmButtonHref;

export type ADTPulseArmDisarmHandlerArmState = PortalPanelArmStateClean | PortalPanelArmStateDirty;

export type ADTPulseArmDisarmHandlerArm = PortalPanelArmValue;

export type ADTPulseArmDisarmHandlerSat = UUID;

export type ADTPulseArmDisarmHandlerReturnsInfoForceArmRequired = boolean;

export type ADTPulseArmDisarmHandlerReturnsInfoReadyButton = OrbSecurityButtonBase & OrbSecurityButtonReady;

export type ADTPulseArmDisarmHandlerReturnsInfoReadyButtons = ADTPulseArmDisarmHandlerReturnsInfoReadyButton[];

export type ADTPulseArmDisarmHandlerReturnsInfo = {
  forceArmRequired: ADTPulseArmDisarmHandlerReturnsInfoForceArmRequired;
  readyButtons: ADTPulseArmDisarmHandlerReturnsInfoReadyButtons;
};

export type ADTPulseArmDisarmHandlerReturns = Promise<ApiResponse<'ARM_DISARM_HANDLER', ADTPulseArmDisarmHandlerReturnsInfo>>;

export type ADTPulseArmDisarmHandlerSessions = Sessions<{
  axiosSetArmMode?: AxiosResponseNodeJs<unknown>;
  axiosSummary?: AxiosResponseNodeJs<unknown>;
  jsdomSummary?: JSDOM;
}>;

export type ADTPulseArmDisarmHandlerReadyButton = OrbSecurityButtonBase & OrbSecurityButtonReady;

/**
 * ADT Pulse - Constructor.
 *
 * @since 1.0.0
 */
export type ADTPulseConstructorConfig = Config;

export type ADTPulseConstructorInternalConfig = InternalConfig;

/**
 * ADT Pulse - Credentials.
 *
 * @since 1.0.0
 */
export type ADTPulseCredentialsFingerprint = string;

export type ADTPulseCredentialsPassword = string;

export type ADTPulseCredentialsSubdomain = PortalSubdomain;

export type ADTPulseCredentialsUsername = string;

export type ADTPulseCredentials = {
  fingerprint: ADTPulseCredentialsFingerprint;
  password: ADTPulseCredentialsPassword;
  subdomain: ADTPulseCredentialsSubdomain;
  username: ADTPulseCredentialsUsername;
};

/**
 * ADT Pulse - Force arm handler.
 *
 * @since 1.0.0
 */
export type ADTPulseForceArmHandlerResponse = AxiosResponseNodeJs<unknown>;

export type ADTPulseForceArmHandlerRelativeUrl = PortalPanelArmButtonRelativeUrl;

export type ADTPulseForceArmHandlerReturnsInfoForceArmRequired = boolean;

export type ADTPulseForceArmHandlerReturnsInfo = {
  forceArmRequired: ADTPulseForceArmHandlerReturnsInfoForceArmRequired;
};

export type ADTPulseForceArmHandlerReturns = Promise<ApiResponse<'FORCE_ARM_HANDLER', ADTPulseForceArmHandlerReturnsInfo>>;

export type ADTPulseForceArmHandlerSessions = Sessions<{
  axiosForceArm?: AxiosResponseNodeJs<unknown>;
  jsdomArmDisarm?: JSDOM;
}>;

export type ADTPulseForceArmHandlerTrackerComplete = boolean;

export type ADTPulseForceArmHandlerTrackerErrorMessage = string | null;

export type ADTPulseForceArmHandlerTrackerRequestUrl = string | null;

export type ADTPulseForceArmHandlerTracker = {
  complete: ADTPulseForceArmHandlerTrackerComplete;
  errorMessage: ADTPulseForceArmHandlerTrackerErrorMessage;
  requestUrl: ADTPulseForceArmHandlerTrackerRequestUrl;
};

/**
 * ADT Pulse - Get gateway information.
 *
 * @since 1.0.0
 */
export type ADTPulseGetGatewayInformationReturnsInfo = GatewayInformation;

export type ADTPulseGetGatewayInformationReturns = Promise<ApiResponse<'GET_GATEWAY_INFORMATION', ADTPulseGetGatewayInformationReturnsInfo>>;

export type ADTPulseGetGatewayInformationSessions = Sessions<{
  axiosSystemGateway?: AxiosResponseNodeJs<unknown>;
  jsdomSystemGateway?: JSDOM;
}>;

export type ADTPulseGetGatewayInformationReturnsStatus = PortalDeviceGatewayStatus | null;

/**
 * ADT Pulse - Get panel information.
 *
 * @since 1.0.0
 */
export type ADTPulseGetPanelInformationReturnsInfo = PanelInformation;

export type ADTPulseGetPanelInformationReturns = Promise<ApiResponse<'GET_PANEL_INFORMATION', ADTPulseGetPanelInformationReturnsInfo>>;

export type ADTPulseGetPanelInformationSessions = Sessions<{
  axiosSystemDeviceId1?: AxiosResponseNodeJs<unknown>;
  jsdomSystemDeviceId1?: JSDOM;
}>;

export type ADTPulseGetPanelInformationReturnsStatus = PortalDevicePanelStatus | null;

/**
 * ADT Pulse - Get panel status.
 *
 * @since 1.0.0
 */
export type ADTPulseGetPanelStatusReturnsInfo = PanelStatus;

export type ADTPulseGetPanelStatusReturns = Promise<ApiResponse<'GET_PANEL_STATUS', ADTPulseGetPanelStatusReturnsInfo>>;

export type ADTPulseGetPanelStatusSessions = Sessions<{
  axiosSummary?: AxiosResponseNodeJs<unknown>;
  jsdomSummary?: JSDOM;
}>;

/**
 * ADT Pulse - Get request config.
 *
 * @since 1.0.0
 */
export type ADTPulseGetRequestConfigExtraConfig = AxiosRequestConfig;

export type ADTPulseGetRequestConfigReturns = AxiosRequestConfig;

export type ADTPulseGetRequestConfigDefaultConfig = AxiosRequestConfig;

/**
 * ADT Pulse - Get sensors information.
 *
 * @since 1.0.0
 */
export type ADTPulseGetSensorsInformationReturnsInfoSensors = SensorsInformation;

export type ADTPulseGetSensorsInformationReturnsInfo = {
  sensors: ADTPulseGetSensorsInformationReturnsInfoSensors;
};

export type ADTPulseGetSensorsInformationReturns = Promise<ApiResponse<'GET_SENSORS_INFORMATION', ADTPulseGetSensorsInformationReturnsInfo>>;

export type ADTPulseGetSensorsInformationSessions = Sessions<{
  axiosSystem?: AxiosResponseNodeJs<unknown>;
  jsdomSystem?: JSDOM;
}>;

/**
 * ADT Pulse - Get sensors status.
 *
 * @since 1.0.0
 */
export type ADTPulseGetSensorsStatusReturnsInfoSensors = SensorsStatus;

export type ADTPulseGetSensorsStatusReturnsInfo = {
  sensors: ADTPulseGetSensorsStatusReturnsInfoSensors;
};

export type ADTPulseGetSensorsStatusReturns = Promise<ApiResponse<'GET_SENSORS_STATUS', ADTPulseGetSensorsStatusReturnsInfo>>;

export type ADTPulseGetSensorsStatusSessions = Sessions<{
  axiosSummary?: AxiosResponseNodeJs<unknown>;
  jsdomSummary?: JSDOM;
}>;

/**
 * ADT Pulse - Handle login failure.
 *
 * @since 1.0.0
 */
export type ADTPulseHandleLoginFailureRequestPath = string | null;

export type ADTPulseHandleLoginFailureSession = AxiosResponseNodeJs<unknown> | undefined;

export type ADTPulseHandleLoginFailureReturns = void;

/**
 * ADT Pulse - Internal.
 *
 * @since 1.0.0
 */
export type ADTPulseInternalBaseUrl = `https://${string}`;

export type ADTPulseInternalDebug = boolean;

export type ADTPulseInternalLogger = Logger | null;

export type ADTPulseInternalReportedHash = string;

export type ADTPulseInternalReportedHashes = ADTPulseInternalReportedHash[];

export type ADTPulseInternalTestModeEnabled = boolean;

export type ADTPulseInternalTestModeIsSystemDisarmedBeforeTest = boolean;

export type ADTPulseInternalTestMode = {
  enabled: ADTPulseInternalTestModeEnabled;
  isSystemDisarmedBeforeTest: ADTPulseInternalTestModeIsSystemDisarmedBeforeTest;
};

export type ADTPulseInternalWaitTimeAfterArm = number;

export type ADTPulseInternal = {
  baseUrl: ADTPulseInternalBaseUrl;
  debug: ADTPulseInternalDebug;
  logger: ADTPulseInternalLogger;
  reportedHashes: ADTPulseInternalReportedHashes;
  testMode: ADTPulseInternalTestMode;
  waitTimeAfterArm: ADTPulseInternalWaitTimeAfterArm;
};

/**
 * ADT Pulse - Is authenticated.
 *
 * @since 1.0.0
 */
export type ADTPulseIsAuthenticatedReturns = boolean;

/**
 * ADT Pulse - Login.
 *
 * @since 1.0.0
 */
export type ADTPulseLoginReturnsInfoBackupSatCode = UUID | null;

export type ADTPulseLoginReturnsInfoNetworkId = NetworkId | null;

export type ADTPulseLoginReturnsInfoPortalVersion = PortalVersion | null;

export type ADTPulseLoginReturnsInfo = {
  backupSatCode: ADTPulseLoginReturnsInfoBackupSatCode;
  networkId: ADTPulseLoginReturnsInfoNetworkId;
  portalVersion: ADTPulseLoginReturnsInfoPortalVersion;
};

export type ADTPulseLoginReturns = Promise<ApiResponse<'LOGIN', ADTPulseLoginReturnsInfo>>;

export type ADTPulseLoginSessions = Sessions<{
  axiosIndex?: AxiosResponseNodeJs<unknown>;
  axiosSignin?: AxiosResponseNodeJs<unknown>;
}>;

export type ADTPulseLoginPortalVersion = PortalVersion;

/**
 * ADT Pulse - Logout.
 *
 * @since 1.0.0
 */
export type ADTPulseLogoutReturnsInfoBackupSatCode = UUID | null;

export type ADTPulseLogoutReturnsInfoNetworkId = NetworkId | null;

export type ADTPulseLogoutReturnsInfoPortalVersion = PortalVersion | null;

export type ADTPulseLogoutReturnsInfo = {
  backupSatCode: ADTPulseLogoutReturnsInfoBackupSatCode;
  networkId: ADTPulseLogoutReturnsInfoNetworkId;
  portalVersion: ADTPulseLogoutReturnsInfoPortalVersion;
};

export type ADTPulseLogoutReturns = Promise<ApiResponse<'LOGOUT', ADTPulseLogoutReturnsInfo>>;

export type ADTPulseLogoutSessions = Sessions<{
  axiosSignout?: AxiosResponseNodeJs<unknown>;
}>;

/**
 * ADT Pulse - New information dispatcher.
 *
 * @since 1.0.0
 */
export type ADTPulseNewInformationDispatcherType = 'do-submit-handlers' | 'gateway-information' | 'orb-security-buttons' | 'panel-information' | 'panel-status' | 'portal-version' | 'sensors-information' | 'sensors-status';

export type ADTPulseNewInformationDispatcherData<Type extends ADTPulseNewInformationDispatcherType> =
  Type extends 'do-submit-handlers' ? DoSubmitHandlers
    : Type extends 'gateway-information' ? GatewayInformation
      : Type extends 'orb-security-buttons' ? OrbSecurityButtons
        : Type extends 'panel-information' ? PanelInformation
          : Type extends 'panel-status' ? PanelStatus
            : Type extends 'portal-version' ? PortalVersionContent
              : Type extends 'sensors-information' ? SensorsInformation
                : Type extends 'sensors-status' ? SensorsStatus
                  : never;

export type ADTPulseNewInformationDispatcherReturns = Promise<void>;

/**
 * ADT Pulse - Perform keep alive.
 *
 * @since 1.0.0
 */
export type ADTPulsePerformKeepAliveReturnsInfo = null;

export type ADTPulsePerformKeepAliveReturns = Promise<ApiResponse<'PERFORM_KEEP_ALIVE', ADTPulsePerformKeepAliveReturnsInfo>>;

export type ADTPulsePerformKeepAliveSessions = Sessions<{
  axiosKeepAlive?: AxiosResponseNodeJs<unknown>;
}>;

/**
 * ADT Pulse - Perform sync check.
 *
 * @since 1.0.0
 */
export type ADTPulsePerformSyncCheckReturnsInfoSyncCode = PortalSyncCode;

export type ADTPulsePerformSyncCheckReturnsInfo = {
  syncCode: ADTPulsePerformSyncCheckReturnsInfoSyncCode;
};

export type ADTPulsePerformSyncCheckReturns = Promise<ApiResponse<'PERFORM_SYNC_CHECK', ADTPulsePerformSyncCheckReturnsInfo>>;

export type ADTPulsePerformSyncCheckSessions = Sessions<{
  axiosSyncCheck?: AxiosResponseNodeJs<unknown>;
}>;

/**
 * ADT Pulse - Reset session.
 *
 * @since 1.0.0
 */
export type ADTPulseResetSessionReturns = void;

/**
 * ADT Pulse - Session.
 *
 * @since 1.0.0
 */
export type ADTPulseSessionBackupSatCode = UUID | null;

export type ADTPulseSessionHttpClient = AxiosInstance;

export type ADTPulseSessionIsAuthenticated = boolean;

export type ADTPulseSessionIsCleanState = boolean;

export type ADTPulseSessionNetworkId = NetworkId | null;

export type ADTPulseSessionPortalVersion = PortalVersion | null;

export type ADTPulseSession = {
  backupSatCode: ADTPulseSessionBackupSatCode;
  httpClient: ADTPulseSessionHttpClient;
  isAuthenticated: ADTPulseSessionIsAuthenticated;
  isCleanState: ADTPulseSessionIsCleanState;
  networkId: ADTPulseSessionNetworkId;
  portalVersion: ADTPulseSessionPortalVersion;
};

/**
 * ADT Pulse - Set panel status.
 *
 * @since 1.0.0
 */
export type ADTPulseSetPanelStatusArmFrom = PortalPanelArmValue;

export type ADTPulseSetPanelStatusArmTo = PortalPanelArmValue;

export type ADTPulseSetPanelStatusReturnsInfoForceArmRequired = boolean;

export type ADTPulseSetPanelStatusReturnsInfo = {
  forceArmRequired: ADTPulseSetPanelStatusReturnsInfoForceArmRequired;
};

export type ADTPulseSetPanelStatusReturns = Promise<ApiResponse<'SET_PANEL_STATUS', ADTPulseSetPanelStatusReturnsInfo>>;

export type ADTPulseSetPanelStatusSessions = Sessions<{
  axiosSummary?: AxiosResponseNodeJs<unknown>;
  jsdomSummary?: JSDOM;
}>;

export type ADTPulseSetPanelStatusReadyButton = OrbSecurityButtonBase & OrbSecurityButtonReady;

/**
 * ADT Pulse Accessory - Accessory.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryAccessory = PlatformAccessory<Device>;

/**
 * ADT Pulse Accessory - Api.
 *
 * @private
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
 * ADT Pulse Accessory - Constructor.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryConstructorAccessory = PlatformAccessory<Device>;

export type ADTPulseAccessoryConstructorState = ADTPulsePlatformState;

export type ADTPulseAccessoryConstructorInstance = ADTPulse;

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

export type ADTPulseAccessoryGetPanelStatusContext = Device;

export type ADTPulseAccessoryGetPanelStatusReturns = Error | HapStatusError | Nullable<CharacteristicValue>;

/**
 * ADT Pulse Accessory - Set panel status.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessorySetPanelStatusArm = CharacteristicValue;

export type ADTPulseAccessorySetPanelStatusContext = Device;

export type ADTPulseAccessorySetPanelStatusReturns = Promise<void>;

/**
 * ADT Pulse Accessory - Get sensor status.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryGetSensorStatusMode = 'active' | 'fault' | 'lowBattery' | 'status' | 'tamper';

export type ADTPulseAccessoryGetSensorStatusContext = Device;

export type ADTPulseAccessoryGetSensorStatusReturns = HapStatusError | Nullable<CharacteristicValue>;

/**
 * ADT Pulse Accessory - Instance.
 *
 * @private
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryInstance = ADTPulse;

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
export type ADTPulseAccessoryServices = {
  [key: string]: Service | undefined;
};

/**
 * ADT Pulse Accessory - State.
 *
 * @since 1.0.0
 */
export type ADTPulseAccessoryState = ADTPulsePlatformState;

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

export type ADTPulsePlatformAddAccessoryTypedNewAccessory = PlatformAccessory<Device>;

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

export type ADTPulsePlatformConstantsTimestampsAdtSyncCheck = number;

export type ADTPulsePlatformConstantsTimestampsSuspendSyncing = number;

export type ADTPulsePlatformConstantsTimestampsSynchronize = number;

export type ADTPulsePlatformConstantsTimestamps = {
  adtKeepAlive: ADTPulsePlatformConstantsTimestampsAdtKeepAlive;
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
export type ADTPulsePlatformHandlers = {
  [key: string]: ADTPulseAccessory;
};

/**
 * ADT Pulse Platform - Instance.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformInstance = ADTPulse | null;

/**
 * ADT Pulse Platform - Log.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformLog = Logger;

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

export type ADTPulsePlatformStateDataPanelInfo = PanelInformation | null;

export type ADTPulsePlatformStateDataPanelStatus = PanelStatus | null;

export type ADTPulsePlatformStateDataSensorsInfo = SensorsInformation;

export type ADTPulsePlatformStateDataSensorsStatus = SensorsStatus;

export type ADTPulsePlatformStateDataSyncCode = PortalSyncCode;

export type ADTPulsePlatformStateData = {
  gatewayInfo: ADTPulsePlatformStateDataGatewayInfo;
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

export type ADTPulsePlatformStateLastRunOnAdtSyncCheck = number;

export type ADTPulsePlatformStateLastRunOn = {
  adtKeepAlive: ADTPulsePlatformStateLastRunOnAdtKeepAlive;
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
export type ADTPulseReplApi = ADTPulse | undefined;

/**
 * ADT Pulse Repl - Color log.
 *
 * @since 1.0.0
 */
export type ADTPulseReplColorLogType = Extract<PluginLogLevel, 'error' | 'info'>;

export type ADTPulseReplColorLogMessage = string;

export type ADTPulseReplColorLogReturns = void;

/**
 * ADT Pulse Repl - Display help menu.
 *
 * @since 1.0.0
 */
export type ADTPulseDisplayHelpMenuReturns = void;

/**
 * ADT Pulse Repl - Display help header.
 *
 * @since 1.0.0
 */
export type ADTPulseDisplayHelpHeaderReturns = void;

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
 * ADT Pulse Repl - Set instance.
 *
 * @since 1.0.0
 */
export type ADTPulseReplSetInstanceSubdomain = unknown;

export type ADTPulseReplSetInstanceUsername = unknown;

export type ADTPulseReplSetInstancePassword = unknown;

export type ADTPulseReplSetInstanceFingerprint = unknown;

export type ADTPulseReplSetInstanceReturns = void;

/**
 * ADT Pulse Repl - Start repl.
 *
 * @since 1.0.0
 */
export type ADTPulseReplStartReplReturns = Promise<void>;

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
 * ADT Pulse Test - Start test.
 *
 * @since 1.0.0
 */
export type ADTPulseTestStartTestReturns = Promise<void>;

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
 * Condense panel states.
 *
 * @since 1.0.0
 */
export type CondensePanelStatesPanelStates = PanelStatusStates;

export type CondensePanelStatesReturns = PortalPanelArmValue | undefined;

export type CondensePanelStatesCondensed = PortalPanelArmValue | undefined;

/**
 * Condensed sensor type items.
 *
 * @since 1.0.0
 */
export type CondensedSensorTypeItem = PluginDeviceSensorType;

export type CondensedSensorTypeItems = CondensedSensorTypeItem[];

/**
 * Condense sensor type.
 *
 * @since 1.0.0
 */
export type CondenseSensorTypeSensorType = PortalSensorDeviceType;

export type CondenseSensorTypeReturns = PluginDeviceSensorType | undefined;

export type CondenseSensorTypeCondensed = PluginDeviceSensorType | undefined;

/**
 * Debug log.
 *
 * @since 1.0.0
 */
export type DebugLogLogger = Logger | null;

export type DebugLogCaller = string;

export type DebugLogType = PluginLogLevel;

export type DebugLogMessage = string;

export type DebugLogReturns = void;

/**
 * Detected new do submit handlers.
 *
 * @since 1.0.0
 */
export type DetectedNewDoSubmitHandlersHandlers = DoSubmitHandlers;

export type DetectedNewDoSubmitHandlersLogger = Logger | null;

export type DetectedNewDoSubmitHandlersDebugMode = boolean | null;

export type DetectedNewDoSubmitHandlersReturns = Promise<boolean>;

/**
 * Detected new gateway information.
 *
 * @since 1.0.0
 */
export type DetectedNewGatewayInformationDevice = GatewayInformation;

export type DetectedNewGatewayInformationLogger = Logger | null;

export type DetectedNewGatewayInformationDebugMode = boolean | null;

export type DetectedNewGatewayInformationReturns = Promise<boolean>;

/**
 * Detected new orb security buttons.
 *
 * @since 1.0.0
 */
export type DetectedNewOrbSecurityButtonsButtons = OrbSecurityButtons;

export type DetectedNewOrbSecurityButtonsLogger = Logger | null;

export type DetectedNewOrbSecurityButtonsDebugMode = boolean | null;

export type DetectedNewOrbSecurityButtonsReturns = Promise<boolean>;

/**
 * Detected new panel information.
 *
 * @since 1.0.0
 */
export type DetectedNewPanelInformationDevice = PanelInformation;

export type DetectedNewPanelInformationLogger = Logger | null;

export type DetectedNewPanelInformationDebugMode = boolean | null;

export type DetectedNewPanelInformationReturns = Promise<boolean>;

/**
 * Detected new panel status.
 *
 * @since 1.0.0
 */
export type DetectedNewPanelStatusSummary = PanelStatus;

export type DetectedNewPanelStatusLogger = Logger | null;

export type DetectedNewPanelStatusDebugMode = boolean | null;

export type DetectedNewPanelStatusReturns = Promise<boolean>;

/**
 * Detected new portal version.
 *
 * @since 1.0.0
 */
export type DetectedNewPortalVersionVersion = PortalVersionContent;

export type DetectedNewPortalVersionLogger = Logger | null;

export type DetectedNewPortalVersionDebugMode = boolean | null;

export type DetectedNewPortalVersionReturns = Promise<boolean>;

/**
 * Detected new sensors information.
 *
 * @since 1.0.0
 */
export type DetectedNewSensorsInformationSensors = SensorsInformation;

export type DetectedNewSensorsInformationLogger = Logger | null;

export type DetectedNewSensorsInformationDebugMode = boolean | null;

export type DetectedNewSensorsInformationReturns = Promise<boolean>;

/**
 * Detected new sensors status.
 *
 * @since 1.0.0
 */
export type DetectedNewSensorsStatusSensors = SensorsStatus;

export type DetectedNewSensorsStatusLogger = Logger | null;

export type DetectedNewSensorsStatusDebugMode = boolean | null;

export type DetectedNewSensorsStatusReturns = Promise<boolean>;

/**
 * Detected unknown sensors action.
 *
 * @since 1.0.0
 */
export type DetectedUnknownSensorsActionSensorInfo = SensorInformation;

export type DetectedUnknownSensorsActionSensorStatus = SensorStatus;

export type DetectedUnknownSensorsActionSensorType = PluginDeviceSensorType | undefined;

export type DetectedUnknownSensorsActionSensor = {
  info: DetectedUnknownSensorsActionSensorInfo;
  status: DetectedUnknownSensorsActionSensorStatus;
  type: DetectedUnknownSensorsActionSensorType;
};

export type DetectedUnknownSensorsActionSensors = DetectedUnknownSensorsActionSensor[];

export type DetectedUnknownSensorsActionLogger = Logger | null;

export type DetectedUnknownSensorsActionDebugMode = boolean | null;

export type DetectedUnknownSensorsActionReturns = Promise<boolean>;

/**
 * Do submit handler relative url items.
 *
 * @since 1.0.0
 */
export type DoSubmitHandlerRelativeUrlItem = PortalPanelForceArmButtonRelativeUrl;

export type DoSubmitHandlerRelativeUrlItems = DoSubmitHandlerRelativeUrlItem[];

/**
 * Do submit handler url params arm items.
 *
 * @since 1.0.0
 */
export type DoSubmitHandlerUrlParamsArmItem = Exclude<PortalPanelArmValue, 'off'>;

export type DoSubmitHandlerUrlParamsArmItems = DoSubmitHandlerUrlParamsArmItem[];

/**
 * Do submit handler url params arm state items.
 *
 * @since 1.0.0
 */
export type DoSubmitHandlerUrlParamsArmStateItem = PortalPanelArmStateForce;

export type DoSubmitHandlerUrlParamsArmStateItems = DoSubmitHandlerUrlParamsArmStateItem[];

/**
 * Do submit handler url params href items.
 *
 * @since 1.0.0
 */
export type DoSubmitHandlerUrlParamsHrefItem = PortalPanelForceArmButtonHref;

export type DoSubmitHandlerUrlParamsHrefItems = DoSubmitHandlerUrlParamsHrefItem[];

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

export type FetchTableCellsReturns = {
  [key: string]: string[];
};

export type FetchTableCellsMatched = {
  [key: string]: string[];
};

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
 * Gateway information status items.
 *
 * @since 1.0.0
 */
export type GatewayInformationStatusItem = PortalDeviceGatewayStatus;

export type GatewayInformationStatusItems = GatewayInformationStatusItem[];

/**
 * Generate dynatrace pc header value.
 *
 * @since 1.0.0
 */
export type GenerateDynatracePCHeaderValueMode = 'keep-alive' | 'force-arm';

export type GenerateDynatracePCHeaderValueReturns = string;

/**
 * Generate hash.
 *
 * @since 1.0.0
 */
export type GenerateHashData = BinaryLike;

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
 * Is forward slash os.
 *
 * @since 1.0.0
 */
export type IsForwardSlashOSReturns = boolean;

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

export type IsPortalSyncCodeVerifiedSyncCode = PortalSyncCode;

/**
 * Orb security button button text items.
 *
 * @since 1.0.0
 */
export type OrbSecurityButtonButtonTextItem = PortalPanelArmButtonText;

export type OrbSecurityButtonButtonTextItems = OrbSecurityButtonButtonTextItem[];

/**
 * Orb security button loading text items.
 *
 * @since 1.0.0
 */
export type OrbSecurityButtonLoadingTextItem = PortalPanelArmButtonLoadingText;

export type OrbSecurityButtonLoadingTextItems = OrbSecurityButtonLoadingTextItem[];

/**
 * Orb security button relative url items.
 *
 * @since 1.0.0
 */
export type OrbSecurityButtonRelativeUrlItem = PortalPanelArmButtonRelativeUrl;

export type OrbSecurityButtonRelativeUrlItems = OrbSecurityButtonRelativeUrlItem[];

/**
 * Orb security button url params arm items.
 *
 * @since 1.0.0
 */
export type OrbSecurityButtonUrlParamsArmItem = PortalPanelArmValue;

export type OrbSecurityButtonUrlParamsArmItems = OrbSecurityButtonUrlParamsArmItem[];

/**
 * Orb security button url params arm state items.
 *
 * @since 1.0.0
 */
export type OrbSecurityButtonUrlParamsArmStateItem = PortalPanelArmStateClean | PortalPanelArmStateDirty;

export type OrbSecurityButtonUrlParamsArmStateItems = OrbSecurityButtonUrlParamsArmStateItem[];

/**
 * Orb security button url params href items.
 *
 * @since 1.0.0
 */
export type OrbSecurityButtonUrlParamsHrefItem = PortalPanelArmButtonHref;

export type OrbSecurityButtonUrlParamsHrefItems = OrbSecurityButtonUrlParamsHrefItem[];

/**
 * Panel information status items.
 *
 * @since 1.0.0
 */
export type PanelInformationStatusItem = PortalDevicePanelStatus;

export type PanelInformationStatusItems = PanelInformationStatusItem[];

/**
 * Panel status note items.
 *
 * @since 1.0.0
 */
export type PanelStatusNoteItem = PortalPanelNote;

export type PanelStatusNoteItems = PanelStatusNoteItem[];

/**
 * Panel status state items.
 *
 * @since 1.0.0
 */
export type PanelStatusStateItem = PortalPanelState;

export type PanelStatusStateItems = PanelStatusStateItem[];

/**
 * Panel status status items.
 *
 * @since 1.0.0
 */
export type PanelStatusStatusItem = PortalPanelStatus;

export type PanelStatusStatusItems = PanelStatusStatusItem[];

export type PanelStatusStatusItemsSensorsOpen = `${number} Sensors Open`;

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
 * Parse orb sensors.
 *
 * @since 1.0.0
 */
export type ParseOrbSensorsElements = NodeListOf<Element>;

export type ParseOrbSensorsReturns = SensorsStatus;

export type ParseOrbSensorsSensors = SensorsStatus;

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
export type ParseOrbSensorsTableElements = NodeListOf<Element>;

export type ParseOrbSensorsTableReturns = SensorsInformation;

export type ParseOrbSensorsTableSensors = SensorsInformation;

export type ParseOrbSensorsTableDeviceType = PortalSensorDeviceType;

export type ParseOrbSensorsTableStatus = PortalDeviceSensorStatus;

/**
 * Portal version items.
 *
 * @since 1.0.0
 */
export type PortalVersionItem = PortalVersion;

export type PortalVersionItems = PortalVersionItem[];

/**
 * Remove personal identifiable information.
 *
 * @since 1.0.0
 */
export type RemovePersonalIdentifiableInformationModifiedObject = {
  [key: string]: unknown;
};

export type RemovePersonalIdentifiableInformationData = RemovePersonalIdentifiableInformationModifiedObject | RemovePersonalIdentifiableInformationModifiedObject[];

export type RemovePersonalIdentifiableInformationReturns = RemovePersonalIdentifiableInformationModifiedObject | RemovePersonalIdentifiableInformationModifiedObject[];

export type RemovePersonalIdentifiableInformationReplaceValueObject = RemovePersonalIdentifiableInformationModifiedObject;

export type RemovePersonalIdentifiableInformationReplaceValueReturns = RemovePersonalIdentifiableInformationModifiedObject;

/**
 * Sensor action items.
 *
 * @since 1.0.0
 */
export type SensorActionItemType = PluginDeviceSensorType;

export type SensorActionItemStatus = string;

export type SensorActionItemStatuses = SensorActionItemStatus[];

export type SensorActionItem = {
  type: SensorActionItemType;
  statuses: SensorActionItemStatuses;
};

export type SensorActionItems = SensorActionItem[];

/**
 * Sensor information device type items.
 *
 * @since 1.0.0
 */
export type SensorInformationDeviceTypeItem = PortalSensorDeviceType;

export type SensorInformationDeviceTypeItems = SensorInformationDeviceTypeItem[];

/**
 * Sensor information status items.
 *
 * @since 1.0.0
 */
export type SensorInformationStatusItem = PortalDeviceSensorStatus;

export type SensorInformationStatusItems = SensorInformationStatusItem[];

/**
 * Sensor status icon items.
 *
 * @since 1.0.0
 */
export type SensorStatusIconItem = PortalSensorStatusIcon;

export type SensorStatusIconItems = SensorStatusIconItem[];

/**
 * Sensor status status items.
 *
 * @since 1.0.0
 */
export type SensorStatusStatusItem = PortalSensorStatusText;

export type SensorStatusStatusItems = SensorStatusStatusItem[];

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
export type StackTracerType = 'api-response' | 'detect-content' | 'sensor-mismatch' | 'serialize-error' | 'zod-error';

export type StackTracerError<Type extends StackTracerType> =
  Type extends 'api-response' ? ApiResponseFail<any>
    : Type extends 'detect-content' ? object
      : Type extends 'sensor-mismatch' ? object
        : Type extends 'serialize-error' ? ErrorObject
          : Type extends 'zod-error' ? z.ZodIssue[]
            : never;

export type StackTracerReturns = void;
