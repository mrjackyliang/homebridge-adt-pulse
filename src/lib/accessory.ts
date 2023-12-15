import type {
  ADTPulseAccessoryAccessory,
  ADTPulseAccessoryConstructorAccessory,
  ADTPulseAccessoryConstructorCharacteristic,
  ADTPulseAccessoryConstructorLog,
  ADTPulseAccessoryConstructorService,
  ADTPulseAccessoryConstructorState,
  ADTPulseAccessoryLog,
  ADTPulseAccessoryServices,
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
   * @param {ADTPulseAccessoryConstructorService}        service        - Service.
   * @param {ADTPulseAccessoryConstructorCharacteristic} characteristic - Characteristic.
   * @param {ADTPulseAccessoryConstructorLog}            log            - Log.
   *
   * @since 1.0.0
   */
  constructor(accessory: ADTPulseAccessoryConstructorAccessory, state: ADTPulseAccessoryConstructorState, service: ADTPulseAccessoryConstructorService, characteristic: ADTPulseAccessoryConstructorCharacteristic, log: ADTPulseAccessoryConstructorLog) {
    this.#accessory = accessory;
    this.#log = log;
    this.#services = {};
    this.#state = state;

    // Fetch the information service for all types of accessory.
    this.#services.Information = this.#accessory.getService(service.AccessoryInformation);

    // Fetch the services associated with the specific type of accessory.
    switch (accessory.context.type) {
      case 'co':
        this.#services.Primary = this.#accessory.getService(service.CarbonMonoxideSensor);
        break;
      case 'doorWindow':
        this.#services.Primary = this.#accessory.getService(service.ContactSensor);
        break;
      case 'fire':
        this.#services.Primary = this.#accessory.getService(service.SmokeSensor);
        break;
      case 'flood':
        this.#services.Primary = this.#accessory.getService(service.LeakSensor);
        break;
      case 'gateway':
        this.#services.Primary = this.#accessory.getService(service.Assistant);
        break;
      case 'glass':
        this.#services.Primary = this.#accessory.getService(service.ContactSensor);
        break;
      case 'motion':
        this.#services.Primary = this.#accessory.getService(service.MotionSensor);
        break;
      case 'panel':
        this.#services.Primary = this.#accessory.getService(service.SecuritySystem);
        break;
      case 'temperature':
        this.#services.Primary = this.#accessory.getService(service.TemperatureSensor);
        break;
      default:
        break;
    }

    // Check for missing services.
    if (this.#services.Information === undefined || this.#services.Primary === undefined) {
      this.#log.error('There was a problem initializing services. This accessory will not work until the problems are fixed.'); // todo more descriptive error message.

      return;
    }

    // Setting the accessory information.
    this.#services.Information
      .setCharacteristic(characteristic.Manufacturer, accessory.context.manufacturer ?? 'ADT')
      .setCharacteristic(characteristic.Model, accessory.context.model ?? 'N/A')
      .setCharacteristic(characteristic.SerialNumber, accessory.context.serial ?? 'N/A');
  }

  /**
   * Get latest state.
   *
   * @since 1.0.0
   */
  getLatestState() {
    console.log(this.#state); // todo temporary.
  }
}
