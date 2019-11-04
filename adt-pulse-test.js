/**
 * ADT Pulse Test.
 *
 * Test the ADT Pulse API responses using this script.
 *
 * Arguments:
 *     --username email@email.com
 *     --password 1234567890
 *     --action   [device-status,zone-status,sync,disarm,arm-away,arm-stay]
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
 * @type {(function(Object): void)|*}
 *
 * @since 1.0.0
 */
const Pulse = require("./adt-pulse");

/**
 * Setup script arguments.
 *
 * @since 1.0.0
 */
const username    = process.argv.indexOf("--username");
const password    = process.argv.indexOf("--password");
const action      = process.argv.indexOf("--action");
const debug       = process.argv.indexOf("--debug");
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
    console.error("ADT Pulse Test: Username is empty.");
    return;
}
if (!passwordValue) {
    console.error("ADT Pulse Test: Password is empty.");
    return;
}
if (!actionValue) {
    console.error("ADT Pulse Test: Action is empty.");
    return;
}
if (debugValue === "true") {
    debugValue = true;
    console.log("ADT Pulse Test: Debug mode on.");
} else {
    debugValue = false;
    console.log("ADT Pulse Test: Debug mode off.");
}

/**
 * Initialize ADT Pulse function.
 *
 * @type {Pulse}
 *
 * @since 1.0.0
 */
let myAlarm = new Pulse({
    "username": usernameValue,
    "password": passwordValue,
    "debug": debugValue,
});

/**
 * ADT Pulse actions.
 *
 * @since 1.0.0
 */
switch (actionValue) {
    case "device-status":
        console.log("ADT Pulse Test: Getting device status...");

        myAlarm
            .login()
            .then(() => myAlarm.getDeviceStatus())
            .then((status) => {
                console.log("==============================");
                console.log(status);
                console.log("==============================");
            })
            .then(() => myAlarm.logout());
        break;
    case "zone-status":
        console.log("ADT Pulse Test: Getting zone status...");

        myAlarm
            .login()
            .then(() => myAlarm.getZoneStatus())
            .then((statuses) => {
                console.log("==============================");
                console.log(statuses);
                console.log("==============================");
            })
            .then(() => myAlarm.logout());
        break;
    case "sync":
        console.log("ADT Pulse Test: Performing portal sync...");

        myAlarm
            .login()
            .then(() => myAlarm.performPortalSync())
            .then((syncCode) => {
                console.log("==============================");
                console.log(syncCode);
                console.log("==============================");
            })
            .then(() => myAlarm.logout());
        break;
    case "disarm":
        console.log("ADT Pulse Test: Disarming...");

        myAlarm
            .login()
            .then(() => myAlarm.getDeviceStatus())
            .then((status) => {
                console.log("==============================");
                console.log(status);
                console.log("==============================");
            })
            .then(async () => {
                // setDeviceStatus function may fail because a wrong armState was set.
                await myAlarm.setDeviceStatus("away", "off");
            })
            .then(() => {
                setTimeout(() => {
                    myAlarm
                        .getDeviceStatus()
                        .then((status) => {
                            console.log("==============================");
                            console.log(status);
                            console.log("==============================");
                        })
                        .then(() => myAlarm.logout());
                }, 1000);
            });
        break;
    case "arm-away":
        console.log("ADT Pulse Test: Arming away...");

        myAlarm
            .login()
            .then(() => myAlarm.getDeviceStatus())
            .then((status) => {
                console.log("==============================");
                console.log(status);
                console.log("==============================");
            })
            .then(async () => {
                // setDeviceStatus function may fail because a wrong armState was set.
                await myAlarm.setDeviceStatus("disarmed", "away");
            })
            .then(() => {
                setTimeout(() => {
                    myAlarm
                        .getDeviceStatus()
                        .then((status) => {
                            console.log("==============================");
                            console.log(status);
                            console.log("==============================");
                        })
                        .then(() => myAlarm.logout());
                }, 1000);
            });
        break;
    case "arm-stay":
        console.log("ADT Pulse Test: Arming stay...");

        myAlarm
            .login()
            .then(() => myAlarm.getDeviceStatus())
            .then((status) => {
                console.log("==============================");
                console.log(status);
                console.log("==============================");
            })
            .then(async () => {
                // setDeviceStatus function may fail because a wrong armState was set.
                await myAlarm.setDeviceStatus("disarmed", "stay");
            })
            .then(() => {
                setTimeout(() => {
                    myAlarm
                        .getDeviceStatus()
                        .then((status) => {
                            console.log("==============================");
                            console.log(status);
                            console.log("==============================");
                        })
                        .then(() => myAlarm.logout());
                }, 1000);
            });
        break;
    default:
        console.error(`ADT Pulse Test: Unknown action type ${actionValue}.`);
        break;
}
