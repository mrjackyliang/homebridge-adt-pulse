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
import type repl from 'node:repl';
import type { ErrorObject } from 'serialize-error';
import type { ZodIssue } from 'zod';

import type { ADTPulse } from '@/lib/api.js';
import type {
  ApiResponse,
  ApiResponseFail,
  ArmActions,
  ArmStates,
  Config,
  ConfigFingerprint,
  ConfigPassword,
  ConfigSubdomain,
  ConfigUsername,
  DoSubmitHandlers,
  GatewayInformation,
  InternalConfig,
  NullKeysLocations,
  OrbSecurityButtonReady,
  OrbSecurityButtons,
  OrbTextSummary,
  PanelInformation,
  SensorsInformation,
  SensorsStatus,
  Sessions,
  SyncCode,
  TableCellsWithSurroundingData,
  UUID,
} from '@/types/shared.d.ts';

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

export type ADTPulseGetGatewayInformationSessions = Sessions<true, true>;

/**
 * ADT Pulse - Get panel information.
 *
 * @since 1.0.0
 */
export type ADTPulseGetPanelInformationReturnsInfo = PanelInformation;

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
 * ADT Pulse - Get sensors information.
 *
 * @since 1.0.0
 */
export type ADTPulseGetSensorsInformationReturnsInfoSensors = SensorsInformation;

export type ADTPulseGetSensorsInformationReturnsInfo = {
  sensors: ADTPulseGetSensorsInformationReturnsInfoSensors;
};

export type ADTPulseGetSensorsInformationReturns = Promise<ApiResponse<'GET_SENSORS_INFORMATION', ADTPulseGetSensorsInformationReturnsInfo>>;

export type ADTPulseGetSensorsInformationSessions = Sessions<true, true>;

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

export type ADTPulseGetSensorsStatusSessions = Sessions<true, true>;

/**
 * ADT Pulse - Handle login failure.
 *
 * @since 1.0.0
 */
export type ADTPulseHandleLoginFailureRequestPath = string | null;

export type ADTPulseHandleLoginFailureSession = AxiosResponse;

export type ADTPulseHandleLoginFailureReturns = void;

/**
 * ADT Pulse - Internal.
 *
 * @since 1.0.0
 */
export type ADTPulseInternalBaseUrl = `https://${string}`;

export type ADTPulseInternalDebug = boolean;

export type ADTPulseInternalLogger = Logger | null;

export type ADTPulseInternalTestModeEnabled = boolean;

export type ADTPulseInternalTestModeIsDisarmChecked = boolean;

export type ADTPulseInternalTestMode = {
  enabled: ADTPulseInternalTestModeEnabled;
  isDisarmChecked: ADTPulseInternalTestModeIsDisarmChecked;
};

export type ADTPulseInternal = {
  baseUrl: ADTPulseInternalBaseUrl;
  debug: ADTPulseInternalDebug;
  logger: ADTPulseInternalLogger;
  testMode: ADTPulseInternalTestMode;
};

/**
 * ADT Pulse - Is authenticated.
 *
 * @since 1.0.0
 */
export type ADTPulseIsAuthenticatedReturns = boolean;

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
 * ADT Pulse Platform - Add accessory.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformAddAccessoryReturns = void;

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
 * ADT Pulse Platform - Configure accessory.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformConfigureAccessoryAccessory = PlatformAccessory;

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
 * ADT Pulse Platform - Fetch updated information.
 *
 * @since 1.0.0
 */
export type ADTPulsePlatformFetchUpdatedInformationReturns = Promise<void>;

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
// export type ADTPulsePlatformRemoveAccessoryAccessory = PlatformAccessory; todo

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
  isLoggingIn: ADTPulsePlatformStateActivityIsLoggingIn,
  isSyncing: ADTPulsePlatformStateActivityIsSyncing;
};

export type ADTPulsePlatformStateDataGatewayInfo = GatewayInformation | null;

export type ADTPulsePlatformStateDataPanelInfo = PanelInformation | null;

export type ADTPulsePlatformStateDataPanelStatus = OrbTextSummary | null;

export type ADTPulsePlatformStateDataSensorsInfo = SensorsInformation;

export type ADTPulsePlatformStateDataSensorsStatus = SensorsStatus;

export type ADTPulsePlatformStateDataSyncCode = SyncCode;

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
 * ADT Pulse Repl - Api.
 *
 * @private
 *
 * @since 1.0.0
 */
export type ADTPulseReplApi = ADTPulse | undefined;

/**
 * ADT Pulse Repl - Color log.
 *
 * @since 1.0.0
 */
export type ADTPulseReplColorLogType = 'info' | 'error';

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
 * ADT Pulse Repl - Display startup notice.
 *
 * @since 1.0.0
 */
export type ADTPulseDisplayStartupNoticeReturns = void;

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
export type DebugLogLogger = Logger | null;

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

export type DetectedNewPanelStatusLogger = Logger;

export type DetectedNewPanelStatusReturns = Promise<boolean>;

/**
 * Detected new portal version.
 *
 * @since 1.0.0
 */
export type DetectedNewPortalVersionVersion = string;

export type DetectedNewPortalVersionLogger = Logger;

export type DetectedNewPortalVersionReturns = Promise<boolean>;

/**
 * Detected new sensor information.
 *
 * @since 1.0.0
 */
export type DetectedNewSensorInformationSensors = SensorsInformation;

export type DetectedNewSensorInformationLogger = Logger;

export type DetectedNewSensorInformationReturns = Promise<boolean>;

/**
 * Detected new sensor status.
 *
 * @since 1.0.0
 */
export type DetectedNewSensorStatusSensors = SensorsStatus;

export type DetectedNewSensorStatusLogger = Logger;

export type DetectedNewSensorStatusReturns = Promise<boolean>;

/**
 * Fetch error message.
 *
 * @since 1.0.0
 */
export type FetchErrorMessageResponse = AxiosResponse;

export type FetchErrorMessageReturns = string | null;

/**
 * Fetch missing sat code.
 *
 * @since 1.0.0
 */
export type FetchMissingSatCodeResponse = AxiosResponse;

export type FetchMissingSatCodeReturns = string | null;

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
 * Generate md5 hash.
 *
 * @since 1.0.0
 */
export type GenerateMd5HashData = unknown;

export type GenerateMd5HashReturns = string;

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

export type ParseOrbSensorsReturns = SensorsStatus;

export type ParseOrbSensorsSensors = SensorsStatus;

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
 * Parse sensors table.
 *
 * @param {ParseOrbSensorsTableElements} elements - Elements.
 *
 * @returns {ParseOrbSensorsTableReturns}
 *
 * @since 1.0.0
 */
export type ParseOrbSensorsTableElements = NodeListOf<Element>;

export type ParseOrbSensorsTableReturns = SensorsInformation;

export type ParseOrbSensorsTableSensors = SensorsInformation;

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
export type StackTracerType = 'api-response' | 'serialize-error' | 'zod-error';

export type StackTracerError<Type extends StackTracerType> = Type extends 'api-response' ? ApiResponseFail<any> : Type extends 'serialize-error' ? ErrorObject : Type extends 'zod-error' ? ZodIssue[] : never;

export type StackTracerReturns = void;
