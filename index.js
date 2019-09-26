/**
 * ADT Pulse Homebridge Plugin.
 *
 * @since 1.0.0
 */
const _     = require("lodash");
const Pulse = require("./adt-pulse.js");

let Accessory, Service, Characteristic, UUIDGen;

/**
 * Register the platform plugin.
 *
 * @param {Object} homebridge - The Homebridge API.
 *
 * @since 1.0.0
 */
module.exports = function (homebridge) {
    Accessory      = homebridge.platformAccessory;
    Service        = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen        = homebridge.hap.uuid;

    // Register the platform plugin into Homebridge.
    homebridge.registerPlatform(
        "homebridge-adt-pulse",
        "ADTPulse",
        ADTPulsePlatform,
        true
    );
};

/**
 * Platform constructor.
 *
 * @param {function} log    - Native log function.
 * @param {Object}   config - Platform plugin configuration from "config.json".
 * @param {Object}   api    - The Homebridge API. Null for older versions.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function ADTPulsePlatform(log, config, api) {
    let that = this;

    this.log    = log;
    this.config = config;

    // Where the security panel and sensors are cached.
    this.accessories  = [];
    this.deviceStatus = [];
    this.zoneStatus   = [];

    // Prevent account lockout.
    this.failedLoginTimes = 0;

    // Keeps track of device updates.
    this.polling      = {};
    this.lastSyncCode = "1-0-0";
    this.isSyncing    = false;

    // Credentials could be null.
    this.username        = _.get(this.config, "username");
    this.password        = _.get(this.config, "password");
    this.debug           = _.get(this.config, "debug");
    this.refreshInterval = _.get(this.config, "refreshInterval");
    this.syncInterval    = _.get(this.config, "syncInterval");

    if (!this.username || !this.password) {
        this.log.error("Missing required username or password in configuration.");
        return;
    }

    if (typeof this.debug !== "boolean") {
        this.log.info("The debug setting should be a boolean (true|false). In the meantime, setting to false.");
        this.debug = false;
    }

    if (typeof this.refreshInterval !== "number") {
        this.log.info("The refresh interval setting should be a numerical digit. In the meantime, setting to 15.");
        this.refreshInterval = 15;
    }

    if (typeof this.syncInterval !== "number") {
        this.log.info("The sync interval setting should be a numerical digit. In the meantime, setting to 30.");
        this.syncInterval = 30;
    }

    // Create a new Pulse instance.
    this.theAlarm = new Pulse({
        "username": this.username,
        "password": this.password,
        "debug": this.debug,
    });

    if (api) {
        /**
         * Save the API object as plugin needs to register
         * new accessories via this object.
         */
        this.api = api;

        /**
         * Listen to event "didFinishLaunching".
         *
         * Means homebridge already finished loading cached accessories.
         * This plugin should only register new accessories that
         * does not exist in Homebridge after this event, or start to discover
         * and register new accessories.
         */
        this.api.on("didFinishLaunching", function () {
            that.log("Cached accessories loaded. Initializing portal sync...");

            // Begin portal sync.
            let sync = setInterval(() => {
                if (that.isSyncing !== true) {
                    that.isSyncing = true;

                    that.theAlarm
                        .login()
                        .then((response) => {
                            let version          = _.get(response, "info.version", undefined);
                            let supportedVersion = "16.0.0-131";

                            if (version !== undefined && version !== supportedVersion) {
                                that.log(`WARNING! Web portal version ${version} does not match ${supportedVersion}.`);
                            }
                        })
                        .then(() => that.theAlarm.performPortalSync())
                        .then(async (syncCode) => {
                            let theSyncCode = _.get(syncCode, "info.syncCode");

                            // Runs if status changes.
                            if (theSyncCode !== that.lastSyncCode || theSyncCode === "1-0-0") {
                                if (that.debug) {
                                    that.log(`New sync code is ${theSyncCode}`);
                                }

                                // Update accessory status.
                                await that.theAlarm
                                    .getDeviceStatus()
                                    .then(async (device) => {
                                        let deviceInfo   = _.get(device, "info");
                                        let deviceUUID   = UUIDGen.generate("system-1");
                                        let deviceLoaded = _.find(that.accessories, ["UUID", deviceUUID]);

                                        // Set latest status into instance.
                                        that.deviceStatus = deviceInfo;

                                        if (deviceLoaded === undefined) {
                                            await that.prepareAddAccessory("device", deviceInfo);
                                        }
                                    })
                                    .then(() => that.theAlarm.getZoneStatus())
                                    .then((zones) => {
                                        let zonesInfo = _.get(zones, "info");

                                        // Set latest status into instance.
                                        that.zoneStatus = zonesInfo;

                                        // Add zones if they have not yet been added.
                                        _.forEach(zonesInfo, async (zone) => {
                                            let deviceUUID   = UUIDGen.generate(_.get(zone, "id"));
                                            let deviceLoaded = _.find(that.accessories, ["UUID", deviceUUID]);

                                            if (deviceLoaded === undefined) {
                                                await that.prepareAddAccessory("zone", zone);
                                            }
                                        });
                                    })
                                    .catch((error) => {
                                        let action = _.get(error, "action");

                                        switch (action) {
                                            case "GET_DEVICE_INFO":
                                                that.log("Get device information failed.");
                                                break;
                                            case "GET_DEVICE_STATUS":
                                                that.log("Get device status failed.");
                                                break;
                                            case "GET_ZONE_STATUS":
                                                that.log("Get zone status failed.");
                                                break;
                                            case "HOST_UNREACHABLE":
                                                that.log("Internet disconnected or portal unreachable.");
                                                break;
                                            default:
                                                that.log(`Action failed on ${action}.`);
                                                break;
                                        }
                                    });

                                // Update sync code.
                                that.lastSyncCode = theSyncCode;
                            }
                        })
                        .then(() => {
                            that.isSyncing = false;
                        })
                        .catch((error) => {
                            let action = _.get(error, "action");

                            switch (action) {
                                case "LOGIN":
                                    that.failedLoginTimes++;

                                    if (that.failedLoginTimes > 1) {
                                        that.log("Login failed more than once. Portal sync terminated.");
                                        clearInterval(sync);
                                    } else {
                                        that.log("Login failed. Trying again.");
                                    }
                                    break;
                                case "SYNC":
                                    if (that.debug) {
                                        that.log("Portal sync failed. Attempting to fix connection...");
                                    }
                                    break;
                                case "HOST_UNREACHABLE":
                                    that.log("Internet disconnected or portal unreachable.");
                                    break;
                                default:
                                    that.log(`Action failed on ${action}.`);
                                    break;
                            }

                            that.isSyncing = false;
                        });
                } else {
                    if (that.debug) {
                        that.log("Portal sync is already in progress...");
                    }
                }
            }, that.syncInterval * 1000);
        });
    }
}

// noinspection JSUnusedGlobalSymbols
/**
 * Restore cached accessories.
 *
 * Loads automatically when there are cached accessories.
 *
 * @param {Object} accessory - The accessory.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.configureAccessory = function (accessory) {
    let that = this;
    let name = accessory.displayName;

    this.log.info("Configuring accessory...", name);

    // Accessory is always reachable.
    accessory.updateReachability(true);

    // When "Identify Accessory" is tapped.
    accessory.on("identify", function (paired, callback) {
        that.log("Identifying accessory...", name);
        callback();
    });

    // Get accessory contexts.
    let id        = accessory.context.id;
    let type      = accessory.context.type;
    let lastState = accessory.context.lastState;

    // Get latest device status.
    this.devicePolling(type, id);

    switch (type) {
        case "system":
            accessory.getService(Service.SecuritySystem)
                .getCharacteristic(Characteristic.SecuritySystemTargetState)
                .on("get", (callback) => {
                    callback(null, this.getDeviceStatus("configure", "target", accessory, id, name, lastState));
                })
                .on("set", (state, callback) => {
                    this.setDeviceStatus(accessory, state, callback);
                });

            accessory.getService(Service.SecuritySystem)
                .getCharacteristic(Characteristic.SecuritySystemCurrentState)
                .on("get", (callback) => {
                    callback(null, this.getDeviceStatus("configure", "current", accessory, id, name, lastState));
                });
            break;
        case "doorWindow":
            accessory.getService(Service.ContactSensor)
                .getCharacteristic(Characteristic.ContactSensorState)
                .on("get", function (callback) {
                    let status = that.getZoneStatus(type, id);

                    // If not available, load default state, else load last state.
                    if (status === null && lastState === null) {
                        status = Characteristic.ContactSensorState.CONTACT_DETECTED;
                    } else if (status === null) {
                        status = lastState;
                    }

                    if (that.debug) {
                        that.log(`Getting ${accessory.displayName} (${id}) status...`, status);
                    }

                    callback(null, status);
                });
            break;
        case "glass":
            // HAP does not support tamper sensors yet, so I will use motion since the interface is similar.
            accessory.getService(Service.MotionSensor)
                .getCharacteristic(Characteristic.MotionDetected)
                .on("get", function (callback) {
                    let status = that.getZoneStatus(type, id);

                    // If not available, load default state, else load last state.
                    if (status === null && lastState === null) {
                        status = false;
                    } else if (status === null) {
                        status = lastState;
                    }

                    if (that.debug) {
                        that.log(`Getting ${accessory.displayName} (${id}) status...`, status);
                    }

                    callback(null, status);
                });
            break;
        case "motion":
            accessory.getService(Service.MotionSensor)
                .getCharacteristic(Characteristic.MotionDetected)
                .on("get", function (callback) {
                    let status = that.getZoneStatus(type, id);

                    // If not available, load default state, else load last state.
                    if (status === null && lastState === null) {
                        status = false;
                    } else if (status === null) {
                        status = lastState;
                    }

                    if (that.debug) {
                        that.log(`Getting ${accessory.displayName} (${id}) status...`, status);
                    }

                    callback(null, status);
                });
            break;
        case "co":
            accessory.getService(Service.CarbonMonoxideSensor)
                .getCharacteristic(Characteristic.CarbonMonoxideDetected)
                .on("get", function (callback) {
                    let status = that.getZoneStatus(type, id);

                    // If not available, load default state, else load last state.
                    if (status === null && lastState === null) {
                        status = Characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL;
                    } else if (status === null) {
                        status = lastState;
                    }

                    if (that.debug) {
                        that.log(`Getting ${accessory.displayName} (${id}) status...`, status);
                    }

                    callback(null, status);
                });
            break;
        case "fire":
            accessory.getService(Service.SmokeSensor)
                .getCharacteristic(Characteristic.SmokeDetected)
                .on("get", function (callback) {
                    let status = that.getZoneStatus(type, id);

                    // If not available, load default state, else load last state.
                    if (status === null && lastState === null) {
                        status = Characteristic.SmokeDetected.SMOKE_NOT_DETECTED;
                    } else if (status === null) {
                        status = lastState;
                    }

                    if (that.debug) {
                        that.log(`Getting ${accessory.displayName} (${id}) status...`, status);
                    }

                    callback(null, status);
                });
            break;
        default:
            this.log.error("Invalid or unsupported accessory...", type);
            break;
    }

    this.accessories.push(accessory);
};

/**
 * Add accessory.
 *
 * Call this function manually during plugin initialization.
 *
 * @param {string} type   - Can be "system", "doorWindow", "glass", "motion", "co", "fire".
 * @param {string} id     - The accessory unique identification code.
 * @param {string} name   - The name of the accessory.
 * @param {string} make   - The manufacturer of the accessory.
 * @param {string} model  - The model/type of accessory.
 * @param {string} state  - The last known state of the accessory.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.addAccessory = function (type, id, name, make, model, state) {
    let that            = this;
    let uuid            = UUIDGen.generate(id);
    let accessoryLoaded = _.find(this.accessories, ["UUID", uuid]);

    // Add accessories that have not yet been added.
    if (accessoryLoaded === undefined) {
        this.log.info("Adding new accessory...", name);

        let newAccessory   = new Accessory(name, uuid);
        let validAccessory = true;

        // Accessory is always reachable.
        newAccessory.updateReachability(true);

        switch (type) {
            case "system":
                newAccessory.addService(Service.SecuritySystem, name);

                newAccessory.getService(Service.SecuritySystem)
                    .getCharacteristic(Characteristic.SecuritySystemTargetState)
                    .on("get", (callback) => {
                        callback(null, this.getDeviceStatus("add", "target", newAccessory, id, name, state));
                    })
                    .on("set", (state, callback) => {
                        this.setDeviceStatus(newAccessory, state, callback);
                    });

                newAccessory.getService(Service.SecuritySystem)
                    .getCharacteristic(Characteristic.SecuritySystemCurrentState)
                    .on("get", (callback) => {
                        callback(null, this.getDeviceStatus("add", "current", newAccessory, id, name, state));
                    });
                break;
            case "doorWindow":
                newAccessory.addService(Service.ContactSensor, name)
                    .getCharacteristic(Characteristic.ContactSensorState)
                    .on("get", function (callback) {
                        let status = that.getZoneStatus(type, id);

                        // Save the last state so cached accessory will have a state to load.
                        if (status !== null) {
                            newAccessory.context.lastState = status;
                        } else {
                            newAccessory.context.lastState = this.formatZoneStatus(type, state);
                        }

                        if (that.debug) {
                            that.log(`Getting ${name} (${id}) status...`, status);
                        }

                        callback(null, status);
                    });
                break;
            case "glass":
                // HAP does not support tamper sensors yet, so I will use motion since the interface is similar.
                newAccessory.addService(Service.MotionSensor, name)
                    .getCharacteristic(Characteristic.MotionDetected)
                    .on("get", function (callback) {
                        let status = that.getZoneStatus(type, id);

                        // Save the last state so cached accessory will have a state to load.
                        if (status !== null) {
                            newAccessory.context.lastState = status;
                        } else {
                            newAccessory.context.lastState = this.formatZoneStatus(type, state);
                        }

                        if (that.debug) {
                            that.log(`Getting ${name} (${id}) status...`, status);
                        }

                        callback(null, status);
                    });
                break;
            case "motion":
                newAccessory.addService(Service.MotionSensor, name)
                    .getCharacteristic(Characteristic.MotionDetected)
                    .on("get", function (callback) {
                        let status = that.getZoneStatus(type, id);

                        // Save the last state so cached accessory will have a state to load.
                        if (status !== null) {
                            newAccessory.context.lastState = status;
                        } else {
                            newAccessory.context.lastState = this.formatZoneStatus(type, state);
                        }

                        if (that.debug) {
                            that.log(`Getting ${name} (${id}) status...`, status);
                        }

                        callback(null, status);
                    });
                break;
            case "co":
                newAccessory.addService(Service.CarbonMonoxideSensor, name)
                    .getCharacteristic(Characteristic.CarbonMonoxideDetected)
                    .on("get", function (callback) {
                        let status = that.getZoneStatus(type, id);

                        // Save the last state so cached accessory will have a state to load.
                        if (status !== null) {
                            newAccessory.context.lastState = status;
                        } else {
                            newAccessory.context.lastState = this.formatZoneStatus(type, state);
                        }

                        if (that.debug) {
                            that.log(`Getting ${name} (${id}) status...`, status);
                        }

                        callback(null, status);
                    });
                break;
            case "fire":
                newAccessory.addService(Service.SmokeSensor, name)
                    .getCharacteristic(Characteristic.SmokeDetected)
                    .on("get", function (callback) {
                        let status = that.getZoneStatus(type, id);

                        // Save the last state so cached accessory will have a state to load.
                        if (status !== null) {
                            newAccessory.context.lastState = status;
                        } else {
                            newAccessory.context.lastState = this.formatZoneStatus(type, state);
                        }

                        if (that.debug) {
                            that.log(`Getting ${name} (${id}) status...`, status);
                        }

                        callback(null, status);
                    });
                break;
            default:
                validAccessory = false;
                break;
        }

        if (validAccessory) {
            // Set accessory context.
            newAccessory.context.id   = id;
            newAccessory.context.type = type;

            // Get latest device status.
            this.devicePolling(type, id);

            // Set accessory information.
            newAccessory.getService(Service.AccessoryInformation)
                .setCharacteristic(Characteristic.Manufacturer, make)
                .setCharacteristic(Characteristic.SerialNumber, id)
                .setCharacteristic(Characteristic.Model, model);

            // When "Identify Accessory" is tapped.
            newAccessory.on("identify", function (paired, callback) {
                that.log("Identifying accessory...", newAccessory.displayName);
                callback();
            });

            // Make accessory active.
            this.accessories.push(newAccessory);

            // Save accessory to database.
            this.api.registerPlatformAccessories(
                "homebridge-adt-pulse",
                "ADTPulse",
                [newAccessory]
            );
        } else {
            this.log.error("Invalid or unsupported accessory...", type);
        }
    } else {
        this.log.debug("Skipping duplicate accessory...", uuid);
    }
};

/**
 * Prepare to add accessory.
 *
 * Call this function manually during plugin initialization.
 *
 * @param {string} type      - Could either be "device" or "zone".
 * @param {Object} accessory - The accessory.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.prepareAddAccessory = function (type, accessory) {
    if (type === "device") {
        let deviceName   = _.get(accessory, "name");
        let deviceMake   = _.get(accessory, "make");
        let deviceType   = _.get(accessory, "type");
        let deviceState  = _.get(accessory, "state");
        let deviceStatus = _.get(accessory, "status");

        let deviceModel   = deviceType.substr(deviceType.indexOf("-") + 2);
        let deviceSummary = `"${deviceState}" / "${deviceStatus}"`.toLowerCase();

        let deviceUUID   = UUIDGen.generate("system-1");
        let deviceLoaded = _.find(this.accessories, ["UUID", deviceUUID]);

        if (this.debug) {
            this.log.debug("Preparing to add device accessory...");
            this.log.debug(accessory);
        }

        if (deviceLoaded === undefined) {
            this.addAccessory(
                "system",
                "system-1",
                deviceName,
                deviceMake,
                deviceModel,
                deviceSummary
            );
        }
    } else if (type === "zone") {
        let zoneId    = _.get(accessory, "id");
        let zoneName  = _.get(accessory, "name");
        let zoneTags  = _.get(accessory, "tags");
        let zoneState = _.get(accessory, "state");

        let zoneUUID   = UUIDGen.generate(zoneId);
        let zoneLoaded = _.find(this.accessories, ["UUID", zoneUUID]);

        let zoneKind = zoneTags.substr(zoneTags.indexOf(",") + 1);
        let zoneModel;

        switch (zoneKind) {
            case "doorWindow":
                zoneModel = "Door/Window Sensor";
                break;
            case "glass":
                zoneModel = "Glass Break Detector";
                break;
            case "motion":
                zoneModel = "Motion Sensor";
                break;
            case "co":
                zoneModel = "Carbon Monoxide Detector";
                break;
            case "fire":
                zoneModel = "Fire (Smoke/Heat) Detector";
                break;
            default:
                zoneModel = "Unknown";
                break;
        }

        if (this.debug) {
            this.log.debug("Preparing to add zone accessory...");
            this.log.debug(accessory);
        }

        if (zoneLoaded === undefined) {
            this.addAccessory(
                zoneKind,
                zoneId,
                zoneName,
                "ADT",
                zoneModel,
                zoneState
            );
        }
    } else {
        this.log.error(`Skipping unknown ${type} accessory...`);
        if (this.debug) {
            this.log.debug(accessory);
        }
    }
};

/**
 * Remove accessory.
 *
 * Call this function manually during plugin initialization.
 *
 * @param {Object}  accessory - The accessory.
 * @param {boolean} reset     - Remove all accessories (reset).
 *
 * @since 1.0.0
 */
// TODO Work on accessory removal.
// ADTPulsePlatform.prototype.removeAccessory = function (accessory, reset) {
//     this.log("Remove accessory");
//     this.api.unregisterPlatformAccessories(
//         "homebridge-adt-pulse",
//         "ADTPulse",
//         this.accessories
//     );
//
//     if (reset) {
//         this.log("Removing security panel and all sensors...");
//         this.accessories = [];
//     } else {
//         this.log("Removing obsolete security panels and/or sensors...");
//     }
// };

/**
 * Force accessories to update.
 *
 * @param {string} type - Can be "system", "doorWindow", "glass", "motion", "co", "fire".
 * @param {string} id   - The accessory unique identification code.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.devicePolling = function (type, id) {
    let uuid      = UUIDGen.generate(id);
    let accessory = _.find(this.accessories, ["UUID", uuid]);

    // No multiple timeouts.
    clearTimeout(this.polling[uuid]);

    if (accessory !== undefined) {
        if (this.debug) {
            let displayName = accessory.displayName;
            this.log.debug(`Polling device status for ${displayName}...`);
        }

        switch (type) {
            case "system":
                accessory.getService(Service.SecuritySystem)
                    .getCharacteristic(Characteristic.SecuritySystemTargetState)
                    .getValue();

                accessory.getService(Service.SecuritySystem)
                    .getCharacteristic(Characteristic.SecuritySystemCurrentState)
                    .getValue();
                break;
            case "doorWindow":
                accessory.getService(Service.ContactSensor)
                    .getCharacteristic(Characteristic.ContactSensorState)
                    .getValue();
                break;
            case "glass":
                accessory.getService(Service.MotionSensor)
                    .getCharacteristic(Characteristic.MotionDetected)
                    .getValue();
                break;
            case "motion":
                accessory.getService(Service.MotionSensor)
                    .getCharacteristic(Characteristic.MotionDetected)
                    .getValue();
                break;
            case "co":
                accessory.getService(Service.CarbonMonoxideSensor)
                    .getCharacteristic(Characteristic.CarbonMonoxideDetected)
                    .getValue();
                break;
            case "fire":
                accessory.getService(Service.SmokeSensor)
                    .getCharacteristic(Characteristic.SmokeDetected)
                    .getValue();
                break;
            default:
                this.log.error("Invalid or unsupported accessory...", type);
                break;
        }
    }

    // Force accessory to check device status again.
    this.polling[uuid] = setTimeout(this.devicePolling.bind(this, type, id), this.refreshInterval * 1000);
};

/**
 * Get device status.
 *
 * @param {string} mode      - Can be "add" or "configure".
 * @param {string} kind      - Can be "target" state or "current" state.
 * @param {Object} accessory - The accessory.
 * @param {string} id        - The accessory unique identification code.
 * @param {string} name      - The name of the accessory.
 * @param {string} summary   - The last known summary of the accessory.
 *
 * @returns {null|number}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.getDeviceStatus = function (mode, kind, accessory, id, name, summary) {
    let cacheDevice  = this.deviceStatus;
    let cacheState   = _.get(cacheDevice, "state");
    let cacheStatus  = _.get(cacheDevice, "status");
    let cacheSummary = `"${cacheState}" / "${cacheStatus}"`.toLowerCase();

    let status = null;

    switch (mode) {
        case "add":
            if (!cacheSummary.includes("undefined")) {
                status                      = this.formatDeviceStatus(cacheSummary);
                accessory.context.lastState = cacheSummary;
            } else {
                status                      = this.formatDeviceStatus(summary);
                accessory.context.lastState = summary;
            }
            break;
        case "configure":
            if (cacheSummary.includes("undefined") && summary === undefined) {
                status                      = this.formatDeviceStatus("\"Disarmed\" / \"All Quiet\"");
                accessory.context.lastState = "\"disarmed\" / \"all quiet\"";
            } else if (cacheSummary.includes("undefined")) {
                status                      = this.formatDeviceStatus(summary);
                accessory.context.lastState = summary;
            } else {
                status                      = this.formatDeviceStatus(cacheSummary);
                accessory.context.lastState = cacheSummary;
            }
            break;
        default:
            this.log.error(`Unknown mode ${mode}.`);
            break;
    }

    if (this.debug) {
        this.log.debug(`Getting ${name} (${id}) ${kind} status...`, status);
    }

    return status;
};

/**
 * Format device status.
 *
 * Converts the device state and device status from ADT Pulse to Homebridge / HAP compatible.
 *
 * @param {string} summary - The last known summary of the accessory.
 *
 * @returns {null|number}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.formatDeviceStatus = function (summary) {
    let status = null;

    let lowerCaseSummary = summary.toLowerCase();
    let alarm            = lowerCaseSummary.includes("alarm");
    let disarmed         = lowerCaseSummary.includes("disarmed");
    let arm_away         = lowerCaseSummary.includes("armed away");
    let arm_stay         = lowerCaseSummary.includes("armed stay");

    if (alarm) {
        status = Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED;
    } else if (disarmed) {
        status = Characteristic.SecuritySystemCurrentState.DISARMED;
    } else if (arm_away) {
        status = Characteristic.SecuritySystemCurrentState.AWAY_ARM;
    } else if (arm_stay) {
        status = Characteristic.SecuritySystemCurrentState.STAY_ARM;
    }

    return status;
};

/**
 * Set device status.
 *
 * @param {Object}   accessory - The accessory.
 * @param {number}   arm       - Defined status to change device to.
 * @param {function} callback  - Homebridge callback.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.setDeviceStatus = function (accessory, arm, callback) {
    const id        = _.get(accessory, "context.id");
    const name      = _.get(accessory, "displayName");
    const lastState = _.get(accessory, "context.lastState", "").toLowerCase();

    this.log.info(`Setting ${name} (${id}) status to ${arm}...`);

    // Setting device status.
    this.theAlarm
        .login()
        .then(async () => {
            // Check if Disarmed, Armed Away, or Armed Stay.
            if (lastState.includes("disarmed")) {
                // Clear the alarms first.
                if (lastState.includes("uncleared alarm")) {
                    await this.theAlarm.setDeviceStatus("disarmed+with+alarm", "off");
                } else if (lastState.includes("alarm")) {
                    await this.theAlarm.setDeviceStatus("disarmed", "off");
                    await this.theAlarm.setDeviceStatus("disarmed+with+alarm", "off");
                }

                switch (arm) {
                    case Characteristic.SecuritySystemTargetState.STAY_ARM:
                        await this.theAlarm.setDeviceStatus("disarmed", "stay");
                        break;
                    case Characteristic.SecuritySystemTargetState.AWAY_ARM:
                        await this.theAlarm.setDeviceStatus("disarmed", "away");
                        break;
                    case Characteristic.SecuritySystemTargetState.NIGHT_ARM:
                        this.log.error("ADT Pulse does not support night mode. Arming stay instead.");

                        await this.theAlarm.setDeviceStatus("disarmed", "stay");
                        break;
                    case Characteristic.SecuritySystemTargetState.DISARM:
                        this.log.error("Already Disarmed. Cannot disarm again.");
                        break;
                    default:
                        this.log.error(`Unknown arm status ${arm}...`);
                        break;
                }
            } else if (lastState.includes("armed away")) {
                // Clear the alarms first.
                if (lastState.includes("uncleared alarm")) {
                    await this.theAlarm.setDeviceStatus("away+with+alarm", "off"); // TODO ??? Not sure if this is valid.
                } else if (lastState.includes("alarm")) {
                    await this.theAlarm.setDeviceStatus("away", "off");
                    await this.theAlarm.setDeviceStatus("disarmed+with+alarm", "off");
                }

                switch (arm) {
                    case Characteristic.SecuritySystemTargetState.STAY_ARM:
                        await this.theAlarm.setDeviceStatus("away", "off");
                        await this.theAlarm.setDeviceStatus("disarmed", "stay");
                        break;
                    case Characteristic.SecuritySystemTargetState.AWAY_ARM:
                        this.log.error("Already Armed Away. Cannot arm away again.");
                        break;
                    case Characteristic.SecuritySystemTargetState.NIGHT_ARM:
                        this.log.error("ADT Pulse does not support night mode. Arming stay instead.");

                        await this.theAlarm.setDeviceStatus("away", "off");
                        await this.theAlarm.setDeviceStatus("disarmed", "stay");
                        break;
                    case Characteristic.SecuritySystemTargetState.DISARM:
                        await this.theAlarm.setDeviceStatus("away", "off");
                        break;
                    default:
                        this.log.error(`Unknown arm status ${arm}...`);
                        break;
                }
            } else if (lastState.includes("armed stay")) {
                // Clear the alarms first.
                if (lastState.includes("uncleared alarm")) {
                    await this.theAlarm.setDeviceStatus("stay+with+alarm", "off"); // TODO ??? Not sure if this is valid.
                } else if (lastState.includes("alarm")) {
                    await this.theAlarm.setDeviceStatus("stay", "off");
                    await this.theAlarm.setDeviceStatus("disarmed+with+alarm", "off");
                }

                switch (arm) {
                    case Characteristic.SecuritySystemTargetState.STAY_ARM:
                        this.log.error("Already Armed Stay. Cannot arm stay again.");
                        break;
                    case Characteristic.SecuritySystemTargetState.AWAY_ARM:
                        await this.theAlarm.setDeviceStatus("stay", "off");
                        await this.theAlarm.setDeviceStatus("disarmed", "away");
                        break;
                    case Characteristic.SecuritySystemTargetState.NIGHT_ARM:
                        this.log.error("ADT Pulse does not support night mode. Arming stay instead.");
                        this.log.error("Already Armed Stay. Cannot arm stay again.");
                        break;
                    case Characteristic.SecuritySystemTargetState.DISARM:
                        await this.theAlarm.setDeviceStatus("stay", "off");
                        break;
                    default:
                        this.log.error(`Unknown arm status ${arm}...`);
                        break;
                }
            } else {
                throw "lastState throw: " + lastState;
            }
        })
        .then(() => {
            accessory.getService(Service.SecuritySystem).setCharacteristic(Characteristic.SecuritySystemCurrentState, arm.toString());
            callback(null);
        })
        .catch((error) => {
            console.log("error", error);

            callback(null);
        });
};

/**
 * Get zone status.
 *
 * Returns the correct zone status from "this.zoneStatus" array.
 *
 * @param {string} type - Can be "system", "doorWindow", "glass", "motion", "co", "fire".
 * @param {string} id   - The accessory unique identification code.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.getZoneStatus = function (type, id) {
    let zone  = _.find(this.zoneStatus, ["id", id]);
    let state = _.get(zone, "state");

    // If state is undefined, this function will return null.
    return this.formatZoneStatus(type, state);
};

/**
 * Format zone status.
 *
 * Converts the zone status from ADT Pulse "devStat" icon classes to Homebridge / HAP compatible.
 *
 * @param {string} type  - Can be "doorWindow", "glass", "motion", "co", "fire".
 * @param {string} state - Can be "devStatOK", "devStatOpen", "devStatMotion", "devStatTamper", "devStatAlarm".
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.formatZoneStatus = function (type, state) {
    let status = null;

    switch (type) {
        case "doorWindow":
            if (state === "devStatOK") {
                status = Characteristic.ContactSensorState.CONTACT_DETECTED;
            } else if (state === "devStatOpen" || state === "devStatTamper") {
                status = Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;
            }
            break;
        case "glass":
            if (state === "devStatOK") {
                // No tamper detected.
                status = false;
            } else if (state === "devStatTamper") {
                // Tamper detected.
                status = true;
            }
            break;
        case "motion":
            if (state === "devStatOK") {
                // No motion detected.
                status = false;
            } else if (state === "devStatMotion") {
                // Motion detected.
                status = true;
            }
            break;
        case "co":
            if (state === "devStatOK") {
                status = Characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL;
            } else if (state === "devStatAlarm") {
                status = Characteristic.CarbonMonoxideDetected.CO_LEVELS_ABNORMAL;
            }
            break;
        case "fire":
            if (state === "devStatOK") {
                status = Characteristic.SmokeDetected.SMOKE_NOT_DETECTED;
            } else if (state === "devStatAlarm") {
                status = Characteristic.SmokeDetected.SMOKE_DETECTED;
            }
            break;
        default:
            status = null;
            this.log.error(`Unknown type ${type} with state "${state}".`);
            break;
    }

    return status;
};
