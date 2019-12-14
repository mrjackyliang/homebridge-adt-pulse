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
const Q           = require("q");
const request     = require("request");
const _           = require("lodash");
const hasInternet = require("internet-available");

/**
 * Browser session cookies.
 *
 * @since 1.0.0
 */
let jar = undefined;

/**
 * Track login, login statuses, portal versions.
 *
 * @since 1.0.0
 */
let authenticated    = false;
let lastKnownVersion = "";
let lastKnownSiteId  = "";

/**
 * ADT Pulse constructor.
 *
 * @param {Object} options - The configuration.
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
    let deferred = Q.defer();

    this.hasInternetWrapper(deferred, () => {
        if (authenticated) {
            deferred.resolve({
                "action": "LOGIN",
                "success": true,
                "info": {
                    "version": lastKnownVersion,
                    "siteId": lastKnownSiteId,
                },
            });
        } else {
            this.consoleLogger("ADT Pulse: Logging in...", "log");

            // Request a new cookie session.
            jar = request.jar();

            request.get(
                "https://portal.adtpulse.com",
                this.generateRequestOptions(),
                (error, response, body) => {
                    const regex        = new RegExp("^(\/myhome\/)([0-9.-]+)(\/access\/signin\.jsp)$");
                    const responsePath = _.get(response, "request.uri.path");

                    this.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                    this.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                    if (error || !regex.test(responsePath)) {
                        authenticated = false;

                        this.consoleLogger("ADT Pulse: Login failed.", "error");

                        deferred.reject({
                            "action": "LOGIN",
                            "success": false,
                            "info": {
                                "error": error,
                                "message": this.getErrorMessage(body),
                            },
                        });
                    } else {
                        authenticated = false;

                        const version = responsePath.match(regex)[2];

                        // Saves last known version for reuse later.
                        lastKnownVersion = version;

                        this.consoleLogger(`ADT Pulse: Web portal version -> ${version}`, "log");

                        request.post(
                            `https://portal.adtpulse.com/myhome/${lastKnownVersion}/access/signin.jsp`,
                            this.generateRequestOptions({
                                followAllRedirects: true,
                                headers: {
                                    "Referer": `https://portal.adtpulse.com/myhome/${lastKnownVersion}/access/signin.jsp`,
                                },
                                form: {
                                    usernameForm: this.username,
                                    passwordForm: this.password,
                                },
                            }),
                            (error, response, body) => {
                                const regex        = new RegExp("^(\/myhome\/)([0-9.-]+)(\/summary\/summary\.jsp)$");
                                const responsePath = _.get(response, "request.uri.path");

                                this.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                                this.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                                if (error || !regex.test(responsePath)) {
                                    authenticated = false;

                                    this.consoleLogger("ADT Pulse: Login failed.", "error");

                                    deferred.reject({
                                        "action": "LOGIN",
                                        "success": false,
                                        "info": {
                                            "error": error,
                                            "message": this.getErrorMessage(body),
                                        },
                                    });
                                } else {
                                    authenticated = true;

                                    const siteId = body.match(/(\?networkid=)(.*)(&partner=adt)/)[2];

                                    // Saves last known site ID for reuse later.
                                    lastKnownSiteId = siteId;

                                    this.consoleLogger(`ADT Pulse: Site ID -> ${siteId}`, "log");
                                    this.consoleLogger("ADT Pulse: Login success.", "log");

                                    deferred.resolve({
                                        "action": "LOGIN",
                                        "success": true,
                                        "info": {
                                            "version": lastKnownVersion,
                                            "siteId": lastKnownSiteId,
                                        },
                                    });
                                }
                            }
                        );
                    }
                }
            );
        }
    });

    return deferred.promise;
};

/**
 * ADT Pulse logout.
 *
 * @returns {Q.Promise<Object>}
 *
 * @since 1.0.0
 */
Pulse.prototype.logout = function () {
    let deferred = Q.defer();

    this.hasInternetWrapper(deferred, () => {
        if (!authenticated) {
            deferred.resolve({
                "action": "LOGOUT",
                "success": true,
                "info": null,
            });
        } else {
            this.consoleLogger("ADT Pulse: Logging out...", "log");

            request.get(
                `https://portal.adtpulse.com/myhome/${lastKnownVersion}/access/signout.jsp?networkid=${lastKnownSiteId}&partner=adt`,
                this.generateRequestOptions({
                    headers: {
                        "Referer": `https://portal.adtpulse.com/myhome/${lastKnownVersion}/summary/summary.jsp`,
                    },
                }),
                (error, response, body) => {
                    const regex        = new RegExp("^(\/myhome\/)([0-9.-]+)(\/access\/signin\.jsp)(.*)$");
                    const responsePath = _.get(response, "request.uri.path");

                    this.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                    this.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                    if (error || !regex.test(responsePath)) {
                        authenticated = true;

                        this.consoleLogger("ADT Pulse: Logout failed.", "error");

                        deferred.reject({
                            "action": "LOGOUT",
                            "success": false,
                            "info": {
                                "error": error,
                                "message": this.getErrorMessage(body),
                            },
                        });
                    } else {
                        authenticated = false;

                        this.consoleLogger("ADT Pulse: Logout success.", "log");

                        deferred.resolve({
                            "action": "LOGOUT",
                            "success": true,
                            "info": null,
                        });
                    }
                }
            );
        }
    });

    return deferred.promise;
};

/**
 * ADT Pulse get device information.
 *
 * @returns {Q.Promise<Object>}
 *
 * @since 1.0.0
 */
Pulse.prototype.getDeviceInformation = function () {
    let deferred = Q.defer();

    this.hasInternetWrapper(deferred, () => {
        this.consoleLogger("ADT Pulse: Getting device information...", "log");

        request.get(
            `https://portal.adtpulse.com/myhome/${lastKnownVersion}/system/device.jsp?id=1`,
            this.generateRequestOptions({
                headers: {
                    "Referer": `https://portal.adtpulse.com/myhome/${lastKnownVersion}/system/system.jsp`,
                },
            }),
            (error, response, body) => {
                const regex        = new RegExp("^(\/myhome\/)([0-9.-]+)(\/system\/device\.jsp)(.*)$");
                const responsePath = _.get(response, "request.uri.path");

                this.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                this.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                if (error || !regex.test(responsePath)) {
                    authenticated = false;

                    this.consoleLogger("ADT Pulse: Get device information failed.", "error");

                    deferred.reject({
                        "action": "GET_DEVICE_INFO",
                        "success": false,
                        "info": {
                            "error": error,
                            "message": this.getErrorMessage(body),
                        },
                    });
                } else {
                    const $          = cheerio.load(body);
                    const deviceName = $("td.InputFieldDescriptionL:contains(\"Name\")").next().text().trim();
                    const deviceMake = $("td.InputFieldDescriptionL:contains(\"Manufacturer\")").next().text().trim();
                    const deviceType = $("td.InputFieldDescriptionL:contains(\"Type\")").next().text().trim();

                    this.consoleLogger("ADT Pulse: Get device information success.", "log");

                    deferred.resolve({
                        "action": "GET_DEVICE_INFO",
                        "success": true,
                        "info": {
                            "name": deviceName,
                            "make": deviceMake,
                            "type": deviceType,
                        },
                    });
                }
            }
        );
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
    let deferred = Q.defer();

    this.hasInternetWrapper(deferred, () => {
        this.consoleLogger("ADT Pulse: Getting device status...", "log");

        // Then, get security panel status.
        request.get(
            `https://portal.adtpulse.com/myhome/${lastKnownVersion}/ajax/orb.jsp`,
            this.generateRequestOptions({
                headers: {
                    "Accept": "*/*",
                    "Referer": `https://portal.adtpulse.com/myhome/${lastKnownVersion}/summary/summary.jsp`,
                },
            }),
            (error, response, body) => {
                const regex        = new RegExp("^(\/myhome\/)([0-9.-]+)(\/ajax\/orb\.jsp)$");
                const responsePath = _.get(response, "request.uri.path");

                this.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                this.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                if (error || !regex.test(responsePath) || body.indexOf("<html") > -1) {
                    authenticated = false;

                    this.consoleLogger("ADT Pulse: Get device status failed.", "error");

                    deferred.reject({
                        "action": "GET_DEVICE_STATUS",
                        "success": false,
                        "info": {
                            "error": error,
                            "message": this.getErrorMessage(body),
                        },
                    });
                } else {
                    const $           = cheerio.load(body);
                    const textSummary = $("#divOrbTextSummary span").text();
                    const theState    = textSummary.substr(0, textSummary.indexOf("."));
                    const theStatus   = textSummary.substr(textSummary.indexOf(".") + 2).slice(0, -1);

                    this.consoleLogger("ADT Pulse: Get device status success.", "log");

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
                        "action": "GET_DEVICE_STATUS",
                        "success": true,
                        "info": {
                            "state": theState,
                            "status": theStatus,
                        },
                    });
                }
            }
        );
    });

    return deferred.promise;
};

/**
 * ADT Pulse set device status.
 *
 * @param {string} armState - Can be "disarmed", "disarmed+with+alarm", "away", or "stay".
 * @param {string} arm      - Can be "off", "away", or "stay".
 *
 * @returns {Q.Promise<Object>}
 *
 * @since 1.0.0
 */
Pulse.prototype.setDeviceStatus = function (armState, arm) {
    let deferred = Q.defer();

    this.hasInternetWrapper(deferred, () => {
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
        const url = `https://portal.adtpulse.com/myhome/${lastKnownVersion}/quickcontrol/armDisarm.jsp`;
        const arg = `?href=rest/adt/ui/client/security/setArmState&armstate=${armState}&arm=${arm}`;

        this.consoleLogger("ADT Pulse: Setting device status...", "log");

        request.get(
            url + arg,
            this.generateRequestOptions({
                headers: {
                    "Referer": `https://portal.adtpulse.com/myhome/${lastKnownVersion}/summary/summary.jsp`,
                },
            }),
            (error, response, body) => {
                const regex        = new RegExp("^(\/myhome\/)([0-9.-]+)(\/quickcontrol\/armDisarm\.jsp)(.*)$");
                const responsePath = _.get(response, "request.uri.path");

                this.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                this.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                if (error || !regex.test(responsePath)) {
                    authenticated = false;

                    this.consoleLogger(`ADT Pulse: Set device status to ${arm} failed.`, "error");

                    deferred.reject({
                        "action": "SET_DEVICE_STATUS",
                        "success": false,
                        "info": {
                            "error": error,
                            "message": this.getErrorMessage(body),
                        },
                    });
                } else {
                    const $       = cheerio.load(body);
                    const onClick = $("#arm_button_1").attr("onclick");
                    const satCode = (onClick !== undefined) ? onClick.split("sat=")[1].split("&")[0] : undefined;

                    const forceUrl = `https://portal.adtpulse.com/myhome/${lastKnownVersion}/quickcontrol/serv/RunRRACommand`;
                    const forceArg = `?sat=${satCode}&href=rest/adt/ui/client/security/setForceArm&armstate=forcearm&arm=${arm}`;

                    // Check if system requires force arming.
                    if (["away", "stay", "night"].includes(arm) && onClick !== undefined && satCode !== undefined) {
                        this.consoleLogger("ADT Pulse: Some sensors are open or reporting motion. Arming Anyway...", "warn");

                        request.get(
                            forceUrl + forceArg,
                            this.generateRequestOptions({
                                headers: {
                                    "Accept": "*/*",
                                    "Referer": `https://portal.adtpulse.com/myhome/${lastKnownVersion}/quickcontrol/armDisarm.jsp`,
                                },
                            }),
                            (error, response, body) => {
                                const regex        = new RegExp("^(\/myhome\/)([0-9.-]+)(\/quickcontrol\/serv\/RunRRACommand)(.*)$");
                                const responsePath = _.get(response, "request.uri.path");

                                this.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                                this.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                                if (error || !regex.test(responsePath)) {
                                    authenticated = false;

                                    this.consoleLogger(`ADT Pulse: Set device status to ${arm} failed.`, "error");

                                    deferred.reject({
                                        "action": "SET_DEVICE_STATUS",
                                        "success": false,
                                        "info": {
                                            "error": error,
                                            "message": this.getErrorMessage(body),
                                        },
                                    });
                                } else {
                                    this.consoleLogger(`ADT Pulse: Set device status to ${arm} success.`, "log");

                                    deferred.resolve({
                                        "action": "SET_DEVICE_STATUS",
                                        "success": true,
                                        "info": {
                                            "forceArm": true,
                                            "previousArm": armState,
                                            "afterArm": arm,
                                        },
                                    });
                                }
                            }
                        );
                    } else {
                        this.consoleLogger(`ADT Pulse: Set device status to ${arm} success.`, "log");

                        deferred.resolve({
                            "action": "SET_DEVICE_STATUS",
                            "success": true,
                            "info": {
                                "forceArm": false,
                                "previousArm": armState,
                                "afterArm": arm,
                            },
                        });
                    }
                }
            }
        );
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
    let deferred = Q.defer();

    this.hasInternetWrapper(deferred, () => {
        this.consoleLogger("ADT Pulse: Getting zone status...", "log");

        request.get(
            `https://portal.adtpulse.com/myhome/${lastKnownVersion}/ajax/homeViewDevAjax.jsp`,
            this.generateRequestOptions({
                headers: {
                    "Accept": "*/*",
                    "Referer": `https://portal.adtpulse.com/myhome/${lastKnownVersion}/summary/summary.jsp`,
                },
            }),
            (error, response, body) => {
                const regex        = new RegExp("^(\/myhome\/)([0-9.-]+)(\/ajax\/homeViewDevAjax\.jsp)$");
                const responsePath = _.get(response, "request.uri.path");

                this.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                this.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                // If error, wrong path, or HTML format.
                if (error || !regex.test(responsePath) || body.indexOf("<html") > -1) {
                    authenticated = false;

                    this.consoleLogger("ADT Pulse: Get zone status failed.", "error");

                    deferred.reject({
                        "action": "GET_ZONE_STATUS",
                        "success": false,
                        "info": {
                            "error": error,
                            "message": this.getErrorMessage(body),
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
                        const index = device["devIndex"];

                        /**
                         * Expected output.
                         *
                         * id:    sensor-[integer]
                         * name:  device name
                         * tags:  sensor,[doorWindow,motion,glass,co,fire]
                         * index: [E][integer]VER[integer]
                         * state: devStatOK (device okay)
                         *        devStatOpen (door/window opened)
                         *        devStatMotion (detected motion)
                         *        devStatTamper (glass broken or device tamper)
                         *        devStatAlarm (detected CO/Smoke)
                         */
                        return {
                            "id": id,
                            "name": name,
                            "tags": tags,
                            "index": index,
                            "state": state,
                        };
                    });

                    this.consoleLogger("ADT Pulse: Get zone status success.", "log");

                    deferred.resolve({
                        "action": "GET_ZONE_STATUS",
                        "success": true,
                        "info": output,
                    });
                }
            }
        );
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
    let deferred = Q.defer();

    this.hasInternetWrapper(deferred, () => {
        this.consoleLogger("ADT Pulse: Performing portal sync...", "log");

        request.get(
            `https://portal.adtpulse.com/myhome/${lastKnownVersion}/Ajax/SyncCheckServ?t=` + Date.now(),
            this.generateRequestOptions({
                headers: {
                    "Accept": "*/*",
                    "Referer": `https://portal.adtpulse.com/myhome/${lastKnownVersion}/summary/summary.jsp`,
                },
            }),
            (error, response, body) => {
                const regex        = new RegExp("^(\/myhome\/)([0-9.-]+)(\/Ajax\/SyncCheckServ)(.*)$");
                const responsePath = _.get(response, "request.uri.path");

                this.consoleLogger(`ADT Pulse: Response path -> ${responsePath}`, "log");
                this.consoleLogger(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`, "log");

                // If error, wrong path, or HTML format.
                if (error || !regex.test(responsePath) || body.indexOf("<html") > -1) {
                    authenticated = false;

                    this.consoleLogger("ADT Pulse: Portal sync failed.", "error");

                    deferred.reject({
                        "action": "SYNC",
                        "success": false,
                        "info": {
                            "error": error,
                            "message": this.getErrorMessage(body),
                        },
                    });
                } else {
                    this.consoleLogger("ADT Pulse: Portal sync success.", "log");

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
    });

    return deferred.promise;
};

/**
 * Internet available wrapper.
 *
 * @param {Q.Deferred} deferred    - Used for rejecting promises.
 * @param {function}   runFunction - Run function if internet is available.
 *
 * @since 1.0.0
 */
Pulse.prototype.hasInternetWrapper = function (deferred, runFunction) {
    const settings = {
        timeout: 5000,
        retries: 3,
        domainName: "portal.adtpulse.com",
        port: 53,
    };

    hasInternet(settings).then(runFunction).catch(() => {
        this.consoleLogger("ADT Pulse: Internet connection is offline or \"https://portal.adtpulse.com\" is unavailable.", "error");

        deferred.reject({
            "action": "HOST_UNREACHABLE",
            "success": false,
            "info": null,
        });
    });
};

/**
 * Request options generator.
 *
 * @param {Object} additionalOptions - Additional options.
 *
 * @returns {Object}
 *
 * @since 1.0.0
 */
Pulse.prototype.generateRequestOptions = function (additionalOptions = {}) {
    const options = {
        jar: jar,
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Host": "portal.adtpulse.com",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36",
        },
        ciphers: [
            "ECDHE-RSA-AES256-GCM-SHA384",
            "ECDHE-RSA-AES128-GCM-SHA256"
        ].join(":"),
    };

    // Merge additional options.
    return _.merge(options, additionalOptions);
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
    // Returns array or null.
    let errorMessage = (responseBody) ? responseBody.match(/<div id="warnMsgContents" class="p_signinWarning">(.*?)<\/div>/g) : null;

    // Returns string.
    errorMessage = (errorMessage) ? errorMessage[0] : "";

    // Replace single line break with space.
    errorMessage = errorMessage.replace(/<br ?\/?>/ig, " ");

    // Remove all HTML code.
    errorMessage = errorMessage.replace(/(<([^>]+)>)/ig, "");

    // If empty message, return null.
    return (errorMessage) ? errorMessage : null;
};

/**
 * ADT Pulse console logger.
 *
 * @param {string} content - The message or content being recorded into the logs.
 * @param {string} type    - Can be "error", "warn", or "log".
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
