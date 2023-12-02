import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  API,
  Characteristic,
  DynamicPlatformPlugin,
  Logger,
  PlatformAccessory,
  PlatformConfig,
  Service,
} from 'homebridge';
import type { ErrorObject } from 'serialize-error';

import type {
  ApiResponse,
  ArmActions,
  ArmStates,
  Config,
  ConfigDebug,
  ConfigFingerprint,
  ConfigPassword,
  ConfigSensors,
  ConfigSubdomain,
  ConfigUsername,
  DoSubmitHandlers,
  InternalConfig,
  NullKeysLocations,
  OrbSecurityButtonReady,
  OrbSecurityButtons,
  OrbTextSummary,
  Sensors,
  Sessions,
  SyncCode,
  TableCellsWithSurroundingData,
  UUID,
} from './shared';

/**
 * ADT Pulse - Arm disarm handler.
 *
 * @since 1.0.0
 */
export type ADTPulseArmDisarmHandlerRelativeUrl = string;

export type ADTPulseArmDisarmHandlerHref = string;

export type ADTPulseArmDisarmHandlerArmState = ArmStates;

export type ADTPulseArmDisarmHandlerArm = ArmActions;

export type ADTPulseArmDisarmHandlerSat = UUID;

export type ADTPulseArmDisarmHandlerReturnsInfoNewReadyButtons = OrbSecurityButtonReady[];

export type ADTPulseArmDisarmHandlerReturnsInfo = {
  newReadyButtons: ADTPulseArmDisarmHandlerReturnsInfoNewReadyButtons;
};

export type ADTPulseArmDisarmHandlerReturns = Promise<ApiResponse<'ARM_DISARM_HANDLER', ADTPulseArmDisarmHandlerReturnsInfo>>;

export type ADTPulseArmDisarmHandlerSessions = Sessions<true, true>;

export type ADTPulseArmDisarmHandlerReadyButton = OrbSecurityButtonReady;

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
export type ADTPulseCredentialsFingerprint = ConfigFingerprint;

export type ADTPulseCredentialsPassword = ConfigPassword;

export type ADTPulseCredentialsSubdomain = ConfigSubdomain;

export type ADTPulseCredentialsUsername = ConfigUsername;

export type ADTPulseCredentials = {
  fingerprint: ADTPulseCredentialsFingerprint;
  password: ADTPulseCredentialsPassword;
  subdomain: ADTPulseCredentialsSubdomain;
  username: ADTPulseCredentialsUsername;
};

/**
 * ADT Pulse - Fetch error message.
 *
 * @since 1.0.0
 */
export type ADTPulseFetchErrorMessageResponse = AxiosResponse;

export type ADTPulseFetchErrorMessageReturns = string | null;

export type ADTPulseFetchErrorMessageSessions = Sessions<false, true>;

/**
 * ADT Pulse - Force arm handler.
 *
 * @since 1.0.0
 */
export type ADTPulseForceArmHandlerResponse = AxiosResponse;

export type ADTPulseForceArmHandlerRelativeUrl = string;

export type ADTPulseForceArmHandlerReturnsInfo = null;

export type ADTPulseForceArmHandlerReturns = Promise<ApiResponse<'FORCE_ARM_HANDLER', ADTPulseForceArmHandlerReturnsInfo>>;

export type ADTPulseForceArmHandlerSessions = Sessions<true, true>;

export type ADTPulseForceArmHandlerTrackerComplete = boolean;

export type ADTPulseForceArmHandlerTrackerErrorMessage = string | null;

export type ADTPulseForceArmHandlerTracker = {
  complete: ADTPulseForceArmHandlerTrackerComplete;
  errorMessage: ADTPulseForceArmHandlerTrackerErrorMessage;
};

/**
 * ADT Pulse - Get gateway information.
 *
 * @since 1.0.0
 */
export type ADTPulseGetGatewayInformationReturnsInfoManufacturer = string | null;

export type ADTPulseGetGatewayInformationReturnsInfoModel = string | null;

export type ADTPulseGetGatewayInformationReturnsInfoNetworkBroadbandIp = string | null;

export type ADTPulseGetGatewayInformationReturnsInfoNetworkBroadbandMac = string | null;

export type ADTPulseGetGatewayInformationReturnsInfoNetworkBroadband = {
  ip: ADTPulseGetGatewayInformationReturnsInfoNetworkBroadbandIp;
  mac: ADTPulseGetGatewayInformationReturnsInfoNetworkBroadbandMac;
};

export type ADTPulseGetGatewayInformationReturnsInfoNetworkDeviceIp = string | null;

export type ADTPulseGetGatewayInformationReturnsInfoNetworkDeviceMac = string | null;

export type ADTPulseGetGatewayInformationReturnsInfoNetworkDevice = {
  ip: ADTPulseGetGatewayInformationReturnsInfoNetworkDeviceIp;
  mac: ADTPulseGetGatewayInformationReturnsInfoNetworkDeviceMac;
};

export type ADTPulseGetGatewayInformationReturnsInfoNetwork = {
  broadband: ADTPulseGetGatewayInformationReturnsInfoNetworkBroadband;
  device: ADTPulseGetGatewayInformationReturnsInfoNetworkDevice;
};

export type ADTPulseGetGatewayInformationReturnsInfoSerialNumber = string | null;

export type ADTPulseGetGatewayInformationReturnsInfoStatus = string | null;

export type ADTPulseGetGatewayInformationReturnsInfoUpdateLast = string | null;

export type ADTPulseGetGatewayInformationReturnsInfoUpdateNext = string | null;

export type ADTPulseGetGatewayInformationReturnsInfoUpdate = {
  last: ADTPulseGetGatewayInformationReturnsInfoUpdateLast;
  next: ADTPulseGetGatewayInformationReturnsInfoUpdateNext;
};

export type ADTPulseGetGatewayInformationReturnsInfoVersionsFirmware = string | null;

export type ADTPulseGetGatewayInformationReturnsInfoVersionsHardware = string | null;

export type ADTPulseGetGatewayInformationReturnsInfoVersions = {
  firmware: ADTPulseGetGatewayInformationReturnsInfoVersionsFirmware;
  hardware: ADTPulseGetGatewayInformationReturnsInfoVersionsHardware;
};

export type ADTPulseGetGatewayInformationReturnsInfo = {
  manufacturer: ADTPulseGetGatewayInformationReturnsInfoManufacturer;
  model: ADTPulseGetGatewayInformationReturnsInfoModel;
  network: ADTPulseGetGatewayInformationReturnsInfoNetwork;
  serialNumber: ADTPulseGetGatewayInformationReturnsInfoSerialNumber;
  status: ADTPulseGetGatewayInformationReturnsInfoStatus;
  update: ADTPulseGetGatewayInformationReturnsInfoUpdate;
  versions: ADTPulseGetGatewayInformationReturnsInfoVersions;
};

export type ADTPulseGetGatewayInformationReturns = Promise<ApiResponse<'GET_GATEWAY_INFORMATION', ADTPulseGetGatewayInformationReturnsInfo>>;

export type ADTPulseGetGatewayInformationSessions = Sessions<true, true>;

/**
 * ADT Pulse - Get panel information.
 *
 * @since 1.0.0
 */
export type ADTPulseGetPanelInformationReturnsInfoEmergencyKeys = RegExpMatchArray | null;

export type ADTPulseGetPanelInformationReturnsInfoManufacturerProvider = string | null;

export type ADTPulseGetPanelInformationReturnsInfoTypeModel = string | null;

export type ADTPulseGetPanelInformationReturnsInfoStatus = string | null;

export type ADTPulseGetPanelInformationReturnsInfo = {
  emergencyKeys: ADTPulseGetPanelInformationReturnsInfoEmergencyKeys;
  manufacturerProvider: ADTPulseGetPanelInformationReturnsInfoManufacturerProvider;
  typeModel: ADTPulseGetPanelInformationReturnsInfoTypeModel;
  status: ADTPulseGetPanelInformationReturnsInfoStatus;
};

export type ADTPulseGetPanelInformationReturns = Promise<ApiResponse<'GET_PANEL_INFORMATION', ADTPulseGetPanelInformationReturnsInfo>>;

export type ADTPulseGetPanelInformationSessions = Sessions<true, true>;

/**
 * ADT Pulse - Get panel status.
 *
 * @since 1.0.0
 */
export type ADTPulseGetPanelStatusReturnsInfo = OrbTextSummary;

export type ADTPulseGetPanelStatusReturns = Promise<ApiResponse<'GET_PANEL_STATUS', ADTPulseGetPanelStatusReturnsInfo>>;

export type ADTPulseGetPanelStatusSessions = Sessions<true, true>;

/**
 * ADT Pulse - Get request config.
 *
 * @since 1.0.0
 */
export type ADTPulseGetRequestConfigExtraConfig = AxiosRequestConfig;

export type ADTPulseGetRequestConfigReturns = AxiosRequestConfig;

export type ADTPulseGetRequestConfigDefaultConfig = AxiosRequestConfig;

/**
 * ADT Pulse - Get sensor statuses.
 *
 * @since 1.0.0
 */
export type ADTPulseGetSensorStatusesReturnsInfoSensors = Sensors;

export type ADTPulseGetSensorStatusesReturnsInfo = {
  sensors: ADTPulseGetSensorStatusesReturnsInfoSensors;
};

export type ADTPulseGetSensorStatusesReturns = Promise<ApiResponse<'GET_SENSOR_STATUSES', ADTPulseGetSensorStatusesReturnsInfo>>;

export type ADTPulseGetSensorStatusesSessions = Sessions<true, true>;

/**
 * ADT Pulse - Internal.
 *
 * @since 1.0.0
 */
export type ADTPulseInternal = InternalConfig;

/**
 * ADT Pulse - Is portal accessible.
 *
 * @since 1.0.0
 */
export type ADTPulseIsPortalAccessibleReturnsInfo = null;

export type ADTPulseIsPortalAccessibleReturns = Promise<ApiResponse<'IS_PORTAL_ACCESSIBLE', ADTPulseIsPortalAccessibleReturnsInfo>>;

/**
 * ADT Pulse - Login.
 *
 * @since 1.0.0
 */
export type ADTPulseLoginReturnsInfoBackupSatCode = UUID | null;

export type ADTPulseLoginReturnsInfoNetworkId = string | null;

export type ADTPulseLoginReturnsInfoPortalVersion = string | null;

export type ADTPulseLoginReturnsInfo = {
  backupSatCode: ADTPulseLoginReturnsInfoBackupSatCode;
  networkId: ADTPulseLoginReturnsInfoNetworkId;
  portalVersion: ADTPulseLoginReturnsInfoPortalVersion;
};

export type ADTPulseLoginReturns = Promise<ApiResponse<'LOGIN', ADTPulseLoginReturnsInfo>>;

export type ADTPulseLoginSessions = Sessions<true, false>;

/**
 * ADT Pulse - Logout.
 *
 * @since 1.0.0
 */
export type ADTPulseLogoutReturnsInfoBackupSatCode = UUID | null;

export type ADTPulseLogoutReturnsInfoNetworkId = string | null;

export type ADTPulseLogoutReturnsInfoPortalVersion = string | null;

export type ADTPulseLogoutReturnsInfo = {
  backupSatCode: ADTPulseLogoutReturnsInfoBackupSatCode;
  networkId: ADTPulseLogoutReturnsInfoNetworkId;
  portalVersion: ADTPulseLogoutReturnsInfoPortalVersion;
};

export type ADTPulseLogoutReturns = Promise<ApiResponse<'LOGOUT', ADTPulseLogoutReturnsInfo>>;

export type ADTPulseLogoutSessions = Sessions<true, false>;

/**
 * ADT Pulse - Options.
 *
 * @since 1.0.0
 */
export type ADTPulseOptionsDebug = ConfigDebug;

export type ADTPulseOptionsSensors = ConfigSensors;

export type ADTPulseOptions = {
  debug: ADTPulseOptionsDebug;
  sensors: ADTPulseOptionsSensors;
};

/**
 * ADT Pulse - Perform keep alive.
 *
 * @since 1.0.0
 */
export type ADTPulsePerformKeepAliveReturnsInfo = null;

export type ADTPulsePerformKeepAliveReturns = Promise<ApiResponse<'PERFORM_KEEP_ALIVE', ADTPulsePerformKeepAliveReturnsInfo>>;

export type ADTPulsePerformKeepAliveSessions = Sessions<true, false>;

/**
 * ADT Pulse - Perform sync check.
 *
 * @since 1.0.0
 */
export type ADTPulsePerformSyncCheckReturnsInfoSyncCode = SyncCode;

export type ADTPulsePerformSyncCheckReturnsInfo = {
  syncCode: ADTPulsePerformSyncCheckReturnsInfoSyncCode;
};

export type ADTPulsePerformSyncCheckReturns = Promise<ApiResponse<'PERFORM_SYNC_CHECK', ADTPulsePerformSyncCheckReturnsInfo>>;

export type ADTPulsePerformSyncCheckSessions = Sessions<true, false>;

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

export type ADTPulseSessionNetworkId = string | null;

export type ADTPulseSessionPortalVersion = string | null;

export type ADTPulseSession = {
  backupSatCode: ADTPulseSessionBackupSatCode,
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
export type ADTPulseSetPanelStatusArmTo = ArmActions;

export type ADTPulseSetPanelStatusReturnsInfo = null;

export type ADTPulseSetPanelStatusReturns = Promise<ApiResponse<'SET_PANEL_STATUS', ADTPulseSetPanelStatusReturnsInfo>>;

export type ADTPulseSetPanelStatusSessions = Sessions<true, true>;

export type ADTPulseSetPanelStatusReadyButton = OrbSecurityButtonReady;

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
export type ADTPulsePlatformAccessories = PlatformAccessory[];

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
export type ADTPulsePlatformConfig = PlatformConfig;

/**
 * ADT Pulse Platform - Constructor.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformConstructorLog = Logger;

export type ADTPulsePlatformConstructorConfig = PlatformConfig;

export type ADTPulsePlatformConstructorApi = API;

/**
 * ADT Pulse Platform - Log.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformLog = Logger;

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
export type ADTPulsePlatformStateActivityIsSyncing = boolean;

export type ADTPulsePlatformStateActivity = {
  isSyncing: ADTPulsePlatformStateActivityIsSyncing;
};

export type ADTPulsePlatformStateDataPanel = unknown; // todo

export type ADTPulsePlatformStateDataSensors = unknown; // todo

export type ADTPulsePlatformStateDataSyncCode = unknown; // todo

export type ADTPulsePlatformStateData = {
  panel: ADTPulsePlatformStateDataPanel;
  sensors: ADTPulsePlatformStateDataSensors;
  syncCode: ADTPulsePlatformStateDataSyncCode;
};

export type ADTPulsePlatformStateEventCountersFailedLogins = number;

export type ADTPulsePlatformStateEventCountersSyncStalled = number;

export type ADTPulsePlatformStateEventCounters = {
  failedLogins: ADTPulsePlatformStateEventCountersFailedLogins;
  syncStalled: ADTPulsePlatformStateEventCountersSyncStalled;
};

export type ADTPulsePlatformStateTimersKeepAlive = number;

export type ADTPulsePlatformStateTimersSyncCheck = number;

export type ADTPulsePlatformStateTimers = {
  keepAlive: ADTPulsePlatformStateTimersKeepAlive;
  syncCheck: ADTPulsePlatformStateTimersSyncCheck;
};

export type ADTPulsePlatformState = {
  activity: ADTPulsePlatformStateActivity;
  data: ADTPulsePlatformStateData;
  eventCounters: ADTPulsePlatformStateEventCounters;
  timers: ADTPulsePlatformStateTimers;
};

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

export type ADTPulseTestFindConfigRawFile = string;

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
 * Debug log.
 *
 * @since 1.0.0
 */
export type DebugLogCaller = string;

export type DebugLogType = 'error' | 'warn' | 'success' | 'info';

export type DebugLogMessage = string;

export type DebugLogReturns = void;

/**
 * Detected new panel status.
 *
 * @since 1.0.0
 */
export type DetectedNewPanelStatusSummary = OrbTextSummary;

export type DetectedNewPanelStatusReturns = Promise<boolean>;

/**
 * Detected new portal version.
 *
 * @since 1.0.0
 */
export type DetectedNewPortalVersionVersion = string;

export type DetectedNewPortalVersionReturns = Promise<boolean>;

/**
 * Detected new sensor status.
 *
 * @since 1.0.0
 */
export type DetectedNewSensorStatusSensors = Sensors;

export type DetectedNewSensorStatusReturns = Promise<boolean>;

/**
 * Fetch table cells.
 *
 * @since 1.0.0
 */
export type FetchTableCellsNodeElements = NodeListOf<HTMLTableCellElement>;

export type FetchTableCellsMatchList = string[];

export type FetchTableCellsIncrementFrom = number;

export type FetchTableCellsIncrementTo = number;

export type FetchTableCellsReturns = TableCellsWithSurroundingData;

export type FetchTableCellsCleaner = (text: string) => string;

export type FetchTableCellsMatched = TableCellsWithSurroundingData;

/**
 * Find null keys.
 *
 * @since 1.0.0
 */
export type FindNullKeysProperties = object;

export type FindNullKeysParentKey = string;

export type FindNullKeysReturns = NullKeysLocations;

export type FindNullKeysFound = NullKeysLocations;

/**
 * Generate dynatrace pc header value.
 *
 * @since 1.0.0
 */
export type GenerateDynatracePCHeaderValueMode = 'keep-alive' | 'force-arm';

export type GenerateDynatracePCHeaderValueReturns = string;

/**
 * Initialize.
 *
 * @since 1.0.0
 */
export type InitializeApi = API;

export type InitializeReturns = void;

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

export type ParseDoSubmitHandlersUrlParamsSat = UUID;

/**
 * Parse orb sensors.
 *
 * @since 1.0.0
 */
export type ParseOrbSensorsElements = NodeListOf<Element>;

export type ParseOrbSensorsReturns = Sensors;

export type ParseOrbSensorsSensors = Sensors;

/**
 * Parse orb text summary.
 *
 * @since 1.0.0
 */
export type ParseOrbTextSummaryElement = Element | null;

export type ParseOrbTextSummaryReturns = OrbTextSummary;

/**
 * Parse orb security buttons.
 *
 * @since 1.0.0
 */
export type ParseOrbSecurityButtonsElements = NodeListOf<Element>;

export type ParseOrbSecurityButtonsReturns = OrbSecurityButtons;

export type ParseOrbSecurityButtonsButtons = OrbSecurityButtons;

export type ParseOrbSecurityButtonsUrlParamsSat = UUID;

/**
 * Sleep.
 *
 * @since 1.0.0
 */
export type SleepMilliseconds = number;

export type SleepReturns = Promise<void>;

/**
 * Stack trace log.
 *
 * @since 1.0.0
 */
export type StackTraceLogError = ErrorObject;

export type StackTraceLogReturns = void;
