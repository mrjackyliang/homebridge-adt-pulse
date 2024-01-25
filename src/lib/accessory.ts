import chalk from 'chalk';

import { condensedSensorTypeItems } from '@/lib/items.js';
import {
  condensePanelStates,
  convertPanelCharacteristicValue,
  isPanelAlarmActive,
  stackTracer,
} from '@/lib/utility.js';
import type {
  ADTPulseAccessoryAccessory,
  ADTPulseAccessoryActivity,
  ADTPulseAccessoryApi,
  ADTPulseAccessoryCharacteristic,
  ADTPulseAccessoryConstructorAccessory,
  ADTPulseAccessoryConstructorApi,
  ADTPulseAccessoryConstructorCharacteristic,
  ADTPulseAccessoryConstructorInstance,
  ADTPulseAccessoryConstructorLog,
  ADTPulseAccessoryConstructorService,
  ADTPulseAccessoryConstructorState,
  ADTPulseAccessoryGetPanelStatusMode,
  ADTPulseAccessoryGetPanelStatusReturns,
  ADTPulseAccessoryGetPanelSwitchStatusReturns,
  ADTPulseAccessoryGetSensorStatusMode,
  ADTPulseAccessoryGetSensorStatusReturns,
  ADTPulseAccessoryInstance,
  ADTPulseAccessoryLog,
  ADTPulseAccessoryServices,
  ADTPulseAccessorySetPanelStatusArm,
  ADTPulseAccessorySetPanelStatusReturns,
  ADTPulseAccessorySetPanelSwitchStatusOn,
  ADTPulseAccessorySetPanelSwitchStatusReturns,
  ADTPulseAccessoryState,
  ADTPulseAccessoryUpdaterReturns,
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
   * ADT Pulse Accessory - Activity.
   *
   * @private
   *
   * @since 1.0.0
   */
  #activity: ADTPulseAccessoryActivity;

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
  readonly #characteristic: ADTPulseAccessoryCharacteristic;

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
   *
   * @since 1.0.0
   */
  public constructor(accessory: ADTPulseAccessoryConstructorAccessory, state: ADTPulseAccessoryConstructorState, instance: ADTPulseAccessoryConstructorInstance, service: ADTPulseAccessoryConstructorService, characteristic: ADTPulseAccessoryConstructorCharacteristic, api: ADTPulseAccessoryConstructorApi, log: ADTPulseAccessoryConstructorLog) {
    this.#accessory = accessory;
    this.#activity = {
      isBusy: false,
      setCurrentValue: null,
      setTargetValue: null,
      setValue: null,
    };
    this.#api = api;
    this.#characteristic = characteristic;
    this.#instance = instance;
    this.#log = log;
    this.#services = {};
    this.#state = state;

    const { context } = this.#accessory;
    const {
      firmware,
      hardware,
      manufacturer,
      model,
      name,
      serial,
      software,
      type,
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
      case 'panelSwitch':
        this.#services.Primary = this.#accessory.getService(service.Switch) ?? this.#accessory.addService(service.Switch);
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
      case 'heat':
        this.#services.Primary = this.#accessory.getService(service.OccupancySensor) ?? this.#accessory.addService(service.OccupancySensor);
        break;
      case 'motion':
        this.#services.Primary = this.#accessory.getService(service.MotionSensor) ?? this.#accessory.addService(service.MotionSensor);
        break;
      case 'shock':
        this.#services.Primary = this.#accessory.getService(service.OccupancySensor) ?? this.#accessory.addService(service.OccupancySensor);
        break;
      case 'temperature':
        this.#services.Primary = this.#accessory.getService(service.TemperatureSensor) ?? this.#accessory.addService(service.TemperatureSensor);
        break;
      default:
        break;
    }
  }

  /**
   * ADT Pulse Accessory - Updater.
   *
   * @returns {ADTPulseAccessoryUpdaterReturns}
   *
   * @since 1.0.0
   */
  public updater(): ADTPulseAccessoryUpdaterReturns {
    const { context } = this.#accessory;
    const {
      id,
      name,
      type,
      uuid,
    } = context;

    // Check for missing services.
    if (this.#services.Primary === undefined) {
      // The "gateway" accessory does not need to be initialized further.
      if (type !== 'gateway') {
        this.#log.error(`Failed to update ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory because the primary service does not exist ...`);
      }

      return;
    }

    // Set the characteristics associated with the gateway/panel (required).
    switch (type) {
      case 'gateway':
        // No supported service available.
        break;
      case 'panel':
        this.#services.Primary.getCharacteristic(this.#characteristic.SecuritySystemCurrentState)
          .updateValue(this.getPanelStatus('current'));

        this.#services.Primary.getCharacteristic(this.#characteristic.SecuritySystemTargetState)
          .updateValue(this.getPanelStatus('target'));

        this.#services.Primary.getCharacteristic(this.#characteristic.SecuritySystemTargetState)
          .onSet(async (value) => this.setPanelStatus(value));
        break;
      case 'panelSwitch':
        this.#services.Primary.getCharacteristic(this.#characteristic.On)
          .updateValue(this.getPanelSwitchStatus());

        this.#services.Primary.getCharacteristic(this.#characteristic.On)
          .onSet(async (value) => this.setPanelSwitchStatus(value));
        break;
      default:
        break;
    }

    // Set the characteristics associated with the gateway/panel (optional).
    switch (type) {
      case 'gateway':
        // No supported service available.
        break;
      case 'panel':
        this.#services.Primary.getCharacteristic(this.#characteristic.SecuritySystemAlarmType)
          .updateValue(this.getPanelStatus('alarmType'));

        this.#services.Primary.getCharacteristic(this.#characteristic.StatusFault)
          .updateValue(this.getPanelStatus('fault'));

        this.#services.Primary.getCharacteristic(this.#characteristic.StatusTampered)
          .updateValue(this.getPanelStatus('tamper'));
        break;
      case 'panelSwitch':
        // No optional services I'm interested in.
        break;
      default:
        break;
    }

    // Set the characteristics associated with the sensor (required).
    switch (type) {
      case 'co':
        this.#services.Primary.getCharacteristic(this.#characteristic.CarbonMonoxideDetected)
          .updateValue(this.getSensorStatus('status'));
        break;
      case 'doorWindow':
        this.#services.Primary.getCharacteristic(this.#characteristic.ContactSensorState)
          .updateValue(this.getSensorStatus('status'));
        break;
      case 'fire':
        this.#services.Primary.getCharacteristic(this.#characteristic.SmokeDetected)
          .updateValue(this.getSensorStatus('status'));
        break;
      case 'flood':
        this.#services.Primary.getCharacteristic(this.#characteristic.LeakDetected)
          .updateValue(this.getSensorStatus('status'));
        break;
      case 'glass':
        this.#services.Primary.getCharacteristic(this.#characteristic.OccupancyDetected)
          .updateValue(this.getSensorStatus('status'));
        break;
      case 'heat':
        this.#services.Primary.getCharacteristic(this.#characteristic.OccupancyDetected)
          .updateValue(this.getSensorStatus('status'));
        break;
      case 'motion':
        this.#services.Primary.getCharacteristic(this.#characteristic.MotionDetected)
          .updateValue(this.getSensorStatus('status'));
        break;
      case 'shock':
        this.#services.Primary.getCharacteristic(this.#characteristic.OccupancyDetected)
          .updateValue(this.getSensorStatus('status'));
        break;
      case 'temperature':
        this.#services.Primary.getCharacteristic(this.#characteristic.CurrentTemperature)
          .updateValue(this.getSensorStatus('status'));
        break;
      default:
        break;
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
      case 'temperature':
        this.#services.Primary.getCharacteristic(this.#characteristic.StatusActive)
          .updateValue(this.getSensorStatus('active'));

        this.#services.Primary.getCharacteristic(this.#characteristic.StatusFault)
          .updateValue(this.getSensorStatus('fault'));

        this.#services.Primary.getCharacteristic(this.#characteristic.StatusLowBattery)
          .updateValue(this.getSensorStatus('lowBattery'));

        this.#services.Primary.getCharacteristic(this.#characteristic.StatusTampered)
          .updateValue(this.getSensorStatus('tamper'));
        break;
      default:
        break;
    }
  }

  /**
   * ADT Pulse Accessory - Get sensor status.
   *
   * @param {ADTPulseAccessoryGetSensorStatusMode} mode - Mode.
   *
   * @private
   *
   * @returns {ADTPulseAccessoryGetSensorStatusReturns}
   *
   * @since 1.0.0
   */
  private getSensorStatus(mode: ADTPulseAccessoryGetSensorStatusMode): ADTPulseAccessoryGetSensorStatusReturns {
    const { context } = this.#accessory;
    const {
      id,
      name,
      originalName,
      type,
      uuid,
      zone,
    } = context;

    const matchedSensorStatus = this.#state.data.sensorsStatus.find((sensorStatus) => originalName === sensorStatus.name && zone !== null && sensorStatus.zone === zone);

    let hapStatus;

    // If sensor is not found or sensor type is not supported.
    if (
      matchedSensorStatus === undefined
      || type === 'gateway'
      || type === 'panel'
      || type === 'panelSwitch'
      || !condensedSensorTypeItems.includes(type)
    ) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_DOES_NOT_EXIST);

      this.#log.error(`Attempted to get sensor status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but sensor is not found or sensor type is not supported.`);

      return hapStatus;
    }

    const { icon, statuses } = matchedSensorStatus;

    // Find the state for "Status Active" (optional characteristic).
    if (mode === 'active') {
      // If status or icon does not include these, the sensor is active.
      return (
        !statuses.includes('Offline')
        && !statuses.includes('Unknown')
        && icon !== 'devStatOffline'
        && icon !== 'devStatUnknown'
      );
    }

    // Find the state for "Status Fault" (optional characteristic).
    if (mode === 'fault') {
      // If status or icon includes these, the sensor has a fault.
      if (
        statuses.includes('ALARM')
        || statuses.includes('Bypassed')
        || statuses.includes('Trouble')
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
        statuses.includes('Low Battery')
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
        statuses.includes('Tampered')
        || icon === 'devStatTamper'
      ) {
        return this.#characteristic.StatusTampered.TAMPERED;
      }

      return this.#characteristic.StatusTampered.NOT_TAMPERED;
    }

    // Find the state for the sensor (required characteristic).
    switch (type) {
      case 'co':
        if (statuses.includes('ALARM') || statuses.includes('Tripped')) {
          return this.#characteristic.CarbonMonoxideDetected.CO_LEVELS_ABNORMAL;
        }

        if (statuses.includes('Okay')) {
          return this.#characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL;
        }
        break;
      case 'doorWindow':
        if (statuses.includes('ALARM') || statuses.includes('Open')) {
          return this.#characteristic.ContactSensorState.CONTACT_NOT_DETECTED;
        }

        if (statuses.includes('Closed')) {
          return this.#characteristic.ContactSensorState.CONTACT_DETECTED;
        }
        break;
      case 'fire':
        if (statuses.includes('ALARM') || statuses.includes('Tripped')) {
          return this.#characteristic.SmokeDetected.SMOKE_DETECTED;
        }

        if (statuses.includes('Okay')) {
          return this.#characteristic.SmokeDetected.SMOKE_NOT_DETECTED;
        }
        break;
      case 'flood':
        if (statuses.includes('ALARM') || statuses.includes('Tripped')) {
          return this.#characteristic.LeakDetected.LEAK_DETECTED;
        }

        if (statuses.includes('Okay')) {
          return this.#characteristic.LeakDetected.LEAK_NOT_DETECTED;
        }
        break;
      case 'glass':
        if (statuses.includes('ALARM') || statuses.includes('Tripped')) {
          return this.#characteristic.OccupancyDetected.OCCUPANCY_DETECTED;
        }

        if (statuses.includes('Okay')) {
          return this.#characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED;
        }
        break;
      // TODO Device type needs to be manually tested and confirmed first.
      case 'heat':
        if (statuses.includes('ALARM') || statuses.includes('Tripped')) {
          return this.#characteristic.OccupancyDetected.OCCUPANCY_DETECTED;
        }

        if (statuses.includes('Okay')) {
          return this.#characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED;
        }
        break;
      case 'motion':
        if (statuses.includes('ALARM') || statuses.includes('Motion')) {
          return true;
        }

        if (statuses.includes('No Motion') || statuses.includes('Okay')) {
          return false;
        }
        break;
      // TODO Device type needs to be manually tested and confirmed first.
      case 'shock':
        break;
      // TODO Device type needs to be manually tested and confirmed first.
      case 'temperature':
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
        if (statuses.includes('ALARM') || statuses.includes('Tripped')) {
          return 100;
        }

        if (statuses.includes('Okay')) {
          return 0;
        }
        break;
      default:
        break;
    }

    // If sensor is currently "Offline" or "Unknown". Should be detected last to prevent breaking other modes (getting battery statuses, etc.).
    if (statuses.includes('Offline') || statuses.includes('Unknown')) {
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
   * ADT Pulse Accessory - Get panel status.
   *
   * @param {ADTPulseAccessoryGetPanelStatusMode} mode - Mode.
   *
   * @private
   *
   * @returns {ADTPulseAccessoryGetPanelStatusReturns}
   *
   * @since 1.0.0
   */
  private getPanelStatus(mode: ADTPulseAccessoryGetPanelStatusMode): ADTPulseAccessoryGetPanelStatusReturns {
    const { context } = this.#accessory;
    const {
      id,
      name,
      type,
      uuid,
    } = context;

    let hapStatus;

    // If device is not a security panel.
    if (type !== 'panel') {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);

      this.#log.error(`Attempted to get panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but device is not a security panel.`);

      return hapStatus;
    }

    // If panel status has not been retrieved yet.
    if (
      this.#state.data.panelStatus === null
      || this.#state.data.panelStatus.panelStates.length === 0
      || this.#state.data.panelStatus.panelStatuses.length === 0
    ) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);

      this.#log.debug(`Attempted to get panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel status has not been retrieved yet.`);

      return hapStatus;
    }

    const { panelStates, panelStatuses } = this.#state.data.panelStatus;

    // Find the state for "Security System Alarm Type" (optional characteristic).
    if (mode === 'alarmType') {
      if (isPanelAlarmActive(panelStatuses)) {
        return 1;
      }

      return 0;
    }

    // Find the state for "Status Fault" (optional characteristic).
    if (mode === 'fault') {
      if (!panelStatuses.includes('All Quiet')) {
        return this.#characteristic.StatusFault.GENERAL_FAULT;
      }

      return this.#characteristic.StatusFault.NO_FAULT;
    }

    // Find the state for "Status Tampered" (optional characteristic).
    if (mode === 'tamper') {
      if (panelStatuses.includes('Sensor Problem') || panelStatuses.includes('Sensor Problems')) {
        return this.#characteristic.StatusTampered.TAMPERED;
      }

      return this.#characteristic.StatusTampered.NOT_TAMPERED;
    }

    /**
     * Find the current state for the panel (required characteristic).
     *
     * Notes:
     * - If system is busy setting the state, HomeKit will receive the state user has set to before it becomes officially "set".
     *
     * @since 1.0.0
     */
    switch (true) {
      case mode === 'current' && this.#activity.isBusy && this.#activity.setCurrentValue !== null:
        return this.#activity.setCurrentValue;
      case mode === 'current' && isPanelAlarmActive(panelStatuses):
        return this.#characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED;
      case mode === 'current' && panelStates.includes('Armed Stay'):
        return this.#characteristic.SecuritySystemCurrentState.STAY_ARM;
      case mode === 'current' && panelStates.includes('Armed Away'):
        return this.#characteristic.SecuritySystemCurrentState.AWAY_ARM;
      case mode === 'current' && panelStates.includes('Armed Night'):
        return this.#characteristic.SecuritySystemCurrentState.NIGHT_ARM;
      case mode === 'current' && panelStates.includes('Disarmed'):
        return this.#characteristic.SecuritySystemCurrentState.DISARMED;
      default:
        break;
    }

    /**
     * Find the target state for the panel (required characteristic).
     *
     * Notes:
     * - If system is busy setting the state, HomeKit will receive the state user has set to before it becomes officially "set".
     *
     * @since 1.0.0
     */
    switch (true) {
      case mode === 'target' && this.#activity.isBusy && this.#activity.setTargetValue !== null:
        return this.#activity.setTargetValue;
      case mode === 'target' && panelStates.includes('Armed Stay'):
        return this.#characteristic.SecuritySystemTargetState.STAY_ARM;
      case mode === 'target' && panelStates.includes('Armed Away'):
        return this.#characteristic.SecuritySystemTargetState.AWAY_ARM;
      case mode === 'target' && panelStates.includes('Armed Night'):
        return this.#characteristic.SecuritySystemTargetState.NIGHT_ARM;
      case mode === 'target' && panelStates.includes('Disarmed'):
        return this.#characteristic.SecuritySystemTargetState.DISARM;
      default:
        break;
    }

    // If panel state is "Status Unavailable". Should be detected last to prevent breaking other modes (getting battery statuses, etc.).
    if (panelStates.includes('Status Unavailable')) {
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
   * ADT Pulse Accessory - Get panel switch status.
   *
   * @private
   *
   * @returns {ADTPulseAccessoryGetPanelSwitchStatusReturns}
   *
   * @since 1.0.0
   */
  private getPanelSwitchStatus(): ADTPulseAccessoryGetPanelSwitchStatusReturns {
    const { context } = this.#accessory;
    const { id, name, uuid } = context;

    let hapStatus;

    // If panel status has not been retrieved yet.
    if (this.#state.data.panelStatus === null || this.#state.data.panelStatus.panelStatuses.length === 0) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);

      this.#log.debug(`Attempted to get panel switch status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel switch status has not been retrieved yet.`);

      return hapStatus;
    }

    const { panelStatuses } = this.#state.data.panelStatus;

    // If system is busy setting the state.
    if (this.#activity.isBusy && this.#activity.setValue !== null) {
      return this.#activity.setValue;
    }

    // Only show as "On" if alarm is ringing.
    return isPanelAlarmActive(panelStatuses);
  }

  /**
   * ADT Pulse Accessory - Set panel status.
   *
   * @param {ADTPulseAccessorySetPanelStatusArm} arm - Arm.
   *
   * @private
   *
   * @returns {ADTPulseAccessorySetPanelStatusReturns}
   *
   * @since 1.0.0
   */
  private async setPanelStatus(arm: ADTPulseAccessorySetPanelStatusArm): ADTPulseAccessorySetPanelStatusReturns {
    const { context } = this.#accessory;
    const {
      id,
      name,
      type,
      uuid,
    } = context;

    let hapStatus;
    let result = {
      success: false,
    };
    let unknownArmValue = false;

    // If device is not a security panel.
    if (type !== 'panel') {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);

      this.#log.error(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but device is not a security panel.`);

      throw hapStatus;
    }

    // If panel status has not been retrieved yet.
    if (this.#state.data.panelStatus === null || this.#state.data.panelStatus.panelStates.length === 0) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);

      this.#log.warn(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel status has not been retrieved yet.`);

      throw hapStatus;
    }

    const { panelStates } = this.#state.data.panelStatus;

    const condensedPanelStates = condensePanelStates(this.#characteristic, panelStates);
    const isAlarmActive = isPanelAlarmActive(this.#state.data.panelStatus.panelStatuses);

    // If panel status cannot be found or most likely "Status Unavailable".
    if (condensedPanelStates === undefined) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);

      this.#log.warn(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel status cannot be found or most likely "Status Unavailable".`);

      throw hapStatus;
    }

    if (
      !this.#activity.isBusy // The system isn't busy setting a state.
      && condensedPanelStates.characteristicValue.target !== arm // If user is not setting to the current arm state (e.g. off to off).
    ) {
      const setCurrentValue = convertPanelCharacteristicValue('target-to-current', this.#characteristic, arm);

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
        case this.#characteristic.SecuritySystemTargetState.STAY_ARM:
          result = await this.#instance.setPanelStatus(condensedPanelStates.armValue, 'stay', isAlarmActive);
          break;
        case this.#characteristic.SecuritySystemTargetState.AWAY_ARM:
          result = await this.#instance.setPanelStatus(condensedPanelStates.armValue, 'away', isAlarmActive);
          break;
        case this.#characteristic.SecuritySystemTargetState.NIGHT_ARM:
          result = await this.#instance.setPanelStatus(condensedPanelStates.armValue, 'night', isAlarmActive);
          break;
        case this.#characteristic.SecuritySystemTargetState.DISARM:
          result = await this.#instance.setPanelStatus(condensedPanelStates.armValue, 'off', isAlarmActive);
          break;
        default:
          unknownArmValue = true;
          break;
      }

      // Set accessory activity to "not busy" after arming.
      this.#activity = {
        isBusy: false,
        setCurrentValue: null,
        setTargetValue: null,
        setValue: null,
      };

      // If request has unknown arm value.
      if (unknownArmValue) {
        hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);

        this.#log.error(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but request has unknown arm value.`);

        throw hapStatus;
      }

      // If request was not successful.
      if (!result.success) {
        hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.OPERATION_TIMED_OUT);

        this.#log.error(`Attempted to set panel status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but request was not successful.`);

        stackTracer('api-response', result);

        throw hapStatus;
      }
    }
  }

  /**
   * ADT Pulse Accessory - Set panel switch status.
   *
   * @param {ADTPulseAccessorySetPanelSwitchStatusOn} on - On.
   *
   * @private
   *
   * @returns {ADTPulseAccessorySetPanelStatusReturns}
   *
   * @since 1.0.0
   */
  private async setPanelSwitchStatus(on: ADTPulseAccessorySetPanelSwitchStatusOn): ADTPulseAccessorySetPanelSwitchStatusReturns {
    const { context } = this.#accessory;
    const {
      id,
      name,
      type,
      uuid,
    } = context;

    let hapStatus;
    let result = {
      success: false,
    };
    let unknownArmValue = false;

    // If device is not a panel switch.
    if (type !== 'panelSwitch') {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);

      this.#log.error(`Attempted to set panel switch status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but device is not a panel switch.`);

      throw hapStatus;
    }

    // If panel status has not been retrieved yet.
    if (this.#state.data.panelStatus === null || this.#state.data.panelStatus.panelStates.length === 0) {
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

    const { panelStates } = this.#state.data.panelStatus;

    const condensedPanelStates = condensePanelStates(this.#characteristic, panelStates);
    const isAlarmActive = isPanelAlarmActive(this.#state.data.panelStatus.panelStatuses);

    // If panel status cannot be found or most likely "Status Unavailable".
    if (condensedPanelStates === undefined) {
      hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_BUSY);

      this.#log.warn(`Attempted to set panel switch status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but panel status cannot be found or most likely "Status Unavailable".`);

      throw hapStatus;
    }

    if (
      !this.#activity.isBusy // The system isn't busy setting a state.
      && isAlarmActive // If system alarm is ringing.
    ) {
      // Set accessory activity to "busy" before arming.
      this.#activity = {
        isBusy: true,
        setCurrentValue: null,
        setTargetValue: null,
        setValue: false,
      };

      // Set the panel status.
      switch (on) {
        case false:
          result = await this.#instance.setPanelStatus(condensedPanelStates.armValue, 'off', isAlarmActive);
          break;
        default:
          unknownArmValue = true;
          break;
      }

      // Set accessory activity to "not busy" after arming.
      this.#activity = {
        isBusy: false,
        setCurrentValue: null,
        setTargetValue: null,
        setValue: null,
      };

      // If request has unknown arm value.
      if (unknownArmValue) {
        hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);

        this.#log.error(`Attempted to set panel switch status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but request has unknown arm value.`);

        throw hapStatus;
      }

      // If request was not successful.
      if (!result.success) {
        hapStatus = new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.OPERATION_TIMED_OUT);

        this.#log.error(`Attempted to set panel switch status on ${chalk.underline(name)} (id: ${id}, uuid: ${uuid}) accessory but request was not successful.`);

        stackTracer('api-response', result);

        throw hapStatus;
      }
    }
  }
}
