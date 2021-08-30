ADT Pulse for Homebridge
=========================

[![NPM Version](https://img.shields.io/npm/v/homebridge-adt-pulse.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/homebridge-adt-pulse)
[![NPM Downloads](https://img.shields.io/npm/dt/homebridge-adt-pulse.svg?style=flat-square&color=success)](https://www.npmjs.com/package/homebridge-adt-pulse)
[![GitHub License](https://img.shields.io/github/license/mrjackyliang/homebridge-adt-pulse?style=flat-square&color=yellow)](https://github.com/mrjackyliang/homebridge-adt-pulse/blob/master/LICENSE)
[![Become a GitHub Sponsor](https://img.shields.io/badge/sponsor-github-black?style=flat-square&color=orange)](https://github.com/sponsors/mrjackyliang)

This is a [verified Homebridge plugin](https://github.com/homebridge/homebridge/wiki/verified-Plugins#verified-plugins) for ADT Pulse users that allow homeowners to control their security system and view sensor status through HomeKit. The API relies on the ADT Pulse Web Portal (by Icontrol One).

To use this plugin, here are three simple steps you need to follow:
1. Run `npm install homebridge-adt-pulse`
2. Configure the plugin using the [configuration example](#configuration)
3. Restart Homebridge

You can also search `adt-pulse` using [HOOBS](https://github.com/mkellsy/homebridge-config-ui) or [Onzu's Homebridge Config UI](https://github.com/oznu/homebridge-config-ui-x). Then proceed to configure the plugin using the included settings in the plugin page.

## Configuration
When configuring this plugin, simply add the platform to your existing `config.json` file. Mind that the `platform` name must always be `ADTPulse`.
```json
{
    "platforms": [
        {
            "platform": "ADTPulse",
            "name": "ADT Pulse",
            "username": "email@email.com",
            "password": "1234567890",
            "overrideSensors": [
                {
                    "name": "Sample Sensor 1",
                    "type": "sensor,doorWindow"
                },
                {
                    "name": "...",
                    "type": "..."
                }
            ],
            "country": "us",
            "logLevel": 30,
            "logActivity": true,
            "removeObsoleteZones": true,
            "resetAll": false
        },
        {
            "platform": "...",
            "name": "..."
        }
    ]
}
```

## Plugin Limitations
Even though the plugin name is "ADT Pulse for Homebridge", this Homebridge plugin supports certain ADT hardware. In addition, this plugin is NOT a complete replacement to the [official ADT Pulse app](https://www.adt.com/help/faq/adt-pulse/adt-pulse-mobile-app).

The hardware configurations supported by this plugin are:
1. ADT Security Panel (`system`)
2. ADT Door/Window Sensors (`doorWindow`)
3. ADT Glass Break Detectors (`glass`)
4. ADT Motion Sensors (`motion`)
5. ADT Carbon Monoxide Detector (`co`)
6. ADT Fire (Smoke/Heat) Detector (`fire`)

If you have a sensor that is unsupported by this plugin, please [submit an issue](https://github.com/mrjackyliang/homebridge-adt-pulse/issues/new/choose) so I can add support for it.

Due to ADT Pulse limitations, accessories that are connected to the Z-Wave Platform cannot be supported. Consider using other Homebridge plugins.

Recently, ADT has added a multi-factor authentication requirement. If you have already opted-in, please consider creating an [alternative account for use](https://portal.adtpulse.com/myhome/system/admin.jsp).

## Force Arming (Arm Away/Stay/Night)
Due to the nature of how HomeKit and ADT Pulse processes `setDeviceStatus` commands, this plugin will force arm when it detects active motion or open sensors.

__Without force arm, arm away/stay/night may stall and reset to Disarm with no errors.__

Before arming, please check the status of your Home (instructions below), as HomeKit will not check if your devices are in an active state.

1. Open the Home app
2. Tap the Status Details (listed in the Home tab _below_ the title)
3. View the __ATTENTION__ area of your home

## Arm Night Support
As for ADT Pulse systems, __Arm Night__ is only available for use through the panel itself. Although it is not visible on the Web Portal or the mobile app, you can still place your system in __Arm Night__ mode with this plugin.

Because of the force arming procedure (above), __please make sure no devices are open or reporting motion__ as this may render the __Arm Night__ mode less effective.

## Manually Override Sensors
Due to ADT Pulse portal limitations, sensors may be inaccurately detected. Use this setting to manually override default detection features. _Optional._

The default is `[]`. Configure `overrideSensors[]` with the values below:
* Set `name` to the name that is displayed in the ADT Pulse portal
* Set `type` to `sensor,doorWindow`, `sensor,glass`, `sensor,motion`, `sensor,co`, or `sensor,fire`

__NOTE:__ Examples are noted above in the [configuration](#configuration) section.

## Set Country
ADT Pulse is available both in the United States and Canada. Use this setting to toggle which country you will be using the plugin in. _Optional._

The default is `us`. Configure `country` with the values below:
* Set `country` to `us` for United States
* Set `country` to `ca` for Canada

__NOTE:__ If the `country` setting has been specified incorrectly, a warning will be shown then subsequently set to `us`.

## Log Level (Debugging)
Debugging is difficult without the proper information, in such, this plugin offers a way to filter out messages sent to the logs. _Optional._

The default is `30`. Configure `logLevel` with the values below:
* Set `logLevel` to `10` for errors only
* Set `logLevel` to `20` for warnings (and the above)
* Set `logLevel` to `30` for info (and the above)
* Set `logLevel` to `40` for debugging (and the above)
* Set `logLevel` to `50` for verbose (and the above)

__NOTE:__ If the `logLevel` setting has been specified incorrectly, a warning will be shown then subsequently set to `30`.

__NOTE 2:__ Don't forget to enable Homebridge Debug Mode when setting `logLevel` to `40` or above or else debug messages won't be shown.

## Log Activity
While the plugin is running, it has the ability to record alarm and sensor activity from the ADT Pulse portal to the Homebridge logs. _Optional._

The default is `true`. Configure `logActivity` with the values below:
* Set `logActivity` to `true` for active mode
* Set `logActivity` to `false` for passive mode

__NOTE:__ Logging alarm and sensor activity requires the `logLevel` setting to be set to `30` or greater.

## Remove Obsolete Zones
The plugin offers a way to automatically detect and remove obsolete zones. If you have recently experienced __sensor reset__ issues, you may disable this setting. _Optional._

The default is `true`. Configure `removeObsoleteZones` with the values below:
* Set `removeObsoleteZones` to `true` for removal mode
* Set `removeObsoleteZones` to `false` for notification mode

__NOTE:__ If recently, you had sensors removed from ADT Pulse, the plugin will not remove these sensors unless `removeObsoleteZones` is set to `true`.

## Resetting the Plugin
Managing many accessories in a Homebridge environment is already a seemingly hard task, and sometimes you might want to step back and do a reset. _Optional._

The default is `false`. Configure `resetAll` with the values below:
* Set `resetAll` to `true` for reset mode
* Set `resetAll` to `false` for normal mode

__NOTE:__ Once reset is complete, remember to set the `resetAll` setting back to `false` or else the plugin will just repeat reset mode again.

## Developer Information
The script provides an active connection to the ADT Pulse portal. Here is a list of must-knows, just in case you might want to debug (or improve) the plugin:

1. Device and zone statuses will be fetched every __3 seconds__. If logins have failed more than 2 times, portal sync will pause for 10 minutes.
2. Supported versions are `20.0.0-221` and `20.0.0-244`. If this plugin does not support either version, a warning will appear in the logs. Please [submit an issue](https://github.com/mrjackyliang/homebridge-adt-pulse/issues/new/choose) to let me know!

## Credits and Appreciation
If you would like to show your appreciation for its continued development, you can optionally become my supporter on [GitHub Sponsors](https://github.com/sponsors/mrjackyliang)!

Also, thank you to [@kevinmkickey](https://github.com/kevinmhickey) for providing the [ADT Pulse script](https://github.com/kevinmhickey/adt-pulse).
