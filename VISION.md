# VISION.md

## Purpose

### Problem Statement

ADT Pulse has no official API and no HomeKit integration, so homeowners cannot control their security system or view sensor status from the Apple Home app. The only programmatic surface is the ADT Pulse Web Portal (powered by Icontrol One, owned by ICN Acquisition LLC, an indirect subsidiary of Alarm.com), which is built for browsers, guarded by 2-factor authentication with device fingerprinting, and subject to unannounced changes. This plugin closes that gap: it emulates a real browser session against the portal so Homebridge can expose the security panel and sensors over the HAP protocol.

### Target Audience

- **ADT Pulse homeowners** - Customers subscribed in the United States (`portal`) or Canada (`portal-ca`) who want to arm and disarm their security system and view sensor status through the Home app.
- **Homebridge users** - People running Homebridge or the Homebridge Config UI who install plugins from npm and configure them through a UI. HOOBS users are supported on a best-effort basis via manual configuration.
- **Advanced users and troubleshooters** - Users comfortable running the bundled `test-api` and `repl` scripts to reproduce portal issues outside of a running Homebridge instance.

### Value Proposition

homebridge-adt-pulse is a verified Homebridge plugin that drives the ADT Pulse Web Portal like a real browser: it authenticates through the portal's 2-factor flow, keeps the session alive, and translates panel and sensor state into HomeKit accessories. A dedicated setup wizard retrieves the required device fingerprint so no external tools are needed, and explicit per-sensor configuration prevents portal irregularities from silently wiping accessories.

## Marketing Copy

### Tagline

Homebridge security system platform for ADT Pulse.

### Elevator Pitch

homebridge-adt-pulse brings your ADT Pulse security system into the Apple Home app. It exposes the ADT Pulse gateway, the security panel (Arm Away, Arm Stay, Arm Night, and Disarm), an Alarm Ringing switch, and nine types of read-only sensors ranging from door/window contacts to carbon monoxide detectors. Because ADT Pulse offers no official API, the plugin emulates a real browser session against the ADT Pulse Web Portal, including its 2-factor authentication, and a built-in setup wizard walks you through login, verification, and device fingerprint retrieval. It is a verified Homebridge plugin serving customers in both the United States and Canada.

### Key Features

- **Full panel control** - Arm Away, Arm Stay, Arm Night, and Disarm from the Home app, including Arm Night mode that the ADT Pulse Web Portal and mobile app do not expose.
- **Nine sensor types** - Carbon monoxide, door/window, fire, flood, glass break, heat, motion, shock, and temperature sensors surface as read-only HomeKit accessories.
- **Guided setup wizard** - A custom config UI logs into the portal, handles SMS or email verification, registers a trusted device, retrieves the device fingerprint, and generates the plugin configuration.
- **Alarm Ringing switch** - A dedicated switch for silencing a ringing alarm while the system is in "Disarmed" mode, removable through advanced options.
- **Operational modes and speed control** - "Normal", "Paused", and "Reset" modes plus four synchronization speeds to accommodate older hardware and constrained networks.
- **Anomaly detection with privacy redaction** - Undocumented portal statuses are reported to the plugin author so support can be added, with personally identifiable information automatically redacted.
- **Troubleshooting scripts** - `npm run test-api` exercises the portal end to end with your own credentials; `npm run repl` opens an interactive playground over the API and auth helpers.

### Differentiators

| This project                                                                            | Alternatives                                                           |
|-----------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| Controls the panel and reads sensors from the Home app via the HAP protocol             | No official ADT Pulse API or HomeKit integration exists                |
| Setup wizard retrieves the 2FA device fingerprint for you (since v3.4.0)                | External fingerprint-extraction tools operated by hand                 |
| Explicitly declared sensors keep accessories stable through portal irregularities       | Auto-detection (pre-v3.0.0) could silently remove every sensor         |
| Emulates a real browser session, including fabricated Dynatrace instrumentation headers | Naive scripted requests get flagged as automated clients               |
| Debug mode activates only when Homebridge debug mode is on                              | A separate plugin debug flag users forgot to pair with Homebridge logs |
| Undocumented portal states are auto-reported (PII redacted, no user tracking)           | Waiting for users to notice breakage and file GitHub issues            |

## Glossary

| Term                  | Definition                                                                                                                                                       |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ADT Pulse             | The ADT home security service this plugin integrates with.                                                                                                       |
| Portal                | The ADT Pulse Web Portal (powered by Icontrol One), the plugin's only data source. The `subdomain` setting selects `portal` (US) or `portal-ca` (Canada).        |
| HAP                   | HomeKit Accessory Protocol, the protocol the Home app speaks. Homebridge exposes this plugin's accessories over it.                                              |
| Homebridge            | The Node.js server that hosts this plugin (`^1.11.0` or `^2.0.0-beta.0` per `engines`).                                                                          |
| Platform              | The Homebridge plugin type this project registers: `ADTPulse`, implemented by `ADTPulsePlatform`.                                                                |
| Gateway               | The ADT Pulse gateway device; exposed by default alongside the panel and switch.                                                                                 |
| Security panel        | The alarm panel accessory; supports Arm Away, Arm Stay, Arm Night, and Disarm.                                                                                   |
| Alarm Ringing switch  | The `panelSwitch` accessory used to silence a ringing alarm while the system is in "Disarmed" mode.                                                              |
| Sensor                | A portal device declared explicitly in config via `name`, `adtName`, `adtZone`, and `adtType`. Zones 1 through 99 are supported.                                 |
| Condensed sensor type | One of the nine `adtType` slugs: `co`, `doorWindow`, `fire`, `flood`, `glass`, `heat`, `motion`, `shock`, `temperature`.                                         |
| Fingerprint           | The base64 device fingerprint the portal requires for 2-factor logins. Retrieved by the setup wizard; components can be fabricated by `src/lib/fake.ts`.         |
| MFA / Trusted device  | The portal's 2-factor flow: request an SMS or email one-time passcode, validate it, and register a trusted device (`src/lib/auth.ts`).                           |
| Sync check            | The periodic portal signal that reports whether device state changed. Dispatched on the platform's interval, scaled by the `speed` setting.                      |
| Keep-alive            | The periodic portal signal that keeps the logged-in session from expiring.                                                                                       |
| Orb                   | The portal summary page's status area. The plugin scrapes its security buttons (arm/disarm) and sensor rows (`getOrbSecurityButtons`, `textOrbSensorZone`).      |
| Do submit handler     | A portal JavaScript handler scraped from the summary page; carries the relative URLs, arm states, and `sat` token needed to issue arm/disarm commands.           |
| sat                   | A session token the portal embeds in request URLs and scraped handlers; portal commands must include it (`paramSat`, `objectKeySat` in `src/lib/regex.ts`).      |
| Force arm             | The plugin's automatic bypass of open or active sensors when arming, required because the HAP protocol cannot prompt the user (`forceArmHandler`).               |
| Detect report         | A redacted anomaly payload sent to the plugin author when unknown devices or statuses are parsed (`src/lib/detect.ts`, `removePersonalIdentifiableInformation`). |
| Operational mode      | The `mode` setting: `normal`, `paused` (devices non-responsive), or `reset` (removes plugin accessories after an approximately 40-second warning window).        |
