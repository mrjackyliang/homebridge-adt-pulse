/**
 * ADT Pulse Test.
 *
 * Test the ADT Pulse API responses using this script.
 *
 * Arguments:
 *     --username email@email.com
 *     --password 1234567890
 *     --action   [device-information,device-status,zone-status,sync,disarm,arm-away,arm-stay,arm-night]
 *     --debug    [true,false]
 *
 * Usage:
 *     node adt-pulse-test.js --username ! --password % --action @ --debug #
 *
 * Replace:
 *     ! - Account username
 *     % - Account password
 *     @ - Action type
 *     # - Debug value
 *
 * @type {function(Object): void}
 *
 * @since 1.0.0
 */
const Pulse = require("./adt-pulse");

/**
 * Script arguments.
 *
 * @since 1.0.0
 */
const username = process.argv.indexOf("--username");
const password = process.argv.indexOf("--password");
const action   = process.argv.indexOf("--action");
const debug    = process.argv.indexOf("--debug");

/**
 * Values for script arguments.
 *
 * @since 1.0.0
 */
let usernameValue = (username > -1) ? process.argv[username + 1] : "";
let passwordValue = (password > -1) ? process.argv[password + 1] : "";
let actionValue   = (action > -1) ? process.argv[action + 1] : "";
let debugValue    = (debug > -1) ? process.argv[debug + 1] : "false";

/**
 * Sanitize arguments.
 *
 * @since 1.0.0
 */
if (!usernameValue) {
    consoleLogger("ADT Pulse Test: Username is empty.", true);
    return;
}

if (!passwordValue) {
    consoleLogger("ADT Pulse Test: Password is empty.", true);
    return;
}

if (!actionValue) {
    consoleLogger("ADT Pulse Test: Action is empty.", true);
    return;
}

if (debugValue === "true") {
    debugValue = true;
    consoleLogger("ADT Pulse Test: Debug mode on.");
} else {
    debugValue = false;
    consoleLogger("ADT Pulse Test: Debug mode off.");
}

/**
 * Initialize main script.
 *
 * @type {Pulse}
 *
 * @since 1.0.0
 */
let pulse = new Pulse({
    "username": usernameValue,
    "password": passwordValue,
    "debug": debugValue,
});

/**
 * Actions.
 *
 * @since 1.0.0
 */
switch (actionValue) {
    case "device-information":
        consoleLogger("ADT Pulse Test: Getting device information...");

        pulse
            .login()
            .then(login => consoleLogger(login))
            .then(() => pulse.getDeviceInformation())
            .then(information => consoleLogger(information))
            .then(() => pulse.logout())
            .then(logout => consoleLogger(logout))
            .catch(error => consoleLogger(error, true));
        break;
    case "device-status":
        consoleLogger("ADT Pulse Test: Getting device status...");

        pulse
            .login()
            .then(login => consoleLogger(login))
            .then(() => pulse.getDeviceStatus())
            .then(status => consoleLogger(status))
            .then(() => pulse.logout())
            .then(logout => consoleLogger(logout))
            .catch(error => consoleLogger(error, true));
        break;
    case "zone-status":
        consoleLogger("ADT Pulse Test: Getting zone status...");

        pulse
            .login()
            .then(login => consoleLogger(login))
            .then(() => pulse.getZoneStatus())
            .then(statuses => consoleLogger(statuses))
            .then(() => pulse.logout())
            .then(logout => consoleLogger(logout))
            .catch(error => consoleLogger(error, true));
        break;
    case "sync":
        consoleLogger("ADT Pulse Test: Performing portal sync...");

        pulse
            .login()
            .then(login => consoleLogger(login))
            .then(() => pulse.performPortalSync())
            .then(syncCode => consoleLogger(syncCode))
            .then(() => pulse.logout())
            .then(logout => consoleLogger(logout))
            .catch(error => consoleLogger(error, true));
        break;
    case "disarm":
        consoleLogger("ADT Pulse Test: Disarming...");

        pulse
            .login()
            .then(login => consoleLogger(login))
            .then(() => pulse.getDeviceStatus())
            .then(status => consoleLogger(status))
            .then(async () => {
                /**
                 * setDeviceStatus function may fail because a wrong armState was set.
                 */
                await pulse
                    .setDeviceStatus("away", "off")
                    .then(response => consoleLogger(response))
                    .catch(error => consoleLogger(error, true));
            })
            .then(() => {
                setTimeout(() => {
                    pulse
                        .getDeviceStatus()
                        .then(status => consoleLogger(status))
                        .then(() => pulse.logout())
                        .then(logout => consoleLogger(logout))
                        .catch(error => consoleLogger(error, true));
                }, 1000);
            })
            .catch(error => consoleLogger(error, true));
        break;
    case "arm-away":
        consoleLogger("ADT Pulse Test: Arming away...");

        pulse
            .login()
            .then(login => consoleLogger(login))
            .then(() => pulse.getDeviceStatus())
            .then(status => consoleLogger(status))
            .then(async () => {
                /**
                 * setDeviceStatus function may fail because a wrong armState was set.
                 */
                await pulse
                    .setDeviceStatus("disarmed", "away")
                    .then(response => consoleLogger(response))
                    .catch(error => consoleLogger(error, true));
            })
            .then(() => {
                setTimeout(() => {
                    pulse
                        .getDeviceStatus()
                        .then(status => consoleLogger(status))
                        .then(() => pulse.logout())
                        .then(logout => consoleLogger(logout))
                        .catch(error => consoleLogger(error, true));
                }, 1000);
            })
            .catch(error => consoleLogger(error, true));
        break;
    case "arm-stay":
        consoleLogger("ADT Pulse Test: Arming stay...");

        pulse
            .login()
            .then(login => consoleLogger(login))
            .then(() => pulse.getDeviceStatus())
            .then(status => consoleLogger(status))
            .then(async () => {
                /**
                 * setDeviceStatus function may fail because a wrong armState was set.
                 */
                await pulse
                    .setDeviceStatus("disarmed", "stay")
                    .then(response => consoleLogger(response))
                    .catch(error => consoleLogger(error, true));
            })
            .then(() => {
                setTimeout(() => {
                    pulse
                        .getDeviceStatus()
                        .then(status => consoleLogger(status))
                        .then(() => pulse.logout())
                        .then(logout => consoleLogger(logout))
                        .catch(error => consoleLogger(error, true));
                }, 1000);
            })
            .catch(error => consoleLogger(error, true));
        break;
    case "arm-night":
        consoleLogger("ADT Pulse Test: Arming night...");

        pulse
            .login()
            .then(login => consoleLogger(login))
            .then(() => pulse.getDeviceStatus())
            .then(status => consoleLogger(status))
            .then(async () => {
                /**
                 * setDeviceStatus function may fail because a wrong armState was set.
                 */
                await pulse
                    .setDeviceStatus("disarmed", "night")
                    .then(response => consoleLogger(response))
                    .catch(error => consoleLogger(error, true));
            })
            .then(() => {
                setTimeout(() => {
                    pulse
                        .getDeviceStatus()
                        .then(status => consoleLogger(status))
                        .then(() => pulse.logout())
                        .then(logout => consoleLogger(logout))
                        .catch(error => consoleLogger(error, true));
                }, 1000);
            })
            .catch(error => consoleLogger(error, true));
        break;
    default:
        consoleLogger(`ADT Pulse Test: Unknown action type ${actionValue}.`, true);
        break;
}

/**
 * Console logger.
 *
 * @param {(Object|string)} content - The message or content being recorded into the logs.
 * @param {boolean}         error   - If the message logged is an error.
 *
 * @since 1.0.0
 */
function consoleLogger(content, error = false) {
    if (typeof content === "object") {
        (error) ? console.error("\n", content, "\n") : console.log("\n", content, "\n");
    } else {
        (error) ? console.error(content) : console.log(content);
    }
}
