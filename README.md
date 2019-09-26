ADT Pulse for Homebridge
=========================

This is a Homebridge plugin for ADT Pulse users that allows homeowners to control their security systems and view sensor status through HomeKit. The API relies mostly on the ADT Pulse Portal (powered by Icontrol One).

To use this plugin, here are two simple steps you need to follow:
1. Run `npm install homebridge-adt-pulse`
    1. You can also search `adt-pulse` using Onzu's Homebridge user interface.
2. Configure the plugin using the example below.

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
      "debug": false,
      "refreshInterval": 15,
      "syncInterval": 30
    },
    {
      "platform": "...",
      "name": "..."
    }
  ]
}
```

## Plugin Limitations
Even though the name is stated as "ADT Pulse for Homebridge", this Homebridge plugin is limited in the hardware it may support. This plugin is not a complete replacement to the [official ADT Pulse app](https://www.adt.com/help/faq/adt-pulse/adt-pulse-mobile-app).

The supported hardware configurations are listed below:
1. ADT Security Panel (`system`)
2. ADT Door/Window Sensors (`doorWindow`)
3. ADT Glass Break Detectors (`glass`)
4. ADT Motion Sensors (`motion`)
5. ADT Carbon Monoxide Detector (`co`)
6. ADT Fire (Smoke/Heat) Detector (`fire`)

If you have a sensor that is unsupported by this plugin, [request a feature](https://github.com/mrjackyliang/homebridge-adt-pulse/issues/new?template=Feature_Request.md) so I can add support for it into the plugin.

Please mind that I DO NOT have plans to support smart devices or cameras connected to the ADT Pulse service. I recommend using another `homebridge-plugin` for that.

## Test Script
There is a test script included in the package that performs specific actions used by the plugin. Feel free to test it out, and report any bugs you see.

This script requires your username, password, and an action type.
```shell script
node adt-pulse-test.js --username email@email.com --password 12345667890 --action [device-status,zone-status,sync,disarm,arm-away,arm-stay] --debug [true,false]
```

## Developer Information
The script provides an active connection to the ADT Pulse portal. Here are a list of must knows, just in case you might want to debug (or improve) the plugin:

1. Sync codes are polled every 30 seconds (by default). Only thing stopping it is if there are more than 2 login failures.
2. Device updates are also polled every 15 seconds (by default) and retrieved from the cached data created through the sync code changes above so to not pound the external servers.
3. Current version is `16.0.0-131`. If Web Portal version is changed or updated, a warning will appear in the logs. Please [create a bug report](https://github.com/mrjackyliang/homebridge-adt-pulse/issues/new?template=Bug_Report.md) to let me know!

## Credits and Appreciation
If you would like to show your appreciation for its continued development, you can optionally make a small donation to my company, [CBN Ventures](https://cbnventures.io), through [PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=L59Y27M66FG26&source=url).

Also, giving HUGE thanks to [@kevinmkickey](https://github.com/kevinmhickey/adt-pulse) for providing the ADT Pulse script. This plugin (or any other unofficial ADT Pulse plugin) would not have happened without this script.
