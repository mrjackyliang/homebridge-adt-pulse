/**
 * ADT Pulse Homebridge Plugin.
 *
 * @since 1.0.0
 */
const _ = require('lodash');

const packageJson = require('./package.json');
const Pulse = require('./api');

let Accessory;
let Service;
let Characteristic;
let UUIDGen;

/**
 * Platform constructor.
 *
 * @param {Logger} log    - Homebridge log function.
 * @param {object} config - Platform plugin configuration from "config.json".
 * @param {object} api    - Homebridge API. Null for older versions.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function ADTPulsePlatform(log, config, api) {
  this.log = log;
  this.config = config;

  // Where the security panel and sensors are held.
  this.accessories = [];
  this.deviceStatus = {};
  this.zoneStatus = {};

  // Keeps track of failed times.
  this.failedLoginTimes = 0;
  this.stalledSyncTimes = 0;

  // Keeps track of device updates.
  this.lastSyncCode = '1-0-0';
  this.portalSyncSession = {};
  this.isSyncing = false;

  // Session data.
  this.sessionVersion = '';

  // These variables could be undefined.
  this.username = _.get(this.config, 'username');
  this.password = _.get(this.config, 'password');
  this.fingerprint = _.get(this.config, 'fingerprint');
  this.overrideSensors = _.get(this.config, 'overrideSensors');
  this.country = _.get(this.config, 'country');
  this.logLevel = _.get(this.config, 'logLevel');
  this.logActivity = _.get(this.config, 'logActivity');
  this.removeObsoleteZones = _.get(this.config, 'removeObsoleteZones');
  this.resetAll = _.get(this.config, 'resetAll');

  // Timers.
  this.syncInterval = 3; // 3 seconds.
  this.syncIntervalDelay = 600; // 10 minutes.
  this.setDeviceTimeout = 6; // 6 seconds.

  // Tested builds.
  this.testedBuilds = ['24.0.0-117', '25.0.0-21'];

  // Setup logging function.
  if (typeof this.logLevel !== 'number' || ![10, 20, 30, 40, 50].includes(this.logLevel)) {
    if (this.logLevel !== undefined) {
      this.log.warn('"logLevel" should be a specific number (10, 20, 30, 40, or 50). Defaulting to 30.');
    }
    this.logLevel = 30;
  }

  // Check for credentials.
  if (!this.username || !this.password) {
    this.logMessage('Missing required username or password in configuration.', 10);
    return;
  }

  // Check if override sensors is configured incorrectly.
  if (
    !_.isArray(this.overrideSensors)
    || !_.every(this.overrideSensors, (sensor) => _.isString(_.get(sensor, 'name')) && _.isString(_.get(sensor, 'type')))
  ) {
    if (this.overrideSensors !== undefined) {
      this.logMessage('"overrideSensors" setting is incorrectly defined. Defaulting to [].', 20);
    }
    this.overrideSensors = [];
  }

  // Setup country configuration.
  if (!['us', 'ca'].includes(this.country)) {
    if (this.country !== undefined) {
      this.logMessage('"country" setting should be "us" or "ca". Defaulting to "us".', 20);
    }
    this.country = 'us';
  }

  // Check if log activity is configured.
  if (typeof this.logActivity !== 'boolean') {
    if (this.logActivity !== undefined) {
      this.logMessage('"logActivity" setting should be true or false. Defaulting to true.', 20);
    }
    this.logActivity = true;
  }

  // Check if obsolete zone removal is configured.
  if (typeof this.removeObsoleteZones !== 'boolean') {
    if (this.removeObsoleteZones !== undefined) {
      this.logMessage('"removeObsoleteZones" setting should be true or false. Defaulting to true.', 20);
    }
    this.removeObsoleteZones = true;
  }

  // Prevent accidental reset.
  if (typeof this.resetAll !== 'boolean') {
    if (this.resetAll !== undefined) {
      this.logMessage('"resetAll" setting should be true or false. Defaulting to false.', 20);
    }
    this.resetAll = false;
  }

  // Initialize main script.
  this.pulse = new Pulse({
    username: this.username,
    password: this.password,
    fingerprint: this.fingerprint,
    overrideSensors: this.overrideSensors,
    country: this.country,
    debug: (this.logLevel >= 40),
  });

  if (api) {
    // Register new accessories via this object.
    this.api = api;

    this.api.on('didFinishLaunching', () => {
      this.logSystemInformation({
        platform: _.get(process, 'platform'),
        arch: _.get(process, 'arch'),
        pluginVer: _.get(packageJson, 'version'),
        nodeVer: _.get(process, 'versions.node'),
        homebridgeVer: _.get(api, 'serverVersion'),
      });

      if (this.resetAll) {
        this.logMessage('Removing all ADT Pulse accessories from Homebridge...', 20);

        _.forEachRight(this.accessories, (accessory) => {
          this.removeAccessory(accessory);
        });
      } else {
        this.portalSync();
      }
    });
  }
}

/**
 * Restore cached accessories.
 *
 * @param {object} accessory - The accessory.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.configureAccessory = function configureAccessory(accessory) {
  const that = this;

  const id = _.get(accessory, 'context.id');
  const name = _.get(accessory, 'displayName');
  const type = _.get(accessory, 'context.type');

  this.logMessage(`Configuring cached accessory... ${name} (${id})`, 30);
  this.logMessage(accessory, 40);

  // When "Identify Accessory" is tapped.
  accessory.on('identify', (paired, callback) => {
    this.logMessage(`Identifying cached accessory... ${name} (${id})`, 30);
    callback(null, paired);
  });

  switch (type) {
    case 'system':
      accessory
        .getService(Service.SecuritySystem)
        .getCharacteristic(Characteristic.SecuritySystemTargetState)
        .on('get', (callback) => this.getDeviceAccessory('target', id, name, callback))
        .on('set', (state, callback) => this.setDeviceAccessory(id, name, state, callback));

      accessory
        .getService(Service.SecuritySystem)
        .getCharacteristic(Characteristic.SecuritySystemCurrentState)
        .on('get', (callback) => this.getDeviceAccessory('current', id, name, callback));
      break;
    case 'doorWindow':
      accessory
        .getService(Service.ContactSensor)
        .getCharacteristic(Characteristic.ContactSensorState)
        .on('get', (callback) => this.getZoneAccessory(type, id, name, callback));
      break;
    case 'glass':
      accessory
        .getService(Service.OccupancySensor)
        .getCharacteristic(Characteristic.OccupancyDetected)
        .on('get', (callback) => this.getZoneAccessory(type, id, name, callback));
      break;
    case 'motion':
      accessory
        .getService(Service.MotionSensor)
        .getCharacteristic(Characteristic.MotionDetected)
        .on('get', (callback) => this.getZoneAccessory(type, id, name, callback));
      break;
    case 'co':
      accessory
        .getService(Service.CarbonMonoxideSensor)
        .getCharacteristic(Characteristic.CarbonMonoxideDetected)
        .on('get', (callback) => this.getZoneAccessory(type, id, name, callback));
      break;
    case 'fire':
      accessory
        .getService(Service.SmokeSensor)
        .getCharacteristic(Characteristic.SmokeDetected)
        .on('get', (callback) => this.getZoneAccessory(type, id, name, callback));
      break;
    default:
      this.logMessage(`Failed to configure invalid or unsupported accessory... ${type}`, 10);
      break;
  }

  that.accessories.push(accessory);
};

/**
 * Add accessory.
 *
 * @param {string} type  - Can be "system", "doorWindow", "glass", "motion", "co", or "fire".
 * @param {string} id    - The accessory unique identification code.
 * @param {string} name  - The name of the accessory.
 * @param {string} make  - The manufacturer of the accessory.
 * @param {string} model - The model of the accessory.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.addAccessory = function addAccessory(type, id, name, make, model) {
  const that = this;

  const uuid = UUIDGen.generate(id);
  const accessory = new Accessory(name, uuid);
  const accessoryLoaded = _.find(that.accessories, ['UUID', uuid]);

  // Add new accessories only.
  if (accessoryLoaded === undefined) {
    this.logMessage(`Adding accessory... ${name} (${id})`, 30);

    let validAccessory = true;

    switch (type) {
      case 'system':
        accessory.addService(Service.SecuritySystem, name);

        accessory
          .getService(Service.SecuritySystem)
          .getCharacteristic(Characteristic.SecuritySystemTargetState)
          .on('get', (callback) => this.getDeviceAccessory('target', id, name, callback))
          .on('set', (state, callback) => this.setDeviceAccessory(id, name, state, callback));

        accessory
          .getService(Service.SecuritySystem)
          .getCharacteristic(Characteristic.SecuritySystemCurrentState)
          .on('get', (callback) => this.getDeviceAccessory('current', id, name, callback));
        break;
      case 'doorWindow':
        accessory
          .addService(Service.ContactSensor, name)
          .getCharacteristic(Characteristic.ContactSensorState)
          .on('get', (callback) => this.getZoneAccessory(type, id, name, callback));
        break;
      case 'glass':
        accessory
          .addService(Service.OccupancySensor, name)
          .getCharacteristic(Characteristic.OccupancyDetected)
          .on('get', (callback) => this.getZoneAccessory(type, id, name, callback));
        break;
      case 'motion':
        accessory
          .addService(Service.MotionSensor, name)
          .getCharacteristic(Characteristic.MotionDetected)
          .on('get', (callback) => this.getZoneAccessory(type, id, name, callback));
        break;
      case 'co':
        accessory
          .addService(Service.CarbonMonoxideSensor, name)
          .getCharacteristic(Characteristic.CarbonMonoxideDetected)
          .on('get', (callback) => this.getZoneAccessory(type, id, name, callback));
        break;
      case 'fire':
        accessory
          .addService(Service.SmokeSensor, name)
          .getCharacteristic(Characteristic.SmokeDetected)
          .on('get', (callback) => this.getZoneAccessory(type, id, name, callback));
        break;
      default:
        validAccessory = false;
        break;
    }

    if (validAccessory) {
      // Set accessory context.
      _.set(accessory, 'context.id', id);
      _.set(accessory, 'context.type', type);

      // Set accessory information.
      accessory
        .getService(Service.AccessoryInformation)
        .setCharacteristic(Characteristic.Manufacturer, make)
        .setCharacteristic(Characteristic.SerialNumber, id)
        .setCharacteristic(Characteristic.Model, model)
        .setCharacteristic(Characteristic.FirmwareRevision, '1.0');

      // When "Identify Accessory" is tapped.
      accessory.on('identify', (paired, callback) => {
        this.logMessage(`Identifying new accessory... ${accessory.displayName} (${id})`, 30);
        callback(null, paired);
      });

      // Make accessory active.
      that.accessories.push(accessory);

      // Save accessory to database.
      that.api.registerPlatformAccessories(
        'homebridge-adt-pulse',
        'ADTPulse',
        [accessory],
      );
    } else {
      this.logMessage(`Failed to register invalid or unsupported accessory... ${type}`, 10);
    }
  } else {
    this.logMessage(`Skipping duplicate accessory... ${uuid}`, 20);
  }
};

/**
 * Prepare to add accessory.
 *
 * @param {string} type      - Could either be "device" or "zone".
 * @param {object} accessory - The accessory.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.prepareAddAccessory = function prepareAddAccessory(type, accessory) {
  const that = this;

  if (type === 'device') {
    const deviceName = _.get(accessory, 'name', '').replace(/[()]/gi, '');
    const deviceMake = _.get(accessory, 'make');
    const deviceType = _.get(accessory, 'type');

    const deviceKind = 'system';
    const deviceModel = deviceType.substr(deviceType.indexOf('-') + 2);

    const deviceId = 'system-1';
    const deviceUUID = UUIDGen.generate(deviceId);
    const deviceLoaded = _.find(that.accessories, ['UUID', deviceUUID]);

    this.logMessage(`Preparing to add device (${deviceId}) accessory...`, 30);
    this.logMessage(accessory, 40);

    if (deviceLoaded === undefined) {
      this.addAccessory(
        deviceKind,
        deviceId,
        deviceName,
        deviceMake,
        deviceModel,
      );
    }
  } else if (type === 'zone') {
    const zoneId = _.get(accessory, 'id');
    const zoneName = _.get(accessory, 'name', '').replace(/[()]/gi, '');
    const zoneTags = _.get(accessory, 'tags');

    const zoneMake = 'ADT';
    const zoneKind = zoneTags.substr(zoneTags.indexOf(',') + 1);

    const zoneUUID = UUIDGen.generate(zoneId);
    const zoneLoaded = _.find(that.accessories, ['UUID', zoneUUID]);

    let zoneModel;

    switch (zoneKind) {
      case 'doorWindow':
        zoneModel = 'Door/Window Sensor';
        break;
      case 'glass':
        zoneModel = 'Glass Break Detector';
        break;
      case 'motion':
        zoneModel = 'Motion Sensor';
        break;
      case 'co':
        zoneModel = 'Carbon Monoxide Detector';
        break;
      case 'fire':
        zoneModel = 'Fire (Smoke/Heat) Detector';
        break;
      default:
        zoneModel = 'Unknown';
        break;
    }

    this.logMessage(`Preparing to add zone (${zoneId}) accessory...`, 30);
    this.logMessage(accessory, 40);

    if (zoneLoaded === undefined) {
      this.addAccessory(
        zoneKind,
        zoneId,
        zoneName,
        zoneMake,
        zoneModel,
      );
    }
  } else {
    this.logMessage(`Skipping unknown accessory... ${type}`, 10);
    this.logMessage(accessory, 40);
  }
};

/**
 * Remove accessory.
 *
 * @param {object} accessory - The accessory.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.removeAccessory = function removeAccessory(accessory) {
  const that = this;

  if (_.get(accessory, 'UUID') === undefined) {
    this.logMessage(`Failed to remove invalid accessory... ${accessory}`, 10);
    return;
  }

  const id = _.get(accessory, 'context.id');
  const name = _.get(accessory, 'displayName');

  this.logMessage(`Removing accessory... ${name} (${id})`, 30);
  this.logMessage(accessory, 40);

  // Remove from accessory array.
  _.remove(that.accessories, (thatAccessory) => thatAccessory.UUID === accessory.UUID);

  that.api.unregisterPlatformAccessories(
    'homebridge-adt-pulse',
    'ADTPulse',
    [accessory],
  );
};

/**
 * Get device accessory.
 *
 * @param {string}   type     - Can be "target" or "current".
 * @param {string}   id       - The accessory unique identification code.
 * @param {string}   name     - The name of the accessory.
 * @param {function} callback - Homebridge callback function.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.getDeviceAccessory = function getDeviceAccessory(type, id, name, callback) {
  const status = this.getDeviceStatus(type, true);

  let error = false;

  if (status === undefined) {
    error = true;
  }

  this.logMessage(`Getting ${name} (${id}) ${type} status... ${status}`, 50);

  callback(error, status);
};

/**
 * Set device accessory.
 *
 * @param {string}   id       - The accessory unique identification code.
 * @param {string}   name     - The name of the accessory.
 * @param {number}   state    - The state that accessory is being set to.
 * @param {function} callback - Homebridge callback function.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.setDeviceAccessory = function setDeviceAccessory(id, name, state, callback) {
  const that = this;

  this.setDeviceStatus(id, name, state);

  setTimeout(() => {
    callback(null);
  }, that.setDeviceTimeout * 1000);
};

/**
 * Get zone accessory.
 *
 * @param {string}   type     - Can be "doorWindow", "glass", "motion", "co", or "fire".
 * @param {string}   id       - The accessory unique identification code.
 * @param {string}   name     - The name of the accessory.
 * @param {function} callback - Homebridge callback function.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.getZoneAccessory = function getZoneAccessory(type, id, name, callback) {
  const status = this.getZoneStatus(type, id, true);

  let error = false;

  if (status === undefined) {
    error = true;
  }

  this.logMessage(`Getting ${name} (${id}) status... ${status}`, 50);

  callback(error, status);
};

/**
 * Get device status.
 *
 * Returns the latest device state and status from "this.deviceStatus" array.
 *
 * @param {string}  type   - Can be "target" or "current".
 * @param {boolean} format - Format device status to Homebridge.
 *
 * @returns {(undefined|string|number)}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.getDeviceStatus = function getDeviceStatus(type, format) {
  const device = this.deviceStatus;
  const summary = _.get(device, 'summary');
  const state = _.get(device, 'state');
  const status = _.get(device, 'status');

  if (typeof summary === 'string') {
    if (format) {
      return this.formatGetDeviceStatus(type, summary);
    }

    return `${state} / ${status}`.toLowerCase();
  }

  return undefined;
};

/**
 * Format get device status.
 *
 * Converts the device state and status from ADT Pulse to Homebridge compatible.
 *
 * @param {string} type    - Can be "target" or "current".
 * @param {string} summary - The last known summary of the accessory.
 *
 * @returns {(undefined|number)}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.formatGetDeviceStatus = function formatGetDeviceStatus(type, summary) {
  const lowerCaseSummary = summary.toLowerCase();
  const alarm = lowerCaseSummary.includes('alarm');
  const unclearedAlarm = lowerCaseSummary.includes('uncleared alarm');
  const disarmed = lowerCaseSummary.includes('disarmed');
  const armAway = lowerCaseSummary.includes('armed away');
  const armStay = lowerCaseSummary.includes('armed stay');
  const armNight = lowerCaseSummary.includes('armed night');

  let status;

  if (alarm && !unclearedAlarm) {
    if (type === 'current') {
      status = Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED;
    }
  } else if (unclearedAlarm || disarmed) {
    if (type === 'current') {
      status = Characteristic.SecuritySystemCurrentState.DISARMED;
    } else if (type === 'target') {
      status = Characteristic.SecuritySystemTargetState.DISARM;
    }
  } else if (armAway) {
    if (type === 'current') {
      status = Characteristic.SecuritySystemCurrentState.AWAY_ARM;
    } else if (type === 'target') {
      status = Characteristic.SecuritySystemTargetState.AWAY_ARM;
    }
  } else if (armStay) {
    if (type === 'current') {
      status = Characteristic.SecuritySystemCurrentState.STAY_ARM;
    } else if (type === 'target') {
      status = Characteristic.SecuritySystemTargetState.STAY_ARM;
    }
  } else if (armNight) {
    if (type === 'current') {
      status = Characteristic.SecuritySystemCurrentState.NIGHT_ARM;
    } else if (type === 'target') {
      status = Characteristic.SecuritySystemTargetState.NIGHT_ARM;
    }
  }

  return status;
};

/**
 * Set device status.
 *
 * @param {string} id   - The accessory unique identification code.
 * @param {string} name - The name of the accessory.
 * @param {number} arm  - Defined status to change device to.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.setDeviceStatus = function setDeviceStatus(id, name, arm) {
  const that = this;

  const latestState = this.getDeviceStatus('current', false);
  const newArmState = this.formatSetDeviceStatus(arm, 'arm');

  let oldArmState = this.formatSetDeviceStatus(latestState, 'armState');

  this.logMessage(`Setting ${name} (${id}) status from ${oldArmState} to ${newArmState}...`, 30);
  this.logMessage(`Latest state for ${name} (${id}) is ${latestState}...`, 40);

  if (typeof latestState === 'string' && latestState.includes('status unavailable')) {
    this.logMessage(`Unable to set ${name} (${id}) status. The ADT Pulse Gateway is offline.`, 10);
    return;
  }

  if (!oldArmState) {
    this.logMessage(`Unknown latestState context... ${latestState}`, 10);
    return;
  }

  that.pulse
    .login()
    .then(async () => {
      // Attempt to clear the alarms first.
      if (latestState.includes('alarm')) {
        if (['carbon monoxide', 'fire', 'burglary'].includes(latestState)) {
          this.logMessage(`Alarm is active! Disarming the ${name} (${id})...`, 20);

          await that.pulse.setDeviceStatus(oldArmState, 'off')
            .then((response) => this.thenResponse(response))
            .catch((error) => this.catchErrors(error));
        }

        this.logMessage(`Alarm is inactive. Clearing the ${name} (${id}) alarm...`, 20);

        // Clear the uncleared alarm.
        await that.pulse.setDeviceStatus('disarmed+with+alarm', 'off')
          .then((response) => this.thenResponse(response))
          .catch((error) => this.catchErrors(error));

        // Make sure oldArmState is manually reset.
        oldArmState = 'disarmed';

        // If disarm, job is finished.
        if (newArmState === 'off') {
          return;
        }
      }

      // Set the device status.
      if (oldArmState === newArmState || (oldArmState === 'disarmed' && newArmState === 'off')) {
        this.logMessage(`Already set to ${newArmState}. Cannot set from ${oldArmState} to ${newArmState}.`, 20);
      } else {
        const armStay = Characteristic.SecuritySystemTargetState.STAY_ARM;
        const armAway = Characteristic.SecuritySystemTargetState.AWAY_ARM;
        const armNight = Characteristic.SecuritySystemTargetState.NIGHT_ARM;

        // If device is not disarmed, and you are attempting to arm.
        if (oldArmState !== 'disarmed' && [armStay, armAway, armNight].includes(arm)) {
          this.logMessage(`Switching arm modes. Disarming ${name} (${id}) first...`, 30);

          await that.pulse.setDeviceStatus(oldArmState, 'off')
            .then((response) => this.thenResponse(response))
            .catch((error) => this.catchErrors(error));

          // Make sure oldArmState is manually reset.
          oldArmState = 'disarmed';
        }

        await that.pulse.setDeviceStatus(oldArmState, newArmState)
          .then((response) => this.thenResponse(response))
          .catch((error) => this.catchErrors(error));
      }
    })
    .catch((error) => this.catchErrors(error));
};

/**
 * Format set device status.
 *
 * @param {(string|number)} status - The device status.
 * @param {string}          type   - Can be "armState" or "arm".
 *
 * @returns {(undefined|string)}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.formatSetDeviceStatus = function formatSetDeviceStatus(status, type) {
  let string;

  if (type === 'armState' && typeof status === 'string') {
    if (status.includes('disarmed')) {
      string = 'disarmed';
    } else if (status.includes('armed away')) {
      string = 'away';
    } else if (status.includes('armed stay')) {
      string = 'stay';
    } else if (status.includes('armed night')) {
      string = 'night';
    }
  } else if (type === 'arm' && typeof status === 'number') {
    if (status === 0) {
      string = 'stay';
    } else if (status === 1) {
      string = 'away';
    } else if (status === 2) {
      string = 'night';
    } else if (status === 3) {
      string = 'off';
    }
  }

  return string;
};

/**
 * Get zone status.
 *
 * Returns the latest zone state from "this.zoneStatus" array.
 *
 * @param {string}  type   - Can be "system", "doorWindow", "glass", "motion", "co", or "fire".
 * @param {string}  id     - The accessory unique identification code.
 * @param {boolean} format - Format device status to Homebridge.
 *
 * @returns {(undefined|string|number|boolean)}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.getZoneStatus = function getZoneStatus(type, id, format) {
  const zone = _.find(this.zoneStatus, ['id', id]);
  const state = _.get(zone, 'state');

  if (typeof state === 'string') {
    if (format) {
      return this.formatGetZoneStatus(type, state);
    }

    return state;
  }

  return undefined;
};

/**
 * Format get zone status.
 *
 * Converts the zone state from ADT Pulse "devStat" icon classes to Homebridge compatible.
 *
 * @param {string} type  - Can be "doorWindow", "glass", "motion", "co", or "fire".
 * @param {string} state - Can be "devStatOK", "devStatLowBatt", "devStatOpen", "devStatMotion", "devStatTamper", or "devStatAlarm".
 *
 * @returns {(undefined|number|boolean)}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.formatGetZoneStatus = function formatGetZoneStatus(type, state) {
  let status;

  switch (type) {
    case 'doorWindow':
      if (state === 'devStatOK' || state === 'devStatLowBatt') {
        status = Characteristic.ContactSensorState.CONTACT_DETECTED;
      } else if (state === 'devStatOpen' || state === 'devStatTamper') {
        status = Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;
      }
      break;
    case 'glass':
      if (state === 'devStatOK' || state === 'devStatLowBatt') {
        status = Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED;
      } else if (state === 'devStatTamper') {
        status = Characteristic.OccupancyDetected.OCCUPANCY_DETECTED;
      }
      break;
    case 'motion':
      if (state === 'devStatOK' || state === 'devStatLowBatt') {
        status = false;
      } else if (state === 'devStatMotion' || state === 'devStatTamper') {
        status = true;
      }
      break;
    case 'co':
      if (state === 'devStatOK' || state === 'devStatLowBatt') {
        status = Characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL;
      } else if (state === 'devStatAlarm' || state === 'devStatTamper') {
        status = Characteristic.CarbonMonoxideDetected.CO_LEVELS_ABNORMAL;
      }
      break;
    case 'fire':
      if (state === 'devStatOK' || state === 'devStatLowBatt') {
        status = Characteristic.SmokeDetected.SMOKE_NOT_DETECTED;
      } else if (state === 'devStatAlarm' || state === 'devStatTamper') {
        status = Characteristic.SmokeDetected.SMOKE_DETECTED;
      }
      break;
    default:
      this.logMessage(`Unknown type with state... ${type} (${state})`, 10);
      break;
  }

  return status;
};

/**
 * Sync with web portal.
 *
 * Retrieve latest status, add/remove accessories.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.portalSync = function portalSync() {
  const that = this;

  clearTimeout(this.portalSyncSession.timer);

  // Begin portal sync.
  if (this.isSyncing !== true) {
    this.isSyncing = true;

    // Reset stalled sync increments.
    this.stalledSyncTimes = 0;

    this.logMessage('Synchronizing with ADT Pulse Web Portal...', 40);

    // Store in session, so it's easy to wipe out later.
    this.portalSyncSession.function = that.pulse
      .login()
      .then((response) => {
        const version = _.get(response, 'info.version');
        const supportedVersions = that.testedBuilds;

        if (version !== undefined && !supportedVersions.includes(version) && version !== this.sessionVersion) {
          this.logMessage(`Web Portal version ${version} detected. Test plugin to ensure system compatibility...`, 20);
        }

        // Bind version to session so message does not bomb logs.
        this.sessionVersion = version;
      })
      .then(() => that.pulse.performPortalSync())
      .then(async (syncCode) => {
        const theSyncCode = _.get(syncCode, 'info.syncCode');

        // Runs if status changes.
        if (theSyncCode !== this.lastSyncCode || theSyncCode === '1-0-0') {
          this.logMessage(`New sync code detected... ${theSyncCode}`, 40);

          // Add or update accessories.
          await that.pulse
            .getDeviceStatus()
            .then(async (device) => {
              const deviceStatus = _.get(device, 'info');

              const deviceUUID = UUIDGen.generate('system-1');
              const deviceLoaded = _.find(that.accessories, ['UUID', deviceUUID]);

              if (that.logActivity) {
                const deviceId = 'system-1';
                const deviceName = 'Security Panel';

                const oldState = _.get(this.deviceStatus, 'state');
                const oldStatus = _.get(this.deviceStatus, 'status');
                const newState = _.get(deviceStatus, 'state');
                const newStatus = _.get(deviceStatus, 'status');

                const oldSummary = `${oldState} / ${oldStatus}`.toLowerCase();
                const newSummary = `${newState} / ${newStatus}`.toLowerCase();

                if (!oldSummary.includes('undefined') && oldSummary !== newSummary) {
                  this.logMessage(`${deviceName} (${deviceId}) changed from "${oldSummary}" to "${newSummary}".`, 30);
                }
              }

              // Set latest status into instance.
              this.deviceStatus = deviceStatus;

              // Add or update device.
              if (deviceLoaded === undefined) {
                try {
                  const getDeviceInfo = await that.pulse.getDeviceInformation();
                  const deviceInfo = _.get(getDeviceInfo, 'info');
                  const deviceInfoStatus = _.merge(deviceInfo, deviceStatus);

                  this.prepareAddAccessory('device', deviceInfoStatus);
                } catch (error) {
                  this.catchErrors(error);
                }
              }

              this.devicePolling('system', 'system-1');
            })
            .then(() => that.pulse.getZoneStatus())
            .then((zones) => {
              const zoneStatus = _.get(zones, 'info');

              if (that.logActivity) {
                _.forEach(zoneStatus, (zone) => {
                  const zoneId = _.get(zone, 'id');
                  const zoneName = _.get(zone, 'name');
                  const zoneTags = _.get(zone, 'tags');

                  const matchStatus = _.find(this.zoneStatus, {
                    id: zoneId,
                    tags: zoneTags,
                  });

                  const oldStatus = _.get(matchStatus, 'state');
                  const newStatus = _.get(zone, 'state');

                  if (oldStatus !== undefined && oldStatus !== newStatus) {
                    const convertOld = this.convertZoneStatus(oldStatus, zoneTags);
                    const convertNew = this.convertZoneStatus(newStatus, zoneTags);

                    this.logMessage(`${zoneName} (${zoneId}) changed from "${convertOld}" to "${convertNew}".`, 30);
                  }
                });
              }

              // Set latest status into instance.
              this.zoneStatus = zoneStatus;

              _.forEach(zoneStatus, (zone) => {
                const zoneId = _.get(zone, 'id');
                const zoneTags = _.get(zone, 'tags');

                const zoneType = zoneTags.substr(zoneTags.indexOf(',') + 1);

                const deviceUUID = UUIDGen.generate(zoneId);
                const deviceLoaded = _.find(that.accessories, ['UUID', deviceUUID]);

                // Do not poll or add unknown sensor type.
                if (zoneTags === 'sensor') {
                  return;
                }

                // Add or update zone.
                if (deviceLoaded === undefined) {
                  this.prepareAddAccessory('zone', zone);
                }

                this.devicePolling(zoneType, zoneId);
              });
            })
            .catch((error) => this.catchErrors(error));

          // Remove obsolete zones.
          _.forEachRight(that.accessories, (accessory) => {
            const id = _.get(accessory, 'context.id');
            const type = _.get(accessory, 'context.type');
            const zone = _.find(this.zoneStatus, { id });

            // Do not remove security panel(s).
            if (zone === undefined && type !== 'system') {
              if (that.removeObsoleteZones) {
                this.logMessage(`Preparing to remove zone (${id}) accessory...`, 30);
                this.removeAccessory(accessory);
              } else {
                this.logMessage(`Preparing to remove zone (${id}) accessory, but "removeObsoleteZones" is disabled...`, 20);
              }
            }
          });

          // Update sync code.
          this.lastSyncCode = theSyncCode;
        }
      })
      .then(() => {
        this.isSyncing = false;
      })
      .catch((error) => {
        this.isSyncing = false;

        this.catchErrors(error);
      });
  } else if (this.stalledSyncTimes >= 5) {
    this.isSyncing = false;

    // Reset sync session.
    this.portalSyncSession = {};

    this.logMessage('Portal sync stalled. Cleaning up and resetting...', 20);
  } else {
    this.stalledSyncTimes += 1;

    this.logMessage('Portal sync is already in progress...', 40);
  }

  // Refresh portal sync session.
  this.portalSyncSession.timer = setTimeout(
    () => {
      if (this.failedLoginTimes > 2) {
        this.failedLoginTimes = 0;
      }

      this.portalSync();
    },
    // If login failed more than 2 times.
    (this.failedLoginTimes >= 2)
      ? that.syncIntervalDelay * 1000
      : that.syncInterval * 1000,
  );
};

/**
 * Convert "devStat" zone statuses to human readable format.
 *
 * @param {string} status - The raw "devStat" zone status.
 * @param {string} type   - Can be "sensor,doorWindow", "sensor,glass", "sensor,motion", "sensor,co", or "sensor,fire".
 *
 * @returns {(undefined|string)}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.convertZoneStatus = function convertZoneStatus(status, type) {
  let newStatus;

  if (typeof status === 'string') {
    const processedStatus = status.replace('devStat', '').toLowerCase();

    if (processedStatus === 'ok') {
      switch (type) {
        case 'sensor,doorWindow':
          newStatus = 'closed';
          break;
        case 'sensor,glass':
          newStatus = 'not tripped';
          break;
        case 'sensor,motion':
          newStatus = 'no motion';
          break;
        case 'sensor,co':
        case 'sensor,fire':
          newStatus = 'no alarm';
          break;
        default:
          break;
      }
    } else {
      newStatus = processedStatus;
    }
  }

  return newStatus || status;
};

/**
 * Force accessories to update.
 *
 * @param {string} type - Can be "system", "doorWindow", "glass", "motion", "co", or "fire".
 * @param {string} id   - The accessory unique identification code.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.devicePolling = function devicePolling(type, id) {
  const that = this;

  const uuid = UUIDGen.generate(id);
  const accessory = _.find(that.accessories, ['UUID', uuid]);
  const name = _.get(accessory, 'displayName');

  if (accessory !== undefined) {
    this.logMessage(`Polling device status for ${name} (${id})...`, 50);

    switch (type) {
      case 'system':
        accessory
          .getService(Service.SecuritySystem)
          .getCharacteristic(Characteristic.SecuritySystemTargetState)
          .getValue();

        accessory
          .getService(Service.SecuritySystem)
          .getCharacteristic(Characteristic.SecuritySystemCurrentState)
          .getValue();
        break;
      case 'doorWindow':
        accessory
          .getService(Service.ContactSensor)
          .getCharacteristic(Characteristic.ContactSensorState)
          .getValue();
        break;
      case 'glass':
        accessory
          .getService(Service.OccupancySensor)
          .getCharacteristic(Characteristic.OccupancyDetected)
          .getValue();
        break;
      case 'motion':
        accessory
          .getService(Service.MotionSensor)
          .getCharacteristic(Characteristic.MotionDetected)
          .getValue();
        break;
      case 'co':
        accessory
          .getService(Service.CarbonMonoxideSensor)
          .getCharacteristic(Characteristic.CarbonMonoxideDetected)
          .getValue();
        break;
      case 'fire':
        accessory
          .getService(Service.SmokeSensor)
          .getCharacteristic(Characteristic.SmokeDetected)
          .getValue();
        break;
      default:
        this.logMessage(`Failed to poll invalid or unsupported accessory... ${type}`, 10);
        break;
    }
  }
};

/**
 * Then response (for setDeviceStatus only).
 *
 * @param {object} response - The response object from setDeviceStatus.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.thenResponse = function thenResponse(response) {
  const forceArm = _.get(response, 'info.forceArm');

  if (forceArm) {
    this.logMessage('Sensor(s) were bypassed when arming. Check the ADT Pulse website or app for more details.', 20);
  }

  if (response) {
    this.logMessage(response, 40);
  }
};

/**
 * Catch errors.
 *
 * @param {object} error - The error response object.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.catchErrors = function catchErrors(error) {
  const action = _.get(error, 'action');
  const infoError = _.get(error, 'info.error');
  const infoMessage = _.get(error, 'info.message', '');

  let priority;

  switch (action) {
    case 'LOGIN':
      if (infoMessage.match(/(Sign In unsuccessful\.)/g)) {
        this.failedLoginTimes += 1;
      }

      // If login fails more than 2 times.
      if (this.failedLoginTimes > 2) {
        this.logMessage('Login failed more than 2 times. Portal sync restarting in 10 minutes...', priority = 10);
      } else {
        this.logMessage('Login failed. Trying again...', priority = 20);
      }
      break;
    case 'SYNC':
      this.logMessage('Portal sync failed. Attempting to fix connection...', priority = 40);
      break;
    case 'GET_DEVICE_INFO':
      this.logMessage('Get device information failed.', priority = 10);
      break;
    case 'GET_DEVICE_STATUS':
      this.logMessage('Get device status failed.', priority = 10);
      break;
    case 'GET_ZONE_STATUS':
      this.logMessage('Get zone status failed.', priority = 10);
      break;
    case 'SET_DEVICE_STATUS':
      this.logMessage('Set device status failed.', priority = 10);
      break;
    case 'HOST_UNREACHABLE':
      this.logMessage('Internet disconnected or portal unreachable. Trying again...', priority = 10);
      break;
    default:
      this.logMessage('An unknown error occurred.', priority = 10);
      break;
  }

  if (infoMessage) {
    this.logMessage(infoMessage, priority);
  }

  if (infoError) {
    const message = _.get(infoError, 'message');

    if (message) {
      this.logMessage(`Error: ${message}`, priority);
    } else {
      this.logMessage(infoError, priority);
    }
  }

  this.logMessage(error, 40);
};

/**
 * Log system information.
 *
 * @param {object} systemInfo               - System information object.
 * @param {string} systemInfo.platform      - The current platform.
 * @param {string} systemInfo.arch          - The current architecture.
 * @param {string} systemInfo.pluginVer     - The plugin version.
 * @param {string} systemInfo.nodeVer       - The node version.
 * @param {string} systemInfo.homebridgeVer - The homebridge version.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.logSystemInformation = function logSystemInformation(systemInfo) {
  this.logMessage(`running on ${systemInfo.platform} (${systemInfo.arch})`, 30);
  this.logMessage(`homebridge-adt-pulse v${systemInfo.pluginVer}`, 30);
  this.logMessage(`node v${systemInfo.nodeVer}`, 30);
  this.logMessage(`homebridge v${systemInfo.homebridgeVer}`, 30);
};

/**
 * Log message.
 *
 * @param {(object|string)} content  - The message or content being recorded into the logs.
 * @param {number}          priority - Can be 10 (error), 20 (warn), 30 (info), 40 (debug), or 50 (verbose).
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.logMessage = function logMessage(content, priority) {
  const {
    log,
    logLevel,
  } = this;

  if (logLevel >= priority) {
    /**
     * Messages will not be logged if priority is wrong.
     * Homebridge Debug Mode must be enabled for priorities 40 and 50.
     */
    switch (priority) {
      case 10:
        log.error(content);
        break;
      case 20:
        log.warn(content);
        break;
      case 30:
        log.info(content);
        break;
      case 40:
        log.debug(content);
        break;
      case 50:
        log.debug(content);
        break;
      default:
        break;
    }
  }
};

/**
 * Register the platform plugin.
 *
 * @param {object} homebridge - Homebridge API.
 *
 * @since 1.0.0
 */
module.exports = function plugin(homebridge) {
  Accessory = homebridge.platformAccessory;
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;

  // Register the platform into Homebridge.
  homebridge.registerPlatform(
    'homebridge-adt-pulse',
    'ADTPulse',
    ADTPulsePlatform,
    true,
  );
};
