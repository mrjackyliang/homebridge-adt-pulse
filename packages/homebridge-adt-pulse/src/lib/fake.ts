import { faker } from '@faker-js/faker';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { UAParser } from 'ua-parser-js';

import { readPackagedBrowserSnapshot } from './browser-releases.js';
import { fingerprintIdentity } from './schema.js';

import type {
  Lib_Fake_GenerateFakeDynatracePCHeaderValue_CurrentMillis,
  Lib_Fake_GenerateFakeDynatracePCHeaderValue_Mode,
  Lib_Fake_GenerateFakeDynatracePCHeaderValue_RandomAlphabet,
  Lib_Fake_GenerateFakeDynatracePCHeaderValue_RandomOneToTwoDigit,
  Lib_Fake_GenerateFakeDynatracePCHeaderValue_RandomThreeDigit,
  Lib_Fake_GenerateFakeDynatracePCHeaderValue_Returns,
  Lib_Fake_GenerateFakeDynatracePCHeaderValue_ServerId,
  Lib_Fake_GenerateFakeDynatracePCHeaderValue_SlicedMillis,
  Lib_Fake_GenerateFakeFingerprintFonts_AvailableFonts,
  Lib_Fake_GenerateFakeFingerprintFonts_OptionalFonts,
  Lib_Fake_GenerateFakeFingerprintFonts_Returns,
  Lib_Fake_GenerateFakeFingerprintPlugins_Returns,
  Lib_Fake_GenerateFakeFingerprintScreenResolution_AvailableResolutions,
  Lib_Fake_GenerateFakeFingerprintScreenResolution_Returns,
  Lib_Fake_GenerateFakeFingerprintTimezone_DateTime,
  Lib_Fake_GenerateFakeFingerprintTimezone_FakeTimeZone,
  Lib_Fake_GenerateFakeFingerprintTimezone_Returns,
  Lib_Fake_GenerateFakeFingerprintUserAgent_ChromiumMajor,
  Lib_Fake_GenerateFakeFingerprintUserAgent_FakeUserAgent,
  Lib_Fake_GenerateFakeFingerprintUserAgent_IsLinux,
  Lib_Fake_GenerateFakeFingerprintUserAgent_IsMacintosh,
  Lib_Fake_GenerateFakeFingerprintUserAgent_IsWindows,
  Lib_Fake_GenerateFakeFingerprintUserAgent_Major,
  Lib_Fake_GenerateFakeFingerprintUserAgent_ParsedUserAgent,
  Lib_Fake_GenerateFakeFingerprintUserAgent_Release,
  Lib_Fake_GenerateFakeFingerprintUserAgent_Returns,
  Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint,
  Lib_Fake_GenerateFakeLoginFingerprint_FakeResolution,
  Lib_Fake_GenerateFakeLoginFingerprint_FakeTimezone,
  Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent,
  Lib_Fake_GenerateFakeLoginFingerprint_Release,
  Lib_Fake_GenerateFakeLoginFingerprint_Returns,
  Lib_Fake_GenerateFakeReadyButtons_Buttons,
  Lib_Fake_GenerateFakeReadyButtons_DisplayedButtons,
  Lib_Fake_GenerateFakeReadyButtons_IsCleanState,
  Lib_Fake_GenerateFakeReadyButtons_Options,
  Lib_Fake_GenerateFakeReadyButtons_ReadyButtons,
  Lib_Fake_GenerateFakeReadyButtons_Returns,
  Lib_Fake_GetFingerprintRequestHeaders_Brand,
  Lib_Fake_GetFingerprintRequestHeaders_ChromePart,
  Lib_Fake_GetFingerprintRequestHeaders_ChromiumMajor,
  Lib_Fake_GetFingerprintRequestHeaders_Decoded,
  Lib_Fake_GetFingerprintRequestHeaders_Fallback,
  Lib_Fake_GetFingerprintRequestHeaders_Fingerprint,
  Lib_Fake_GetFingerprintRequestHeaders_Headers,
  Lib_Fake_GetFingerprintRequestHeaders_Identity,
  Lib_Fake_GetFingerprintRequestHeaders_Major,
  Lib_Fake_GetFingerprintRequestHeaders_Platform,
  Lib_Fake_GetFingerprintRequestHeaders_Returns,
  Lib_Fake_GetFingerprintRequestHeaders_UserAgent,
} from '../types/lib/fake.d.ts';

/**
 * Lib - Fake - Generate Fake Dynatrace Pc Header Value.
 *
 * ADT Pulse serves pages instrumented with Dynatrace, which expects an "x-dtpc"
 * header on requests. Fabricating a plausible value lets the API blend in with
 * real browser traffic instead of being flagged as an automated client.
 *
 * @param {Lib_Fake_GenerateFakeDynatracePCHeaderValue_Mode} mode - Mode.
 *
 * @returns {Lib_Fake_GenerateFakeDynatracePCHeaderValue_Returns}
 *
 * @since 1.0.0
 */
export function generateFakeDynatracePCHeaderValue(mode: Lib_Fake_GenerateFakeDynatracePCHeaderValue_Mode): Lib_Fake_GenerateFakeDynatracePCHeaderValue_Returns {
  const serverId: Lib_Fake_GenerateFakeDynatracePCHeaderValue_ServerId = _.sample([
    1,
    3,
    5,
    6,
    7,
  ]);
  const currentMillis: Lib_Fake_GenerateFakeDynatracePCHeaderValue_CurrentMillis = Date.now().toString();
  const slicedMillis: Lib_Fake_GenerateFakeDynatracePCHeaderValue_SlicedMillis = (mode === 'keep-alive') ? currentMillis.slice(-8) : currentMillis.slice(-9);
  const randomThreeDigit: Lib_Fake_GenerateFakeDynatracePCHeaderValue_RandomThreeDigit = Math.floor(Math.random() * (932 - 218 + 1)) + 218;
  const randomOneToTwoDigit: Lib_Fake_GenerateFakeDynatracePCHeaderValue_RandomOneToTwoDigit = Math.floor(Math.random() * (29 - 1 + 1)) + 1;
  const randomAlphabet: Lib_Fake_GenerateFakeDynatracePCHeaderValue_RandomAlphabet = _.range(32).map(() => _.sample('ABCDEFGHIJKLMNOPQRSTUVW')).join('');

  /**
   * Some information on how Dynatrace generates the "x-dtpc" header.
   *
   * The header shape is "serverId$millis_sessionIdhrequestCountvsessionLetters-0e0", such as
   * "5$12345678_218h20vABCDEFGHIJKLMNOPQRSTUVWABCDEFGHI-0e0". Dynatrace uses it to identify
   * proper endpoints for beacon transmission and to correlate requests to a session.
   *
   * @since 1.0.0
   */
  return `${serverId}$${slicedMillis}_${randomThreeDigit}h${randomOneToTwoDigit}v${randomAlphabet}-0e0`;
}

/**
 * Lib - Fake - Generate Fake Fingerprint Fonts.
 *
 * The portal's fingerprinting script reports installed fonts. Keep a fixed
 * Windows base set and vary only optional fonts to match the Windows browser
 * profiles generated below.
 *
 * @returns {Lib_Fake_GenerateFakeFingerprintFonts_Returns}
 *
 * @since 1.0.0
 */
export function generateFakeFingerprintFonts(): Lib_Fake_GenerateFakeFingerprintFonts_Returns {
  const availableFonts: Lib_Fake_GenerateFakeFingerprintFonts_AvailableFonts = [
    'Arial',
    'Arial Black',
    'Arial Narrow',
    'Comic Sans MS',
    'Courier New',
    'Georgia',
    'Impact',
    'Lucida Console',
    'Malgun Gothic',
    'Marlett',
    'Microsoft Sans Serif',
    'Microsoft YaHei',
    'Segoe UI',
    'Segoe UI Symbol',
    'SimSun',
    'Tahoma',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana',
    'Wingdings',
  ];
  const optionalFonts: Lib_Fake_GenerateFakeFingerprintFonts_OptionalFonts = [
    'Aharoni',
    'Aparajita',
    'Calibri',
    'Cambria',
    'Cambria Math',
    'Candara',
    'Constantia',
    'Corbel',
    'Franklin Gothic Medium',
    'Gabriola',
    'Leelawadee',
    'Microsoft JhengHei',
    'Microsoft New Tai Lue',
    'Microsoft PhagsPa',
    'Microsoft Tai Le',
    'Palatino Linotype',
    'Segoe Print',
    'Segoe Script',
    'Segoe UI Light',
    'Segoe UI Semibold',
    'Sylfaen',
  ];

  return _.concat(availableFonts, _.sampleSize(optionalFonts, _.random(8, optionalFonts.length))).sort();
}

/**
 * Lib - Fake - Generate Fake Fingerprint Plugins.
 *
 * Modern browsers no longer expose Flash, Java, or Silverlight plugins.
 * The PDF viewer is the single broadly supported plugin in this profile.
 *
 * @returns {Lib_Fake_GenerateFakeFingerprintPlugins_Returns}
 *
 * @since 1.0.0
 */
export function generateFakeFingerprintPlugins(): Lib_Fake_GenerateFakeFingerprintPlugins_Returns {
  return ['PDF Viewer.application/pdf::pdf'];
}

/**
 * Lib - Fake - Generate Fake Fingerprint Screen Resolution.
 *
 * Fingerprint payloads report the visitor's screen size. Choose only common
 * landscape desktop resolutions for the Windows desktop browser profiles.
 *
 * @returns {Lib_Fake_GenerateFakeFingerprintScreenResolution_Returns}
 *
 * @since 1.0.0
 */
export function generateFakeFingerprintScreenResolution(): Lib_Fake_GenerateFakeFingerprintScreenResolution_Returns {
  const availableResolutions: Lib_Fake_GenerateFakeFingerprintScreenResolution_AvailableResolutions = [
    {
      width: 1280,
      height: 720,
    },
    {
      width: 1366,
      height: 768,
    },
    {
      width: 1440,
      height: 900,
    },
    {
      width: 1680,
      height: 1050,
    },
    {
      width: 1920,
      height: 1080,
    },
    {
      width: 2560,
      height: 1440,
    },
    {
      width: 2560,
      height: 1600,
    },
    {
      width: 3840,
      height: 2160,
    },
  ];

  return _.sample(availableResolutions) ?? availableResolutions[0]!;
}

/**
 * Lib - Fake - Generate Fake Fingerprint Timezone.
 *
 * Fingerprint payloads include the visitor's time zone name and UTC offset.
 * Deriving both values from a single faked IANA zone keeps the pair internally
 * consistent, which two independently random values would not be.
 *
 * @returns {Lib_Fake_GenerateFakeFingerprintTimezone_Returns}
 *
 * @since 1.0.0
 */
export function generateFakeFingerprintTimezone(): Lib_Fake_GenerateFakeFingerprintTimezone_Returns {
  const fakeTimeZone: Lib_Fake_GenerateFakeFingerprintTimezone_FakeTimeZone = faker.location.timeZone();
  const dateTime: Lib_Fake_GenerateFakeFingerprintTimezone_DateTime = DateTime.now().setZone(fakeTimeZone);

  return {
    timezone: dateTime.zoneName ?? 'UTC',
    timezoneOffset: (dateTime.zoneName !== null) ? dateTime.offset : 0,
  };
}

/**
 * Lib - Fake - Generate Fake Fingerprint User Agent.
 *
 * Fingerprint payloads describe the visitor's browser, engine, device, and OS.
 * Parsing a faked user agent string ensures every reported field stays
 * consistent with the same underlying browser identity.
 *
 * @returns {Lib_Fake_GenerateFakeFingerprintUserAgent_Returns}
 *
 * @since 1.0.0
 */
export function generateFakeFingerprintUserAgent(release: Lib_Fake_GenerateFakeFingerprintUserAgent_Release = readPackagedBrowserSnapshot()['releases']['chrome']): Lib_Fake_GenerateFakeFingerprintUserAgent_Returns {
  const major: Lib_Fake_GenerateFakeFingerprintUserAgent_Major = release['version'].split('.')[0] ?? '0';
  const chromiumMajor: Lib_Fake_GenerateFakeFingerprintUserAgent_ChromiumMajor = (release['chromiumVersion'] ?? release['version']).split('.')[0] ?? '0';
  let fakeUserAgent: Lib_Fake_GenerateFakeFingerprintUserAgent_FakeUserAgent = '';

  if (release['browser'] === 'firefox') {
    fakeUserAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${major}.0) Gecko/20100101 Firefox/${major}.0`;
  } else {
    fakeUserAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromiumMajor}.0.0.0 Safari/537.36`;

    if (release['browser'] === 'edge') {
      fakeUserAgent += ` Edg/${major}.0.0.0`;
    }

    if (release['browser'] === 'opera') {
      fakeUserAgent += ` OPR/${major}.0.0.0`;
    }
  }
  const parsedUserAgent: Lib_Fake_GenerateFakeFingerprintUserAgent_ParsedUserAgent = UAParser(fakeUserAgent);
  const isWindows: Lib_Fake_GenerateFakeFingerprintUserAgent_IsWindows = (parsedUserAgent.os.name === 'Windows') ? 'Win32' : null;
  const isMacintosh: Lib_Fake_GenerateFakeFingerprintUserAgent_IsMacintosh = (parsedUserAgent.os.name === 'macOS') ? 'MacIntel' : null;
  const isLinux: Lib_Fake_GenerateFakeFingerprintUserAgent_IsLinux = (parsedUserAgent.os.name === 'Linux') ? 'Linux x86_64' : null;

  return {
    browser: {
      major: parsedUserAgent.browser.major ?? null,
      name: parsedUserAgent.browser.name ?? null,
      version: parsedUserAgent.browser.version ?? null,
    },
    cpu: {
      architecture: parsedUserAgent.cpu.architecture ?? null,
    },
    device: {
      model: parsedUserAgent.device.model ?? null,
      type: parsedUserAgent.device.type ?? null,
      vendor: parsedUserAgent.device.vendor ?? null,
    },
    engine: {
      name: parsedUserAgent.engine.name ?? null,
      version: parsedUserAgent.engine.version ?? null,
    },
    os: {
      name: parsedUserAgent.os.name ?? null,
      version: parsedUserAgent.os.version ?? null,
    },
    platform: isWindows
      ?? isMacintosh
      ?? isLinux
      ?? null,
    ua: parsedUserAgent.ua,
  };
}

/**
 * Lib - Fake - Generate Fake Login Fingerprint.
 *
 * The ADT Pulse portal expects a base64-encoded fingerprint blob during login.
 * Assembling one from the individual fake generators produces a coherent
 * browser identity that satisfies the portal's validation.
 *
 * @returns {Lib_Fake_GenerateFakeLoginFingerprint_Returns}
 *
 * @since 1.0.0
 */
export function generateFakeLoginFingerprint(release: Lib_Fake_GenerateFakeLoginFingerprint_Release = readPackagedBrowserSnapshot()['releases']['chrome']): Lib_Fake_GenerateFakeLoginFingerprint_Returns {
  const fakeTimezone: Lib_Fake_GenerateFakeLoginFingerprint_FakeTimezone = generateFakeFingerprintTimezone();
  const fakeResolution: Lib_Fake_GenerateFakeLoginFingerprint_FakeResolution = generateFakeFingerprintScreenResolution();
  const fakeUserAgent: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent = generateFakeFingerprintUserAgent(release);
  const fakeFingerprint: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint = {
    fingerprint: {
      uaBrowser: {
        name: fakeUserAgent['browser']['name'],
        version: fakeUserAgent['browser']['version'],
        major: fakeUserAgent['browser']['major'],
      },
      uaString: fakeUserAgent['ua'],
      uaDevice: {
        model: fakeUserAgent['device']['model'],
        type: fakeUserAgent['device']['type'],
        vendor: fakeUserAgent['device']['vendor'],
      },
      uaEngine: {
        name: fakeUserAgent['engine']['name'],
        version: fakeUserAgent['engine']['version'],
      },
      uaOS: {
        name: fakeUserAgent['os']['name'],
        version: fakeUserAgent['os']['version'],
      },
      uaCPU: {
        architecture: fakeUserAgent['cpu']['architecture'],
      },
      uaPlatform: fakeUserAgent['platform'],
      language: 'en-US',
      colorDepth: 24,
      pixelRatio: _.sample([
        1,
        2,
        3,
        4,
      ]),
      screenResolution: `${fakeResolution['width']}x${fakeResolution['height']}`,
      availableScreenResolution: `${fakeResolution['width']}x${fakeResolution['height']}`,
      timezone: fakeTimezone['timezone'],
      timezoneOffset: fakeTimezone['timezoneOffset'],
      localStorage: true,
      sessionStorage: true,
      indexedDb: true,
      addBehavior: false,
      openDatabase: false,
      cpuClass: null,
      platform: fakeUserAgent['platform'],
      doNotTrack: _.sample([
        '1',
        '0',
        null,
      ]),
      plugins: generateFakeFingerprintPlugins().join(','),
      canvas: _.random(1111111111, 9999999999),
      webGl: _.random(1111111111, 9999999999),
      adBlock: false,
      userTamperLanguage: false,
      userTamperScreenResolution: false,
      userTamperOS: false,
      userTamperBrowser: false,
      touchSupport: {
        maxTouchPoints: 0,
        touchEvent: false,
        touchStart: false,
      },
      cookieSupport: true,
      fonts: generateFakeFingerprintFonts().join(','),
    },
  };

  // Convert JavaScript object to JSON, then base64 encode it.
  return Buffer.from(JSON.stringify(fakeFingerprint)).toString('base64');
}

/**
 * Lib - Fake - Get Fingerprint Request Headers.
 *
 * Reuses the exact user agent in the saved fingerprint, including profiles
 * created before this release. Firefox omits Chromium-only client hints.
 *
 * @param {string} fingerprint - Fingerprint.
 *
 * @returns {Lib_Fake_GetFingerprintRequestHeaders_Returns}
 *
 * @since 3.5.0
 */
export function getFingerprintRequestHeaders(fingerprint: Lib_Fake_GetFingerprintRequestHeaders_Fingerprint): Lib_Fake_GetFingerprintRequestHeaders_Returns {
  let userAgent: Lib_Fake_GetFingerprintRequestHeaders_UserAgent = '';
  let platform: Lib_Fake_GetFingerprintRequestHeaders_Platform = null;
  let major: Lib_Fake_GetFingerprintRequestHeaders_Major = '0';

  try {
    const decoded: Lib_Fake_GetFingerprintRequestHeaders_Decoded = JSON.parse(Buffer.from(fingerprint, 'base64').toString('utf8'));
    const identity: Lib_Fake_GetFingerprintRequestHeaders_Identity = fingerprintIdentity.parse(decoded)['fingerprint'];

    userAgent = identity['uaString'];
    platform = identity['uaPlatform'];
    major = identity['uaBrowser']['major'] ?? '0';
  } catch {
    const fallback: Lib_Fake_GetFingerprintRequestHeaders_Fallback = generateFakeFingerprintUserAgent();

    userAgent = fallback['ua'];
    platform = fallback['platform'];
    major = fallback['browser']['major'] ?? '0';
  }

  const headers: Lib_Fake_GetFingerprintRequestHeaders_Headers = { 'User-Agent': userAgent };

  if (userAgent.includes('Firefox/') === true) {
    return headers;
  }

  const chromePart: Lib_Fake_GetFingerprintRequestHeaders_ChromePart = userAgent.split('Chrome/')[1];
  const chromiumMajor: Lib_Fake_GetFingerprintRequestHeaders_ChromiumMajor = (chromePart === undefined) ? major : chromePart.split('.')[0] ?? major;
  let brand: Lib_Fake_GetFingerprintRequestHeaders_Brand = 'Google Chrome';

  if (userAgent.includes('Edg/') === true) {
    brand = 'Microsoft Edge';
  } else if (userAgent.includes('OPR/') === true) {
    brand = 'Opera';
  }

  Reflect.set(headers, 'sec-ch-ua', `"Chromium";v="${chromiumMajor}", "${brand}";v="${major}", "Not=A?Brand";v="24"`);
  Reflect.set(headers, 'sec-ch-ua-mobile', '?0');
  Reflect.set(headers, 'sec-ch-ua-platform', (platform === 'MacIntel') ? '"macOS"' : '"Windows"');

  return headers;
}

/**
 * Lib - Fake - Generate Fake Ready Buttons.
 *
 * While the panel is arming or disarming, the portal shows disabled buttons that
 * cannot be pressed. Predicting the buttons that would appear once the panel
 * settles lets callers act on them without waiting for the real state.
 *
 * @param {Lib_Fake_GenerateFakeReadyButtons_Buttons}      buttons      - Buttons.
 * @param {Lib_Fake_GenerateFakeReadyButtons_IsCleanState} isCleanState - Is clean state.
 * @param {Lib_Fake_GenerateFakeReadyButtons_Options}      options      - Options.
 *
 * @returns {Lib_Fake_GenerateFakeReadyButtons_Returns}
 *
 * @since 1.0.0
 */
export function generateFakeReadyButtons(buttons: Lib_Fake_GenerateFakeReadyButtons_Buttons, isCleanState: Lib_Fake_GenerateFakeReadyButtons_IsCleanState, options: Lib_Fake_GenerateFakeReadyButtons_Options): Lib_Fake_GenerateFakeReadyButtons_Returns {
  const readyButtons: Lib_Fake_GenerateFakeReadyButtons_ReadyButtons = [];

  // If the button is a "Disarming" button, generate the two arm buttons.
  if (buttons.length === 1 && buttons[0]!['buttonText'] === 'Disarming') {
    const displayedButtons: Lib_Fake_GenerateFakeReadyButtons_DisplayedButtons = [
      {
        buttonText: 'Arm Away',
        loadingText: 'Arming Away',
        arm: 'away',
      },
      {
        buttonText: 'Arm Stay',
        loadingText: 'Arming Stay',
        arm: 'stay',
      },
    ];

    displayedButtons.forEach((displayedButton, displayedButtonIndex) => {
      readyButtons.push({
        buttonId: `security_button_${displayedButtonIndex}`,
        buttonDisabled: false,
        buttonIndex: displayedButtonIndex,
        buttonText: displayedButton['buttonText'],
        changeAccessCode: false,
        loadingText: displayedButton['loadingText'],
        relativeUrl: options['relativeUrl'],
        totalButtons: buttons.length,
        urlParams: {
          arm: displayedButton['arm'],
          armState: (isCleanState === true) ? 'off' : 'disarmed',
          href: options['href'],
          sat: options['sat'],
        },
      });

      return;
    });

    return readyButtons;
  }

  buttons.forEach((button, buttonIndex) => {
    // If button is already a "ready button", copy the button and skip processing.
    if (button['buttonDisabled'] === false) {
      readyButtons.push(button);

      return;
    }

    switch (button['buttonText']) {
      case 'Arming Away': {
        readyButtons.push({
          buttonId: button['buttonId'],
          buttonDisabled: false,
          buttonIndex,
          buttonText: 'Disarm',
          changeAccessCode: false,
          loadingText: 'Disarming',
          relativeUrl: options['relativeUrl'],
          totalButtons: buttons.length,
          urlParams: {
            arm: 'off',
            armState: (isCleanState === true) ? 'away' : 'away',
            href: options['href'],
            sat: options['sat'],
          },
        });

        break;
      }

      case 'Arming Night': {
        readyButtons.push({
          buttonId: button['buttonId'],
          buttonDisabled: false,
          buttonIndex,
          buttonText: 'Disarm',
          changeAccessCode: false,
          loadingText: 'Disarming',
          relativeUrl: options['relativeUrl'],
          totalButtons: buttons.length,
          urlParams: {
            arm: 'off',
            armState: (isCleanState === true) ? 'night' : 'night+stay',
            href: options['href'],
            sat: options['sat'],
          },
        });

        break;
      }

      case 'Arming Stay': {
        readyButtons.push({
          buttonId: button['buttonId'],
          buttonDisabled: false,
          buttonIndex,
          buttonText: 'Disarm',
          changeAccessCode: false,
          loadingText: 'Disarming',
          relativeUrl: options['relativeUrl'],
          totalButtons: buttons.length,
          urlParams: {
            arm: 'off',
            armState: (isCleanState === true) ? 'stay' : 'stay',
            href: options['href'],
            sat: options['sat'],
          },
        });

        break;
      }

      default: {
        break;
      }
    }

    return;
  });

  return readyButtons;
}
