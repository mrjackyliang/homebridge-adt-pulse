import { faker } from '@faker-js/faker';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { UAParser } from 'ua-parser-js';

import type {
  GenerateFakeDynatracePCHeaderValueMode,
  GenerateFakeDynatracePCHeaderValueReturns,
  GenerateFakeFingerprintFontsReturns,
  GenerateFakeFingerprintPluginsReturns,
  GenerateFakeFingerprintScreenResolutionReturns,
  GenerateFakeFingerprintTimezoneReturns,
  GenerateFakeFingerprintUserAgentReturns,
  GenerateFakeLoginFingerprintReturns,
  GenerateFakeReadyButtonsButtons,
  GenerateFakeReadyButtonsDisplayedButtons,
  GenerateFakeReadyButtonsIsCleanState,
  GenerateFakeReadyButtonsOptions,
  GenerateFakeReadyButtonsReadyButtons,
  GenerateFakeReadyButtonsReturns,
} from '@/types/index.d.ts';

/**
 * Generate fake dynatrace pc header value.
 *
 * @param {GenerateFakeDynatracePCHeaderValueMode} mode - Mode.
 *
 * @returns {GenerateFakeDynatracePCHeaderValueReturns}
 *
 * @since 1.0.0
 */
export function generateFakeDynatracePCHeaderValue(mode: GenerateFakeDynatracePCHeaderValueMode): GenerateFakeDynatracePCHeaderValueReturns {
  const serverId = _.sample([1, 3, 5, 6, 7]);
  const currentMillis = Date.now().toString();
  const slicedMillis = (mode === 'keep-alive') ? currentMillis.slice(-8) : currentMillis.slice(-9);
  const randomThreeDigit = Math.floor(Math.random() * (932 - 218 + 1)) + 218;
  const randomOneToTwoDigit = Math.floor(Math.random() * (29 - 1 + 1)) + 1;
  const randomAlphabet = _.range(32).map(() => _.sample('ABCDEFGHIJKLMNOPQRSTUVW')).join('');

  /**
   * Some information on how Dynatrace generates the "x-dtpc" header.
   *
   * Structure of "5$12345678_218h20vABCDEFGHIJKLMNOPQRSTUVWABCDEFGHI-0e0":
   * - Server ID (1, 3, 5, 6, 7)
   * - $
   * - Current time in milliseconds (the last 8 to 9 digits, dependent on mode)
   * - _
   * - Session identifier (random 3 digit value from 218 to 932)
   * - h
   * - Number of requests (random 1 to 2 digits value from 1 to 29)
   * - v
   * - Session identifier (random 32 uppercase letters except for X, Y, or Z)
   * - -0e0
   *
   * Purpose: Required to identify proper endpoints for beacon transmission; includes session ID for correlation.
   *
   * https://docs.dynatrace.com/docs/manage/data-privacy-and-security/data-privacy/cookies
   * https://docs.dynatrace.com/docs/platform-modules/digital-experience/web-applications/initial-setup/firewall-constraints-for-rum
   * https://docs.dynatrace.com/docs/whats-new/release-notes/oneagent/sprint-165
   *
   * @since 1.0.0
   */
  return `${serverId}$${slicedMillis}_${randomThreeDigit}h${randomOneToTwoDigit}v${randomAlphabet}-0e0`;
}

/**
 * Generate fake fingerprint fonts.
 *
 * @returns {GenerateFakeFingerprintFontsReturns}
 *
 * @since 1.0.0
 */
export function generateFakeFingerprintFonts(): GenerateFakeFingerprintFontsReturns {
  const availableFonts = [
    'Academy Engraved LET',
    'Aharoni',
    'American Typewriter',
    'Andale Mono',
    'Andalus',
    'Angsana New',
    'AngsanaUPC',
    'Aparajita',
    'Apple Chancery',
    'Apple Color Emoji',
    'Apple SD Gothic Neo',
    'Arabic Typesetting',
    'Arial',
    'Arial Black',
    'Arial Hebrew',
    'Arial Narrow',
    'Arial Rounded MT Bold',
    'Arial Unicode MS',
    'AVENIR',
    'Ayuthaya',
    'Bangla Sangam MN',
    'Baskerville',
    'Batang',
    'BatangChe',
    'Bauhaus 93',
    'Big Caslon',
    'Bodoni 72',
    'Bodoni 72 Oldstyle',
    'Bodoni 72 Smallcaps',
    'Bookshelf Symbol 7',
    'Bradley Hand',
    'Browallia New',
    'BrowalliaUPC',
    'Brush Script MT',
    'Calibri',
    'Cambria',
    'Cambria Math',
    'Candara',
    'Chalkboard',
    'Chalkboard SE',
    'Chalkduster',
    'Cochin',
    'Comic Sans MS',
    'Constantia',
    'Copperplate',
    'Corbel',
    'Cordia New',
    'CordiaUPC',
    'Courier',
    'Courier New',
    'DaunPenh',
    'David',
    'Devanagari Sangam MN',
    'DFKai-SB',
    'Didot',
    'DilleniaUPC',
    'DokChampa',
    'Dotum',
    'DotumChe',
    'Ebrima',
    'English 111 Vivace BT',
    'Estrangelo Edessa',
    'EucrosiaUPC',
    'Euphemia',
    'Euphemia UCAS',
    'FangSong',
    'Franklin Gothic',
    'Franklin Gothic Heavy',
    'Franklin Gothic Medium',
    'FrankRuehl',
    'FreesiaUPC',
    'Futura',
    'Gabriola',
    'Gautami',
    'Geeza Pro',
    'Geneva',
    'Georgia',
    'GeoSlab 703 Lt BT',
    'GeoSlab 703 XBd BT',
    'Gill Sans',
    'Gisha',
    'GOTHAM',
    'GOTHAM BOLD',
    'Gujarati Sangam MN',
    'Gulim',
    'GulimChe',
    'Gungsuh',
    'GungsuhChe',
    'Gurmukhi MN',
    'Heiti SC',
    'Heiti TC',
    'HELV',
    'Helvetica',
    'Helvetica Neue',
    'Hiragino Kaku Gothic ProN',
    'Hiragino Mincho ProN',
    'Hoefler Text',
    'Humanst 521 Cn BT',
    'Impact',
    'IrisUPC',
    'Iskoola Pota',
    'JasmineUPC',
    'Kailasa',
    'KaiTi',
    'Kalinga',
    'Kannada Sangam MN',
    'Kartika',
    'Khmer UI',
    'KodchiangUPC',
    'Kokila',
    'Krungthep',
    'Lao UI',
    'Latha',
    'Leelawadee',
    'Levenim MT',
    'LilyUPC',
    'Lucida Console',
    'LUCIDA GRANDE',
    'Lucida Sans Unicode',
    'Malayalam Sangam MN',
    'Malgun Gothic',
    'Mangal',
    'Marion',
    'Marker Felt',
    'Marlett',
    'Meiryo',
    'Meiryo UI',
    'Microsoft Himalaya',
    'Microsoft JhengHei',
    'Microsoft New Tai Lue',
    'Microsoft PhagsPa',
    'Microsoft Sans Serif',
    'Microsoft Tai Le',
    'Microsoft Uighur',
    'Microsoft YaHei',
    'Microsoft Yi Baiti',
    'MingLiU',
    'MingLiU-ExtB',
    'MingLiU_HKSCS',
    'MingLiU_HKSCS-ExtB',
    'Miriam',
    'Miriam Fixed',
    'Modern No. 20',
    'Monaco',
    'Mongolian Baiti',
    'MoolBoran',
    'MS Gothic',
    'MS Mincho',
    'MS PGothic',
    'MS PMincho',
    'MS Sans Serif',
    'MS Serif',
    'MS UI Gothic',
    'MV Boli',
    'MYRIAD PRO',
    'Nadeem',
    'Narkisim',
    'Noteworthy',
    'NSimSun',
    'Nyala',
    'OPTIMA',
    'Oriya Sangam MN',
    'Palatino',
    'Palatino Linotype',
    'Papyrus',
    'Party LET',
    'Plantagenet Cherokee',
    'PMingLiU',
    'PMingLiU-ExtB',
    'Raavi',
    'Rockwell',
    'Rod',
    'Roman',
    'Sakkal Majalla',
    'Savoye LET',
    'Segoe Print',
    'Segoe Script',
    'Segoe UI',
    'Segoe UI Light',
    'Segoe UI Semibold',
    'Segoe UI Symbol',
    'Shonar Bangla',
    'Shruti',
    'SimHei',
    'Simplified Arabic',
    'Simplified Arabic Fixed',
    'SimSun',
    'SimSun-ExtB',
    'Sinhala Sangam MN',
    'Skia',
    'Small Fonts',
    'Snell Roundhand',
    'Sylfaen',
    'Tahoma',
    'Tamil Sangam MN',
    'Telugu Sangam MN',
    'Thonburi',
    'Times',
    'Times New Roman',
    'Traditional Arabic',
    'Trebuchet MS',
    'Tunga',
    'Univers CE 55 Medium',
    'Utsaah',
    'Vani',
    'Verdana',
    'Vijaya',
    'Vrinda',
    'Wingdings',
    'Wingdings 2',
    'Wingdings 3',
    'Zapfino',
  ];

  return _.take(_.shuffle(availableFonts), _.random(50, availableFonts.length)).sort();
}

/**
 * Generate fake fingerprint plugins.
 *
 * @returns {GenerateFakeFingerprintPluginsReturns}
 *
 * @since 1.0.0
 */
export function generateFakeFingerprintPlugins(): GenerateFakeFingerprintPluginsReturns {
  const availablePlugins = [
    'Adobe Flash Player.application/x-shockwave-flash::swf',
    'Java Runtime Environment.application/x-java-applet::class',
    'Microsoft Silverlight.application/x-silverlight::xap',
    'Portable Document Format.application/pdf::pdf',
    'QuickTime Media Player.video/quicktime::mov',
    'Windows Media Player.application/x-mplayer2::wmv',
  ];

  return _.take(_.shuffle(availablePlugins), _.random(1, availablePlugins.length)).sort();
}

/**
 * Generate fake fingerprint screen resolution.
 *
 * @returns {GenerateFakeFingerprintScreenResolutionReturns}
 *
 * @since 1.0.0
 */
export function generateFakeFingerprintScreenResolution(): GenerateFakeFingerprintScreenResolutionReturns {
  const availableResolutions = [
    {
      width: 1024,
      height: 768,
    },
    {
      width: 2048,
      height: 1536,
    },
    {
      width: 1280,
      height: 800,
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
      width: 3840,
      height: 2160,
    },
    {
      width: 320,
      height: 480,
    },
    {
      width: 750,
      height: 1334,
    },
    {
      width: 1080,
      height: 1920,
    },
    {
      width: 1280,
      height: 720,
    },
    {
      width: 1920,
      height: 1080,
    },
    {
      width: 3840,
      height: 2160,
    },
    {
      width: 2732,
      height: 2048,
    },
    {
      width: 2160,
      height: 1620,
    },
    {
      width: 2560,
      height: 1600,
    },
    {
      width: 3440,
      height: 1440,
    },
    {
      width: 5120,
      height: 2880,
    },
    {
      width: 3840,
      height: 1600,
    },
    {
      width: 2560,
      height: 1080,
    },
    {
      width: 4096,
      height: 2160,
    },
    {
      width: 3840,
      height: 1080,
    },
    {
      width: 2960,
      height: 1440,
    },
    {
      width: 3120,
      height: 1440,
    },
    {
      width: 2560,
      height: 1312,
    },
    {
      width: 3840,
      height: 1200,
    },
    {
      width: 3840,
      height: 2160,
    },
    {
      width: 7680,
      height: 4320,
    },
    {
      width: 5120,
      height: 2160,
    },
  ];

  return _.sample(availableResolutions) ?? availableResolutions[0];
}

/**
 * Generate fake fingerprint timezone.
 *
 * @returns {GenerateFakeFingerprintTimezoneReturns}
 *
 * @since 1.0.0
 */
export function generateFakeFingerprintTimezone(): GenerateFakeFingerprintTimezoneReturns {
  const fakeTimeZone = faker.location.timeZone();
  const dateTime = DateTime.now().setZone(fakeTimeZone);

  return {
    timezone: dateTime.zoneName ?? 'UTC',
    timezoneOffset: (dateTime.zoneName !== null) ? dateTime.offset : 0,
  };
}

/**
 * Generate fake fingerprint user agent.
 *
 * @returns {GenerateFakeFingerprintUserAgentReturns}
 *
 * @since 1.0.0
 */
export function generateFakeFingerprintUserAgent(): GenerateFakeFingerprintUserAgentReturns {
  const fakeUserAgent = faker.internet.userAgent();
  const parsedUserAgent = UAParser(fakeUserAgent);
  const isWindows = (parsedUserAgent.os.name === 'Windows') ? 'Win32' : null;
  const isMacintosh = (parsedUserAgent.os.name === 'macOS') ? 'MacIntel' : null;
  const isLinux = (parsedUserAgent.os.name === 'Linux') ? 'Linux x86_64' : null;

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
    platform: isWindows ?? isMacintosh ?? isLinux ?? null,
    ua: parsedUserAgent.ua,
  };
}

/**
 * Generate fake login fingerprint.
 *
 * @returns {GenerateFakeLoginFingerprintReturns}
 *
 * @since 1.0.0
 */
export function generateFakeLoginFingerprint(): GenerateFakeLoginFingerprintReturns {
  const fakeTimezone = generateFakeFingerprintTimezone();
  const fakeResolution = generateFakeFingerprintScreenResolution();
  const fakeUserAgent = generateFakeFingerprintUserAgent();
  const fakeFingerprint = {
    fingerprint: {
      uaBrowser: {
        name: fakeUserAgent.browser.name,
        version: fakeUserAgent.browser.version,
        major: fakeUserAgent.browser.major,
      },
      uaString: fakeUserAgent.ua,
      uaDevice: {
        model: fakeUserAgent.device.model,
        type: fakeUserAgent.device.type,
        vendor: fakeUserAgent.device.vendor,
      },
      uaEngine: {
        name: fakeUserAgent.engine.name,
        version: fakeUserAgent.engine.version,
      },
      uaOS: {
        name: fakeUserAgent.os.name,
        version: fakeUserAgent.os.version,
      },
      uaCPU: {
        architecture: fakeUserAgent.cpu.architecture,
      },
      uaPlatform: fakeUserAgent.platform,
      language: 'en-US',
      colorDepth: 24,
      pixelRatio: _.sample([1, 2, 3, 4]),
      screenResolution: `${fakeResolution.width}x${fakeResolution.height}`,
      availableScreenResolution: `${fakeResolution.width}x${fakeResolution.height}`,
      timezone: fakeTimezone.timezone,
      timezoneOffset: fakeTimezone.timezoneOffset,
      localStorage: true,
      sessionStorage: true,
      indexedDb: true,
      addBehavior: false,
      openDatabase: false,
      cpuClass: null,
      platform: fakeUserAgent.platform,
      doNotTrack: _.sample(['1', '0', null]),
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
 * Generate fake ready buttons.
 *
 * @param {GenerateFakeReadyButtonsButtons}      buttons      - Buttons.
 * @param {GenerateFakeReadyButtonsIsCleanState} isCleanState - Is clean state.
 * @param {GenerateFakeReadyButtonsOptions}      options      - Options.
 *
 * @returns {GenerateFakeReadyButtonsReturns}
 *
 * @since 1.0.0
 */
export function generateFakeReadyButtons(buttons: GenerateFakeReadyButtonsButtons, isCleanState: GenerateFakeReadyButtonsIsCleanState, options: GenerateFakeReadyButtonsOptions): GenerateFakeReadyButtonsReturns {
  const readyButtons: GenerateFakeReadyButtonsReadyButtons = [];

  // If the button is a "Disarming" button, generate the two arm buttons.
  if (buttons.length === 1 && buttons[0].buttonText === 'Disarming') {
    const displayedButtons: GenerateFakeReadyButtonsDisplayedButtons = [
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
        buttonText: displayedButton.buttonText,
        changeAccessCode: false,
        loadingText: displayedButton.loadingText,
        relativeUrl: options.relativeUrl,
        totalButtons: buttons.length,
        urlParams: {
          arm: displayedButton.arm,
          armState: (isCleanState) ? 'off' : 'disarmed',
          href: options.href,
          sat: options.sat,
        },
      });
    });

    return readyButtons;
  }

  buttons.forEach((button, buttonIndex) => {
    // If button is already a "ready button", copy the button and skip processing.
    if (!button.buttonDisabled) {
      readyButtons.push(button);

      return;
    }

    switch (button.buttonText) {
      case 'Arming Away':
        readyButtons.push({
          buttonId: button.buttonId,
          buttonDisabled: false,
          buttonIndex,
          buttonText: 'Disarm',
          changeAccessCode: false,
          loadingText: 'Disarming',
          relativeUrl: options.relativeUrl,
          totalButtons: buttons.length,
          urlParams: {
            arm: 'off',
            armState: (isCleanState) ? 'away' : 'away',
            href: options.href,
            sat: options.sat,
          },
        });
        break;
      case 'Arming Night':
        readyButtons.push({
          buttonId: button.buttonId,
          buttonDisabled: false,
          buttonIndex,
          buttonText: 'Disarm',
          changeAccessCode: false,
          loadingText: 'Disarming',
          relativeUrl: options.relativeUrl,
          totalButtons: buttons.length,
          urlParams: {
            arm: 'off',
            armState: (isCleanState) ? 'night' : 'night+stay',
            href: options.href,
            sat: options.sat,
          },
        });
        break;
      case 'Arming Stay':
        readyButtons.push({
          buttonId: button.buttonId,
          buttonDisabled: false,
          buttonIndex,
          buttonText: 'Disarm',
          changeAccessCode: false,
          loadingText: 'Disarming',
          relativeUrl: options.relativeUrl,
          totalButtons: buttons.length,
          urlParams: {
            arm: 'off',
            armState: (isCleanState) ? 'stay' : 'stay',
            href: options.href,
            sat: options.sat,
          },
        });
        break;
      default:
        break;
    }
  });

  return readyButtons;
}
