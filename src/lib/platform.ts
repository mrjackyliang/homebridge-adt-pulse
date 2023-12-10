import chalk from 'chalk';
import {
  arch,
  argv,
  env,
  platform,
  versions,
} from 'node:process';
import { serializeError } from 'serialize-error';

import { ADTPulse } from '@/lib/api.js';
import {
  detectedNewPanelStatus,
  detectedNewPortalVersion,
  detectedNewSensorInformation,
  detectedNewSensorStatus,
} from '@/lib/detect.js';
import { platformConfig } from '@/lib/schema.js';
import {
  generateMd5Hash,
  getPluralForm,
  sleep,
  stackTracer,
} from '@/lib/utility.js';
import type {
  ADTPulsePlatformAccessories,
  ADTPulsePlatformApi,
  ADTPulsePlatformCharacteristic,
  ADTPulsePlatformConfig,
  ADTPulsePlatformConfigureAccessoryAccessory,
  ADTPulsePlatformConfigureAccessoryReturns,
  ADTPulsePlatformConstants,
  ADTPulsePlatformConstructorApi,
  ADTPulsePlatformConstructorConfig,
  ADTPulsePlatformConstructorLog,
  ADTPulsePlatformFetchUpdatedInformationReturns,
  ADTPulsePlatformInstance,
  ADTPulsePlatformLog,
  ADTPulsePlatformPlugin,
  ADTPulsePlatformPrintSystemInformationReturns,
  ADTPulsePlatformRemoveAccessoryReturns,
  ADTPulsePlatformService,
  ADTPulsePlatformState,
  ADTPulsePlatformSynchronizeKeepAliveReturns,
  ADTPulsePlatformSynchronizeReturns,
  ADTPulsePlatformSynchronizeSyncCheckReturns,
} from '@/types/index.d.ts';

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
   * @private
   *
   * @since 1.0.0
   */
  #config: ADTPulsePlatformConfig;

  /**
   * ADT Pulse Platform - Constants.
   *
   * @private
   *
   * @since 1.0.0
   */
  #constants: ADTPulsePlatformConstants;

  /**
   * ADT Pulse Platform - Instance.
   *
   * @private
   *
   * @since 1.0.0
   */
  #instance: ADTPulsePlatformInstance;

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
   * @private
   *
   * @since 1.0.0
   */
  #state: ADTPulsePlatformState;

  /**
   * ADT Pulse Platform - Constructor.
   *
   * @param {ADTPulsePlatformConstructorLog}    log    - Log.
   * @param {ADTPulsePlatformConstructorConfig} config - Config.
   * @param {ADTPulsePlatformConstructorApi}    api    - Api.
   *
   * @since 1.0.0
   */
  constructor(log: ADTPulsePlatformConstructorLog, config: ADTPulsePlatformConstructorConfig, api: ADTPulsePlatformConstructorApi) {
    this.api = api;
    this.characteristic = api.hap.Characteristic;
    this.#config = config;
    this.#constants = {
      intervalTimestamps: {
        adtKeepAlive: 538000, // 8.9666666667 minutes.
        adtSyncCheck: 3000, // 3 seconds.
        suspendSyncing: 1800000, // 30 minutes.
        synchronize: 1000, // 1 second.
      },
      maxLoginRetries: 3,
    };
    this.#instance = null;
    this.log = log;
    this.service = api.hap.Service;
    this.#state = {
      activity: {
        isAdtKeepingAlive: false,
        isAdtSyncChecking: false,
        isLoggingIn: false,
        isSyncing: false,
      },
      data: {
        gatewayInfo: null,
        panelInfo: null,
        panelStatus: null,
        sensorsInfo: [],
        sensorsStatus: [],
        syncCode: '1-0-0',
      },
      eventCounters: {
        failedLogins: 0,
      },
      intervals: {
        synchronize: undefined,
      },
      lastRunOn: {
        adtKeepAlive: 0, // January 1, 1970, at 00:00:00 UTC.
        adtSyncCheck: 0, // January 1, 1970, at 00:00:00 UTC.
      },
      reportedHashes: [],
    };

    // Parsed Homebridge platform configuration.
    const parsedConfig = platformConfig.safeParse(config);

    // Check for a valid platform configuration before initializing.
    if (!parsedConfig.success) {
      this.log.error('Plugin is unable to initialize due to an invalid platform configuration.');
      stackTracer('zod-error', parsedConfig.error.errors);

      return;
    }

    // Start plugin here after Homebridge has restored all cached accessories from disk.
    api.on('didFinishLaunching', async () => {
      // Initialize the API instance.
      this.#instance = new ADTPulse(
        parsedConfig.data,
        {
          // If Homebridge debug mode, set "this instance" to debug mode as well.
          debug: argv.includes('-D') || argv.includes('--debug'),
          logger: this.log,
        },
      );

      // Print the system information into logs.
      this.printSystemInformation();

      // If the config specifies that plugin should be paused.
      if (this.#config.pause === true) {
        this.log.warn('Plugin is now paused and all related accessories will no longer respond.');

        return;
      }

      // If the config specifies that plugin should be reset.
      if (this.#config.reset === true) {
        this.log.warn('Plugin is now removing all related accessories from Homebridge ...');

        // Remove all related accessories from Homebridge.
        for (let i = this.accessories.length - 1; i >= 0; i -= 1) {
          const accessory = this.accessories[i];

          this.log.info(`Removing ${accessory.displayName} (${accessory.UUID}) accessory ...`);
          //this.removeAccessory(accessory); todo
        }

        return;
      }

      // Start synchronization with the portal.
      this.synchronize();
    });
  }

  /**
   * ADT Pulse Platform - Configure accessory.
   *
   * @param {ADTPulsePlatformConfigureAccessoryAccessory} accessory - Accessory.
   *
   * @returns {ADTPulsePlatformConfigureAccessoryReturns}
   *
   * @since 1.0.0
   */
  configureAccessory(accessory: ADTPulsePlatformConfigureAccessoryAccessory): ADTPulsePlatformConfigureAccessoryReturns {
    this.log.info(`Configuring cached accessory for ${accessory.displayName} (${accessory.context.id}) ...`);

    console.log(accessory);

    // todo configure accessory based on the type.
    // todo i think each accessory can use another function to be built because they all have the same logic

    // Add the restored accessory to the accessories cache.
    this.accessories.push(accessory);
  }

  /**
   * ADT Pulse Platform - Add accessory.
   *
   * @returns {ADTPulsePlatformAddAccessoryReturns}
   *
   * @since 1.0.0
   */
  addAccessory(): ADTPulsePlatformRemoveAccessoryReturns {
    // const uuid1 = this.api.hap.uuid.generate('panel-1');
    // const uuid2 = this.api.hap.uuid.generate('sensor-1');
    // const uuid3 = this.api.hap.uuid.generate('gateway-1');
    // const accessory1 = new this.api.platformAccessory('Security Panel', uuid1);
    // const accessory2 = new this.api.platformAccessory('Front Door', uuid2);
    // const accessory3 = new this.api.platformAccessory('Gateway', uuid3);
    //
    // const panel = accessory1.addService(this.service.SecuritySystem);
    //
    // panel.getCharacteristic(this.characteristic.SecuritySystemTargetState)
    //   .on('get', (callback) => { console.log('got security system target state'); callback(null, this.characteristic.SecuritySystemTargetState.DISARM); })
    //   .on('set', (value, callback) => { console.log('set', value); callback(null); });
    //
    // panel.getCharacteristic(this.characteristic.SecuritySystemCurrentState)
    //   .on('get', (callback) => { console.log('got security system current state'); callback(null, this.characteristic.SecuritySystemCurrentState.DISARMED); });
    //
    // accessory2.addService(this.service.ContactSensor)
    //   .getCharacteristic(this.characteristic.ContactSensorState)
    //   .on('get', (callback) => { console.log('got sensor state'); callback(null, this.characteristic.ContactSensorState.CONTACT_DETECTED); });
    //
    // accessory3.addService(this.service.AccessoryInformation)
    //   .setCharacteristic(this.characteristic.Identify, true)
    //   .setCharacteristic(this.characteristic.Manufacturer, 'manu')
    //   .setCharacteristic(this.characteristic.Model, 'model')
    //   .setCharacteristic(this.characteristic.Name, 'the name')
    //   .setCharacteristic(this.characteristic.SerialNumber, 'serial')
    //   .setCharacteristic(this.characteristic.FirmwareRevision, 'fw rev');
    //
    // this.api.registerPlatformAccessories(
    //   'homebridge-adt-pulse',
    //   'ADTPulse',
    //   [accessory1, accessory2, accessory3],
    // );
  }

  /**
   * ADT Pulse Platform - Remove accessory.
   *
   * @returns {ADTPulsePlatformRemoveAccessoryReturns}
   *
   * @since 1.0.0
   */
  removeAccessory(): ADTPulsePlatformRemoveAccessoryReturns {
    this.api.unregisterPlatformAccessories(
      'homebridge-adt-pulse',
      'ADTPulse',
      this.accessories,
    );
  }

  /**
   * ADT Pulse Platform - Fetch updated information.
   *
   * @private
   *
   * @returns {ADTPulsePlatformFetchUpdatedInformationReturns}
   *
   * @since 1.0.0
   */
  private async fetchUpdatedInformation(): ADTPulsePlatformFetchUpdatedInformationReturns {
    // If API is not available.
    if (this.#instance === null) {
      this.log.warn('fetchUpdatedInformation() was called but API instance is not available ...');

      return;
    }

    try {
      // Fetch all the panel and sensor information.
      const requests = await Promise.all([
        this.#instance.getGatewayInformation(),
        this.#instance.getPanelInformation(),
        this.#instance.getPanelStatus(),
        this.#instance.getSensorsInformation(),
        this.#instance.getSensorsStatus(),
      ]);

      // Update gateway information.
      if (requests[0].success) {
        const { info } = requests[0];

        // Set gateway information into memory.
        this.#state.data.gatewayInfo = info;
      }

      // Update panel information.
      if (requests[1].success) {
        const { info } = requests[1];

        // Set panel information into memory.
        this.#state.data.panelInfo = info;
      }

      // Update panel status.
      if (requests[2].success) {
        const { info } = requests[2];

        const contentHash = generateMd5Hash(info);

        // Set panel status into memory.
        this.#state.data.panelStatus = info;

        // If the detector has not reported this event before.
        if (this.#state.reportedHashes.find((reportedHash) => contentHash === reportedHash) === undefined) {
          const detectedNewStatus = await detectedNewPanelStatus(info, this.log);

          // Send a warning when logs are being sent.
          if (detectedNewStatus) {
            this.log.warn('Plugin has detected an undocumented panel state and/or status. Please keep a look out for new updates ...');
            this.log.info('No need to create a new GitHub issue. This detection is automatically reported to the author ...');

            // Save this hash so the detector does not detect the same thing multiple times.
            this.#state.reportedHashes.push(contentHash);
          }
        }
      }

      // Update sensors information.
      if (requests[3].success) {
        const { sensors } = requests[3].info;

        const contentHash = generateMd5Hash(sensors);

        // Set sensors information into memory.
        this.#state.data.sensorsInfo = sensors;

        // If the detector has not reported this event before.
        if (this.#state.reportedHashes.find((reportedHash) => contentHash === reportedHash) === undefined) {
          const detectedNewSensorsInfo = await detectedNewSensorInformation(sensors, this.log);

          // Send a warning when logs are being sent.
          if (detectedNewSensorsInfo) {
            this.log.warn('Plugin has detected an undocumented sensor icon and/or device type. Please keep a look out for new updates ...');
            this.log.info('No need to create a new GitHub issue. This detection is automatically reported to the author ...');

            // Save this hash so the detector does not detect the same thing multiple times.
            this.#state.reportedHashes.push(contentHash);
          }
        }
      }

      // Update sensors status.
      if (requests[4].success) {
        const { sensors } = requests[4].info;

        const contentHash = generateMd5Hash(sensors);

        // Set sensors status into memory.
        this.#state.data.sensorsStatus = sensors;

        // If the detector has not reported this event before.
        if (this.#state.reportedHashes.find((reportedHash) => contentHash === reportedHash) === undefined) {
          const detectedNewSensorsStatus = await detectedNewSensorStatus(sensors, this.log);

          // Send a warning when logs are being sent.
          if (detectedNewSensorsStatus) {
            this.log.warn('Plugin has detected an undocumented sensor icon and/or status. Please keep a look out for new updates ...');
            this.log.info('No need to create a new GitHub issue. This detection is automatically reported to the author ...');

            // Save this hash so the detector does not detect the same thing multiple times.
            this.#state.reportedHashes.push(contentHash);
          }
        }
      }
    } catch (error) {
      this.log.error('fetchUpdatedInformation() has unexpectedly thrown an error, will continue to fetch ...');
      stackTracer('serialize-error', serializeError(error));
    }
  }

  /**
   * ADT Pulse Platform - Synchronize.
   *
   * @private
   *
   * @returns {ADTPulsePlatformSynchronizeReturns}
   *
   * @since 1.0.0
   */
  private synchronize(): ADTPulsePlatformSynchronizeReturns {
    this.#state.intervals.synchronize = setInterval(async () => {
      // If currently syncing.
      if (this.#state.activity.isSyncing) {
        return;
      }

      // If API is not available.
      if (this.#instance === null) {
        this.log.warn('synchronize() was called but API is not available ...');

        return;
      }

      // Attempt to synchronize.
      try {
        // ACTIVITY: Start sync.
        this.#state.activity.isSyncing = true;

        // Perform login action if "this instance" is not authenticated.
        if (!this.#instance.isAuthenticated()) {
          // Attempt to log in if "this instance" is not currently logging in.
          if (!this.#state.activity.isLoggingIn) {
            // ACTIVITY: Start login.
            this.#state.activity.isLoggingIn = true;

            const login = await this.#instance.login();

            // If login was successful.
            if (login.success) {
              const { portalVersion } = login.info;

              const currentTimestamp = Date.now();

              // Update timing for the sync protocols, so they can pace themselves.
              this.#state.lastRunOn.adtKeepAlive = currentTimestamp;
              this.#state.lastRunOn.adtSyncCheck = currentTimestamp;

              // Check if portal version is available.
              if (portalVersion !== null) {
                const contentHash = generateMd5Hash(portalVersion);

                // If the detector has not reported this event before.
                if (this.#state.reportedHashes.find((reportedHash) => contentHash === reportedHash) === undefined) {
                  const detectedNewVersion = await detectedNewPortalVersion(portalVersion, this.log);

                  if (detectedNewVersion) {
                    this.log.warn(`Plugin has detected an untested web portal version (${portalVersion}). Please keep a look out for new updates ...`);
                    this.log.info('No need to create a new GitHub issue. This detection is automatically reported to the author ...');

                    // Save this hash so the detector does not run more than once.
                    this.#state.reportedHashes.push(contentHash);
                  }
                }
              }
            }

            // If login was not successful.
            if (!login.success) {
              this.#state.eventCounters.failedLogins += 1;

              const attemptsLeft = this.#constants.maxLoginRetries - this.#state.eventCounters.failedLogins;

              if (attemptsLeft > 0) {
                this.log.error(`Login attempt has failed. Trying ${attemptsLeft} more ${getPluralForm(attemptsLeft, 'time', 'times')} ...`);
              } else {
                const suspendMinutes = this.#constants.intervalTimestamps.suspendSyncing / 1000 / 60;

                this.log.error(`Login attempt has failed. Sleeping for ${suspendMinutes} ${getPluralForm(suspendMinutes, 'minute', 'minutes')} before resuming ...`);
              }

              stackTracer('api-response', login);
            }

            // ACTIVITY: Finish login.
            this.#state.activity.isLoggingIn = false;
          }

          // If failed logins have reached the max login retries.
          if (this.#state.eventCounters.failedLogins >= this.#constants.maxLoginRetries) {
            await sleep(this.#constants.intervalTimestamps.suspendSyncing);

            // After sleeping, reset the failed login count.
            this.#state.eventCounters.failedLogins = 0;

            return;
          }

          // Make sure the rest of the code does not run if user is not authenticated.
          if (!this.#instance.isAuthenticated()) {
            return;
          }
        }

        // Get the current timestamp.
        const currentTimestamp = Date.now();

        // Run the keep alive request if time has reached. Do not await, they shall run at their own pace.
        if (currentTimestamp - this.#state.lastRunOn.adtKeepAlive >= this.#constants.intervalTimestamps.adtKeepAlive) {
          this.synchronizeKeepAlive();
        }

        // Run the sync check request if time has reached. Do not await, they shall run at their own pace.
        if (currentTimestamp - this.#state.lastRunOn.adtSyncCheck >= this.#constants.intervalTimestamps.adtSyncCheck) {
          this.synchronizeSyncCheck();
        }
      } catch (error) {
        this.log.error('synchronize() has unexpectedly thrown an error, will continue to sync ...');
        stackTracer('serialize-error', serializeError(error));
      } finally {
        // ACTIVITY: Finish sync.
        this.#state.activity.isSyncing = false;
      }
    }, this.#constants.intervalTimestamps.synchronize);
  }

  /**
   * ADT Pulse Platform - Synchronize keep alive.
   *
   * @private
   *
   * @returns {ADTPulsePlatformSynchronizeKeepAliveReturns}
   *
   * @since 1.0.0
   */
  private synchronizeKeepAlive(): ADTPulsePlatformSynchronizeKeepAliveReturns {
    // Running an IIFE, to internalize async context.
    (async () => {
      // If currently keeping alive.
      if (this.#state.activity.isAdtKeepingAlive) {
        return;
      }

      // If API is not available.
      if (this.#instance === null) {
        this.log.warn('synchronizeKeepAlive() was called but API instance is not available ...');

        return;
      }

      // Attempt to keep alive.
      try {
        // ACTIVITY: Start keeping alive.
        this.#state.activity.isAdtKeepingAlive = true;

        const keepAlive = await this.#instance.performKeepAlive();

        // If keeping alive was successful.
        if (keepAlive.success) {
          this.log.debug('Keep alive request was successful. The login session should now be extended ...');
        }

        // If keeping alive was not successful.
        if (!keepAlive.success) {
          this.log.error('Keeping alive attempt has failed. Trying again later ...');
          stackTracer('api-response', keepAlive);
        }

        // Update timestamp for keep alive request, even if request failed.
        this.#state.lastRunOn.adtKeepAlive = Date.now();
      } catch (error) {
        this.log.error('synchronizeKeepAlive() has unexpectedly thrown an error, will continue to keep alive ...');
        stackTracer('serialize-error', serializeError(error));
      } finally {
        // ACTIVITY: Finish keeping alive.
        this.#state.activity.isAdtKeepingAlive = false;
      }
    })();
  }

  /**
   * ADT Pulse Platform - Synchronize sync check.
   *
   * @private
   *
   * @returns {ADTPulsePlatformSynchronizeSyncCheckReturns}
   *
   * @since 1.0.0
   */
  private synchronizeSyncCheck(): ADTPulsePlatformSynchronizeSyncCheckReturns {
    // Running an IIFE, to internalize async context.
    (async () => {
      // If currently sync checking.
      if (this.#state.activity.isAdtSyncChecking) {
        return;
      }

      // If API is not available.
      if (this.#instance === null) {
        this.log.warn('synchronizeSyncCheck() was called but API instance is not available ...');

        return;
      }

      // Attempt to sync check.
      try {
        // ACTIVITY: Start sync checking.
        this.#state.activity.isAdtSyncChecking = true;

        const syncCheck = await this.#instance.performSyncCheck();

        // If sync checking was successful.
        if (syncCheck.success) {
          this.log.debug('Sync check request was successful. Determining if panel and sensor data is outdated ...');

          // If new sync code is different from the cached sync code.
          if (syncCheck.info.syncCode !== this.#state.data.syncCode) {
            this.log.debug(`New sync code detected (old: ${this.#state.data.syncCode}, new: ${syncCheck.info.syncCode}). Preparing to retrieve the latest panel and sensor data ...`);

            // Cache the sync code.
            this.#state.data.syncCode = syncCheck.info.syncCode;

            // Request new data from the portal. Should be awaited.
            await this.fetchUpdatedInformation();
          }
        }

        // If sync checking was not successful.
        if (!syncCheck.success) {
          this.log.error('Sync checking attempt has failed. Trying again later ...');
          stackTracer('api-response', syncCheck);
        }

        // Update timestamp for sync check request, even if request failed.
        this.#state.lastRunOn.adtSyncCheck = Date.now();
      } catch (error) {
        this.log.error('synchronizeSyncCheck() has unexpectedly thrown an error, will continue to sync check ...');
        stackTracer('serialize-error', serializeError(error));
      } finally {
        // ACTIVITY: Finish sync checking.
        this.#state.activity.isAdtSyncChecking = false;
      }
    })();
  }

  /**
   * ADT Pulse Platform - Print system information.
   *
   * @private
   *
   * @returns {ADTPulsePlatformPrintSystemInformationReturns}
   *
   * @since 1.0.0
   */
  private printSystemInformation(): ADTPulsePlatformPrintSystemInformationReturns {
    const homebridgeVersion = chalk.yellowBright(`v${this.api.serverVersion}`);
    const nodeVersion = chalk.blueBright(`v${versions.node}`);
    const opensslVersion = chalk.magentaBright(`v${versions.openssl}`);
    const packageVersion = chalk.greenBright(`v${env.npm_package_version}`);
    const platformPlusArch = chalk.redBright(`${platform} (${arch})`);
    const separator = chalk.gray(' // ');

    this.log.info([
      `running on ${platformPlusArch}`,
      `homebridge-adt-pulse ${packageVersion}`,
      `homebridge ${homebridgeVersion}`,
      `node ${nodeVersion}`,
      `openssl ${opensslVersion}`,
    ].join(separator));
  }
}
