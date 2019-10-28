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
    this.lastSyncCode = "1-0-0";
    this.syncing      = undefined;
    this.isSyncing    = false;

    // Session data.
    this.sessionVersion = "";

    // Credentials could be null.
    this.username = _.get(this.config, "username");
    this.password = _.get(this.config, "password");
    this.logLevel = _.get(this.config, "logLevel");

    // Timers.
    this.syncInterval = 4;

    // Setup logging function.
    if (typeof this.logLevel !== "number" || ![10, 20, 30, 40, 50].includes(this.logLevel)) {
        if (this.logLevel !== undefined) {
            this.log.warn("Log level should be a specific number (10, 20, 30, 40, or 50). Defaulting to 30.");
        }
        this.logLevel = 30;
    }

    // Check for credentials.
    if (!this.username || !this.password) {
        this.logMessage("Missing required username or password in configuration.", 10);
        return;
    }

    // Create a new Pulse instance.
    this.theAlarm = new Pulse({
        "username": this.username,
        "password": this.password,
        "debug": (this.logLevel === 40),
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
            that.logMessage("Cached accessories loaded...", 30);

            that.portalSync();
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

    // Update the name to remove round brackets.
    accessory.displayName = accessory.displayName.replace(/[()]/gi, "");

    // Get accessory information.
    let name      = accessory.displayName;
    let id        = accessory.context.id;
    let type      = accessory.context.type;
    let lastState = accessory.context.lastState;

    this.logMessage(`Configuring cached accessory... ${name} (${id})`, 30);
    this.logMessage(accessory, 40);

    // Accessory is always reachable.
    accessory.updateReachability(true);

    // When "Identify Accessory" is tapped.
    accessory.on("identify", function (paired, callback) {
        that.logMessage(`Identifying accessory... ${name} (${id})`, 30);
        callback();
    });

    switch (type) {
        case "system":
            accessory.getService(Service.SecuritySystem)
                .getCharacteristic(Characteristic.SecuritySystemTargetState)
                .on("get", (callback) => {
                    let status = this.getDeviceStatus("configure", accessory, id, name, lastState);

                    that.logMessage(`Getting ${name} (${id}) target status... ${status}`, 50);

                    callback(null, status);
                })
                .on("set", (state, callback) => {
                    this.setDeviceStatus(accessory, state, callback);
                });

            accessory.getService(Service.SecuritySystem)
                .getCharacteristic(Characteristic.SecuritySystemCurrentState)
                .on("get", (callback) => {
                    let status = this.getDeviceStatus("configure", accessory, id, name, lastState);

                    that.logMessage(`Getting ${name} (${id}) current status... ${status}`, 50);

                    callback(null, status);
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

                    that.logMessage(`Getting ${name} (${id}) status... ${status}`, 50);

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

                    that.logMessage(`Getting ${name} (${id}) status... ${status}`, 50);

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

                    that.logMessage(`Getting ${name} (${id}) status... ${status}`, 50);

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

                    that.logMessage(`Getting ${name} (${id}) status... ${status}`, 50);

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

                    that.logMessage(`Getting ${name} (${id}) status... ${status}`, 50);

                    callback(null, status);
                });
            break;
        default:
            this.logMessage(`Invalid or unsupported accessory... ${type}`, 10);
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
        this.logMessage(`Adding new accessory... ${name}`, 30);

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
                        let status = this.getDeviceStatus("add", newAccessory, id, name, state);

                        that.logMessage(`Getting ${name} (${id}) target status... ${status}`, 50);

                        callback(null, status);
                    })
                    .on("set", (state, callback) => {
                        this.setDeviceStatus(newAccessory, state, callback);
                    });

                newAccessory.getService(Service.SecuritySystem)
                    .getCharacteristic(Characteristic.SecuritySystemCurrentState)
                    .on("get", (callback) => {
                        let status = this.getDeviceStatus("add", newAccessory, id, name, state);

                        that.logMessage(`Getting ${name} (${id}) current status... ${status}`, 50);

                        callback(null, status);
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

                        that.logMessage(`Getting ${name} (${id}) status... ${status}`, 50);

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

                        that.logMessage(`Getting ${name} (${id}) status... ${status}`, 50);

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

                        that.logMessage(`Getting ${name} (${id}) status... ${status}`, 50);

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

                        that.logMessage(`Getting ${name} (${id}) status... ${status}`, 50);

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

                        that.logMessage(`Getting ${name} (${id}) status... ${status}`, 50);

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

            // Set accessory information.
            newAccessory.getService(Service.AccessoryInformation)
                .setCharacteristic(Characteristic.Manufacturer, make)
                .setCharacteristic(Characteristic.SerialNumber, id)
                .setCharacteristic(Characteristic.Model, model);

            // When "Identify Accessory" is tapped.
            newAccessory.on("identify", function (paired, callback) {
                that.logMessage(`Identifying accessory... ${newAccessory.displayName} (${id})`, 30);
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
            this.logMessage(`Invalid or unsupported accessory... ${type}`, 10);
        }
    } else {
        this.logMessage(`Skipping duplicate accessory... ${uuid}`, 20);
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
        let deviceName   = _.get(accessory, "name", "").replace(/[()]/gi, "");
        let deviceMake   = _.get(accessory, "make");
        let deviceType   = _.get(accessory, "type");
        let deviceState  = _.get(accessory, "state");
        let deviceStatus = _.get(accessory, "status");

        let deviceModel   = deviceType.substr(deviceType.indexOf("-") + 2);
        let deviceSummary = `"${deviceState}" / "${deviceStatus}"`.toLowerCase();

        let deviceUUID   = UUIDGen.generate("system-1");
        let deviceLoaded = _.find(this.accessories, ["UUID", deviceUUID]);

        this.logMessage("Preparing to add device accessory...", 40);
        this.logMessage(accessory, 40);

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
        let zoneName  = _.get(accessory, "name", "").replace(/[()]/gi, "");
        let zoneId    = _.get(accessory, "id");
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

        this.logMessage("Preparing to add zone accessory...", 40);
        this.logMessage(accessory, 40);

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
        this.logMessage(`Skipping unknown ${type} accessory...`, 10);
        this.logMessage(accessory, 40);
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
 * Sync with portal.
 *
 * Retrieve latest status, add/remove accessories.
 */
ADTPulsePlatform.prototype.portalSync = function () {
    clearTimeout(this.syncing);

    // Begin portal sync.
    if (this.isSyncing !== true) {
        this.isSyncing = true;

        this.logMessage("Synchronizing with ADT Pulse Web Portal...", 40);

        this.theAlarm
            .login()
            .then((response) => {
                let version          = _.get(response, "info.version", undefined);
                let supportedVersion = "16.0.0-131";

                if (version !== undefined && version !== supportedVersion && version !== this.sessionVersion) {
                    this.logMessage(`Web Portal version ${version} does not match ${supportedVersion}.`, 20);
                }

                // Bind version to session so message doesn't keep showing up.
                this.sessionVersion = version;
            })
            .then(() => this.theAlarm.performPortalSync())
            .then(async (syncCode) => {
                let theSyncCode = _.get(syncCode, "info.syncCode");

                // Runs if status changes.
                if (theSyncCode !== this.lastSyncCode || theSyncCode === "1-0-0") {
                    this.logMessage(`New sync code is ${theSyncCode}`, 40);

                    // Update accessory status.
                    await this.theAlarm
                        .getDeviceStatus()
                        .then(async (device) => {
                            let deviceInfo   = _.get(device, "info");
                            let deviceUUID   = UUIDGen.generate("system-1");
                            let deviceLoaded = _.find(this.accessories, ["UUID", deviceUUID]);

                            // Set latest status into instance.
                            this.deviceStatus = deviceInfo;

                            // Add or update device.
                            if (deviceLoaded === undefined) {
                                await this.prepareAddAccessory("device", deviceInfo);
                            } else {
                                this.devicePolling("system", "system-1");
                            }
                        })
                        .then(() => this.theAlarm.getZoneStatus())
                        .then((zones) => {
                            let zonesInfo = _.get(zones, "info");

                            // Set latest status into instance.
                            this.zoneStatus = zonesInfo;

                            _.forEach(zonesInfo, async (zone) => {
                                let zoneId       = _.get(zone, "id");
                                let zoneTags     = _.get(zone, "tags");
                                let zoneType     = zoneTags.substr(zoneTags.indexOf(",") + 1);
                                let deviceUUID   = UUIDGen.generate(zoneId);
                                let deviceLoaded = _.find(this.accessories, ["UUID", deviceUUID]);

                                // Add or update zone.
                                if (deviceLoaded === undefined) {
                                    await this.prepareAddAccessory("zone", zone);
                                } else {
                                    this.devicePolling(zoneType, zoneId);
                                }
                            });
                        })
                        .catch((error) => {
                            let action = _.get(error, "action");

                            switch (action) {
                                case "GET_DEVICE_INFO":
                                    this.logMessage("Get device information failed.", 10);
                                    break;
                                case "GET_DEVICE_STATUS":
                                    this.logMessage("Get device status failed.", 10);
                                    break;
                                case "GET_ZONE_STATUS":
                                    this.logMessage("Get zone status failed.", 10);
                                    break;
                                case "HOST_UNREACHABLE":
                                    this.logMessage("Internet disconnected or portal unreachable.", 10);
                                    break;
                                default:
                                    this.logMessage(`Action failed on ${action}.`, 10);
                                    break;
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
                let action = _.get(error, "action");

                switch (action) {
                    case "LOGIN":
                        this.failedLoginTimes++;

                        if (this.failedLoginTimes > 1) {
                            this.logMessage("Login failed more than once. Portal sync terminated.", 10);
                        } else {
                            this.logMessage("Login failed. Trying again.", 20);
                        }
                        break;
                    case "SYNC":
                        this.logMessage("Portal sync failed. Attempting to fix connection...", 40);
                        break;
                    case "HOST_UNREACHABLE":
                        this.logMessage("Internet disconnected or portal unreachable.", 10);
                        break;
                    default:
                        this.logMessage(`Action failed on ${action}.`, 10);
                        break;
                }

                this.isSyncing = false;
            });
    } else {
        this.logMessage("Portal sync is already in progress...", 40);
    }

    // Force platform to retrieve latest status.
    if (!(this.failedLoginTimes > 1)) {
        this.syncing = setTimeout(
            () => {
                this.portalSync();
            },
            this.syncInterval * 1000
        );
    }
};

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

    if (accessory !== undefined) {
        this.logMessage(`Polling device status for ${accessory.displayName}...`, 50);

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
                this.logMessage(`Invalid or unsupported accessory... ${type}`, 10);
                break;
        }
    }
};

/**
 * Get device status.
 *
 * @param {string} mode      - Can be "add" or "configure".
 * @param {Object} accessory - The accessory.
 * @param {string} id        - The accessory unique identification code.
 * @param {string} name      - The name of the accessory.
 * @param {string} summary   - The last known summary of the accessory.
 *
 * @returns {null|number}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.getDeviceStatus = function (mode, accessory, id, name, summary) {
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
            this.logMessage(`Unknown mode ${mode}.`, 10);
            break;
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
    let arm_away         = lowerCaseSummary.includes("armed away");
    let arm_stay         = lowerCaseSummary.includes("armed stay");
    let uncleared_alarm  = lowerCaseSummary.includes("uncleared alarm");
    let disarmed         = lowerCaseSummary.includes("disarmed");

    if (alarm) {
        status = Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED;
    } else if (arm_away) {
        status = Characteristic.SecuritySystemCurrentState.AWAY_ARM;
    } else if (arm_stay) {
        status = Characteristic.SecuritySystemCurrentState.STAY_ARM;
    } else if (uncleared_alarm || disarmed) {
        status = Characteristic.SecuritySystemCurrentState.DISARMED;
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
    const name      = _.get(accessory, "displayName");
    const id        = _.get(accessory, "context.id");
    const lastState = _.get(accessory, "context.lastState", "").toLowerCase();

    this.logMessage(`Setting ${name} (${id}) status to ${arm}...`, 30);
    this.logMessage(`${name} (${id}) last known state is ${lastState}...`, 40);

    // Setting device status.
    this.theAlarm
        .login()
        .then(async () => {
            // Check if Disarmed, Armed Away, or Armed Stay.
            if (lastState.includes("disarmed")) {
                this.logMessage(`${name} (${id}) is currently disarmed...`, 40);

                // Clear the alarms first.
                if (lastState.includes("uncleared alarm")) {
                    this.logMessage(`Clearing the ${name} (${id}) alarm...`, 40);

                    await this.theAlarm.setDeviceStatus("disarmed+with+alarm", "off");
                } else if (lastState.includes("alarm")) {
                    this.logMessage(`Disarming and clearing the ${name} (${id}) alarm...`, 40);

                    await this.theAlarm.setDeviceStatus("disarmed", "off");
                    await this.theAlarm.setDeviceStatus("disarmed+with+alarm", "off");
                }

                switch (arm) {
                    case Characteristic.SecuritySystemTargetState.STAY_ARM:
                        this.logMessage(`Arming the ${name} (${id}) to stay...`, 40);

                        await this.theAlarm.setDeviceStatus("disarmed", "stay");
                        break;
                    case Characteristic.SecuritySystemTargetState.AWAY_ARM:
                        this.logMessage(`Arming the ${name} (${id}) to away...`, 40);

                        await this.theAlarm.setDeviceStatus("disarmed", "away");
                        break;
                    case Characteristic.SecuritySystemTargetState.NIGHT_ARM:
                        this.logMessage("ADT Pulse does not support night mode. Arming stay instead.", 20);
                        this.logMessage(`Arming the ${name} (${id}) to stay...`, 40);

                        await this.theAlarm.setDeviceStatus("disarmed", "stay");
                        break;
                    case Characteristic.SecuritySystemTargetState.DISARM:
                        this.logMessage(`Arming the ${name} (${id}) to disarmed...`, 40);
                        this.logMessage("Already Disarmed. Cannot disarm again.", 10);
                        break;
                    default:
                        this.logMessage(`Unknown arm status ${arm}...`, 10);
                        break;
                }
            } else if (lastState.includes("armed away")) {
                this.logMessage(`${name} (${id}) is currently armed away...`, 40);

                // Clear the alarms first.
                if (lastState.includes("uncleared alarm")) {
                    this.logMessage(`Clearing the ${name} (${id}) alarm...`, 40);

                    await this.theAlarm.setDeviceStatus("disarmed+with+alarm", "off");
                } else if (lastState.includes("alarm")) {
                    this.logMessage(`Disarming and clearing the ${name} (${id}) alarm...`, 40);

                    await this.theAlarm.setDeviceStatus("away", "off");
                    await this.theAlarm.setDeviceStatus("disarmed+with+alarm", "off");
                }

                switch (arm) {
                    case Characteristic.SecuritySystemTargetState.STAY_ARM:
                        this.logMessage(`Arming the ${name} (${id}) to stay...`, 40);

                        await this.theAlarm.setDeviceStatus("away", "off");
                        await this.theAlarm.setDeviceStatus("disarmed", "stay");
                        break;
                    case Characteristic.SecuritySystemTargetState.AWAY_ARM:
                        this.logMessage(`Arming the ${name} (${id}) to away...`, 40);
                        this.logMessage("Already Armed Away. Cannot arm away again.", 10);
                        break;
                    case Characteristic.SecuritySystemTargetState.NIGHT_ARM:
                        this.logMessage("ADT Pulse does not support night mode. Arming stay instead.", 20);
                        this.logMessage(`Arming the ${name} (${id}) to stay...`, 40);

                        await this.theAlarm.setDeviceStatus("away", "off");
                        await this.theAlarm.setDeviceStatus("disarmed", "stay");
                        break;
                    case Characteristic.SecuritySystemTargetState.DISARM:
                        this.logMessage(`Arming the ${name} (${id}) to disarmed...`, 40);

                        await this.theAlarm.setDeviceStatus("away", "off");
                        break;
                    default:
                        this.logMessage(`Unknown arm status ${arm}...`, 10);
                        break;
                }
            } else if (lastState.includes("armed stay")) {
                this.logMessage(`${name} (${id}) is currently armed stay...`, 40);

                // Clear the alarms first.
                if (lastState.includes("uncleared alarm")) {
                    this.logMessage(`Clearing the ${name} (${id}) alarm...`, 40);

                    await this.theAlarm.setDeviceStatus("disarmed+with+alarm", "off");
                } else if (lastState.includes("alarm")) {
                    this.logMessage(`Disarming and clearing the ${name} (${id}) alarm...`, 40);

                    await this.theAlarm.setDeviceStatus("stay", "off");
                    await this.theAlarm.setDeviceStatus("disarmed+with+alarm", "off");
                }

                switch (arm) {
                    case Characteristic.SecuritySystemTargetState.STAY_ARM:
                        this.logMessage(`Arming the ${name} (${id}) to stay...`, 40);
                        this.logMessage("Already Armed Stay. Cannot arm stay again.", 10);
                        break;
                    case Characteristic.SecuritySystemTargetState.AWAY_ARM:
                        this.logMessage(`Arming the ${name} (${id}) to away...`, 40);

                        await this.theAlarm.setDeviceStatus("stay", "off");
                        await this.theAlarm.setDeviceStatus("disarmed", "away");
                        break;
                    case Characteristic.SecuritySystemTargetState.NIGHT_ARM:
                        this.logMessage("ADT Pulse does not support night mode. Arming stay instead.", 20);
                        this.logMessage("Already Armed Stay. Cannot arm stay again.", 10);
                        break;
                    case Characteristic.SecuritySystemTargetState.DISARM:
                        this.logMessage(`Arming the ${name} (${id}) to disarmed...`, 40);

                        await this.theAlarm.setDeviceStatus("stay", "off");
                        break;
                    default:
                        this.logMessage(`Unknown arm status ${arm}...`, 10);
                        break;
                }
            } else {
                throw "lastState throw: " + lastState;
            }
        })
        .then(() => {
            let armString = arm.toString();
            accessory.getService(Service.SecuritySystem).setCharacteristic(Characteristic.SecuritySystemCurrentState, armString);

            setTimeout(() => {
                callback(null);
            }, this.syncInterval * 1000);
        })
        .catch((error) => {
            let action = _.get(error, "action");

            switch (action) {
                case "SET_DEVICE_STATUS":
                    this.logMessage("Set device status failed.", 10);
                    break;
                case "HOST_UNREACHABLE":
                    this.logMessage("Internet disconnected or portal unreachable.", 10);
                    break;
                default:
                    this.logMessage(`Action failed on ${action}.`, 10);
                    break;
            }

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
            } else if (state === "devStatMotion" || state === "devStatTamper") {
                // Motion detected.
                status = true;
            }
            break;
        case "co":
            if (state === "devStatOK") {
                status = Characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL;
            } else if (state === "devStatAlarm" || state === "devStatTamper") {
                status = Characteristic.CarbonMonoxideDetected.CO_LEVELS_ABNORMAL;
            }
            break;
        case "fire":
            if (state === "devStatOK") {
                status = Characteristic.SmokeDetected.SMOKE_NOT_DETECTED;
            } else if (state === "devStatAlarm" || state === "devStatTamper") {
                status = Characteristic.SmokeDetected.SMOKE_DETECTED;
            }
            break;
        default:
            status = null;
            this.logMessage(`Unknown type ${type} with state "${state}".`, 10);
            break;
    }

    return status;
};

/**
 * Log message.
 *
 * Manages the messages that will be recorded in the logs.
 *
 * @param {string|Object} content  - The message or content being recorded into the logs.
 * @param {number} priority - 10 (error), 20 (warn), 30 (info), 40 (debug), 50 (verbose).
 */
ADTPulsePlatform.prototype.logMessage = function (content, priority) {
    let logLevel = this.logLevel;
    let log      = this.log;

    if (logLevel >= priority) {
        // Messages won't be logged if not within specs.
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
                log(content);
                break;
        }
    }
};
