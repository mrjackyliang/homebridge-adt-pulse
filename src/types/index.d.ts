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
  DebugParser,
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
  PanelStatusStatuses,
  PortalVersionContent,
  SensorInformation,
  SensorStatus,
  Sessions,
  UUID,
} from '@/types/shared.d.ts';

/**
 * ADT Pulse - Arm disarm handler.
 *
 * @since 1.0.0
 */
export type ADTPulseArmDisarmHandlerIsAlarmActive = boolean;

export type ADTPulseArmDisarmHandlerOptionsRelativeUrl = PortalPanelArmButtonRelativeUrl;

export type ADTPulseArmDisarmHandlerOptionsHref = PortalPanelArmButtonHref;

export type ADTPulseArmDisarmHandlerOptionsArmState = PortalPanelArmStateClean | PortalPanelArmStateDirty;

export type ADTPulseArmDisarmHandlerOptionsArm = PortalPanelArmValue;

export type ADTPulseArmDisarmHandlerOptionsSat = UUID;

export type ADTPulseArmDisarmHandlerOptions = {
  relativeUrl: ADTPulseArmDisarmHandlerOptionsRelativeUrl;
  href: ADTPulseArmDisarmHandlerOptionsHref;
  armState: ADTPulseArmDisarmHandlerOptionsArmState;
  arm: ADTPulseArmDisarmHandlerOptionsArm;
  sat: ADTPulseArmDisarmHandlerOptionsSat;
};

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
export type ADTPulseGetSensorsInformationReturnsInfoSensor = SensorInformation;

export type ADTPulseGetSensorsInformationReturnsInfoSensors = ADTPulseGetSensorsInformationReturnsInfoSensor[];

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
export type ADTPulseGetSensorsStatusReturnsInfoSensor = SensorStatus;

export type ADTPulseGetSensorsStatusReturnsInfoSensors = ADTPulseGetSensorsStatusReturnsInfoSensor[];

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
export type ADTPulseNewInformationDispatcherType = 'debug-parser' | 'do-submit-handlers' | 'gateway-information' | 'orb-security-buttons' | 'panel-information' | 'panel-status' | 'portal-version' | 'sensors-information' | 'sensors-status';

export type ADTPulseNewInformationDispatcherData<Type extends ADTPulseNewInformationDispatcherType> =
  Type extends 'debug-parser' ? DebugParser<'armDisarmHandler'> | DebugParser<'forceArmHandler'> | DebugParser<'getGatewayInformation'> | DebugParser<'getPanelInformation'> | DebugParser<'getPanelStatus'> | DebugParser<'getSensorsInformation'> | DebugParser<'getSensorsStatus'> | DebugParser<'setPanelStatus'>
    : Type extends 'do-submit-handlers' ? DoSubmitHandlers
      : Type extends 'gateway-information' ? GatewayInformation
        : Type extends 'orb-security-buttons' ? OrbSecurityButtons
          : Type extends 'panel-information' ? PanelInformation
            : Type extends 'panel-status' ? PanelStatus
              : Type extends 'portal-version' ? PortalVersionContent
                : Type extends 'sensors-information' ? SensorInformation[]
                  : Type extends 'sensors-status' ? SensorStatus[]
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

export type ADTPulseSetPanelStatusIsAlarmActive = boolean;

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
export type ADTPulsePlatformInstance = ADTPulse | null;

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

export type ADTPulsePlatformStateDataPanelInfo = PanelInformation | null;

export type ADTPulsePlatformStateDataPanelStatus = PanelStatus | null;

export type ADTPulsePlatformStateDataSensorInfo = SensorInformation;

export type ADTPulsePlatformStateDataSensorsInfo = ADTPulsePlatformStateDataSensorInfo[];

export type ADTPulsePlatformStateDataSensorStatus = SensorStatus;

export type ADTPulsePlatformStateDataSensorsStatus = ADTPulsePlatformStateDataSensorStatus[];

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
 * Collection do submit handlers.
 *
 * @since 1.0.0
 */
export type CollectionDoSubmitHandlerHandlerHref = PortalPanelForceArmButtonHref;

export type CollectionDoSubmitHandlerHandler = {
  href: CollectionDoSubmitHandlerHandlerHref;
};

export type CollectionDoSubmitHandler = CollectionDoSubmitHandlerHandler[];

export type CollectionDoSubmitHandlers = CollectionDoSubmitHandler[];

/**
 * Collection orb security buttons.
 *
 * @since 1.0.0
 */
export type CollectionOrbSecurityButtonButtonButtonDisabled = boolean;

export type CollectionOrbSecurityButtonButtonButtonText = PortalPanelArmButtonText | PortalPanelArmButtonLoadingText;

export type CollectionOrbSecurityButtonButtonLoadingText = PortalPanelArmButtonLoadingText;

export type CollectionOrbSecurityButtonButton = {
  buttonDisabled: CollectionOrbSecurityButtonButtonButtonDisabled;
  buttonText: CollectionOrbSecurityButtonButtonButtonText;
  loadingText: CollectionOrbSecurityButtonButtonLoadingText;
};

export type CollectionOrbSecurityButton = CollectionOrbSecurityButtonButton[];

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

export type DebugLogCaller = string;

export type DebugLogType = PluginLogLevel;

export type DebugLogMessage = string;

export type DebugLogReturns = void;

/**
 * Detect api debug parser.
 *
 * @since 1.0.0
 */
export type DetectApiDebugParserData = DebugParser<'armDisarmHandler'> | DebugParser<'forceArmHandler'> | DebugParser<'getGatewayInformation'> | DebugParser<'getPanelInformation'> | DebugParser<'getPanelStatus'> | DebugParser<'getSensorsInformation'> | DebugParser<'getSensorsStatus'> | DebugParser<'setPanelStatus'>;

export type DetectApiDebugParserLogger = Logger | null;

export type DetectApiDebugParserDebugMode = boolean | null;

export type DetectApiDebugParserReturns = Promise<boolean>;

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
 * Detect api portal version.
 *
 * @since 1.0.0
 */
export type DetectApiPortalVersionVersion = PortalVersionContent;

export type DetectApiPortalVersionLogger = Logger | null;

export type DetectApiPortalVersionDebugMode = boolean | null;

export type DetectApiPortalVersionReturns = Promise<boolean>;

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
 * Detect platform sensor count mismatch.
 *
 * @since 1.0.0
 */
export type DetectPlatformSensorCountMismatchDataSensorInfo = SensorInformation;

export type DetectPlatformSensorCountMismatchDataSensorsInfo = DetectPlatformSensorCountMismatchDataSensorInfo[];

export type DetectPlatformSensorCountMismatchDataSensorStatus = SensorStatus;

export type DetectPlatformSensorCountMismatchDataSensorsStatus = DetectPlatformSensorCountMismatchDataSensorStatus[];

export type DetectPlatformSensorCountMismatchData = {
  sensorsInfo: DetectPlatformSensorCountMismatchDataSensorsInfo;
  sensorsStatus: DetectPlatformSensorCountMismatchDataSensorsStatus;
};

export type DetectPlatformSensorCountMismatchLogger = Logger | null;

export type DetectPlatformSensorCountMismatchDebugMode = boolean | null;

export type DetectPlatformSensorCountMismatchReturns = Promise<boolean>;

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
export type DeviceGatewayBroadbandConnectionStatus = string | null;

export type DeviceGatewayCellularConnectionStatus = string | null;

export type DeviceGatewayCellularSignalStrength = string | null;

export type DeviceGatewayFirmwareVersion = string | null;

export type DeviceGatewayHardwareVersion = string | null;

export type DeviceGatewayManufacturer = string | null;

export type DeviceGatewayModel = string | null;

export type DeviceGatewayPrimaryConnectionType = string | null;

export type DeviceGateway = {
  broadbandConnectionStatus: DeviceGatewayBroadbandConnectionStatus;
  cellularConnectionStatus: DeviceGatewayCellularConnectionStatus;
  cellularSignalStrength: DeviceGatewayCellularSignalStrength;
  firmwareVersion: DeviceGatewayFirmwareVersion;
  hardwareVersion: DeviceGatewayHardwareVersion;
  manufacturer: DeviceGatewayManufacturer;
  model: DeviceGatewayModel;
  primaryConnectionType: DeviceGatewayPrimaryConnectionType;
};

export type DeviceGateways = DeviceGateway[];

/**
 * Device security panels.
 *
 * @since 1.0.0
 */
export type DeviceSecurityPanelEmergencyKeys = string | null;

export type DeviceSecurityPanelManufacturerProvider = string | null;

export type DeviceSecurityPanelTypeModel = string | null;

export type DeviceSecurityPanel = {
  emergencyKeys: DeviceSecurityPanelEmergencyKeys;
  manufacturerProvider: DeviceSecurityPanelManufacturerProvider;
  typeModel: DeviceSecurityPanelTypeModel;
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
 * Generate dynatrace pc header value.
 *
 * @since 1.0.0
 */
export type GenerateDynatracePCHeaderValueMode = 'keep-alive' | 'force-arm';

export type GenerateDynatracePCHeaderValueReturns = string;

/**
 * Generate fake ready buttons.
 *
 * @since 1.0.0
 */
export type GenerateFakeReadyButtonsButtons = OrbSecurityButtons;

export type GenerateFakeReadyButtonsIsCleanState = ADTPulseSessionIsCleanState;

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
 * Is panel alarm active.
 *
 * @since 1.0.0
 */
export type IsPanelAlarmActivePanelStatuses = PanelStatusStatuses;

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
export type ParseOrbSensorsTableElements = NodeListOf<Element>;

export type ParseOrbSensorsTableReturns = SensorInformation[];

export type ParseOrbSensorsTableSensors = SensorInformation[];

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
