import type {
  ADTPulseAccessoryConstructorAccessory,
  ADTPulseAccessoryConstructorCharacteristic,
  ADTPulseAccessoryConstructorLog,
  ADTPulseAccessoryConstructorService,
  ADTPulseAccessoryService,
} from '@/types/index.d.ts';

/**
 * ADT Pulse Accessory.
 *
 * @since 1.0.0
 */
export class ADTPulseAccessory {
  /**
   * ADT Pulse Accessory - Service.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #service: ADTPulseAccessoryService;

  /**
   * ADT Pulse Accessory - Constructor.
   *
   * @param {ADTPulseAccessoryConstructorAccessory}      accessory      - Accessory.
   * @param {ADTPulseAccessoryConstructorService}        service        - Service.
   * @param {ADTPulseAccessoryConstructorCharacteristic} characteristic - Characteristic.
   * @param {ADTPulseAccessoryConstructorLog}            log            - Log.
   *
   * @since 1.0.0
   */
  constructor(accessory: ADTPulseAccessoryConstructorAccessory, service: ADTPulseAccessoryConstructorService, characteristic: ADTPulseAccessoryConstructorCharacteristic, log: ADTPulseAccessoryConstructorLog) {

  }
}
