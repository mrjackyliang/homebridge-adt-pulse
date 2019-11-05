ADT Pulse for Homebridge
=========================

This is a Homebridge plugin for ADT Pulse users that allows homeowners to control their security systems and view sensor status through HomeKit. The API relies on the ADT Pulse Web Portal (powered by Icontrol One).

To use this plugin, here are two simple steps you need to follow:
1. Run `npm install homebridge-adt-pulse`
2. Configure the plugin using the configuration below.
3. Restart Homebridge.

You can also search `adt-pulse` using [Onzu's Homebridge Config UI](https://github.com/oznu/homebridge-config-ui-x). Then proceed to configure with the instructions below.

## Configuration
When configuring this plugin, simply add the platform to your existing `config.json` file. Mind that the `platform` name must always be `ADTPulse`.
```json
{
  "platforms": [
    {
      "platform": "ADTPulse",
      "name": "ADT-Pulse",
      "username": "email@email.com",
      "password": "1234567890",
      "logLevel": 30
    },
    {
      "platform": "...",
      "name": "..."
    }
  ]
}
```

## Plugin Limitations
Even though the name is stated as "ADT Pulse for Homebridge", this Homebridge plugin is limited in the hardware it may support. This plugin is NOT a complete replacement to the [official ADT Pulse app](https://www.adt.com/help/faq/adt-pulse/adt-pulse-mobile-app).

The supported hardware configurations are listed below:
1. ADT Security Panel (`system`)
2. ADT Door/Window Sensors (`doorWindow`)
3. ADT Glass Break Detectors (`glass`)
4. ADT Motion Sensors (`motion`)
5. ADT Carbon Monoxide Detector (`co`)
6. ADT Fire (Smoke/Heat) Detector (`fire`)

If you have a sensor that is unsupported by this plugin, please [request a feature](https://github.com/mrjackyliang/homebridge-adt-pulse/issues/new?template=feature_request.md) so I can add support for it into the plugin.

Please mind that I DO NOT have plans to support smart devices or cameras connected to the ADT Pulse service. I recommend using another `homebridge-plugin` or the [official ADT Pulse app](https://www.adt.com/help/faq/adt-pulse/adt-pulse-mobile-app) for that.

## Arm Night Support
As for ADT Pulse systems, __Arm Night__ is only available for use through the panel itself. Although, it is not visible on the Web Portal or the mobile app, you can still place your system in __Arm Night__ mode with this plugin.

Due to the force arming procedure (documented below), __please make sure no devices are open or reporting motion__ as this may render the __Arm Night__ mode less effective.

## Force Arming (Arm Away/Stay)
Due to the nature of how HomeKit and ADT Pulse processes `setDeviceStatus` commands, this plugin will force arm when it detects active motion or open sensors.

__Without force arm, arm away/stay may stall and reset with no error response.__

Before arming, please check the status of your Home (instructions below), as HomeKit will not check if your devices are in an active state.

1. Open Home app.
2. Tap __Details >__ above __Favorite Accessories__.
3. View the __ATTENTION__ area of your home.

## Log Level (Debugging)
Debugging is difficult without the proper information, in such, this plugin offers a way to filter out messages sent to the logs. _Optional._

The default is `30`. Configure `logLevel` with the values below:
* Set `logLevel` to `10` for errors only.
* Set `logLevel` to `20` for warnings (and the above).
* Set `logLevel` to `30` for info (and the above).
* Set `logLevel` to `40` for debug (and the above).
* Set `logLevel` to `50` for verbose (and the above).

NOTE: If the `logLevel` setting is incorrectly specified, a warning will be shown then subsequently set to `30`.

NOTE 2: Don't forget to enable Homebridge Debug Mode when setting `logLevel` to `40` or above or else debug messages won't be shown.

## Test Script
There is a test script included in the package that performs specific actions used by the plugin. Feel free to test it out, and report any bugs you see.

This script requires your username, password, and an action type.
```shell script
node adt-pulse-test.js --username email@email.com --password 12345667890 --action [device-status,zone-status,sync,disarm,arm-away,arm-stay,arm-night] --debug [true,false]
```

## Developer Information
The script provides an active connection to the ADT Pulse portal. Here are a list of must knows, just in case you might want to debug (or improve) the plugin:

1. Device and zone statuses are polled every __4 seconds__. If there are more than 2 login failures, device polling and portal sync stops.
2. Supported versions are `17.0.0-69` and `16.0.0-131`. If this plugin does not support either version, a warning will appear in the logs. Please [create a bug report](https://github.com/mrjackyliang/homebridge-adt-pulse/issues/new?template=bug_report.md) to let me know!

## Credits and Appreciation
If you would like to show your appreciation for its continued development, you can optionally make a small donation to my company, [CBN Ventures](https://cbnventures.io), through [PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=L59Y27M66FG26&source=url).

Also, giving HUGE thanks to [@kevinmkickey](https://github.com/kevinmhickey/adt-pulse) for providing the ADT Pulse script. This plugin would not have happened without this script.
