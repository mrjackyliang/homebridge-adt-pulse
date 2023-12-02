import type { PlatformAccessory } from 'homebridge';

import type {
  ADTPulsePlatformAccessories,
  ADTPulsePlatformApi,
  ADTPulsePlatformCharacteristic,
  ADTPulsePlatformConfig,
  ADTPulsePlatformConstructorApi,
  ADTPulsePlatformConstructorConfig,
  ADTPulsePlatformConstructorLog,
  ADTPulsePlatformLog,
  ADTPulsePlatformPlugin,
  ADTPulsePlatformService,
  // ADTPulsePlatformState,
} from '@/types';

/**
 * ADT Pulse Platform.
 *
 * @since 1.0.0
 */
export class ADTPulsePlatform implements ADTPulsePlatformPlugin {
  /**
   * ADT Pulse Platform - Accessories.
   *
   * @since 1.0.0
   */
  accessories: ADTPulsePlatformAccessories = [];

  /**
   * ADT Pulse Platform - Api.
   *
   * @since 1.0.0
   */
  api: ADTPulsePlatformApi;

  /**
   * ADT Pulse Platform - Characteristic.
   *
   * @since 1.0.0
   */
  characteristic: ADTPulsePlatformCharacteristic;

  /**
   * ADT Pulse Platform - Config.
   *
   * @since 1.0.0
   */
  config: ADTPulsePlatformConfig;

  /**
   * ADT Pulse Platform - Log.
   *
   * @since 1.0.0
   */
  log: ADTPulsePlatformLog;

  /**
   * ADT Pulse Platform - Service.
   *
   * @since 1.0.0
   */
  service: ADTPulsePlatformService;

  /**
   * ADT Pulse Platform - State.
   *
   * @since 1.0.0
   */
  // state: ADTPulsePlatformState;

  /**
   * ADT Pulse Platform - Constructor.
   *
   * @since 1.0.0
   */
  constructor(log: ADTPulsePlatformConstructorLog, config: ADTPulsePlatformConstructorConfig, api: ADTPulsePlatformConstructorApi) {
    this.api = api;
    this.characteristic = api.hap.Characteristic;
    this.config = config;
    this.log = log;
    this.service = api.hap.Service;

    log.debug('Finished initializing platform:', config.name);

    // When this event is fired it means Homebridge has restored all cached accessories from disk.
    // Dynamic Platform plugins should only register new accessories after this event was fired,
    // in order to ensure they weren't added to homebridge already. This event can also be used
    // to start discovery of new accessories.
    api.on('didFinishLaunching', () => {
      log.debug('Executed didFinishLaunching callback');
      // run the method to discover / register your devices as accessories
    });
  }

  // todo don't forget to add the detectors (ntfy)

  /**
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to setup event handlers for characteristics and update respective values.
   */
  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);

    // add the restored accessory to the accessories cache so we can track if it has already been registered
    this.accessories.push(accessory);
  }

  /**
   * This is an example method showing how to register discovered accessories.
   * Accessories must only be registered once, previously created accessories
   * must not be registered again to prevent "duplicate UUID" errors.
   */
  static discoverDevices() {

  }
}
