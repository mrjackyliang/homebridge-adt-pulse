import chalk from 'chalk';
import _ from 'lodash';
import {
  arch,
  argv,
  platform,
  versions,
} from 'node:process';
import { serializeError } from 'serialize-error';

import { ADTPulseAccessory } from '@/lib/accessory.js';
import { ADTPulseAPI } from '@/lib/api.js';
import { detectPlatformUnknownSensorsAction } from '@/lib/detect.js';
import { textOrbTextSummarySections } from '@/lib/regex.js';
import { platformConfig } from '@/lib/schema.js';
import {
  condenseSensorType,
  findIndexWithValue,
  generateHash,
  getAccessoryCategory,
  getPackageVersion,
  getPluralForm,
  isMaintenancePeriod,
  sleep,
  stackTracer,
} from '@/lib/utility.js';
import type {
  ADTPulsePlatformAccessories,
  ADTPulsePlatformAddAccessoryDevice,
  ADTPulsePlatformAddAccessoryReturns,
  ADTPulsePlatformAddAccessoryTypedAccessory,
  ADTPulsePlatformApi,
  ADTPulsePlatformCharacteristic,
  ADTPulsePlatformConfig,
  ADTPulsePlatformConfigureAccessoryAccessory,
  ADTPulsePlatformConfigureAccessoryReturns,
  ADTPulsePlatformConstants,
  ADTPulsePlatformConstructorApi,
  ADTPulsePlatformConstructorConfig,
  ADTPulsePlatformConstructorLog,
  ADTPulsePlatformDebugMode,
  ADTPulsePlatformFetchUpdatedInformationReturns,
  ADTPulsePlatformHandlers,
  ADTPulsePlatformInstance,
  ADTPulsePlatformLog,
  ADTPulsePlatformLogStatusChangesNewCache,
  ADTPulsePlatformLogStatusChangesOldCache,
  ADTPulsePlatformLogStatusChangesReturns,
  ADTPulsePlatformPlugin,
  ADTPulsePlatformPollAccessoriesDevices,
  ADTPulsePlatformPollAccessoriesReturns,
  ADTPulsePlatformPrintSystemInformationReturns,
  ADTPulsePlatformRemoveAccessoryAccessory,
  ADTPulsePlatformRemoveAccessoryReason,
  ADTPulsePlatformRemoveAccessoryReturns,
  ADTPulsePlatformService,
  ADTPulsePlatformState,
  ADTPulsePlatformSynchronizeKeepAliveReturns,
  ADTPulsePlatformSynchronizeReturns,
  ADTPulsePlatformSynchronizeSyncCheckReturns,
  ADTPulsePlatformUnifyDevicesDevices,
  ADTPulsePlatformUnifyDevicesId,
  ADTPulsePlatformUnifyDevicesReturns,
  ADTPulsePlatformUnknownInformationDispatcherReturns,
  ADTPulsePlatformUnknownInformationDispatcherSensors,
  ADTPulsePlatformUpdateAccessoryDevice,
  ADTPulsePlatformUpdateAccessoryReturns,
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
   * @private
   *
   * @since 1.0.0
   */
  #accessories: ADTPulsePlatformAccessories;

  /**
   * ADT Pulse Platform - Api.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #api: ADTPulsePlatformApi;

  /**
   * ADT Pulse Platform - Characteristic.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #characteristic: ADTPulsePlatformCharacteristic;

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
   * ADT Pulse Platform - Debug mode.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #debugMode: ADTPulsePlatformDebugMode;

  /**
   * ADT Pulse Platform - Handlers.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #handlers: ADTPulsePlatformHandlers;

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
   * @private
   *
   * @since 1.0.0
   */
  readonly #log: ADTPulsePlatformLog;

  /**
   * ADT Pulse Platform - Service.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #service: ADTPulsePlatformService;

  /**
   * ADT Pulse Platform - State.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #state: ADTPulsePlatformState;

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
    this.#accessories = [];
    this.#api = api;
    this.#characteristic = api.hap.Characteristic;
    this.#config = null;
    this.#constants = {
      intervalTimestamps: {
        adtKeepAlive: 538000, // 8 minutes, 58 seconds.
        adtSessionLifespan: 19368000, // 5 hours, 22 minutes, 48 seconds.
        adtSyncCheck: 3000, // 3 seconds.
        suspendSyncing: 1800000, // 30 minutes.
        synchronize: 1000, // 1 second.
      },
      maxLoginRetries: 3,
    };
    this.#debugMode = argv.includes('-D') || argv.includes('--debug');
    this.#handlers = {};
    this.#instance = null;
    this.#log = log;
    this.#service = api.hap.Service;
    this.#state = {
      activity: {
        isAdtKeepingAlive: false,
        isAdtSyncChecking: false,
        isLoggingIn: false,
        isSyncing: false,
      },
      data: {
        gatewayInfo: null,
        orbSecurityButtons: [],
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
        adtLastLogin: 0, // January 1, 1970, at 00:00:00 UTC.
        adtSyncCheck: 0, // January 1, 1970, at 00:00:00 UTC.
      },
      reportedHashes: [],
    };

    // Parsed Homebridge platform configuration.
    const parsedConfig = platformConfig.safeParse(config);

    // Check for a valid platform configuration before initializing.
    if (!parsedConfig.success) {
      this.#log.error('Plugin is unable to initialize due to an invalid platform configuration.');
      this.#log.warn('If you just upgraded from v2 to v3, the configuration has been changed. Please re-configure your plugin.');
      this.#log.warn('Carefully observe the error below. The answer you are looking for is there.');
      stackTracer('zod-error', parsedConfig.error.errors);

      return;
    }

    // Start plugin here after Homebridge has restored all cached accessories from disk.
    api.on('didFinishLaunching', async () => {
      // Assign the parsed config.
      this.#config = parsedConfig.data;

      // Print the system information into logs.
      this.printSystemInformation();

      // Give notice to users this plugin is being anonymously tracked.
      this.#log.info('The API gathers anonymous analytics to detect potential bugs or issues. All personally identifiable information will be redacted.');

      // If the config specifies that plugin should be paused.
      if (this.#config.mode === 'paused') {
        this.#log.warn('Plugin is now paused and all related accessories will no longer respond.');

        return;
      }

      // If the config specifies that plugin should be reset.
      if (this.#config.mode === 'reset') {
        let warningCount = 0;
        let warningTerm = '';

        this.#log.warn('Plugin started in reset mode and will remove all accessories shortly.');

        // Make sure user sees the first warning.
        await sleep(10000);

        for (let i = 3; i >= 1; i -= 1) {
          const seconds = 10 * i;

          // Track the warning count.
          warningCount += 1;

          // Display the warning term based on the warning count.
          switch (warningCount) {
            case 1:
              warningTerm = 'FIRST';
              break;
            case 2:
              warningTerm = 'SECOND';
              break;
            case 3:
            default:
              warningTerm = 'FINAL';
              break;
          }

          this.#log.warn(`${warningTerm} WARNING! ${seconds} SECONDS REMAINING before all related accessories are removed.`);

          // Safe countdown in case the user regrets their choice.
          await sleep(10000);
        }

        this.#log.warn('Plugin is now removing all related accessories from Homebridge ...');

        // Remove all related accessories from Homebridge.
        for (let i = this.#accessories.length - 1; i >= 0; i -= 1) {
          this.removeAccessory(this.#accessories[i], 'plugin is in "reset" mode');
        }

        this.#log.info('Plugin finished removing all related accessories from Homebridge.');

        return;
      }

      // If the config specifies that plugin should run under reduced speed mode.
      if (this.#config.speed !== 1) {
        this.#log.warn(`Plugin is now running under ${this.#config.speed}x operational speed. You may see slower device updates.`);

        // Formula: New Time = Original Time * (1 / Speed).
        this.#constants.intervalTimestamps.synchronize *= (1 / this.#config.speed);
      }

      // If the config specifies that the plugin should apply the advanced options.
      if (this.#config.options.length > 0) {
        this.#log.warn('Plugin will apply the advanced options saved in the configuration. You may see some loss in functionality.');
        stackTracer('config-content', this.#config.options);
      }

      // Initialize the API instance.
      this.#instance = new ADTPulseAPI(
        this.#config,
        {
          // If Homebridge debug mode, set "this instance" to debug mode as well.
          debug: this.#debugMode === true,
          logger: this.#log,
        },
      );

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
  public configureAccessory(accessory: ADTPulsePlatformConfigureAccessoryAccessory): ADTPulsePlatformConfigureAccessoryReturns {
    this.#log.info(`Configuring cached accessory for ${chalk.underline(accessory.context.name)} (id: ${accessory.context.id}, uuid: ${accessory.context.uuid}) ...`);

    // Add the restored accessory to the accessories cache.
    this.#accessories.push(accessory);
  }

  /**
   * ADT Pulse Platform - Add accessory.
   *
   * @param {ADTPulsePlatformAddAccessoryDevice} device - Device.
   *
   * @returns {ADTPulsePlatformAddAccessoryReturns}
   *
   * @since 1.0.0
   */
  addAccessory(device: ADTPulsePlatformAddAccessoryDevice): ADTPulsePlatformAddAccessoryReturns {
    const accessoryIndex = this.#accessories.findIndex((accessory) => device.uuid === accessory.context.uuid);

    // Prevent adding duplicate accessory.
    if (accessoryIndex >= 0) {
      this.#log.error(`Cannot add ${chalk.underline(device.name)} (id: ${device.id}, uuid: ${device.uuid}) accessory that already exists.`);

      return;
    }

    // If API instance is not available.
    if (this.#instance === null) {
      this.#log.error(`Attempted to add ${chalk.underline(device.name)} (id: ${device.id}, uuid: ${device.uuid}) accessory but API instance is not available.`);

      return;
    }

    // Create the new accessory without context.
    const newAccessory = new this.#api.platformAccessory(
      device.name,
      device.uuid,
      getAccessoryCategory(device.category),
    );

    // Set the context into the new accessory.
    newAccessory.context = device;

    // Let TypeScript know that the context now exists. This creates additional runtime.
    const typedAccessory = newAccessory as ADTPulsePlatformAddAccessoryTypedAccessory;

    this.#log.info(`Adding ${chalk.underline(typedAccessory.context.name)} (id: ${typedAccessory.context.id}, uuid: ${typedAccessory.context.uuid}) accessory ...`);

    // Create the handler for the new accessory if it does not exist.
    if (this.#handlers[device.id] === undefined) {
      this.#handlers[device.id] = new ADTPulseAccessory(
        typedAccessory,
        this.#state,
        this.#config,
        this.#instance,
        this.#service,
        this.#characteristic,
        this.#api,
        this.#log,
      );
    }

    // Force the accessory status to refresh.
    this.#handlers[device.id].updater();

    // Save the new accessory into the accessories cache.
    this.#accessories.push(typedAccessory);

    this.#api.registerPlatformAccessories(
      'homebridge-adt-pulse',
      'ADTPulse',
      [typedAccessory],
    );
  }

  /**
   * ADT Pulse Platform - Update accessory.
   *
   * @param {ADTPulsePlatformUpdateAccessoryDevice} device - Device.
   *
   * @returns {ADTPulsePlatformUpdateAccessoryReturns}
   *
   * @since 1.0.0
   */
  updateAccessory(device: ADTPulsePlatformUpdateAccessoryDevice): ADTPulsePlatformUpdateAccessoryReturns {
    const { index, value } = findIndexWithValue(
      this.#accessories,
      (accessory) => device.uuid === accessory.context.uuid,
    );

    if (index < 0 || value === undefined) {
      this.#log.warn(`Attempted to update ${chalk.underline(device.name)} (id: ${device.id}, uuid: ${device.uuid}) accessory that does not exist.`);

      return;
    }

    // If API instance is not available.
    if (this.#instance === null) {
      this.#log.error(`Attempted to updated ${chalk.underline(device.name)} (id: ${device.id}, uuid: ${device.uuid}) accessory but API instance is not available.`);

      return;
    }

    this.#log.debug(`Updating ${chalk.underline(value.context.name)} (id: ${value.context.id}, uuid: ${value.context.uuid}) accessory ...`);

    // Set the context into the existing accessory.
    value.context = device;

    // Update the display name.
    value.displayName = device.name;

    // Create the handler for the existing accessory if it does not exist.
    if (this.#handlers[device.id] === undefined) {
      this.#handlers[device.id] = new ADTPulseAccessory(
        value,
        this.#state,
        this.#config,
        this.#instance,
        this.#service,
        this.#characteristic,
        this.#api,
        this.#log,
      );
    }

    // Force the accessory status to refresh.
    this.#handlers[device.id].updater();

    // Update the existing accessory in the accessories cache.
    this.#accessories[index] = value;

    this.#api.updatePlatformAccessories(
      [value],
    );
  }

  /**
   * ADT Pulse Platform - Remove accessory.
   *
   * @param {ADTPulsePlatformRemoveAccessoryAccessory} accessory - Accessory.
   * @param {ADTPulsePlatformRemoveAccessoryReason}    reason    - Reason.
   *
   * @returns {ADTPulsePlatformRemoveAccessoryReturns}
   *
   * @since 1.0.0
   */
  removeAccessory(accessory: ADTPulsePlatformRemoveAccessoryAccessory, reason: ADTPulsePlatformRemoveAccessoryReason): ADTPulsePlatformRemoveAccessoryReturns {
    this.#log.info(`Removing ${chalk.underline(accessory.context.name)} (id: ${accessory.context.id}, uuid: ${accessory.context.uuid}) accessory ...`);

    // Specify the reason why this accessory is removed.
    this.#log.debug(`${chalk.underline(accessory.context.name)} (id: ${accessory.context.id}, uuid: ${accessory.context.uuid}) is removed because ${reason}.`);

    // Keep only the accessories in the cache that is not the accessory being removed.
    this.#accessories = this.#accessories.filter((existingAccessory) => existingAccessory.context.uuid !== accessory.context.uuid);

    this.#api.unregisterPlatformAccessories(
      'homebridge-adt-pulse',
      'ADTPulse',
      [accessory],
    );
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
    const homebridgeVersion = chalk.yellowBright(`v${this.#api.serverVersion}`);
    const nodeVersion = chalk.blueBright(`v${versions.node}`);
    const opensslVersion = chalk.magentaBright(`v${versions.openssl}`);
    const packageVersion = chalk.greenBright(`v${getPackageVersion()}`);
    const platformPlusArch = chalk.redBright(`${platform} (${arch})`);

    this.#log.info([
      `running on ${platformPlusArch}`,
      `homebridge-adt-pulse ${packageVersion}`,
      `homebridge ${homebridgeVersion}`,
      `node ${nodeVersion}`,
      `openssl ${opensslVersion}`,
    ].join(chalk.gray(' // ')));
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

      // Checks for a "null" instance. Just in case it happens.
      if (this.#instance === null) {
        this.#log.warn('synchronize() was called but API is not available.');

        return;
      }

      // Attempt to synchronize.
      try {
        let currentTimestamp = Date.now();

        // ACTIVITY: Start sync.
        this.#state.activity.isSyncing = true;

        // If login session has become stale and not receiving the latest updates, force a session reset.
        if (
          currentTimestamp - this.#state.lastRunOn.adtLastLogin >= this.#constants.intervalTimestamps.adtSessionLifespan
          && this.#state.lastRunOn.adtLastLogin !== 0
        ) {
          this.#log.debug('Login session requires a reset. Resetting the login session now ...');

          this.#instance.resetSession();
        }

        // Perform login action if "this instance" is not authenticated.
        if (!this.#instance.isAuthenticated()) {
          // Attempt to log in if "this instance" is not currently logging in.
          if (!this.#state.activity.isLoggingIn) {
            // ACTIVITY: Start login.
            this.#state.activity.isLoggingIn = true;

            const login = await this.#instance.login();

            // If login was successful.
            if (login.success) {
              currentTimestamp = Date.now();

              // Update timing for the sync protocols, so the methods being called can pace themselves.
              this.#state.lastRunOn.adtKeepAlive = currentTimestamp;
              this.#state.lastRunOn.adtLastLogin = currentTimestamp;
              this.#state.lastRunOn.adtSyncCheck = currentTimestamp;
            }

            // If login was not successful.
            if (!login.success) {
              this.#state.eventCounters.failedLogins += 1;

              const attemptsLeft = this.#constants.maxLoginRetries - this.#state.eventCounters.failedLogins;

              if (attemptsLeft > 0) {
                this.#log.error(`Login attempt has failed. Trying ${attemptsLeft} more ${getPluralForm(attemptsLeft, 'time', 'times')} ...`);
              } else {
                const suspendMinutes = this.#constants.intervalTimestamps.suspendSyncing / 1000 / 60;

                this.#log.error(`Login attempt has failed for ${this.#constants.maxLoginRetries} ${getPluralForm(this.#constants.maxLoginRetries, 'time', 'times')}. Sleeping for ${suspendMinutes} ${getPluralForm(suspendMinutes, 'minute', 'minutes')} before resuming ...`);

                // Makes an attempted guess that the web portal may be undergoing maintenance.
                if (isMaintenancePeriod()) {
                  this.#log.warn('The web portal may be undergoing an unwarranted maintenance period at this time. The plugin will self-recover.');
                }
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
        currentTimestamp = Date.now();

        // Run the keep alive request if time has reached. Do not await, they shall run at their own pace.
        if (
          currentTimestamp - this.#state.lastRunOn.adtKeepAlive >= this.#constants.intervalTimestamps.adtKeepAlive
          && !this.#state.activity.isAdtKeepingAlive
        ) {
          this.#log.debug('Login session requires a keep alive ping. Initiating a keep alive request now ...');

          this.synchronizeKeepAlive();
        }

        // Run the sync check request if time has reached. Do not await, they shall run at their own pace.
        if (
          currentTimestamp - this.#state.lastRunOn.adtSyncCheck >= this.#constants.intervalTimestamps.adtSyncCheck
          && !this.#state.activity.isAdtSyncChecking
        ) {
          this.#log.debug('Login session requires a sync check. Running a sync check request now ...');

          this.synchronizeSyncCheck();
        }
      } catch (error) {
        this.#log.error('synchronize() has unexpectedly thrown an error, will continue to sync.');
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

      // Checks for a "null" instance. Just in case it happens.
      if (this.#instance === null) {
        this.#log.warn('synchronizeKeepAlive() was called but API instance is not available.');

        return;
      }

      // Attempt to keep alive.
      try {
        // ACTIVITY: Start keeping alive.
        this.#state.activity.isAdtKeepingAlive = true;

        const keepAlive = await this.#instance.performKeepAlive();

        // If keeping alive was successful.
        if (keepAlive.success) {
          this.#log.debug('Keep alive request was successful. The login session should now be extended.');
        }

        // If keeping alive was not successful.
        if (!keepAlive.success) {
          const { error } = keepAlive.info;
          const { code } = error ?? {};

          // Determine if the message is related to a minor connection issue.
          if (code !== undefined) {
            switch (code) {
              case 'ECONNABORTED':
                this.#log.debug('Keeping alive attempt has failed because the connection timed out. Trying again later.');
                break;
              default:
                this.#log.debug(`Keeping alive attempt has failed because the response code was "${code}". Trying again later.`);
                break;
            }
          } else {
            this.#log.error('Keeping alive attempt has failed. Trying again later.');
            stackTracer('api-response', keepAlive);
          }
        }

        // Update timestamp for keep alive request, even if request failed.
        this.#state.lastRunOn.adtKeepAlive = Date.now();
      } catch (error) {
        this.#log.error('synchronizeKeepAlive() has unexpectedly thrown an error, will continue to keep alive.');
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

      // Checks for a "null" instance. Just in case it happens.
      if (this.#instance === null) {
        this.#log.warn('synchronizeSyncCheck() was called but API instance is not available.');

        return;
      }

      // Attempt to sync check.
      try {
        // ACTIVITY: Start sync checking.
        this.#state.activity.isAdtSyncChecking = true;

        const syncCheck = await this.#instance.performSyncCheck();

        // If sync checking was successful.
        if (syncCheck.success) {
          this.#log.debug('Sync check request was successful. Determining if panel and sensor data is outdated ...');

          // If new sync code is different from the cached sync code.
          if (syncCheck.info.syncCode !== this.#state.data.syncCode) {
            this.#log.debug(`Panel and sensor data is outdated (cached: ${this.#state.data.syncCode}, fetched: ${syncCheck.info.syncCode}). Retrieving the latest data ...`);

            // Cache the sync code.
            this.#state.data.syncCode = syncCheck.info.syncCode;

            // Request new data from the portal. Should be awaited.
            await this.fetchUpdatedInformation();
          } else {
            this.#log.debug(`Panel and sensor data is up to date (cached: ${this.#state.data.syncCode}, fetched: ${syncCheck.info.syncCode}). No need to retrieve the latest data.`);
          }
        }

        // If sync checking was not successful.
        if (!syncCheck.success) {
          const { error } = syncCheck.info;
          const { code } = error ?? {};

          // Determine if the message is related to a minor connection issue.
          if (code !== undefined) {
            switch (code) {
              case 'ECONNABORTED':
                this.#log.debug('Sync checking attempt has failed because the connection timed out. Trying again later.');
                break;
              case 'ECONNRESET':
                this.#log.debug('Sync checking attempt has failed because the connection was reset. Trying again later.');
                break;
              default:
                this.#log.debug(`Sync checking attempt has failed because the response code was "${code}". Trying again later.`);
                break;
            }
          } else {
            this.#log.error('Sync checking attempt has failed. Trying again later.');
            stackTracer('api-response', syncCheck);
          }
        }

        // Update timestamp for sync check request, even if request failed.
        this.#state.lastRunOn.adtSyncCheck = Date.now();
      } catch (error) {
        this.#log.error('synchronizeSyncCheck() has unexpectedly thrown an error, will continue to sync check.');
        stackTracer('serialize-error', serializeError(error));
      } finally {
        // ACTIVITY: Finish sync checking.
        this.#state.activity.isAdtSyncChecking = false;
      }
    })();
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
    // Checks for a "null" instance. Just in case it happens.
    if (this.#instance === null) {
      this.#log.warn('fetchUpdatedInformation() was called but API instance is not available.');

      return;
    }

    const cachedState = _.clone(this.#state.data);

    try {
      // Fetch all the panel and sensor information.
      const requests = await Promise.all([
        this.#instance.getGatewayInformation(),
        this.#instance.getPanelInformation(),
        this.#instance.getPanelStatus(),
        this.#instance.getSensorsInformation(),
        this.#instance.getSensorsStatus(),
        this.#instance.getOrbSecurityButtons(),
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

        // Set panel status into memory.
        this.#state.data.panelStatus = info;
      }

      // Update sensors information.
      if (requests[3].success) {
        const { sensors } = requests[3].info;

        // Set sensors information into memory.
        this.#state.data.sensorsInfo = sensors;
      }

      // Update sensors status.
      if (requests[4].success) {
        const { sensors } = requests[4].info;

        // Set sensors status into memory.
        this.#state.data.sensorsStatus = sensors;
      }

      // Cache orb security buttons.
      if (requests[5].success) {
        const { info } = requests[5];

        // Set orb security buttons into memory.
        this.#state.data.orbSecurityButtons = info;
      }

      // Check if device statuses have changed.
      await this.logStatusChanges(cachedState, this.#state.data);

      // Check for unknown sensor actions.
      await this.unknownInformationDispatcher();

      // Consolidate devices first, then update them all.
      await this.unifyDevices();
    } catch (error) {
      this.#log.error('fetchUpdatedInformation() has unexpectedly thrown an error, will continue to fetch.');
      stackTracer('serialize-error', serializeError(error));
    }
  }

  /**
   * ADT Pulse Platform - Log status changes.
   *
   * @param {ADTPulsePlatformLogStatusChangesOldCache} oldCache - Old cache.
   * @param {ADTPulsePlatformLogStatusChangesNewCache} newCache - New cache.
   *
   * @private
   *
   * @returns {ADTPulsePlatformLogStatusChangesReturns}
   *
   * @since 1.0.0
   */
  private async logStatusChanges(oldCache: ADTPulsePlatformLogStatusChangesOldCache, newCache: ADTPulsePlatformLogStatusChangesNewCache): ADTPulsePlatformLogStatusChangesReturns {
    // Fetch gateway information.
    if (oldCache.gatewayInfo !== null && newCache.gatewayInfo !== null) {
      const oldStatus = oldCache.gatewayInfo.status;
      const newStatus = newCache.gatewayInfo.status;

      if (oldStatus !== newStatus && oldStatus !== null && newStatus !== null) {
        this.#log.info(`${chalk.underline('ADT Pulse Gateway')} status changed (old: "${oldStatus}", new: "${newStatus}").`);
      }
    }

    // Fetch the panel information.
    if (oldCache.panelInfo !== null && newCache.panelInfo !== null) {
      const oldStatus = oldCache.panelInfo.status;
      const newStatus = newCache.panelInfo.status;

      if (oldStatus !== newStatus && oldStatus !== null && newStatus !== null) {
        this.#log.info(`${chalk.underline('Security Panel')} status changed (old: "${oldStatus}", new: "${newStatus}").`);
      }
    }

    // Fetch the panel status.
    if (oldCache.panelStatus !== null && newCache.panelStatus !== null) {
      const oldStatus = oldCache.panelStatus.rawData.node;
      const newStatus = newCache.panelStatus.rawData.node;
      const splitOldStatus = oldStatus.split(textOrbTextSummarySections).filter(Boolean).join(' / ');
      const splitNewStatus = newStatus.split(textOrbTextSummarySections).filter(Boolean).join(' / ');

      if (oldStatus !== newStatus) {
        this.#log.info(`${chalk.underline('Security Panel')} state changed (old: "${splitOldStatus}", new: "${splitNewStatus}").`);
      }
    }

    // Fetch the sensors information.
    if (
      this.#config !== null
      && this.#config.sensors.length > 0 // Only show status changed if user configured sensors.
      && oldCache.sensorsInfo.length !== 0
      && newCache.sensorsInfo !== null
    ) {
      if (oldCache.sensorsInfo.length === newCache.sensorsInfo.length) {
        for (let i = 0; i < oldCache.sensorsInfo.length; i += 1) {
          const { name, zone } = oldCache.sensorsInfo[i];
          const configuredSensor = this.#config.sensors.find((sensor) => sensor.adtName === name && sensor.adtZone === zone);
          const oldStatus = oldCache.sensorsInfo[i].status;
          const newStatus = newCache.sensorsInfo[i].status;

          if (configuredSensor !== undefined && oldStatus !== newStatus) {
            this.#log.info(`${chalk.underline(configuredSensor.name)} status changed (old: "${oldStatus}", new: "${newStatus}").`);
          }
        }
      } else {
        this.#log.warn('Changes to sensors information cannot be determined due to length inconsistencies.');
        stackTracer('log-status-changes', {
          old: oldCache.sensorsInfo,
          new: newCache.sensorsInfo,
        });
      }
    }

    // Fetch the sensors status.
    if (
      this.#config !== null
      && this.#config.sensors.length > 0 // Only show status changed if user configured sensors.
      && oldCache.sensorsStatus.length !== 0
      && newCache.sensorsStatus !== null
    ) {
      if (oldCache.sensorsStatus.length === newCache.sensorsStatus.length) {
        for (let i = 0; i < oldCache.sensorsStatus.length; i += 1) {
          const { name, zone } = oldCache.sensorsStatus[i];
          const configuredSensor = this.#config.sensors.find((sensor) => sensor.adtName === name && sensor.adtZone === zone);
          const oldStatus = oldCache.sensorsStatus[i].statuses.join(', ');
          const newStatus = newCache.sensorsStatus[i].statuses.join(', ');

          if (configuredSensor !== undefined && oldStatus !== newStatus) {
            this.#log.info(`${chalk.underline(configuredSensor.name)} state changed (old: "${oldStatus}", new: "${newStatus}").`);
          }
        }
      } else {
        this.#log.warn('Changes to sensors status cannot be determined due to length inconsistencies.');
        stackTracer('log-status-changes', {
          old: oldCache.sensorsStatus,
          new: newCache.sensorsStatus,
        });
      }
    }
  }

  /**
   * ADT Pulse Platform - Unknown information dispatcher.
   *
   * @private
   *
   * @returns {ADTPulsePlatformUnknownInformationDispatcherReturns}
   *
   * @since 1.0.0
   */
  private async unknownInformationDispatcher(): ADTPulsePlatformUnknownInformationDispatcherReturns {
    const { sensorsInfo, sensorsStatus } = this.#state.data;

    const sensors = sensorsInfo.reduce((allSensors, currentSensor) => {
      const matchedStatus = sensorsStatus.find((sensorStatus) => currentSensor.zone === sensorStatus.zone);

      if (matchedStatus !== undefined) {
        allSensors.push({
          info: currentSensor,
          status: matchedStatus,
          type: condenseSensorType(currentSensor.deviceType),
        });
      }

      return allSensors;
    }, [] as ADTPulsePlatformUnknownInformationDispatcherSensors);
    const dataHash = generateHash(sensors);

    // If the detector has not reported this event before.
    if (this.#state.reportedHashes.find((reportedHash) => dataHash === reportedHash) === undefined) {
      const detectedNew = await detectPlatformUnknownSensorsAction(sensors, this.#log, this.#debugMode);

      // Save this hash so the detector does not detect the same thing multiple times.
      if (detectedNew) {
        this.#state.reportedHashes.push(dataHash);
      }
    }
  }

  /**
   * ADT Pulse Platform - Unify devices.
   *
   * @private
   *
   * @returns {ADTPulsePlatformUnifyDevicesReturns}
   *
   * @since 1.0.0
   */
  private async unifyDevices(): ADTPulsePlatformUnifyDevicesReturns {
    const { gatewayInfo, panelInfo, sensorsInfo } = this.#state.data;

    const devices: ADTPulsePlatformUnifyDevicesDevices = [];

    // Add gateway as an accessory.
    if (gatewayInfo !== null) {
      const id = 'adt-device-0';

      devices.push({
        id,
        name: 'Gateway',
        originalName: 'Gateway',
        type: 'gateway',
        zone: null,
        category: 'OTHER',
        manufacturer: gatewayInfo.manufacturer,
        model: gatewayInfo.model,
        serial: gatewayInfo.serialNumber,
        firmware: gatewayInfo.versions.firmware,
        hardware: gatewayInfo.versions.hardware,
        software: getPackageVersion(),
        uuid: this.#api.hap.uuid.generate(id),
      });
    }

    // Add security panel as an accessory.
    if (panelInfo !== null) {
      const idPanel = 'adt-device-1';
      const idSwitch = 'adt-device-1-switch';

      devices.push({
        id: idPanel,
        name: 'Security Panel',
        originalName: 'Security Panel',
        type: 'panel',
        zone: null,
        category: 'SECURITY_SYSTEM',
        manufacturer: panelInfo.manufacturer,
        model: panelInfo.model,
        serial: 'N/A',
        firmware: null,
        hardware: null,
        software: getPackageVersion(),
        uuid: this.#api.hap.uuid.generate(idPanel),
      });

      // A separate switch designed to turn off ringing alarm (originally designed to be used in "Disarmed" state).
      if (this.#config !== null && !this.#config.options.includes('disableAlarmRingingSwitch')) {
        devices.push({
          id: idSwitch,
          name: 'Alarm Ringing',
          originalName: 'Alarm Ringing',
          type: 'panelSwitch',
          zone: null,
          category: 'SWITCH',
          manufacturer: 'ADT Pulse for Homebridge',
          model: 'N/A',
          serial: 'N/A',
          firmware: null,
          hardware: null,
          software: getPackageVersion(),
          uuid: this.#api.hap.uuid.generate(idSwitch),
        });
      }
    }

    // Add sensors as an accessory.
    if (this.#config !== null && sensorsInfo !== null) {
      for (let i = 0; i < this.#config.sensors.length; i += 1) {
        const {
          adtName,
          adtType,
          adtZone,
          name,
        } = this.#config.sensors[i];

        const sensor = sensorsInfo.find((sensorInfo) => {
          const sensorInfoName = sensorInfo.name;
          const sensorInfoType = condenseSensorType(sensorInfo.deviceType);
          const sensorInfoZone = sensorInfo.zone;

          return (
            adtName === sensorInfoName
            && adtType === sensorInfoType
            && adtZone === sensorInfoZone
          );
        });

        // If sensor was not found, it could be that the config was wrong.
        if (sensor === undefined) {
          this.#log.warn(`Attempted to add or update ${chalk.underline(name)} (adtName: ${adtName}, adtZone: ${adtZone}, adtType: ${adtType}) accessory that does not exist on the portal.`);

          continue;
        }

        const id = `adt-device-${sensor.deviceId}` as ADTPulsePlatformUnifyDevicesId;

        devices.push({
          id,
          name: name ?? adtName,
          originalName: adtName,
          zone: adtZone,
          type: adtType,
          category: 'SENSOR',
          manufacturer: 'ADT',
          model: sensor.deviceType,
          serial: null,
          firmware: null,
          hardware: null,
          software: getPackageVersion(),
          uuid: this.#api.hap.uuid.generate(id),
        });
      }
    }

    // Check if accessories were removed from config.
    if (this.#config !== null) {
      const { options, sensors } = this.#config;

      for (let i = this.#accessories.length - 1; i >= 0; i -= 1) {
        const { originalName, type, zone } = this.#accessories[i].context;

        // Remove the "panelSwitch" since the user disabled it.
        if (type === 'panelSwitch' && options.includes('disableAlarmRingingSwitch')) {
          this.removeAccessory(this.#accessories[i], 'user disabled this feature');
        }

        // If current accessory is a "gateway", "panel", or "panelSwitch", skip check.
        if (type === 'gateway' || type === 'panel' || type === 'panelSwitch') {
          continue;
        }

        // If current accessory is not listed in the "sensors" config, remove it.
        if (!sensors.some((sensor) => originalName === sensor.adtName && zone !== null && zone === sensor.adtZone)) {
          this.removeAccessory(this.#accessories[i], 'accessory is missing in config');
        }
      }
    }

    // Now poll the accessories using the generated devices.
    await this.pollAccessories(devices);
  }

  /**
   * ADT Pulse Platform - Poll accessories.
   *
   * @param {ADTPulsePlatformPollAccessoriesDevices} devices - Devices.
   *
   * @private
   *
   * @returns {ADTPulsePlatformPollAccessoriesReturns}
   *
   * @since 1.0.0
   */
  private async pollAccessories(devices: ADTPulsePlatformPollAccessoriesDevices): ADTPulsePlatformPollAccessoriesReturns {
    for (let i = 0; i < devices.length; i += 1) {
      const accessoryIndex = this.#accessories.findIndex((accessory) => devices[i].uuid === accessory.context.uuid);

      // Update the device if accessory is cached, otherwise add it as a new device.
      if (accessoryIndex >= 0) {
        this.updateAccessory(devices[i]);
      } else {
        this.addAccessory(devices[i]);
      }
    }
  }
}
