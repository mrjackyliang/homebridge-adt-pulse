import type { Logger } from 'homebridge';

import type { Constant_PluginDeviceSensorType } from '../constant.d.ts';
import type {
  Shared_DebugParser,
  Shared_DoSubmitHandlers,
  Shared_GatewayInformation,
  Shared_OrbSecurityButtons,
  Shared_PanelInformation,
  Shared_PanelStatus,
  Shared_PortalVersionContent,
  Shared_SensorInformation,
  Shared_SensorStatus,
  Shared_SensorStatus_Statuses,
} from '../shared.d.ts';
import type { Lib_Items_CollectionSensorAction } from './items.d.ts';

/**
 * Lib - Detect - API Do Submit Handlers.
 *
 * @since 1.0.0
 */
export type Lib_Detect_DetectApiDoSubmitHandlers_Handlers = Shared_DoSubmitHandlers;

export type Lib_Detect_DetectApiDoSubmitHandlers_Logger = Logger | null;

export type Lib_Detect_DetectApiDoSubmitHandlers_DebugMode = boolean | null;

export type Lib_Detect_DetectApiDoSubmitHandlers_Returns = Promise<boolean>;

export type Lib_Detect_DetectApiDoSubmitHandlers_DetectedNewHandlers = Shared_DoSubmitHandlers;

export type Lib_Detect_DetectApiDoSubmitHandlers_CleanedDataObject = Record<string, unknown>;

export type Lib_Detect_DetectApiDoSubmitHandlers_CleanedData = Lib_Detect_DetectApiDoSubmitHandlers_CleanedDataObject | Lib_Detect_DetectApiDoSubmitHandlers_CleanedDataObject[];

export type Lib_Detect_DetectApiDoSubmitHandlers_Outdated = boolean;

/**
 * Lib - Detect - API Gateway Information.
 *
 * @since 1.0.0
 */
export type Lib_Detect_DetectApiGatewayInformation_Device = Shared_GatewayInformation;

export type Lib_Detect_DetectApiGatewayInformation_Logger = Logger | null;

export type Lib_Detect_DetectApiGatewayInformation_DebugMode = boolean | null;

export type Lib_Detect_DetectApiGatewayInformation_Returns = Promise<boolean>;

export type Lib_Detect_DetectApiGatewayInformation_CleanedDataObject = Record<string, unknown>;

export type Lib_Detect_DetectApiGatewayInformation_CleanedData = Lib_Detect_DetectApiGatewayInformation_CleanedDataObject | Lib_Detect_DetectApiGatewayInformation_CleanedDataObject[];

export type Lib_Detect_DetectApiGatewayInformation_Outdated = boolean;

/**
 * Lib - Detect - API Orb Security Buttons.
 *
 * @since 1.0.0
 */
export type Lib_Detect_DetectApiOrbSecurityButtons_Buttons = Shared_OrbSecurityButtons;

export type Lib_Detect_DetectApiOrbSecurityButtons_Logger = Logger | null;

export type Lib_Detect_DetectApiOrbSecurityButtons_DebugMode = boolean | null;

export type Lib_Detect_DetectApiOrbSecurityButtons_Returns = Promise<boolean>;

export type Lib_Detect_DetectApiOrbSecurityButtons_DetectedNewButtons = Shared_OrbSecurityButtons;

export type Lib_Detect_DetectApiOrbSecurityButtons_CleanedDataObject = Record<string, unknown>;

export type Lib_Detect_DetectApiOrbSecurityButtons_CleanedData = Lib_Detect_DetectApiOrbSecurityButtons_CleanedDataObject | Lib_Detect_DetectApiOrbSecurityButtons_CleanedDataObject[];

export type Lib_Detect_DetectApiOrbSecurityButtons_Outdated = boolean;

/**
 * Lib - Detect - API Panel Information.
 *
 * @since 1.0.0
 */
export type Lib_Detect_DetectApiPanelInformation_Device = Shared_PanelInformation;

export type Lib_Detect_DetectApiPanelInformation_Logger = Logger | null;

export type Lib_Detect_DetectApiPanelInformation_DebugMode = boolean | null;

export type Lib_Detect_DetectApiPanelInformation_Returns = Promise<boolean>;

export type Lib_Detect_DetectApiPanelInformation_CleanedDataObject = Record<string, unknown>;

export type Lib_Detect_DetectApiPanelInformation_CleanedData = Lib_Detect_DetectApiPanelInformation_CleanedDataObject | Lib_Detect_DetectApiPanelInformation_CleanedDataObject[];

export type Lib_Detect_DetectApiPanelInformation_Outdated = boolean;

/**
 * Lib - Detect - API Panel Status.
 *
 * @since 1.0.0
 */
export type Lib_Detect_DetectApiPanelStatus_Summary = Shared_PanelStatus;

export type Lib_Detect_DetectApiPanelStatus_Logger = Logger | null;

export type Lib_Detect_DetectApiPanelStatus_DebugMode = boolean | null;

export type Lib_Detect_DetectApiPanelStatus_Returns = Promise<boolean>;

export type Lib_Detect_DetectApiPanelStatus_DetectedUnknownPieces = boolean;

export type Lib_Detect_DetectApiPanelStatus_CleanedDataObject = Record<string, unknown>;

export type Lib_Detect_DetectApiPanelStatus_CleanedData = Lib_Detect_DetectApiPanelStatus_CleanedDataObject | Lib_Detect_DetectApiPanelStatus_CleanedDataObject[];

export type Lib_Detect_DetectApiPanelStatus_Outdated = boolean;

/**
 * Lib - Detect - API Sensors Information.
 *
 * @since 1.0.0
 */
export type Lib_Detect_DetectApiSensorsInformation_Sensor = Shared_SensorInformation;

export type Lib_Detect_DetectApiSensorsInformation_Sensors = Lib_Detect_DetectApiSensorsInformation_Sensor[];

export type Lib_Detect_DetectApiSensorsInformation_Logger = Logger | null;

export type Lib_Detect_DetectApiSensorsInformation_DebugMode = boolean | null;

export type Lib_Detect_DetectApiSensorsInformation_Returns = Promise<boolean>;

export type Lib_Detect_DetectApiSensorsInformation_DetectedNewInformation = Lib_Detect_DetectApiSensorsInformation_Sensor[];

export type Lib_Detect_DetectApiSensorsInformation_CleanedDataObject = Record<string, unknown>;

export type Lib_Detect_DetectApiSensorsInformation_CleanedData = Lib_Detect_DetectApiSensorsInformation_CleanedDataObject | Lib_Detect_DetectApiSensorsInformation_CleanedDataObject[];

export type Lib_Detect_DetectApiSensorsInformation_Outdated = boolean;

/**
 * Lib - Detect - API Sensors Status.
 *
 * @since 1.0.0
 */
export type Lib_Detect_DetectApiSensorsStatus_Sensor = Shared_SensorStatus;

export type Lib_Detect_DetectApiSensorsStatus_Sensors = Lib_Detect_DetectApiSensorsStatus_Sensor[];

export type Lib_Detect_DetectApiSensorsStatus_Logger = Logger | null;

export type Lib_Detect_DetectApiSensorsStatus_DebugMode = boolean | null;

export type Lib_Detect_DetectApiSensorsStatus_Returns = Promise<boolean>;

export type Lib_Detect_DetectApiSensorsStatus_DetectedNewStatuses = Lib_Detect_DetectApiSensorsStatus_Sensor[];

export type Lib_Detect_DetectApiSensorsStatus_CleanedDataObject = Record<string, unknown>;

export type Lib_Detect_DetectApiSensorsStatus_CleanedData = Lib_Detect_DetectApiSensorsStatus_CleanedDataObject | Lib_Detect_DetectApiSensorsStatus_CleanedDataObject[];

export type Lib_Detect_DetectApiSensorsStatus_Outdated = boolean;

/**
 * Lib - Detect - Global Debug Parser.
 *
 * @since 1.0.0
 */
export type Lib_Detect_DetectGlobalDebugParser_Data = Shared_DebugParser<'forceArmHandler'> | Shared_DebugParser<'generateSensorsConfig'> | Shared_DebugParser<'getGatewayInformation'> | Shared_DebugParser<'getOrbSecurityButtons'> | Shared_DebugParser<'getPanelInformation'> | Shared_DebugParser<'getPanelStatus'> | Shared_DebugParser<'getSensorsInformation'> | Shared_DebugParser<'getSensorsStatus'>;

export type Lib_Detect_DetectGlobalDebugParser_Logger = Logger | null;

export type Lib_Detect_DetectGlobalDebugParser_DebugMode = boolean | null;

export type Lib_Detect_DetectGlobalDebugParser_Returns = Promise<boolean>;

export type Lib_Detect_DetectGlobalDebugParser_ForceArmHandlerAnomaly = boolean;

export type Lib_Detect_DetectGlobalDebugParser_GenerateSensorsConfigAnomaly = boolean;

export type Lib_Detect_DetectGlobalDebugParser_GetGatewayInformationAnomaly = boolean;

export type Lib_Detect_DetectGlobalDebugParser_GetOrbSecurityButtonsAnomaly = boolean;

export type Lib_Detect_DetectGlobalDebugParser_GetPanelInformationAnomaly = boolean;

export type Lib_Detect_DetectGlobalDebugParser_GetPanelStatusAnomaly = boolean;

export type Lib_Detect_DetectGlobalDebugParser_GetSensorsInformationAnomaly = boolean;

export type Lib_Detect_DetectGlobalDebugParser_GetSensorsStatusAnomaly = boolean;

export type Lib_Detect_DetectGlobalDebugParser_CleanedDataObject = Record<string, unknown>;

export type Lib_Detect_DetectGlobalDebugParser_CleanedData = Lib_Detect_DetectGlobalDebugParser_CleanedDataObject | Lib_Detect_DetectGlobalDebugParser_CleanedDataObject[];

export type Lib_Detect_DetectGlobalDebugParser_LoggedData = Partial<Lib_Detect_DetectGlobalDebugParser_CleanedDataObject | Lib_Detect_DetectGlobalDebugParser_CleanedDataObject[]>;

export type Lib_Detect_DetectGlobalDebugParser_Outdated = boolean;

/**
 * Lib - Detect - Global Portal Version.
 *
 * @since 1.0.0
 */
export type Lib_Detect_DetectGlobalPortalVersion_Version = Shared_PortalVersionContent;

export type Lib_Detect_DetectGlobalPortalVersion_Logger = Logger | null;

export type Lib_Detect_DetectGlobalPortalVersion_DebugMode = boolean | null;

export type Lib_Detect_DetectGlobalPortalVersion_Returns = Promise<boolean>;

export type Lib_Detect_DetectGlobalPortalVersion_CleanedDataObject = Record<string, unknown>;

export type Lib_Detect_DetectGlobalPortalVersion_CleanedData = Lib_Detect_DetectGlobalPortalVersion_CleanedDataObject | Lib_Detect_DetectGlobalPortalVersion_CleanedDataObject[];

export type Lib_Detect_DetectGlobalPortalVersion_Outdated = boolean;

/**
 * Lib - Detect - Platform Unknown Sensors Action.
 *
 * @since 1.0.0
 */
export type Lib_Detect_DetectPlatformUnknownSensorsAction_SensorInfo = Shared_SensorInformation;

export type Lib_Detect_DetectPlatformUnknownSensorsAction_SensorStatus = Shared_SensorStatus;

export type Lib_Detect_DetectPlatformUnknownSensorsAction_SensorType = Constant_PluginDeviceSensorType | undefined;

export type Lib_Detect_DetectPlatformUnknownSensorsAction_Sensor = {
  info: Lib_Detect_DetectPlatformUnknownSensorsAction_SensorInfo;
  status: Lib_Detect_DetectPlatformUnknownSensorsAction_SensorStatus;
  type: Lib_Detect_DetectPlatformUnknownSensorsAction_SensorType;
};

export type Lib_Detect_DetectPlatformUnknownSensorsAction_Sensors = Lib_Detect_DetectPlatformUnknownSensorsAction_Sensor[];

export type Lib_Detect_DetectPlatformUnknownSensorsAction_Logger = Logger | null;

export type Lib_Detect_DetectPlatformUnknownSensorsAction_DebugMode = boolean | null;

export type Lib_Detect_DetectPlatformUnknownSensorsAction_Returns = Promise<boolean>;

export type Lib_Detect_DetectPlatformUnknownSensorsAction_DetectedNewActions = Lib_Detect_DetectPlatformUnknownSensorsAction_Sensor[];

export type Lib_Detect_DetectPlatformUnknownSensorsAction_SensorStatusStatuses = Shared_SensorStatus_Statuses;

export type Lib_Detect_DetectPlatformUnknownSensorsAction_StringifiedStatuses = string;

export type Lib_Detect_DetectPlatformUnknownSensorsAction_CurrentType = Lib_Items_CollectionSensorAction | undefined;

export type Lib_Detect_DetectPlatformUnknownSensorsAction_CleanedDataObject = Record<string, unknown>;

export type Lib_Detect_DetectPlatformUnknownSensorsAction_CleanedData = Lib_Detect_DetectPlatformUnknownSensorsAction_CleanedDataObject | Lib_Detect_DetectPlatformUnknownSensorsAction_CleanedDataObject[];

export type Lib_Detect_DetectPlatformUnknownSensorsAction_Outdated = boolean;
