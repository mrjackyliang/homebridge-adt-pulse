/**
 * ADT Pulse.
 *
 * A JavaScript library / Node module for ADT Pulse.
 *
 * @author Kevin Hickey <kevin@kevinmhickey.com>
 * @author Jacky Liang
 *
 * @since 1.0.0
 */
const cheerio     = require("cheerio");
const q           = require("q");
const request     = require("request");
const _           = require("lodash");
const hasInternet = require("internet-available");

/**
 * Browser configuration.
 *
 * The variable "jar" is for storing browser session cookies.
 *
 * @since 1.0.0
 */
const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36";
const accept    = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3";

let jar;

/**
 * Settings for internet-available.
 *
 * @since 1.0.0
 */
const hasInternetSettings = {
    timeout: 5000,
    retries: 3,
    domainName: "portal.adtpulse.com",
    port: 53,
};

/**
 * Track login, login statuses, portal versions.
 *
 * @since 1.0.0
 */
let authenticated    = false;
let isAuthenticating = false;
let lastKnownVersion = "";

/**
 * ADT Pulse constructor.
 *
 * @param {Object} options - Stores the configuration.
 *
 * @constructor
 *
 * @since 1.0.0
 */
Pulse = function (options) {
    this.username = _.get(options, "username", "");
    this.password = _.get(options, "password", "");
    this.debug    = _.get(options, "debug", false);
};

/**
 * ADT Pulse login.
 *
 * @returns {Q.Promise<Object>}
 *
 * @since 1.0.0
 */
Pulse.prototype.login = function () {
    let deferred = q.defer();
    let that     = this;

    hasInternet(hasInternetSettings).then(function () {
        if (authenticated) {
            deferred.resolve({
                "action": "LOGIN",
                "success": true,
                "info": {
                    "version": lastKnownVersion,
                },
            });
        } else {
            that.consoleLogger("ADT Pulse: Logging in...", "log");

            // Request a new cookie session.
            jar = request.jar();

            isAuthenticating = true;

            request.get(
                "https://portal.adtpulse.com",
                {
                    jar: jar,
                    headers: {
                        "Accept": accept,
                        "User-Agent": userAgent,
                    },
                    ciphers: [
                        "ECDHE-RSA-AES256-GCM-SHA384",
                        "ECDHE-RSA-AES128-GCM-SHA256"
                    ].join(":"),
                },
                function () {
                    request.post(
                        "https://portal.adtpulse.com/myhome/access/signin.jsp",
                        {
                            followAllRedirects: true,
                            jar: jar,
                            headers: {
                                "Host": "portal.adtpulse.com",
                                "User-Agent": userAgent,
                            },
                            form: {
                                username: that.username,
                                password: that.password,
                            },
                            ciphers: [
                                "ECDHE-RSA-AES256-GCM-SHA384",
                                "ECDHE-RSA-AES128-GCM-SHA256"
                            ].join(":"),
                        },
                        function (error, response, body) {
                            isAuthenticating = false;

                            const regex        = new RegExp("^(\/myhome\/)(.*)(\/summary\/summary\.jsp)$");
                            const responsePath = _.get(response, "request.uri.path");

                            that.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                            that.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                            if (error || !regex.test(responsePath)) {
                                authenticated = false;

                                that.consoleLogger("ADT Pulse: Login failed.", "error");

                                deferred.reject({
                                    "action": "LOGIN",
                                    "success": false,
                                    "info": {
                                        "error": error,
                                        "message": that.getErrorMessage(body),
                                    },
                                });
                            } else {
                                authenticated = true;

                                const version = responsePath.match(regex)[2];

                                // Saves last known version for reuse later.
                                lastKnownVersion = version;

                                that.consoleLogger("ADT Pulse: Login success.", "log");
                                that.consoleLogger(`ADT Pulse: Web portal version -> ${version}`, "log");

                                deferred.resolve({
                                    "action": "LOGIN",
                                    "success": true,
                                    "info": {
                                        "version": version,
                                    },
                                });
                            }
                        }
                    );
                }
            );
        }
    }).catch(function () {
        that.consoleLogger("ADT Pulse: Internet connection is offline or \"https://portal.adtpulse.com\" is unavailable.", "error");

        deferred.reject({
            "action": "HOST_UNREACHABLE",
            "success": false,
            "info": null,
        });
    });

    return deferred.promise;
};

// noinspection JSUnusedGlobalSymbols
/**
 * ADT Pulse logout.
 *
 * @returns {Q.Promise<Object>}
 *
 * @since 1.0.0
 */
Pulse.prototype.logout = function () {
    let deferred = q.defer();
    let that     = this;

    hasInternet(hasInternetSettings).then(function () {
        if (!authenticated) {
            deferred.resolve({
                "action": "LOGOUT",
                "success": true,
                "info": null,
            });
        } else {
            that.consoleLogger("ADT Pulse: Logging out...", "log");

            request.get(
                "https://portal.adtpulse.com/myhome/access/signout.jsp",
                {
                    jar: jar,
                    headers: {
                        "User-Agent": userAgent,
                    },
                    ciphers: [
                        "ECDHE-RSA-AES256-GCM-SHA384",
                        "ECDHE-RSA-AES128-GCM-SHA256"
                    ].join(":"),
                },
                function () {
                    authenticated = false;

                    that.consoleLogger("ADT Pulse: Logout success.", "log");

                    deferred.resolve({
                        "action": "LOGOUT",
                        "success": true,
                        "info": null,
                    });
                }
            );
        }
    }).catch(function () {
        that.consoleLogger("ADT Pulse: Internet connection is offline or \"https://portal.adtpulse.com\" is unavailable.", "error");

        deferred.reject({
            "action": "HOST_UNREACHABLE",
            "success": false,
            "info": null,
        });
    });

    return deferred.promise;
};

/**
 * ADT Pulse get device status.
 *
 * @returns {Q.Promise<Object>}
 *
 * @since 1.0.0
 */
Pulse.prototype.getDeviceStatus = function () {
    let deferred = q.defer();
    let that     = this;

    hasInternet(hasInternetSettings).then(function () {
        that.consoleLogger("ADT Pulse: Getting device information...", "log");

        // Get security panel information, first.
        request.get(
            "https://portal.adtpulse.com/myhome/system/device.jsp?id=1",
            {
                jar: jar,
                headers: {
                    "User-Agent": userAgent,
                },
                ciphers: [
                    "ECDHE-RSA-AES256-GCM-SHA384",
                    "ECDHE-RSA-AES128-GCM-SHA256"
                ].join(":"),
            },
            function (error, response, body) {
                const regex        = new RegExp("^(\/myhome\/)(.*)(\/system\/device\.jsp)(.*)$");
                const responsePath = _.get(response, "request.uri.path");

                that.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                that.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                if (error || !regex.test(responsePath)) {
                    authenticated = false;

                    that.consoleLogger("ADT Pulse: Get device information failed.", "error");

                    deferred.reject({
                        "action": "GET_DEVICE_INFO",
                        "success": false,
                        "info": {
                            "error": error,
                            "message": that.getErrorMessage(body),
                        },
                    });
                } else {
                    const $          = cheerio.load(body);
                    const deviceName = $("td.InputFieldDescriptionL:contains(\"Name\")").next().text().trim();
                    const deviceMake = $("td.InputFieldDescriptionL:contains(\"Manufacturer\")").next().text().trim();
                    const deviceType = $("td.InputFieldDescriptionL:contains(\"Type\")").next().text().trim();

                    that.consoleLogger("ADT Pulse: Getting device status...", "log");

                    // Then, get security panel status.
                    request.get(
                        "https://portal.adtpulse.com/myhome/ajax/orb.jsp",
                        {
                            jar: jar,
                            headers: {
                                "User-Agent": userAgent,
                            },
                            ciphers: [
                                "ECDHE-RSA-AES256-GCM-SHA384",
                                "ECDHE-RSA-AES128-GCM-SHA256"
                            ].join(":"),
                        },
                        function (error, response, body) {
                            const regex        = new RegExp("^(\/myhome\/)(.*)(\/ajax\/orb\.jsp)$");
                            const responsePath = _.get(response, "request.uri.path");

                            that.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                            that.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                            if (error || !regex.test(responsePath) || body.indexOf("<html") > -1) {
                                authenticated = false;

                                that.consoleLogger("ADT Pulse: Get device status failed.", "error");

                                deferred.reject({
                                    "action": "GET_DEVICE_STATUS",
                                    "success": false,
                                    "info": {
                                        "error": error,
                                        "message": that.getErrorMessage(body),
                                    },
                                });
                            } else {
                                const $           = cheerio.load(body);
                                const textSummary = $("#divOrbTextSummary span").text();
                                const theState    = textSummary.substr(0, textSummary.indexOf("."));
                                const theStatus   = textSummary.substr(textSummary.indexOf(".") + 2).slice(0, -1);

                                /**
                                 * These are the possible states and statuses.
                                 *
                                 * State:
                                 *   "Disarmed"
                                 *   "Armed Away"
                                 *   "Armed Stay"
                                 *   "Armed Night"
                                 *   "Status Unavailable"
                                 * Status:
                                 *   "All Quiet"
                                 *   "1 Sensor Open" or "x Sensors Open"
                                 *   "Sensor Bypassed" or "Sensors Bypassed"
                                 *   "Sensor Tripped" or "Sensors Tripped"
                                 *   "Motion"
                                 *   "Uncleared Alarm"
                                 *   "Carbon Monoxide Alarm"
                                 *   "FIRE ALARM"
                                 *   "BURGLARY ALARM"
                                 *   "Sensor Problem"
                                 *   ""
                                 */
                                deferred.resolve({
                                    "action": [
                                        "GET_DEVICE_INFO",
                                        "GET_DEVICE_STATUS",
                                    ],
                                    "success": true,
                                    "info": {
                                        "name": deviceName,
                                        "make": deviceMake,
                                        "type": deviceType,
                                        "state": theState,
                                        "status": theStatus,
                                    },
                                });
                            }
                        }
                    );
                }
            }
        );
    }).catch(function () {
        that.consoleLogger("ADT Pulse: Internet connection is offline or \"https://portal.adtpulse.com\" is unavailable.", "error");

        deferred.reject({
            "action": "HOST_UNREACHABLE",
            "success": false,
            "info": null,
        });
    });

    return deferred.promise;
};

/**
 * ADT Pulse set device status.
 *
 * @param {string} armState - Can be "disarmed", "disarmed+with+alarm", "away", "stay".
 * @param {string} arm      - Can be "off", "away", "stay".
 *
 * @returns {Q.Promise<Object>}
 *
 * @since 1.0.0
 */
Pulse.prototype.setDeviceStatus = function (armState, arm) {
    let deferred = q.defer();
    let that     = this;

    hasInternet(hasInternetSettings).then(function () {
        /**
         * Pulse URLs to set device status.
         *
         * Notes:
         * - When Disarming, the armState will be set to "disarmed". After re-login, it will be set to "off".
         * - When Arming Night, armState will be set to "night+stay". After re-login, it will be set to "night".
         * - If alarm occurred, you must Clear Alarm before setting to Armed Away/Stay/Night.
         *
         * Disarmed:
         * - Arm Away (https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=disarmed&arm=away)
         * - Arm Stay (https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=disarmed&arm=stay)
         * - Arm Night (https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=disarmed&arm=night)
         * - Disarm (https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=disarmed&arm=off)
         * - Clear Alarm (https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=disarmed+with+alarm&arm=off)
         * Armed Away:
         * - Disarm (https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=away&arm=off)
         * Armed Stay:
         * - Disarm (https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=stay&arm=off)
         * Armed Night:
         * - Disarm (https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=night&arm=off)
         *
         * @type {string}
         */
        const url = "https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=" + armState + "&arm=" + arm;

        that.consoleLogger("ADT Pulse: Setting device status...", "log");

        request.get(
            url,
            {
                jar: jar,
                headers: {
                    "User-Agent": userAgent,
                    "Referer": "https://portal.adtpulse.com/myhome/summary/summary.jsp",
                },
                ciphers: [
                    "ECDHE-RSA-AES256-GCM-SHA384",
                    "ECDHE-RSA-AES128-GCM-SHA256"
                ].join(":"),
            },
            function (error, response, body) {
                const regex        = new RegExp("^(\/myhome\/)(.*)(\/quickcontrol\/armDisarm\.jsp)(.*)$");
                const responsePath = _.get(response, "request.uri.path");

                that.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                that.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                if (error || !regex.test(responsePath)) {
                    authenticated = false;

                    that.consoleLogger(`ADT Pulse: Set device status to ${arm} failed.`, "error");

                    deferred.reject({
                        "action": "SET_DEVICE_STATUS",
                        "success": false,
                        "info": {
                            "error": error,
                            "message": that.getErrorMessage(body),
                        },
                    });
                } else {
                    const $       = cheerio.load(body);
                    const onClick = $("#arm_button_1").attr("onclick");
                    const satCode = (onClick !== undefined) ? onClick.split("sat=")[1].split("&")[0] : undefined;

                    const forceUrlBase = "https://portal.adtpulse.com/myhome/quickcontrol/serv/RunRRACommand";
                    const forceUrlArgs = `?sat=${satCode}&href=rest/adt/ui/client/security/setForceArm&armstate=forcearm&arm=${arm}`;
                    const forceUrl     = forceUrlBase + forceUrlArgs;

                    // Check if system requires force arming.
                    if (["away", "stay", "night"].includes(arm) && onClick !== undefined && satCode !== undefined) {
                        that.consoleLogger("ADT Pulse: Some sensors are open or reporting motion. Forcing Arm...", "warn");

                        request.get(
                            forceUrl,
                            {
                                jar: jar,
                                headers: {
                                    "User-Agent": userAgent,
                                    "Referer": "https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp"
                                },
                                ciphers: [
                                    "ECDHE-RSA-AES256-GCM-SHA384",
                                    "ECDHE-RSA-AES128-GCM-SHA256"
                                ].join(":"),
                            },
                            function (error, response, body) {
                                const regex        = new RegExp("^(\/myhome\/)(.*)(\/quickcontrol\/serv\/RunRRACommand)(.*)$");
                                const responsePath = _.get(response, "request.uri.path");

                                that.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                                that.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                                if (error || !regex.test(responsePath)) {
                                    authenticated = false;

                                    that.consoleLogger(`ADT Pulse: Set device status to ${arm} failed.`, "error");

                                    deferred.reject({
                                        "action": "SET_DEVICE_STATUS",
                                        "success": false,
                                        "info": {
                                            "error": error,
                                            "message": that.getErrorMessage(body),
                                        },
                                    });
                                } else {
                                    that.consoleLogger(`ADT Pulse: Set device status to ${arm} success.`, "log");

                                    deferred.resolve({
                                        "action": "SET_DEVICE_STATUS",
                                        "success": true,
                                        "info": {
                                            "forceArm": true,
                                            "setStatusTo": arm,
                                        },
                                    });
                                }
                            }
                        );
                    } else {
                        that.consoleLogger(`ADT Pulse: Set device status to ${arm} success.`, "log");

                        deferred.resolve({
                            "action": "SET_DEVICE_STATUS",
                            "success": true,
                            "info": {
                                "forceArm": false,
                                "setStatusTo": arm,
                            },
                        });
                    }
                }
            }
        );
    }).catch(function () {
        that.consoleLogger("ADT Pulse: Internet connection is offline or \"https://portal.adtpulse.com\" is unavailable.", "error");

        deferred.reject({
            "action": "HOST_UNREACHABLE",
            "success": false,
            "info": null,
        });
    });

    return deferred.promise;
};

/**
 * ADT Pulse get zone status.
 *
 * @returns {Q.Promise<Object>}
 *
 * @since 1.0.0
 */
Pulse.prototype.getZoneStatus = function () {
    let deferred = q.defer();
    let that     = this;

    hasInternet(hasInternetSettings).then(function () {
        that.consoleLogger("ADT Pulse: Getting zone status...", "log");

        request.get(
            "https://portal.adtpulse.com/myhome/ajax/homeViewDevAjax.jsp",
            {
                jar: jar,
                headers: {
                    "User-Agent": userAgent,
                },
                ciphers: [
                    "ECDHE-RSA-AES256-GCM-SHA384",
                    "ECDHE-RSA-AES128-GCM-SHA256"
                ].join(":"),
            },
            function (error, response, body) {
                const regex        = new RegExp("^(\/myhome\/)(.*)(\/ajax\/homeViewDevAjax\.jsp)$");
                const responsePath = _.get(response, "request.uri.path");

                that.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                that.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                // If error, wrong path, or HTML format.
                if (error || !regex.test(responsePath) || body.indexOf("<html") > -1) {
                    authenticated = false;

                    that.consoleLogger("ADT Pulse: Get zone status failed.", "error");

                    deferred.reject({
                        "action": "GET_ZONE_STATUS",
                        "success": false,
                        "info": {
                            "error": error,
                            "message": that.getErrorMessage(body),
                        },
                    });
                } else {
                    const allDevices = JSON.parse(body)["items"];
                    const sensors    = _.filter(allDevices, function (device) {
                        return device["id"].indexOf("sensor-") > -1;
                    });

                    // Only sensors are supported.
                    const output = _.map(sensors, function (device) {
                        const id    = device["id"];
                        const name  = device["name"];
                        const tags  = device["tags"];
                        const state = device["state"]["icon"];

                        /**
                         * Examples of output.
                         *
                         * id:    sensor-[integer]
                         * name:  device name
                         * tags:  sensor,[doorWindow,motion,glass,co,fire]
                         * state: devStatOK (device okay)
                         *        devStatOpen (door/window opened)
                         *        devStatMotion (detected motion)
                         *        devStatTamper (glass broken or device tamper)
                         *        devStatAlarm (detected CO/Smoke)
                         */
                        return {
                            'id': id,
                            'name': name,
                            'tags': tags,
                            'state': state,
                        };
                    });

                    deferred.resolve({
                        "action": "GET_ZONE_STATUS",
                        "success": true,
                        "info": output,
                    });
                }
            }
        );
    }).catch(function () {
        that.consoleLogger("ADT Pulse: Internet connection is offline or \"https://portal.adtpulse.com\" is unavailable.", "error");

        deferred.reject({
            "action": "HOST_UNREACHABLE",
            "success": false,
            "info": null,
        });
    });

    return deferred.promise;
};

/**
 * ADT Pulse sync protocol.
 *
 * @returns {Q.Promise<Object>}
 *
 * @since 1.0.0
 */
Pulse.prototype.performPortalSync = function () {
    let deferred = q.defer();
    let that     = this;

    hasInternet(hasInternetSettings).then(function () {
        that.consoleLogger("ADT Pulse: Performing portal sync...", "log");

        request.get(
            "https://portal.adtpulse.com/myhome/Ajax/SyncCheckServ" + "?t=" + Date.now(),
            {
                jar: jar,
                headers: {
                    "User-Agent": userAgent,
                    "Referer": "https://portal.adtpulse.com/myhome/summary/summary.jsp",
                },
                ciphers: [
                    "ECDHE-RSA-AES256-GCM-SHA384",
                    "ECDHE-RSA-AES128-GCM-SHA256"
                ].join(":"),
            },
            function (error, response, body) {
                const regex        = new RegExp("^(\/myhome\/)(.*)(\/Ajax\/SyncCheckServ)(.*)$");
                const responsePath = _.get(response, "request.uri.path");

                that.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                that.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                // If error, wrong path, or HTML format.
                if (error || !regex.test(responsePath) || body.indexOf("<html") > -1) {
                    authenticated = false;

                    that.consoleLogger("ADT Pulse: Failed to sync with portal.", "error");

                    deferred.reject({
                        "action": "SYNC",
                        "success": false,
                        "info": {
                            "error": error,
                            "message": that.getErrorMessage(body),
                        },
                    });
                } else {
                    /**
                     * May return sync codes like this:
                     *   1-0-0
                     *   2-0-0
                     *   [integer]-0-0
                     *   [integer]-[integer]-0
                     */
                    deferred.resolve({
                        "action": "SYNC",
                        "success": true,
                        "info": {
                            "syncCode": body,
                        },
                    });
                }
            }
        );
    }).catch(function () {
        that.consoleLogger("ADT Pulse: Internet connection is offline or \"https://portal.adtpulse.com\" is unavailable.", "error");

        deferred.reject({
            "action": "HOST_UNREACHABLE",
            "success": false,
            "info": null,
        });
    });

    return deferred.promise;
};

/**
 * ADT Pulse get error message.
 *
 * @param {string} responseBody - The response body.
 *
 * @returns {(null|string)}
 *
 * @since 1.0.0
 */
Pulse.prototype.getErrorMessage = function (responseBody) {
    let errorMessage = responseBody.match(/<div id="warnMsgContents" class="p_signinWarning">(.*?)<\/div>/g);

    // Array or null. Returns string.
    errorMessage = (errorMessage) ? errorMessage[0] : "";

    // Replace single line break with space.
    errorMessage = errorMessage.replace(/<br\/>/ig, " ");

    // Remove all HTML code.
    errorMessage.replace(/(<([^>]+)>)/ig, "");

    // If empty message, return null.
    return (errorMessage) ? errorMessage : null;
};

/**
 * ADT Pulse console logger.
 *
 * @param {string} content - The message or content being recorded into the logs.
 * @param {string} type   - Can be "error", "warn", or "log".
 *
 * @since 1.0.0
 */
Pulse.prototype.consoleLogger = function (content, type) {
    if (this.debug) {
        switch (type) {
            case "error":
                console.error(content);
                break;
            case "warn":
                console.warn(content);
                break;
            case "log":
                console.log(content);
                break;
        }
    }
};

module.exports = Pulse;
