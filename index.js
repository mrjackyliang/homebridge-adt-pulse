/**
 * ADT Pulse Homebridge Plugin.
 *
 * @since 1.0.0
 */
const _     = require("lodash");
const Pulse = require("./adt-pulse");

let Accessory,
    Service,
    Characteristic,
    UUIDGen;

/**
 * Register the platform plugin.
 *
 * @param {Object} homebridge - Homebridge API.
 *
 * @since 1.0.0
 */
module.exports = function (homebridge) {
    Accessory      = homebridge.platformAccessory;
    Service        = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen        = homebridge.hap.uuid;

    // Register the platform into Homebridge.
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
 * @param {Logger} log    - Homebridge log function.
 * @param {Object} config - Platform plugin configuration from "config.json".
 * @param {Object} api    - Homebridge API. Null for older versions.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function ADTPulsePlatform(log, config, api) {
    this.log    = log;
    this.config = config;

    // Where the security panel and sensors are held.
    this.accessories  = [];
    this.deviceStatus = [];
    this.zoneStatus   = [];

    // Prevent account lockout.
    this.failedLoginTimes = 0;

    // Keeps track of device updates.
    this.lastSyncCode      = "1-0-0";
    this.portalSyncSession = undefined;
    this.isSyncing         = false;

    // Session data.
    this.sessionVersion = "";

    // Credentials could be null.
    this.username = _.get(this.config, "username");
    this.password = _.get(this.config, "password");
    this.logLevel = _.get(this.config, "logLevel");

    // Timers.
    this.syncInterval     = 3;
    this.setDeviceTimeout = 8;

    // Check for credentials.
    if (!this.username || !this.password) {
        this.logMessage("Missing required username or password in configuration.", 10);
        return;
    }

    // Setup logging function.
    if (typeof this.logLevel !== "number" || ![10, 20, 30, 40, 50].includes(this.logLevel)) {
        if (this.logLevel !== undefined) {
            this.log.warn("Log level should be a specific number (10, 20, 30, 40, or 50). Defaulting to 30.");
        }
        this.logLevel = 30;
    }

    // Initialize main script.
    this.pulse = new Pulse({
        "username": this.username,
        "password": this.password,
        "debug": (this.logLevel >= 40),
    });

    if (api) {
        // Register new accessories via this object.
        this.api = api;

        // Start portal sync.
        this.api.on("didFinishLaunching", () => {
            this.portalSync();
        });
    }
}

/**
 * Restore cached accessories.
 *
 * @param {Object} accessory - The accessory.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.configureAccessory = function (accessory) {
    const name      = _.get(accessory, "displayName");
    const id        = _.get(accessory, "context.id");
    const type      = _.get(accessory, "context.type");
    const lastState = _.get(accessory, "context.lastState");

    this.logMessage(`Configuring cached accessory... ${name} (${id})`, 30);
    this.logMessage(accessory, 40);

    // Always reachable.
    accessory.updateReachability(true);

    // When "Identify Accessory" is tapped.
    accessory.on("identify", (paired, callback) => {
        this.logMessage(`Identifying cached accessory... ${name} (${id})`, 30);
        callback(null, paired);
    });

    switch (type) {
        case "system":
            accessory
                .getService(Service.SecuritySystem)
                .getCharacteristic(Characteristic.SecuritySystemTargetState)
                .on("get", callback => this.getDeviceAccessory("configure", "target", id, name, accessory, lastState, callback))
                .on("set", (state, callback) => {
                    this.setDeviceStatus(accessory, state);

                    setTimeout(() => {
                        callback(null, state);
                    }, this.setDeviceTimeout * 1000);
                });

            accessory
                .getService(Service.SecuritySystem)
                .getCharacteristic(Characteristic.SecuritySystemCurrentState)
                .on("get", callback => this.getDeviceAccessory("configure", "current", id, name, accessory, lastState, callback));
            break;
        case "doorWindow":
            accessory
                .getService(Service.ContactSensor)
                .getCharacteristic(Characteristic.ContactSensorState)
                .on("get", callback => this.getZoneAccessory("configure", type, id, name, accessory, lastState, callback));
            break;
        case "glass":
            // HAP does not support tamper sensors yet, so I will use motion since the interface is similar.
            accessory
                .getService(Service.MotionSensor)
                .getCharacteristic(Characteristic.MotionDetected)
                .on("get", callback => this.getZoneAccessory("configure", type, id, name, accessory, lastState, callback));
            break;
        case "motion":
            accessory
                .getService(Service.MotionSensor)
                .getCharacteristic(Characteristic.MotionDetected)
                .on("get", callback => this.getZoneAccessory("configure", type, id, name, accessory, lastState, callback));
            break;
        case "co":
            accessory
                .getService(Service.CarbonMonoxideSensor)
                .getCharacteristic(Characteristic.CarbonMonoxideDetected)
                .on("get", callback => this.getZoneAccessory("configure", type, id, name, accessory, lastState, callback));
            break;
        case "fire":
            accessory
                .getService(Service.SmokeSensor)
                .getCharacteristic(Characteristic.SmokeDetected)
                .on("get", callback => this.getZoneAccessory("configure", type, id, name, accessory, lastState, callback));
            break;
        default:
            this.logMessage(`Failed to configure invalid or unsupported accessory... ${type}`, 10);
            break;
    }

    this.accessories.push(accessory);
};

/**
 * Add accessory.
 *
 * @param {string} type  - Can be "system", "doorWindow", "glass", "motion", "co", or "fire".
 * @param {string} id    - The accessory unique identification code.
 * @param {string} name  - The name of the accessory.
 * @param {string} make  - The manufacturer of the accessory.
 * @param {string} model - The model of the accessory.
 * @param {string} zone  - The zone of the accessory.
 * @param {string} state - The last known state of the accessory.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.addAccessory = function (type, id, name, make, model, zone, state) {
    const uuid            = UUIDGen.generate(id);
    const accessoryLoaded = _.find(this.accessories, ["UUID", uuid]);

    // Add new accessories only.
    if (accessoryLoaded === undefined) {
        this.logMessage(`Adding new accessory... ${name} (${id})`, 30);

        let accessory      = new Accessory(name, uuid);
        let validAccessory = true;

        switch (type) {
            case "system":
                accessory.addService(Service.SecuritySystem, name);

                accessory
                    .getService(Service.SecuritySystem)
                    .getCharacteristic(Characteristic.SecuritySystemTargetState)
                    .on("get", callback => this.getDeviceAccessory("add", "target", id, name, accessory, state, callback))
                    .on("set", (state, callback) => {
                        this.setDeviceStatus(accessory, state);

                        setTimeout(() => {
                            callback(null, state);
                        }, this.setDeviceTimeout * 1000);
                    });

                accessory
                    .getService(Service.SecuritySystem)
                    .getCharacteristic(Characteristic.SecuritySystemCurrentState)
                    .on("get", callback => this.getDeviceAccessory("add", "current", id, name, accessory, state, callback));
                break;
            case "doorWindow":
                accessory
                    .addService(Service.ContactSensor, name)
                    .getCharacteristic(Characteristic.ContactSensorState)
                    .on("get", callback => this.getZoneAccessory("add", type, id, name, accessory, state, callback));
                break;
            case "glass":
                // HAP does not support tamper sensors, so motion will be used since the interface is similar.
                accessory
                    .addService(Service.MotionSensor, name)
                    .getCharacteristic(Characteristic.MotionDetected)
                    .on("get", callback => this.getZoneAccessory("add", type, id, name, accessory, state, callback));
                break;
            case "motion":
                accessory
                    .addService(Service.MotionSensor, name)
                    .getCharacteristic(Characteristic.MotionDetected)
                    .on("get", callback => this.getZoneAccessory("add", type, id, name, accessory, state, callback));
                break;
            case "co":
                accessory
                    .addService(Service.CarbonMonoxideSensor, name)
                    .getCharacteristic(Characteristic.CarbonMonoxideDetected)
                    .on("get", callback => this.getZoneAccessory("add", type, id, name, accessory, state, callback));
                break;
            case "fire":
                accessory
                    .addService(Service.SmokeSensor, name)
                    .getCharacteristic(Characteristic.SmokeDetected)
                    .on("get", callback => this.getZoneAccessory("add", type, id, name, accessory, state, callback));
                break;
            default:
                validAccessory = false;
                break;
        }

        if (validAccessory) {
            // Set accessory context.
            _.set(accessory, "context.id", id);
            _.set(accessory, "context.type", type);

            // Always reachable.
            accessory.updateReachability(true);

            // Set accessory information.
            accessory
                .getService(Service.AccessoryInformation)
                .setCharacteristic(Characteristic.Manufacturer, make)
                .setCharacteristic(Characteristic.SerialNumber, (zone) ? `${id} (${zone})` : id)
                .setCharacteristic(Characteristic.Model, model);

            // When "Identify Accessory" is tapped.
            accessory.on("identify", (paired, callback) => {
                this.logMessage(`Identifying new accessory... ${accessory.displayName} (${id})`, 30);
                callback(null, paired);
            });

            // Make accessory active.
            this.accessories.push(accessory);

            // Save accessory to database.
            this.api.registerPlatformAccessories(
                "homebridge-adt-pulse",
                "ADTPulse",
                [accessory]
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
 * @param {Object} accessory - The accessory.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.prepareAddAccessory = function (type, accessory) {
    if (type === "device") {
        const deviceName   = _.get(accessory, "name", "").replace(/[()]/gi, "");
        const deviceMake   = _.get(accessory, "make");
        const deviceType   = _.get(accessory, "type");
        const deviceState  = _.get(accessory, "state");
        const deviceStatus = _.get(accessory, "status");

        const deviceKind    = "system";
        const deviceModel   = deviceType.substr(deviceType.indexOf("-") + 2);
        const deviceSummary = `"${deviceState}" / "${deviceStatus}"`.toLowerCase();

        const deviceId     = "system-1";
        const deviceUUID   = UUIDGen.generate(deviceId);
        const deviceLoaded = _.find(this.accessories, ["UUID", deviceUUID]);

        this.logMessage(`Preparing to add device (${deviceId}) accessory...`, 30);
        this.logMessage(accessory, 40);

        if (deviceLoaded === undefined) {
            this.addAccessory(
                deviceKind,
                deviceId,
                deviceName,
                deviceMake,
                deviceModel,
                undefined,
                deviceSummary
            );
        }
    } else if (type === "zone") {
        const zoneId    = _.get(accessory, "id");
        const zoneName  = _.get(accessory, "name", "").replace(/[()]/gi, "");
        const zoneTags  = _.get(accessory, "tags");
        const zoneIndex = _.get(accessory, "index");
        const zoneState = _.get(accessory, "state");

        const zoneMake = "ADT";
        const zoneKind = zoneTags.substr(zoneTags.indexOf(",") + 1);
        const zoneArea = zoneIndex.replace(/((E?)([1-9]{1,2}))((VER)([1-9]+))/g, "$3");

        const zoneUUID   = UUIDGen.generate(zoneId);
        const zoneLoaded = _.find(this.accessories, ["UUID", zoneUUID]);

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

        this.logMessage(`Preparing to add zone (${zoneId}) accessory...`, 30);
        this.logMessage(accessory, 40);

        if (zoneLoaded === undefined) {
            this.addAccessory(
                zoneKind,
                zoneId,
                zoneName,
                zoneMake,
                zoneModel,
                zoneArea,
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
 * @param {Object} accessory - The accessory.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.removeAccessory = function (accessory) {
    const name    = _.get(accessory, "displayName");
    const id      = _.get(accessory, "context.id");
    const removed = _.remove(this.accessories, ["UUID", accessory.UUID]);

    this.logMessage(`Removing obsolete accessory... ${name} (${id})`, 30);
    this.logMessage(removed, 40);

    // Unregister accessory.
    this.api.unregisterPlatformAccessories(
        "homebridge-adt-pulse",
        "ADTPulse",
        [accessory]
    );
};

/**
 * Get device accessory.
 *
 * @param {string}   mode      - Can be "add" or "configure".
 * @param {string}   type      - Can be "target" or "current".
 * @param {string}   id        - The accessory unique identification code.
 * @param {string}   name      - The name of the accessory.
 * @param {Object}   accessory - The accessory.
 * @param {string}   summary   - The last known summary of the accessory.
 * @param {function} callback  - Homebridge callback function.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.getDeviceAccessory = function (mode, type, id, name, accessory, summary, callback) {
    const lastState = _.get(accessory, "context.lastState");

    let status = this.getDeviceStatus(true);

    switch (mode) {
        case "configure":
            if (status === undefined && lastState.includes("undefined")) {
                status = this.formatGetDeviceStatus(summary);
            } else if (status === undefined) {
                status = this.formatGetDeviceStatus(lastState);
            } else {
                _.set(accessory, "context.lastState", this.getDeviceStatus(false));
            }
            break;
        case "add":
            if (status === undefined) {
                status = this.formatGetDeviceStatus(summary);
            }

            _.set(accessory, "context.lastState", summary);
            break;
        default:
            this.logMessage(`Unknown mode ${mode}.`, 10);
            break;
    }

    this.logMessage(`Getting ${name} (${id}) ${type} status... ${status}`, 50);

    callback(null, status);
};

/**
 * Get zone accessory.
 *
 * @param {string}   mode      - Can be "add" or "configure".
 * @param {string}   type      - Can be "doorWindow", "glass", "motion", "co", or "fire".
 * @param {string}   id        - The accessory unique identification code.
 * @param {string}   name      - The name of the accessory.
 * @param {Object}   accessory - The accessory.
 * @param {string}   state     - The last known state of the accessory.
 * @param {function} callback  - Homebridge callback function.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.getZoneAccessory = function (mode, type, id, name, accessory, state, callback) {
    const lastState = _.get(accessory, "context.lastState");

    let status = this.getZoneStatus(type, id, true);

    switch (mode) {
        case "configure":
            if (status === undefined && lastState === undefined) {
                status = this.formatGetZoneStatus(type, state);
            } else if (status === undefined) {
                status = this.formatGetZoneStatus(type, lastState);
            } else {
                _.set(accessory, "context.lastState", this.getZoneStatus(type, id, false));
            }
            break;
        case "add":
            if (status === undefined) {
                status = this.formatGetZoneStatus(type, state);
            }

            _.set(accessory, "context.lastState", state);
            break;
        default:
            this.logMessage(`Unknown mode ${mode}.`, 10);
            break;
    }

    this.logMessage(`Getting ${name} (${id}) status... ${status}`, 50);

    callback(null, status);
};

/**
 * Sync with web portal.
 *
 * Retrieve latest status, add/remove accessories.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.portalSync = function () {
    clearTimeout(this.portalSyncSession);

    // Begin portal sync.
    if (this.isSyncing !== true) {
        this.isSyncing = true;

        this.logMessage("Synchronizing with ADT Pulse Web Portal...", 40);

        this.pulse
            .login()
            .then(response => {
                const version          = _.get(response, "info.version");
                const supportedVersion = ["17.0.0-69", "17.0.0-71"];

                if (version !== undefined && !supportedVersion.includes(version) && version !== this.sessionVersion) {
                    this.logMessage(`Web Portal version ${version} does not match ${supportedVersion.join(" or ")}.`, 20);
                }

                // Bind version to session so message does not bombard logs.
                this.sessionVersion = version;
            })
            .then(() => this.pulse.performPortalSync())
            .then(async syncCode => {
                const theSyncCode = _.get(syncCode, "info.syncCode");

                // Runs if status changes.
                if (theSyncCode !== this.lastSyncCode || theSyncCode === "1-0-0") {
                    this.logMessage(`New sync code is ${theSyncCode}`, 40);

                    // Add or update accessories.
                    await this.pulse
                        .getDeviceStatus()
                        .then(async device => {
                            const deviceStatus = _.get(device, "info");

                            const deviceUUID   = UUIDGen.generate("system-1");
                            const deviceLoaded = _.find(this.accessories, ["UUID", deviceUUID]);

                            // Set latest status into instance.
                            this.deviceStatus = deviceStatus;

                            // Add or update device.
                            if (deviceLoaded === undefined) {
                                await this.pulse.getDeviceInformation()
                                    .then(async device => {
                                        const deviceInfo       = _.get(device, "info");
                                        const deviceInfoStatus = _.merge(deviceInfo, deviceStatus);

                                        await this.prepareAddAccessory("device", deviceInfoStatus);
                                    })
                                    .catch(error => this.catchErrors(error))
                            } else {
                                this.devicePolling("system", "system-1");
                            }
                        })
                        .then(() => this.pulse.getZoneStatus())
                        .then(zones => {
                            const zoneStatus = _.get(zones, "info");

                            // Set latest status into instance.
                            this.zoneStatus = zoneStatus;

                            _.forEach(zoneStatus, async zone => {
                                const zoneId   = _.get(zone, "id");
                                const zoneTags = _.get(zone, "tags");

                                const zoneType = zoneTags.substr(zoneTags.indexOf(",") + 1);

                                const deviceUUID   = UUIDGen.generate(zoneId);
                                const deviceLoaded = _.find(this.accessories, ["UUID", deviceUUID]);

                                // Add or update zone.
                                if (deviceLoaded === undefined) {
                                    await this.prepareAddAccessory("zone", zone);
                                } else {
                                    this.devicePolling(zoneType, zoneId);
                                }
                            });
                        })
                        .catch(error => this.catchErrors(error));

                    // Remove obsolete zones.
                    _.forEach(this.accessories, async accessory => {
                        const id   = await _.get(accessory, "context.id");
                        const type = await _.get(accessory, "context.type");
                        const zone = _.find(this.zoneStatus, {"id": id});

                        // Do not remove security panel(s).
                        if (zone === undefined && type !== "system") {
                            await this.removeAccessory(accessory);
                        }
                    });

                    // Update sync code.
                    this.lastSyncCode = theSyncCode;
                }
            })
            .then(() => {
                this.isSyncing = false;
            })
            .catch(error => {
                this.catchErrors(error);

                this.isSyncing = false;
            });
    } else {
        this.logMessage("Portal sync is already in progress...", 40);
    }

    // Force platform to retrieve latest status.
    if (!(this.failedLoginTimes >= 3)) {
        this.portalSyncSession = setTimeout(
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
 * @param {string} type - Can be "system", "doorWindow", "glass", "motion", "co", or "fire".
 * @param {string} id   - The accessory unique identification code.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.devicePolling = function (type, id) {
    const uuid      = UUIDGen.generate(id);
    const accessory = _.find(this.accessories, ["UUID", uuid]);
    const name      = _.get(accessory, "displayName");

    if (accessory !== undefined) {
        this.logMessage(`Polling device status for ${name} (${id})...`, 50);

        switch (type) {
            case "system":
                accessory
                    .getService(Service.SecuritySystem)
                    .getCharacteristic(Characteristic.SecuritySystemTargetState)
                    .getValue();

                accessory
                    .getService(Service.SecuritySystem)
                    .getCharacteristic(Characteristic.SecuritySystemCurrentState)
                    .getValue();
                break;
            case "doorWindow":
                accessory
                    .getService(Service.ContactSensor)
                    .getCharacteristic(Characteristic.ContactSensorState)
                    .getValue();
                break;
            case "glass":
                accessory
                    .getService(Service.MotionSensor)
                    .getCharacteristic(Characteristic.MotionDetected)
                    .getValue();
                break;
            case "motion":
                accessory
                    .getService(Service.MotionSensor)
                    .getCharacteristic(Characteristic.MotionDetected)
                    .getValue();
                break;
            case "co":
                accessory
                    .getService(Service.CarbonMonoxideSensor)
                    .getCharacteristic(Characteristic.CarbonMonoxideDetected)
                    .getValue();
                break;
            case "fire":
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
 * Get device status.
 *
 * Returns the latest device state and status from "this.deviceStatus" array.
 *
 * @param {boolean} format - Format device status to Homebridge.
 *
 * @returns {(undefined|number|string)}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.getDeviceStatus = function (format) {
    const device  = this.deviceStatus;
    const state   = _.get(device, "state");
    const status  = _.get(device, "status");
    const summary = `"${state}" / "${status}"`.toLowerCase();

    return (format) ? this.formatGetDeviceStatus(summary) : summary;
};

/**
 * Format get device status.
 *
 * Converts the device state and status from ADT Pulse to Homebridge compatible.
 *
 * @param {string} summary - The last known summary of the accessory.
 *
 * @returns {(undefined|number)}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.formatGetDeviceStatus = function (summary) {
    const lowerCaseSummary = summary.toLowerCase();
    const alarm            = lowerCaseSummary.includes("alarm");
    const uncleared_alarm  = lowerCaseSummary.includes("uncleared alarm");
    const disarmed         = lowerCaseSummary.includes("disarmed");
    const arm_away         = lowerCaseSummary.includes("armed away");
    const arm_stay         = lowerCaseSummary.includes("armed stay");
    const arm_night        = lowerCaseSummary.includes("armed night");

    let status = undefined;

    if (alarm && !uncleared_alarm) {
        status = Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED;
    } else if (uncleared_alarm || disarmed) {
        status = Characteristic.SecuritySystemCurrentState.DISARMED;
    } else if (arm_away) {
        status = Characteristic.SecuritySystemCurrentState.AWAY_ARM;
    } else if (arm_stay) {
        status = Characteristic.SecuritySystemCurrentState.STAY_ARM;
    } else if (arm_night) {
        status = Characteristic.SecuritySystemCurrentState.NIGHT_ARM;
    }

    return status;
};

/**
 * Set device status.
 *
 * @param {Object} accessory - The accessory.
 * @param {number} arm       - Defined status to change device to.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.setDeviceStatus = function (accessory, arm) {
    const name      = _.get(accessory, "displayName");
    const id        = _.get(accessory, "context.id");
    const lastState = _.get(accessory, "context.lastState", "").toLowerCase();

    let oldArmState   = this.formatSetDeviceStatus(lastState, "armState");
    const newArmState = this.formatSetDeviceStatus(arm, "arm");

    if (!oldArmState) {
        this.logMessage(`Unknown lastState context ${lastState}...`, 10);
        return;
    }

    this.logMessage(`Setting ${name} (${id}) status from ${oldArmState} to ${newArmState}...`, 30);
    this.logMessage(`Last state for ${name} (${id}) is ${lastState}...`, 40);

    this.pulse
        .login()
        .then(async () => {
            // Attempt to clear the alarms first.
            if (lastState.includes("alarm")) {
                if (["carbon monoxide", "fire", "burglary"].includes(lastState)) {
                    this.logMessage(`Alarm is active! Disarming the ${name} (${id})...`, 20);

                    await this.pulse.setDeviceStatus(oldArmState, "off")
                        .then(response => this.thenResponse(response))
                        .catch(error => this.catchErrors(error));
                }

                this.logMessage(`Alarm is inactive. Clearing the ${name} (${id}) alarm...`, 20);

                // Clear the uncleared alarm.
                await this.pulse.setDeviceStatus("disarmed+with+alarm", "off")
                    .then(response => this.thenResponse(response))
                    .catch(error => this.catchErrors(error));

                // Make sure oldArmState is manually reset.
                oldArmState = "disarmed";

                // If disarm, job is finished.
                if (newArmState === "off") {
                    return;
                }
            }

            // Set the device status.
            if (oldArmState === newArmState || (oldArmState === "disarmed" && newArmState === "off")) {
                this.logMessage(`Already set to ${newArmState}. Cannot set from ${oldArmState} to ${newArmState}.`, 20);
            } else {
                const arm_stay  = Characteristic.SecuritySystemTargetState.STAY_ARM;
                const arm_away  = Characteristic.SecuritySystemTargetState.AWAY_ARM;
                const arm_night = Characteristic.SecuritySystemTargetState.NIGHT_ARM;

                // If device is not disarmed, and you are attempting to arm.
                if (oldArmState !== "disarmed" && [arm_stay, arm_away, arm_night].includes(arm)) {
                    this.logMessage(`Switching arm modes. Disarming ${name} (${id}) first...`, 30);

                    await this.pulse.setDeviceStatus(oldArmState, "off")
                        .then(response => this.thenResponse(response))
                        .catch(error => this.catchErrors(error));

                    // Make sure oldArmState is manually reset.
                    oldArmState = "disarmed";
                }

                await this.pulse.setDeviceStatus(oldArmState, newArmState)
                    .then(response => this.thenResponse(response))
                    .catch(error => this.catchErrors(error));
            }
        })
        .catch(error => this.catchErrors(error));
};

/**
 * Format set device status.
 *
 * @param {(string|number)} status - The device status.
 * @param {string}          type   - Can be "armState" or "arm".
 *
 * @returns {(null|string)}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.formatSetDeviceStatus = function (status, type) {
    let string = null;

    if (type === "armState") {
        if (status.includes("disarmed")) {
            string = "disarmed";
        } else if (status.includes("armed away")) {
            string = "away";
        } else if (status.includes("armed stay")) {
            string = "stay";
        } else if (status.includes("armed night")) {
            string = "night";
        }
    } else if (type === "arm") {
        if (status === 0) {
            string = "stay";
        } else if (status === 1) {
            string = "away";
        } else if (status === 2) {
            string = "night";
        } else if (status === 3) {
            string = "off";
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
 * @returns {(undefined|number|boolean|string)}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.getZoneStatus = function (type, id, format) {
    const zone  = _.find(this.zoneStatus, ["id", id]);
    const state = _.get(zone, "state");

    return (format) ? this.formatGetZoneStatus(type, state) : state;
};

/**
 * Format get zone status.
 *
 * Converts the zone state from ADT Pulse "devStat" icon classes to Homebridge compatible.
 *
 * @param {string} type  - Can be "doorWindow", "glass", "motion", "co", or "fire".
 * @param {string} state - Can be "devStatOK", "devStatOpen", "devStatMotion", "devStatTamper", or "devStatAlarm".
 *
 * @returns {(undefined|number|boolean)}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.formatGetZoneStatus = function (type, state) {
    let status = undefined;

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
                // No glass broken.
                status = false;
            } else if (state === "devStatTamper") {
                // Glass broken.
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
            this.logMessage(`Unknown type ${type} with state "${state}".`, 10);
            break;
    }

    return status;
};

/**
 * Then response (for setDeviceStatus only).
 *
 * @param {Object} response - The response object from setDeviceStatus.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.thenResponse = function (response) {
    const forceArm = _.get(response, "info.forceArm");

    if (forceArm) {
        this.logMessage("Sensor(s) were bypassed when arming. Check the ADT Pulse website or app for more details.", 20);
    }

    if (response) {
        this.logMessage(response, 40);
    }
};

/**
 * Catch errors.
 *
 * @param {Object} error - The error response object.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.catchErrors = function (error) {
    const action      = _.get(error, "action");
    const infoMessage = _.get(error, "info.message");

    let priority;

    switch (action) {
        case "LOGIN":
            if (infoMessage.match(/(Sign In unsuccessful\.)/g)) {
                this.failedLoginTimes++;
            }

            // If login fails twice.
            if (this.failedLoginTimes >= 3) {
                this.logMessage("Login failed more than once. Portal sync terminated.", priority = 10);
            } else {
                this.logMessage("Login failed. Trying again...", priority = 20);
            }
            break;
        case "SYNC":
            this.logMessage("Portal sync failed. Attempting to fix connection...", priority = 40);
            break;
        case "GET_DEVICE_INFO":
            this.logMessage("Get device information failed.", priority = 10);
            break;
        case "GET_DEVICE_STATUS":
            this.logMessage("Get device status failed.", priority = 10);
            break;
        case "GET_ZONE_STATUS":
            this.logMessage("Get zone status failed.", priority = 10);
            break;
        case "SET_DEVICE_STATUS":
            this.logMessage("Set device status failed.", priority = 10);
            break;
        case "HOST_UNREACHABLE":
            this.logMessage("Internet disconnected or portal unreachable. Trying again...", priority = 10);
            break;
        default:
            this.logMessage(`Action failed on ${action}.`, priority = 10);
            break;
    }

    if (infoMessage && priority) {
        this.logMessage(infoMessage, priority);
    }

    if (error) {
        this.logMessage(error, 40);
    }
};

/**
 * Log message.
 *
 * @param {(string|Object)} content  - The message or content being recorded into the logs.
 * @param {number}          priority - 10 (error), 20 (warn), 30 (info), 40 (debug), 50 (verbose).
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.logMessage = function (content, priority) {
    const logLevel = this.logLevel;

    let log = this.log;

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
        }
    }
};
