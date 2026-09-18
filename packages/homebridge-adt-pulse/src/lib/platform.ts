import {
  arch,
  argv,
  platform,
  versions,
} from 'node:process';

import chalk from 'chalk';
import _ from 'lodash';
import { serializeError } from 'serialize-error';

import { ADTPulseAccessory } from './accessory.js';
import { ADTPulseAPI } from './api.js';
import { detectPlatformUnknownSensorsAction } from './detect.js';
import { textOrbTextSummarySections, textSensorTrailingNumberedParentheses } from './regex.js';
import { platformConfig } from './schema.js';
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
} from './utility.js';

import type {
  Lib_Platform_ADTPulsePlatform_Accessories,
  Lib_Platform_ADTPulsePlatform_AddAccessory_AccessoryIndex,
  Lib_Platform_ADTPulsePlatform_AddAccessory_Device,
  Lib_Platform_ADTPulsePlatform_AddAccessory_NewAccessory,
  Lib_Platform_ADTPulsePlatform_AddAccessory_NewPlatformAccessory,
  Lib_Platform_ADTPulsePlatform_AddAccessory_Returns,
  Lib_Platform_ADTPulsePlatform_AddAccessory_TypedAccessory,
  Lib_Platform_ADTPulsePlatform_Api,
  Lib_Platform_ADTPulsePlatform_Characteristic,
  Lib_Platform_ADTPulsePlatform_Config,
  Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Accessory,
  Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Returns,
  Lib_Platform_ADTPulsePlatform_Constants,
  Lib_Platform_ADTPulsePlatform_Constructor_Api,
  Lib_Platform_ADTPulsePlatform_Constructor_Config,
  Lib_Platform_ADTPulsePlatform_Constructor_DidFinishLaunching_Seconds,
  Lib_Platform_ADTPulsePlatform_Constructor_DidFinishLaunching_WarningCount,
  Lib_Platform_ADTPulsePlatform_Constructor_DidFinishLaunching_WarningTerm,
  Lib_Platform_ADTPulsePlatform_Constructor_Log,
  Lib_Platform_ADTPulsePlatform_Constructor_ParsedConfig,
  Lib_Platform_ADTPulsePlatform_DebugMode,
  Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_CachedState,
  Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_GatewayInfo,
  Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_OrbSecurityButtons,
  Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_PanelInfo,
  Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_PanelStatus,
  Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_Requests,
  Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_Returns,
  Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_SensorsInfo,
  Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_SensorsStatus,
  Lib_Platform_ADTPulsePlatform_Handlers,
  Lib_Platform_ADTPulsePlatform_Instance,
  Lib_Platform_ADTPulsePlatform_Log,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_GatewayInfoNewStatus,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_GatewayInfoOldStatus,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_NewCache,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_OldCache,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_PanelInfoNewStatus,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_PanelInfoOldStatus,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_PanelStatusNewStatus,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_PanelStatusOldStatus,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_Returns,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsInfoConfiguredSensor,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsInfoName,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsInfoNewStatus,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsInfoOldStatus,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsInfoZone,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsStatusConfiguredSensor,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsStatusName,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsStatusNewStatus,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsStatusOldStatus,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsStatusZone,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_SplitNewStatus,
  Lib_Platform_ADTPulsePlatform_LogStatusChanges_SplitOldStatus,
  Lib_Platform_ADTPulsePlatform_Plugin,
  Lib_Platform_ADTPulsePlatform_PollAccessories_AccessoryIndex,
  Lib_Platform_ADTPulsePlatform_PollAccessories_Devices,
  Lib_Platform_ADTPulsePlatform_PollAccessories_Returns,
  Lib_Platform_ADTPulsePlatform_PrintSystemInformation_HomebridgeVersion,
  Lib_Platform_ADTPulsePlatform_PrintSystemInformation_NodeVersion,
  Lib_Platform_ADTPulsePlatform_PrintSystemInformation_OpensslVersion,
  Lib_Platform_ADTPulsePlatform_PrintSystemInformation_PackageVersion,
  Lib_Platform_ADTPulsePlatform_PrintSystemInformation_PlatformPlusArch,
  Lib_Platform_ADTPulsePlatform_PrintSystemInformation_Returns,
  Lib_Platform_ADTPulsePlatform_RemoveAccessory_Accessory,
  Lib_Platform_ADTPulsePlatform_RemoveAccessory_Reason,
  Lib_Platform_ADTPulsePlatform_RemoveAccessory_Returns,
  Lib_Platform_ADTPulsePlatform_Service,
  Lib_Platform_ADTPulsePlatform_State,
  Lib_Platform_ADTPulsePlatform_Synchronize_AttemptsLeft,
  Lib_Platform_ADTPulsePlatform_Synchronize_CurrentTimestamp,
  Lib_Platform_ADTPulsePlatform_Synchronize_Login,
  Lib_Platform_ADTPulsePlatform_Synchronize_Returns,
  Lib_Platform_ADTPulsePlatform_Synchronize_SuspendMinutes,
  Lib_Platform_ADTPulsePlatform_SynchronizeKeepAlive_Code,
  Lib_Platform_ADTPulsePlatform_SynchronizeKeepAlive_Error,
  Lib_Platform_ADTPulsePlatform_SynchronizeKeepAlive_KeepAlive,
  Lib_Platform_ADTPulsePlatform_SynchronizeKeepAlive_Returns,
  Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_Code,
  Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_Error,
  Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_Returns,
  Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_SyncCheck,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_AccessoryContext,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_AdtName,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_AdtType,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_AdtZone,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_ConfiguredSensor,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_Devices,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_GatewayInfo,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_Id,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_IdPanel,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_IdSwitch,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_Name,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_Options,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_OriginalName,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_PanelInfo,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_Returns,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_Sensor,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorId,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorInfoName,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorInfoType,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorInfoZone,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_Sensors,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorsInfo,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_Type,
  Lib_Platform_ADTPulsePlatform_UnifyDevices_Zone,
  Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_DataHash,
  Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_DetectedNew,
  Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_MatchedStatus,
  Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_Returns,
  Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_Sensors,
  Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_SensorsInfo,
  Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_SensorsStatus,
  Lib_Platform_ADTPulsePlatform_UpdateAccessory_Device,
  Lib_Platform_ADTPulsePlatform_UpdateAccessory_Index,
  Lib_Platform_ADTPulsePlatform_UpdateAccessory_IndexWithValue,
  Lib_Platform_ADTPulsePlatform_UpdateAccessory_Returns,
  Lib_Platform_ADTPulsePlatform_UpdateAccessory_Value,
} from '../types/lib/platform.d.ts';

/**
 * Lib - Platform.
 *
 * Serves as the Homebridge platform plugin entry point that manages the plugin
 * lifecycle. It restores cached accessories, keeps the portal session alive,
 * and routes device updates to their accessory handlers.
 *
 * @since 1.0.0
 */
export class ADTPulsePlatform implements Lib_Platform_ADTPulsePlatform_Plugin {
  /**
   * ADT Pulse Platform - Accessories.
   *
   * Holds every platform accessory that is currently registered with Homebridge.
   * The plugin uses this cache to look up, update, and remove accessories.
   *
   * @private
   *
   * @since 1.0.0
   */
  #accessories: Lib_Platform_ADTPulsePlatform_Accessories;

  /**
   * ADT Pulse Platform - Api.
   *
   * Stores the Homebridge API object provided at plugin startup. It is used to
   * register, update, and unregister accessories and to access HAP classes.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #api: Lib_Platform_ADTPulsePlatform_Api;

  /**
   * ADT Pulse Platform - Characteristic.
   *
   * Caches the HAP Characteristic class from the Homebridge API so accessory
   * handlers can assign characteristic values without re-reading the API.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #characteristic: Lib_Platform_ADTPulsePlatform_Characteristic;

  /**
   * ADT Pulse Platform - Config.
   *
   * Keeps the validated platform configuration parsed from the Homebridge
   * config. It stays "null" until the configuration passes schema validation.
   *
   * @private
   *
   * @since 1.0.0
   */
  #config: Lib_Platform_ADTPulsePlatform_Config;

  /**
   * ADT Pulse Platform - Constants.
   *
   * Defines the timing values and retry limits that pace the plugin. These
   * values control keep alive pings, sync checks, and login retry behavior.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #constants: Lib_Platform_ADTPulsePlatform_Constants;

  /**
   * ADT Pulse Platform - Debug mode.
   *
   * Indicates whether Homebridge was started in debug mode. When enabled, the
   * plugin and its API instance produce more detailed log output.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #debugMode: Lib_Platform_ADTPulsePlatform_DebugMode;

  /**
   * ADT Pulse Platform - Handlers.
   *
   * Maps device ids to their accessory handlers. Each handler keeps the state
   * of its accessory in sync whenever new portal data arrives.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #handlers: Lib_Platform_ADTPulsePlatform_Handlers;

  /**
   * ADT Pulse Platform - Instance.
   *
   * References the ADT Pulse API instance used to talk to the web portal. It
   * stays "null" until the plugin finishes launching and initializes it.
   *
   * @private
   *
   * @since 1.0.0
   */
  #instance: Lib_Platform_ADTPulsePlatform_Instance;

  /**
   * ADT Pulse Platform - Log.
   *
   * Stores the Homebridge logger provided at plugin startup. All plugin
   * activity and errors are reported to the user through this logger.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #log: Lib_Platform_ADTPulsePlatform_Log;

  /**
   * ADT Pulse Platform - Service.
   *
   * Caches the HAP Service class from the Homebridge API so accessory handlers
   * can create and fetch accessory services without re-reading the API.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #service: Lib_Platform_ADTPulsePlatform_Service;

  /**
   * ADT Pulse Platform - State.
   *
   * Tracks the runtime state of the plugin, including activity flags, cached
   * portal data, event counters, intervals, and last run timestamps.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #state: Lib_Platform_ADTPulsePlatform_State;

  /**
   * Lib - Platform - Constructor.
   *
   * Validates the platform configuration, seeds the runtime state, and defers
   * plugin startup until Homebridge finishes restoring cached accessories.
   *
   * @param {Lib_Platform_ADTPulsePlatform_Constructor_Log}    log    - Log.
   * @param {Lib_Platform_ADTPulsePlatform_Constructor_Config} config - Config.
   * @param {Lib_Platform_ADTPulsePlatform_Constructor_Api}    api    - Api.
   *
   * @since 1.0.0
   */
  public constructor(log: Lib_Platform_ADTPulsePlatform_Constructor_Log, config: Lib_Platform_ADTPulsePlatform_Constructor_Config, api: Lib_Platform_ADTPulsePlatform_Constructor_Api) {
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
    const parsedConfig: Lib_Platform_ADTPulsePlatform_Constructor_ParsedConfig = platformConfig.safeParse(config);

    // Check for a valid platform configuration before initializing.
    if (parsedConfig.success === false) {
      this.#log.error('Plugin is unable to initialize due to an invalid platform configuration.');

      this.#log.warn('If you just upgraded from v2 to v3, the configuration has been changed. Please re-configure your plugin.');

      this.#log.warn('Carefully observe the error below. The answer you are looking for is there.');

      stackTracer('zod-error', parsedConfig.error.issues);

      return;
    }

    // Clear the synchronize interval when Homebridge shuts down.
    api.on('shutdown', () => {
      if (this.#state['intervals']['synchronize'] !== undefined) {
        clearInterval(this.#state['intervals']['synchronize']);
      }

      return;
    });

    // Start plugin here after Homebridge has restored all cached accessories from disk.
    api.on('didFinishLaunching', async () => {
      // Assign the parsed config.
      this.#config = parsedConfig.data;

      // Print the system information into logs.
      this.printSystemInformation();

      // Give notice to users this plugin is being anonymously tracked.
      this.#log.info('The API gathers anonymous analytics to detect potential bugs or issues. All personally identifiable information will be redacted.');

      // If the config specifies that plugin should be paused.
      if (this.#config['mode'] === 'paused') {
        this.#log.warn('Plugin is now paused and all related accessories will no longer respond.');

        return;
      }

      // If the config specifies that plugin should be reset.
      if (this.#config['mode'] === 'reset') {
        let warningCount: Lib_Platform_ADTPulsePlatform_Constructor_DidFinishLaunching_WarningCount = 0;
        let warningTerm: Lib_Platform_ADTPulsePlatform_Constructor_DidFinishLaunching_WarningTerm = '';

        this.#log.warn('Plugin started in reset mode and will remove all accessories shortly.');

        // Make sure user sees the first warning.
        await sleep(10000);

        for (const i of [
          3,
          2,
          1,
        ]) {
          const seconds: Lib_Platform_ADTPulsePlatform_Constructor_DidFinishLaunching_Seconds = 10 * i;

          // Track the warning count.
          warningCount += 1;

          // Display the warning term based on the warning count.
          switch (warningCount) {
            case 1: {
              warningTerm = 'FIRST';
              break;
            }

            case 2: {
              warningTerm = 'SECOND';
              break;
            }

            case 3:
            default: {
              warningTerm = 'FINAL';
              break;
            }
          }

          this.#log.warn(`${warningTerm} WARNING! ${seconds} SECONDS REMAINING before all related accessories are removed.`);

          // Safe countdown in case the user regrets their choice.
          await sleep(10000);
        }

        this.#log.warn('Plugin is now removing all related accessories from Homebridge ...');

        // Remove all related accessories from Homebridge.
        for (let i = this.#accessories.length - 1; i >= 0; i -= 1) {
          this.removeAccessory(this.#accessories[i]!, 'plugin is in "reset" mode');
        }

        this.#log.info('Plugin finished removing all related accessories from Homebridge.');

        return;
      }

      // If the config specifies that plugin should run under reduced speed mode.
      if (this.#config['speed'] !== 1) {
        this.#log.warn(`Plugin is now running under ${this.#config['speed']}x operational speed. You may see slower device updates.`);

        // Formula: New Time = Original Time * (1 / Speed).
        this.#constants['intervalTimestamps'].synchronize *= (1 / this.#config['speed']);
      }

      // If the config specifies that the plugin should apply the advanced options.
      if (this.#config['options'].length > 0) {
        this.#log.warn('Plugin will apply the advanced options saved in the configuration. You may see some loss in functionality.');

        stackTracer('config-content', this.#config['options']);
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

      return;
    });

    return;
  }

  /**
   * Lib - Platform - Configure Accessory.
   *
   * Homebridge invokes this method for every cached accessory it restores from
   * disk, allowing the plugin to track them before startup completes.
   *
   * @param {Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Accessory} accessory - Accessory.
   *
   * @returns {Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Returns}
   *
   * @since 1.0.0
   */
  public configureAccessory(accessory: Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Accessory): Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Returns {
    this.#log.info(`Configuring cached accessory for ${chalk.underline(accessory.context['name'])} (id: ${accessory.context['id']}, uuid: ${accessory.context['uuid']}) ...`);

    // Add the restored accessory to the accessories cache.
    this.#accessories.push(accessory);

    return;
  }

  /**
   * Lib - Platform - Add Accessory.
   *
   * Registers a brand new accessory with Homebridge after making sure it does
   * not already exist, then attaches a handler that keeps it updated.
   *
   * @param {Lib_Platform_ADTPulsePlatform_AddAccessory_Device} device - Device.
   *
   * @returns {Lib_Platform_ADTPulsePlatform_AddAccessory_Returns}
   *
   * @since 1.0.0
   */
  public addAccessory(device: Lib_Platform_ADTPulsePlatform_AddAccessory_Device): Lib_Platform_ADTPulsePlatform_AddAccessory_Returns {
    const accessoryIndex: Lib_Platform_ADTPulsePlatform_AddAccessory_AccessoryIndex = this.#accessories.findIndex((accessory) => device['uuid'] === accessory.context['uuid']);

    // Prevent adding duplicate accessory.
    if (accessoryIndex >= 0) {
      this.#log.error(`Cannot add ${chalk.underline(device['name'])} (id: ${device['id']}, uuid: ${device['uuid']}) accessory that already exists.`);

      return;
    }

    // If API instance is not available.
    if (this.#instance === null) {
      this.#log.error(`Attempted to add ${chalk.underline(device['name'])} (id: ${device['id']}, uuid: ${device['uuid']}) accessory but API instance is not available.`);

      return;
    }

    // Create the new accessory without context.
    const NewPlatformAccessory: Lib_Platform_ADTPulsePlatform_AddAccessory_NewPlatformAccessory = this.#api.platformAccessory;
    const newAccessory: Lib_Platform_ADTPulsePlatform_AddAccessory_NewAccessory = new NewPlatformAccessory(
      device['name'],
      device['uuid'],
      getAccessoryCategory(device['category']),
    );

    // Set the context into the new accessory.
    newAccessory.context = device;

    // Let TypeScript know that the context now exists. This creates additional runtime.
    const typedAccessory: Lib_Platform_ADTPulsePlatform_AddAccessory_TypedAccessory = newAccessory as Lib_Platform_ADTPulsePlatform_AddAccessory_TypedAccessory;

    this.#log.info(`Adding ${chalk.underline(typedAccessory.context['name'])} (id: ${typedAccessory.context['id']}, uuid: ${typedAccessory.context['uuid']}) accessory ...`);

    // Create the handler for the new accessory if it does not exist.
    if (this.#handlers[device['id']] === undefined) {
      Reflect.set(this.#handlers, device['id'], new ADTPulseAccessory(
        typedAccessory,
        this.#state,
        this.#config,
        this.#instance,
        this.#service,
        this.#characteristic,
        this.#api,
        this.#log,
      ));
    }

    // Force the accessory status to refresh.
    this.#handlers[device['id']]!.updater();

    // Save the new accessory into the accessories cache.
    this.#accessories.push(typedAccessory);

    this.#api.registerPlatformAccessories(
      'homebridge-adt-pulse',
      'ADTPulse',
      [typedAccessory],
    );

    return;
  }

  /**
   * Lib - Platform - Update Accessory.
   *
   * Refreshes a cached accessory with the latest device details from the
   * portal so its context, display name, and handler stay accurate.
   *
   * @param {Lib_Platform_ADTPulsePlatform_UpdateAccessory_Device} device - Device.
   *
   * @returns {Lib_Platform_ADTPulsePlatform_UpdateAccessory_Returns}
   *
   * @since 1.0.0
   */
  public updateAccessory(device: Lib_Platform_ADTPulsePlatform_UpdateAccessory_Device): Lib_Platform_ADTPulsePlatform_UpdateAccessory_Returns {
    const indexWithValue: Lib_Platform_ADTPulsePlatform_UpdateAccessory_IndexWithValue = findIndexWithValue(
      this.#accessories,
      (accessory) => device['uuid'] === accessory.context['uuid'],
    );
    const index: Lib_Platform_ADTPulsePlatform_UpdateAccessory_Index = indexWithValue['index'];
    const value: Lib_Platform_ADTPulsePlatform_UpdateAccessory_Value = indexWithValue['value'];

    if (index < 0 || value === undefined) {
      this.#log.warn(`Attempted to update ${chalk.underline(device['name'])} (id: ${device['id']}, uuid: ${device['uuid']}) accessory that does not exist.`);

      return;
    }

    // If API instance is not available.
    if (this.#instance === null) {
      this.#log.error(`Attempted to updated ${chalk.underline(device['name'])} (id: ${device['id']}, uuid: ${device['uuid']}) accessory but API instance is not available.`);

      return;
    }

    this.#log.debug(`Updating ${chalk.underline(value.context['name'])} (id: ${value.context['id']}, uuid: ${value.context['uuid']}) accessory ...`);

    // Set the context into the existing accessory.
    value.context = device;

    // Update the display name.
    value.displayName = device['name'];

    // Create the handler for the existing accessory if it does not exist.
    if (this.#handlers[device['id']] === undefined) {
      Reflect.set(this.#handlers, device['id'], new ADTPulseAccessory(
        value,
        this.#state,
        this.#config,
        this.#instance,
        this.#service,
        this.#characteristic,
        this.#api,
        this.#log,
      ));
    }

    // Force the accessory status to refresh.
    this.#handlers[device['id']]!.updater();

    // Update the existing accessory in the accessories cache.
    Reflect.set(this.#accessories, index, value);

    this.#api.updatePlatformAccessories(
      [value],
    );

    return;
  }

  /**
   * Lib - Platform - Remove Accessory.
   *
   * Unregisters an accessory from Homebridge and drops it from the local
   * cache. The reason is logged to help users understand why it was removed.
   *
   * @param {Lib_Platform_ADTPulsePlatform_RemoveAccessory_Accessory} accessory - Accessory.
   * @param {Lib_Platform_ADTPulsePlatform_RemoveAccessory_Reason}    reason    - Reason.
   *
   * @returns {Lib_Platform_ADTPulsePlatform_RemoveAccessory_Returns}
   *
   * @since 1.0.0
   */
  public removeAccessory(accessory: Lib_Platform_ADTPulsePlatform_RemoveAccessory_Accessory, reason: Lib_Platform_ADTPulsePlatform_RemoveAccessory_Reason): Lib_Platform_ADTPulsePlatform_RemoveAccessory_Returns {
    this.#log.info(`Removing ${chalk.underline(accessory.context['name'])} (id: ${accessory.context['id']}, uuid: ${accessory.context['uuid']}) accessory ...`);

    // Specify the reason why this accessory is removed.
    this.#log.debug(`${chalk.underline(accessory.context['name'])} (id: ${accessory.context['id']}, uuid: ${accessory.context['uuid']}) is removed because ${reason}.`);

    // Keep only the accessories in the cache that is not the accessory being removed.
    this.#accessories = this.#accessories.filter((existingAccessory) => existingAccessory.context['uuid'] !== accessory.context['uuid']);

    this.#api.unregisterPlatformAccessories(
      'homebridge-adt-pulse',
      'ADTPulse',
      [accessory],
    );

    return;
  }

  /**
   * Lib - Platform - Print System Information.
   *
   * Logs the runtime environment (platform, plugin, Homebridge, Node, and
   * OpenSSL versions) to help with troubleshooting user submitted bug reports.
   *
   * @private
   *
   * @returns {Lib_Platform_ADTPulsePlatform_PrintSystemInformation_Returns}
   *
   * @since 1.0.0
   */
  private printSystemInformation(): Lib_Platform_ADTPulsePlatform_PrintSystemInformation_Returns {
    const homebridgeVersion: Lib_Platform_ADTPulsePlatform_PrintSystemInformation_HomebridgeVersion = chalk.yellowBright(`v${this.#api.serverVersion}`);
    const nodeVersion: Lib_Platform_ADTPulsePlatform_PrintSystemInformation_NodeVersion = chalk.blueBright(`v${versions.node}`);
    const opensslVersion: Lib_Platform_ADTPulsePlatform_PrintSystemInformation_OpensslVersion = chalk.magentaBright(`v${versions.openssl}`);
    const packageVersion: Lib_Platform_ADTPulsePlatform_PrintSystemInformation_PackageVersion = chalk.greenBright(`v${getPackageVersion()}`);
    const platformPlusArch: Lib_Platform_ADTPulsePlatform_PrintSystemInformation_PlatformPlusArch = chalk.redBright(`${platform} (${arch})`);

    this.#log.info([
      `running on ${platformPlusArch}`,
      `homebridge-adt-pulse ${packageVersion}`,
      `homebridge ${homebridgeVersion}`,
      `node ${nodeVersion}`,
      `openssl ${opensslVersion}`,
    ].join(chalk.gray(' // ')));

    return;
  }

  /**
   * Lib - Platform - Synchronize.
   *
   * Runs the main polling loop that keeps the plugin in sync with the portal.
   * It manages login state, then paces keep alive and sync check requests.
   *
   * @private
   *
   * @returns {Lib_Platform_ADTPulsePlatform_Synchronize_Returns}
   *
   * @since 1.0.0
   */
  private synchronize(): Lib_Platform_ADTPulsePlatform_Synchronize_Returns {
    this.#state['intervals'].synchronize = setInterval(async () => {
      // If currently syncing.
      if (this.#state['activity']['isSyncing'] === true) {
        return;
      }

      // Checks for a "null" instance. Just in case it happens.
      if (this.#instance === null) {
        this.#log.warn('synchronize() was called but API is not available.');

        return;
      }

      // Attempt to synchronize.
      try {
        let currentTimestamp: Lib_Platform_ADTPulsePlatform_Synchronize_CurrentTimestamp = Date.now();

        // ACTIVITY: Start sync.
        this.#state['activity'].isSyncing = true;

        // If login session has become stale and not receiving the latest updates, force a session reset.
        if (
          currentTimestamp - this.#state['lastRunOn']['adtLastLogin'] >= this.#constants['intervalTimestamps']['adtSessionLifespan']
          && this.#state['lastRunOn']['adtLastLogin'] !== 0
        ) {
          this.#log.debug('Login session requires a reset. Resetting the login session now ...');

          this.#instance.resetSession();
        }

        // Perform login action if "this instance" is not authenticated.
        if (this.#instance.isAuthenticated() === false) {
          // Attempt to log in if "this instance" is not currently logging in.
          if (this.#state['activity']['isLoggingIn'] === false) {
            // ACTIVITY: Start login.
            this.#state['activity'].isLoggingIn = true;

            const login: Lib_Platform_ADTPulsePlatform_Synchronize_Login = await this.#instance.login();

            // If login was successful.
            if (login['success'] === true) {
              currentTimestamp = Date.now();

              // Update timing for the sync protocols, so the methods being called can pace themselves.
              this.#state['lastRunOn'].adtKeepAlive = currentTimestamp;
              this.#state['lastRunOn'].adtLastLogin = currentTimestamp;
              this.#state['lastRunOn'].adtSyncCheck = currentTimestamp;
            }

            // If login was not successful.
            if (login['success'] === false) {
              this.#state['eventCounters'].failedLogins += 1;

              const attemptsLeft: Lib_Platform_ADTPulsePlatform_Synchronize_AttemptsLeft = this.#constants['maxLoginRetries'] - this.#state['eventCounters']['failedLogins'];

              if (attemptsLeft > 0) {
                this.#log.error(`Login attempt has failed. Trying ${attemptsLeft} more ${getPluralForm(attemptsLeft, 'time', 'times')} ...`);
              } else {
                const suspendMinutes: Lib_Platform_ADTPulsePlatform_Synchronize_SuspendMinutes = this.#constants['intervalTimestamps']['suspendSyncing'] / 1000 / 60;

                this.#log.error(`Login attempt has failed for ${this.#constants['maxLoginRetries']} ${getPluralForm(this.#constants['maxLoginRetries'], 'time', 'times')}. Sleeping for ${suspendMinutes} ${getPluralForm(suspendMinutes, 'minute', 'minutes')} before resuming ...`);

                // Makes an attempted guess that the web portal may be undergoing maintenance.
                if (isMaintenancePeriod() === true) {
                  this.#log.warn('The web portal may be undergoing an unwarranted maintenance period at this time. The plugin will self-recover.');
                }
              }

              stackTracer('api-response', login);
            }

            // ACTIVITY: Finish login.
            this.#state['activity'].isLoggingIn = false;
          }

          // If failed logins have reached the max login retries.
          if (this.#state['eventCounters']['failedLogins'] >= this.#constants['maxLoginRetries']) {
            await sleep(this.#constants['intervalTimestamps']['suspendSyncing']);

            // After sleeping, reset the failed login count.
            this.#state['eventCounters'].failedLogins = 0;

            return;
          }

          // Make sure the rest of the code does not run if user is not authenticated.
          if (this.#instance.isAuthenticated() === false) {
            return;
          }
        }

        // Get the current timestamp.
        currentTimestamp = Date.now();

        // Run the keep alive request if time has reached. Do not await, they shall run at their own pace.
        if (
          currentTimestamp - this.#state['lastRunOn']['adtKeepAlive'] >= this.#constants['intervalTimestamps']['adtKeepAlive']
          && this.#state['activity']['isAdtKeepingAlive'] === false
        ) {
          this.#log.debug('Login session requires a keep alive ping. Initiating a keep alive request now ...');

          this.synchronizeKeepAlive();
        }

        // Run the sync check request if time has reached. Do not await, they shall run at their own pace.
        if (
          currentTimestamp - this.#state['lastRunOn']['adtSyncCheck'] >= this.#constants['intervalTimestamps']['adtSyncCheck']
          && this.#state['activity']['isAdtSyncChecking'] === false
        ) {
          this.#log.debug('Login session requires a sync check. Running a sync check request now ...');

          this.synchronizeSyncCheck();
        }
      } catch (error) {
        this.#log.error('synchronize() has unexpectedly thrown an error, will continue to sync.');

        stackTracer('serialize-error', serializeError(error));
      } finally {
        // ACTIVITY: Finish sync.
        this.#state['activity'].isSyncing = false;
      }

      return;
    }, this.#constants['intervalTimestamps']['synchronize']);

    return;
  }

  /**
   * Lib - Platform - Synchronize Keep Alive.
   *
   * Extends the current portal session so the plugin does not get logged out
   * between sync checks. Runs at its own pace without blocking the main loop.
   *
   * @private
   *
   * @returns {Lib_Platform_ADTPulsePlatform_SynchronizeKeepAlive_Returns}
   *
   * @since 1.0.0
   */
  private synchronizeKeepAlive(): Lib_Platform_ADTPulsePlatform_SynchronizeKeepAlive_Returns {
    // Running an IIFE, to internalize async context.
    (async () => {
      // If currently keeping alive.
      if (this.#state['activity']['isAdtKeepingAlive'] === true) {
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
        this.#state['activity'].isAdtKeepingAlive = true;

        const keepAlive: Lib_Platform_ADTPulsePlatform_SynchronizeKeepAlive_KeepAlive = await this.#instance.performKeepAlive();

        // If keeping alive was successful.
        if (keepAlive['success'] === true) {
          this.#log.debug('Keep alive request was successful. The login session should now be extended.');
        }

        // If keeping alive was not successful.
        if (keepAlive['success'] === false) {
          const error: Lib_Platform_ADTPulsePlatform_SynchronizeKeepAlive_Error = keepAlive['info']['error'];
          const code: Lib_Platform_ADTPulsePlatform_SynchronizeKeepAlive_Code = (error !== undefined) ? error['code'] : undefined;

          // Determine if the message is related to a minor connection issue.
          if (code !== undefined) {
            switch (code) {
              case 'ECONNABORTED': {
                this.#log.debug('Keeping alive attempt has failed because the connection timed out. Trying again later.');
                break;
              }

              default: {
                this.#log.debug(`Keeping alive attempt has failed because the response code was "${code}". Trying again later.`);
                break;
              }
            }
          } else {
            this.#log.error('Keeping alive attempt has failed. Trying again later.');

            stackTracer('api-response', keepAlive);
          }
        }

        // Update timestamp for keep alive request, even if request failed.
        this.#state['lastRunOn'].adtKeepAlive = Date.now();
      } catch (error) {
        this.#log.error('synchronizeKeepAlive() has unexpectedly thrown an error, will continue to keep alive.');

        stackTracer('serialize-error', serializeError(error));
      } finally {
        // ACTIVITY: Finish keeping alive.
        this.#state['activity'].isAdtKeepingAlive = false;
      }

      return;
    })();

    return;
  }

  /**
   * Lib - Platform - Synchronize Sync Check.
   *
   * Asks the portal whether panel or sensor data changed since the last check
   * and triggers a full data refresh only when the sync code differs.
   *
   * @private
   *
   * @returns {Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_Returns}
   *
   * @since 1.0.0
   */
  private synchronizeSyncCheck(): Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_Returns {
    // Running an IIFE, to internalize async context.
    (async () => {
      // If currently sync checking.
      if (this.#state['activity']['isAdtSyncChecking'] === true) {
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
        this.#state['activity'].isAdtSyncChecking = true;

        const syncCheck: Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_SyncCheck = await this.#instance.performSyncCheck();

        // If sync checking was successful.
        if (syncCheck['success'] === true) {
          this.#log.debug('Sync check request was successful. Determining if panel and sensor data is outdated ...');

          // If new sync code is different from the cached sync code.
          if (syncCheck['info']['syncCode'] !== this.#state['data']['syncCode']) {
            this.#log.debug(`Panel and sensor data is outdated (cached: ${this.#state['data']['syncCode']}, fetched: ${syncCheck['info']['syncCode']}). Retrieving the latest data ...`);

            // Cache the sync code.
            this.#state['data'].syncCode = syncCheck['info']['syncCode'];

            // Request new data from the portal. Should be awaited.
            await this.fetchUpdatedInformation();
          } else {
            this.#log.debug(`Panel and sensor data is up to date (cached: ${this.#state['data']['syncCode']}, fetched: ${syncCheck['info']['syncCode']}). No need to retrieve the latest data.`);
          }
        }

        // If sync checking was not successful.
        if (syncCheck['success'] === false) {
          const error: Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_Error = syncCheck['info']['error'];
          const code: Lib_Platform_ADTPulsePlatform_SynchronizeSyncCheck_Code = (error !== undefined) ? error['code'] : undefined;

          // Determine if the message is related to a minor connection issue.
          if (code !== undefined) {
            switch (code) {
              case 'ECONNABORTED': {
                this.#log.debug('Sync checking attempt has failed because the connection timed out. Trying again later.');
                break;
              }

              case 'ECONNRESET': {
                this.#log.debug('Sync checking attempt has failed because the connection was reset. Trying again later.');
                break;
              }

              default: {
                this.#log.debug(`Sync checking attempt has failed because the response code was "${code}". Trying again later.`);
                break;
              }
            }
          } else {
            this.#log.error('Sync checking attempt has failed. Trying again later.');

            stackTracer('api-response', syncCheck);
          }
        }

        // Update timestamp for sync check request, even if request failed.
        this.#state['lastRunOn'].adtSyncCheck = Date.now();
      } catch (error) {
        this.#log.error('synchronizeSyncCheck() has unexpectedly thrown an error, will continue to sync check.');

        stackTracer('serialize-error', serializeError(error));
      } finally {
        // ACTIVITY: Finish sync checking.
        this.#state['activity'].isAdtSyncChecking = false;
      }

      return;
    })();

    return;
  }

  /**
   * Lib - Platform - Fetch Updated Information.
   *
   * Retrieves the latest gateway, panel, and sensor data from the portal in
   * one pass, then logs status changes and refreshes every accessory.
   *
   * @private
   *
   * @returns {Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_Returns}
   *
   * @since 1.0.0
   */
  private async fetchUpdatedInformation(): Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_Returns {
    // Checks for a "null" instance. Just in case it happens.
    if (this.#instance === null) {
      this.#log.warn('fetchUpdatedInformation() was called but API instance is not available.');

      return;
    }

    const cachedState: Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_CachedState = _.clone(this.#state['data']);

    try {
      // Fetch all the panel and sensor information.
      const requests: Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_Requests = await Promise.all([
        this.#instance.getGatewayInformation(),
        this.#instance.getPanelInformation(),
        this.#instance.getPanelStatus(),
        this.#instance.getSensorsInformation(),
        this.#instance.getSensorsStatus(),
        this.#instance.getOrbSecurityButtons(),
      ]);

      // Update gateway information.
      if (requests[0]['success'] === true) {
        const gatewayInfo: Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_GatewayInfo = requests[0]['info'];

        // Set gateway information into memory.
        this.#state['data'].gatewayInfo = gatewayInfo;
      }

      // Update panel information.
      if (requests[1]['success'] === true) {
        const panelInfo: Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_PanelInfo = requests[1]['info'];

        // Set panel information into memory.
        this.#state['data'].panelInfo = panelInfo;
      }

      // Update panel status.
      if (requests[2]['success'] === true) {
        const panelStatus: Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_PanelStatus = requests[2]['info'];

        // Set panel status into memory.
        this.#state['data'].panelStatus = panelStatus;
      }

      // Update sensors information.
      if (requests[3]['success'] === true) {
        const sensorsInfo: Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_SensorsInfo = requests[3]['info']['sensors'];

        // Set sensors information into memory.
        this.#state['data'].sensorsInfo = sensorsInfo;
      }

      // Update sensors status.
      if (requests[4]['success'] === true) {
        const sensorsStatus: Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_SensorsStatus = requests[4]['info']['sensors'];

        // Set sensors status into memory.
        this.#state['data'].sensorsStatus = sensorsStatus;
      }

      // Cache orb security buttons.
      if (requests[5]['success'] === true) {
        const orbSecurityButtons: Lib_Platform_ADTPulsePlatform_FetchUpdatedInformation_OrbSecurityButtons = requests[5]['info'];

        // Set orb security buttons into memory.
        this.#state['data'].orbSecurityButtons = orbSecurityButtons;
      }

      // Check if device statuses have changed.
      await this.logStatusChanges(cachedState, this.#state['data']);

      // Check for unknown sensor actions.
      await this.unknownInformationDispatcher();

      // Consolidate devices first, then update them all.
      await this.unifyDevices();
    } catch (error) {
      this.#log.error('fetchUpdatedInformation() has unexpectedly thrown an error, will continue to fetch.');

      stackTracer('serialize-error', serializeError(error));
    }

    return;
  }

  /**
   * Lib - Platform - Log Status Changes.
   *
   * Compares the previous data cache against the freshly fetched data and logs
   * a human readable message for every device status that changed.
   *
   * @param {Lib_Platform_ADTPulsePlatform_LogStatusChanges_OldCache} oldCache - Old cache.
   * @param {Lib_Platform_ADTPulsePlatform_LogStatusChanges_NewCache} newCache - New cache.
   *
   * @private
   *
   * @returns {Lib_Platform_ADTPulsePlatform_LogStatusChanges_Returns}
   *
   * @since 1.0.0
   */
  private async logStatusChanges(oldCache: Lib_Platform_ADTPulsePlatform_LogStatusChanges_OldCache, newCache: Lib_Platform_ADTPulsePlatform_LogStatusChanges_NewCache): Lib_Platform_ADTPulsePlatform_LogStatusChanges_Returns {
    // Fetch gateway information.
    if (oldCache['gatewayInfo'] !== null && newCache['gatewayInfo'] !== null) {
      const gatewayInfoOldStatus: Lib_Platform_ADTPulsePlatform_LogStatusChanges_GatewayInfoOldStatus = oldCache['gatewayInfo']['status'];
      const gatewayInfoNewStatus: Lib_Platform_ADTPulsePlatform_LogStatusChanges_GatewayInfoNewStatus = newCache['gatewayInfo']['status'];

      if (
        gatewayInfoOldStatus !== gatewayInfoNewStatus
        && gatewayInfoOldStatus !== null
        && gatewayInfoNewStatus !== null
      ) {
        this.#log.info(`${chalk.underline('ADT Pulse Gateway')} status changed (old: "${gatewayInfoOldStatus}", new: "${gatewayInfoNewStatus}").`);
      }
    }

    // Fetch the panel information.
    if (oldCache['panelInfo'] !== null && newCache['panelInfo'] !== null) {
      const panelInfoOldStatus: Lib_Platform_ADTPulsePlatform_LogStatusChanges_PanelInfoOldStatus = oldCache['panelInfo']['status'];
      const panelInfoNewStatus: Lib_Platform_ADTPulsePlatform_LogStatusChanges_PanelInfoNewStatus = newCache['panelInfo']['status'];

      if (
        panelInfoOldStatus !== panelInfoNewStatus
        && panelInfoOldStatus !== null
        && panelInfoNewStatus !== null
      ) {
        this.#log.info(`${chalk.underline('Security Panel')} status changed (old: "${panelInfoOldStatus}", new: "${panelInfoNewStatus}").`);
      }
    }

    // Fetch the panel status.
    if (oldCache['panelStatus'] !== null && newCache['panelStatus'] !== null) {
      const panelStatusOldStatus: Lib_Platform_ADTPulsePlatform_LogStatusChanges_PanelStatusOldStatus = oldCache['panelStatus']['rawData']['node'];
      const panelStatusNewStatus: Lib_Platform_ADTPulsePlatform_LogStatusChanges_PanelStatusNewStatus = newCache['panelStatus']['rawData']['node'];
      const splitOldStatus: Lib_Platform_ADTPulsePlatform_LogStatusChanges_SplitOldStatus = panelStatusOldStatus.split(textOrbTextSummarySections).filter(Boolean).join(' / ');
      const splitNewStatus: Lib_Platform_ADTPulsePlatform_LogStatusChanges_SplitNewStatus = panelStatusNewStatus.split(textOrbTextSummarySections).filter(Boolean).join(' / ');

      if (panelStatusOldStatus !== panelStatusNewStatus) {
        this.#log.info(`${chalk.underline('Security Panel')} state changed (old: "${splitOldStatus}", new: "${splitNewStatus}").`);
      }
    }

    // Fetch the sensors information.
    if (
      this.#config !== null
      && this.#config['sensors'].length > 0 // Only show status changed if user configured sensors.
      && oldCache['sensorsInfo'].length !== 0
      && newCache['sensorsInfo'] !== null
    ) {
      if (oldCache['sensorsInfo'].length === newCache['sensorsInfo'].length) {
        for (let i = 0; i < oldCache['sensorsInfo'].length; i += 1) {
          const sensorsInfoName: Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsInfoName = oldCache['sensorsInfo'][i]!['name'];
          const sensorsInfoZone: Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsInfoZone = oldCache['sensorsInfo'][i]!['zone'];
          const sensorsInfoConfiguredSensor: Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsInfoConfiguredSensor = this.#config['sensors'].find((sensor) => sensor['adtName'] === sensorsInfoName && sensor['adtZone'] === sensorsInfoZone);
          const sensorsInfoOldStatus: Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsInfoOldStatus = oldCache['sensorsInfo'][i]!['status'];
          const sensorsInfoNewStatus: Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsInfoNewStatus = newCache['sensorsInfo'][i]!['status'];

          if (sensorsInfoConfiguredSensor !== undefined && sensorsInfoOldStatus !== sensorsInfoNewStatus) {
            this.#log.info(`${chalk.underline(sensorsInfoConfiguredSensor['name'] ?? sensorsInfoConfiguredSensor['adtName'])} status changed (old: "${sensorsInfoOldStatus}", new: "${sensorsInfoNewStatus}").`);
          }
        }
      } else {
        this.#log.warn('Changes to sensors information cannot be determined due to length inconsistencies.');

        stackTracer('log-status-changes', {
          old: oldCache['sensorsInfo'],
          new: newCache['sensorsInfo'],
        });
      }
    }

    // Fetch the sensors status.
    if (
      this.#config !== null
      && this.#config['sensors'].length > 0 // Only show status changed if user configured sensors.
      && oldCache['sensorsStatus'].length !== 0
      && newCache['sensorsStatus'] !== null
    ) {
      if (oldCache['sensorsStatus'].length === newCache['sensorsStatus'].length) {
        for (let i = 0; i < oldCache['sensorsStatus'].length; i += 1) {
          const sensorsStatusName: Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsStatusName = oldCache['sensorsStatus'][i]!['name'];
          const sensorsStatusZone: Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsStatusZone = oldCache['sensorsStatus'][i]!['zone'];
          const sensorsStatusConfiguredSensor: Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsStatusConfiguredSensor = this.#config['sensors'].find((sensor) => sensor['adtName'] === sensorsStatusName && sensor['adtZone'] === sensorsStatusZone);
          const sensorsStatusOldStatus: Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsStatusOldStatus = oldCache['sensorsStatus'][i]!['statuses'].join(', ');
          const sensorsStatusNewStatus: Lib_Platform_ADTPulsePlatform_LogStatusChanges_SensorsStatusNewStatus = newCache['sensorsStatus'][i]!['statuses'].join(', ');

          if (sensorsStatusConfiguredSensor !== undefined && sensorsStatusOldStatus !== sensorsStatusNewStatus) {
            this.#log.info(`${chalk.underline(sensorsStatusConfiguredSensor['name'] ?? sensorsStatusConfiguredSensor['adtName'])} state changed (old: "${sensorsStatusOldStatus}", new: "${sensorsStatusNewStatus}").`);
          }
        }
      } else {
        this.#log.warn('Changes to sensors status cannot be determined due to length inconsistencies.');

        stackTracer('log-status-changes', {
          old: oldCache['sensorsStatus'],
          new: newCache['sensorsStatus'],
        });
      }
    }

    return;
  }

  /**
   * Lib - Platform - Unknown Information Dispatcher.
   *
   * Reports sensor data that the plugin does not recognize so new device types
   * can be supported. Hashes each report to avoid submitting duplicates.
   *
   * @private
   *
   * @returns {Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_Returns}
   *
   * @since 1.0.0
   */
  private async unknownInformationDispatcher(): Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_Returns {
    const sensorsInfo: Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_SensorsInfo = this.#state['data']['sensorsInfo'];
    const sensorsStatus: Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_SensorsStatus = this.#state['data']['sensorsStatus'];

    const sensors: Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_Sensors = sensorsInfo.reduce((allSensors, currentSensor) => {
      const matchedStatus: Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_MatchedStatus = sensorsStatus.find((sensorStatus) => currentSensor['zone'] === sensorStatus['zone']);

      if (matchedStatus !== undefined) {
        allSensors.push({
          info: currentSensor,
          status: matchedStatus,
          type: condenseSensorType(currentSensor['deviceType']),
        });
      }

      return allSensors;
    }, [] as Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_Sensors);
    const dataHash: Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_DataHash = generateHash(sensors);

    // If the detector has not reported this event before.
    if (this.#state['reportedHashes'].find((reportedHash) => dataHash === reportedHash) === undefined) {
      const detectedNew: Lib_Platform_ADTPulsePlatform_UnknownInformationDispatcher_DetectedNew = await detectPlatformUnknownSensorsAction(sensors, this.#log, this.#debugMode);

      // Save this hash so the detector does not detect the same thing multiple times.
      if (detectedNew === true) {
        this.#state['reportedHashes'].push(dataHash);
      }
    }

    return;
  }

  /**
   * Lib - Platform - Unify Devices.
   *
   * Builds a unified device list from the gateway, panel, and configured
   * sensor data, prunes accessories removed from the config, then polls them.
   *
   * @private
   *
   * @returns {Lib_Platform_ADTPulsePlatform_UnifyDevices_Returns}
   *
   * @since 1.0.0
   */
  private async unifyDevices(): Lib_Platform_ADTPulsePlatform_UnifyDevices_Returns {
    const gatewayInfo: Lib_Platform_ADTPulsePlatform_UnifyDevices_GatewayInfo = this.#state['data']['gatewayInfo'];
    const panelInfo: Lib_Platform_ADTPulsePlatform_UnifyDevices_PanelInfo = this.#state['data']['panelInfo'];
    const sensorsInfo: Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorsInfo = this.#state['data']['sensorsInfo'];

    const devices: Lib_Platform_ADTPulsePlatform_UnifyDevices_Devices = [];

    // Add gateway as an accessory.
    if (gatewayInfo !== null) {
      const id: Lib_Platform_ADTPulsePlatform_UnifyDevices_Id = 'adt-device-0';

      devices.push({
        id,
        name: 'Gateway',
        originalName: 'Gateway',
        type: 'gateway',
        zone: null,
        category: 'OTHER',
        manufacturer: gatewayInfo['manufacturer'],
        model: gatewayInfo['model'],
        serial: gatewayInfo['serialNumber'],
        firmware: gatewayInfo['versions']['firmware'],
        hardware: gatewayInfo['versions']['hardware'],
        software: getPackageVersion(),
        uuid: this.#api.hap.uuid.generate(id),
      });
    }

    // Add security panel as an accessory.
    if (panelInfo !== null) {
      const idPanel: Lib_Platform_ADTPulsePlatform_UnifyDevices_IdPanel = 'adt-device-1';
      const idSwitch: Lib_Platform_ADTPulsePlatform_UnifyDevices_IdSwitch = 'adt-device-1-switch';

      devices.push({
        id: idPanel,
        name: 'Security Panel',
        originalName: 'Security Panel',
        type: 'panel',
        zone: null,
        category: 'SECURITY_SYSTEM',
        manufacturer: panelInfo['manufacturer'],
        model: panelInfo['model'],
        serial: 'N/A',
        firmware: null,
        hardware: null,
        software: getPackageVersion(),
        uuid: this.#api.hap.uuid.generate(idPanel),
      });

      // A separate switch designed to turn off ringing alarm (originally designed to be used in "Disarmed" state).
      if (this.#config !== null && this.#config['options'].includes('disableAlarmRingingSwitch') === false) {
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
      for (let i = 0; i < this.#config['sensors'].length; i += 1) {
        const configuredSensor: Lib_Platform_ADTPulsePlatform_UnifyDevices_ConfiguredSensor = this.#config['sensors'][i]!;
        const adtName: Lib_Platform_ADTPulsePlatform_UnifyDevices_AdtName = configuredSensor['adtName'];
        const adtType: Lib_Platform_ADTPulsePlatform_UnifyDevices_AdtType = configuredSensor['adtType'];
        const adtZone: Lib_Platform_ADTPulsePlatform_UnifyDevices_AdtZone = configuredSensor['adtZone'];
        const name: Lib_Platform_ADTPulsePlatform_UnifyDevices_Name = configuredSensor['name'];

        const sensor: Lib_Platform_ADTPulsePlatform_UnifyDevices_Sensor = sensorsInfo.find((sensorInfo) => {
          const sensorInfoName: Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorInfoName = sensorInfo['name'];
          const sensorInfoType: Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorInfoType = condenseSensorType(sensorInfo['deviceType']);
          const sensorInfoZone: Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorInfoZone = sensorInfo['zone'];

          return (
            adtName === sensorInfoName
            && adtType === sensorInfoType
            && adtZone === sensorInfoZone
          );
        });

        // If sensor was not found, it could be that the config was wrong.
        if (sensor === undefined) {
          this.#log.warn(`Attempted to add or update ${chalk.underline(name ?? adtName)} (adtName: ${adtName}, adtZone: ${adtZone}, adtType: ${adtType}) accessory that does not exist on the portal.`);

          continue;
        }

        const sensorId: Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorId = `adt-device-${sensor['deviceId']}` as Lib_Platform_ADTPulsePlatform_UnifyDevices_SensorId;

        devices.push({
          id: sensorId,
          name: name ?? adtName.replace(textSensorTrailingNumberedParentheses, ' $1'),
          originalName: adtName,
          zone: adtZone,
          type: adtType,
          category: 'SENSOR',
          manufacturer: 'ADT',
          model: sensor['deviceType'],
          serial: null,
          firmware: null,
          hardware: null,
          software: getPackageVersion(),
          uuid: this.#api.hap.uuid.generate(sensorId),
        });
      }
    }

    // Check if accessories were removed from config.
    if (this.#config !== null) {
      const options: Lib_Platform_ADTPulsePlatform_UnifyDevices_Options = this.#config['options'];
      const sensors: Lib_Platform_ADTPulsePlatform_UnifyDevices_Sensors = this.#config['sensors'];

      for (let i = this.#accessories.length - 1; i >= 0; i -= 1) {
        const accessoryContext: Lib_Platform_ADTPulsePlatform_UnifyDevices_AccessoryContext = this.#accessories[i]!.context;
        const originalName: Lib_Platform_ADTPulsePlatform_UnifyDevices_OriginalName = accessoryContext['originalName'];
        const type: Lib_Platform_ADTPulsePlatform_UnifyDevices_Type = accessoryContext['type'];
        const zone: Lib_Platform_ADTPulsePlatform_UnifyDevices_Zone = accessoryContext['zone'];

        // Remove the "panelSwitch" since the user disabled it.
        if (type === 'panelSwitch' && options.includes('disableAlarmRingingSwitch') === true) {
          this.removeAccessory(this.#accessories[i]!, 'user disabled this feature');
        }

        // If current accessory is a "gateway", "panel", or "panelSwitch", skip check.
        if (
          type === 'gateway'
          || type === 'panel'
          || type === 'panelSwitch'
        ) {
          continue;
        }

        // If current accessory is not listed in the "sensors" config, remove it.
        if (sensors.some((sensor) => (
          originalName === sensor['adtName']
          && zone !== null
          && zone === sensor['adtZone']
        )) === false) {
          this.removeAccessory(this.#accessories[i]!, 'accessory is missing in config');
        }
      }
    }

    // Now poll the accessories using the generated devices.
    await this.pollAccessories(devices);

    return;
  }

  /**
   * Lib - Platform - Poll Accessories.
   *
   * Walks the unified device list and decides whether each device should be
   * added as a new accessory or update an existing cached accessory.
   *
   * @param {Lib_Platform_ADTPulsePlatform_PollAccessories_Devices} devices - Devices.
   *
   * @private
   *
   * @returns {Lib_Platform_ADTPulsePlatform_PollAccessories_Returns}
   *
   * @since 1.0.0
   */
  private async pollAccessories(devices: Lib_Platform_ADTPulsePlatform_PollAccessories_Devices): Lib_Platform_ADTPulsePlatform_PollAccessories_Returns {
    for (let i = 0; i < devices.length; i += 1) {
      const accessoryIndex: Lib_Platform_ADTPulsePlatform_PollAccessories_AccessoryIndex = this.#accessories.findIndex((accessory) => devices[i]!['uuid'] === accessory.context['uuid']);

      // Update the device if accessory is cached, otherwise add it as a new device.
      if (accessoryIndex >= 0) {
        this.updateAccessory(devices[i]!);
      } else {
        this.addAccessory(devices[i]!);
      }
    }

    return;
  }
}
