import chalk from 'chalk';

import { itemCondensedSensorTypes } from './items.js';
import {
  condensePanelStates,
  convertPanelCharacteristicValue,
  isPanelAlarmActive,
  stackTracer,
} from './utility.js';

import type {
  Lib_Accessory_ADTPulseAccessory_Accessory,
  Lib_Accessory_ADTPulseAccessory_Activity,
  Lib_Accessory_ADTPulseAccessory_Api,
  Lib_Accessory_ADTPulseAccessory_Characteristic,
  Lib_Accessory_ADTPulseAccessory_Config,
  Lib_Accessory_ADTPulseAccessory_Constructor_Accessory,
  Lib_Accessory_ADTPulseAccessory_Constructor_Api,
  Lib_Accessory_ADTPulseAccessory_Constructor_Characteristic,
  Lib_Accessory_ADTPulseAccessory_Constructor_Config,
  Lib_Accessory_ADTPulseAccessory_Constructor_Context,
  Lib_Accessory_ADTPulseAccessory_Constructor_Firmware,
  Lib_Accessory_ADTPulseAccessory_Constructor_Hardware,
  Lib_Accessory_ADTPulseAccessory_Constructor_Instance,
  Lib_Accessory_ADTPulseAccessory_Constructor_Log,
  Lib_Accessory_ADTPulseAccessory_Constructor_Manufacturer,
  Lib_Accessory_ADTPulseAccessory_Constructor_Model,
  Lib_Accessory_ADTPulseAccessory_Constructor_Name,
  Lib_Accessory_ADTPulseAccessory_Constructor_Serial,
  Lib_Accessory_ADTPulseAccessory_Constructor_Service,
  Lib_Accessory_ADTPulseAccessory_Constructor_Software,
  Lib_Accessory_ADTPulseAccessory_Constructor_State,
  Lib_Accessory_ADTPulseAccessory_Constructor_Type,
  Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Context,
  Lib_Accessory_ADTPulseAccessory_GetPanelStatus_HapStatus,
  Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Id,
  Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Mode,
  Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Name,
  Lib_Accessory_ADTPulseAccessory_GetPanelStatus_PanelStates,
  Lib_Accessory_ADTPulseAccessory_GetPanelStatus_PanelStatuses,
  Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Returns,
  Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Type,
  Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Uuid,
  Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Context,
  Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_HapStatus,
  Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Id,
  Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Name,
  Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_PanelStatuses,
  Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Returns,
  Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Uuid,
  Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Context,
  Lib_Accessory_ADTPulseAccessory_GetSensorStatus_HapStatus,
  Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Icon,
  Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Id,
  Lib_Accessory_ADTPulseAccessory_GetSensorStatus_MatchedSensorStatus,
  Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Mode,
  Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Name,
  Lib_Accessory_ADTPulseAccessory_GetSensorStatus_OriginalName,
  Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Returns,
  Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Statuses,
  Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Type,
  Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Uuid,
  Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Zone,
  Lib_Accessory_ADTPulseAccessory_Instance,
  Lib_Accessory_ADTPulseAccessory_Log,
  Lib_Accessory_ADTPulseAccessory_Services,
  Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Arm,
  Lib_Accessory_ADTPulseAccessory_SetPanelStatus_CondensedPanelStates,
  Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Context,
  Lib_Accessory_ADTPulseAccessory_SetPanelStatus_HapStatus,
  Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Id,
  Lib_Accessory_ADTPulseAccessory_SetPanelStatus_IsAlarmActive,
  Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Name,
  Lib_Accessory_ADTPulseAccessory_SetPanelStatus_PanelStates,
  Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Result,
  Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Returns,
  Lib_Accessory_ADTPulseAccessory_SetPanelStatus_SetCurrentValue,
  Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Type,
  Lib_Accessory_ADTPulseAccessory_SetPanelStatus_UnknownArmValue,
  Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Uuid,
  Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_CondensedPanelStates,
  Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Context,
  Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_HapStatus,
  Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Id,
  Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_IsAlarmActive,
  Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Name,
  Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_On,
  Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_PanelStates,
  Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Result,
  Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Returns,
  Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Type,
  Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_UnknownArmValue,
  Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Uuid,
  Lib_Accessory_ADTPulseAccessory_State,
  Lib_Accessory_ADTPulseAccessory_Updater_Context,
  Lib_Accessory_ADTPulseAccessory_Updater_Id,
  Lib_Accessory_ADTPulseAccessory_Updater_Name,
  Lib_Accessory_ADTPulseAccessory_Updater_Returns,
  Lib_Accessory_ADTPulseAccessory_Updater_Type,
  Lib_Accessory_ADTPulseAccessory_Updater_Uuid,
} from '../types/lib/accessory.d.ts';

/**
 * Lib - Accessory.
 *
 * Bridges a single ADT Pulse device into HomeKit by wiring its services and
 * characteristics, then keeping those values in sync with the portal state.
 *
 * @since 1.0.0
 */
export class ADTPulseAccessory {
  /**
   * Lib - Accessory - Accessory.
   *
   * Holds the HomeKit platform accessory that this class manages. All services
   * and characteristics are registered against this object.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #accessory: Lib_Accessory_ADTPulseAccessory_Accessory;

  /**
   * Lib - Accessory - Activity.
   *
   * Tracks whether the accessory is busy setting a panel state along with the
   * values being set, so getters can report in-flight states to HomeKit.
   *
   * @private
   *
   * @since 1.0.0
   */
  #activity: Lib_Accessory_ADTPulseAccessory_Activity;

  /**
   * Lib - Accessory - Api.
   *
   * Stores the Homebridge API object, used mainly to construct HAP status
   * errors when a characteristic cannot be read or written.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #api: Lib_Accessory_ADTPulseAccessory_Api;

  /**
   * Lib - Accessory - Characteristic.
   *
   * References the HAP characteristic classes so the accessory can look up
   * characteristic constants without importing HAP directly.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #characteristic: Lib_Accessory_ADTPulseAccessory_Characteristic;

  /**
   * Lib - Accessory - Config.
   *
   * Keeps the parsed plugin configuration available so behavior toggles like
   * "ignoreSensorProblemStatus" can be honored at runtime.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #config: Lib_Accessory_ADTPulseAccessory_Config;

  /**
   * Lib - Accessory - Instance.
   *
   * Holds the ADT Pulse API instance used to send arm and disarm requests
   * whenever HomeKit sets the panel or panel switch state.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #instance: Lib_Accessory_ADTPulseAccessory_Instance;

  /**
   * Lib - Accessory - Log.
   *
   * Stores the Homebridge logger so status lookups and state changes can
   * report progress and failures to the Homebridge log.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #log: Lib_Accessory_ADTPulseAccessory_Log;

  /**
   * Lib - Accessory - Services.
   *
   * Caches the HAP services registered on this accessory, keyed by role, so
   * updates do not need to look services up on every refresh.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #services: Lib_Accessory_ADTPulseAccessory_Services;

  /**
   * Lib - Accessory - State.
   *
   * References the platform's shared state object, which carries the latest
   * panel and sensor information fetched from the ADT Pulse portal.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #state: Lib_Accessory_ADTPulseAccessory_State;

  /**
   * Lib - Accessory - Constructor.
   *
   * Stores the injected dependencies, fills in the accessory information
   * service, and registers the primary service that matches the device type.
   *
   * @param {Lib_Accessory_ADTPulseAccessory_Constructor_Accessory}      accessory      - Accessory.
   * @param {Lib_Accessory_ADTPulseAccessory_Constructor_State}          state          - State.
   * @param {Lib_Accessory_ADTPulseAccessory_Constructor_Config}         config         - Config.
   * @param {Lib_Accessory_ADTPulseAccessory_Constructor_Instance}       instance       - Instance.
   * @param {Lib_Accessory_ADTPulseAccessory_Constructor_Service}        service        - Service.
   * @param {Lib_Accessory_ADTPulseAccessory_Constructor_Characteristic} characteristic - Characteristic.
   * @param {Lib_Accessory_ADTPulseAccessory_Constructor_Api}            api            - Api.
   * @param {Lib_Accessory_ADTPulseAccessory_Constructor_Log}            log            - Log.
   *
   * @since 1.0.0
   */
  public constructor(accessory: Lib_Accessory_ADTPulseAccessory_Constructor_Accessory, state: Lib_Accessory_ADTPulseAccessory_Constructor_State, config: Lib_Accessory_ADTPulseAccessory_Constructor_Config, instance: Lib_Accessory_ADTPulseAccessory_Constructor_Instance, service: Lib_Accessory_ADTPulseAccessory_Constructor_Service, characteristic: Lib_Accessory_ADTPulseAccessory_Constructor_Characteristic, api: Lib_Accessory_ADTPulseAccessory_Constructor_Api, log: Lib_Accessory_ADTPulseAccessory_Constructor_Log) {
    this.#accessory = accessory;
    this.#activity = {
      isBusy: false,
      setCurrentValue: null,
      setTargetValue: null,
      setValue: null,
    };
    this.#api = api;
    this.#characteristic = characteristic;
    this.#config = config;
    this.#instance = instance;
    this.#log = log;
    this.#services = {};
    this.#state = state;

    const context: Lib_Accessory_ADTPulseAccessory_Constructor_Context = this.#accessory['context'];
    const firmware: Lib_Accessory_ADTPulseAccessory_Constructor_Firmware = context['firmware'];
    const hardware: Lib_Accessory_ADTPulseAccessory_Constructor_Hardware = context['hardware'];
    const manufacturer: Lib_Accessory_ADTPulseAccessory_Constructor_Manufacturer = context['manufacturer'];
    const model: Lib_Accessory_ADTPulseAccessory_Constructor_Model = context['model'];
    const name: Lib_Accessory_ADTPulseAccessory_Constructor_Name = context['name'];
    const serial: Lib_Accessory_ADTPulseAccessory_Constructor_Serial = context['serial'];
    const software: Lib_Accessory_ADTPulseAccessory_Constructor_Software = context['software'];
    const type: Lib_Accessory_ADTPulseAccessory_Constructor_Type = context['type'];

    // Set the "AccessoryInformation" service.
    this.#services.Information = this.#accessory.getService(service.AccessoryInformation) ?? this.#accessory.addService(service.AccessoryInformation);

    // Set the "AccessoryInformation" characteristics.
    this.#services['Information']
      .setCharacteristic(this.#characteristic.Identify, false)
      .setCharacteristic(this.#characteristic.Manufacturer, manufacturer ?? 'N/A')
      .setCharacteristic(this.#characteristic.Model, model ?? 'N/A')
      .setCharacteristic(this.#characteristic.Name, name)
      .setCharacteristic(this.#characteristic.SerialNumber, serial ?? 'N/A')
      .setCharacteristic(this.#characteristic.FirmwareRevision, firmware ?? 'N/A')
      .setCharacteristic(this.#characteristic.HardwareRevision, hardware ?? 'N/A')
      .setCharacteristic(this.#characteristic.SoftwareRevision, software ?? 'N/A');

    // Set the service associated with the gateway/panel.
    switch (type) {
      case 'gateway': {
        // No supported service available.
        break;
      }

      case 'panel': {
        this.#services.Primary = this.#accessory.getService(service.SecuritySystem) ?? this.#accessory.addService(service.SecuritySystem);

        break;
      }

      case 'panelSwitch': {
        this.#services.Primary = this.#accessory.getService(service.Switch) ?? this.#accessory.addService(service.Switch);

        break;
      }

      default: {
        break;
      }
    }

    // Set the service associated with the sensor.
    switch (type) {
      case 'co': {
        this.#services.Primary = this.#accessory.getService(service.CarbonMonoxideSensor) ?? this.#accessory.addService(service.CarbonMonoxideSensor);

        break;
      }

      case 'doorWindow': {
        this.#services.Primary = this.#accessory.getService(service.ContactSensor) ?? this.#accessory.addService(service.ContactSensor);

        break;
      }

      case 'fire': {
        this.#services.Primary = this.#accessory.getService(service.SmokeSensor) ?? this.#accessory.addService(service.SmokeSensor);

        break;
      }

      case 'flood': {
        this.#services.Primary = this.#accessory.getService(service.LeakSensor) ?? this.#accessory.addService(service.LeakSensor);

        break;
      }

      case 'glass': {
        this.#services.Primary = this.#accessory.getService(service.OccupancySensor) ?? this.#accessory.addService(service.OccupancySensor);

        break;
      }

      case 'heat': {
        this.#services.Primary = this.#accessory.getService(service.OccupancySensor) ?? this.#accessory.addService(service.OccupancySensor);

        break;
      }

      case 'motion': {
        this.#services.Primary = this.#accessory.getService(service.MotionSensor) ?? this.#accessory.addService(service.MotionSensor);

        break;
      }

      case 'shock': {
        this.#services.Primary = this.#accessory.getService(service.OccupancySensor) ?? this.#accessory.addService(service.OccupancySensor);

        break;
      }

      case 'temperature': {
        this.#services.Primary = this.#accessory.getService(service.TemperatureSensor) ?? this.#accessory.addService(service.TemperatureSensor);

        break;
      }

      default: {
        break;
      }
    }

    return;
  }

  /**
   * Lib - Accessory - Updater.
   *
   * Refreshes every characteristic on the accessory from the latest polled
   * state and attaches the setter hooks for panel and panel switch devices.
   *
   * @returns {Lib_Accessory_ADTPulseAccessory_Updater_Returns}
   *
   * @since 1.0.0
   */
  public updater(): Lib_Accessory_ADTPulseAccessory_Updater_Returns {
    const context: Lib_Accessory_ADTPulseAccessory_Updater_Context = this.#accessory['context'];
    const id: Lib_Accessory_ADTPulseAccessory_Updater_Id = context['id'];
    const name: Lib_Accessory_ADTPulseAccessory_Updater_Name = context['name'];
    const type: Lib_Accessory_ADTPulseAccessory_Updater_Type = context['type'];
    const uuid: Lib_Accessory_ADTPulseAccessory_Updater_Uuid = context['uuid'];

    // Check for missing services.
    if (this.#services['Primary'] === undefined) {
      // The "gateway" accessory does not need to be initialized further.
      if (type !== 'gateway') {
        this.#log.error(`Failed to update ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory because the primary service does not exist ...`);
      }

      return;
    }

    // Set the characteristics associated with the gateway/panel (required).
    switch (type) {
      case 'gateway': {
        // No supported service available.
        break;
      }

      case 'panel': {
        this.#services['Primary'].getCharacteristic(this.#characteristic.SecuritySystemCurrentState)
          .updateValue(this.getPanelStatus('current'));

        this.#services['Primary'].getCharacteristic(this.#characteristic.SecuritySystemTargetState)
          .updateValue(this.getPanelStatus('target'));

        this.#services['Primary'].getCharacteristic(this.#characteristic.SecuritySystemTargetState)
          .onSet(async (value) => this.setPanelStatus(value));

        break;
      }

      case 'panelSwitch': {
        this.#services['Primary'].getCharacteristic(this.#characteristic.On)
          .updateValue(this.getPanelSwitchStatus());

        this.#services['Primary'].getCharacteristic(this.#characteristic.On)
          .onSet(async (value) => this.setPanelSwitchStatus(value));

        break;
      }

      default: {
        break;
      }
    }

    // Set the characteristics associated with the gateway/panel (optional).
    switch (type) {
      case 'gateway': {
        // No supported service available.
        break;
      }

      case 'panel': {
        this.#services['Primary'].getCharacteristic(this.#characteristic.SecuritySystemAlarmType)
          .updateValue(this.getPanelStatus('alarmType'));

        this.#services['Primary'].getCharacteristic(this.#characteristic.StatusFault)
          .updateValue(this.getPanelStatus('fault'));

        this.#services['Primary'].getCharacteristic(this.#characteristic.StatusTampered)
          .updateValue(this.getPanelStatus('tamper'));

        break;
      }

      case 'panelSwitch': {
        // No optional services I'm interested in.
        break;
      }

      default: {
        break;
      }
    }

    // Set the characteristics associated with the sensor (required).
    switch (type) {
      case 'co': {
        this.#services['Primary'].getCharacteristic(this.#characteristic.CarbonMonoxideDetected)
          .updateValue(this.getSensorStatus('status'));

        break;
      }

      case 'doorWindow': {
        this.#services['Primary'].getCharacteristic(this.#characteristic.ContactSensorState)
          .updateValue(this.getSensorStatus('status'));

        break;
      }

      case 'fire': {
        this.#services['Primary'].getCharacteristic(this.#characteristic.SmokeDetected)
          .updateValue(this.getSensorStatus('status'));

        break;
      }

      case 'flood': {
        this.#services['Primary'].getCharacteristic(this.#characteristic.LeakDetected)
          .updateValue(this.getSensorStatus('status'));

        break;
      }

      case 'glass': {
        this.#services['Primary'].getCharacteristic(this.#characteristic.OccupancyDetected)
          .updateValue(this.getSensorStatus('status'));

        break;
      }

      case 'heat': {
        this.#services['Primary'].getCharacteristic(this.#characteristic.OccupancyDetected)
          .updateValue(this.getSensorStatus('status'));

        break;
      }

      case 'motion': {
        this.#services['Primary'].getCharacteristic(this.#characteristic.MotionDetected)
          .updateValue(this.getSensorStatus('status'));

        break;
      }

      case 'shock': {
        this.#services['Primary'].getCharacteristic(this.#characteristic.OccupancyDetected)
          .updateValue(this.getSensorStatus('status'));

        break;
      }

      case 'temperature': {
        this.#services['Primary'].getCharacteristic(this.#characteristic.CurrentTemperature)
          .updateValue(this.getSensorStatus('status'));

        break;
      }

      default: {
        break;
      }
    }

    // Set the characteristics associated with the sensor (optional).
    switch (type) {
      case 'co':
      case 'doorWindow':
      case 'fire':
      case 'flood':
      case 'glass':
      case 'heat':
      case 'motion':
      case 'shock':
      case 'temperature': {
        this.#services['Primary'].getCharacteristic(this.#characteristic.StatusActive)
          .updateValue(this.getSensorStatus('active'));

        this.#services['Primary'].getCharacteristic(this.#characteristic.StatusFault)
          .updateValue(this.getSensorStatus('fault'));

        this.#services['Primary'].getCharacteristic(this.#characteristic.StatusLowBattery)
          .updateValue(this.getSensorStatus('lowBattery'));

        this.#services['Primary'].getCharacteristic(this.#characteristic.StatusTampered)
          .updateValue(this.getSensorStatus('tamper'));

        break;
      }

      default: {
        break;
      }
    }

    return;
  }

  /**
   * Lib - Accessory - Get Sensor Status.
   *
   * Translates the polled sensor information into the HomeKit characteristic
   * value that matches the requested mode and the accessory's sensor type.
   *
   * @param {Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Mode} mode - Mode.
   *
   * @private
   *
   * @returns {Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Returns}
   *
   * @since 1.0.0
   */
  private getSensorStatus(mode: Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Mode): Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Returns {
    const context: Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Context = this.#accessory['context'];
    const id: Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Id = context['id'];
    const name: Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Name = context['name'];
    const originalName: Lib_Accessory_ADTPulseAccessory_GetSensorStatus_OriginalName = context['originalName'];
    const type: Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Type = context['type'];
    const uuid: Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Uuid = context['uuid'];
    const zone: Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Zone = context['zone'];

    const matchedSensorStatus: Lib_Accessory_ADTPulseAccessory_GetSensorStatus_MatchedSensorStatus = this.#state['data']['sensorsStatus'].find((sensorStatus) => (
      originalName === sensorStatus['name']
      && zone !== null
      && sensorStatus['zone'] === zone
    ));

    let hapStatus: Lib_Accessory_ADTPulseAccessory_GetSensorStatus_HapStatus = undefined;

    // If sensor is not found or sensor type is not supported.
    if (
      matchedSensorStatus === undefined
      || type === 'gateway'
      || type === 'panel'
      || type === 'panelSwitch'
      || itemCondensedSensorTypes.includes(type) === false
    ) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_DOES_NOT_EXIST);

      this.#log.error(`Attempted to get sensor status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but sensor is not found or sensor type is not supported.`);

      return hapStatus;
    }

    const icon: Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Icon = matchedSensorStatus['icon'];
    const statuses: Lib_Accessory_ADTPulseAccessory_GetSensorStatus_Statuses = matchedSensorStatus['statuses'];

    // Find the state for "Status Active" (optional characteristic).
    if (mode === 'active') {
      // If status or icon does not include these, the sensor is active.
      return (
        statuses.includes('Offline') === false
        && statuses.includes('Unknown') === false
        && icon !== 'devStatOffline'
        && icon !== 'devStatUnknown'
      );
    }

    // Find the state for "Status Fault" (optional characteristic).
    if (mode === 'fault') {
      // If status or icon includes these, the sensor has a fault.
      if (
        statuses.includes('ALARM') === true
        || statuses.includes('Bypassed') === true
        || statuses.includes('Trouble') === true
        || icon === 'devStatAlarm'
      ) {
        return this.#characteristic.StatusFault.GENERAL_FAULT;
      }

      return this.#characteristic.StatusFault.NO_FAULT;
    }

    // Find the state for "Status Low Battery" (optional characteristic).
    if (mode === 'lowBattery') {
      // If status or icon includes these, the sensor battery needs replacement.
      if (
        statuses.includes('Low Battery') === true
        || icon === 'devStatLowBatt'
      ) {
        return this.#characteristic.StatusLowBattery.BATTERY_LEVEL_LOW;
      }

      return this.#characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
    }

    // Find the state for "Status Tampered" (optional characteristic).
    if (mode === 'tamper') {
      // If status or icon includes these, the sensor is tampered.
      if (
        statuses.includes('Tampered') === true
        || icon === 'devStatTamper'
      ) {
        return this.#characteristic.StatusTampered.TAMPERED;
      }

      return this.#characteristic.StatusTampered.NOT_TAMPERED;
    }

    // Find the state for the sensor (required characteristic).
    switch (type) {
      case 'co': {
        if (statuses.includes('ALARM') === true || statuses.includes('Tripped') === true) {
          return this.#characteristic.CarbonMonoxideDetected.CO_LEVELS_ABNORMAL;
        }

        if (statuses.includes('Okay') === true) {
          return this.#characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL;
        }

        break;
      }

      case 'doorWindow': {
        if (statuses.includes('ALARM') === true || statuses.includes('Open') === true) {
          return this.#characteristic.ContactSensorState.CONTACT_NOT_DETECTED;
        }

        if (statuses.includes('Closed') === true) {
          return this.#characteristic.ContactSensorState.CONTACT_DETECTED;
        }

        break;
      }

      case 'fire': {
        if (statuses.includes('ALARM') === true || statuses.includes('Tripped') === true) {
          return this.#characteristic.SmokeDetected.SMOKE_DETECTED;
        }

        if (statuses.includes('Okay') === true) {
          return this.#characteristic.SmokeDetected.SMOKE_NOT_DETECTED;
        }

        break;
      }

      case 'flood': {
        if (statuses.includes('ALARM') === true || statuses.includes('Tripped') === true) {
          return this.#characteristic.LeakDetected.LEAK_DETECTED;
        }

        if (statuses.includes('Okay') === true) {
          return this.#characteristic.LeakDetected.LEAK_NOT_DETECTED;
        }

        break;
      }

      case 'glass': {
        if (statuses.includes('ALARM') === true || statuses.includes('Tripped') === true) {
          return this.#characteristic.OccupancyDetected.OCCUPANCY_DETECTED;
        }

        if (statuses.includes('Okay') === true) {
          return this.#characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED;
        }

        break;
      }

      case 'heat': {
        if (statuses.includes('ALARM') === true || statuses.includes('Tripped') === true) {
          return this.#characteristic.OccupancyDetected.OCCUPANCY_DETECTED;
        }

        if (statuses.includes('Okay') === true) {
          return this.#characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED;
        }

        break;
      }

      case 'motion': {
        if (statuses.includes('ALARM') === true || statuses.includes('Motion') === true) {
          return true;
        }

        if (statuses.includes('No Motion') === true || statuses.includes('Okay') === true) {
          return false;
        }

        break;
      }

      case 'shock': {
        if (statuses.includes('ALARM') === true || statuses.includes('Tripped') === true) {
          return this.#characteristic.OccupancyDetected.OCCUPANCY_DETECTED;
        }

        if (statuses.includes('Okay') === true) {
          return this.#characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED;
        }

        break;
      }

      case 'temperature': {
        /**
         * Since sensors from ADT do not show exact temperatures
         * and HomeKit does not support showing statuses in a binary way,
         * we will convert these responses to Celsius instead.
         *
         * - If temperature is normal, we represent it with 0.
         * - If temperature is abnormal, we represent it with 100.
         *
         * @since 1.0.0
         */
        if (statuses.includes('ALARM') === true || statuses.includes('Tripped') === true) {
          return 100;
        }

        if (statuses.includes('Okay') === true) {
          return 0;
        }

        break;
      }

      default: {
        break;
      }
    }

    // If sensor is currently "Offline" or "Unknown". Should be detected last to prevent breaking other modes (getting battery statuses, etc.).
    if (statuses.includes('Offline') === true || statuses.includes('Unknown') === true) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.NOT_ALLOWED_IN_CURRENT_STATE);

      this.#log.warn(`Attempted to get sensor status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but sensor is currently "Offline" or "Unknown".`);

      return hapStatus;
    }

    // Attempted to get sensor status, but actions have not been implemented yet.
    hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);

    this.#log.warn(`Attempted to get sensor status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but actions have not been implemented yet.`);

    return hapStatus;
  }

  /**
   * Lib - Accessory - Get Panel Status.
   *
   * Translates the polled panel state into the HomeKit security system value
   * for the requested mode, honoring any state change still in progress.
   *
   * @param {Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Mode} mode - Mode.
   *
   * @private
   *
   * @returns {Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Returns}
   *
   * @since 1.0.0
   */
  private getPanelStatus(mode: Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Mode): Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Returns {
    const context: Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Context = this.#accessory['context'];
    const id: Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Id = context['id'];
    const name: Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Name = context['name'];
    const type: Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Type = context['type'];
    const uuid: Lib_Accessory_ADTPulseAccessory_GetPanelStatus_Uuid = context['uuid'];

    let hapStatus: Lib_Accessory_ADTPulseAccessory_GetPanelStatus_HapStatus = undefined;

    // If device is not a security panel.
    if (type !== 'panel') {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);

      this.#log.error(`Attempted to get panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but device is not a security panel.`);

      return hapStatus;
    }

    // If panel status has not been retrieved yet.
    if (
      this.#state['data']['panelStatus'] === null
      || this.#state['data']['panelStatus']['panelStates'].length === 0
      || this.#state['data']['panelStatus']['panelStatuses'].length === 0
    ) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);

      this.#log.debug(`Attempted to get panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel status has not been retrieved yet.`);

      return hapStatus;
    }

    const panelStates: Lib_Accessory_ADTPulseAccessory_GetPanelStatus_PanelStates = this.#state['data']['panelStatus']['panelStates'];
    const panelStatuses: Lib_Accessory_ADTPulseAccessory_GetPanelStatus_PanelStatuses = this.#state['data']['panelStatus']['panelStatuses'];

    // Find the state for "Security System Alarm Type" (optional characteristic).
    if (mode === 'alarmType') {
      if (isPanelAlarmActive(
        panelStatuses,
        this.#state['data']['orbSecurityButtons'],
        (this.#config !== null) ? this.#config['options'].includes('ignoreSensorProblemStatus') : false,
      ) === true) {
        return 1;
      }

      return 0;
    }

    // Find the state for "Status Fault" (optional characteristic).
    if (mode === 'fault') {
      if (panelStatuses.includes('All Quiet') === false) {
        return this.#characteristic.StatusFault.GENERAL_FAULT;
      }

      return this.#characteristic.StatusFault.NO_FAULT;
    }

    // Find the state for "Status Tampered" (optional characteristic).
    if (mode === 'tamper') {
      if (panelStatuses.includes('Sensor Problem') === true || panelStatuses.includes('Sensor Problems') === true) {
        return this.#characteristic.StatusTampered.TAMPERED;
      }

      return this.#characteristic.StatusTampered.NOT_TAMPERED;
    }

    /**
     * Find the current state for the panel (required characteristic).
     *
     * Notes:
     * - If system is busy setting the state, HomeKit will receive the state user
     *   has set to before it becomes officially "set".
     *
     * @since 1.0.0
     */
    switch (true) {
      case mode === 'current'
        && this.#activity['isBusy']
        && this.#activity['setCurrentValue'] !== null: {
        return this.#activity['setCurrentValue'];
      }

      case mode === 'current' && isPanelAlarmActive(
        panelStatuses,
        this.#state['data']['orbSecurityButtons'],
        (this.#config !== null) ? this.#config['options'].includes('ignoreSensorProblemStatus') : false,
      ): {
        return this.#characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED;
      }

      case mode === 'current' && panelStates.includes('Armed Stay'): {
        return this.#characteristic.SecuritySystemCurrentState.STAY_ARM;
      }

      case mode === 'current' && panelStates.includes('Armed Away'): {
        return this.#characteristic.SecuritySystemCurrentState.AWAY_ARM;
      }

      case mode === 'current' && panelStates.includes('Armed Night'): {
        return this.#characteristic.SecuritySystemCurrentState.NIGHT_ARM;
      }

      case mode === 'current' && panelStates.includes('Disarmed'): {
        return this.#characteristic.SecuritySystemCurrentState.DISARMED;
      }

      default: {
        break;
      }
    }

    /**
     * Find the target state for the panel (required characteristic).
     *
     * Notes:
     * - If system is busy setting the state, HomeKit will receive the state user
     *   has set to before it becomes officially "set".
     *
     * @since 1.0.0
     */
    switch (true) {
      case mode === 'target'
        && this.#activity['isBusy']
        && this.#activity['setTargetValue'] !== null: {
        return this.#activity['setTargetValue'];
      }

      case mode === 'target' && panelStates.includes('Armed Stay'): {
        return this.#characteristic.SecuritySystemTargetState.STAY_ARM;
      }

      case mode === 'target' && panelStates.includes('Armed Away'): {
        return this.#characteristic.SecuritySystemTargetState.AWAY_ARM;
      }

      case mode === 'target' && panelStates.includes('Armed Night'): {
        return this.#characteristic.SecuritySystemTargetState.NIGHT_ARM;
      }

      case mode === 'target' && panelStates.includes('Disarmed'): {
        return this.#characteristic.SecuritySystemTargetState.DISARM;
      }

      default: {
        break;
      }
    }

    // If panel state is "Status Unavailable". Should be detected last to prevent breaking other modes (getting battery statuses, etc.).
    if (panelStates.includes('Status Unavailable') === true) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);

      this.#log.warn(`Attempted to get panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel state is "Status Unavailable".`);

      return hapStatus;
    }

    // Attempted to get panel status, but actions have not been implemented yet.
    hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);

    this.#log.warn(`Attempted to get panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but actions have not been implemented yet.`);

    return hapStatus;
  }

  /**
   * Lib - Accessory - Get Panel Switch Status.
   *
   * Reports whether the alarm is currently ringing so the panel switch can
   * reflect an active alarm that the user may want to turn off.
   *
   * @private
   *
   * @returns {Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Returns}
   *
   * @since 1.0.0
   */
  private getPanelSwitchStatus(): Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Returns {
    const context: Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Context = this.#accessory['context'];
    const id: Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Id = context['id'];
    const name: Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Name = context['name'];
    const uuid: Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_Uuid = context['uuid'];

    let hapStatus: Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_HapStatus = undefined;

    // If panel status has not been retrieved yet.
    if (this.#state['data']['panelStatus'] === null || this.#state['data']['panelStatus']['panelStatuses'].length === 0) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);

      this.#log.debug(`Attempted to get panel switch status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel switch status has not been retrieved yet.`);

      return hapStatus;
    }

    const panelStatuses: Lib_Accessory_ADTPulseAccessory_GetPanelSwitchStatus_PanelStatuses = this.#state['data']['panelStatus']['panelStatuses'];

    // If system is busy setting the state.
    if (this.#activity['isBusy'] === true && this.#activity['setValue'] !== null) {
      return this.#activity['setValue'];
    }

    // Only show as "On" if alarm is ringing.
    return isPanelAlarmActive(
      panelStatuses,
      this.#state['data']['orbSecurityButtons'],
      (this.#config !== null) ? this.#config['options'].includes('ignoreSensorProblemStatus') : false,
    );
  }

  /**
   * Lib - Accessory - Set Panel Status.
   *
   * Sends an arm or disarm request to the ADT Pulse portal when HomeKit sets
   * a new target state, marking the accessory busy while it completes.
   *
   * @param {Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Arm} arm - Arm.
   *
   * @private
   *
   * @returns {Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Returns}
   *
   * @since 1.0.0
   */
  private async setPanelStatus(arm: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Arm): Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Returns {
    const context: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Context = this.#accessory['context'];
    const id: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Id = context['id'];
    const name: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Name = context['name'];
    const type: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Type = context['type'];
    const uuid: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Uuid = context['uuid'];

    let hapStatus: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_HapStatus = undefined;
    let result: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_Result = {
      success: false,
    };
    let unknownArmValue: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_UnknownArmValue = false;

    // If device is not a security panel.
    if (type !== 'panel') {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);

      this.#log.error(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but device is not a security panel.`);

      throw hapStatus;
    }

    // If panel status has not been retrieved yet.
    if (this.#state['data']['panelStatus'] === null || this.#state['data']['panelStatus']['panelStates'].length === 0) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);

      this.#log.warn(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel status has not been retrieved yet.`);

      throw hapStatus;
    }

    const panelStates: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_PanelStates = this.#state['data']['panelStatus']['panelStates'];

    const condensedPanelStates: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_CondensedPanelStates = condensePanelStates(this.#characteristic, panelStates);
    const isAlarmActive: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_IsAlarmActive = isPanelAlarmActive(
      this.#state['data']['panelStatus']['panelStatuses'],
      this.#state['data']['orbSecurityButtons'],
      (this.#config !== null) ? this.#config['options'].includes('ignoreSensorProblemStatus') : false,
    );

    // If panel status cannot be found or most likely "Status Unavailable".
    if (condensedPanelStates === undefined) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);

      this.#log.warn(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel status cannot be found or most likely "Status Unavailable".`);

      throw hapStatus;
    }

    if (
      this.#activity['isBusy'] === false // The system isn't busy setting a state.
      && condensedPanelStates['characteristicValue']['target'] !== arm // If user is not setting to the current arm state (e.g. off to off).
    ) {
      const setCurrentValue: Lib_Accessory_ADTPulseAccessory_SetPanelStatus_SetCurrentValue = convertPanelCharacteristicValue('target-to-current', this.#characteristic, arm);

      // If attempt to convert characteristic value "target" to "current" failed.
      if (setCurrentValue === undefined) {
        hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);

        this.#log.error(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but current characteristic value does not exist.`);

        throw hapStatus;
      }

      // Set accessory activity to "busy" before arming.
      this.#activity = {
        isBusy: true,
        setCurrentValue,
        setTargetValue: arm,
        setValue: null,
      };

      // Set the panel status.
      switch (arm) {
        case this.#characteristic.SecuritySystemTargetState.STAY_ARM: {
          result = await this.#instance.setPanelStatus(condensedPanelStates['armValue'], 'stay', isAlarmActive);

          break;
        }

        case this.#characteristic.SecuritySystemTargetState.AWAY_ARM: {
          result = await this.#instance.setPanelStatus(condensedPanelStates['armValue'], 'away', isAlarmActive);

          break;
        }

        case this.#characteristic.SecuritySystemTargetState.NIGHT_ARM: {
          result = await this.#instance.setPanelStatus(condensedPanelStates['armValue'], 'night', isAlarmActive);

          break;
        }

        case this.#characteristic.SecuritySystemTargetState.DISARM: {
          result = await this.#instance.setPanelStatus(condensedPanelStates['armValue'], 'off', isAlarmActive);

          break;
        }

        default: {
          unknownArmValue = true;

          break;
        }
      }

      // Set accessory activity to "not busy" after arming.
      this.#activity = {
        isBusy: false,
        setCurrentValue: null,
        setTargetValue: null,
        setValue: null,
      };

      // If request has unknown arm value.
      if (unknownArmValue === true) {
        hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);

        this.#log.error(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but request has unknown arm value.`);

        throw hapStatus;
      }

      // If request was not successful.
      if (result['success'] === false) {
        hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.OPERATION_TIMED_OUT);

        this.#log.error(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but request was not successful.`);

        stackTracer('api-response', result);

        throw hapStatus;
      }
    }

    return;
  }

  /**
   * Lib - Accessory - Set Panel Switch Status.
   *
   * Allows the panel switch to silence a ringing alarm by sending a disarm
   * request; turning the switch on is rejected since it has no meaning.
   *
   * @param {Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_On} on - On.
   *
   * @private
   *
   * @returns {Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Returns}
   *
   * @since 1.0.0
   */
  private async setPanelSwitchStatus(on: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_On): Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Returns {
    const context: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Context = this.#accessory['context'];
    const id: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Id = context['id'];
    const name: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Name = context['name'];
    const type: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Type = context['type'];
    const uuid: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Uuid = context['uuid'];

    let hapStatus: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_HapStatus = undefined;
    let result: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_Result = {
      success: false,
    };
    let unknownArmValue: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_UnknownArmValue = false;

    // If device is not a panel switch.
    if (type !== 'panelSwitch') {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);

      this.#log.error(`Attempted to set panel switch status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but device is not a panel switch.`);

      throw hapStatus;
    }

    // If panel status has not been retrieved yet.
    if (this.#state['data']['panelStatus'] === null || this.#state['data']['panelStatus']['panelStates'].length === 0) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);

      this.#log.warn(`Attempted to set panel switch status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel status has not been retrieved yet.`);

      throw hapStatus;
    }

    // If user tries to turn on switch.
    if (on === true) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.SUCCESS);

      this.#log.error(`Attempted to set panel switch status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but switch is only used for turning off ringing alarm and clearing alarm.`);

      throw hapStatus;
    }

    const panelStates: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_PanelStates = this.#state['data']['panelStatus']['panelStates'];

    const condensedPanelStates: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_CondensedPanelStates = condensePanelStates(this.#characteristic, panelStates);
    const isAlarmActive: Lib_Accessory_ADTPulseAccessory_SetPanelSwitchStatus_IsAlarmActive = isPanelAlarmActive(
      this.#state['data']['panelStatus']['panelStatuses'],
      this.#state['data']['orbSecurityButtons'],
      (this.#config !== null) ? this.#config['options'].includes('ignoreSensorProblemStatus') : false,
    );

    // If panel status cannot be found or most likely "Status Unavailable".
    if (condensedPanelStates === undefined) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);

      this.#log.warn(`Attempted to set panel switch status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel status cannot be found or most likely "Status Unavailable".`);

      throw hapStatus;
    }

    if (
      this.#activity['isBusy'] === false // The system isn't busy setting a state.
      && isAlarmActive === true // If system alarm is ringing.
    ) {
      // Set accessory activity to "busy" before arming.
      this.#activity = {
        isBusy: true,
        setCurrentValue: null,
        setTargetValue: null,
        setValue: false,
      };

      // Set the panel status.
      try {
        switch (on) {
          case false: {
            result = await this.#instance.setPanelStatus(condensedPanelStates['armValue'], 'off', isAlarmActive);

            break;
          }

          default: {
            unknownArmValue = true;

            break;
          }
        }
      } finally {
        // Set accessory activity to "not busy" after arming.
        this.#activity = {
          isBusy: false,
          setCurrentValue: null,
          setTargetValue: null,
          setValue: null,
        };
      }

      // If request has unknown arm value.
      if (unknownArmValue === true) {
        hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);

        this.#log.error(`Attempted to set panel switch status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but request has unknown arm value.`);

        throw hapStatus;
      }

      // If request was not successful.
      if (result['success'] === false) {
        hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.OPERATION_TIMED_OUT);

        this.#log.error(`Attempted to set panel switch status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but request was not successful.`);

        stackTracer('api-response', result);

        throw hapStatus;
      }
    }

    return;
  }
}
