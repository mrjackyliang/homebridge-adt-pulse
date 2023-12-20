ADT Pulse for Homebridge
=========================

### ⚠️ Please Install the Beta Version ⚠️
This plugin is completely re-written from the ground up (supports v27.0.0-140), and I would love everyone on board! Please install the beta version, so I can quickly get a faster and more stable version to you!

Please bear with me, as the beta version is being actively developed and tested. If you see any unusual or annoying bugs, please comment on this [GitHub issue](https://github.com/mrjackyliang/homebridge-adt-pulse/issues/124).

__HOOBS Users:__ Please do not use the configuration UI as that is currently outdated and being cached by HOOBS. I have no control of why that is happening ([GitHub link](https://github.com/hoobs-org/HOOBS/issues/1873)), so you must configure it manually using the sample configuration below.

Additionally, I am seeing that the developers for HOOBS are stale based on the activity and complaints I see on [Reddit](https://www.reddit.com/r/HOOBS/). Support will be "best effort", and official status will be pulled in the meantime.

[![NPM Version](https://img.shields.io/npm/v/homebridge-adt-pulse.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/homebridge-adt-pulse)
[![NPM Downloads](https://img.shields.io/npm/dt/homebridge-adt-pulse.svg?style=flat-square&color=success)](https://www.npmjs.com/package/homebridge-adt-pulse)
[![GitHub License](https://img.shields.io/github/license/mrjackyliang/homebridge-adt-pulse?style=flat-square&color=yellow)](https://github.com/mrjackyliang/homebridge-adt-pulse/blob/master/LICENSE)
[![Become a GitHub Sponsor](https://img.shields.io/badge/sponsor-github-black?style=flat-square&color=orange)](https://github.com/sponsors/mrjackyliang)

This is a [verified Homebridge plugin](https://github.com/homebridge/homebridge/wiki/verified-Plugins#verified-plugins) for ADT Pulse customers that allow homeowners to control their security system and view sensor status through the Home app (the HAP protocol).

The API relies on the ADT Pulse Web Portal (powered by Icontrol One, owned by ICN Acquisition LLC, an indirect subsidiary of [Alarm.com](https://alarm.com)). View details of the acquisition via the [SEC Form 8-K](https://www.sec.gov/Archives/edgar/data/1459200/000119312517074906/d355785d8k.htm).

To use this plugin, here are three simple steps you need to follow:
1. Run `npm install homebridge-adt-pulse`
2. Configure this plugin using the [configuration example](#configuration)
3. Restart Homebridge and see magic happen 😁

Another option is to search for `adt-pulse` using Onzu's [Homebridge Config UI](https://github.com/oznu/homebridge-config-ui-x). Afterward, you can proceed to configure this plugin through the configuration UI available in the "Plugins" tab.

## Configuration
Here is an example of how the `config.json` file for this plugin should be configured:
```json
{
  "platforms": [
    {
      "platform": "ADTPulse",
      "name": "ADT Pulse",
      "subdomain": "portal",
      "username": "user@example.com",
      "password": "Mys7r0nG!P@ssw0rd",
      "fingerprint": "VGhpc0lzQVNlY3VyZVBhc3N3b3JkMTIzIQ==",
      "mode": "normal",
      "speed": 1,
      "sensors": [
        {
          "name": "Lounge Smoke",
          "adtName": "Basement Smoke",
          "adtType": "fire",
          "adtZone": 1
        }
      ]
    },
    {
      "platform": "...",
      "name": "..."
    }
  ]
}
```
Ensure that you customize the values of `subdomain`, `username`, `password`, `fingerprint`, and `sensors` to match your specific setup. If you encounter any queries regarding the configuration, refer to the details provided below this section.

## Supported Devices
While named "ADT Pulse for Homebridge," this Homebridge plugin exclusively accommodates only the sensors listed below. It is important to note that this plugin does not serve as a comprehensive substitute for the [official ADT Pulse app](https://www.adt.com/help/faq/adt-pulse/adt-pulse-mobile-app).

This plugin will expose these devices by default:
1. ADT Pulse Gateway (`gateway`)
2. Security Panel (`panel`)

This plugin can expose these devices (in read-only mode) based on your configuration:
1. `co` - Carbon Monoxide Detector
2. `doorWindow` - Door/Window Sensor __::__ Door Sensor __::__ Window Sensor
3. `fire` - Fire (Smoke/Heat) Detector
4. `flood` - Water/Flood Sensor
5. `glass` - Glass Break Detector
6. `keypad` - Keypad/Touchpad
7. `motion` - Motion Sensor __::__ Motion Sensor (Notable Events Only)
8. `panic` - Audible Panic Button/Pendant __::__ Silent Panic Button/Pendant
9. `temperature` - Temperature Sensor

Due to implementation complexity and platform instability, all Z-Wave accessories connected to the ADT Pulse gateway will not be planned for development or be supported overall. Consider purchasing the [Hubitat Hub](https://hubitat.com) for a seamless setup experience, or read about the [Home Assistant Z-Wave](https://www.home-assistant.io/integrations/zwave_js/) integration.

## Specifying the Portal Region
ADT Pulse is available to consumers in either the United States or Canada. To specify your country, use the following settings:

- If you are a United States customer, set the `subdomain` value to `"portal"`.
- If you are a Canada customer, set the `subdomain` value to `"portal-ca"`.

Select the appropriate setting based on your country, as the ability to switch between countries is determined by the ADT region to which you are subscribed to.

## Finding the Device Fingerprint
Since the introduction of 2-factor authentication during login is now required, a device fingerprint has become a necessity. Follow these steps:

1. Log in to the ADT Pulse portal, complete the MFA challenge, and choose to "Trust this device" (you can name the device as you see fit).
2. Using the same browser used for login, access the [ADT Pulse Device Fingerprint Detector](https://raw.githack.com/mrjackyliang/homebridge-adt-pulse/main/fingerprint/index.html).
3. Click the "Copy Fingerprint" button and paste it into the `fingerprint` value in the `config.json` file.

For a detailed breakdown of the device fingerprint contents, explore the "Device Details" tab located at the top right of the web page.

## Specifying the Operational Mode
This plugin offers three operational modes: "Normal", "Paused", and "Reset". To configure these modes, use the following settings:

- For regular operation, set the `mode` value to `"normal"`.
- To pause the plugin (all devices will become non-responsive), set the `mode` value to `"paused"`.
- To reset the plugin (remove associated accessories), set the `mode` value to `"reset"`.

It is crucial to note that if you set the plugin to "Reset" mode, the plugin will initiate a countdown with warnings, and __you have approximately 30 seconds to reverse the setting and restart Homebridge before all accessories related to this plugin are removed__.

This precautionary measure is in place to avoid unintended resets that could lead to the time-consuming task of reconfiguring automations and accessories.

## Specifying the Synchronization Speed
Typically, the plugin triggers every second to assess whether sync check signals or keep-alive signals should be dispatched.

However, for older devices incompatible with newer OpenSSL versions (e.g. `v3.1`), this may result in consistent 100% CPU usage. To adjust the firing interval, use the following settings:

- For "Normal" operation speed, set the `speed` value to `1`.
- For "Moderate" operation speed, set the `speed` value to `0.75`.
- For "Slower" operation speed, set the `speed` value to `0.5`.
- For "Slowest" operation speed, set the `speed` value to `0.25`.

If the plugin does not operate under "Normal" mode, a warning will be issued on every startup, and this warning cannot be disabled. While an option is available to downgrade to the deprecated OpenSSL version (`v1.1.1`), it is not recommended.

## Specifying the Sensors
In the past, this plugin would automatically detect sensors and dynamically manage their addition and removal based on its observations.

However, this approach posed challenges. If the plugin failed to detect sensors or encountered portal irregularities, it could unintentionally remove all sensors, resulting in an inadvertent reset.

While a setting was introduced (prior to `v3.0.0`) to prevent the removal of obsolete zones, over time, it felt more like a workaround than a solution.

In this updated version of the plugin, I have implemented a new requirement that users must explicitly specify each sensor they wish to integrate into Homebridge.

All sensors are now organized within an array of objects, with each object containing the following settings:
- Name (`name`)
  - For display purposes (offers clarity in the event of an unforeseen reset).
- ADT Name: (`adtName`)
  - Must match the name shown under the "Name" column in the "System" tab when logged into the portal.
- ADT Type: (`adtType`)
  - Must match the type shown under the "Device Type" column in the "System" tab when logged into the portal.
  - Contingent to the devices shown under the [Supported Devices](#supported-devices) section.
- ADT Zone: (`adtZone`)
  - Must match the zone shown under the "Zone" column in the "System" tab when logged into the portal.

If you do not find the supported type listed, please note that the plugin will notify me. There's no need to create a separate issue on GitHub, as I am actively working on adding support as soon as I gather sufficient information to determine the statuses displayed on the portal.

Your patience is appreciated as I address and incorporate the necessary updates.

## Force Arming (Arm Away / Arm Stay / Arm Night)
Due to the way how the Home app (the HAP protocol) establishes arm states, the plugin will force arm upon detecting active motion or open sensors. Disabling this feature is not possible, as this will result in arming failures without alert notifications from the Home app.

If you are concerned about this, please read the instructions below to check the status of the sensors in your home before arming your system:

1. Open the Home app
2. Tap the dotted circle (`...`) (located on the top right of the screen)
3. View the sensors that require attention and resolve those issues

If you are using automation, __you acknowledge that this will happen__ and accept the risks for the system not completely arming the system.

## Arm Night Support
As for ADT Pulse systems, __Arm Night__ is only available for use through the panel itself. Although it is not visible on the Web Portal or the mobile app, you can still place your system in __Arm Night__ mode with this plugin.

## Debug Mode
Previously, there was a specific setting to configure debug logs at five different levels. Over time, it became apparent that this setting made debugging excessively challenging for the average consumer. To improve this, debug mode is now activated __ONLY when the debug mode is enabled on the Homebridge__ itself.

This approach promotes isolation (by using a separate bridge for each plugin) and helps enhance the troubleshooting experience in case any issues arise.

## Documentation, Logging, and Detection
This function comes with a built-in feature to notify me if the plugin detects anomalies in the states of sensors and panel statuses. In the event of such occurrences, especially when these statuses are undocumented, I will receive notifications.

__Be assured that this plugin strictly adheres to the [verified Homebridge plugin](https://github.com/homebridge/homebridge/wiki/verified-Plugins#verified-plugins) requirements, ensuring that it does not track users in any manner.__

If the information sent includes personally identifiable details, such as IP addresses, MAC addresses, or serial numbers, those fields will be automatically redacted (replaced with `*** REDACTED FOR PRIVACY ***`) since they are unwanted information needed to improve the plugin.

To reinforce this, a warning will be issued each time you utilize the included scripts, start the plugin, or when the plugin is about to notify me, serving as a reminder of these privacy measures.

Here is an example of the information I see when the plugin detects unknown statuses from the gateway:
```json
{
  "communication": {
    "primaryConnectionType": "Broadband",
    "broadbandConnectionStatus": "Unavailable",
    "cellularConnectionStatus": "N/A",
    "cellularSignalStrength": "N/A"
  },
  "manufacturer": "ADT Pulse Gateway",
  "model": "Some Model",
  "network": {
    "broadband": {
      "ip": "*** REDACTED FOR PRIVACY ***",
      "mac": "*** REDACTED FOR PRIVACY ***"
    },
    "device": {
      "ip": "*** REDACTED FOR PRIVACY ***",
      "mac": "*** REDACTED FOR PRIVACY ***"
    },
    "router": {
      "lanIp": "*** REDACTED FOR PRIVACY ***",
      "wanIp": "*** REDACTED FOR PRIVACY ***"
    }
  },
  "serialNumber": "*** REDACTED FOR PRIVACY ***",
  "status": "Online",
  "update": {
    "last": "Yesterday 12:00 PM",
    "next": "Today 12:00 PM"
  },
  "versions": {
    "firmware": "Some Firmware Version",
    "hardware": "Some Hardware Version"
  }
}
```
__Notice:__ If you prefer to prevent this functionality, you can block the URL that the plugin utilizes to notify me. However, it is essential to note that I will not be able to offer assistance or support if you choose to impede the plugin from fulfilling its purpose to the best of its capabilities.

## Credits and Appreciation
If you find value in the ongoing development of this plugin and wish to express your appreciation, you have the option to become my supporter on [GitHub Sponsors](https://github.com/sponsors/mrjackyliang)!

Moreover, I extend a special acknowledgment and heartfelt gratitude to the following individuals:
- [@kevinmhickey](https://github.com/kevinmhickey) - For the inspiration to build a better script used in `v1.0.0` through `v2.2.0`.
- [@Danimal4326](https://github.com/Danimal4326) - For successfully identifying the solution for ADT Pulse's 2-factor authentication.

Their contributions have significantly enhanced the functionality and reliability of this plugin.
