import chalk from 'chalk';

import { detectedUnknownAccessoryAction } from '@/lib/detect.js';
import { condensedSensorTypeItems } from '@/lib/items.js';
import { condensePanelStates, generateHash } from '@/lib/utility.js';
import type {
  ADTPulseAccessoryAccessory,
  ADTPulseAccessoryApi,
  ADTPulseAccessoryCharacteristic,
  ADTPulseAccessoryConstructorAccessory,
  ADTPulseAccessoryConstructorApi,
  ADTPulseAccessoryConstructorCharacteristic,
  ADTPulseAccessoryConstructorDebugMode,
  ADTPulseAccessoryConstructorInstance,
  ADTPulseAccessoryConstructorLog,
  ADTPulseAccessoryConstructorService,
  ADTPulseAccessoryConstructorState,
  ADTPulseAccessoryDebugMode,
  ADTPulseAccessoryGetPanelStatusContext,
  ADTPulseAccessoryGetPanelStatusMode,
  ADTPulseAccessoryGetPanelStatusReturns,
  ADTPulseAccessoryGetSensorStatusContext,
  ADTPulseAccessoryGetSensorStatusMode,
  ADTPulseAccessoryGetSensorStatusReturns,
  ADTPulseAccessoryInstance,
  ADTPulseAccessoryLog,
  ADTPulseAccessoryNewInformationDispatcherContext,
  ADTPulseAccessoryNewInformationDispatcherReturns,
  ADTPulseAccessoryNewInformationDispatcherStatus,
  ADTPulseAccessoryNewInformationDispatcherType,
  ADTPulseAccessoryReportedHashes,
  ADTPulseAccessoryServices,
  ADTPulseAccessorySetPanelStatusArm,
  ADTPulseAccessorySetPanelStatusContext,
  ADTPulseAccessorySetPanelStatusReturns,
  ADTPulseAccessoryState,
} from '@/types/index.d.ts';

/**
 * ADT Pulse Accessory.
 *
 * @since 1.0.0
 */
export class ADTPulseAccessory {
  /**
   * ADT Pulse Accessory - Accessory.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #accessory: ADTPulseAccessoryAccessory;

  /**
   * ADT Pulse Accessory - Api.
   *
   * @private
   *
   * @since 1.0.0
   */
  #api: ADTPulseAccessoryApi;

  /**
   * ADT Pulse Accessory - Characteristic.
   *
   * @private
   *
   * @since 1.0.0
   */
  #characteristic: ADTPulseAccessoryCharacteristic;

  /**
   * ADT Pulse Accessory - Debug mode.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #debugMode: ADTPulseAccessoryDebugMode;

  /**
   * ADT Pulse Accessory - Instance.
   *
   * @private
   *
   * @since 1.0.0
   */
  #instance: ADTPulseAccessoryInstance;

  /**
   * ADT Pulse Accessory - Log.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #log: ADTPulseAccessoryLog;

  /**
   * ADT Pulse Accessory - Reported hashes.
   *
   * @private
   *
   * @since 1.0.0
   */
  #reportedHashes: ADTPulseAccessoryReportedHashes;

  /**
   * ADT Pulse Accessory - Services.
   *
   * @private
   *
   * @since 1.0.0
   */
  #services: ADTPulseAccessoryServices;

  /**
   * ADT Pulse Accessory - State.
   *
   * @private
   *
   * @since 1.0.0
   */
  #state: ADTPulseAccessoryState;

  /**
   * ADT Pulse Accessory - Constructor.
   *
   * @param {ADTPulseAccessoryConstructorAccessory}      accessory      - Accessory.
   * @param {ADTPulseAccessoryConstructorState}          state          - State.
   * @param {ADTPulseAccessoryConstructorInstance}       instance       - Instance.
   * @param {ADTPulseAccessoryConstructorService}        service        - Service.
   * @param {ADTPulseAccessoryConstructorCharacteristic} characteristic - Characteristic.
   * @param {ADTPulseAccessoryConstructorApi}            api            - Api.
   * @param {ADTPulseAccessoryConstructorLog}            log            - Log.
   * @param {ADTPulseAccessoryConstructorDebugMode}      debugMode      - Debug mode.
   *
   * @since 1.0.0
   */
  public constructor(accessory: ADTPulseAccessoryConstructorAccessory, state: ADTPulseAccessoryConstructorState, instance: ADTPulseAccessoryConstructorInstance, service: ADTPulseAccessoryConstructorService, characteristic: ADTPulseAccessoryConstructorCharacteristic, api: ADTPulseAccessoryConstructorApi, log: ADTPulseAccessoryConstructorLog, debugMode: ADTPulseAccessoryConstructorDebugMode) {
    this.#accessory = accessory;
    this.#api = api;
    this.#characteristic = characteristic;
    this.#debugMode = debugMode;
    this.#instance = instance;
    this.#log = log;
    this.#reportedHashes = [];
    this.#services = {};
    this.#state = state;

    const { context } = this.#accessory;
    const {
      firmware,
      hardware,
      id,
      manufacturer,
      model,
      name,
      serial,
      software,
      type,
      uuid,
    } = context;

    // Set the "AccessoryInformation" service.
    this.#services.Information = this.#accessory.getService(service.AccessoryInformation) ?? this.#accessory.addService(service.AccessoryInformation);

    // Set the "AccessoryInformation" characteristics.
    this.#services.Information
      .setCharacteristic(this.#characteristic.Identify, false)
      .setCharacteristic(this.#characteristic.Manufacturer, manufacturer ?? 'ADT')
      .setCharacteristic(this.#characteristic.Model, model ?? 'N/A')
      .setCharacteristic(this.#characteristic.Name, name)
      .setCharacteristic(this.#characteristic.SerialNumber, serial ?? 'N/A')
      .setCharacteristic(this.#characteristic.FirmwareRevision, firmware ?? 'N/A')
      .setCharacteristic(this.#characteristic.HardwareRevision, hardware ?? 'N/A')
      .setCharacteristic(this.#characteristic.SoftwareRevision, software ?? 'N/A');

    // Set the service associated with the gateway/panel.
    switch (type) {
      case 'gateway':
        // No supported service available.
        break;
      case 'panel':
        this.#services.Primary = this.#accessory.getService(service.SecuritySystem) ?? this.#accessory.addService(service.SecuritySystem);
        break;
      default:
        break;
    }

    // Set the service associated with the sensor.
    switch (type) {
      case 'co':
        this.#services.Primary = this.#accessory.getService(service.CarbonMonoxideSensor) ?? this.#accessory.addService(service.CarbonMonoxideSensor);
        break;
      case 'doorWindow':
        this.#services.Primary = this.#accessory.getService(service.ContactSensor) ?? this.#accessory.addService(service.ContactSensor);
        break;
      case 'fire':
        this.#services.Primary = this.#accessory.getService(service.SmokeSensor) ?? this.#accessory.addService(service.SmokeSensor);
        break;
      case 'flood':
        this.#services.Primary = this.#accessory.getService(service.LeakSensor) ?? this.#accessory.addService(service.LeakSensor);
        break;
      case 'glass':
        this.#services.Primary = this.#accessory.getService(service.OccupancySensor) ?? this.#accessory.addService(service.OccupancySensor);
        break;
      case 'keypad':
        this.#services.Primary = this.#accessory.getService(service.OccupancySensor) ?? this.#accessory.addService(service.OccupancySensor);
        break;
      case 'motion':
        this.#services.Primary = this.#accessory.getService(service.MotionSensor) ?? this.#accessory.addService(service.MotionSensor);
        break;
      case 'panic':
        this.#services.Primary = this.#accessory.getService(service.OccupancySensor) ?? this.#accessory.addService(service.OccupancySensor);
        break;
      case 'shock':
        this.#services.Primary = this.#accessory.getService(service.OccupancySensor) ?? this.#accessory.addService(service.OccupancySensor);
        break;
      case 'supervisory':
        this.#services.Primary = this.#accessory.getService(service.OccupancySensor) ?? this.#accessory.addService(service.OccupancySensor);
        break;
      case 'temperature':
        this.#services.Primary = this.#accessory.getService(service.TemperatureSensor) ?? this.#accessory.addService(service.TemperatureSensor);
        break;
      case 'unknown':
        this.#services.Primary = this.#accessory.getService(service.OccupancySensor) ?? this.#accessory.addService(service.OccupancySensor);
        break;
      default:
        break;
    }

    // Check for missing services.
    if (this.#services.Primary === undefined) {
      // The "gateway" accessory does not need to be initialized further.
      if (type !== 'gateway') {
        this.#log.error(`Failed to initialize ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory services ...`);
      }

      return;
    }

    // Set the required characteristics associated with the gateway/panel.
    switch (type) {
      case 'gateway':
        // No supported characteristic available.
        break;
      case 'panel':
        this.#services.Primary.getCharacteristic(this.#characteristic.SecuritySystemCurrentState)
          .onGet(() => this.getPanelStatus('current', context));
        this.#services.Primary.getCharacteristic(this.#characteristic.SecuritySystemTargetState)
          .onGet(() => this.getPanelStatus('target', context))
          .onSet((value) => this.setPanelStatus(value, context));
        break;
      default:
        break;
    }

    // Set the required characteristics associated with the sensor.
    switch (type) {
      case 'co':
        this.#services.Primary.getCharacteristic(this.#characteristic.CarbonMonoxideDetected)
          .onGet(() => this.getSensorStatus('status', context));
        break;
      case 'doorWindow':
        this.#services.Primary.getCharacteristic(this.#characteristic.ContactSensorState)
          .onGet(() => this.getSensorStatus('status', context));
        break;
      case 'fire':
        this.#services.Primary.getCharacteristic(this.#characteristic.SmokeDetected)
          .onGet(() => this.getSensorStatus('status', context));
        break;
      case 'flood':
        this.#services.Primary.getCharacteristic(this.#characteristic.LeakDetected)
          .onGet(() => this.getSensorStatus('status', context));
        break;
      case 'glass':
        this.#services.Primary.getCharacteristic(this.#characteristic.OccupancyDetected)
          .onGet(() => this.getSensorStatus('status', context));
        break;
      case 'keypad':
        this.#services.Primary.getCharacteristic(this.#characteristic.OccupancyDetected)
          .onGet(() => this.getSensorStatus('status', context));
        break;
      case 'motion':
        this.#services.Primary.getCharacteristic(this.#characteristic.MotionDetected)
          .onGet(() => this.getSensorStatus('status', context));
        break;
      case 'panic':
        this.#services.Primary.getCharacteristic(this.#characteristic.OccupancyDetected)
          .onGet(() => this.getSensorStatus('status', context));
        break;
      case 'shock':
        this.#services.Primary.getCharacteristic(this.#characteristic.OccupancyDetected)
          .onGet(() => this.getSensorStatus('status', context));
        break;
      case 'supervisory':
        this.#services.Primary.getCharacteristic(this.#characteristic.OccupancyDetected)
          .onGet(() => this.getSensorStatus('status', context));
        break;
      case 'temperature':
        this.#services.Primary.getCharacteristic(this.#characteristic.CurrentTemperature)
          .onGet(() => this.getSensorStatus('status', context));
        break;
      case 'unknown':
        this.#services.Primary.getCharacteristic(this.#characteristic.OccupancyDetected)
          .onGet(() => this.getSensorStatus('status', context));
        break;
      default:
        break;
    }

    // Set the optional characteristics associated with the gateway/panel.
    switch (type) {
      case 'gateway':
        // No supported characteristic available.
        break;
      case 'panel':
        this.#services.Primary.getCharacteristic(this.#characteristic.SecuritySystemAlarmType)
          .onGet(() => this.getPanelStatus('alarmType', context));

        this.#services.Primary.getCharacteristic(this.#characteristic.StatusFault)
          .onGet(() => this.getPanelStatus('fault', context));

        this.#services.Primary.getCharacteristic(this.#characteristic.StatusTampered)
          .onGet(() => this.getPanelStatus('tamper', context));
        break;
      default:
        break;
    }

    // Set the optional characteristics associated with the sensor.
    switch (type) {
      case 'co':
      case 'doorWindow':
      case 'fire':
      case 'flood':
      case 'glass':
      case 'keypad':
      case 'motion':
      case 'panic':
      case 'shock':
      case 'supervisory':
      case 'temperature':
      case 'unknown':
        this.#services.Primary.getCharacteristic(this.#characteristic.StatusActive)
          .onGet(() => this.getSensorStatus('active', context));

        this.#services.Primary.getCharacteristic(this.#characteristic.StatusFault)
          .onGet(() => this.getSensorStatus('fault', context));

        this.#services.Primary.getCharacteristic(this.#characteristic.StatusLowBattery)
          .onGet(() => this.getSensorStatus('lowBattery', context));

        this.#services.Primary.getCharacteristic(this.#characteristic.StatusTampered)
          .onGet(() => this.getSensorStatus('tamper', context));
        break;
      default:
        break;
    }
  }

  /**
   * ADT Pulse Accessory - Get sensor status.
   *
   * @param {ADTPulseAccessoryGetSensorStatusMode}    mode    - Mode.
   * @param {ADTPulseAccessoryGetSensorStatusContext} context - Context.
   *
   * @private
   *
   * @returns {ADTPulseAccessoryGetSensorStatusReturns}
   *
   * @since 1.0.0
   */
  private async getSensorStatus(mode: ADTPulseAccessoryGetSensorStatusMode, context: ADTPulseAccessoryGetSensorStatusContext): ADTPulseAccessoryGetSensorStatusReturns {
    const {
      id,
      name,
      originalName,
      type,
      uuid,
      zone,
    } = context;

    const matchedSensorStatus = this.#state.data.sensorsStatus.find((sensorStatus) => originalName === sensorStatus.name && zone !== null && sensorStatus.zone === zone);

    // If sensor is not found or sensor type is not supported.
    if (
      matchedSensorStatus === undefined
      || type === 'gateway'
      || type === 'panel'
      || !condensedSensorTypeItems.includes(type)
    ) {
      this.#log.error(`Attempted to get sensor status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but sensor is not found or sensor type is not supported.`);

      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_DOES_NOT_EXIST);
    }

    const { icon, statuses } = matchedSensorStatus;

    // If sensor is currently "Offline" or "Unknown".
    if (statuses.includes('Offline') || statuses.includes('Unknown')) {
      this.#log.warn(`Attempted to get sensor status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but sensor is currently "Offline" or "Unknown".`);

      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.NOT_ALLOWED_IN_CURRENT_STATE);
    }

    // Find the state for "Sensor" (required characteristic).
    if (mode === 'status') {
      switch (type) {
        case 'co':
          if (statuses.includes('Okay')) {
            return this.#characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL;
          }
          break;
        case 'doorWindow':
          if (statuses.includes('Open')) {
            return this.#characteristic.ContactSensorState.CONTACT_NOT_DETECTED;
          }

          if (statuses.includes('Closed')) {
            return this.#characteristic.ContactSensorState.CONTACT_DETECTED;
          }
          break;
        case 'fire':
          if (statuses.includes('Okay')) {
            return this.#characteristic.SmokeDetected.SMOKE_NOT_DETECTED;
          }
          break;
        case 'flood':
          // TODO: Nothing done here yet.
          break;
        case 'glass':
          if (statuses.includes('Tripped')) {
            return true;
          }

          if (statuses.includes('Okay')) {
            return false;
          }
          break;
        case 'keypad':
          // TODO: Nothing done here yet.
          break;
        case 'motion':
          if (statuses.includes('No Motion') || statuses.includes('Okay')) {
            return false;
          }

          if (statuses.includes('Motion')) {
            return true;
          }
          break;
        case 'panic':
          // TODO: Nothing done here yet.
          break;
        case 'shock':
          // TODO: Nothing done here yet.
          break;
        case 'supervisory':
          // TODO: Nothing done here yet.
          break;
        case 'temperature':
          // TODO: Nothing done here yet.
          break;
        case 'unknown':
          // TODO: Nothing done here yet.
          break;
        default:
          break;
      }
    }

    // Find the state for "Status Active" (optional characteristic).
    if (mode === 'active') {
      // If status or icon does not include these, the sensor is active.
      return !(
        statuses.includes('Offline')
        || statuses.includes('Unknown')
        || icon === 'devStatOffline'
      );
    }

    // Find the state for "Status Fault" (optional characteristic).
    if (mode === 'fault') {
      // If status or icon includes these, the sensor has a fault.
      if (
        statuses.includes('Bypassed')
        || statuses.includes('Trouble')
      ) {
        return this.#characteristic.StatusFault.GENERAL_FAULT;
      }

      return this.#characteristic.StatusFault.NO_FAULT;
    }

    // Find the state for "Status Low Battery" (optional characteristic).
    if (mode === 'lowBattery') {
      // If status or icon includes these, the sensor battery needs replacement.
      if (
        statuses.includes('Low Battery')
        || icon === 'devStatLowBatt'
      ) {
        return this.#characteristic.StatusLowBattery.BATTERY_LEVEL_LOW;
      }

      return this.#characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
    }

    // Find the state for "Status Tampered" (optional characteristic).
    if (mode === 'tamper') {
      // If status or icon includes these, the sensor was tampered.
      if (icon === 'devStatTamper') {
        return this.#characteristic.StatusTampered.TAMPERED;
      }

      return this.#characteristic.StatusTampered.NOT_TAMPERED;
    }

    this.#log.warn(`Attempted to get sensor status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but actions have not been implemented yet.`);

    await this.newInformationDispatcher(type, matchedSensorStatus, context);

    throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);
  }

  /**
   * ADT Pulse Accessory - Get panel status.
   *
   * @param {ADTPulseAccessoryGetPanelStatusMode}    mode    - Mode.
   * @param {ADTPulseAccessoryGetPanelStatusContext} context - Context.
   *
   * @private
   *
   * @returns {ADTPulseAccessoryGetPanelStatusReturns}
   *
   * @since 1.0.0
   */
  private async getPanelStatus(mode: ADTPulseAccessoryGetPanelStatusMode, context: ADTPulseAccessoryGetPanelStatusContext): ADTPulseAccessoryGetPanelStatusReturns {
    const {
      id,
      name,
      type,
      uuid,
    } = context;

    // If device is not a security panel.
    if (type !== 'panel') {
      this.#log.error(`Attempted to get panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but device is not a security panel.`);

      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);
    }

    // If panel status has not been retrieved yet.
    if (
      this.#state.data.panelStatus === null
      || this.#state.data.panelStatus.panelStates.length === 0
      || this.#state.data.panelStatus.panelStatuses.length === 0
    ) {
      this.#log.warn(`Attempted to get panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel status has not been retrieved yet.`);

      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);
    }

    const { panelStates, panelStatuses } = this.#state.data.panelStatus;

    // If panel state is "Status Unavailable".
    if (panelStates.includes('Status Unavailable')) {
      this.#log.warn(`Attempted to get panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel state is "Status Unavailable".`);

      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);
    }

    // If mode is "alarmType".
    if (mode === 'alarmType') {
      if (
        panelStatuses.includes('BURGLARY ALARM')
        || panelStatuses.includes('Carbon Monoxide Alarm')
        || panelStatuses.includes('FIRE ALARM')
        || panelStatuses.includes('Uncleared Alarm')
        || panelStatuses.includes('WATER ALARM')
      ) {
        return 1;
      }

      return 0;
    }

    // If mode is "current".
    if (mode === 'current') {
      switch (true) {
        // TODO: Try to test Smoke or CO alarm while status is Disarmed and see if I'm able to disarm the system in Home app.
        case panelStatuses.includes('BURGLARY ALARM'):
        case panelStatuses.includes('Carbon Monoxide Alarm'):
        case panelStatuses.includes('FIRE ALARM'):
        case panelStatuses.includes('Uncleared Alarm'):
        case panelStatuses.includes('WATER ALARM'):
          return this.#characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED;
        case panelStates.includes('Armed Away'):
          return this.#characteristic.SecuritySystemCurrentState.AWAY_ARM;
        case panelStates.includes('Armed Stay'):
          return this.#characteristic.SecuritySystemCurrentState.STAY_ARM;
        case panelStates.includes('Armed Night'):
          return this.#characteristic.SecuritySystemCurrentState.NIGHT_ARM;
        case panelStates.includes('Disarmed'):
          return this.#characteristic.SecuritySystemCurrentState.DISARMED;
        default:
          break;
      }
    }

    // If mode is "fault".
    if (mode === 'fault') {
      if (!panelStatuses.includes('All Quiet')) {
        return this.#characteristic.StatusFault.GENERAL_FAULT;
      }

      return this.#characteristic.StatusFault.NO_FAULT;
    }

    // If mode is "tamper".
    if (mode === 'tamper') {
      // TODO: Not enough statuses currently to determine whether system is tampered or not.
      if (!panelStatuses.some((panelStatus) => panelStatus.includes('tamper'))) {
        return this.#characteristic.StatusTampered.NOT_TAMPERED;
      }
    }

    // If mode is "target".
    if (mode === 'target') {
      switch (true) {
        case panelStates.includes('Armed Away'):
          return this.#characteristic.SecuritySystemTargetState.AWAY_ARM;
        case panelStates.includes('Armed Stay'):
          return this.#characteristic.SecuritySystemTargetState.STAY_ARM;
        case panelStates.includes('Armed Night'):
          return this.#characteristic.SecuritySystemTargetState.NIGHT_ARM;
        case panelStates.includes('Disarmed'):
          return this.#characteristic.SecuritySystemTargetState.DISARM;
        default:
          break;
      }
    }

    this.#log.warn(`Attempted to get panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but actions have not been implemented yet.`);

    await this.newInformationDispatcher(type, this.#state.data.panelStatus, context);

    throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
  }

  /**
   * ADT Pulse Accessory - Set panel status.
   *
   * @param {ADTPulseAccessorySetPanelStatusArm}     arm     - Arm.
   * @param {ADTPulseAccessorySetPanelStatusContext} context - Context.
   *
   * @private
   *
   * @returns {ADTPulseAccessorySetPanelStatusReturns}
   *
   * @since 1.0.0
   */
  private async setPanelStatus(arm: ADTPulseAccessorySetPanelStatusArm, context: ADTPulseAccessorySetPanelStatusContext): ADTPulseAccessorySetPanelStatusReturns {
    const {
      id,
      name,
      type,
      uuid,
    } = context;

    let result = {
      success: false,
    };
    let unknownArmValue = false;

    // If device is not a security panel.
    if (type !== 'panel') {
      this.#log.error(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but device is not a security panel.`);

      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);
    }

    // If panel status has not been retrieved yet.
    if (this.#state.data.panelStatus === null || this.#state.data.panelStatus.panelStates.length === 0) {
      this.#log.warn(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel status has not been retrieved yet.`);

      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);
    }

    const { panelStates } = this.#state.data.panelStatus;

    const armFrom = condensePanelStates(panelStates);

    // If panel status cannot be found or most likely "Status Unavailable".
    if (armFrom === undefined) {
      this.#log.warn(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel status cannot be found or most likely "Status Unavailable".`);

      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);
    }

    // Set the panel status.
    switch (arm) {
      case this.#characteristic.SecuritySystemTargetState.STAY_ARM:
        result = await this.#instance.setPanelStatus(armFrom, 'stay');
        break;
      case this.#characteristic.SecuritySystemTargetState.AWAY_ARM:
        result = await this.#instance.setPanelStatus(armFrom, 'away');
        break;
      case this.#characteristic.SecuritySystemTargetState.NIGHT_ARM:
        result = await this.#instance.setPanelStatus(armFrom, 'night');
        break;
      case this.#characteristic.SecuritySystemTargetState.DISARM:
        result = await this.#instance.setPanelStatus(armFrom, 'off');
        break;
      default:
        unknownArmValue = true;
        break;
    }

    // If request has unknown arm value.
    if (unknownArmValue) {
      this.#log.error(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but request has unknown arm value.`);

      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);
    }

    // If request was not successful.
    if (!result.success) {
      this.#log.error(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but request was not successful.`);

      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.OPERATION_TIMED_OUT);
    }
  }

  /**
   * ADT Pulse Accessory - New information dispatcher.
   *
   * @param {ADTPulseAccessoryNewInformationDispatcherType}    type    - Type.
   * @param {ADTPulseAccessoryNewInformationDispatcherStatus}  status  - Status.
   * @param {ADTPulseAccessoryNewInformationDispatcherContext} context - Context.
   *
   * @private
   *
   * @returns {ADTPulseAccessoryNewInformationDispatcherReturns}
   *
   * @since 1.0.0
   */
  private async newInformationDispatcher(type: ADTPulseAccessoryNewInformationDispatcherType, status: ADTPulseAccessoryNewInformationDispatcherStatus, context: ADTPulseAccessoryNewInformationDispatcherContext): ADTPulseAccessoryNewInformationDispatcherReturns {
    const dataHash = generateHash(`${type}: ${JSON.stringify(status)} ${JSON.stringify(context)}`);

    // If the detector has not reported this event before.
    if (this.#reportedHashes.find((reportedHash) => dataHash === reportedHash) === undefined) {
      const data = {
        status,
        context,
      };
      const detectedNew = await detectedUnknownAccessoryAction(data, this.#log, this.#debugMode);

      // Save this hash so the detector does not detect the same thing multiple times.
      if (detectedNew) {
        this.#reportedHashes.push(dataHash);
      }
    }
  }
}
