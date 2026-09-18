import type { AxiosResponse } from 'axios';
import type { Characteristic, CharacteristicValue, Logger } from 'homebridge';
import type { JSDOM } from 'jsdom';
import type { DateTimeMaybeValid } from 'luxon';
import type { ErrorObject } from 'serialize-error';
import type { z } from 'zod';

import type { multiFactorAuth } from '../../lib/schema.js';
import type {
  Constant_PluginDeviceCategory,
  Constant_PluginDeviceSensorType,
  Constant_PluginLogLevel,
  Constant_PortalDeviceSensorStatus,
  Constant_PortalPanelArmButtonHref,
  Constant_PortalPanelArmButtonId,
  Constant_PortalPanelArmButtonLoadingText,
  Constant_PortalPanelArmButtonRelativeUrl,
  Constant_PortalPanelArmButtonText,
  Constant_PortalPanelArmStateClean,
  Constant_PortalPanelArmStateDirty,
  Constant_PortalPanelArmStateForce,
  Constant_PortalPanelArmValue,
  Constant_PortalPanelForceArmButtonHref,
  Constant_PortalPanelForceArmButtonRelativeUrl,
  Constant_PortalPanelNote,
  Constant_PortalPanelState,
  Constant_PortalPanelStatus,
  Constant_PortalSensorDeviceType,
  Constant_PortalSensorStatusIcon,
  Constant_PortalSensorStatusText,
  Constant_PortalSyncCode,
} from '../constant.d.ts';
import type {
  AxiosResponseNodeJs,
  Shared_ApiResponseAction,
  Shared_ApiResponseFail,
  Shared_DoSubmitHandlers,
  Shared_MfaDevice,
  Shared_MfaDevice_Type,
  Shared_MfaTrustedDevice,
  Shared_OrbSecurityButtonBase,
  Shared_OrbSecurityButtonReady,
  Shared_OrbSecurityButtons,
  Shared_PanelStatus,
  Shared_PanelStatus_PanelStates,
  Shared_PanelStatus_PanelStatuses,
  Shared_SensorConfig,
  Shared_SensorInformation,
  Shared_SensorStatus,
  Shared_Uuid,
} from '../shared.d.ts';

/**
 * Lib - Utility - Clear HTML Line Break.
 *
 * @since 1.0.0
 */
export type Lib_Utility_ClearHtmlLineBreak_Data = string;

export type Lib_Utility_ClearHtmlLineBreak_Returns = string;

/**
 * Lib - Utility - Clear Whitespace.
 *
 * @since 1.0.0
 */
export type Lib_Utility_ClearWhitespace_Data = string;

export type Lib_Utility_ClearWhitespace_Returns = string;

/**
 * Lib - Utility - Condense Panel States.
 *
 * @since 1.0.0
 */
export type Lib_Utility_CondensePanelStates_Characteristic = typeof Characteristic;

export type Lib_Utility_CondensePanelStates_PanelStates = Shared_PanelStatus_PanelStates;

export type Lib_Utility_CondensePanelStates_Returns = Lib_Utility_CondensePanelStates_Condensed;

export type Lib_Utility_CondensePanelStates_CondensedArmValue = Constant_PortalPanelArmValue;

export type Lib_Utility_CondensePanelStates_CondensedCharacteristicValueCurrent = CharacteristicValue;

export type Lib_Utility_CondensePanelStates_CondensedCharacteristicValueTarget = CharacteristicValue;

export type Lib_Utility_CondensePanelStates_CondensedCharacteristicValue = {
  current: Lib_Utility_CondensePanelStates_CondensedCharacteristicValueCurrent;
  target: Lib_Utility_CondensePanelStates_CondensedCharacteristicValueTarget;
};

export type Lib_Utility_CondensePanelStates_Condensed = {
  armValue: Lib_Utility_CondensePanelStates_CondensedArmValue;
  characteristicValue: Lib_Utility_CondensePanelStates_CondensedCharacteristicValue;
} | undefined;

/**
 * Lib - Utility - Condense Sensor Type.
 *
 * @since 1.0.0
 */
export type Lib_Utility_CondenseSensorType_SensorType = Constant_PortalSensorDeviceType;

export type Lib_Utility_CondenseSensorType_Returns = Constant_PluginDeviceSensorType | undefined;

export type Lib_Utility_CondenseSensorType_Condensed = Constant_PluginDeviceSensorType | undefined;

/**
 * Lib - Utility - Convert Panel Characteristic Value.
 *
 * @since 1.0.0
 */
export type Lib_Utility_ConvertPanelCharacteristicValue_Mode = 'current-to-target' | 'target-to-current';

export type Lib_Utility_ConvertPanelCharacteristicValue_Characteristic = typeof Characteristic;

export type Lib_Utility_ConvertPanelCharacteristicValue_Value = CharacteristicValue;

export type Lib_Utility_ConvertPanelCharacteristicValue_Returns = CharacteristicValue | undefined;

/**
 * Lib - Utility - Create Trusted Device Name.
 *
 * @since 3.5.0
 */
export type Lib_Utility_CreateTrustedDeviceName_Returns = string;

export type Lib_Utility_CreateTrustedDeviceName_InstanceName = string;

export type Lib_Utility_CreateTrustedDeviceName_Prefix = string;

/**
 * Lib - Utility - Debug Log.
 *
 * @since 1.0.0
 */
export type Lib_Utility_DebugLog_Logger = Logger | null;

export type Lib_Utility_DebugLog_Caller = `${string}.ts / ${string}()` | `${string}.tsx / ${string}()`;

export type Lib_Utility_DebugLog_Type = Constant_PluginLogLevel;

export type Lib_Utility_DebugLog_Message = string;

export type Lib_Utility_DebugLog_Returns = void;

export type Lib_Utility_DebugLog_LogMessage = string;

/**
 * Lib - Utility - Fetch Error Message.
 *
 * @since 1.0.0
 */
export type Lib_Utility_FetchErrorMessage_Response = AxiosResponseNodeJs<unknown> | undefined;

export type Lib_Utility_FetchErrorMessage_Returns = string | null;

export type Lib_Utility_FetchErrorMessage_Jsdom = JSDOM;

export type Lib_Utility_FetchErrorMessage_WarnMessage = Element | null;

/**
 * Lib - Utility - Fetch Missing Sat Code.
 *
 * @since 1.0.0
 */
export type Lib_Utility_FetchMissingSatCode_Response = AxiosResponseNodeJs<unknown>;

export type Lib_Utility_FetchMissingSatCode_Returns = Shared_Uuid | null;

export type Lib_Utility_FetchMissingSatCode_SatCode = RegExpMatchArray | null;

/**
 * Lib - Utility - Fetch Table Cells.
 *
 * @since 1.0.0
 */
export type Lib_Utility_FetchTableCells_NodeElements = NodeListOf<HTMLTableCellElement>;

export type Lib_Utility_FetchTableCells_MatchItem = string;

export type Lib_Utility_FetchTableCells_MatchItems = Lib_Utility_FetchTableCells_MatchItem[];

export type Lib_Utility_FetchTableCells_IncrementFrom = number;

export type Lib_Utility_FetchTableCells_IncrementTo = number;

export type Lib_Utility_FetchTableCells_Returns = Record<string, string[]>;

export type Lib_Utility_FetchTableCells_Matched = Record<string, string[]>;

export type Lib_Utility_FetchTableCells_NewIncrementFrom = number;

export type Lib_Utility_FetchTableCells_NewIncrementTo = number;

export type Lib_Utility_FetchTableCells_CurrentNode = string | null;

export type Lib_Utility_FetchTableCells_CurrentNodeCleaned = string;

export type Lib_Utility_FetchTableCells_CollectedNode = string;

export type Lib_Utility_FetchTableCells_CollectedNodes = Lib_Utility_FetchTableCells_CollectedNode[];

export type Lib_Utility_FetchTableCells_IncrementedNode = string | null;

export type Lib_Utility_FetchTableCells_IncrementedNodeCleaned = string;

/**
 * Lib - Utility - Find Gateway Manufacturer Model.
 *
 * @since 1.0.0
 */
export type Lib_Utility_FindGatewayManufacturerModel_Mode = 'manufacturer' | 'model';

export type Lib_Utility_FindGatewayManufacturerModel_Manufacturer = string | null;

export type Lib_Utility_FindGatewayManufacturerModel_Model = string | null;

export type Lib_Utility_FindGatewayManufacturerModel_Returns = string | null;

export type Lib_Utility_FindGatewayManufacturerModel_NewManufacturer = string | null;

export type Lib_Utility_FindGatewayManufacturerModel_NewModel = string | null;

/**
 * Lib - Utility - Find Index With Value.
 *
 * @since 1.0.0
 */
export type Lib_Utility_FindIndexWithValue_Array<Value> = Value[];

export type Lib_Utility_FindIndexWithValue_Condition<Value> = (value: Value) => boolean;

export type Lib_Utility_FindIndexWithValue_Returns<Value> = {
  index: Lib_Utility_FindIndexWithValue_Index;
  value: Lib_Utility_FindIndexWithValue_Value<Value>;
};

export type Lib_Utility_FindIndexWithValue_Index = number;

export type Lib_Utility_FindIndexWithValue_Value<Value> = Value | undefined;

/**
 * Lib - Utility - Find Null Keys.
 *
 * @since 1.0.0
 */
export type Lib_Utility_FindNullKeys_Properties = object;

export type Lib_Utility_FindNullKeys_ParentKey = string;

export type Lib_Utility_FindNullKeys_Returns = string[];

export type Lib_Utility_FindNullKeys_Found = string[];

export type Lib_Utility_FindNullKeys_PropertyKey = string;

export type Lib_Utility_FindNullKeys_Property = unknown;

export type Lib_Utility_FindNullKeys_CurrentKey = string;

/**
 * Lib - Utility - Find Panel Manufacturer.
 *
 * @since 1.0.0
 */
export type Lib_Utility_FindPanelManufacturer_ManufacturerProvider = string | null;

export type Lib_Utility_FindPanelManufacturer_TypeModel = string | null;

export type Lib_Utility_FindPanelManufacturer_Returns = string | null;

/**
 * Lib - Utility - Generate Hash.
 *
 * @since 1.0.0
 */
export type Lib_Utility_GenerateHash_Data = object | object[];

export type Lib_Utility_GenerateHash_Returns = string;

export type Lib_Utility_GenerateHash_StaticData = Partial<Lib_Utility_GenerateHash_Data>;

/**
 * Lib - Utility - Get Accessory Category.
 *
 * @since 1.0.0
 */
export type Lib_Utility_GetAccessoryCategory_DeviceCategory = Constant_PluginDeviceCategory;

export type Lib_Utility_GetAccessoryCategory_Returns = number;

/**
 * Lib - Utility - Get Detect Report URL.
 *
 * @since 1.0.0
 */
export type Lib_Utility_GetDetectReportUrl_Returns = `https://${string}.ntfy.mrjackyliang.com`;

/**
 * Lib - Utility - Get Package Version.
 *
 * @since 1.0.0
 */
export type Lib_Utility_GetPackageVersion_Returns = string;

export type Lib_Utility_GetPackageVersion_Require = NodeRequire;

export type Lib_Utility_GetPackageVersion_PackageJsonVersion = string;

export type Lib_Utility_GetPackageVersion_PackageJson = {
  version: Lib_Utility_GetPackageVersion_PackageJsonVersion;
};

/**
 * Lib - Utility - Get Plural Form.
 *
 * @since 1.0.0
 */
export type Lib_Utility_GetPluralForm_Count = number;

export type Lib_Utility_GetPluralForm_Singular = string;

export type Lib_Utility_GetPluralForm_Plural = string;

export type Lib_Utility_GetPluralForm_Returns = string;

/**
 * Lib - Utility - Is Empty Orb Text Summary.
 *
 * @since 1.0.0
 */
export type Lib_Utility_IsEmptyOrbTextSummary_Input = Shared_PanelStatus;

export type Lib_Utility_IsEmptyOrbTextSummary_Returns = boolean;

export type Lib_Utility_IsEmptyOrbTextSummary_Match = Shared_PanelStatus;

/**
 * Lib - Utility - Is Forward Slash OS.
 *
 * @since 1.0.0
 */
export type Lib_Utility_IsForwardSlashOS_Returns = boolean;

export type Lib_Utility_IsForwardSlashOS_CurrentOS = NodeJS.Platform;

/**
 * Lib - Utility - Is Maintenance Period.
 *
 * @since 1.0.0
 */
export type Lib_Utility_IsMaintenancePeriod_Returns = boolean;

export type Lib_Utility_IsMaintenancePeriod_Now = DateTimeMaybeValid;

export type Lib_Utility_IsMaintenancePeriod_StartTime = DateTimeMaybeValid;

export type Lib_Utility_IsMaintenancePeriod_EndTime = DateTimeMaybeValid;

/**
 * Lib - Utility - Is Panel Alarm Active.
 *
 * @since 1.0.0
 */
export type Lib_Utility_IsPanelAlarmActive_PanelStatuses = Shared_PanelStatus_PanelStatuses;

export type Lib_Utility_IsPanelAlarmActive_OrbSecurityButtons = Shared_OrbSecurityButtons;

export type Lib_Utility_IsPanelAlarmActive_IgnoreSensorProblem = boolean;

export type Lib_Utility_IsPanelAlarmActive_Returns = boolean;

export type Lib_Utility_IsPanelAlarmActive_HasDisarmedTroubleButtons = boolean;

export type Lib_Utility_IsPanelAlarmActive_OrbSecurityButtonButtonText = Constant_PortalPanelArmButtonText | Constant_PortalPanelArmButtonLoadingText | null;

/**
 * Lib - Utility - Is Plugin Outdated.
 *
 * @since 1.0.0
 */
export type Lib_Utility_IsPluginOutdated_Returns = Promise<boolean>;

export type Lib_Utility_IsPluginOutdated_CurrentVersion = string;

export type Lib_Utility_IsPluginOutdated_Response = AxiosResponse;

export type Lib_Utility_IsPluginOutdated_ResponseDataVersion = string;

export type Lib_Utility_IsPluginOutdated_ResponseData = {
  version?: Lib_Utility_IsPluginOutdated_ResponseDataVersion;
} | null | undefined;

export type Lib_Utility_IsPluginOutdated_FetchedVersion = string | undefined;

/**
 * Lib - Utility - Is Portal Sync Code.
 *
 * @since 1.0.0
 */
export type Lib_Utility_IsPortalSyncCode_SyncCode = string;

export type Lib_Utility_IsPortalSyncCode_TypeGuard = Constant_PortalSyncCode;

/**
 * Lib - Utility - Is Session Clean State.
 *
 * @since 1.0.0
 */
export type Lib_Utility_IsSessionCleanState_OrbSecurityButtons = Shared_OrbSecurityButtons;

export type Lib_Utility_IsSessionCleanState_Returns = boolean;

export type Lib_Utility_IsSessionCleanState_ReadyButton = Shared_OrbSecurityButtonBase & Shared_OrbSecurityButtonReady;

/**
 * Lib - Utility - Is Unknown Do Submit Handler Collection.
 *
 * @since 1.0.0
 */
export type Lib_Utility_IsUnknownDoSubmitHandlerCollection_Handlers = Shared_DoSubmitHandlers;

export type Lib_Utility_IsUnknownDoSubmitHandlerCollection_Returns = boolean;

export type Lib_Utility_IsUnknownDoSubmitHandlerCollection_CurrentHandlerHref = Constant_PortalPanelForceArmButtonHref;

export type Lib_Utility_IsUnknownDoSubmitHandlerCollection_CurrentHandler = {
  href: Lib_Utility_IsUnknownDoSubmitHandlerCollection_CurrentHandlerHref;
};

export type Lib_Utility_IsUnknownDoSubmitHandlerCollection_CurrentHandlerCollection = Lib_Utility_IsUnknownDoSubmitHandlerCollection_CurrentHandler[];

/**
 * Lib - Utility - Is Unknown Gateway Device.
 *
 * @since 1.0.0
 */
export type Lib_Utility_IsUnknownGatewayDevice_Gateway = Record<string, string[]>;

export type Lib_Utility_IsUnknownGatewayDevice_Returns = boolean;

export type Lib_Utility_IsUnknownGatewayDevice_CurrentGatewayManufacturer = string | null;

export type Lib_Utility_IsUnknownGatewayDevice_CurrentGatewayModel = string | null;

export type Lib_Utility_IsUnknownGatewayDevice_CurrentGatewayPrimaryConnectionType = string | null;

export type Lib_Utility_IsUnknownGatewayDevice_CurrentGateway = {
  manufacturer: Lib_Utility_IsUnknownGatewayDevice_CurrentGatewayManufacturer;
  model: Lib_Utility_IsUnknownGatewayDevice_CurrentGatewayModel;
  primaryConnectionType: Lib_Utility_IsUnknownGatewayDevice_CurrentGatewayPrimaryConnectionType;
};

/**
 * Lib - Utility - Is Unknown Orb Security Button Collection.
 *
 * @since 1.0.0
 */
export type Lib_Utility_IsUnknownOrbSecurityButtonCollection_Buttons = Shared_OrbSecurityButtons;

export type Lib_Utility_IsUnknownOrbSecurityButtonCollection_Returns = boolean;

export type Lib_Utility_IsUnknownOrbSecurityButtonCollection_CurrentButtonButtonDisabled = boolean;

export type Lib_Utility_IsUnknownOrbSecurityButtonCollection_CurrentButtonButtonText = Constant_PortalPanelArmButtonText | Constant_PortalPanelArmButtonLoadingText | null;

export type Lib_Utility_IsUnknownOrbSecurityButtonCollection_CurrentButtonLoadingText = Constant_PortalPanelArmButtonLoadingText | null;

export type Lib_Utility_IsUnknownOrbSecurityButtonCollection_CurrentButton = {
  buttonDisabled: Lib_Utility_IsUnknownOrbSecurityButtonCollection_CurrentButtonButtonDisabled;
  buttonText: Lib_Utility_IsUnknownOrbSecurityButtonCollection_CurrentButtonButtonText;
  loadingText: Lib_Utility_IsUnknownOrbSecurityButtonCollection_CurrentButtonLoadingText;
};

export type Lib_Utility_IsUnknownOrbSecurityButtonCollection_CurrentButtonCollection = Lib_Utility_IsUnknownOrbSecurityButtonCollection_CurrentButton[];

/**
 * Lib - Utility - Is Unknown Panel Device.
 *
 * @since 1.0.0
 */
export type Lib_Utility_IsUnknownPanelDevice_Panel = Record<string, string[]>;

export type Lib_Utility_IsUnknownPanelDevice_Returns = boolean;

export type Lib_Utility_IsUnknownPanelDevice_CurrentPanelManufacturerProvider = string | null;

export type Lib_Utility_IsUnknownPanelDevice_CurrentPanelTypeModel = string | null;

export type Lib_Utility_IsUnknownPanelDevice_CurrentPanel = {
  manufacturerProvider: Lib_Utility_IsUnknownPanelDevice_CurrentPanelManufacturerProvider;
  typeModel: Lib_Utility_IsUnknownPanelDevice_CurrentPanelTypeModel;
};

/**
 * Lib - Utility - Parse Arm Disarm Message.
 *
 * @since 1.0.0
 */
export type Lib_Utility_ParseArmDisarmMessage_Element = Element | null;

export type Lib_Utility_ParseArmDisarmMessage_Returns = string | null;

/**
 * Lib - Utility - Parse Do Submit Handlers.
 *
 * @since 1.0.0
 */
export type Lib_Utility_ParseDoSubmitHandlers_Elements = NodeListOf<Element>;

export type Lib_Utility_ParseDoSubmitHandlers_Returns = Shared_DoSubmitHandlers;

export type Lib_Utility_ParseDoSubmitHandlers_Handlers = Shared_DoSubmitHandlers;

export type Lib_Utility_ParseDoSubmitHandlers_OnClick = string | null;

export type Lib_Utility_ParseDoSubmitHandlers_RelativeUrl = Constant_PortalPanelForceArmButtonRelativeUrl;

export type Lib_Utility_ParseDoSubmitHandlers_UrlParamsSat = string;

export type Lib_Utility_ParseDoSubmitHandlers_UrlParamsHref = Constant_PortalPanelForceArmButtonHref;

export type Lib_Utility_ParseDoSubmitHandlers_UrlParamsArmState = Constant_PortalPanelArmStateForce | '';

export type Lib_Utility_ParseDoSubmitHandlers_UrlParamsArm = Exclude<Constant_PortalPanelArmValue, 'off'> | '';

/**
 * Lib - Utility - Parse Multi Factor Methods.
 *
 * @since 1.0.0
 */
export type Lib_Utility_ParseMultiFactorMethods_Response = z.infer<typeof multiFactorAuth>;

export type Lib_Utility_ParseMultiFactorMethods_Returns = Shared_MfaDevice[];

export type Lib_Utility_ParseMultiFactorMethods_Methods = Shared_MfaDevice[];

export type Lib_Utility_ParseMultiFactorMethods_MfaPropertyId = string;

export type Lib_Utility_ParseMultiFactorMethods_MfaPropertyType = Shared_MfaDevice_Type;

export type Lib_Utility_ParseMultiFactorMethods_MfaPropertyLabel = string;

/**
 * Lib - Utility - Parse Multi Factor Trusted Devices.
 *
 * @since 1.0.0
 */
export type Lib_Utility_ParseMultiFactorTrustedDevices_Response = z.infer<typeof multiFactorAuth>;

export type Lib_Utility_ParseMultiFactorTrustedDevices_Returns = Shared_MfaTrustedDevice[];

export type Lib_Utility_ParseMultiFactorTrustedDevices_Devices = Shared_MfaTrustedDevice[];

export type Lib_Utility_ParseMultiFactorTrustedDevices_TrustedDeviceId = string;

export type Lib_Utility_ParseMultiFactorTrustedDevices_TrustedDeviceName = string;

/**
 * Lib - Utility - Parse Orb Security Buttons.
 *
 * @since 1.0.0
 */
export type Lib_Utility_ParseOrbSecurityButtons_Elements = NodeListOf<Element>;

export type Lib_Utility_ParseOrbSecurityButtons_Returns = Shared_OrbSecurityButtons;

export type Lib_Utility_ParseOrbSecurityButtons_Buttons = Shared_OrbSecurityButtons;

export type Lib_Utility_ParseOrbSecurityButtons_Disabled = string | null;

export type Lib_Utility_ParseOrbSecurityButtons_Id = string | null;

export type Lib_Utility_ParseOrbSecurityButtons_Value = string | null;

export type Lib_Utility_ParseOrbSecurityButtons_OnClick = string | null;

export type Lib_Utility_ParseOrbSecurityButtons_ButtonId = Constant_PortalPanelArmButtonId | null;

export type Lib_Utility_ParseOrbSecurityButtons_PendingButtonText = Constant_PortalPanelArmButtonLoadingText | null;

export type Lib_Utility_ParseOrbSecurityButtons_ReadyButtonText = Constant_PortalPanelArmButtonText | null;

export type Lib_Utility_ParseOrbSecurityButtons_RelativeUrl = Constant_PortalPanelArmButtonRelativeUrl;

export type Lib_Utility_ParseOrbSecurityButtons_LoadingText = Constant_PortalPanelArmButtonLoadingText;

export type Lib_Utility_ParseOrbSecurityButtons_ButtonIndex = number;

export type Lib_Utility_ParseOrbSecurityButtons_TotalButtons = number;

export type Lib_Utility_ParseOrbSecurityButtons_ChangeAccessCode = boolean;

export type Lib_Utility_ParseOrbSecurityButtons_UrlParamsHref = Constant_PortalPanelArmButtonHref;

export type Lib_Utility_ParseOrbSecurityButtons_UrlParamsArmState = '' | Constant_PortalPanelArmStateClean | Constant_PortalPanelArmStateDirty;

export type Lib_Utility_ParseOrbSecurityButtons_UrlParamsArm = Constant_PortalPanelArmValue;

export type Lib_Utility_ParseOrbSecurityButtons_UrlParamsSat = string;

/**
 * Lib - Utility - Parse Orb Sensors.
 *
 * @since 1.0.0
 */
export type Lib_Utility_ParseOrbSensors_Elements = NodeListOf<Element>;

export type Lib_Utility_ParseOrbSensors_Returns = Shared_SensorStatus[];

export type Lib_Utility_ParseOrbSensors_Sensors = Shared_SensorStatus[];

export type Lib_Utility_ParseOrbSensors_Canvas = Element | null;

export type Lib_Utility_ParseOrbSensors_Name = Element | null;

export type Lib_Utility_ParseOrbSensors_Zone = Element | null;

export type Lib_Utility_ParseOrbSensors_Status = Element | null;

export type Lib_Utility_ParseOrbSensors_CanvasIcon = string | null;

export type Lib_Utility_ParseOrbSensors_NameText = string | null;

export type Lib_Utility_ParseOrbSensors_ZoneText = string | null;

export type Lib_Utility_ParseOrbSensors_StatusText = string | null;

export type Lib_Utility_ParseOrbSensors_CleanedIcon = Constant_PortalSensorStatusIcon;

export type Lib_Utility_ParseOrbSensors_CleanedName = string;

export type Lib_Utility_ParseOrbSensors_CleanedZone = number;

export type Lib_Utility_ParseOrbSensors_CleanedStatus = Constant_PortalSensorStatusText;

export type Lib_Utility_ParseOrbSensors_CleanedStatuses = Lib_Utility_ParseOrbSensors_CleanedStatus[];

/**
 * Lib - Utility - Parse Orb Text Summary.
 *
 * @since 1.0.0
 */
export type Lib_Utility_ParseOrbTextSummary_Element = Element | null;

export type Lib_Utility_ParseOrbTextSummary_Returns = Shared_PanelStatus;

export type Lib_Utility_ParseOrbTextSummary_CleanedNode = string;

export type Lib_Utility_ParseOrbTextSummary_RawSection = string[];

export type Lib_Utility_ParseOrbTextSummary_RawSections = Lib_Utility_ParseOrbTextSummary_RawSection[];

export type Lib_Utility_ParseOrbTextSummary_FinalParsed = Shared_PanelStatus;

export type Lib_Utility_ParseOrbTextSummary_StateItem = Constant_PortalPanelState;

export type Lib_Utility_ParseOrbTextSummary_StatusItem = Constant_PortalPanelStatus;

export type Lib_Utility_ParseOrbTextSummary_NoteItem = Constant_PortalPanelNote;

/**
 * Lib - Utility - Parse Sensors Table.
 *
 * @since 1.0.0
 */
export type Lib_Utility_ParseSensorsTable_Type = 'sensors-config' | 'sensors-information';

export type Lib_Utility_ParseSensorsTable_Elements = NodeListOf<Element>;

export type Lib_Utility_ParseSensorsTable_ReturnsByType<Type extends Lib_Utility_ParseSensorsTable_Type> =
  Type extends 'sensors-config' ? Shared_SensorConfig[]
    : Type extends 'sensors-information' ? Shared_SensorInformation[]
      : never;

export type Lib_Utility_ParseSensorsTable_Returns = Lib_Utility_ParseSensorsTable_ReturnsByType<Lib_Utility_ParseSensorsTable_Type>;

export type Lib_Utility_ParseSensorsTable_SensorsByType<Type extends Lib_Utility_ParseSensorsTable_Type> =
  Type extends 'sensors-config' ? Shared_SensorConfig[]
    : Type extends 'sensors-information' ? Shared_SensorInformation[]
      : never;

export type Lib_Utility_ParseSensorsTable_Sensors = Lib_Utility_ParseSensorsTable_SensorsByType<Lib_Utility_ParseSensorsTable_Type>;

export type Lib_Utility_ParseSensorsTable_AtSensorsSection = boolean;

export type Lib_Utility_ParseSensorsTable_ElementCount = number;

export type Lib_Utility_ParseSensorsTable_Title = Element | null;

export type Lib_Utility_ParseSensorsTable_Onclick = string | null;

export type Lib_Utility_ParseSensorsTable_Icon = Element | null;

export type Lib_Utility_ParseSensorsTable_Name = Element | null;

export type Lib_Utility_ParseSensorsTable_Zone = Element | null;

export type Lib_Utility_ParseSensorsTable_DeviceType = Element | null;

export type Lib_Utility_ParseSensorsTable_DeviceId = string;

export type Lib_Utility_ParseSensorsTable_IconTitle = string | null;

export type Lib_Utility_ParseSensorsTable_NameText = string | null;

export type Lib_Utility_ParseSensorsTable_ZoneText = string | null;

export type Lib_Utility_ParseSensorsTable_DeviceTypeText = string | null;

export type Lib_Utility_ParseSensorsTable_CleanedDeviceId = number;

export type Lib_Utility_ParseSensorsTable_CleanedDeviceType = Constant_PortalSensorDeviceType;

export type Lib_Utility_ParseSensorsTable_CleanedName = string;

export type Lib_Utility_ParseSensorsTable_CleanedStatus = Constant_PortalDeviceSensorStatus;

export type Lib_Utility_ParseSensorsTable_CleanedZone = number;

export type Lib_Utility_ParseSensorsTable_CondensedType = Constant_PluginDeviceSensorType | undefined;

export type Lib_Utility_ParseSensorsTable_ConfigSensors = Lib_Utility_ParseSensorsTable_SensorsByType<'sensors-config'>;

export type Lib_Utility_ParseSensorsTable_InformationSensors = Lib_Utility_ParseSensorsTable_SensorsByType<'sensors-information'>;

export type Lib_Utility_ParseSensorsTable_TitleText = string | null;

export type Lib_Utility_ParseSensorsTable_CleanedTitle = string;

/**
 * Lib - Utility - Remove Personal Identifiable Information.
 *
 * @since 1.0.0
 */
export type Lib_Utility_RemovePersonalIdentifiableInformation_Data = Record<string, unknown> | Record<string, unknown>[];

export type Lib_Utility_RemovePersonalIdentifiableInformation_Returns = Record<string, unknown> | Record<string, unknown>[];

export type Lib_Utility_RemovePersonalIdentifiableInformation_RedactedKey = string;

export type Lib_Utility_RemovePersonalIdentifiableInformation_RedactedKeys = Lib_Utility_RemovePersonalIdentifiableInformation_RedactedKey[];

export type Lib_Utility_RemovePersonalIdentifiableInformation_ReplacementText = string;

export type Lib_Utility_RemovePersonalIdentifiableInformation_Object = Record<string, unknown>;

export type Lib_Utility_RemovePersonalIdentifiableInformation_ReplaceValue = (object: Lib_Utility_RemovePersonalIdentifiableInformation_Object) => Lib_Utility_RemovePersonalIdentifiableInformation_ReplaceValue_Returns;

/**
 * Lib - Utility - Remove Personal Identifiable Information - Replace Value.
 *
 * @since 1.0.0
 */
export type Lib_Utility_RemovePersonalIdentifiableInformation_ReplaceValue_Returns = Record<string, unknown>;

export type Lib_Utility_RemovePersonalIdentifiableInformation_ReplaceValue_ModifiedObject = Record<string, unknown>;

export type Lib_Utility_RemovePersonalIdentifiableInformation_ReplaceValue_Value = unknown;

/**
 * Lib - Utility - Sleep.
 *
 * @since 1.0.0
 */
export type Lib_Utility_Sleep_Milliseconds = number;

export type Lib_Utility_Sleep_Returns = Promise<void>;

/**
 * Lib - Utility - Stack Tracer.
 *
 * @since 1.0.0
 */
export type Lib_Utility_StackTracer_Type = 'api-response' | 'config-content' | 'detect-content' | 'fake-ready-buttons' | 'log-status-changes' | 'serialize-error' | 'zod-error';

export type Lib_Utility_StackTracer_ErrorByType<Type extends Lib_Utility_StackTracer_Type> =
  Type extends 'api-response' ? Shared_ApiResponseFail<Shared_ApiResponseAction>
    : Type extends 'config-content' ? unknown
      : Type extends 'detect-content' ? Record<string, unknown> | Record<string, unknown>[]
        : Type extends 'fake-ready-buttons' ? {
          before: Shared_OrbSecurityButtons;
          after: Shared_OrbSecurityButtonBase & Shared_OrbSecurityButtonReady;
        }
          : Type extends 'log-status-changes' ? {
            old: Shared_SensorInformation[];
            new: Shared_SensorInformation[];
          }
            : Type extends 'serialize-error' ? ErrorObject
              : Type extends 'zod-error' ? z.ZodIssue[]
                : never;

export type Lib_Utility_StackTracer_Error = Lib_Utility_StackTracer_ErrorByType<Lib_Utility_StackTracer_Type>;

export type Lib_Utility_StackTracer_Returns = void;

export type Lib_Utility_StackTracer_StringError = string | undefined;
