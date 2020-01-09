/**
 * ADT Pulse Homebridge Plugin.
 *
 * @since 1.0.0
 */
const _     = require("lodash");
const Pulse = require("./main");

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
    this.deviceStatus = {};
    this.zoneStatus   = {};

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
    this.resetAll = _.get(this.config, "resetAll");

    // Timers.
    this.syncInterval     = 3;
    this.setDeviceTimeout = 8;

    // Setup logging function.
    if (typeof this.logLevel !== "number" || ![10, 20, 30, 40, 50].includes(this.logLevel)) {
        if (this.logLevel !== undefined) {
            this.log.warn("\"logLevel\" should be a specific number (10, 20, 30, 40, or 50). Defaulting to 30.");
        }
        this.logLevel = 30;
    }

    // Check for credentials.
    if (!this.username || !this.password) {
        this.logMessage("Missing required username or password in configuration.", 10);
        return;
    }

    // Prevent accidental reset.
    if (typeof this.resetAll !== "boolean") {
        if (this.resetAll !== undefined) {
            this.logMessage("\"resetAll\" setting should be true or false. Defaulting to false.", 20);
        }
        this.resetAll = false;
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

        this.api.on("didFinishLaunching", () => {
            this.logSystemInformation(api);

            if (this.resetAll) {
                this.logMessage("Removing all ADT Pulse accessories from Homebridge...", 20);

                _.forEachRight(this.accessories, accessory => {
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
 * @param {Object} accessory - The accessory.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.configureAccessory = function (accessory) {
    const id   = _.get(accessory, "context.id");
    const name = _.get(accessory, "displayName");
    const type = _.get(accessory, "context.type");

    this.logMessage(`Configuring cached accessory... ${name} (${id})`, 30);
    this.logMessage(accessory, 40);

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
                .on("get", callback => this.getDeviceAccessory("target", id, name, callback))
                .on("set", (state, callback) => this.setDeviceAccessory(id, name, state, callback));

            accessory
                .getService(Service.SecuritySystem)
                .getCharacteristic(Characteristic.SecuritySystemCurrentState)
                .on("get", callback => this.getDeviceAccessory("current", id, name, callback));
            break;
        case "doorWindow":
            accessory
                .getService(Service.ContactSensor)
                .getCharacteristic(Characteristic.ContactSensorState)
                .on("get", callback => this.getZoneAccessory(type, id, name, callback));
            break;
        case "glass":
            accessory
                .getService(Service.OccupancySensor)
                .getCharacteristic(Characteristic.OccupancyDetected)
                .on("get", callback => this.getZoneAccessory(type, id, name, callback));
            break;
        case "motion":
            accessory
                .getService(Service.MotionSensor)
                .getCharacteristic(Characteristic.MotionDetected)
                .on("get", callback => this.getZoneAccessory(type, id, name, callback));
            break;
        case "co":
            accessory
                .getService(Service.CarbonMonoxideSensor)
                .getCharacteristic(Characteristic.CarbonMonoxideDetected)
                .on("get", callback => this.getZoneAccessory(type, id, name, callback));
            break;
        case "fire":
            accessory
                .getService(Service.SmokeSensor)
                .getCharacteristic(Characteristic.SmokeDetected)
                .on("get", callback => this.getZoneAccessory(type, id, name, callback));
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
 * @param {string}             type     - Can be "system", "doorWindow", "glass", "motion", "co", or "fire".
 * @param {string}             id       - The accessory unique identification code.
 * @param {string}             name     - The name of the accessory.
 * @param {string}             make     - The manufacturer of the accessory.
 * @param {string}             model    - The model of the accessory.
 * @param {(undefined|string)} zone     - The zone of the accessory.
 * @param {(undefined|string)} firmware - The firmware revision of the accessory.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.addAccessory = function (type, id, name, make, model, zone, firmware) {
    const uuid            = UUIDGen.generate(id);
    const accessoryLoaded = _.find(this.accessories, ["UUID", uuid]);

    // Add new accessories only.
    if (accessoryLoaded === undefined) {
        this.logMessage(`Adding accessory... ${name} (${id})`, 30);

        let accessory      = new Accessory(name, uuid);
        let validAccessory = true;

        switch (type) {
            case "system":
                accessory.addService(Service.SecuritySystem, name);

                accessory
                    .getService(Service.SecuritySystem)
                    .getCharacteristic(Characteristic.SecuritySystemTargetState)
                    .on("get", callback => this.getDeviceAccessory("target", id, name, callback))
                    .on("set", (state, callback) => this.setDeviceAccessory(id, name, state, callback));

                accessory
                    .getService(Service.SecuritySystem)
                    .getCharacteristic(Characteristic.SecuritySystemCurrentState)
                    .on("get", callback => this.getDeviceAccessory("current", id, name, callback));
                break;
            case "doorWindow":
                accessory
                    .addService(Service.ContactSensor, name)
                    .getCharacteristic(Characteristic.ContactSensorState)
                    .on("get", callback => this.getZoneAccessory(type, id, name, callback));
                break;
            case "glass":
                accessory
                    .addService(Service.OccupancySensor, name)
                    .getCharacteristic(Characteristic.OccupancyDetected)
                    .on("get", callback => this.getZoneAccessory(type, id, name, callback));
                break;
            case "motion":
                accessory
                    .addService(Service.MotionSensor, name)
                    .getCharacteristic(Characteristic.MotionDetected)
                    .on("get", callback => this.getZoneAccessory(type, id, name, callback));
                break;
            case "co":
                accessory
                    .addService(Service.CarbonMonoxideSensor, name)
                    .getCharacteristic(Characteristic.CarbonMonoxideDetected)
                    .on("get", callback => this.getZoneAccessory(type, id, name, callback));
                break;
            case "fire":
                accessory
                    .addService(Service.SmokeSensor, name)
                    .getCharacteristic(Characteristic.SmokeDetected)
                    .on("get", callback => this.getZoneAccessory(type, id, name, callback));
                break;
            default:
                validAccessory = false;
                break;
        }

        if (validAccessory) {
            // Set accessory context.
            _.set(accessory, "context.id", id);
            _.set(accessory, "context.type", type);

            // Set accessory information.
            accessory
                .getService(Service.AccessoryInformation)
                .setCharacteristic(Characteristic.Manufacturer, make)
                .setCharacteristic(Characteristic.SerialNumber, (zone) ? `${id} (${zone})` : id)
                .setCharacteristic(Characteristic.Model, model)
                .setCharacteristic(Characteristic.FirmwareRevision, (firmware) ? firmware : "1.0");

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
        const deviceName = _.get(accessory, "name", "").replace(/[()]/gi, "");
        const deviceMake = _.get(accessory, "make");
        const deviceType = _.get(accessory, "type");

        const deviceKind  = "system";
        const deviceModel = deviceType.substr(deviceType.indexOf("-") + 2);

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
                undefined
            );
        }
    } else if (type === "zone") {
        const zoneId    = _.get(accessory, "id");
        const zoneName  = _.get(accessory, "name", "").replace(/[()]/gi, "");
        const zoneTags  = _.get(accessory, "tags");
        const zoneIndex = _.get(accessory, "index");

        const zoneMake = "ADT";
        const zoneKind = zoneTags.substr(zoneTags.indexOf(",") + 1);
        const zoneArea = zoneIndex.replace(/((E?)([0-9]{1,2}))((VER)([0-9]+))/g, "$3");
        const zoneFirm = zoneIndex.replace(/((E?)([0-9]{1,2}))((VER)([0-9]+))/g, "$6");

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
                zoneFirm
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
 * @param {Object} accessory - The accessory.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.removeAccessory = function (accessory) {
    if (!accessory) {
        this.logMessage(`Failed to remove invalid accessory... ${accessory}`, 10);
        return;
    }

    const id   = _.get(accessory, "context.id");
    const name = _.get(accessory, "displayName");

    this.logMessage(`Removing accessory... ${name} (${id})`, 30);
    this.logMessage(accessory, 40);

    // Remove from accessory array.
    _.remove(this.accessories, ["UUID", accessory.UUID]);

    this.api.unregisterPlatformAccessories(
        "homebridge-adt-pulse",
        "ADTPulse",
        [accessory]
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
ADTPulsePlatform.prototype.getDeviceAccessory = function (type, id, name, callback) {
    let error  = false;
    let status = this.getDeviceStatus(type, true);

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
ADTPulsePlatform.prototype.setDeviceAccessory = function (id, name, state, callback) {
    this.setDeviceStatus(id, name, state);

    setTimeout(() => {
        callback(null, state);
    }, this.setDeviceTimeout * 1000);
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
ADTPulsePlatform.prototype.getZoneAccessory = function (type, id, name, callback) {
    let error  = false;
    let status = this.getZoneStatus(type, id, true);

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
 * @returns {(undefined|number|string)}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.getDeviceStatus = function (type, format) {
    const device  = this.deviceStatus;
    const summary = _.get(device, "summary");

    if (typeof summary === "string") {
        if (format) {
            return this.formatGetDeviceStatus(type, summary);
        }

        return summary.toLowerCase();
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
ADTPulsePlatform.prototype.formatGetDeviceStatus = function (type, summary) {
    const lowerCaseSummary = summary.toLowerCase();
    const alarm            = lowerCaseSummary.includes("alarm");
    const uncleared_alarm  = lowerCaseSummary.includes("uncleared alarm");
    const disarmed         = lowerCaseSummary.includes("disarmed");
    const arm_away         = lowerCaseSummary.includes("armed away");
    const arm_stay         = lowerCaseSummary.includes("armed stay");
    const arm_night        = lowerCaseSummary.includes("armed night");

    let status = undefined;

    if (alarm && !uncleared_alarm) {
        if (type === "current") {
            status = Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED;
        }
    } else if (uncleared_alarm || disarmed) {
        if (type === "current") {
            status = Characteristic.SecuritySystemCurrentState.DISARMED;
        } else if (type === "target") {
            status = Characteristic.SecuritySystemTargetState.DISARM;
        }
    } else if (arm_away) {
        if (type === "current") {
            status = Characteristic.SecuritySystemCurrentState.AWAY_ARM;
        } else if (type === "target") {
            status = Characteristic.SecuritySystemTargetState.AWAY_ARM;
        }
    } else if (arm_stay) {
        if (type === "current") {
            status = Characteristic.SecuritySystemCurrentState.STAY_ARM;
        } else if (type === "target") {
            status = Characteristic.SecuritySystemTargetState.STAY_ARM;
        }
    } else if (arm_night) {
        if (type === "current") {
            status = Characteristic.SecuritySystemCurrentState.NIGHT_ARM;
        } else if (type === "target") {
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
ADTPulsePlatform.prototype.setDeviceStatus = function (id, name, arm) {
    const latestState = this.getDeviceStatus("current", false);

    let oldArmState = this.formatSetDeviceStatus(latestState, "armState");
    let newArmState = this.formatSetDeviceStatus(arm, "arm");

    this.logMessage(`Setting ${name} (${id}) status from ${oldArmState} to ${newArmState}...`, 30);
    this.logMessage(`Latest state for ${name} (${id}) is ${latestState}...`, 40);

    if (typeof latestState === "string" && latestState.includes("status unavailable")) {
        this.logMessage(`Unable to set ${name} (${id}) status. The ADT Pulse Gateway is offline.`, 10);
        return;
    } else if (!oldArmState) {
        this.logMessage(`Unknown latestState context... ${latestState}`, 10);
        return;
    }

    this.pulse
        .login()
        .then(async () => {
            // Attempt to clear the alarms first.
            if (latestState.includes("alarm")) {
                if (["carbon monoxide", "fire", "burglary"].includes(latestState)) {
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
 * @returns {(undefined|string)}
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.formatSetDeviceStatus = function (status, type) {
    let string = undefined;

    if (type === "armState" && typeof status === "string") {
        if (status.includes("disarmed")) {
            string = "disarmed";
        } else if (status.includes("armed away")) {
            string = "away";
        } else if (status.includes("armed stay")) {
            string = "stay";
        } else if (status.includes("armed night")) {
            string = "night";
        }
    } else if (type === "arm" && typeof status === "number") {
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

    if (typeof state === "string") {
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
                status = Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED;
            } else if (state === "devStatTamper") {
                // Glass broken.
                status = Characteristic.OccupancyDetected.OCCUPANCY_DETECTED;
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

                // Bind version to session so message does not bomb logs.
                this.sessionVersion = version;
            })
            .then(() => this.pulse.performPortalSync())
            .then(async syncCode => {
                const theSyncCode = _.get(syncCode, "info.syncCode");

                // Runs if status changes.
                if (theSyncCode !== this.lastSyncCode || theSyncCode === "1-0-0") {
                    this.logMessage(`New sync code detected... ${theSyncCode}`, 40);

                    // Add or update accessories.
                    await this.pulse
                        .getDeviceStatus()
                        .then(async device => {
                            const deviceStatus  = _.get(device, "info");
                            const deviceSummary = _.get(deviceStatus, "summary");

                            const deviceUUID   = UUIDGen.generate("system-1");
                            const deviceLoaded = _.find(this.accessories, ["UUID", deviceUUID]);

                            // Set latest status into instance.
                            this.deviceStatus = deviceStatus;

                            // Do not poll or add offline device.
                            if (deviceSummary.includes("Status Unavailable")) {
                                return;
                            }

                            // Add or update device.
                            if (deviceLoaded === undefined) {
                                const getDeviceInfo    = await this.pulse.getDeviceInformation()
                                    .catch(error => this.catchErrors(error));
                                const deviceInfo       = _.get(getDeviceInfo, "info");
                                const deviceInfoStatus = _.merge(deviceInfo, deviceStatus);

                                this.prepareAddAccessory("device", deviceInfoStatus);
                                this.devicePolling("system", "system-1");
                            } else {
                                this.devicePolling("system", "system-1");
                            }
                        })
                        .then(() => this.pulse.getZoneStatus())
                        .then(zones => {
                            const zoneStatus = _.get(zones, "info");

                            // Set latest status into instance.
                            this.zoneStatus = zoneStatus;

                            _.forEach(zoneStatus, zone => {
                                const zoneId    = _.get(zone, "id");
                                const zoneTags  = _.get(zone, "tags");
                                const zoneState = _.get(zone, "state");

                                const zoneType = zoneTags.substr(zoneTags.indexOf(",") + 1);

                                const deviceUUID   = UUIDGen.generate(zoneId);
                                const deviceLoaded = _.find(this.accessories, ["UUID", deviceUUID]);

                                // Do not poll or add offline zone.
                                if (zoneTags === "sensor" && zoneState === "devStatUnknown") {
                                    return;
                                }

                                // Add or update zone.
                                if (deviceLoaded === undefined) {
                                    this.prepareAddAccessory("zone", zone);
                                    this.devicePolling(zoneType, zoneId);
                                } else {
                                    this.devicePolling(zoneType, zoneId);
                                }
                            });
                        })
                        .catch(error => this.catchErrors(error));

                    // Remove obsolete zones.
                    _.forEachRight(this.accessories, accessory => {
                        const id   = _.get(accessory, "context.id");
                        const type = _.get(accessory, "context.type");
                        const zone = _.find(this.zoneStatus, { "id": id });

                        // Do not remove security panel(s).
                        if (zone === undefined && type !== "system") {
                            this.logMessage(`Preparing to remove zone (${id}) accessory...`, 30);
                            this.removeAccessory(accessory);
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
                    .getService(Service.OccupancySensor)
                    .getCharacteristic(Characteristic.OccupancyDetected)
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
    const infoMessage = _.get(error, "info.message", "");

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
            this.logMessage(`An unknown error occurred.`, priority = 10);
            break;
    }

    if (infoMessage && priority) {
        this.logMessage(infoMessage, priority);
    }

    if (error && !action) {
        this.logMessage(error, 10);
    } else if (error) {
        this.logMessage(error, 40);
    }
};

/**
 * Log system information.
 *
 * @param {Object} api - Homebridge API. Null for older versions.
 *
 * @since 1.0.0
 */
ADTPulsePlatform.prototype.logSystemInformation = function (api) {
    const platform   = _.get(process, "platform");
    const arch       = _.get(process, "arch");
    const pkgJson    = require("./package.json");
    const pkgJsonVer = _.get(pkgJson, "version");
    const nodeVer    = _.get(process, "versions.node");
    const homeVer    = _.get(api, "serverVersion");

    this.logMessage(`running on ${platform} (${arch})`, 30);
    this.logMessage(`homebridge-adt-pulse v${pkgJsonVer}`, 30);
    this.logMessage(`node v${nodeVer}`, 30);
    this.logMessage(`homebridge v${homeVer}`, 30);
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
            default:
                break;
        }
    }
};
