ADT Pulse for Homebridge
=========================

[![NPM Package](https://img.shields.io/npm/v/homebridge-adt-pulse?style=flat-square&logo=npm&logoColor=%23ffffff&color=%23b25da6)](https://www.npmjs.com/package/homebridge-adt-pulse)
[![NPM Downloads](https://img.shields.io/npm/dt/homebridge-adt-pulse?style=flat-square&logo=npm&logoColor=%23ffffff&color=%236688c3)](https://www.npmjs.com/package/homebridge-adt-pulse)
[![GitHub License](https://img.shields.io/github/license/mrjackyliang/homebridge-adt-pulse?style=flat-square&logo=googledocs&logoColor=%23ffffff&color=%2348a56a)](https://github.com/mrjackyliang/homebridge-adt-pulse/blob/main/LICENSE)
[![Become a GitHub Sponsor](https://img.shields.io/badge/github-sponsor-gray?style=flat-square&logo=githubsponsors&logoColor=%23ffffff&color=%23eaaf41)](https://github.com/sponsors/mrjackyliang)
[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-gray?style=flat-square&logo=paypal&logoColor=%23ffffff&color=%23ce4a4a)](https://liang.nyc/paypal)

This is a [verified Homebridge plugin](https://github.com/homebridge/homebridge/wiki/verified-Plugins#verified-plugins) for ADT Pulse customers that allow homeowners to control their security system and view sensor status through the Home app (the HAP protocol).

The API relies on the ADT Pulse Web Portal (powered by Icontrol One, owned by ICN Acquisition LLC, an indirect subsidiary of [Alarm.com](https://alarm.com))

To use this plugin, here are three simple steps you need to follow:
1. Run `npm install homebridge-adt-pulse`.
2. Configure this plugin using this [sample](#configuration) for guidance.
3. Restart Homebridge and see the magic happen!

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
      "options": [],
      "sensors": [
        {
          "name": "Family Room Couch Window 1",
          "adtName": "Family Room Window (99)",
          "adtZone": 99,
          "adtType": "doorWindow"
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
Ensure that you customize the values with the example structure shown above to match your specific setup. If you encounter any queries regarding the configuration, refer to the details provided below this section.

## Supported Devices
While named "ADT Pulse for Homebridge," this Homebridge plugin exclusively accommodates only the sensors listed below. It is important to note that this plugin does not serve as a comprehensive substitute for the [official ADT Pulse app](https://www.adt.com/help/faq/adt-pulse/adt-pulse-mobile-app).

This plugin will expose these devices by default:
1. ADT Pulse Gateway (`gateway`)
2. Security Panel (`panel`)
3. Alarm Ringing Switch (`panelSwitch`)

This plugin can expose these devices (in read-only mode) based on your configuration:
1. `co` - Carbon Monoxide Detector
2. `doorWindow` - Door/Window Sensor __::__ Door Sensor __::__ Window Sensor
3. `fire` - Fire (Smoke/Heat) Detector
4. `flood` - Water/Flood Sensor
5. `glass` - Glass Break Detector
6. `heat` - Heat (Rate-of-Rise) Detector
7. `motion` - Motion Sensor __::__ Motion Sensor (Notable Events Only)
8. `shock` - Shock Sensor
9. `temperature` - Temperature Sensor

Due to implementation complexity and platform instability, all Z-Wave accessories connected to the ADT Pulse gateway will not be planned for development or be supported overall. Consider purchasing the [Hubitat Hub](https://hubitat.com) for a seamless setup experience, or read about the [Home Assistant Z-Wave](https://www.home-assistant.io/integrations/zwave_js/) integration.

## Specifying the Portal Region
ADT Pulse is available to consumers in either the United States or Canada. To specify your country, use the following settings:

- If you are a customer in the United States, set the `subdomain` value to `"portal"`.
- If you are a customer in Canada, set the `subdomain` value to `"portal-ca"`.

Select the appropriate setting based on your country, as the ability to switch between countries is determined by the ADT region you are subscribed to.

## Finding the Device Fingerprint
Since the introduction of 2-factor authentication, a device fingerprint has become a necessity during login.

Starting from `v3.4.0`, you no longer need to use an external tool to retrieve the fingerprints. The dedicated Homebridge setup wizard will help retrieve your fingerprint for you.

## Specifying the Operational Mode
This plugin offers three operational modes: "Normal", "Paused", and "Reset". To configure these modes, use the following settings:

- For regular operation, set the `mode` value to `"normal"`.
- To pause the plugin (all devices will become non-responsive), set the `mode` value to `"paused"`.
- To reset the plugin (remove associated accessories), set the `mode` value to `"reset"`.

It is crucial to note that if you set the plugin to "Reset" mode, the plugin will initiate a countdown with warnings, and __you have approximately 30 seconds to reverse the setting and restart Homebridge before all accessories related to this plugin are removed__.

This precautionary measure is in place to avoid unintended resets that could lead to the time-consuming task of reconfiguring automations and accessories.

## Specifying the Synchronization Speed
Typically, the plugin triggers every second to assess whether sync check signals or keep-alive signals should be dispatched.

However, for certain consumer routers, this plugin may induce a network slowdown, and on older devices incompatible with newer OpenSSL versions (`v3.1`), may result in sustained 100% CPU usage. In an attempt to address both issues, adjust the firing interval using the following settings:

- For "Normal" operation speed, set the `speed` value to `1`.
- For "Moderate" operation speed, set the `speed` value to `0.75`.
- For "Slower" operation speed, set the `speed` value to `0.5`.
- For "Slowest" operation speed, set the `speed` value to `0.25`.

If the plugin does not operate under "Normal" mode, a warning will be issued on every startup, and this warning cannot be disabled.

## Specifying Advanced Options
Each alarm system is uniquely designed, and at times, functionalities may not align with your preferences.

The options provided give you the flexibility to deactivate specific aspects of the plugin; however, please exercise caution, as doing so may result in the loss of expected functionality.

- __To disable the "Alarm Ringing" switch:__
  - Include the `"disableAlarmRingingSwitch"` value in the `options` array.
  - ⚠️ Enabling this option will prevent you from being able to silence a ringing alarm when the system is in "Disarmed" mode.
- __To ignore "Sensor Problem" statuses:__
  - Include the `"ignoreSensorProblemStatus"` value in the `options` array.
  - ⚠️ Enabling this option will prevent you from being able to silence a ringing alarm triggered by a "Sensor Problem" or "Sensor Problems" status.

If the `options` array is not empty (e.g. `[]`), a warning will be displayed upon every startup, and this warning cannot be disabled.

## Specifying the Sensors
In the past, this plugin would automatically detect sensors and dynamically manage their addition and removal based on its observations.

However, this approach posed challenges. If the plugin failed to detect sensors or encountered portal irregularities, it could unintentionally remove all sensors, resulting in an inadvertent reset.

While a setting was introduced (before `v3.0.0`) to prevent the removal of obsolete zones, over time, it felt more like a workaround than a solution.

In this updated version of the plugin, I have implemented a new requirement that users must explicitly specify each sensor they wish to integrate into Homebridge.

All sensors are now organized within an array of objects, with each object containing the following settings:
- __Name__ (`name`)
  - For display purposes (offers clarity in the event of an unforeseen reset).
- __ADT Name__ (`adtName`)
  - Must match the name shown under the "Name" column in the "System" tab when logged into the portal.
- __ADT Zone__ (`adtZone`)
  - Must match the zone shown under the "Zone" column in the "System" tab when logged into the portal.
  - For compatibility reasons, only devices with zones 1 through 99 are supported.
- __ADT Type__ (`adtType`)
  - Must match the type shown under the "Device Type" column in the "System" tab when logged into the portal.
  - For example, if the type is "Door/Window Sensor", the value should be `doorWindow`. Read the [Supported Devices](#supported-devices) section for more information.

If you do not wish to add sensors, simply assign an empty array (e.g. `[]`). However, it is advisable to include all supported sensors, as having none does not optimize plugin performance.

If you do not find the supported type listed, please note that the plugin will notify me. Do not create a separate issue on GitHub. I am actively working on adding support as soon as I gather sufficient information to determine the statuses displayed on the portal.

Your patience is appreciated as I address and incorporate the necessary updates.

## Force Arming (Arm Away / Arm Stay / Arm Night)
Due to the way how the Home app (the HAP protocol) establishes arm states, the plugin will force arm upon detecting active motion or open sensors. Disabling this feature is not possible, as this will result in arming failures without alert notifications.

If you are concerned about this, please read the instructions below to check the status of the sensors in your home before arming your system:

1. Open the Home app
2. Tap the dotted circle (`...`) (located on the top right of the screen)
3. View the sensors that require attention and resolve those issues

If you have set up automation, __you acknowledge that this will happen__ and accept the risks of the system not completely arming itself.

## Arm Night Support
As for ADT Pulse systems, __Arm Night__ is only available for use through the panel itself. Although it is not visible on the Web Portal or the mobile app, you can still place your system in __Arm Night__ mode with this plugin.

## Debug Mode
Previously, there was a setting to allow users to switch the plugin to debug mode. Over time, it became apparent that this setting made resolving issues excessively challenging.

Consumers would enable debug mode, but forget to also enable Homebridge debug mode, causing contributors to not be able to effectively resolve bug reports.

To improve this, debug mode is now activated __ONLY when debug mode is enabled on Homebridge__ itself. This approach promotes isolation (logs can be separated for each bridge) and helps enhance the troubleshooting experience in case any issues arise.

## API Test and REPL Playground Scripts
If any unusual occurrences arise, utilize the provided `test-api` or `repl` commands within this plugin to troubleshoot potential issues.

- To confirm if the plugin is communicating with the portal correctly, use the `npm run test-api` command.
- To access the playground (Read-eval-print loop mode), use the `npm run repl` command.

Ensure you are inside the `node_modules/homebridge-adt-pulse` directory when attempting to access these commands. The location of `node_modules` may vary based on the system you are using:
- [Raspbian](https://github.com/homebridge/homebridge/wiki/Install-Homebridge-on-Raspbian#configuration-reference)
- [Debian or Ubuntu Linux](https://github.com/homebridge/homebridge/wiki/Install-Homebridge-on-Debian-or-Ubuntu-Linux#configuration-reference)
- [Red Hat, CentOS or Fedora Linux](https://github.com/homebridge/homebridge/wiki/Install-Homebridge-on-Red-Hat%2C-CentOS-or-Fedora-Linux#configuration-reference)
- [Arch Linux](https://github.com/homebridge/homebridge/wiki/Install-Homebridge-on-Arch-Linux#configuration-reference)
- [macOS](https://github.com/homebridge/homebridge/wiki/Install-Homebridge-on-macOS#configuration-reference)
- [Windows 10 Using Hyper V](https://github.com/homebridge/homebridge/wiki/Install-Homebridge-on-Windows-10-Using-Hyper-V#configuration-reference)
- [Docker](https://github.com/homebridge/homebridge/wiki/Install-Homebridge-on-Docker#configuration-reference)
- [Unraid](https://github.com/homebridge/docker-homebridge/wiki/Homebridge-on-Unraid#configuration-reference)
- [TrueNAS Scale](https://github.com/homebridge/docker-homebridge/wiki/Homebridge-on-TrueNAS-Scale#configuration-reference)
- [Synology DSM](https://github.com/homebridge/homebridge/wiki/Install-Homebridge-on-Synology-DSM#configuration-reference)

## Temperature Sensors in HAP Protocol
The Temperature Sensor (`temperature`) functions differently compared to standard contact sensors when it comes to processing sensor statuses.

In contrast to typical contact sensors that convey open or closed status, the temperature sensor exposed in the Home app (utilizing the HAP protocol) operates with temperature values. To accommodate this difference, the accessory converts these binary states into corresponding temperature degrees:
- Normal temperatures are represented as __0°C__.
- Abnormal temperatures are represented as __100°C__.

## Support for HOOBS
Please note that HOOBS may use an outdated configuration UI. This issue that I reported, remains unresolved by the HOOBS team. For additional details, refer to this [GitHub issue](https://github.com/hoobs-org/HOOBS/issues/1873).

In the interim, HOOBS users should manually configure the plugin using the [sample configuration](#configuration) provided above. For those technically inclined, consider replacing the HOOBS software with [Homebridge](https://github.com/homebridge/homebridge/wiki).

__Note:__ Based on user complaints on [Reddit](https://www.reddit.com/r/HOOBS/), it appears that HOOBS developers have stopped working on the product. Support will be offered on a "best effort" basis, and the official status will be pulled.

## Accidental Removal of Stale Accessories
While not mandatory, it's highly advisable to take precautions in case of unexpected events, such as a plugin failing to initialize that leads to Homebridge automatically removing all outdated accessories, potentially disrupting automations and customizations.

To safeguard against such scenarios, consider the following options:
- Enable the **Keep Accessories Of Disabled/Uninstalled Platform Plugins** setting in Homebridge.
  - Or add the `-K` or `--keep-orphans` option when running via commands.
- Create a backup using the [Home+](https://hochgatterer.me/home+/) app by Matthias Hochgatterer after making changes.

## Documentation, Logging, and Detection
This function comes with a built-in feature to notify me if the plugin detects anomalies in the states of sensors and panel statuses. In the event of such occurrences, especially when these statuses are undocumented, I will receive notifications.

__Be assured that this plugin strictly adheres to the [verified Homebridge plugin](https://github.com/homebridge/homebridge/wiki/verified-Plugins#verified-plugins) requirements, ensuring that it does not track users in any manner.__

If the information sent includes personally identifiable details, such as IP addresses, MAC addresses, or serial numbers, those fields will be automatically redacted (replaced with `*** REDACTED FOR PRIVACY ***`) since they are unwanted information needed to improve the plugin.

To reinforce this, a warning will be issued each time you utilize the included scripts, start the plugin, or when the plugin is about to notify me, serving as a reminder of these privacy measures.

Here is an example of the information I see when the plugin detects unknown statuses from the gateway:
```json
{
  "communication": {
    "broadbandConnectionStatus": "Active",
    "cellularConnectionStatus": "N/A",
    "cellularSignalStrength": "N/A",
    "primaryConnectionType": "Broadband"
  },
  "manufacturer": "ADT Pulse Gateway",
  "model": "PGZNG1",
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
    "last": "*** REDACTED FOR PRIVACY ***",
    "next": "*** REDACTED FOR PRIVACY ***"
  },
  "versions": {
    "firmware": "1.0.0-9",
    "hardware": "HW=2, BL=1.0.0, PL=1.0.0, SKU=12345"
  }
}
```
__Note:__ If you prefer to prevent this functionality, you can block the URL that the plugin utilizes to notify me. However, it is essential to note that I will not be able to offer assistance or support if you choose to impede the plugin from fulfilling its purpose to the best of its capabilities.

__Note 2:__ In certain scenarios, the plugin may identify anomalies while parsing portal data. Such reports may contain raw HTML data (redacted in the logs). To ensure prompt updates, the raw HTML sent to me will remain unfiltered.

## Credits and Appreciation
If you find value in the ongoing development of this plugin and wish to express your appreciation, you have the option to become my supporter on [GitHub Sponsors](https://github.com/sponsors/mrjackyliang)!

Moreover, I extend a special acknowledgment and heartfelt gratitude to the following individuals:
- [@kevinmhickey](https://github.com/kevinmhickey) - For the inspiration to build a better script used in `v1.0.0` through `v2.2.0`.
- [@rlippmann](https://github.com/rlippmann) - For successfully reverse engineering the browser fingerprinting script for ADT Pulse's 2-factor authentication.
- [@Danimal4326](https://github.com/Danimal4326) - For successfully identifying the solution for ADT Pulse's 2-factor authentication and for contributions toward the successful development of `v3.0.0`.
- [@sapireli](https://github.com/sapireli) - For contributions toward the successful development of `v3.0.0`.
- [@hapinstance](https://github.com/hapinstance) - For contributions toward the successful development of `v3.0.0`.
- [@thcooley](https://github.com/thcooley) - For contributions toward the successful development of `v3.0.0`.

Their contributions and time spent have significantly enhanced the functionality and reliability of this plugin.
