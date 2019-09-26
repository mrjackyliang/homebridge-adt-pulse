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
let jar;
let userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36";
let accept    = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3";

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
 * @since 1.0.0
 */
pulse = function (options) {
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
pulse.prototype.login = function () {
    let deferred = q.defer();
    let that     = this;

    hasInternet({
        timeout: 5000,
        retries: 3,
        domainName: "portal.adtpulse.com",
        port: 53,
    }).then(function () {
        if (authenticated) {
            deferred.resolve({
                "action": "LOGIN",
                "success": true,
                "info": {
                    "version": lastKnownVersion,
                },
            });
        } else {
            if (that.debug) {
                console.log("ADT Pulse: Logging in...");
            }

            // Request a new cookie session.
            jar = request.jar();

            isAuthenticating = true;

            request(
                {
                    url: "https://portal.adtpulse.com",
                    jar: jar,
                    headers: {
                        "Accept": accept,
                        "User-Agent": userAgent,
                    },
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
                        },
                        function (error, response) {
                            isAuthenticating = false;

                            let regex        = new RegExp("^(\/myhome\/)(.*)(\/summary\/summary\.jsp)$");
                            let responsePath = _.get(response, "request.path");

                            if (that.debug) {
                                console.log(`ADT Pulse: Response path -> ${responsePath}`);
                                console.log(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`);
                            }

                            if (error || !regex.test(responsePath)) {
                                authenticated = false;

                                if (that.debug) {
                                    console.error("ADT Pulse: Login failed.");
                                }

                                deferred.reject({
                                    "action": "LOGIN",
                                    "success": false,
                                    "info": null,
                                });
                            } else {
                                let version          = response.request.path.match(regex)[2];
                                let supportedVersion = "16.0.0-131";

                                // Saves last known version for reuse later.
                                lastKnownVersion = version;

                                authenticated = true;

                                if (that.debug) {
                                    console.log("ADT Pulse: Login success.");
                                    console.log(`ADT Pulse: Web portal version -> ${version}`);

                                    if (version !== supportedVersion) {
                                        console.warn(`ADT Pulse: WARNING! Web portal version ${version} does not match ${supportedVersion}.`);
                                    }
                                }

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
        if (that.debug) {
            console.log("ADT Pulse: Internet connection is offline or \"https://portal.adtpulse.com\" is unavailable.");
        }

        deferred.reject({
            "action": "HOST_UNREACHABLE",
            "success": false,
            "info": null,
        });
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
pulse.prototype.logout = function () {
    let deferred = q.defer();
    let that     = this;

    hasInternet({
        timeout: 5000,
        retries: 3,
        domainName: "portal.adtpulse.com",
        port: 53,
    }).then(function () {
        if (!authenticated) {
            deferred.resolve({
                "action": "LOGOUT",
                "success": true,
                "info": null,
            });
        } else {
            if (that.debug) {
                console.log("ADT Pulse: Logging out...");
            }

            request(
                {
                    url: "https://portal.adtpulse.com/myhome/access/signout.jsp",
                    jar: jar,
                    headers: {
                        "User-Agent": userAgent,
                    }
                },
                function () {
                    authenticated = false;

                    if (that.debug) {
                        console.log("ADT Pulse: Logout success.");
                    }

                    deferred.resolve({
                        "action": "LOGOUT",
                        "success": true,
                        "info": null,
                    });
                }
            );
        }
    }).catch(function () {
        if (that.debug) {
            console.log("ADT Pulse: Internet connection is offline or \"https://portal.adtpulse.com\" is unavailable.");
        }

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
pulse.prototype.getDeviceStatus = function () {
    let deferred = q.defer();
    let that     = this;

    hasInternet({
        timeout: 5000,
        retries: 3,
        domainName: "portal.adtpulse.com",
        port: 53,
    }).then(function () {
        if (that.debug) {
            console.log("ADT Pulse: Getting device information...");
        }

        // Get security panel information, first.
        request(
            {
                url: "https://portal.adtpulse.com/myhome/system/device.jsp?id=1",
                jar: jar,
                headers: {
                    "User-Agent": userAgent,
                },
            },
            function (error, response, body) {
                let regex        = new RegExp("^(\/myhome\/)(.*)(\/system\/device\.jsp)(.*)$");
                let responsePath = _.get(response, "request.path");

                if (that.debug) {
                    console.log(`ADT Pulse: Response path -> ${responsePath}`);
                    console.log(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`);
                }

                if (error || !regex.test(responsePath)) {
                    authenticated = false;

                    if (that.debug) {
                        console.error("ADT Pulse: Get device information failed.");
                    }

                    deferred.reject({
                        "action": "GET_DEVICE_INFO",
                        "success": false,
                        "info": null,
                    });
                } else {
                    let $          = cheerio.load(body);
                    let deviceName = $("td.InputFieldDescriptionL:contains(\"Name\")").next().text().trim();
                    let deviceMake = $("td.InputFieldDescriptionL:contains(\"Manufacturer\")").next().text().trim();
                    let deviceType = $("td.InputFieldDescriptionL:contains(\"Type\")").next().text().trim();

                    if (that.debug) {
                        console.log("ADT Pulse: Getting device status...");
                    }

                    // Then, get security panel status.
                    request(
                        {
                            url: "https://portal.adtpulse.com/myhome/ajax/orb.jsp",
                            jar: jar,
                            headers: {
                                "User-Agent": userAgent,
                            },
                        },
                        function (error, response, body) {
                            let regex        = new RegExp("^(\/myhome\/)(.*)(\/ajax\/orb\.jsp)$");
                            let responsePath = _.get(response, "request.path");

                            if (that.debug) {
                                console.log(`ADT Pulse: Response path -> ${responsePath}`);
                                console.log(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`);
                            }

                            if (error || !regex.test(responsePath)) {
                                if (that.debug) {
                                    console.error("ADT Pulse: Get device status failed.");
                                }

                                deferred.reject({
                                    "action": "GET_DEVICE_STATUS",
                                    "success": false,
                                    "info": null,
                                });
                            } else {
                                let $           = cheerio.load(body);
                                let textSummary = $("#divOrbTextSummary span").text();
                                let theState    = textSummary.substr(0, textSummary.indexOf("."));
                                let theStatus   = textSummary.substr(textSummary.indexOf(".") + 2).slice(0, -1);

                                /**
                                 * These are the possible states and statuses.
                                 *
                                 * State:
                                 *   "Disarmed"
                                 *   "Armed Away"
                                 *   "Armed Stay"
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
        if (that.debug) {
            console.log("ADT Pulse: Internet connection is offline or \"https://portal.adtpulse.com\" is unavailable.");
        }

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
pulse.prototype.setDeviceStatus = function (armState, arm) {
    let deferred = q.defer();
    let that     = this;

    hasInternet({
        timeout: 5000,
        retries: 3,
        domainName: "portal.adtpulse.com",
        port: 53,
    }).then(function () {
        // TODO Disarm when alarm during away, and Disarm when alarm during stay.
        /**
         * Pulse URLs to set device status.
         *
         * Disarm (Siren Ringing)   -> https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=disarmed&arm=off
         * Disarm (Clear Alarm)     -> https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=disarmed+with+alarm&arm=off
         * Disarm (When Armed Away) -> https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=away&arm=off
         * Disarm (When Armed Stay) -> https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=stay&arm=off
         * Arm Away                 -> https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=disarmed&arm=away
         * Arm Stay                 -> https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=disarmed&arm=stay
         *
         * @type {string}
         */
        let url = "https://portal.adtpulse.com/myhome/quickcontrol/armDisarm.jsp?href=rest/adt/ui/client/security/setArmState&armstate=" + armState + "&arm=" + arm;

        if (that.debug) {
            console.log("ADT Pulse: Setting device status...");
        }

        request(
            {
                url: url,
                jar: jar,
                headers: {
                    "User-Agent": userAgent,
                    "Referer": "https://portal.adtpulse.com/myhome/summary/summary.jsp",
                },
            },
            function (error, response) {
                let regex        = new RegExp("^(\/myhome\/)(.*)(\/quickcontrol\/armDisarm\.jsp)(.*)$");
                let responsePath = _.get(response, "request.path");

                if (that.debug) {
                    console.log(`ADT Pulse: Response path -> ${responsePath}`);
                    console.log(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`);
                }

                if (error || !regex.test(response.request.path)) {
                    authenticated = false;

                    if (that.debug) {
                        console.error("ADT Pulse: Set device status to \"" + arm + "\" failed.");
                    }

                    deferred.reject({
                        "code": "SET_DEVICE_STATUS",
                        "success": false,
                        "info": null,
                    });
                } else {
                    if (that.debug) {
                        console.log("ADT Pulse: Set device status to \"" + arm + "\" success.");
                    }

                    deferred.resolve({
                        "code": "SET_DEVICE_STATUS",
                        "success": true,
                        "info": null,
                    });
                }
            }
        );
    }).catch(function () {
        if (that.debug) {
            console.log("ADT Pulse: Internet connection is offline or \"https://portal.adtpulse.com\" is unavailable.");
        }

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
pulse.prototype.getZoneStatus = function () {
    let deferred = q.defer();
    let that     = this;

    hasInternet({
        timeout: 5000,
        retries: 3,
        domainName: "portal.adtpulse.com",
        port: 53,
    }).then(function () {
        if (that.debug) {
            console.log("ADT Pulse: Getting zone status...");
        }

        request(
            {
                url: "https://portal.adtpulse.com/myhome/ajax/homeViewDevAjax.jsp",
                jar: jar,
                headers: {
                    "User-Agent": userAgent,
                },
            },
            function (error, response, body) {
                let regex        = new RegExp("^(\/myhome\/)(.*)(\/ajax\/homeViewDevAjax\.jsp)$");
                let responsePath = _.get(response, "request.path");

                if (that.debug) {
                    console.log(`ADT Pulse: Response path -> ${responsePath}`);
                    console.log(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`);
                }

                // If error, wrong path, or HTML format.
                if (error || !regex.test(response.request.path) || body.indexOf("<html") > -1) {
                    authenticated = false;

                    if (that.debug) {
                        console.error("ADT Pulse: Get zone status failed.");
                    }

                    deferred.reject({
                        "action": "GET_ZONE_STATUS",
                        "success": false,
                        "info": null,
                    });
                } else {
                    let allDevices = JSON.parse(body)["items"];
                    let sensors    = _.filter(allDevices, function (device) {
                        return device["id"].indexOf("sensor-") > -1;
                    });

                    // Only sensors are supported.
                    let output = _.map(sensors, function (device) {
                        let id    = device["id"];
                        let name  = device["name"];
                        let tags  = device["tags"];
                        let state = device["state"]["icon"];

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
        if (that.debug) {
            console.log("ADT Pulse: Internet connection is offline or \"https://portal.adtpulse.com\" is unavailable.");
        }

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
pulse.prototype.performPortalSync = function () {
    let deferred = q.defer();
    let that     = this;

    hasInternet({
        timeout: 5000,
        retries: 3,
        domainName: "portal.adtpulse.com",
        port: 53,
    }).then(function () {
        if (that.debug) {
            console.log("ADT Pulse: Performing portal sync...");
        }

        request(
            {
                url: "https://portal.adtpulse.com/myhome/Ajax/SyncCheckServ" + "?t=" + Date.now(),
                jar: jar,
                headers: {
                    "User-Agent": userAgent,
                    "Referer": "https://portal.adtpulse.com/myhome/summary/summary.jsp",
                },
            },
            function (error, response, body) {
                let regex        = new RegExp("^(\/myhome\/)(.*)(\/Ajax\/SyncCheckServ)(.*)$");
                let responsePath = _.get(response, "request.path");

                if (that.debug) {
                    console.log(`ADT Pulse: Response path -> ${responsePath}`);
                    console.log(`ADT Pulse: Response path matches -> ${regex.test(responsePath)}`);
                }

                // If error, wrong path, or HTML format.
                if (error || !regex.test(responsePath) || body.indexOf("<html") > -1) {
                    authenticated = false;

                    if (that.debug) {
                        console.error("ADT Pulse: Failed to sync with portal.");
                    }

                    deferred.reject({
                        "action": "SYNC",
                        "success": false,
                        "info": null,
                    });
                } else {
                    /**
                     * May return status codes like this:
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
        if (that.debug) {
            console.log("ADT Pulse: Internet connection is offline or \"https://portal.adtpulse.com\" is unavailable.");
        }

        deferred.reject({
            "action": "HOST_UNREACHABLE",
            "success": false,
            "info": null,
        });
    });

    return deferred.promise;
};

module.exports = pulse;
