# homebridge-adt-pulse

## 3.5.1 - 2026-09-23

### UPDATED
- Updated Nova and its Docusaurus preset to 0.27.3 across the project, plugin, configuration UI, and docs, granted the generated inactive-thread workflow write access to pull requests, and approved the optional `fsevents` install script used by macOS file watchers.

## 3.5.0 - 2026-09-17

### UPDATED
- Standardized the plugin test files as `vitest.config.mts` and `vitest.setup.ts`.
- Reorganized the project into a monorepo with separate plugin, configuration UI, and documentation workspaces, root-level orchestration, stricter TypeScript validation, expanded diagnostics, and Nova-managed release and support automation.
- Declared reviewed root dependency install scripts as denied so clean npm installs have an explicit trust policy.
- Enabled automatic cleanup of merged GitHub branches and strict package.json key validation across every workspace.
- Updated Chalk to 5.6.2, Lodash to 4.18.1, Zod to 4.4.3, TypeScript to 6.0.3, ESLint to 9.39.5, and Vitest to 4.1.11.
- Documentation site meta description is now sourced from the shared Nova identity configuration instead of a hardcoded string.
- Normalized the package author URL to the canonical trailing-slash form.
- Updated the plugin Vitest configuration to use the shared 30-second timeout and serial test sequencing.
- Synced PROJECT_RULES.md with the new apps/ and packages/ workspace layout, build commands, and CI workflows.
- Rendered both diagnostic command banners with Nova CLIHeader at a consistent fixed width.
- Updated the REPL and API tester banners to use live Nova identity in source and a packaged identity snapshot after build.
- Named new ADT trusted devices with the Homebridge instance name and a UUID instead of a timestamp.

### FIXED
- Fixed login flow checking the wrong HTTP response status after the sign-in POST, which caused sign-in failures to be silently ignored.
- Fixed the runtime configuration validator accepting 148 sensors even though Homebridge reserves three of its 150 accessory slots; it now enforces the documented maximum of 147.
- Fixed panel switch accessory permanently locking up when an arm or disarm call throws an exception.
- Fixed trusted-device authentication requests that failed to reject HTTP error responses.
- Pinned the app, React plugin, and test runner to Vite 7.3.6 so the complete Vite 7 toolchain includes the upstream development server path-handling fix.
- Fixed orb sensor parser silently including sensors with invalid zone numbers.
- Fixed the API tester treating responses without success: true as successful, preventing false passes.
- Fixed access code change flag always evaluating to true due to incorrect boolean string parsing.
- Included Nova as a runtime dependency so installed REPL and API tester commands can load their CLI header without development dependencies.
- Validated custom sensor names against HomeKit naming rules and used ADT-derived names when the custom field is blank.
- Fixed the API tester header spacing to match the REPL before its introductory content.
- Used HomeKit-safe display names for ADT sensors with trailing numbered parentheses while preserving portal names and custom labels.
- Removed a redundant CommonJS export condition from the ESM package manifest so its entry point stays unambiguous.

### ADDED
- Generated new trusted-device fingerprints from current Stable Chrome, Edge, Firefox, or Opera releases, with a verified local cache and a packaged build snapshot when release feeds are unavailable. Kept request headers aligned with the saved browser identity and used modern Windows desktop fonts, plugins, and screen sizes.
- Added a searchable Docusaurus documentation site with setup, configuration, operations, platform support, and reference guides backed by automated content checks.
- Added `hap-repl` and `hap-test-api` executables so users can run diagnostics without entering the plugin's `node_modules` directory.
- Enabled lock-step versioning so the plugin and its bundled configuration UI keep the same release version.

## 3.4.20 - 2026-02-19

### FIXED
- Sensor and device log messages that previously showed "undefined" for devices without a custom name now fall back to the ADT-assigned name (`adtName`).

## 3.4.19 - 2026-02-15

### UPDATED
- Extended support to all current Node.js LTS versions.

## 3.4.18 - 2026-01-02

### FIXED
- Corrected reading of the plugin's `package.json` version, since Homebridge does not support importing JSON files directly.

## 3.4.17 - 2026-01-02

### UPDATED
- Changed the detector report URL.

### FIXED
- Corrected the outdated-plugin check, which reported incorrect results because of an issue with the `latest-version` dependency.

## 3.4.16 - 2025-11-06

### UPDATED
- Added support for the latest ADT Pulse portal version (30.0.0-61).

## 3.4.15 - 2025-10-17

### FIXED
- Corrected the declared Node.js engine range (`>=22` to `^22`), which was causing an `EBADENGINE` error during installation.

## 3.4.14 - 2025-10-17

### UPDATED
- Bumped dependencies to resolve known vulnerabilities.
- Updated Node.js compatibility to version 22.

### FIXED
- Corrected an incorrect Homebridge compatibility range.

## 3.4.13 - 2025-08-08

### FIXED
- Fixed the `postinstall` script running before `devDependencies` were installed when the package was installed globally, which could break setup.

## 3.4.12 - 2025-06-16

### ADDED
- Documented the "PERSONAL EMERGENCY ALARM" security panel note.

## 3.4.11 - 2025-04-09

### FIXED
- Restored the `postinstall` script, which was missing from the previous release and could prevent installation from completing.

## 3.4.10 - 2025-04-09

### UPDATED
- The `postinstall` script now only rebuilds the plugin automatically when `devDependencies` are installed, simplified from an earlier check that also looked for a missing `build` folder.

## 3.4.9 - 2025-04-09

### UPDATED
- Added an empty-string arm state to the orb security button detection to account for a portal inconsistency.

## 3.4.8 - 2025-02-28

### ADDED
- Documented the "SILENT PANIC ALARM" security panel note.

## 3.4.7 - 2025-01-28

### FIXED
- Corrected orb security buttons not being detected when the arm state was empty.

## 3.4.6 - 2025-01-09

### FIXED
- Corrected misdetection of the "Security Panel - Impassa/SCW" security panel.

## 3.4.5 - 2025-01-08

### UPDATED
- Updated package dependencies.
- Changed the detector report URL.
- Made minor changes to the configuration UI.
- Caught error objects are now validated before being serialized for logging.

### FIXED
- Corrected TypeScript type punctuation and missing `.js` extensions on React component imports.
- Added the missing `key` prop on the setup verification method form select.

### ADDED
- Added security panel support for "DSC Impassa/SCW".
- Added the package version to the title of debug information sent to the plugin author.

## 3.4.4 - 2024-11-08

### UPDATED
- Added support for the latest ADT Pulse portal version (29.0.0-28).
- Updated dependencies.

## 3.4.3 - 2024-09-24

### FIXED
- Corrected the Homebridge v2.0 beta engine version requirement.

### ADDED
- Added the "Installing" sensor status for devices currently being installed.
- Added the "Tripped" status for door/window sensors.

## 3.4.2 - 2024-09-13

### UPDATED
- Updated the sensor title design on the Sensors tab of the settings UI.
- Verified compatibility with Homebridge v2.0.0-beta.20.

## 3.4.1 - 2024-09-11

### UPDATED
- Updated the settings UI sensor title design and internal `http` types.

### FIXED
- Fixed the settings page failing to load in development mode.

## 3.4.0 - 2024-08-19

### UPDATED
- Changed the plugin license from Apache-2.0 to MIT.
- The outdated-plugin check now compares semantic versions instead of using an equality check.
- Lowered the minimum sensor name length to accommodate the new settings panel.
- Swapped the display order of the ADT sensor zone and type fields.
- The authentication API now properly surfaces login error messages during verification method retrieval.

### FIXED
- Fixed `isMaintenancePeriod()` incorrectly including the next day when checking the maintenance window's end time.

### ADDED
- Added a new settings panel, with the classic settings panel still available via Plugin tab > Classic View.

## 3.3.5 - 2024-08-12

### UPDATED
- Renamed the `ADTPulse` class to `ADTPulseAPI` for clarity, alongside a new `ADTPulseAuth` class that handles initial setup.
- Moved `subdomain` from the `credentials` type into a shared `connection` type.
- Made the credentials type (username, password, fingerprint) shared across the codebase.

### FIXED
- Fixed false-positive orb security button detection caused by a wording change in the "Status Unavailable" text.
- Renamed `syncCheckRequestPath` to `axiosSyncCheckRequestPath`.

### ADDED
- Added a plugin setup wizard.
- Added the `ADTPulseAuth` class for authorizing a randomly generated browser fingerprint.
- Added security panel support for "DSC PowerSeries/ADT PremisePro".
- Added `armState` support for sensor testing mode (`sensortest`).
- Added "EXIT FAULT ALARM" to the panel notes.

### REMOVED
- Removed the device fingerprint detector tool, since correct fingerprints could no longer be generated due to changes in canvas and screen resolution detection.
- Removed `colorLog` from REPL mode in favor of the more mature `debugLog`.

## 3.3.1 - 2024-04-09

### REMOVED
- Removed detection of new gateway firmware and hardware versions.

## 3.3.0 - 2024-04-02

### UPDATED
- The `options` and `sensors` configuration fields now default to an empty array when missing, instead of causing a Homebridge configuration error.
- Improved performance of `ignoreSensorProblemStatus` checks.
- Adjusted the configuration parsing warning message.

### FIXED
- Corrected the `fingerprint` field's maximum length in the configuration schema (10240, not 5120).
- Corrected the `sensors` field's maximum items in the configuration schema (147, not 148) to account for the "Alarm Ringing" switch.

### ADDED
- Added support for portal version "28.0.0-57".

## 3.2.15 - 2024-03-29

### FIXED
- Removed the sensor length mismatch detector due to false-positive reports. The plugin now uses the configured sensor list as the source of truth.

## 3.2.14 - 2024-03-28

### UPDATED
- Sensor information/status count mismatch reports now include the raw HTML for both pages to help diagnose the issue further.
- Changed the force-arm handler path from `.p_armDisarmWrapper input` to `.p_whiteBoxMiddleCenter .p_armDisarmWrapper input`.
- Improved detection of `forceArmHandler` anomalies.

### REMOVED
- The temporary detector for the `devStatTamper` sensor mismatch bug.

## 3.2.13 - 2024-03-28

### UPDATED
- Adjusted the temporary detector used to find the `devStatTamper` sensor mismatch bug.

## 3.2.12 - 2024-03-27

### UPDATED
- Improved detection of `getSensorsStatus` anomalies for systems that don't have any sensors.
- Improved detection of `forceArmHandler` anomalies when the JSDOM path becomes invalid.
- Gateway descriptions now include exact hardware (HW), boot loader (BL), and platform loader (PL) versions, plus SKU numbers.
- The API now checks for 400 and 500 error statuses.
- Simplified the check for force-arm buttons.

### ADDED
- Gateway support for ADT Pulse Gateway iHub-3001 (HW 3.4 / BL 1.4 / PL 24.0.0-9 / SKU 0YUC1500MY5 / Broadband).
- A temporary detector to help find a sensor mismatch bug involving `devStatTamper` sensors.

## 3.2.11 - 2024-03-11

### UPDATED
- Improved detection of unknown orb security button collections and sensor statuses.

## 3.2.10 - 2024-03-09

### UPDATED
- Documented gateways no longer track "Broadband Connection Status", "Cellular Connection Status", or "Cellular Signal Strength" due to unnecessarily frequent updates.
- Documented security panels no longer track "Emergency Keys" due to unnecessarily frequent updates.

## 3.2.9 - 2024-03-06

### UPDATED
- Updated the TypeScript build configuration.

### ADDED
- Panel documentation for Ademco LYNX/ADT QuickConnect (Emergency Keys PE 95/FA 96/APA 99).

## 3.2.8 - 2024-03-02

### ADDED
- Button documentation for the "Clear Alarm" button.

## 3.2.7 - 2024-02-26

### ADDED
- Gateway documentation for ADT Pulse Gateway iHub-3001 (HW 3.4 / BL 1.4).

## 3.2.6 - 2024-02-24

### ADDED
- Gateway documentation for ADT Pulse Gateway iHub-3001 (HW 3.4, Broadband Unavailable).
- Gateway documentation for ADT TSSC Lifestyle Module (HW 1, Broadband Active).
- Gateway documentation for ADT TSSC Lifestyle Module (HW 1, Broadband Unavailable).
- Gateway documentation for ADT TSSC Lifestyle Module (HW 2, Broadband Unavailable).
- Gateway documentation for Compact SMA Protocol Gateway (HW 2, Broadband Unavailable).
- Gateway documentation for Lynx/QuickConnect Cellular-Only Gateway (HW 2, Cellular Unavailable).
- Panel documentation for Honeywell Security Vista-20PSIA (Emergency Keys PE 95/FA 96/APA 99).

## 3.2.5 - 2024-02-23

### ADDED
- Support for shock sensor statuses.
- Gateway documentation for ADT Pulse Gateway PGZNG1 (HW 1, Broadband Unavailable).
- Gateway documentation for Compact SMA Protocol Gateway (HW 2, Cellular Unavailable).
- Audible panic alarm emergency key for the Ademco LYNX/ADT QuickConnect Security Panel.

## 3.2.4 - 2024-02-21

### UPDATED
- Improved gateway manufacturer/model naming for NETGEAR and iControl devices.

### FIXED
- "Unknown Device Type (Notable Events Only)" was accidentally parsed as a sensor from the sensors table.

### ADDED
- Gateway documentation for ADT Pulse Gateway iHub-3001 (HW 3.4 / Broadband).
- Gateway documentation for Compact SMA Protocol Gateway (HW 2 / Broadband).
- Panel documentation for LYNX/QuickConnect (3 emergency keys).
- Panel documentation for GE Security Concord 4.

## 3.2.3 - 2024-02-19

### UPDATED
- Enhanced handling of clean vs. dirty session `armState`.

## 3.2.2 - 2024-02-19

### UPDATED
- Added descriptions for each documented "do submit handler", "orb security button", "gateway", and "security panel" item collection.

### ADDED
- Gateway documentation for ADT Pulse Gateway (HW 2, with internet unavailable status).
- A collection of orb security buttons for when the system is unavailable.

## 3.2.1 - 2024-02-18

### ADDED
- A button collection for when the system is disarming.

## 3.2.0 - 2024-02-18

### UPDATED
- Separated the logic for getting orb security buttons into its own method (`getOrbSecurityButtons`).
- Combined the clean and dirty state checks for when the user is arming to the current state and the alarm isn't active.
- Reworded the debug logs about stale login sessions.
- Enhanced parsing of gateway and security panel manufacturer/model information.

### FIXED
- The alarm not consistently triggering when the panel status showed "Sensor Problem".

### ADDED
- Orb security button collections for "Arming Away", "Arming Stay", and "Disarm, Arm Away, Arm Stay".

## 3.1.9 - 2024-02-17

### ADDED
- Gateway documentation for ADT Pulse Gateway (HW 1).
- Gateway documentation for Lynx/QuickConnect Cellular-Only Gateway.
- Panel documentation for LYNX/QuickConnect.

## 3.1.8 - 2024-02-17

### UPDATED
- The `test-api` script now shows validation errors from `zod` when a configuration fails to parse.
- Clarified the error message shown when the plugin detects an invalid configuration.

## 3.1.7 - 2024-02-17

### ADDED
- Panel documentation for TSSC Life Safety Module (3 emergency keys).

## 3.1.6 - 2024-02-17

### UPDATED
- `removePersonalIdentifiableInformation` now also includes a device's last update and next update timing.

### FIXED
- `removePersonalIdentifiableInformation` was not properly redacting some information stored as arrays of strings.

### ADDED
- Gateway and panel documentation for TSSC Lifestyle Module.

## 3.1.5 - 2024-02-16

### FIXED
- `removePersonalIdentifiableInformation` incorrectly converted an array of strings into an object of characters.

### ADDED
- Gateway documentation for Compact SMA Protocol Gateway (Cellular mode).
- Panel documentation for Impassa SCW9057 Security Panel.

## 3.1.4 - 2024-02-16

### FIXED
- `removePersonalIdentifiableInformation` did not properly remove information in arrays nested inside objects.

### ADDED
- Documentation for a collection of security buttons and force-arm buttons.
- Panel documentation for Safewatch Pro Security Panel (with 3 emergency key buttons).

## 3.1.3 - 2024-02-16

### UPDATED
- Limited sensor zones to Zone 1 through 99 to prevent unwanted rogue devices from appearing as sensors.
- Reorganized naming conventions for documented items into collections, devices, and items for clarity.
- Rewrote the debug parser detector to better detect parsing anomalies.
- The internal hashing function now only accepts objects and arrays of objects, avoiding hashing data that doesn't need it (e.g. "Last Update" or raw HTML).
- Debug logs no longer include raw HTML since it filled the screen with information best sent directly to the plugin author.
- Reworded debug logs about stale login sessions.

### FIXED
- Missing "Tampered" status documentation in sensor statuses.

### ADDED
- Keep-alive requests now check for error codes so logs aren't unnecessarily spammed.
- A privacy notice in the README noting that anomaly reports sent to the plugin author include unfiltered raw HTML.

### REMOVED
- The on-screen reminder shown when anomaly detection reports are sent, since raw HTML is no longer included in logs.

## 3.1.2 - 2024-02-02

### FIXED
- Fixed cases where the fingerprint value could be longer than the recommended length of 5120 characters.

## 3.1.1 - 2024-01-29

### UPDATED
- Improved README grammar and wording.
- If advanced options were specified in the configuration, the list of enabled options now prints to the log.

### FIXED
- "Unknown Device Type" is now excluded from the sensors list since it does not report a status.

### ADDED
- Partial documentation for PowerSeries/PremisePro security panels.

## 3.1.0 - 2024-01-26

### ADDED
- New advanced options to disable the "Alarm Ringing" switch and to ignore "Sensor Problem" status. Existing configurations must add `"options": []` before upgrading, or the plugin will fail to start.

### PLEASE READ
- The configuration has changed. Please add `"options": [],` to the configuration before upgrading or you will not be able to start the plugin.

## 3.0.6 - 2024-01-25

### UPDATED
- CO alarm statuses have been manually tested and confirmed.
- The plugin will no longer send a detector report for a sensor info/status mismatch if one side is empty and the other isn't (and vice versa).
- Added documentation clarifying that "Sensor Problem"/"Sensor Problems" statuses will constantly show as "Triggered" in the Home app.

### FIXED
- Removed the `publish` script, since it caused unexpected issues during `npm install` and `npm publish`.

## 3.0.5 - 2024-01-24

### ADDED
- Documentation for Lynx/QuickConnect Cellular-Only Gateway.
- "Security Panel Master Code:" and "Serial Number:" to the list of keys redacted when sending information via detectors.
- Acknowledgement for @rlippmann for reverse engineering the browser fingerprinting script used for ADT Pulse's two-factor authentication.

## 3.0.4 - 2024-01-19

### UPDATED
- Simplified directory traversal toward the `./build` folder structure so it no longer includes `src`.
- Updated README instructions to include `panelSwitch` and clearer directions for manually setting up `adtType`.
- The "Alarm Ringing" switch now applies to all alarm scenarios instead of just "Disarmed" mode, since "Alarm Ringing while Disarmed" was too long a name.

## 3.0.3 - 2024-01-19

### UPDATED
- The plugin now properly detects ADT Pulse Gateway systems with no WAN IP address.

### FIXED
- Checks for when no force-arming is required (no "do submit" handlers available).

## 3.0.2 - 2024-01-18

### UPDATED
- Improved detection in `fetchTableCells()` to skip incremented nodes with empty strings and nodes with zero length.
- Better detection for gateway names.

## 3.0.1 - 2024-01-18

### UPDATED
- `parseSensorsTable()` now skips devices with a "System/Supervisory" device type.
- Renamed detector functions to better reflect whether they should be called from the API or the platform.
- Updated the detector reporting URL.
- Rewrote the detector reminder message and moved it to after the report content.

### FIXED
- Incorrect detection of "Status Tampered" in connection with a "Trouble" status.
- `generateFakeReadyButtons()` incorrectly added an Arm Night button, which is not available in the portal.
- The type for `StackTracerError` was incorrectly defined.

### ADDED
- Sensor status support for "Tampered".

### REMOVED
- Support for "System/Supervisory" as a sensor, since it does not show a status on the summary page.

## 3.0.0 - 2024-01-14

Official v3.0.0 release.

### UPDATED
- Temperature sensors are now properly reflected as a binary response.
- Corrected `isAlarmActive` to not accept `undefined` as a value when setting the panel status.
- Renamed the ADT Pulse Accessory "Status" characteristic to "Activity".
- Renamed `adtSessionMax` to `adtSessionLifespan` to better describe the time login sessions remain active before going stale.
- `getPanelStatus` can now return `SecuritySystemCurrentState` characteristic values while the system is busy setting panel status.
- Improved documentation throughout the panel status-setting process.
- "Trouble" statuses from sensors now indicate a sensor tamper and are considered part of the "alarm ringing" context.

### FIXED
- `synchronizeSyncCheck()` was detecting the response code from `syncCheck.info.message` instead of `syncCheck.info.code`.

### ADDED
- Acknowledgements for @Danimal4326, @sapireli, @hapinstance, and @thcooley.
- A panel switch to "Disarm" the system in case the alarm rings (e.g. CO or smoke alarm) while the system is "Disarmed".
- Support for additional sensor statuses based on user hints and community help (`shock` and `supervisory` remain undocumented so far).

## 3.0.0-beta.24 - 2024-01-13

### UPDATED
- The plugin now properly detects when a login session is close to 6 hours old and forces a session reset.
- Rebuilt the logic that prevents users from setting the system to the same arm state.
- All accessory updates now officially use `updateValue()`, per the recommendation of @NorthernMan54.

### FIXED
- Repetitive notifications when the user tries to arm from the same state.
- The plugin could not properly disarm the system from HomeKit while the alarm was ringing.
- Homebridge log files could get spammed because of a sensor count mismatch.

### ADDED
- Temporarily re-added support for "System/Supervisory" devices to evaluate whether it can be officially supported.
- A README notice about how temperature sensors behave in this plugin.
- The ability to generate fake "ready to arm" buttons in case the portal has arm/disarm delays.
- The ability to log system status changes.
- Additional statuses for `doorWindow`, `fire`, `glass`, `motion`, and `temperature` sensors.
- A notice for users when the plugin detects undocumented data and continuously restarts their Homebridge instance trying to recover.
- A sensor count mismatch detector.

## 3.0.0-beta.23 - 2024-01-09

### UPDATED
- Reverted the previous attempt (3.0.0-beta.21) to fix security panel status retrieval, since it did not resolve the issue.
- Changed types that defined an object with an arbitrary key to use `Record` instead.
- Made the accessories array in the platform private.
- Improved the method used to retrieve the most up-to-date security system and sensor statuses.

### FIXED
- Glass break sensors were returning the wrong characteristic values.
- Cases where the plugin did not wait long enough after arming the system, generating an "Arm disarm handler failed to find new security buttons" error.

### ADDED
- Unknown statuses for `co`, `doorWindow`, `fire`, `glass`, and `motion` sensors.
- Okay statuses for `flood`, `heat`, and `temperature` sensors.
- "Bypassed, Closed" sensor action items for `doorWindow`.

## 3.0.0-beta.22 - 2024-01-07

### UPDATED
- Rewrote the detection method for sensor information.

### FIXED
- Some type definitions incorrectly ended with `,` instead of `;`.

### REMOVED
- Support for devices previously matched as sensors (`keypad`, `panic`, `remote`).
- Temporarily removed "System/Supervisory" and "Unknown Device Type" support to determine whether these are legitimate sensors.
- `rawNode` when parsing the orb text summary.

## 3.0.0-beta.21 - 2024-01-07

### UPDATED
- Improved detection for retrieving sensor statuses that don't have a zone.
- Attempted to fix the security panel not properly retrieving statuses.

### ADDED
- Support for "Wireless Remote" sensors.
- An "Installing" status for sensors.

## 3.0.0-beta.20 - 2024-01-07

### UPDATED
- Renamed `AxiosResponseWithRequest` to `AxiosResponseNodeJs` for clarity.
- Switched from an assert JSON import for ESM to `createRequire`, since the assert-import method is still experimental.
- Consolidated the detector report URL to one place.
- Reduced indirect alias type imports so types point directly to their source file.
- After the plugin removes all related accessories in reset mode, the log level changed from `warn` to `info`.
- Moved the "status" mode's accessory status fetching to the bottom so it better accommodates other optional characteristics.
- "Status Tampered" for security panels is now temporarily set to "Not Tampered" until there are enough statuses to determine an actual tamper.

### FIXED
- Sensor and panel statuses would not refresh unless the user manually forced a retrieval/refresh (credit to @NorthernMan54).
- Removing accessories from the configuration could cause an array-out-of-bounds error, since the removal loop iterated forward instead of backward.
- "Status Active" for sensors was improperly detecting statuses and icons.

### ADDED
- Support for "Heat (Rate-of-Rise) Detector" sensors.
- A `sensor-mismatch` stack tracer event type for when `sensorInfo` and `sensorStatus` responses don't match.
- An unknown information dispatcher in `ADTPulsePlatform` to improve collection of undocumented sensor statuses.
- A notice for users upgrading from v2 to v3 to update their configuration.
- An attempt to ask `axios`/the portal not to cache responses.

### REMOVED
- The `isPortalAccessible` (internet connectivity) check, due to redundancy and a performance bottleneck.
- The information dispatcher in `ADTPulseAccessory`.
- The redundant description in the body sent to the plugin author when anomalies are detected.

## 3.0.0-beta.19 - 2024-01-04

### UPDATED
- Updated package dependencies.
- Removed the emoji displayed next to the "Reset" title in the configuration schema.
- Setting the operational speed will also extend the time the plugin waits after setting an arm mode.
- Updated the definition for `/access/signin.jsp?e=&partner=adt`.
- Changed how the plugin detects its own version (using an experimental Node.js feature, which may generate warnings).
- Shortened the analytics notice.

### FIXED
- Parts of the plugin were still referencing an older configuration format.

## 3.0.0-beta.18 - 2024-01-01

### UPDATED
- Decreased the wait time after arming the system by 2 seconds to see if the Home app's response improves.
- Another attempt at fixing the types for `.onGet`.
- Moved the offline-system error throws in `getPanelStatus` and `getSensorStatus` to the bottom so they don't interfere with other modes (low battery, status fault, etc).
- Changed the "If status has not been retrieved yet" log from `warn` to `debug`.

### FIXED
- Tamper detection for panel statuses only matched case-sensitive strings.

### ADDED
- An "Okay" status for flood sensors.
- A stack tracer for when an arming request is unsuccessful.

## 3.0.0-beta.17 - 2023-12-31

### ADDED
- Proper checks to detect whether panel statuses are tampered.

## 3.0.0-beta.16 - 2023-12-31

### UPDATED
- Unknown accessory action detectors now include the accessory context.
- Separated the `gateway` and `panel` device types from the `sensor` switch statements for easier maintenance.
- Package commands now run Homebridge under `--keep-orphans` mode.
- Changed the license from ISC to Apache-2.0 for trademark clarification.
- General Node.js support starts at v18 and onward.

### FIXED
- `accessory.getSensorStatus` was returning an incorrect type.
- Some logs did not properly style the accessory name and its details.
- In `accessory.ts`, "Status Unavailable" was mistakenly written as "Service Unavailable".

### ADDED
- The original (ADT-reported) name for every device, mainly for sensors.
- Alarm type, fault, and partial tamper support for security panels.
- Active, fault, low battery, and tamper support for sensors.
- Sensors removed from the configuration are now also removed from Homebridge, giving users more control.
- Removing an accessory now requires a reason, which is logged in debug mode.
- A debug log for when a sensor is up to date, showing cached and fetched codes.
- A recommendation to run Homebridge under `--keep-orphans` mode.

### REMOVED
- The redundant `type` field from unknown accessory action detectors, since accessory context is now included instead.

## 3.0.0-beta.15 - 2023-12-30

### UPDATED
- The unknown accessory action detector now also sends the accessory status along with its type for further diagnosis.

## 3.0.0-beta.14 - 2023-12-30

### FIXED
- The plugin was sending the accessory context instead of the actual panel/sensor action to the unknown action detector.

## 3.0.0-beta.13 - 2023-12-30

### UPDATED
- Split `PluginDeviceType` into `PluginDeviceGatewayType`, `PluginDevicePanelType`, and `PluginDeviceSensorType`.
- Renamed `isDisarmChecked` (test mode) to `isSystemDisarmedBeforeTest` for clarity.
- Panel and sensor status objects now hold more complete data, including `rawData`.
- Flattened sensor status text (e.g. "Low Battery, Okay" becomes separate "Low Battery" and "Okay" statuses) for stricter status detection.
- Simplified the regular expression used to detect orb text summaries.
- The plugin now continuously retries detector reporting after failures caused by network issues or outdated plugin versions.
- Updated dependency and ECMAScript target versions.

### FIXED
- ESLint warnings on JavaScript files.
- The plugin arming to the same state when the panel wasn't actually disarmed.

### ADDED
- A dedicated `items.ts` file consolidating known, documented portal information.
- A dispatcher in `accessory.ts` for reporting when the plugin doesn't recognize a panel or sensor status.
- A "No Entry Delay" panel state, a "Sensor Problems" panel status, and a "this may take several minutes" panel note.
- A `devStatOffline` sensor status.
- `serial` to the fields redacted by `removePersonalIdentifiableInformation`.
- Error and warning log messages for accessories, to help diagnose issues in the Home app.
- Support for additional sensor types, defaulting to occupancy sensors for types not natively supported by HomeKit.

### REMOVED
- The obsolete `generateDeviceId` function.

## 3.0.0-beta.12 - 2023-12-26

### UPDATED
- Adjusted the configuration schema styling for the devices tab.
- Reset the plugin dropdown selection.
- Improved README wording and added tips for common past issues.

### ADDED
- Sensor support for "System/Supervisory" and "Unknown Device Type".
- New sensor statuses: "Bypassed, Closed", "Bypassed, Tripped", "Low Battery, Motion", and "Low Battery, No Motion".

## 3.0.0-beta.11 - 2023-12-21

### ADDED
- A new "Alarm, Closed" sensor status.
- Support for the Shock Sensor accessory.

## 3.0.0-beta.10 - 2023-12-20

### UPDATED
- Separated gateway offline statuses from sensor and panel statuses.
- Sensors are no longer required during configuration.
- Completely rewrote the README.
- Renamed the "Operational Speed" setting to "Synchronization Speed".
- Improved the configuration schema.

### ADDED
- A new sensor status for device trouble (`devStatTamper`).
- An offline status for gateways (other devices show as Unknown) when the internet connection has been down too long.

## 3.0.0-beta.9 - 2023-12-20

### FIXED
- HOOBS installations could not start the plugin, because HOOBS did not support the `exports` field in `package.json`.

### ADDED
- A panic button toggle in the configuration UI.

### NOTES
- HOOBS currently caches configuration UIs, so users won't be able to see the latest configuration UI. Please re-configure the plugin manually until this is fixed by the HOOBS team.

## 3.0.0-beta.8 - 2023-12-19

### UPDATED
- Increased the maximum allowed sensor zone number to 999.

### ADDED
- Partial detection support for keypad/touchpad sensors.

## 3.0.0-beta.7 - 2023-12-19

### UPDATED
- Added new sensor statuses.
- Alphabetized the internal sensor type detection logic (`condenseSensorType`).
- The detected package version now falls back to "unknown" instead of "0.1.0" when it can't be determined.

### ADDED
- Partial support for the panic button.
- A check that notifies when the running plugin version is outdated.

## 3.0.0-beta.6 - 2023-12-17

### UPDATED
- Rewrote the configuration schema so the Homebridge Config UI X now matches the v3 configuration format again.
- Replaced the `pause` and `reset` configuration options with `mode` and `speed` options for controlling plugin behavior and update frequency.

## 3.0.0-beta.5 - 2023-12-16

### UPDATED
- Replaced the `preinstall`/`postinstall` build hooks with `prepare`/`prepublishOnly` hooks, and switched to publishing the pre-built `build` directory instead of raw TypeScript source, so the plugin no longer needs to compile on the user's machine during installation.

## 3.0.0-beta.4 - 2023-12-16

### FIXED
- Included `tsconfig.json` in the published package so the post-install build step could find it.

## 3.0.0-beta.3 - 2023-12-16

### FIXED
- Restored the chained build script sequencing and added a `preinstall` step to ensure development dependencies are available before the build runs, continuing the attempt to fix installation failures.

## 3.0.0-beta.2 - 2023-12-16

### FIXED
- Adjusted the build script sequence run during install, in an attempt to fix the package failing to install.

## 3.0.0-beta.1 - 2023-12-16

The first v3 beta: a complete rewrite of the plugin from JavaScript to TypeScript.

### UPDATED
- Rewrote the plugin from JavaScript to TypeScript, replacing the single `index.js` file with a modular source structure (`accessory`, `api`, `detect`, `platform`, `regex`, `schema`, `utility`).
- Restructured sensor configuration so sensors must be added manually with an explicit name, type, and zone, replacing the old automatic sensor add/remove behavior.
- The configuration UI does not yet reflect the new v3 configuration format; sensors and other settings must be configured manually in `config.json` until the schema is updated (resolved in 3.0.0-beta.6).
- Improved the `.editorconfig` and `.gitignore` files.

### ADDED
- Support for the Canada ADT Pulse portal subdomain (`portal-ca`), in addition to the US portal.
- A standalone browser-based device fingerprint tool (`fingerprint/index.html`) for generating the two-factor authentication fingerprint value.
- `test-api` and `repl` scripts for testing and debugging the ADT Pulse API directly from the command line.

## 2.2.0 - 2023-07-31

### FIXED
- README documentation that still referenced outdated supported web portal versions.

### ADDED
- New `pausePlugin` configuration option to stop the plugin from repeatedly contacting the ADT Pulse portal, useful for avoiding a temporary IP ban when authentication is failing.
- Support for web portal version `26.0.0-32`.

### REMOVED
- Support for web portal version `24.0.0-117`.

## 2.1.7 - 2023-04-02

### FIXED
- Latest supported web portal version, which was incorrectly listed as `25.0.0.21` instead of `25.0.0-21`.

## 2.1.6 - 2023-04-02

### ADDED
- Support for web portal version `25.0.0.21`.

### REMOVED
- Support for web portal version `23.0.0-99`.

## 2.1.5 - 2022-11-13

### ADDED
- Support for web portal version `24.0.0-117`.

### REMOVED
- Support for web portal version `22.0.0-233`.

## 2.1.4 - 2022-08-09

### UPDATED
- Login request's browser user-agent to a more common browser so ADT Pulse stops blocking the plugin's requests.
- Relocated the test script from `test/api-test.js` to `api-test.js` in the project root.

## 2.1.3 - 2022-05-24

### UPDATED
- Instructions for retrieving the MFA fingerprint value, now covering the full 2FA enrollment flow (trusting the device, signing out and back in, and locating the fingerprint in the sign-in request payload).

### FIXED
- Arming, disarming, and clearing alarms, which had stopped working because ADT Pulse now requires a `sat` security token on every request instead of only when force-arming.

### ADDED
- Support for web portal version `23.0.0-99`.

### REMOVED
- Support for web portal version `21.0.0-354`.

## 2.1.2 - 2021-12-08

### UPDATED
- MFA fingerprint configuration field is now required, since ADT Pulse requires 2-factor authentication for all logins.
- Test script to accept and send a `--fingerprint` argument, matching the plugin's login flow.

## 2.1.1 - 2021-11-05

### UPDATED
- README instructions for locating the MFA fingerprint value in the browser's network requests.

### FIXED
- Node.js engine requirement, downgraded from a pinned `16` to `>=14.16.0`, to support more Homebridge environments.

## 2.1.0 - 2021-11-03

### UPDATED
- Project tooling configuration (`.editorconfig`, `.eslintrc.json`, `.gitignore`) and the login request's browser header to match the latest Google Chrome version.
- README with a note about ADT Pulse's new multi-factor authentication requirement, recommending a dedicated account for the plugin.

### ADDED
- Multi-factor authentication support through a new `fingerprint` configuration field, sent alongside the username and password during login (contributed by @Danimal4326).
- Support for web portal version `22.0.0-233`.

### REMOVED
- Support for web portal version `21.0.0-353`.

## 2.0.4 - 2021-08-18

### UPDATED
- `.editorconfig` to support TypeScript file formatting.

### ADDED
- Support for web portal version `21.0.0-354`.

### REMOVED
- Support for web portal version `21.0.0-344`.

## 2.0.3 - 2021-07-03

### UPDATED
- `.editorconfig` max line length increased to `200` to reduce unnecessary line wrapping.
- README `overrideSensors` documentation to clarify it accepts an array (`overrideSensors[]`).
- `package.json` funding URL to use `https`.

### ADDED
- Support for web portal version `21.0.0-353`.

### REMOVED
- Support for web portal version `20.0.0-244`.

## 2.0.2 - 2021-03-06

### FIXED
- Warning generated by the Security System Target State "set" handler returning a value in its write-response callback, which HomeKit doesn't expect for that characteristic.

## 2.0.1 - 2021-03-06

### UPDATED
- Wording of the `overrideSensors` descriptions in the config UI schema.

## 2.0.0 - 2021-03-06

### UPDATED
- Login request's browser user-agent header.
- README configuration example to include the `overrideSensors` section.
- Code formatting for the internal logging function.

### FIXED
- Siri reporting an error after arming/disarming, by lowering the device status timeout from 8 to 6 seconds.
- Accessory removal (`removeAccessory`) not reliably matching accessories to remove, caused by a `lodash` shorthand matcher that didn't work as expected.

### ADDED
- Support for manually overriding sensor detection via a new `overrideSensors` configuration option, for sensors ADT Pulse reports incorrectly.
- Support for low battery status on `devStatLowBatt` devices.
- Support for a `country` configuration option.
- Support for a `resetAll` configuration option directly in the config UI schema.
- Test script support for overriding a single sensor and for validating that `country` isn't left empty.
- Support for web portal version `21.0.0-344`.

### REMOVED
- Hard-coded overrides previously used for special device naming configurations, superseded by `overrideSensors`.
- README note requiring manual configuration for `resetAll`, no longer needed now that it's exposed in the config UI schema.
- Support for web portal version `20.0.0-221`.

## 1.9.3 - 2020-12-24

### UPDATED
- Updated the cheerio HTML-parsing dependency to 1.0.0-rc.5.

### FIXED
- Fixed a crash in zone status parsing caused by passing `cheerio.load` a single element instead of an array.
- Fixed zone number parsing when the web portal output contained a non-breaking space character.

## 1.9.2 - 2020-12-24

### FIXED
- Downgraded the cheerio dependency to 1.0.0-rc.3 to work around a bug in newer release candidates that broke zone status parsing.

## 1.9.1 - 2020-12-04

### ADDED
- Added support for ADT Pulse web portal version 20.0.0-244.

### REMOVED
- Removed support for the outdated web portal version 19.0.0-89.

## 1.9.0 - 2020-09-12

### UPDATED
- Updated the lodash dependency.

### ADDED
- Added support for ADT Pulse Canada accounts via a new `country` configuration option.

## 1.8.13 - 2020-08-12

### ADDED
- Added detection support for "Kitchen Left/Right Back/Side" door sensor naming.

## 1.8.12 - 2020-07-31

### ADDED
- Added support for ADT Pulse web portal version 20.0.0-221.

### REMOVED
- Removed support for the outdated web portal version 18.0.0-78.

## 1.8.11 - 2020-07-21

### UPDATED
- Improved device name detection to better handle sensors with special naming configurations.

### FIXED
- Fixed glass break and smoke sensors being incorrectly detected as contact (door/window) sensors.

### ADDED
- Added detection support for "Z\*\* Service" door sensor naming.

## 1.8.10 - 2020-06-04

### FIXED
- Fixed SAT code retrieval when setting the device (arm/disarm) status, which could cause requests to fail.

### REMOVED
- Removed the TypeScript type definition file that was added in the previous release.

## 1.8.9 - 2020-06-02

### UPDATED
- Adjusted the portal sync session timer and login failure log messages.

### ADDED
- Added a TypeScript type definition file for the plugin.
- Added a 600-second delay before retrying the portal sync login after a failure.

## 1.8.8 - 2020-05-10

### UPDATED
- Updated the browser user agent string sent to the ADT Pulse portal.

### ADDED
- Added a display name for the plugin in Homebridge Config UI X.

### REMOVED
- Removed the bundled test script from the published npm package; it remains available in the GitHub repository.

## 1.8.7 - 2020-05-04

### UPDATED
- Adjusted log priority for web portal version mismatch, disabled obsolete-zone removal, and stalled portal sync warnings.

### ADDED
- Added support for ADT Pulse web portal version 19.0.0-89.

### REMOVED
- Removed support for the outdated web portal version 17.0.0-71.

## 1.8.6 - 2020-04-23

### ADDED
- Added a `removeObsoleteZones` configuration setting to toggle automatic removal of obsolete zone accessories.

## 1.8.5 - 2020-03-26

### UPDATED
- Improved zone accessory type detection and its fallback behavior.

## 1.8.4 - 2020-03-21

### FIXED
- Fixed incorrect zone type matching caused by confusing string and array `includes` behavior.

## 1.8.3 - 2020-03-21

### UPDATED
- Improved zone accessory type detection for sensor names containing "DR", "WIN", "SLIDER", "NOOK", "MOTION", and "SMOKE".

## 1.8.2 - 2020-03-21

### UPDATED
- New zone accessories now use a `sensor-${zone}` serial number and "1.0" firmware revision by default.

## 1.8.1 - 2020-03-21

### FIXED
- Fixed zone status retrieval after ADT Pulse disabled the endpoint the plugin previously relied on, by switching to the "zone status orb" endpoint.

## 1.8.0 - 2020-02-07

### ADDED
- Added a `logActivity` setting to log alarm and sensor activity events.

## 1.7.7 - 2020-02-03

### UPDATED
- Improved login failure lockout prevention.

## 1.7.6 - 2020-02-03

### UPDATED
- Improved how system error messages are displayed and how the portal sync timer is stored.

### FIXED
- Fixed portal sync repeatedly stalling when the web portal was on version 18.0.0-78.

## 1.7.5 - 2020-01-28

### FIXED
- Fixed error messages not being logged properly to Homebridge.

## 1.7.4 - 2020-01-27

### UPDATED
- Error messages are now displayed in order of priority when available.

### ADDED
- Added support for ADT Pulse web portal version 18.0.0-78.

### REMOVED
- Removed support for the outdated web portal version 17.0.0-69.

## 1.7.3 - 2020-01-15

### FIXED
- Fixed sensors showing "No Response" in HomeKit when closed or not detecting motion.
- Fixed the security panel showing "No Response" when armed to stay.

## 1.7.2 - 2020-01-15

### FIXED
- Fixed offline devices and sensors showing incorrect status instead of "Not Available".

## 1.7.1 - 2020-01-09

### UPDATED
- Removing invalid accessories now fails gracefully instead of crashing Homebridge.

### ADDED
- Added system information logging on Homebridge startup.

## 1.7.0 - 2020-01-02

### UPDATED
- Improved logging clarity when adding accessories and handling unknown errors.

### FIXED
- Fixed a false credentials error appearing when `logLevel` was configured incorrectly.
- Fixed potential errors when removing a large number of obsolete accessories.

### ADDED
- Added a plugin reset feature to clear cached accessory data.

### REMOVED
- Removed the "console.re" remote debug logging feature and its dependency.

## 1.6.9 - 2019-12-30

### ADDED
- Re-added glass break sensors, now exposed as occupancy sensors in HomeKit.

### USERS UPGRADING WITH GLASS BREAK SENSORS
If you have NOT updated to `v1.6.8`, please DO NOT update to this version or any future versions until you do. Attempts to skip the aforementioned version WILL crash Homebridge.

To upgrade/downgrade to `v1.6.8` manually, please enter this command into the Terminal:

`npm install homebridge-adt-pulse@1.6.8`

Then proceed to restart Homebridge for the changes to take effect. Afterward, you are then safe to upgrade to the latest version.

### PRIVACY NOTICE
Because of unknown bugs plagued in the plugin (that people aren't reporting on GitHub), this version will contain a bug reporting tool that will send debug logs here:

`https://console.re/vHeMZvGjaBWjN29b8PARrCpBNtHTWYteMGFejmxDwgUpan9SMU`

Please be advised these logs are not saved, are ANONYMOUS and in no way, you will be geographically or personally identified. The information that is being sent is:
- A random session number (to group actions).
- Date and time.
- Basic system information (system and architecture version).
- Node version, Homebridge version, Plugin version.
- System status changes (e.g. `all quiet` to `motion`).
- Set device logs (e.g. `disarmed` to `away`).
- Wrong web portal version messages (e.g. `17.0.0` to `18.0.0`).

## 1.6.8 - 2019-12-30

### REMOVED
- Temporarily removed glass break sensor support while it was reworked to use HomeKit occupancy sensors (restored in the next release).

### PRIVACY NOTICE
Because of unknown bugs plagued in the plugin (that people aren't reporting on GitHub), this version will contain a bug reporting tool that will send debug logs here:

`https://console.re/vHeMZvGjaBWjN29b8PARrCpBNtHTWYteMGFejmxDwgUpan9SMU`

Please be advised these logs are not saved, are ANONYMOUS and in no way, you will be geographically or personally identified. The information that is being sent is:
- A random session number (to group actions).
- Date and time.
- Basic system information (system and architecture version).
- Node version, Homebridge version, Plugin version.
- System status changes (e.g. `all quiet` to `motion`).
- Set device logs (e.g. `disarmed` to `away`).
- Wrong web portal version messages (e.g. `17.0.0` to `18.0.0`).

## 1.6.7 - 2019-12-29

### UPDATED
- Improved detection of "Status Unavailable" when setting device status.

### FIXED
- Fixed the "console.re" debug logging port to avoid being blocked by firewalls.

### ADDED
- Accessories now show "No Response" in HomeKit when their status is unavailable.
- Added support for reporting the security system's target state (not just current state) to HomeKit.

### PRIVACY NOTICE
Because of unknown bugs plagued in the plugin (that people aren't reporting on GitHub), this version will contain a bug reporting tool that will send debug logs here:

`https://console.re/vHeMZvGjaBWjN29b8PARrCpBNtHTWYteMGFejmxDwgUpan9SMU`

Please be advised these logs are not saved, are ANONYMOUS and in no way, you will be geographically or personally identified. The information that is being sent is:
- A random session number (to group actions).
- Date and time.
- Basic system information (system and architecture version).
- Node version, Homebridge version, Plugin version.
- System status changes (e.g. `all quiet` to `motion`).
- Set device logs (e.g. `disarmed` to `away`).
- Wrong web portal version messages (e.g. `17.0.0` to `18.0.0`).

## 1.6.6 - 2019-12-24

### FIXED
- Fixed a typo that prevented the security system from arming.

### PRIVACY NOTICE
Because of unknown bugs plagued in the plugin (that people aren't reporting on GitHub), this version will contain a bug reporting tool that will send debug logs here:

`https://console.re/vHeMZvGjaBWjN29b8PARrCpBNtHTWYteMGFejmxDwgUpan9SMU`

Please be advised these logs are not saved, are ANONYMOUS and in no way, you will be geographically or personally identified. The information that is being sent is:
- A random session number (to group actions).
- Date and time.
- Basic system information (system and architecture version).
- Node version, Homebridge version, Plugin version.
- System status changes (e.g. `all quiet` to `motion`).
- Set device logs (e.g. `disarmed` to `away`).
- Wrong web portal version messages (e.g. `17.0.0` to `18.0.0`).

## 1.6.5 - 2019-12-24

### UPDATED
- Improved error and debug log message formatting.

### FIXED
- Fixed Homebridge crashes caused by accessories with an undefined last-known state.

### PRIVACY NOTICE
Because of unknown bugs plagued in the plugin (that people aren't reporting on GitHub), this version will contain a bug reporting tool that will send debug logs here:

`https://console.re/vHeMZvGjaBWjN29b8PARrCpBNtHTWYteMGFejmxDwgUpan9SMU`

Please be advised these logs are not saved, are ANONYMOUS and in no way, you will be geographically or personally identified. The information that is being sent is:
- A random session number (to group actions).
- Date and time.
- Basic system information (system and architecture version).
- Node version, Homebridge version, Plugin version.
- System status changes (e.g. `all quiet` to `motion`).
- Set device logs (e.g. `disarmed` to `away`).
- Wrong web portal version messages (e.g. `17.0.0` to `18.0.0`).

## 1.6.4 - 2019-12-24

### UPDATED
- Refined accepted zone accessory types.

### ADDED
- Added firmware revision information when adding or configuring accessories.

### PRIVACY NOTICE
Because of unknown bugs plagued in the plugin (that people aren't reporting on GitHub), this version will contain a bug reporting tool that will send debug logs here:

`https://console.re/vHeMZvGjaBWjN29b8PARrCpBNtHTWYteMGFejmxDwgUpan9SMU`

Please be advised these logs are not saved, are ANONYMOUS and in no way, you will be geographically or personally identified. The information that is being sent is:
- A random session number (to group actions).
- Date and time.
- Basic system information (system and architecture version).
- Node version, Homebridge version, Plugin version.
- System status changes (e.g. `all quiet` to `motion`).
- Set device logs (e.g. `disarmed` to `away`).
- Wrong web portal version messages (e.g. `17.0.0` to `18.0.0`).

## 1.6.3 - 2019-12-23

### UPDATED
- Improved parsing of the web portal version, site ID, force-arm code, and zone status responses.
- The plugin now avoids setting device status when the ADT Pulse gateway is offline.
- Offline devices and zones with broken data are no longer added or updated.

### PRIVACY NOTICE
Because of unknown bugs plagued in the plugin (that people aren't reporting on GitHub), this version will contain a bug reporting tool that will send debug logs here:

`https://console.re/vHeMZvGjaBWjN29b8PARrCpBNtHTWYteMGFejmxDwgUpan9SMU`

Please be advised these logs are not saved, are ANONYMOUS and in no way, you will be personally or geographically identified. The information that is being sent is:
- A session number to group logs together.
- The version of Node (or browser) you are using.
- The operating system name.
- Date and time of the proposed log.
- System status changes (e.g. `all quiet` to `motion`)
- Set device logs (e.g. `disarmed` to `away`)

## 1.6.2 - 2019-12-22

### FIXED
- Fixed incorrect zone version detection for certain zone numbers (e.g., zone 10 being read as zone 1).
- Fixed a Homebridge crash when configuring a device accessory with an undefined state.
- Fixed a potential crash when an error handler received an undefined message.

### ADDED
- Added optional anonymous debug log reporting to help diagnose issues.

### PRIVACY NOTICE
Because of unknown bugs plagued in the plugin (that people aren't reporting on GitHub), this version will contain a bug reporting tool that will send debug logs here:

`https://console.re/nsJJTsUAB6AUwcCNc4rzuPwcW9JAuCeXG8DeGtVypRpT2gFw`

Please be advised these logs are not saved, are ANONYMOUS and in no way, you will be personally or geographically identified. The information that is being sent is:
- The version of Node (or browser) you are using.
- The operating system name.
- Date and time of the proposed log.
- System status changes (e.g. `disarmed` to `off`)
- Unknown zone types (e.g. `sensor`)

## 1.6.1 - 2019-12-15

### FIXED
- Fixed zone accessory information for multiples of 10 being read as "10VER1" instead of "10".

## 1.6.0 - 2019-12-15

### REMOVED
- Removed temporary workarounds for accessory display names and zone information that are no longer needed.

### EXISTING USERS
If you are updating this plugin from older versions, please follow the instructions [here](https://github.com/mrjackyliang/homebridge-adt-pulse/issues/14). If you update without following the upgrade instructions, some things might become broken.

## 1.5.6 - 2019-12-15

### FIXED
- Fixed the plugin re-sending a status change request when the device was already at the requested status.

## 1.5.5 - 2019-12-14

### UPDATED
- Increased the allowed login failures before lockout from 2 to 3.
- Adapted to updated ADT Pulse login form field names and request headers to maintain portal compatibility.

### FIXED
- Fixed a crash in `setDeviceStatus` when the last known state was not a string.

### ADDED
- Added the ability to retrieve device information (e.g., model and serial number) when adding new accessories.

## 1.5.2 - 2019-12-11

### ADDED
- Sensor zone numbers now display alongside the accessory serial number.

### REMOVED
- Temporarily removed the "Status Unavailable" device status display (reintroduced in a later release).

## 1.5.1 - 2019-12-09

### UPDATED
- Updated the Homebridge Config UI X settings layout.

## 1.5.0 - 2019-12-09

### FIXED
- Fixed the alarm triggered status not displaying in HomeKit during an active alarm event.
- Fixed login error messages retaining HTML line breaks.

### ADDED
- Added a warning log when force arm is used to set the device status.
- Added a timeout safeguard when setting device status to prevent the plugin from hanging.

## 1.4.5 - 2019-12-01

### FIXED
- Fixed a Homebridge crash when an error response had no body.

## 1.4.4 - 2019-12-01

### UPDATED
- Simplified device status polling to use a single sync interval timer.

## 1.4.3 - 2019-11-28

### FIXED
- Fixed error messages retaining leftover HTML markup.
- Reduced duplicate arm/disarm notifications and delayed Siri responses.

### ADDED
- Added support for configuring the plugin through Homebridge Config UI X.

## 1.4.2 - 2019-11-27

### UPDATED
- Improved zone status detection logic.
- Improved consistency of the internet connectivity check.

## 1.4.1 - 2019-11-24

### FIXED
- Fixed a Homebridge crash when accessing the error message helper.

## 1.4.0 - 2019-11-24

### UPDATED
- Sped up sync intervals to further reduce Siri arm/disarm timeout issues.
- Portal sync and set-status errors now include the underlying web portal error message.
- Updated the browser user agent from Chrome 76 to Chrome 78.

### FIXED
- Fixed debug logs from the ADT Pulse script not appearing in verbose mode.

### ADDED
- Added automatic removal of obsolete accessories.
- Added the ability to extract and display error messages from the ADT Pulse login page.

## 1.3.5 - 2019-11-19

### FIXED
- The plugin now logs the underlying error message from the ADT Pulse portal on login or other failures.

## 1.3.4 - 2019-11-17

### FIXED
- Fixed repetitive log messages for common, auto-recoverable web portal errors.

## 1.3.3 - 2019-11-17

### FIXED
- Fixed the plugin not properly de-authenticating after a failed device status request.
- Improved detection of failed logins, with the underlying error now logged.

## 1.3.2 - 2019-11-09

### ADDED
- Added support for ADT Pulse web portal version 17.0.0-71.

### REMOVED
- Removed support for the outdated web portal version 16.0.0-131.

## 1.3.1 - 2019-11-05

### FIXED
- Fixed "Uncleared Alarm" status incorrectly showing as "Alarm Triggered" in HomeKit.
- Fixed a Homebridge crash caused by an unrecognized device state.

### REMOVED
- Removed the "Uncleared Alarm" check from armed away, stay, and night modes.

## 1.3.0 - 2019-11-04

### FIXED
- Fixed default value handling in zone status formatting.

### ADDED
- Added support for "Arm Night" mode, including force arming.

## 1.2.8 - 2019-11-04

### UPDATED
- Debug mode (log levels 40/50) now requires Homebridge Debug Mode to be enabled, and prints full error response objects for troubleshooting.
- Strengthened validation of device status responses.

## 1.2.7 - 2019-11-01

### UPDATED
- Enabling `logLevel` 40 now requires Homebridge Debug Mode.
- Debug and verbose modes now show more detailed error and response information.

### ADDED
- Added support for ADT Pulse web portal pre-release version 17.0.0-69, alongside the current 16.0.0-131.

## 1.2.6 - 2019-10-28

### FIXED
- Fixed arming to "Stay" mode failing when doors or windows were open.

## 1.2.5 - 2019-10-28

### FIXED
- Fixed the web portal version mismatch warning being logged repeatedly on every sync.

## 1.2.4 - 2019-10-28

### FIXED
- Fixed all requests failing on Raspberry Pi and other OpenSSL 1.1.1 systems by enforcing compatible cipher suites.

### ADDED
- Added logging of the full error response alongside the error message.

## 1.2.3 - 2019-10-27

### FIXED
- Fixed an issue where some devices could not retrieve the request path, causing errors.

## 1.2.2 - 2019-10-11

### FIXED
- Fixed Siri reporting an error response when arming or disarming.

## 1.2.1 - 2019-10-10

### UPDATED
- Improved accessory refresh rate.

### FIXED
- Fixed arming or disarming triggering multiple duplicate notifications.
- Reduced Siri arm/disarm request timeouts.

### ADDED
- Added "tamper" detection for sensors when their covers are opened or tampered with.

## 1.2.0 - 2019-10-07

### FIXED
- Fixed arming to "Away" mode failing when doors, windows, or motion sensors were active.

### ADDED
- Added a leveled logging system for clearer log output.

## 1.1.1 - 2019-10-03

### FIXED
- Fixed a race condition when setting the device status.
- Fixed a typo in the device status response handling.
- Removed parentheses from accessory names for cleaner display.

## 1.1.0 - 2019-09-30

### FIXED
- Improved device status prioritization so an active alarm always takes priority.
- Ensured alarm state is cleared before applying a new device status.
- Delayed status callbacks to prevent duplicate reverse notifications.

### REMOVED
- Removed the `debug`, `refreshInterval`, and `syncInterval` configuration options; sync and device polling now use fixed internal intervals.
- Removed the ADT Pulse portal version compatibility check.

## 1.0.0 - 2019-09-26

### ADDED
- Initial release of the ADT Pulse plugin for Homebridge, exposing the ADT security panel and door/window, glass break, motion, carbon monoxide, and fire/smoke sensors to HomeKit.
- Added a standalone test script (`adt-pulse-test.js`) for verifying device status, zone status, sync, and arm/disarm actions outside of Homebridge.
