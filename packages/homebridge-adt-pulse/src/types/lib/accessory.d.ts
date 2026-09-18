import type {
  API,
  Characteristic,
  CharacteristicValue,
  HapStatusError,
  Logger,
  Nullable,
  PlatformAccessory,
  Service,
} from 'homebridge';

import type { ADTPulseAPI } from '../../lib/api.js';
import type { Constant_PortalPanelArmValue } from '../constant.d.ts';
import type {
  Shared_Device,
  Shared_Device_Firmware,
  Shared_Device_Hardware,
  Shared_Device_Id,
  Shared_Device_Manufacturer,
  Shared_Device_Model,
  Shared_Device_Name,
  Shared_Device_OriginalName,
  Shared_Device_Serial,
  Shared_Device_Software,
  Shared_Device_Type,
  Shared_Device_Uuid,
  Shared_Device_Zone,
  Shared_PanelStatus_PanelStates,
  Shared_PanelStatus_PanelStatuses,
  Shared_SensorStatus,
  Shared_SensorStatus_Icon,
  Shared_SensorStatus_Statuses,
} from '../shared.d.ts';
import type {
  Lib_Platform_ADTPulsePlatform_Config,
  Lib_Platform_ADTPulsePlatform_State,
} from './platform.d.ts';

/**
 * Lib - Accessory - Accessory.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_Accessory = PlatformAccessory<Shared_Device>;

/**
 * Lib - Accessory - Activity.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_Activity_IsBusy = boolean;

export type Lib_Accessory_ADTPulseAccessory_Activity_SetCurrentValue = Nullable<CharacteristicValue>;

export type Lib_Accessory_ADTPulseAccessory_Activity_SetTargetValue = Nullable<CharacteristicValue>;

export type Lib_Accessory_ADTPulseAccessory_Activity_SetValue = Nullable<CharacteristicValue>;

export type Lib_Accessory_ADTPulseAccessory_Activity = {
  isBusy: Lib_Accessory_ADTPulseAccessory_Activity_IsBusy;
  setCurrentValue: Lib_Accessory_ADTPulseAccessory_Activity_SetCurrentValue;
  setTargetValue: Lib_Accessory_ADTPulseAccessory_Activity_SetTargetValue;
  setValue: Lib_Accessory_ADTPulseAccessory_Activity_SetValue;
};

/**
 * Lib - Accessory - Api.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_Api = API;

/**
 * Lib - Accessory - Characteristic.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_Characteristic = typeof Characteristic;

/**
 * Lib - Accessory - Config.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_Config = Lib_Platform_ADTPulsePlatform_Config;

/**
 * Lib - Accessory - Constructor.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_Constructor_Accessory = PlatformAccessory<Shared_Device>;

export type Lib_Accessory_ADTPulseAccessory_Constructor_State = Lib_Platform_ADTPulsePlatform_State;

export type Lib_Accessory_ADTPulseAccessory_Constructor_Config = Lib_Platform_ADTPulsePlatform_Config;

export type Lib_Accessory_ADTPulseAccessory_Constructor_Instance = ADTPulseAPI;

export type Lib_Accessory_ADTPulseAccessory_Constructor_Service = typeof Service;

export type Lib_Accessory_ADTPulseAccessory_Constructor_Characteristic = typeof Characteristic;

export type Lib_Accessory_ADTPulseAccessory_Constructor_Api = API;

export type Lib_Accessory_ADTPulseAccessory_Constructor_Log = Logger;

export type Lib_Accessory_ADTPulseAccessory_Constructor_Context = Shared_Device;

export type Lib_Accessory_ADTPulseAccessory_Constructor_Firmware = Shared_Device_Firmware;

export type Lib_Accessory_ADTPulseAccessory_Constructor_Hardware = Shared_Device_Hardware;

export type Lib_Accessory_ADTPulseAccessory_Constructor_Manufacturer = Shared_Device_Manufacturer;

export type Lib_Accessory_ADTPulseAccessory_Constructor_Model = Shared_Device_Model;

export type Lib_Accessory_ADTPulseAccessory_Constructor_Name = Shared_Device_Name;

export type Lib_Accessory_ADTPulseAccessory_Constructor_Serial = Shared_Device_Serial;

export type Lib_Accessory_ADTPulseAccessory_Constructor_Software = Shared_Device_Software;

export type Lib_Accessory_ADTPulseAccessory_Constructor_Type = Shared_Device_Type;

/**
 * Lib - Accessory - Get Panel Status.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Mode = 'alarmType' | 'current' | 'fault' | 'tamper' | 'target';

export type Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Returns = HapStatusError | Error | Nullable<CharacteristicValue>;

export type Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Context = Shared_Device;

export type Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Id = Shared_Device_Id;

export type Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Name = Shared_Device_Name;

export type Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Type = Shared_Device_Type;

export type Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Uuid = Shared_Device_Uuid;

export type Lib_Accessory_ADTPulseAccessory_GetPanelStatus_HapStatus = HapStatusError | undefined;

export type Lib_Accessory_ADTPulseAccessory_GetPanelStatus_PanelStates = Shared_PanelStatus_PanelStates;

export type Lib_Accessory_ADTPulseAccessory_GetPanelStatus_PanelStatuses = Shared_PanelStatus_PanelStatuses;

/**
 * Lib - Accessory - Get Panel Switch Status.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Returns = HapStatusError | Error | Nullable<CharacteristicValue>;

export type Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Context = Shared_Device;

export type Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Id = Shared_Device_Id;

export type Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Name = Shared_Device_Name;

export type Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Uuid = Shared_Device_Uuid;

export type Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_HapStatus = HapStatusError | undefined;

export type Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_PanelStatuses = Shared_PanelStatus_PanelStatuses;

/**
 * Lib - Accessory - Get Sensor Status.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Mode = 'active' | 'fault' | 'lowBattery' | 'status' | 'tamper';

export type Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Returns = HapStatusError | Error | Nullable<CharacteristicValue>;

export type Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Context = Shared_Device;

export type Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Id = Shared_Device_Id;

export type Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Name = Shared_Device_Name;

export type Lib_Accessory_ADTPulseAccessory_GetSensorStatus_OriginalName = Shared_Device_OriginalName;

export type Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Type = Shared_Device_Type;

export type Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Uuid = Shared_Device_Uuid;

export type Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Zone = Shared_Device_Zone;

export type Lib_Accessory_ADTPulseAccessory_GetSensorStatus_MatchedSensorStatus = Shared_SensorStatus | undefined;

export type Lib_Accessory_ADTPulseAccessory_GetSensorStatus_HapStatus = HapStatusError | undefined;

export type Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Icon = Shared_SensorStatus_Icon;

export type Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Statuses = Shared_SensorStatus_Statuses;

/**
 * Lib - Accessory - Instance.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_Instance = ADTPulseAPI;

/**
 * Lib - Accessory - Log.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_Log = Logger;

/**
 * Lib - Accessory - Services.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_Services = {
  Information?: Service;
  Primary?: Service;
};

/**
 * Lib - Accessory - Set Panel Status.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Arm = CharacteristicValue;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Returns = Promise<void>;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Context = Shared_Device;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Id = Shared_Device_Id;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Name = Shared_Device_Name;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Type = Shared_Device_Type;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Uuid = Shared_Device_Uuid;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_HapStatus = HapStatusError | undefined;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Result_Success = boolean;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Result = {
  success: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Result_Success;
};

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_UnknownArmValue = boolean;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_PanelStates = Shared_PanelStatus_PanelStates;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_CondensedPanelStates_ArmValue = Constant_PortalPanelArmValue;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_CondensedPanelStates_CharacteristicValue_Current = CharacteristicValue;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_CondensedPanelStates_CharacteristicValue_Target = CharacteristicValue;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_CondensedPanelStates_CharacteristicValue = {
  current: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_CondensedPanelStates_CharacteristicValue_Current;
  target: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_CondensedPanelStates_CharacteristicValue_Target;
};

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_CondensedPanelStates = {
  armValue: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_CondensedPanelStates_ArmValue;
  characteristicValue: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_CondensedPanelStates_CharacteristicValue;
} | undefined;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_IsAlarmActive = boolean;

export type Lib_Accessory_ADTPulseAccessory_SetPanelStatus_SetCurrentValue = CharacteristicValue | undefined;

/**
 * Lib - Accessory - Set Panel Switch Status.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_On = CharacteristicValue;

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Returns = Promise<void>;

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Context = Shared_Device;

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Id = Shared_Device_Id;

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Name = Shared_Device_Name;

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Type = Shared_Device_Type;

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Uuid = Shared_Device_Uuid;

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_HapStatus = HapStatusError | undefined;

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Result_Success = boolean;

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Result = {
  success: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Result_Success;
};

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_UnknownArmValue = boolean;

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_PanelStates = Shared_PanelStatus_PanelStates;

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_CondensedPanelStates_ArmValue = Constant_PortalPanelArmValue;

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_CondensedPanelStates_CharacteristicValue_Current = CharacteristicValue;

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_CondensedPanelStates_CharacteristicValue_Target = CharacteristicValue;

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_CondensedPanelStates_CharacteristicValue = {
  current: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_CondensedPanelStates_CharacteristicValue_Current;
  target: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_CondensedPanelStates_CharacteristicValue_Target;
};

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_CondensedPanelStates = {
  armValue: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_CondensedPanelStates_ArmValue;
  characteristicValue: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_CondensedPanelStates_CharacteristicValue;
} | undefined;

export type Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_IsAlarmActive = boolean;

/**
 * Lib - Accessory - State.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_State = Lib_Platform_ADTPulsePlatform_State;

/**
 * Lib - Accessory - Updater.
 *
 * @since 1.0.0
 */
export type Lib_Accessory_ADTPulseAccessory_Updater_Returns = void;

export type Lib_Accessory_ADTPulseAccessory_Updater_Context = Shared_Device;

export type Lib_Accessory_ADTPulseAccessory_Updater_Id = Shared_Device_Id;

export type Lib_Accessory_ADTPulseAccessory_Updater_Name = Shared_Device_Name;

export type Lib_Accessory_ADTPulseAccessory_Updater_Type = Shared_Device_Type;

export type Lib_Accessory_ADTPulseAccessory_Updater_Uuid = Shared_Device_Uuid;
