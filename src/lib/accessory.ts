import type {
  ADTPulseAccessoryAccessory,
  ADTPulseAccessoryApi,
  ADTPulseAccessoryCharacteristic,
  ADTPulseAccessoryConstructorAccessory,
  ADTPulseAccessoryConstructorApi,
  ADTPulseAccessoryConstructorCharacteristic,
  ADTPulseAccessoryConstructorInstance,
  ADTPulseAccessoryConstructorLog,
  ADTPulseAccessoryConstructorService,
  ADTPulseAccessoryConstructorState,
  ADTPulseAccessoryGetPanelStatusContext,
  ADTPulseAccessoryGetPanelStatusMode,
  ADTPulseAccessoryGetPanelStatusReturns,
  ADTPulseAccessoryGetSensorStatusContext,
  ADTPulseAccessoryGetSensorStatusReturns,
  ADTPulseAccessoryInstance,
  ADTPulseAccessoryLog,
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
  #log: ADTPulseAccessoryLog;

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
  readonly #state: ADTPulseAccessoryState;

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
  constructor(accessory: ADTPulseAccessoryConstructorAccessory, state: ADTPulseAccessoryConstructorState, instance: ADTPulseAccessoryConstructorInstance, service: ADTPulseAccessoryConstructorService, characteristic: ADTPulseAccessoryConstructorCharacteristic, api: ADTPulseAccessoryConstructorApi, log: ADTPulseAccessoryConstructorLog) {
    this.#accessory = accessory;
    this.#api = api;
    this.#characteristic = characteristic;
    this.#instance = instance;
    this.#log = log;
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
        this.#services.Primary = this.#accessory.getService(service.MotionSensor) ?? this.#accessory.addService(service.MotionSensor);
        break;
      case 'keypad':
        // TODO nothing done here yet
        break;
      case 'motion':
        this.#services.Primary = this.#accessory.getService(service.MotionSensor) ?? this.#accessory.addService(service.MotionSensor);
        break;
      case 'panel':
        this.#services.Primary = this.#accessory.getService(service.SecuritySystem) ?? this.#accessory.addService(service.SecuritySystem);
        break;
      case 'panic':
        // TODO nothing done here yet
        break;
      case 'temperature':
        this.#services.Primary = this.#accessory.getService(service.TemperatureSensor) ?? this.#accessory.addService(service.TemperatureSensor);
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
        this.#services.Primary.getCharacteristic(this.#characteristic.MotionDetected)
          .onGet(() => this.getSensorStatus(accessory.context));
        break;
      case 'keypad':
        // TODO nothing done here yet
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
        // TODO nothing done here yet
        break;
      case 'temperature':
        this.#services.Primary.getCharacteristic(this.#characteristic.CurrentTemperature)
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
  private getSensorStatus(context: ADTPulseAccessoryGetSensorStatusContext): ADTPulseAccessoryGetSensorStatusReturns {
    const { name, type, zone } = context;

    const sensor = this.#state.data.sensorsStatus.find((sensorStatus) => zone !== null && sensorStatus.name === name && sensorStatus.zone === zone);
    const knownSensorTypes = [
      'co',
      'doorWindow',
      'fire',
      'flood',
      'glass',
      'keypad',
      'motion',
      'panic',
      'temperature',
    ];

    // If the sensor is not found or sensor type is invalid.
    if (sensor === undefined || !knownSensorTypes.includes(type)) {
      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_DOES_NOT_EXIST);
    }

    const { status } = sensor;

    // If the sensor is currently offline.
    if (status === 'Unknown') {
      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }

    // Find the status based on the sensor type.
    switch (context.type) {
      case 'co':
        return this.#characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL; // TODO Fake status, need more information from portal.
        // break; TODO Put this back later when I get the full information in.
      case 'doorWindow':
        if (status.includes('Open')) {
          return this.#characteristic.ContactSensorState.CONTACT_NOT_DETECTED;
        }

        if (status.includes('Closed')) {
          return this.#characteristic.ContactSensorState.CONTACT_DETECTED;
        }
        break;
      case 'fire':
        return this.#characteristic.SmokeDetected.SMOKE_NOT_DETECTED; // TODO Fake status, need more information from portal.
        // break; TODO Put this back later when I get the full information in.
      case 'flood':
        if (status.includes('ALARM')) {
          return this.#characteristic.LeakDetected.LEAK_DETECTED;
        }

        if (status.includes('Okay')) {
          return this.#characteristic.LeakDetected.LEAK_NOT_DETECTED; // TODO Not 100% sure yet.
        }
        break;
      case 'glass':
        if (status.includes('Okay')) {
          return false;
        }

        if (status.includes('Tripped')) {
          return true;
        }
        break;
      case 'keypad':
        // TODO nothing done here yet
        break;
      case 'motion':
        if (status.includes('No Motion')) {
          return false;
        }

        if (status.includes('Motion')) {
          return true;
        }
        break;
      case 'panic':
        // TODO nothing done here yet
        break;
      case 'temperature':
        return 75; // TODO Fake status, need more information from portal.
        // break; TODO Put this back later when I get the full information in.
      default:
        break;
    }

    // Throw error if sensor type not found.
    throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_DOES_NOT_EXIST);
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
  private getPanelStatus(mode: ADTPulseAccessoryGetPanelStatusMode, context: ADTPulseAccessoryGetPanelStatusContext): ADTPulseAccessoryGetPanelStatusReturns {
    // If device is not a security panel.
    if (context.type !== 'panel') {
      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_DOES_NOT_EXIST);
    }

    // If panel has no status.
    if (
      this.#state.data.panelStatus === null
      || this.#state.data.panelStatus.state === null
      || this.#state.data.panelStatus.status === null
    ) {
      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }

    const { state, status } = this.#state.data.panelStatus;

    // If panel state is "Service Unavailable".
    if (state === 'Status Unavailable') {
      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }

    // If mode is "current" and panel status is "BURGLARY ALARM".
    if (mode === 'current' && status === 'BURGLARY ALARM') {
      return this.#characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED;
    }

    // All the other panel states.
    switch (state) {
      case 'Armed Away':
        return (mode === 'current') ? this.#characteristic.SecuritySystemCurrentState.AWAY_ARM : this.#characteristic.SecuritySystemTargetState.AWAY_ARM;
      case 'Armed Stay':
        return (mode === 'current') ? this.#characteristic.SecuritySystemCurrentState.STAY_ARM : this.#characteristic.SecuritySystemTargetState.STAY_ARM;
      case 'Armed Night':
        return (mode === 'current') ? this.#characteristic.SecuritySystemCurrentState.NIGHT_ARM : this.#characteristic.SecuritySystemTargetState.NIGHT_ARM;
      case 'Disarmed':
        return (mode === 'current') ? this.#characteristic.SecuritySystemCurrentState.DISARMED : this.#characteristic.SecuritySystemTargetState.DISARM;
      default:
        break;
    }

    // If panel has unknown status.
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
    let result;

    // If device is not a security panel.
    if (context.type !== 'panel') {
      throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.RESOURCE_DOES_NOT_EXIST);
    }

    // Set the panel status.
    switch (arm) {
      case this.#characteristic.SecuritySystemTargetState.STAY_ARM:
        result = await this.#instance.setPanelStatus('stay');
        break;
      case this.#characteristic.SecuritySystemTargetState.AWAY_ARM:
        result = await this.#instance.setPanelStatus('away');
        break;
      case this.#characteristic.SecuritySystemTargetState.NIGHT_ARM:
        result = await this.#instance.setPanelStatus('night');
        break;
      case this.#characteristic.SecuritySystemTargetState.DISARM:
        result = await this.#instance.setPanelStatus('off');
        break;
      default:
        break;
    }

    // If setting the panel status was successful.
    if (result && result.success) {
      return;
    }

    // If panel has unknown arm value.
    throw new this.#api.hap.HapStatusError(this.#api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST);
  }
}
