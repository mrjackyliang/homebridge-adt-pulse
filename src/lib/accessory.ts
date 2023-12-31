import chalk from 'chalk';

import { detectedUnknownPanelAction, detectedUnknownSensorAction } from '@/lib/detect.js';
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
  ADTPulseAccessoryGetSensorStatusReturns,
  ADTPulseAccessoryInstance,
  ADTPulseAccessoryLog,
  ADTPulseAccessoryNewInformationDispatcherData,
  ADTPulseAccessoryNewInformationDispatcherPanel,
  ADTPulseAccessoryNewInformationDispatcherReturns,
  ADTPulseAccessoryNewInformationDispatcherSensor,
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
  #accessory: ADTPulseAccessoryAccessory;

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

    // Set the "AccessoryInformation" service.
    this.#services.Information = this.#accessory.getService(service.AccessoryInformation) ?? this.#accessory.addService(service.AccessoryInformation);

    // Set the "AccessoryInformation" characteristics.
    this.#services.Information
      .setCharacteristic(this.#characteristic.Identify, false)
      .setCharacteristic(this.#characteristic.Manufacturer, accessory.context.manufacturer ?? 'ADT')
      .setCharacteristic(this.#characteristic.Model, accessory.context.model ?? 'N/A')
      .setCharacteristic(this.#characteristic.Name, accessory.context.name)
      .setCharacteristic(this.#characteristic.SerialNumber, accessory.context.serial ?? 'N/A')
      .setCharacteristic(this.#characteristic.FirmwareRevision, accessory.context.firmware ?? 'N/A')
      .setCharacteristic(this.#characteristic.HardwareRevision, accessory.context.hardware ?? 'N/A')
      .setCharacteristic(this.#characteristic.SoftwareRevision, accessory.context.software ?? 'N/A');

    // Set the service associated with the accessory.
    switch (accessory.context.type) {
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
      case 'gateway':
        // No supported service available.
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
      case 'panel':
        this.#services.Primary = this.#accessory.getService(service.SecuritySystem) ?? this.#accessory.addService(service.SecuritySystem);
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
      if (accessory.context.type !== 'gateway') {
        this.#log.error(`Failed to initialize ${accessory.context.name} (id: ${accessory.context.id}, uuid: ${accessory.context.uuid}) accessory services ...`);
      }

      return;
    }

    // Set the characteristics associated with the specific type of accessory.
    switch (accessory.context.type) {
      case 'co':
        this.#services.Primary.getCharacteristic(this.#characteristic.CarbonMonoxideDetected)
          .onGet(() => this.getSensorStatus(accessory.context));
        break;
      case 'doorWindow':
        this.#services.Primary.getCharacteristic(this.#characteristic.ContactSensorState)
          .onGet(() => this.getSensorStatus(accessory.context));
        break;
      case 'fire':
        this.#services.Primary.getCharacteristic(this.#characteristic.SmokeDetected)
          .onGet(() => this.getSensorStatus(accessory.context));
        break;
      case 'flood':
        this.#services.Primary.getCharacteristic(this.#characteristic.LeakDetected)
          .onGet(() => this.getSensorStatus(accessory.context));
        break;
      case 'gateway':
        // No supported characteristic available.
        break;
      case 'glass':
        this.#services.Primary.getCharacteristic(this.#characteristic.OccupancyDetected)
          .onGet(() => this.getSensorStatus(accessory.context));
        break;
      case 'keypad':
        this.#services.Primary.getCharacteristic(this.#characteristic.OccupancyDetected)
          .onGet(() => this.getSensorStatus(accessory.context));
        break;
      case 'motion':
        this.#services.Primary.getCharacteristic(this.#characteristic.MotionDetected)
          .onGet(() => this.getSensorStatus(accessory.context));
        break;
      case 'panel':
        this.#services.Primary.getCharacteristic(this.#characteristic.SecuritySystemCurrentState)
          .onGet(() => this.getPanelStatus('current', accessory.context));
        this.#services.Primary.getCharacteristic(this.#characteristic.SecuritySystemTargetState)
          .onGet(() => this.getPanelStatus('target', accessory.context))
          .onSet((value) => this.setPanelStatus(value, accessory.context));
        break;
      case 'panic':
        this.#services.Primary.getCharacteristic(this.#characteristic.OccupancyDetected)
          .onGet(() => this.getSensorStatus(accessory.context));
        break;
      case 'shock':
        this.#services.Primary.getCharacteristic(this.#characteristic.OccupancyDetected)
          .onGet(() => this.getSensorStatus(accessory.context));
        break;
      case 'supervisory':
        this.#services.Primary.getCharacteristic(this.#characteristic.OccupancyDetected)
          .onGet(() => this.getSensorStatus(accessory.context));
        break;
      case 'temperature':
        this.#services.Primary.getCharacteristic(this.#characteristic.CurrentTemperature)
          .onGet(() => this.getSensorStatus(accessory.context));
        break;
      case 'unknown':
        this.#services.Primary.getCharacteristic(this.#characteristic.OccupancyDetected)
          .onGet(() => this.getSensorStatus(accessory.context));
        break;
      default:
        break;
    }
  }

  /**
   * ADT Pulse Accessory - Get sensor status.
   *
   * @param {ADTPulseAccessoryGetSensorStatusContext} context - Context.
   *
   * @private
   *
   * @returns {ADTPulseAccessoryGetSensorStatusReturns}
   *
   * @since 1.0.0
   */
  private async getSensorStatus(context: ADTPulseAccessoryGetSensorStatusContext): ADTPulseAccessoryGetSensorStatusReturns {
    const {
      id,
      name,
      type,
      uuid,
      zone,
    } = context;

    const matchedSensorStatus = this.#state.data.sensorsStatus.find((sensorStatus) => zone !== null && sensorStatus.name === name && sensorStatus.zone === zone);

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

    const { statuses } = matchedSensorStatus;

    // If sensor is currently "Offline" or "Unknown".
    if (statuses.includes('Offline') || statuses.includes('Unknown')) {
      this.#log.warn(`Attempted to get sensor status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but sensor is currently "Offline" or "Unknown".`);

      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.NOT_ALLOWED_IN_CURRENT_STATE);
    }

    // Find the status based on the sensor type.
    switch (type) {
      case 'co':
        // TODO Nothing done here yet.
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
        // TODO Nothing done here yet.
        break;
      case 'flood':
        // TODO Nothing done here yet.
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
        // TODO Nothing done here yet.
        break;
      case 'motion':
        if (statuses.includes('No Motion')) {
          return false;
        }

        if (statuses.includes('Motion')) {
          return true;
        }
        break;
      case 'panic':
        // TODO Nothing done here yet.
        break;
      case 'shock':
        // TODO Nothing done here yet.
        break;
      case 'supervisory':
        // TODO Nothing done here yet.
        break;
      case 'temperature':
        // TODO Nothing done here yet.
        break;
      case 'unknown':
        // TODO Nothing done here yet.
        break;
      default:
        break;
    }

    this.#log.warn(`Attempted to get sensor status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but actions have not been implemented yet.`);

    await this.newInformationDispatcher(type, matchedSensorStatus);

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

    // If panel state is "Service Unavailable".
    if (panelStates.includes('Status Unavailable')) {
      this.#log.warn(`Attempted to get panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel state is "Service Unavailable".`);

      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);
    }

    // If mode is "current" and panel status is "BURGLARY ALARM".
    if (mode === 'current' && panelStatuses.includes('BURGLARY ALARM')) {
      return this.#characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED;
    }

    // All the other panel states.
    switch (true) {
      case panelStates.includes('Armed Away'):
        return (mode === 'current') ? this.#characteristic.SecuritySystemCurrentState.AWAY_ARM : this.#characteristic.SecuritySystemTargetState.AWAY_ARM;
      case panelStates.includes('Armed Stay'):
        return (mode === 'current') ? this.#characteristic.SecuritySystemCurrentState.STAY_ARM : this.#characteristic.SecuritySystemTargetState.STAY_ARM;
      case panelStates.includes('Armed Night'):
        return (mode === 'current') ? this.#characteristic.SecuritySystemCurrentState.NIGHT_ARM : this.#characteristic.SecuritySystemTargetState.NIGHT_ARM;
      case panelStates.includes('Disarmed'):
        return (mode === 'current') ? this.#characteristic.SecuritySystemCurrentState.DISARMED : this.#characteristic.SecuritySystemTargetState.DISARM;
      default:
        break;
    }

    this.#log.warn(`Attempted to get panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but actions have not been implemented yet.`);

    await this.newInformationDispatcher(type, this.#state.data.panelStatus);

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
   * @param {ADTPulseAccessoryNewInformationDispatcherType} type - Type.
   * @param {ADTPulseAccessoryNewInformationDispatcherData} data - Data.
   *
   * @private
   *
   * @returns {ADTPulseAccessoryNewInformationDispatcherReturns}
   *
   * @since 1.0.0
   */
  private async newInformationDispatcher(type: ADTPulseAccessoryNewInformationDispatcherType, data: ADTPulseAccessoryNewInformationDispatcherData): ADTPulseAccessoryNewInformationDispatcherReturns {
    const dataHash = generateHash(`${type}: ${JSON.stringify(data)}`);

    // If the detector has not reported this event before.
    if (this.#reportedHashes.find((reportedHash) => dataHash === reportedHash) === undefined) {
      let detectedNew = false;

      // Determine what information needs to be checked.
      switch (type) {
        case 'panel':
          detectedNew = await detectedUnknownPanelAction(data as ADTPulseAccessoryNewInformationDispatcherPanel, this.#log, this.#debugMode);
          break;
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
          detectedNew = await detectedUnknownSensorAction(data as ADTPulseAccessoryNewInformationDispatcherSensor, this.#log, this.#debugMode);
          break;
        default:
          break;
      }

      // Save this hash so the detector does not detect the same thing multiple times.
      if (detectedNew) {
        this.#reportedHashes.push(dataHash);
      }
    }
  }
}
