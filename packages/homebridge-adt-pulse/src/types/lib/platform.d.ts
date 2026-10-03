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
import type { z } from 'zod';

import type { ADTPulseAccessory } from '../../lib/accessory.js';
import type { ADTPulseAPI } from '../../lib/api.js';
import type { platformConfig } from '../../lib/schema.js';
import type {
  Constant_PluginDeviceId,
  Constant_PluginDeviceSensorType,
  Constant_PortalSyncCode,
  Constant_PortalVersion,
} from '../constant.d.ts';
import type {
  Shared_ApiResponse,
  Shared_CachedState,
  Shared_Device,
  Shared_Device_OriginalName,
  Shared_Device_Type,
  Shared_Device_Zone,
  Shared_Devices,
  Shared_GatewayInformation,
  Shared_GatewayInformation_Status,
  Shared_NetworkId,
  Shared_OrbSecurityButtons,
  Shared_PanelInformation,
  Shared_PanelInformation_Status,
  Shared_PanelStatus,
  Shared_PanelStatus_RawData_Node,
  Shared_SensorInformation,
  Shared_SensorInformation_Name,
  Shared_SensorInformation_Status,
  Shared_SensorInformation_Zone,
  Shared_SensorStatus,
  Shared_SensorStatus_Name,
  Shared_SensorStatus_Zone,
  Shared_Uuid,
} from '../shared.d.ts';

/**
 * Lib - Platform.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_Plugin = DynamicPlatformPlugin;

/**
 * Lib - Platform.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_Accessory = PlatformAccessory<Shared_Device>;

export type Lib_Platform_ADTPulsePlatform_Accessories = Lib_Platform_ADTPulsePlatform_Accessory[];

/**
 * Lib - Platform - Add Accessory.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_AddAccessory_Device = Shared_Device;

export type Lib_Platform_ADTPulsePlatform_AddAccessory_Returns = void;

export type Lib_Platform_ADTPulsePlatform_AddAccessory_AccessoryIndex = number;

export type Lib_Platform_ADTPulsePlatform_AddAccessory_NewPlatformAccessory = typeof PlatformAccessory;

export type Lib_Platform_ADTPulsePlatform_AddAccessory_NewAccessory = PlatformAccessory;

export type Lib_Platform_ADTPulsePlatform_AddAccessory_TypedAccessory = PlatformAccessory<Shared_Device>;

/**
 * Lib - Platform.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_Api = API;

/**
 * Lib - Platform.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_Characteristic = typeof Characteristic;

/**
 * Lib - Platform.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_Config = z.infer<typeof platformConfig> | null;

/**
 * Lib - Platform - Configure Accessory.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Accessory = PlatformAccessory;

export type Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Returns = void;

export type Lib_Platform_ADTPulsePlatform_ConfigureAccessory_TypedAccessory = PlatformAccessory<Shared_Device>;

/**
 * Lib - Platform.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_Constants_Timestamps_AdtKeepAlive = number;

export type Lib_Platform_ADTPulsePlatform_Constants_Timestamps_AdtSessionLifespan = number;

export type Lib_Platform_ADTPulsePlatform_Constants_Timestamps_AdtSyncCheck = number;

export type Lib_Platform_ADTPulsePlatform_Constants_Timestamps_SuspendSyncing = number;

export type Lib_Platform_ADTPulsePlatform_Constants_Timestamps_Synchronize = number;

export type Lib_Platform_ADTPulsePlatform_Constants_Timestamps = {
  adtKeepAlive: Lib_Platform_ADTPulsePlatform_Constants_Timestamps_AdtKeepAlive;
  adtSessionLifespan: Lib_Platform_ADTPulsePlatform_Constants_Timestamps_AdtSessionLifespan;
  adtSyncCheck: Lib_Platform_ADTPulsePlatform_Constants_Timestamps_AdtSyncCheck;
  suspendSyncing: Lib_Platform_ADTPulsePlatform_Constants_Timestamps_SuspendSyncing;
  synchronize: Lib_Platform_ADTPulsePlatform_Constants_Timestamps_Synchronize;
};

export type Lib_Platform_ADTPulsePlatform_Constants_MaxLoginRetries = number;

export type Lib_Platform_ADTPulsePlatform_Constants = {
  intervalTimestamps: Lib_Platform_ADTPulsePlatform_Constants_Timestamps;
  maxLoginRetries: Lib_Platform_ADTPulsePlatform_Constants_MaxLoginRetries;
};

/**
 * Lib - Platform - Constructor.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_Constructor_Log = Logger;

export type Lib_Platform_ADTPulsePlatform_Constructor_Config = PlatformConfig;

export type Lib_Platform_ADTPulsePlatform_Constructor_Api = API;

export type Lib_Platform_ADTPulsePlatform_Constructor_ParsedConfig = z.ZodSafeParseResult<z.output<typeof platformConfig>>;

/**
 * Lib - Platform - Constructor - Did Finish Launching.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_Constructor_DidFinishLaunching_WarningCount = number;

export type Lib_Platform_ADTPulsePlatform_Constructor_DidFinishLaunching_WarningTerm = string;

export type Lib_Platform_ADTPulsePlatform_Constructor_DidFinishLaunching_Seconds = number;

/**
 * Lib - Platform - Constructor - Shutdown.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_Constructor_Shutdown_Returns = void;

/**
 * Lib - Platform.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_DebugMode = boolean | null;

/**
 * Lib - Platform - Fetch Updated Information.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_Returns = Promise<void>;

export type Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_CachedState = Shared_CachedState;

export type Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_RequestsSensorsInfoSensors = Shared_SensorInformation[];

export type Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_RequestsSensorsInfo = {
  sensors: Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_RequestsSensorsInfoSensors;
};

export type Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_RequestsSensorsStatusSensors = Shared_SensorStatus[];

export type Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_RequestsSensorsStatus = {
  sensors: Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_RequestsSensorsStatusSensors;
};

export type Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_Requests = [
  Shared_ApiResponse<'GET_GATEWAY_INFORMATION', Shared_GatewayInformation>,
  Shared_ApiResponse<'GET_PANEL_INFORMATION', Shared_PanelInformation>,
  Shared_ApiResponse<'GET_PANEL_STATUS', Shared_PanelStatus>,
  Shared_ApiResponse<'GET_SENSORS_INFORMATION', Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_RequestsSensorsInfo>,
  Shared_ApiResponse<'GET_SENSORS_STATUS', Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_RequestsSensorsStatus>,
  Shared_ApiResponse<'GET_ORB_SECURITY_BUTTONS', Shared_OrbSecurityButtons>,
];

export type Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_GatewayInfo = Shared_GatewayInformation;

export type Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_PanelInfo = Shared_PanelInformation;

export type Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_PanelStatus = Shared_PanelStatus;

export type Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_SensorsInfo = Shared_SensorInformation[];

export type Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_SensorsStatus = Shared_SensorStatus[];

export type Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_OrbSecurityButtons = Shared_OrbSecurityButtons;

/**
 * Lib - Platform.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_Handlers = Record<string, ADTPulseAccessory>;

/**
 * Lib - Platform.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_Instance = ADTPulseAPI | null;

/**
 * Lib - Platform.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_Log = Logger;

/**
 * Lib - Platform - Log Status Changes.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_OldCache = Shared_CachedState;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_NewCache = Shared_CachedState;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_Returns = Promise<void>;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_GatewayInfoOldStatus = Shared_GatewayInformation_Status;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_GatewayInfoNewStatus = Shared_GatewayInformation_Status;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_PanelInfoOldStatus = Shared_PanelInformation_Status;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_PanelInfoNewStatus = Shared_PanelInformation_Status;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_PanelStatusOldStatus = Shared_PanelStatus_RawData_Node;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_PanelStatusNewStatus = Shared_PanelStatus_RawData_Node;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_SplitOldStatus = string;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_SplitNewStatus = string;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsInfoName = Shared_SensorInformation_Name;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsInfoZone = Shared_SensorInformation_Zone;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsInfoConfiguredSensor = z.infer<typeof platformConfig>['sensors'][number] | undefined;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsInfoOldStatus = Shared_SensorInformation_Status;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsInfoNewStatus = Shared_SensorInformation_Status;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsStatusName = Shared_SensorStatus_Name;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsStatusZone = Shared_SensorStatus_Zone;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsStatusConfiguredSensor = z.infer<typeof platformConfig>['sensors'][number] | undefined;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsStatusOldStatus = string;

export type Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsStatusNewStatus = string;

/**
 * Lib - Platform - Poll Accessories.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_PollAccessories_Devices = Shared_Devices;

export type Lib_Platform_ADTPulsePlatform_PollAccessories_Returns = Promise<void>;

export type Lib_Platform_ADTPulsePlatform_PollAccessories_AccessoryIndex = number;

/**
 * Lib - Platform - Print System Information.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_PrintSystemInformation_Returns = void;

export type Lib_Platform_ADTPulsePlatform_PrintSystemInformation_HomebridgeVersion = string;

export type Lib_Platform_ADTPulsePlatform_PrintSystemInformation_NodeVersion = string;

export type Lib_Platform_ADTPulsePlatform_PrintSystemInformation_OpensslVersion = string;

export type Lib_Platform_ADTPulsePlatform_PrintSystemInformation_PackageVersion = string;

export type Lib_Platform_ADTPulsePlatform_PrintSystemInformation_PlatformPlusArch = string;

/**
 * Lib - Platform - Remove Accessory.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_RemoveAccessory_Accessory = PlatformAccessory<Shared_Device>;

export type Lib_Platform_ADTPulsePlatform_RemoveAccessory_Reason = string;

export type Lib_Platform_ADTPulsePlatform_RemoveAccessory_Returns = void;

/**
 * Lib - Platform.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_Service = typeof Service;

/**
 * Lib - Platform.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_State_Activity_IsAdtKeepingAlive = boolean;

export type Lib_Platform_ADTPulsePlatform_State_Activity_IsAdtSyncChecking = boolean;

export type Lib_Platform_ADTPulsePlatform_State_Activity_IsLoggingIn = boolean;

export type Lib_Platform_ADTPulsePlatform_State_Activity_IsSyncing = boolean;

export type Lib_Platform_ADTPulsePlatform_State_Activity = {
  isAdtKeepingAlive: Lib_Platform_ADTPulsePlatform_State_Activity_IsAdtKeepingAlive;
  isAdtSyncChecking: Lib_Platform_ADTPulsePlatform_State_Activity_IsAdtSyncChecking;
  isLoggingIn: Lib_Platform_ADTPulsePlatform_State_Activity_IsLoggingIn;
  isSyncing: Lib_Platform_ADTPulsePlatform_State_Activity_IsSyncing;
};

export type Lib_Platform_ADTPulsePlatform_State_Data = Shared_CachedState;

export type Lib_Platform_ADTPulsePlatform_State_EventCounters_FailedLogins = number;

export type Lib_Platform_ADTPulsePlatform_State_EventCounters = {
  failedLogins: Lib_Platform_ADTPulsePlatform_State_EventCounters_FailedLogins;
};

export type Lib_Platform_ADTPulsePlatform_State_Intervals_Synchronize = NodeJS.Timeout | undefined;

export type Lib_Platform_ADTPulsePlatform_State_Intervals = {
  synchronize: Lib_Platform_ADTPulsePlatform_State_Intervals_Synchronize;
};

export type Lib_Platform_ADTPulsePlatform_State_LastRunOn_AdtKeepAlive = number;

export type Lib_Platform_ADTPulsePlatform_State_LastRunOn_AdtLastLogin = number;

export type Lib_Platform_ADTPulsePlatform_State_LastRunOn_AdtSyncCheck = number;

export type Lib_Platform_ADTPulsePlatform_State_LastRunOn = {
  adtKeepAlive: Lib_Platform_ADTPulsePlatform_State_LastRunOn_AdtKeepAlive;
  adtLastLogin: Lib_Platform_ADTPulsePlatform_State_LastRunOn_AdtLastLogin;
  adtSyncCheck: Lib_Platform_ADTPulsePlatform_State_LastRunOn_AdtSyncCheck;
};

export type Lib_Platform_ADTPulsePlatform_State_ReportedHash = string;

export type Lib_Platform_ADTPulsePlatform_State_ReportedHashes = Lib_Platform_ADTPulsePlatform_State_ReportedHash[];

export type Lib_Platform_ADTPulsePlatform_State = {
  activity: Lib_Platform_ADTPulsePlatform_State_Activity;
  data: Lib_Platform_ADTPulsePlatform_State_Data;
  eventCounters: Lib_Platform_ADTPulsePlatform_State_EventCounters;
  intervals: Lib_Platform_ADTPulsePlatform_State_Intervals;
  lastRunOn: Lib_Platform_ADTPulsePlatform_State_LastRunOn;
  reportedHashes: Lib_Platform_ADTPulsePlatform_State_ReportedHashes;
};

/**
 * Lib - Platform - Synchronize.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_Synchronize_Returns = void;

export type Lib_Platform_ADTPulsePlatform_Synchronize_CurrentTimestamp = number;

export type Lib_Platform_ADTPulsePlatform_Synchronize_LoginInfoBackupSatCode = Shared_Uuid | null;

export type Lib_Platform_ADTPulsePlatform_Synchronize_LoginInfoNetworkId = Shared_NetworkId | null;

export type Lib_Platform_ADTPulsePlatform_Synchronize_LoginInfoPortalVersion = Constant_PortalVersion | null;

export type Lib_Platform_ADTPulsePlatform_Synchronize_LoginInfo = {
  backupSatCode: Lib_Platform_ADTPulsePlatform_Synchronize_LoginInfoBackupSatCode;
  networkId: Lib_Platform_ADTPulsePlatform_Synchronize_LoginInfoNetworkId;
  portalVersion: Lib_Platform_ADTPulsePlatform_Synchronize_LoginInfoPortalVersion;
};

export type Lib_Platform_ADTPulsePlatform_Synchronize_Login = Shared_ApiResponse<'LOGIN', Lib_Platform_ADTPulsePlatform_Synchronize_LoginInfo>;

export type Lib_Platform_ADTPulsePlatform_Synchronize_AttemptsLeft = number;

export type Lib_Platform_ADTPulsePlatform_Synchronize_SuspendMinutes = number;

/**
 * Lib - Platform - Synchronize Keep Alive.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_SynchronizeKeepAlive_Returns = void;

export type Lib_Platform_ADTPulsePlatform_SynchronizeKeepAlive_KeepAliveInfo = null;

export type Lib_Platform_ADTPulsePlatform_SynchronizeKeepAlive_KeepAlive = Shared_ApiResponse<'PERFORM_KEEP_ALIVE', Lib_Platform_ADTPulsePlatform_SynchronizeKeepAlive_KeepAliveInfo>;

export type Lib_Platform_ADTPulsePlatform_SynchronizeKeepAlive_Error = ErrorObject | undefined;

export type Lib_Platform_ADTPulsePlatform_SynchronizeKeepAlive_Code = string | undefined;

/**
 * Lib - Platform - Synchronize Sync Check.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_Returns = void;

export type Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_SyncCheckInfoSyncCode = Constant_PortalSyncCode;

export type Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_SyncCheckInfo = {
  syncCode: Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_SyncCheckInfoSyncCode;
};

export type Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_SyncCheck = Shared_ApiResponse<'PERFORM_SYNC_CHECK', Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_SyncCheckInfo>;

export type Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_Error = ErrorObject | undefined;

export type Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_Code = string | undefined;

/**
 * Lib - Platform - Unify Devices.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_UnifyDevices_Returns = Promise<void>;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_GatewayInfo = Shared_GatewayInformation | null;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_PanelInfo = Shared_PanelInformation | null;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorsInfo = Shared_SensorInformation[];

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_Devices = Shared_Devices;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_Id = Constant_PluginDeviceId;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_IdPanel = Constant_PluginDeviceId;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_IdSwitch = Constant_PluginDeviceId;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_ConfiguredSensor = z.infer<typeof platformConfig>['sensors'][number];

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_AdtName = string;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_AdtType = Constant_PluginDeviceSensorType;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_AdtZone = number;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_Name = string | undefined;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_Sensor = Shared_SensorInformation | undefined;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorInfoName = Shared_SensorInformation_Name;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorInfoType = Constant_PluginDeviceSensorType | undefined;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorInfoZone = Shared_SensorInformation_Zone;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorId = Constant_PluginDeviceId;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_Options = z.infer<typeof platformConfig>['options'];

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_Sensors = z.infer<typeof platformConfig>['sensors'];

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_AccessoryContext = Shared_Device;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_OriginalName = Shared_Device_OriginalName;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_Type = Shared_Device_Type;

export type Lib_Platform_ADTPulsePlatform_UnifyDevices_Zone = Shared_Device_Zone;

/**
 * Lib - Platform - Unknown Information Dispatcher.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_Returns = Promise<void>;

export type Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_SensorsInfo = Shared_SensorInformation[];

export type Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_SensorsStatus = Shared_SensorStatus[];

export type Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_SensorInfo = Shared_SensorInformation;

export type Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_SensorStatus = Shared_SensorStatus;

export type Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_SensorType = Constant_PluginDeviceSensorType | undefined;

export type Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_Sensor = {
  info: Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_SensorInfo;
  status: Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_SensorStatus;
  type: Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_SensorType;
};

export type Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_Sensors = Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_Sensor[];

export type Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_MatchedStatus = Shared_SensorStatus | undefined;

export type Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_DataHash = string;

export type Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_DetectedNew = boolean;

/**
 * Lib - Platform - Update Accessory.
 *
 * @since 1.0.0
 */
export type Lib_Platform_ADTPulsePlatform_UpdateAccessory_Device = Shared_Device;

export type Lib_Platform_ADTPulsePlatform_UpdateAccessory_Returns = void;

export type Lib_Platform_ADTPulsePlatform_UpdateAccessory_IndexWithValueIndex = number;

export type Lib_Platform_ADTPulsePlatform_UpdateAccessory_IndexWithValueValue = PlatformAccessory<Shared_Device> | undefined;

export type Lib_Platform_ADTPulsePlatform_UpdateAccessory_IndexWithValue = {
  index: Lib_Platform_ADTPulsePlatform_UpdateAccessory_IndexWithValueIndex;
  value: Lib_Platform_ADTPulsePlatform_UpdateAccessory_IndexWithValueValue;
};

export type Lib_Platform_ADTPulsePlatform_UpdateAccessory_Index = number;

export type Lib_Platform_ADTPulsePlatform_UpdateAccessory_Value = PlatformAccessory<Shared_Device> | undefined;
