import type { DateTimeMaybeValid } from 'luxon';
import type { IResult } from 'ua-parser-js';

import type {
  Constant_PortalPanelArmButtonHref,
  Constant_PortalPanelArmButtonLoadingText,
  Constant_PortalPanelArmButtonRelativeUrl,
  Constant_PortalPanelArmButtonText,
  Constant_PortalPanelArmValue,
} from '../constant.d.ts';
import type {
  Shared_BrowserRelease,
  Shared_OrbSecurityButtonBase,
  Shared_OrbSecurityButtonReady,
  Shared_OrbSecurityButtons,
  Shared_Uuid,
} from '../shared.d.ts';
import type { Lib_Api_ADTPulseAPI_Session_IsCleanState } from './api.d.ts';

/**
 * Lib - Fake - Generate Fake Dynatrace Pc Header Value.
 *
 * @since 1.0.0
 */
export type Lib_Fake_GenerateFakeDynatracePCHeaderValue_Mode = 'force-arm' | 'keep-alive' | 'multi-factor';

export type Lib_Fake_GenerateFakeDynatracePCHeaderValue_Returns = string;

export type Lib_Fake_GenerateFakeDynatracePCHeaderValue_ServerId = number;

export type Lib_Fake_GenerateFakeDynatracePCHeaderValue_CurrentMillis = string;

export type Lib_Fake_GenerateFakeDynatracePCHeaderValue_SlicedMillis = string;

export type Lib_Fake_GenerateFakeDynatracePCHeaderValue_RandomThreeDigit = number;

export type Lib_Fake_GenerateFakeDynatracePCHeaderValue_RandomOneToTwoDigit = number;

export type Lib_Fake_GenerateFakeDynatracePCHeaderValue_RandomAlphabet = string;

/**
 * Lib - Fake - Generate Fake Fingerprint Fonts.
 *
 * @since 1.0.0
 */
export type Lib_Fake_GenerateFakeFingerprintFonts_Returns = string[];

export type Lib_Fake_GenerateFakeFingerprintFonts_AvailableFonts = string[];

export type Lib_Fake_GenerateFakeFingerprintFonts_OptionalFonts = string[];

/**
 * Lib - Fake - Generate Fake Fingerprint Plugins.
 *
 * @since 1.0.0
 */
export type Lib_Fake_GenerateFakeFingerprintPlugins_Returns = string[];

/**
 * Lib - Fake - Generate Fake Fingerprint Screen Resolution.
 *
 * @since 1.0.0
 */
export type Lib_Fake_GenerateFakeFingerprintScreenResolution_Returns_Width = number;

export type Lib_Fake_GenerateFakeFingerprintScreenResolution_Returns_Height = number;

export type Lib_Fake_GenerateFakeFingerprintScreenResolution_Returns = {
  width: Lib_Fake_GenerateFakeFingerprintScreenResolution_Returns_Width;
  height: Lib_Fake_GenerateFakeFingerprintScreenResolution_Returns_Height;
};

export type Lib_Fake_GenerateFakeFingerprintScreenResolution_AvailableResolutions = Lib_Fake_GenerateFakeFingerprintScreenResolution_Returns[];

/**
 * Lib - Fake - Generate Fake Fingerprint Timezone.
 *
 * @since 1.0.0
 */
export type Lib_Fake_GenerateFakeFingerprintTimezone_Returns_Timezone = string;

export type Lib_Fake_GenerateFakeFingerprintTimezone_Returns_TimezoneOffset = number;

export type Lib_Fake_GenerateFakeFingerprintTimezone_Returns = {
  timezone: Lib_Fake_GenerateFakeFingerprintTimezone_Returns_Timezone;
  timezoneOffset: Lib_Fake_GenerateFakeFingerprintTimezone_Returns_TimezoneOffset;
};

export type Lib_Fake_GenerateFakeFingerprintTimezone_FakeTimeZone = string;

export type Lib_Fake_GenerateFakeFingerprintTimezone_DateTime = DateTimeMaybeValid;

/**
 * Lib - Fake - Generate Fake Fingerprint User Agent.
 *
 * @since 1.0.0
 */
export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Browser_Major = string | null;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Browser_Name = string | null;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Browser_Version = string | null;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Browser = {
  major: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Browser_Major;
  name: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Browser_Name;
  version: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Browser_Version;
};

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Cpu_Architecture = string | null;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Cpu = {
  architecture: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Cpu_Architecture;
};

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Device_Model = string | null;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Device_Type = string | null;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Device_Vendor = string | null;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Device = {
  model: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Device_Model;
  type: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Device_Type;
  vendor: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Device_Vendor;
};

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Engine_Name = string | null;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Engine_Version = string | null;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Engine = {
  name: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Engine_Name;
  version: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Engine_Version;
};

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Os_Name = string | null;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Os_Version = string | null;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Os = {
  name: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Os_Name;
  version: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Os_Version;
};

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Platform = string | null;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Ua = string;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Returns = {
  browser: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Browser;
  cpu: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Cpu;
  device: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Device;
  engine: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Engine;
  os: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Os;
  platform: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Platform;
  ua: Lib_Fake_GenerateFakeFingerprintUserAgent_Returns_Ua;
};

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Release = Shared_BrowserRelease;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_Major = string;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_ChromiumMajor = string;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_FakeUserAgent = string;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_ParsedUserAgent = IResult;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_IsWindows = 'Win32' | null;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_IsMacintosh = 'MacIntel' | null;

export type Lib_Fake_GenerateFakeFingerprintUserAgent_IsLinux = 'Linux x86_64' | null;

/**
 * Lib - Fake - Generate Fake Login Fingerprint.
 *
 * @since 1.0.0
 */
export type Lib_Fake_GenerateFakeLoginFingerprint_Returns = string;

export type Lib_Fake_GenerateFakeLoginFingerprint_Release = Shared_BrowserRelease;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeTimezone_Timezone = string;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeTimezone_TimezoneOffset = number;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeTimezone = {
  timezone: Lib_Fake_GenerateFakeLoginFingerprint_FakeTimezone_Timezone;
  timezoneOffset: Lib_Fake_GenerateFakeLoginFingerprint_FakeTimezone_TimezoneOffset;
};

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeResolution_Width = number;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeResolution_Height = number;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeResolution = {
  width: Lib_Fake_GenerateFakeLoginFingerprint_FakeResolution_Width;
  height: Lib_Fake_GenerateFakeLoginFingerprint_FakeResolution_Height;
};

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Browser_Major = string | null;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Browser_Name = string | null;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Browser_Version = string | null;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Browser = {
  major: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Browser_Major;
  name: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Browser_Name;
  version: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Browser_Version;
};

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Cpu_Architecture = string | null;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Cpu = {
  architecture: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Cpu_Architecture;
};

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Device_Model = string | null;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Device_Type = string | null;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Device_Vendor = string | null;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Device = {
  model: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Device_Model;
  type: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Device_Type;
  vendor: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Device_Vendor;
};

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Engine_Name = string | null;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Engine_Version = string | null;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Engine = {
  name: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Engine_Name;
  version: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Engine_Version;
};

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Os_Name = string | null;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Os_Version = string | null;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Os = {
  name: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Os_Name;
  version: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Os_Version;
};

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Platform = string | null;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Ua = string;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent = {
  browser: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Browser;
  cpu: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Cpu;
  device: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Device;
  engine: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Engine;
  os: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Os;
  platform: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Platform;
  ua: Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Ua;
};

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UaBrowser = Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Browser;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UaString = Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Ua;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UaDevice = Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Device;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UaEngine = Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Engine;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UaOS = Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Os;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UaCPU = Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Cpu;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UaPlatform = Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Platform;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_Language = string;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_ColorDepth = number;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_PixelRatio = number;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_ScreenResolution = string;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_AvailableScreenResolution = string;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_Timezone = Lib_Fake_GenerateFakeLoginFingerprint_FakeTimezone_Timezone;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_TimezoneOffset = Lib_Fake_GenerateFakeLoginFingerprint_FakeTimezone_TimezoneOffset;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_LocalStorage = boolean;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_SessionStorage = boolean;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_IndexedDb = boolean;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_AddBehavior = boolean;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_OpenDatabase = boolean;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_CpuClass = null;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_Platform = Lib_Fake_GenerateFakeLoginFingerprint_FakeUserAgent_Platform;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_DoNotTrack = string | null;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_Plugins = string;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_Canvas = number;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_WebGl = number;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_AdBlock = boolean;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UserTamperLanguage = boolean;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UserTamperScreenResolution = boolean;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UserTamperOS = boolean;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UserTamperBrowser = boolean;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_TouchSupport_MaxTouchPoints = number;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_TouchSupport_TouchEvent = boolean;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_TouchSupport_TouchStart = boolean;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_TouchSupport = {
  maxTouchPoints: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_TouchSupport_MaxTouchPoints;
  touchEvent: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_TouchSupport_TouchEvent;
  touchStart: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_TouchSupport_TouchStart;
};

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_CookieSupport = boolean;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_Fonts = string;

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint = {
  uaBrowser: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UaBrowser;
  uaString: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UaString;
  uaDevice: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UaDevice;
  uaEngine: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UaEngine;
  uaOS: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UaOS;
  uaCPU: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UaCPU;
  uaPlatform: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UaPlatform;
  language: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_Language;
  colorDepth: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_ColorDepth;
  pixelRatio: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_PixelRatio;
  screenResolution: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_ScreenResolution;
  availableScreenResolution: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_AvailableScreenResolution;
  timezone: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_Timezone;
  timezoneOffset: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_TimezoneOffset;
  localStorage: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_LocalStorage;
  sessionStorage: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_SessionStorage;
  indexedDb: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_IndexedDb;
  addBehavior: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_AddBehavior;
  openDatabase: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_OpenDatabase;
  cpuClass: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_CpuClass;
  platform: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_Platform;
  doNotTrack: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_DoNotTrack;
  plugins: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_Plugins;
  canvas: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_Canvas;
  webGl: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_WebGl;
  adBlock: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_AdBlock;
  userTamperLanguage: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UserTamperLanguage;
  userTamperScreenResolution: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UserTamperScreenResolution;
  userTamperOS: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UserTamperOS;
  userTamperBrowser: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_UserTamperBrowser;
  touchSupport: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_TouchSupport;
  cookieSupport: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_CookieSupport;
  fonts: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint_Fonts;
};

export type Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint = {
  fingerprint: Lib_Fake_GenerateFakeLoginFingerprint_FakeFingerprint_Fingerprint;
};

/**
 * Lib - Fake - Generate Fake Ready Buttons.
 *
 * @since 1.0.0
 */
export type Lib_Fake_GenerateFakeReadyButtons_Buttons = Shared_OrbSecurityButtons;

export type Lib_Fake_GenerateFakeReadyButtons_IsCleanState = Lib_Api_ADTPulseAPI_Session_IsCleanState;

export type Lib_Fake_GenerateFakeReadyButtons_Options_RelativeUrl = Constant_PortalPanelArmButtonRelativeUrl;

export type Lib_Fake_GenerateFakeReadyButtons_Options_Href = Constant_PortalPanelArmButtonHref;

export type Lib_Fake_GenerateFakeReadyButtons_Options_Sat = Shared_Uuid;

export type Lib_Fake_GenerateFakeReadyButtons_Options = {
  relativeUrl: Lib_Fake_GenerateFakeReadyButtons_Options_RelativeUrl;
  href: Lib_Fake_GenerateFakeReadyButtons_Options_Href;
  sat: Lib_Fake_GenerateFakeReadyButtons_Options_Sat;
};

export type Lib_Fake_GenerateFakeReadyButtons_Returns = (Shared_OrbSecurityButtonBase & Shared_OrbSecurityButtonReady)[];

export type Lib_Fake_GenerateFakeReadyButtons_ReadyButtons = (Shared_OrbSecurityButtonBase & Shared_OrbSecurityButtonReady)[];

export type Lib_Fake_GenerateFakeReadyButtons_DisplayedButton_ButtonText = Constant_PortalPanelArmButtonText;

export type Lib_Fake_GenerateFakeReadyButtons_DisplayedButton_LoadingText = Constant_PortalPanelArmButtonLoadingText;

export type Lib_Fake_GenerateFakeReadyButtons_DisplayedButton_Arm = Constant_PortalPanelArmValue;

export type Lib_Fake_GenerateFakeReadyButtons_DisplayedButton = {
  buttonText: Lib_Fake_GenerateFakeReadyButtons_DisplayedButton_ButtonText;
  loadingText: Lib_Fake_GenerateFakeReadyButtons_DisplayedButton_LoadingText;
  arm: Lib_Fake_GenerateFakeReadyButtons_DisplayedButton_Arm;
};

export type Lib_Fake_GenerateFakeReadyButtons_DisplayedButtons = Lib_Fake_GenerateFakeReadyButtons_DisplayedButton[];

/**
 * Lib - Fake - Get Fingerprint Request Headers.
 *
 * @since 3.5.0
 */
export type Lib_Fake_GetFingerprintRequestHeaders_Returns = Record<string, string>;

export type Lib_Fake_GetFingerprintRequestHeaders_Fingerprint = string;

export type Lib_Fake_GetFingerprintRequestHeaders_UserAgent = string;

export type Lib_Fake_GetFingerprintRequestHeaders_Platform = string | null;

export type Lib_Fake_GetFingerprintRequestHeaders_Major = string;

export type Lib_Fake_GetFingerprintRequestHeaders_Decoded = unknown;

export type Lib_Fake_GetFingerprintRequestHeaders_Identity_UaString = string;

export type Lib_Fake_GetFingerprintRequestHeaders_Identity_UaPlatform = string | null;

export type Lib_Fake_GetFingerprintRequestHeaders_Identity_UaBrowser_Major = string | null;

export type Lib_Fake_GetFingerprintRequestHeaders_Identity_UaBrowser = {
  major: Lib_Fake_GetFingerprintRequestHeaders_Identity_UaBrowser_Major;
};

export type Lib_Fake_GetFingerprintRequestHeaders_Identity = {
  uaString: Lib_Fake_GetFingerprintRequestHeaders_Identity_UaString;
  uaPlatform: Lib_Fake_GetFingerprintRequestHeaders_Identity_UaPlatform;
  uaBrowser: Lib_Fake_GetFingerprintRequestHeaders_Identity_UaBrowser;
};

export type Lib_Fake_GetFingerprintRequestHeaders_Fallback_Ua = string;

export type Lib_Fake_GetFingerprintRequestHeaders_Fallback_Platform = string | null;

export type Lib_Fake_GetFingerprintRequestHeaders_Fallback_Browser_Major = string | null;

export type Lib_Fake_GetFingerprintRequestHeaders_Fallback_Browser = {
  major: Lib_Fake_GetFingerprintRequestHeaders_Fallback_Browser_Major;
};

export type Lib_Fake_GetFingerprintRequestHeaders_Fallback = {
  ua: Lib_Fake_GetFingerprintRequestHeaders_Fallback_Ua;
  platform: Lib_Fake_GetFingerprintRequestHeaders_Fallback_Platform;
  browser: Lib_Fake_GetFingerprintRequestHeaders_Fallback_Browser;
};

export type Lib_Fake_GetFingerprintRequestHeaders_Headers = Record<string, string>;

export type Lib_Fake_GetFingerprintRequestHeaders_ChromePart = string | undefined;

export type Lib_Fake_GetFingerprintRequestHeaders_ChromiumMajor = string;

export type Lib_Fake_GetFingerprintRequestHeaders_Brand = string;
