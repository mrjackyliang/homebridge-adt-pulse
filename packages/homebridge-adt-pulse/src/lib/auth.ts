import { randomInt } from 'node:crypto';

import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { JSDOM } from 'jsdom';
import _ from 'lodash';
import { isErrorLike, serializeError } from 'serialize-error';
import { CookieJar } from 'tough-cookie';

import { readPackagedBrowserSnapshot, resolveBrowserRelease } from './browser-releases.js';
import { detectGlobalDebugParser, detectGlobalPortalVersion } from './detect.js';
import { generateFakeDynatracePCHeaderValue, generateFakeLoginFingerprint, getFingerprintRequestHeaders } from './fake.js';
import {
  objectKeyClientType,
  objectKeyLocale,
  objectKeyLogin,
  objectKeyPreAuthToken,
  objectKeySat,
  requestPathAccessSignIn,
  requestPathAccessSignInEXxPartnerAdt,
  requestPathMfaMfaSignInWorkflowChallenge,
  requestPathNgaServRunRraProxyHrefRestAdtUiClientMultiFactorAuthAddTrustedDeviceSatXx,
  requestPathNgaServRunRraProxyHrefRestAdtUiClientMultiFactorAuthRequestOtpForRegisteredPropertySatXx,
  requestPathNgaServRunRraProxyHrefRestAdtUiClientMultiFactorAuthValidateOtpSatXx,
  requestPathNgaServRunRraProxyHrefRestIcontrolUiClientMultiFactorAuthSatXx,
  requestPathNgaServRunRraProxyOnlyClientMultiFactorAuthExcludeSatXxHrefRestAdtUiUpdatesSatXx,
  requestPathSummarySummary,
  requestPathSystemSystem,
  textOneTimePasscode,
} from './regex.js';
import { multiFactorAuth, otpResponse } from './schema.js';
import {
  debugLog,
  fetchErrorMessage,
  findNullKeys,
  generateHash,
  parseMultiFactorMethods,
  parseMultiFactorTrustedDevices,
  parseSensorsTable,
  stackTracer,
} from './utility.js';

import type {
  Lib_Auth_ADTPulseAuth_AddTrustedDevice_AxiosAddDeviceRequestPath,
  Lib_Auth_ADTPulseAuth_AddTrustedDevice_AxiosAddDeviceRequestPathValid,
  Lib_Auth_ADTPulseAuth_AddTrustedDevice_DeviceName,
  Lib_Auth_ADTPulseAuth_AddTrustedDevice_ErrorObject,
  Lib_Auth_ADTPulseAuth_AddTrustedDevice_ParsedValidateCode,
  Lib_Auth_ADTPulseAuth_AddTrustedDevice_Returns,
  Lib_Auth_ADTPulseAuth_AddTrustedDevice_Sessions,
  Lib_Auth_ADTPulseAuth_AddTrustedDevice_TrustedDeviceForm,
  Lib_Auth_ADTPulseAuth_Browser,
  Lib_Auth_ADTPulseAuth_BrowserCacheDirectory,
  Lib_Auth_ADTPulseAuth_CompleteSignIn_AxiosPostSignInRequestPath,
  Lib_Auth_ADTPulseAuth_CompleteSignIn_AxiosPostSignInRequestPathValid,
  Lib_Auth_ADTPulseAuth_CompleteSignIn_ErrorObject,
  Lib_Auth_ADTPulseAuth_CompleteSignIn_Returns,
  Lib_Auth_ADTPulseAuth_CompleteSignIn_Sessions,
  Lib_Auth_ADTPulseAuth_Connection,
  Lib_Auth_ADTPulseAuth_Constructor_Browsers,
  Lib_Auth_ADTPulseAuth_Constructor_Config,
  Lib_Auth_ADTPulseAuth_Constructor_InternalConfig,
  Lib_Auth_ADTPulseAuth_Credentials,
  Lib_Auth_ADTPulseAuth_FingerprintPrepared,
  Lib_Auth_ADTPulseAuth_GetFingerprint_Returns,
  Lib_Auth_ADTPulseAuth_GetRequestConfig_DefaultConfig,
  Lib_Auth_ADTPulseAuth_GetRequestConfig_ExtraConfig,
  Lib_Auth_ADTPulseAuth_GetRequestConfig_Returns,
  Lib_Auth_ADTPulseAuth_GetSensors_AxiosSystemRequestPath,
  Lib_Auth_ADTPulseAuth_GetSensors_AxiosSystemRequestPathValid,
  Lib_Auth_ADTPulseAuth_GetSensors_ErrorObject,
  Lib_Auth_ADTPulseAuth_GetSensors_JsdomSystemSensorsTable,
  Lib_Auth_ADTPulseAuth_GetSensors_ParsedSensorsConfigTable,
  Lib_Auth_ADTPulseAuth_GetSensors_Returns,
  Lib_Auth_ADTPulseAuth_GetSensors_Sessions,
  Lib_Auth_ADTPulseAuth_GetTrustedDevices_AxiosDevicePollRequestPath,
  Lib_Auth_ADTPulseAuth_GetTrustedDevices_AxiosDevicePollRequestPathValid,
  Lib_Auth_ADTPulseAuth_GetTrustedDevices_ErrorObject,
  Lib_Auth_ADTPulseAuth_GetTrustedDevices_ParsedDevicePoll,
  Lib_Auth_ADTPulseAuth_GetTrustedDevices_ParsedTrustedDevices,
  Lib_Auth_ADTPulseAuth_GetTrustedDevices_Returns,
  Lib_Auth_ADTPulseAuth_GetTrustedDevices_Sessions,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosIndexRequestPath,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosIndexRequestPathValid,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosMethodsRequestPath,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosMethodsRequestPathValid,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosSignInRequestPath,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosSignInRequestPathValid,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_ErrorMessage,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_ErrorObject,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_LoginForm,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_MatchClientType,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_MatchLocale,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_MatchLogin,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_MatchPreAuthToken,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_MatchSatCode,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_ParsedMethods,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_ParsedMultiFactorMethods,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_PortalVersion,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_Returns,
  Lib_Auth_ADTPulseAuth_GetVerificationMethods_Sessions,
  Lib_Auth_ADTPulseAuth_HandleLoginFailure_ErrorMessage,
  Lib_Auth_ADTPulseAuth_HandleLoginFailure_RequestPath,
  Lib_Auth_ADTPulseAuth_HandleLoginFailure_Returns,
  Lib_Auth_ADTPulseAuth_HandleLoginFailure_Session,
  Lib_Auth_ADTPulseAuth_Internal,
  Lib_Auth_ADTPulseAuth_NewInformationDispatcher_Data,
  Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DataDebugParser,
  Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DataHash,
  Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DataPortalVersion,
  Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DetectedNew,
  Lib_Auth_ADTPulseAuth_NewInformationDispatcher_Returns,
  Lib_Auth_ADTPulseAuth_NewInformationDispatcher_Type,
  Lib_Auth_ADTPulseAuth_RequestCode_AxiosRequestCodeRequestPath,
  Lib_Auth_ADTPulseAuth_RequestCode_AxiosRequestCodeRequestPathValid,
  Lib_Auth_ADTPulseAuth_RequestCode_ErrorObject,
  Lib_Auth_ADTPulseAuth_RequestCode_MethodId,
  Lib_Auth_ADTPulseAuth_RequestCode_ParsedRequestCode,
  Lib_Auth_ADTPulseAuth_RequestCode_RequestCodeForm,
  Lib_Auth_ADTPulseAuth_RequestCode_Returns,
  Lib_Auth_ADTPulseAuth_RequestCode_Sessions,
  Lib_Auth_ADTPulseAuth_ResetSession_Returns,
  Lib_Auth_ADTPulseAuth_Session,
  Lib_Auth_ADTPulseAuth_ValidateCode_AxiosValidateCodeRequestPath,
  Lib_Auth_ADTPulseAuth_ValidateCode_AxiosValidateCodeRequestPathValid,
  Lib_Auth_ADTPulseAuth_ValidateCode_ErrorObject,
  Lib_Auth_ADTPulseAuth_ValidateCode_OtpCode,
  Lib_Auth_ADTPulseAuth_ValidateCode_ParsedValidateCode,
  Lib_Auth_ADTPulseAuth_ValidateCode_Returns,
  Lib_Auth_ADTPulseAuth_ValidateCode_Sessions,
  Lib_Auth_ADTPulseAuth_ValidateCode_ValidateCodeForm,
} from '../types/lib/auth.d.ts';

/**
 * Lib - Auth.
 *
 * Drives the ADT Pulse portal multi-factor authentication workflow so the
 * plugin can validate credentials, register trusted devices, and fetch the
 * sensor list before the accessory starts polling.
 *
 * @since 1.0.0
 */
export class ADTPulseAuth {
  /**
   * ADT Pulse Auth - Connection.
   *
   * Holds the portal subdomain used to build request URLs so every request
   * made by this instance targets the same regional portal.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #connection: Lib_Auth_ADTPulseAuth_Connection;

  /**
   * ADT Pulse Auth - Credentials.
   *
   * Stores the username, password, and generated fingerprint that the
   * sign-in emulation submits when authenticating with the portal.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #credentials: Lib_Auth_ADTPulseAuth_Credentials;

  /**
   * ADT Pulse Auth - Internal.
   *
   * Keeps instance-wide settings such as the base URL, debug flag, logger,
   * and the hashes of information that was already reported.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #internal: Lib_Auth_ADTPulseAuth_Internal;

  /**
   * ADT Pulse Auth - Session.
   *
   * Tracks the HTTP client, MFA state, portal version, and current
   * authentication status for this sign-in attempt.
   *
   * @private
   *
   * @since 1.0.0
   */
  #session: Lib_Auth_ADTPulseAuth_Session;

  /**
   * ADT Pulse Auth - Browser.
   *
   * Holds the selected synthetic browser for the current sign-in.
   * The browser stays fixed while release metadata is refreshed.
   *
   * @private
   *
   * @since 3.5.0
   */
  readonly #browser: Lib_Auth_ADTPulseAuth_Browser;

  /**
   * ADT Pulse Auth - Browser Cache Directory.
   *
   * Reuses Homebridge's storage directory for verified release metadata.
   * The package snapshot remains available when storage cannot be written.
   *
   * @private
   *
   * @since 3.5.0
   */
  readonly #browserCacheDirectory: Lib_Auth_ADTPulseAuth_BrowserCacheDirectory;

  /**
   * ADT Pulse Auth - Fingerprint Prepared.
   *
   * Prevents a second release lookup after login has begun.
   * This also keeps the generated fingerprint stable for this session.
   *
   * @private
   *
   * @since 3.5.0
   */
  #fingerprintPrepared: Lib_Auth_ADTPulseAuth_FingerprintPrepared = false;

  /**
   * Lib - Auth - Constructor.
   *
   * Builds the initial connection, credentials, internal, and session state
   * so the instance starts from a clean logged-out baseline.
   *
   * @param {Lib_Auth_ADTPulseAuth_Constructor_Config}         config         - Config.
   * @param {Lib_Auth_ADTPulseAuth_Constructor_InternalConfig} internalConfig - Internal config.
   *
   * @since 1.0.0
   */
  public constructor(config: Lib_Auth_ADTPulseAuth_Constructor_Config, internalConfig: Lib_Auth_ADTPulseAuth_Constructor_InternalConfig) {
    const browsers: Lib_Auth_ADTPulseAuth_Constructor_Browsers = [
      'chrome',
      'edge',
      'firefox',
      'opera',
    ];

    this.#browser = browsers[randomInt(browsers.length)] ?? 'chrome';
    this.#browserCacheDirectory = internalConfig['browserCacheDirectory'];

    // Set connection options.
    this.#connection = {
      subdomain: config['subdomain'],
    };

    // Set credentials options.
    this.#credentials = {
      fingerprint: generateFakeLoginFingerprint(readPackagedBrowserSnapshot()['releases'][this.#browser]),
      password: config['password'],
      username: config['username'],
    };

    // Set internal options.
    this.#internal = {
      baseUrl: internalConfig['baseUrl'] ?? `https://${this.#connection['subdomain']}.adtpulse.com`,
      debug: internalConfig['debug'] ?? false,
      logger: internalConfig['logger'] ?? null,
      reportedHashes: [],
    };

    // Set session options.
    this.#session = {
      httpClient: wrapper(axios.create({
        jar: new CookieJar(),
        validateStatus: () => true,
      })),
      mfa: {
        clientType: null,
        locale: null,
        login: null,
        preAuthToken: null,
        satCode: null,
        token: null,
        trustedDevices: [],
        verificationMethods: [],
      },
      portalVersion: null,
      status: 'logged-out',
    };

    return;
  }

  /**
   * Lib - Auth - Get Verification Methods.
   *
   * Signs in to the portal and scrapes the MFA state so callers can present
   * the available verification methods to the user.
   *
   * @returns {Lib_Auth_ADTPulseAuth_GetVerificationMethods_Returns}
   *
   * @since 1.0.0
   */
  public async getVerificationMethods(): Lib_Auth_ADTPulseAuth_GetVerificationMethods_Returns {
    let errorObject: Lib_Auth_ADTPulseAuth_GetVerificationMethods_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Attempting to retrieve verification methods from "${this.#internal['baseUrl']}"`);
    }

    try {
      const sessions: Lib_Auth_ADTPulseAuth_GetVerificationMethods_Sessions = {};

      // Check if "this instance" has already retrieved verification methods.
      if (
        this.#session['status'] === 'complete'
        || this.#session['status'] === 'not-required'
      ) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', 'Already retrieved verification methods');
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: true,
          info: {
            methods: this.#session['mfa']['verificationMethods'],
            status: this.#session['status'],
          },
        };
      }

      if (this.#fingerprintPrepared === false) {
        Reflect.set(this.#credentials, 'fingerprint', generateFakeLoginFingerprint((await resolveBrowserRelease(this.#browser, this.#browserCacheDirectory))['release']));
        this.#fingerprintPrepared = true;
      }

      // sessions.axiosIndex: Load the homepage.
      sessions.axiosIndex = await this.#session['httpClient'].get<unknown>(
        `${this.#internal['baseUrl']}/`,
        this.getRequestConfig(),
      );

      // Check for server error response.
      if (sessions['axiosIndex'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', `The remote server responded with a HTTP ${sessions['axiosIndex'].status} status code`);
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosIndex'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosIndex']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosIndexRequestPath: Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosIndexRequestPath = sessions['axiosIndex']['request'].path;
      const axiosIndexRequestPathValid: Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosIndexRequestPathValid = requestPathAccessSignIn.test(axiosIndexRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Request path ➜ ${axiosIndexRequestPath}`);
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Request path valid ➜ ${axiosIndexRequestPathValid}`);
      }

      // If the final URL of sessions.axiosIndex is not the sign-in page.
      if (axiosIndexRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', `"${axiosIndexRequestPath} is not the sign-in page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosIndexRequestPath, sessions['axiosIndex']);

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: `"${axiosIndexRequestPath} is not the sign-in page`,
          },
        };
      }

      // Build an "application/x-www-form-urlencoded" form for use with logging in.
      const loginForm: Lib_Auth_ADTPulseAuth_GetVerificationMethods_LoginForm = new URLSearchParams();

      loginForm.append('usernameForm', this.#credentials['username']);
      loginForm.append('passwordForm', this.#credentials['password']);
      loginForm.append('sun', 'yes'); // Remember my username.
      loginForm.append('networkid', ''); // Blank if URL does not have the "networkid" param.
      loginForm.append('fingerprint', this.#credentials['fingerprint']);

      /**
       * Detailed parsing information for "portalVersion".
       *
       * The sign-in redirect path (e.g. "/myhome/16.0.0-131/access/signin.jsp") embeds
       * the portal version, and the "replace()" call extracts it (e.g. "16.0.0-131").
       * NOTICE: Responses may be inaccurate or missing.
       *
       * @since 1.0.0
       */
      this.#session.portalVersion = axiosIndexRequestPath.replace(requestPathAccessSignIn, '$2') as Lib_Auth_ADTPulseAuth_GetVerificationMethods_PortalVersion;

      /**
       * Check if "portalVersion" needs documenting or testing.
       *
       * Tracked versions: 16.0.0-131, 17.0.0-69, 18.0.0-78, 19.0.0-89, 20.0.0-221,
       * 20.0.0-244, 21.0.0-344, 21.0.0-353, 21.0.0-354, 22.0.0-233, 23.0.0-99,
       * 24.0.0-117, 25.0.0-21, 26.0.0-32, 27.0.0-140, 28.0.0-57, 29.0.0-28, 30.0.0-61.
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('portal-version', { version: this.#session['portalVersion'] });

      // sessions.axiosSignIn: Emulate a sign-in request.
      sessions.axiosSignIn = await this.#session['httpClient'].post<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/access/signin.jsp?e=ns&partner=adt`,
        loginForm,
        this.getRequestConfig({
          headers: {
            'Cache-Control': 'max-age=0',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': this.#internal['baseUrl'],
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/access/signin.jsp?e=ns&partner=adt`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosSignIn'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', `The remote server responded with a HTTP ${sessions['axiosSignIn'].status} status code`);
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosSignIn'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosSignIn']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSignInRequestPath: Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosSignInRequestPath = sessions['axiosSignIn']['request'].path;
      const axiosSignInRequestPathValid: Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosSignInRequestPathValid = requestPathMfaMfaSignInWorkflowChallenge.test(axiosSignInRequestPath) || requestPathSummarySummary.test(axiosSignInRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Request path ➜ ${axiosSignInRequestPath}`);
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Request path valid ➜ ${axiosSignInRequestPathValid}`);
      }

      // Test if the login response does not require further verification.
      if (requestPathSummarySummary.test(axiosSignInRequestPath) === true) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Verification methods not required from "${this.#internal['baseUrl']}"`);
        }

        // Mark the session for "this instance" as authenticated.
        this.#session.status = 'not-required';

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: true,
          info: {
            methods: this.#session['mfa']['verificationMethods'],
            status: this.#session['status'],
          },
        };
      }

      // Test if the login response had an error.
      if (requestPathAccessSignIn.test(axiosSignInRequestPath) === true || requestPathAccessSignInEXxPartnerAdt.test(axiosSignInRequestPath) === true) {
        const errorMessage: Lib_Auth_ADTPulseAuth_GetVerificationMethods_ErrorMessage = fetchErrorMessage(sessions['axiosSignIn']);

        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', errorMessage ?? 'Unknown error');
        }

        // Mark the session for "this instance" as de-authenticated.
        this.#session.status = 'logged-out';

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: errorMessage ?? 'Unknown error',
          },
        };
      }

      // If the final URL of sessions.axiosSignIn is not the workflow challenge page.
      if (axiosSignInRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', `"${axiosSignInRequestPath}" is not the workflow challenge page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSignInRequestPath, sessions['axiosSignIn']);

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: `"${axiosSignInRequestPath}" is not the workflow challenge page`,
          },
        };
      }

      // Make sure we are able to use the "String.prototype.match()" method on the response data.
      if (typeof sessions['axiosSignIn'].data !== 'string') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'The response body of the workflow challenge page is not of type "string"');
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: 'The response body of the workflow challenge page is not of type "string"',
          },
        };
      }

      /**
       * Original matches for the mfa object.
       *
       * The workflow challenge page embeds a "window.g.mfa" object; only the
       * "xClientType", "locale", "xLogin", "xPreAuthToken", and "sat" keys are stored.
       * Each key is loosely matched (two elements) to absorb unexpected changes.
       *
       * @since 1.0.0
       */
      const matchClientType: Lib_Auth_ADTPulseAuth_GetVerificationMethods_MatchClientType = sessions['axiosSignIn'].data.match(objectKeyClientType);
      const matchLocale: Lib_Auth_ADTPulseAuth_GetVerificationMethods_MatchLocale = sessions['axiosSignIn'].data.match(objectKeyLocale);
      const matchLogin: Lib_Auth_ADTPulseAuth_GetVerificationMethods_MatchLogin = sessions['axiosSignIn'].data.match(objectKeyLogin);
      const matchPreAuthToken: Lib_Auth_ADTPulseAuth_GetVerificationMethods_MatchPreAuthToken = sessions['axiosSignIn'].data.match(objectKeyPreAuthToken);
      const matchSatCode: Lib_Auth_ADTPulseAuth_GetVerificationMethods_MatchSatCode = sessions['axiosSignIn'].data.match(objectKeySat);
      this.#session['mfa'].clientType = (matchClientType !== null && matchClientType.length >= 2) ? matchClientType[1]! : null;
      this.#session['mfa'].locale = (matchLocale !== null && matchLocale.length >= 2) ? matchLocale[1]! : null;
      this.#session['mfa'].login = (matchLogin !== null && matchLogin.length >= 2) ? matchLogin[1]! : null;
      this.#session['mfa'].preAuthToken = (matchPreAuthToken !== null && matchPreAuthToken.length >= 2) ? matchPreAuthToken[1]! : null;
      this.#session['mfa'].satCode = (matchSatCode !== null && matchSatCode.length >= 2) ? matchSatCode[1]! : null;

      if (
        this.#session['mfa']['clientType'] === null // Make sure the "xClientType" key exists in "window.g.mfa" object.
        || this.#session['mfa']['locale'] === null // Make sure the "locale" key exists in "window.g.mfa" object.
        || this.#session['mfa']['login'] === null // Make sure the "xLogin" key exists in "window.g.mfa" object.
        || this.#session['mfa']['preAuthToken'] === null // Make sure the "xPreAuthToken" key exists in "window.g.mfa" object.
        || this.#session['mfa']['satCode'] === null // Make sure the "sat" key exists in "window.g.mfa" object.
      ) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'Failed to retrieve required MFA details from the workflow challenge page');
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: 'Failed to retrieve required MFA details from the workflow challenge page',
          },
        };
      }

      // sessions.axiosMethods: Emulate a verification methods retrieval request.
      sessions.axiosMethods = await this.#session['httpClient'].get<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/nga/serv/RunRRAProxy?href=rest/icontrol/ui/client/multiFactorAuth&sat=${this.#session['mfa']['satCode']}`,
        this.getRequestConfig({
          headers: {
            'Accept': 'application/json',
            'Content-Type': null,
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/mfa/mfaSignIn.jsp?workflow=challenge`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
            'Upgrade-Insecure-Requests': undefined,
            'X-clientType': this.#session['mfa']['clientType'],
            'X-format': 'json',
            'X-locale': this.#session['mfa']['locale'],
            'X-login': this.#session['mfa']['login'],
            'X-preAuthToken': this.#session['mfa']['preAuthToken'],
            'X-version': '7.0',
            'x-dtpc': generateFakeDynatracePCHeaderValue('multi-factor'),
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosMethods'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', `The remote server responded with a HTTP ${sessions['axiosMethods'].status} status code`);
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosMethods'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosMethods']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosMethodsRequestPath: Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosMethodsRequestPath = sessions['axiosMethods']['request'].path;
      const axiosMethodsRequestPathValid: Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosMethodsRequestPathValid = requestPathNgaServRunRraProxyHrefRestIcontrolUiClientMultiFactorAuthSatXx.test(axiosMethodsRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Request path ➜ ${axiosMethodsRequestPath}`);
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Request path valid ➜ ${axiosMethodsRequestPathValid}`);
      }

      // If the final URL of sessions.axiosMethods is not the MFA auth page.
      if (axiosMethodsRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', `"${axiosMethodsRequestPath}" is not the MFA auth page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosMethodsRequestPath, sessions['axiosMethods']);

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: `"${axiosMethodsRequestPath}" is not the MFA auth page`,
          },
        };
      }

      // Parse the JSON response.
      const parsedMethods: Lib_Auth_ADTPulseAuth_GetVerificationMethods_ParsedMethods = multiFactorAuth.safeParse(sessions['axiosMethods'].data);

      // If the response body does not match the expected schema.
      if (parsedMethods.success === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'The response body of the MFA auth page is invalid');
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: 'The response body of the MFA auth page is invalid',
          },
        };
      }

      /**
       * Detailed parsing information for "multiFactorMethods".
       *
       * The MFA state response lists "mfaProperties" entries (id, type, label, caption)
       * and "parseMultiFactorMethods()" reduces each entry to id, type, and label.
       * NOTICE: Responses may be inaccurate or missing.
       *
       * @since 1.0.0
       */
      const parsedMultiFactorMethods: Lib_Auth_ADTPulseAuth_GetVerificationMethods_ParsedMultiFactorMethods = parseMultiFactorMethods(parsedMethods.data);

      // If the verification methods come back as an empty array.
      if (parsedMultiFactorMethods.length === 0) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'Failed to retrieve verification methods');
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: 'Failed to retrieve verification methods',
          },
        };
      }

      // Save the verification methods into "this instance".
      this.#session['mfa'].verificationMethods = parsedMultiFactorMethods;

      // Mark the session for "this instance" as authenticated.
      this.#session.status = 'complete';

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'success', `Successfully retrieved verification methods from "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'GET_VERIFICATION_METHODS',
        success: true,
        info: {
          methods: parsedMultiFactorMethods,
          status: this.#session['status'],
        },
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'GET_VERIFICATION_METHODS',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * Lib - Auth - Request Code.
   *
   * Asks the portal to send a one-time passcode through the chosen
   * verification method before the code can be validated.
   *
   * @param {Lib_Auth_ADTPulseAuth_RequestCode_MethodId} methodId - Method id.
   *
   * @returns {Lib_Auth_ADTPulseAuth_RequestCode_Returns}
   *
   * @since 1.0.0
   */
  public async requestCode(methodId: Lib_Auth_ADTPulseAuth_RequestCode_MethodId): Lib_Auth_ADTPulseAuth_RequestCode_Returns {
    let errorObject: Lib_Auth_ADTPulseAuth_RequestCode_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.requestCode()', 'info', `Attempting to request a code using the "${methodId}" method at "${this.#internal['baseUrl']}"`);
    }

    // Validate if the verification method exists.
    if (this.#session['mfa']['verificationMethods'].find((device) => device['id'] === methodId) === undefined) {
      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.requestCode()', 'error', `The "${methodId}" verification method does not exist. Did you run the "getVerificationMethods()" yet?`);
      }

      return {
        action: 'REQUEST_CODE',
        success: false,
        info: {
          message: `The "${methodId}" verification method does not exist. Did you run the "getVerificationMethods()" yet?`,
        },
      };
    }

    try {
      const sessions: Lib_Auth_ADTPulseAuth_RequestCode_Sessions = {};

      // Build an "application/x-www-form-urlencoded" form for use with requesting a code.
      const requestCodeForm: Lib_Auth_ADTPulseAuth_RequestCode_RequestCodeForm = new URLSearchParams();

      requestCodeForm.append('id', methodId);

      // sessions.axiosRequestCode: Emulate a request code request.
      sessions.axiosRequestCode = await this.#session['httpClient'].post<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/nga/serv/RunRRAProxy?href=rest/adt/ui/client/multiFactorAuth/requestOtpForRegisteredProperty&sat=${this.#session['mfa']['satCode']}`,
        requestCodeForm,
        this.getRequestConfig({
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': this.#internal['baseUrl'],
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/mfa/mfaSignIn.jsp?workflow=challenge`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
            'Upgrade-Insecure-Requests': undefined,
            'X-clientType': this.#session['mfa']['clientType'],
            'X-format': 'json',
            'X-locale': this.#session['mfa']['locale'],
            'X-login': this.#session['mfa']['login'],
            'X-preAuthToken': this.#session['mfa']['preAuthToken'],
            'X-version': '7.0',
            'x-dtpc': generateFakeDynatracePCHeaderValue('multi-factor'),
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosRequestCode'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.requestCode()', 'error', `The remote server responded with a HTTP ${sessions['axiosRequestCode'].status} status code`);
        }

        return {
          action: 'REQUEST_CODE',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosRequestCode'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosRequestCode']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.requestCode()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'REQUEST_CODE',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosRequestCodeRequestPath: Lib_Auth_ADTPulseAuth_RequestCode_AxiosRequestCodeRequestPath = sessions['axiosRequestCode']['request'].path;
      const axiosRequestCodeRequestPathValid: Lib_Auth_ADTPulseAuth_RequestCode_AxiosRequestCodeRequestPathValid = requestPathNgaServRunRraProxyHrefRestAdtUiClientMultiFactorAuthRequestOtpForRegisteredPropertySatXx.test(axiosRequestCodeRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.requestCode()', 'info', `Request path ➜ ${axiosRequestCodeRequestPath}`);
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.requestCode()', 'info', `Request path valid ➜ ${axiosRequestCodeRequestPathValid}`);
      }

      // If the final URL of sessions.axiosRequestCode is not the request code page.
      if (axiosRequestCodeRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.requestCode()', 'error', `"${axiosRequestCodeRequestPath}" is not the request code page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosRequestCodeRequestPath, sessions['axiosRequestCode']);

        return {
          action: 'REQUEST_CODE',
          success: false,
          info: {
            message: `"${axiosRequestCodeRequestPath}" is not the request code page`,
          },
        };
      }

      // Parse the JSON response.
      const parsedRequestCode: Lib_Auth_ADTPulseAuth_RequestCode_ParsedRequestCode = otpResponse.safeParse(sessions['axiosRequestCode'].data);

      // If the response body does not match the expected schema.
      if (parsedRequestCode.success === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.requestCode()', 'error', 'The response body of the request code page is invalid');
        }

        return {
          action: 'REQUEST_CODE',
          success: false,
          info: {
            message: 'The response body of the request code page is invalid',
          },
        };
      }

      // Check if the method ID entered is invalid.
      if (parsedRequestCode.data['detail'].includes('OK') === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.requestCode()', 'error', `Unable to get a verification code ➜ "${parsedRequestCode.data['detail']}"`);
        }

        return {
          action: 'REQUEST_CODE',
          success: false,
          info: {
            message: `Unable to get a verification code ➜ "${parsedRequestCode.data['detail']}"`,
          },
        };
      }

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.requestCode()', 'success', `Successfully requested a code for "${methodId}" at "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'REQUEST_CODE',
        success: true,
        info: null,
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.requestCode()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'REQUEST_CODE',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * Lib - Auth - Validate Code.
   *
   * Submits the one-time passcode to the portal and stores the issued token
   * so the sign-in flow can continue to the device trust step.
   *
   * @param {Lib_Auth_ADTPulseAuth_ValidateCode_OtpCode} otpCode - Otp code.
   *
   * @returns {Lib_Auth_ADTPulseAuth_ValidateCode_Returns}
   *
   * @since 1.0.0
   */
  public async validateCode(otpCode: Lib_Auth_ADTPulseAuth_ValidateCode_OtpCode): Lib_Auth_ADTPulseAuth_ValidateCode_Returns {
    let errorObject: Lib_Auth_ADTPulseAuth_ValidateCode_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.validateCode()', 'info', `Attempting to validate verification code at "${this.#internal['baseUrl']}"`);
    }

    // Validate the verification code format.
    if (textOneTimePasscode.test(otpCode) === false) {
      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.validateCode()', 'error', `"${otpCode}" is an invalid verification code format`);
      }

      return {
        action: 'VALIDATE_CODE',
        success: false,
        info: {
          message: `"${otpCode}" is an invalid verification code format`,
        },
      };
    }

    try {
      const sessions: Lib_Auth_ADTPulseAuth_ValidateCode_Sessions = {};

      // Build an "application/x-www-form-urlencoded" form for use with validating a code.
      const validateCodeForm: Lib_Auth_ADTPulseAuth_ValidateCode_ValidateCodeForm = new URLSearchParams();

      validateCodeForm.append('otp', otpCode);

      // sessions.axiosValidateCode: Emulate a validate code request.
      sessions.axiosValidateCode = await this.#session['httpClient'].post<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/nga/serv/RunRRAProxy?href=rest/adt/ui/client/multiFactorAuth/validateOtp&sat=${this.#session['mfa']['satCode']}`,
        validateCodeForm,
        this.getRequestConfig({
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': this.#internal['baseUrl'],
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/mfa/mfaSignIn.jsp?workflow=challenge`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
            'Upgrade-Insecure-Requests': undefined,
            'X-clientType': this.#session['mfa']['clientType'],
            'X-format': 'json',
            'X-locale': this.#session['mfa']['locale'],
            'X-login': this.#session['mfa']['login'],
            'X-preAuthToken': this.#session['mfa']['preAuthToken'],
            'X-version': '7.0',
            'x-dtpc': generateFakeDynatracePCHeaderValue('multi-factor'),
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosValidateCode'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.validateCode()', 'error', `The remote server responded with a HTTP ${sessions['axiosValidateCode'].status} status code`);
        }

        return {
          action: 'VALIDATE_CODE',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosValidateCode'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosValidateCode']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.validateCode()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'VALIDATE_CODE',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosValidateCodeRequestPath: Lib_Auth_ADTPulseAuth_ValidateCode_AxiosValidateCodeRequestPath = sessions['axiosValidateCode']['request'].path;
      const axiosValidateCodeRequestPathValid: Lib_Auth_ADTPulseAuth_ValidateCode_AxiosValidateCodeRequestPathValid = requestPathNgaServRunRraProxyHrefRestAdtUiClientMultiFactorAuthValidateOtpSatXx.test(axiosValidateCodeRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.validateCode()', 'info', `Request path ➜ ${axiosValidateCodeRequestPath}`);
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.validateCode()', 'info', `Request path valid ➜ ${axiosValidateCodeRequestPathValid}`);
      }

      // If the final URL of sessions.axiosValidateCode is not the validate code page.
      if (axiosValidateCodeRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.validateCode()', 'error', `"${axiosValidateCodeRequestPath}" is not the validate code page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosValidateCodeRequestPath, sessions['axiosValidateCode']);

        return {
          action: 'VALIDATE_CODE',
          success: false,
          info: {
            message: `"${axiosValidateCodeRequestPath}" is not the validate code page`,
          },
        };
      }

      // Check if "this instance" has already passed verification.
      if (
        typeof sessions['axiosValidateCode'].data === 'string'
        && sessions['axiosValidateCode'].data === ''
      ) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.validateCode()', 'error', 'Already passed verification');
        }

        return {
          action: 'VALIDATE_CODE',
          success: true,
          info: null,
        };
      }

      // Parse the JSON response.
      const parsedValidateCode: Lib_Auth_ADTPulseAuth_ValidateCode_ParsedValidateCode = otpResponse.safeParse(sessions['axiosValidateCode'].data);

      // If the response body does not match the expected schema.
      if (parsedValidateCode.success === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.validateCode()', 'error', 'The response body of the validate code page is invalid');
        }

        return {
          action: 'VALIDATE_CODE',
          success: false,
          info: {
            message: 'The response body of the validate code page is invalid',
          },
        };
      }

      // Check if the verification code entered is invalid.
      if (parsedValidateCode.data['detail'].startsWith('u=') === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.validateCode()', 'error', 'The verification code submitted is either invalidated or expired');
        }

        return {
          action: 'VALIDATE_CODE',
          success: false,
          info: {
            message: 'The verification code submitted is either invalidated or expired',
          },
        };
      }

      // Save the token into "this instance".
      this.#session['mfa'].token = parsedValidateCode.data['detail'];

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.validateCode()', 'success', `Successfully validated verification code at "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'VALIDATE_CODE',
        success: true,
        info: null,
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.validateCode()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'VALIDATE_CODE',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * Lib - Auth - Get Trusted Devices.
   *
   * Polls the portal for devices already marked as trusted so duplicate
   * names can be rejected before adding a new trusted device.
   *
   * @returns {Lib_Auth_ADTPulseAuth_GetTrustedDevices_Returns}
   *
   * @since 1.0.0
   */
  public async getTrustedDevices(): Lib_Auth_ADTPulseAuth_GetTrustedDevices_Returns {
    let errorObject: Lib_Auth_ADTPulseAuth_GetTrustedDevices_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'info', `Attempting to retrieve trusted devices at "${this.#internal['baseUrl']}"`);
    }

    try {
      const sessions: Lib_Auth_ADTPulseAuth_GetTrustedDevices_Sessions = {};

      // sessions.axiosDevicePoll: Emulate a multi-factor device polling request.
      sessions.axiosDevicePoll = await this.#session['httpClient'].get<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/nga/serv/RunRRAProxy?only=client.multiFactorAuth&exclude=&sat=${this.#session['mfa']['satCode']}&href=rest/adt/ui/updates&sat=${this.#session['mfa']['satCode']}&`,
        this.getRequestConfig({
          headers: {
            'Accept': 'application/json',
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/mfa/mfaSignIn.jsp?workflow=challenge`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
            'Upgrade-Insecure-Requests': undefined,
            'X-clientType': this.#session['mfa']['clientType'],
            'X-format': 'json',
            'X-locale': this.#session['mfa']['locale'],
            'X-login': this.#session['mfa']['login'],
            'X-token': this.#session['mfa']['token'],
            'X-version': '7.0',
            'x-dtpc': generateFakeDynatracePCHeaderValue('multi-factor'),
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosDevicePoll'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'error', `The remote server responded with a HTTP ${sessions['axiosDevicePoll'].status} status code`);
        }

        return {
          action: 'GET_TRUSTED_DEVICES',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosDevicePoll'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosDevicePoll']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_TRUSTED_DEVICES',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosDevicePollRequestPath: Lib_Auth_ADTPulseAuth_GetTrustedDevices_AxiosDevicePollRequestPath = sessions['axiosDevicePoll']['request'].path;
      const axiosDevicePollRequestPathValid: Lib_Auth_ADTPulseAuth_GetTrustedDevices_AxiosDevicePollRequestPathValid = requestPathNgaServRunRraProxyOnlyClientMultiFactorAuthExcludeSatXxHrefRestAdtUiUpdatesSatXx.test(axiosDevicePollRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'info', `Request path ➜ ${axiosDevicePollRequestPath}`);
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'info', `Request path valid ➜ ${axiosDevicePollRequestPathValid}`);
      }

      // If the final URL of sessions.axiosDevicePoll is not the device polling page.
      if (axiosDevicePollRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'error', `"${axiosDevicePollRequestPath}" is not the device polling page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosDevicePollRequestPath, sessions['axiosDevicePoll']);

        return {
          action: 'GET_TRUSTED_DEVICES',
          success: false,
          info: {
            message: `"${axiosDevicePollRequestPath}" is not the device polling page`,
          },
        };
      }

      // Parse the JSON response.
      const parsedDevicePoll: Lib_Auth_ADTPulseAuth_GetTrustedDevices_ParsedDevicePoll = multiFactorAuth.safeParse(_.get(sessions['axiosDevicePoll'].data, [
        'update',
        0,
        'data',
        'client',
        'multiFactorAuth',
      ]));

      // If the response body does not match the expected schema.
      if (parsedDevicePoll.success === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'error', 'The response body of the device polling page is invalid');
        }

        return {
          action: 'GET_TRUSTED_DEVICES',
          success: false,
          info: {
            message: 'The response body of the device polling page is invalid',
          },
        };
      }

      /**
       * Detailed parsing information for "trustedDevices".
       *
       * The device polling response nests "trustedDevices" inside the update array and
       * "parseMultiFactorTrustedDevices()" reduces each entry to id and name fields.
       * NOTICE: Responses may be inaccurate or missing.
       *
       * @since 1.0.0
       */
      const parsedTrustedDevices: Lib_Auth_ADTPulseAuth_GetTrustedDevices_ParsedTrustedDevices = parseMultiFactorTrustedDevices(parsedDevicePoll.data);

      // Save the trusted devices into "this instance".
      this.#session['mfa'].trustedDevices = parsedTrustedDevices;

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'success', `Successfully retrieved trusted devices at "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'GET_TRUSTED_DEVICES',
        success: true,
        info: {
          trustedDevices: parsedTrustedDevices,
        },
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'GET_TRUSTED_DEVICES',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * Lib - Auth - Add Trusted Device.
   *
   * Registers this client as a trusted device on the portal so future
   * sign-ins with the generated fingerprint skip the MFA challenge.
   *
   * @param {Lib_Auth_ADTPulseAuth_AddTrustedDevice_DeviceName} deviceName - Device name.
   *
   * @returns {Lib_Auth_ADTPulseAuth_AddTrustedDevice_Returns}
   *
   * @since 1.0.0
   */
  public async addTrustedDevice(deviceName: Lib_Auth_ADTPulseAuth_AddTrustedDevice_DeviceName): Lib_Auth_ADTPulseAuth_AddTrustedDevice_Returns {
    let errorObject: Lib_Auth_ADTPulseAuth_AddTrustedDevice_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'info', `Attempting to add trusted device at "${this.#internal['baseUrl']}"`);
    }

    // Validate if the trusted device name already exists.
    if (this.#session['mfa']['trustedDevices'].find((trustedDevice) => trustedDevice['name'] === encodeURIComponent(deviceName)) !== undefined) { // Will be encoded twice, intentional.
      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'error', 'The name for the trusted device already exists');
      }

      return {
        action: 'ADD_TRUSTED_DEVICE',
        success: false,
        info: {
          message: 'The name for the trusted device already exists',
        },
      };
    }

    // Validate the trusted device name format.
    if (deviceName.length < 1 || deviceName.length > 100) {
      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'error', 'The name for the trusted device must be between 1 to 100 characters');
      }

      return {
        action: 'ADD_TRUSTED_DEVICE',
        success: false,
        info: {
          message: 'The name for the trusted device must be between 1 to 100 characters',
        },
      };
    }

    try {
      const sessions: Lib_Auth_ADTPulseAuth_AddTrustedDevice_Sessions = {};

      // Build an "application/x-www-form-urlencoded" form for use with adding a trusted device.
      const trustedDeviceForm: Lib_Auth_ADTPulseAuth_AddTrustedDevice_TrustedDeviceForm = new URLSearchParams();

      trustedDeviceForm.append('name', encodeURIComponent(deviceName)); // Will be encoded twice, intentional.

      // sessions.axiosAddDevice: Emulate an add trusted device request.
      sessions.axiosAddDevice = await this.#session['httpClient'].post<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/nga/serv/RunRRAProxy?href=rest/adt/ui/client/multiFactorAuth/addTrustedDevice&sat=${this.#session['mfa']['satCode']}`,
        trustedDeviceForm,
        this.getRequestConfig({
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': this.#internal['baseUrl'],
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/mfa/mfaSignIn.jsp?workflow=challenge`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
            'Upgrade-Insecure-Requests': undefined,
            'X-clientType': this.#session['mfa']['clientType'],
            'X-format': 'json',
            'X-locale': this.#session['mfa']['locale'],
            'X-login': this.#session['mfa']['login'],
            'X-token': this.#session['mfa']['token'],
            'X-version': '7.0',
            'x-dtpc': generateFakeDynatracePCHeaderValue('multi-factor'),
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosAddDevice'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'error', `The remote server responded with a HTTP ${sessions['axiosAddDevice'].status} status code`);
        }

        return {
          action: 'ADD_TRUSTED_DEVICE',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosAddDevice'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosAddDevice']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'ADD_TRUSTED_DEVICE',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosAddDeviceRequestPath: Lib_Auth_ADTPulseAuth_AddTrustedDevice_AxiosAddDeviceRequestPath = sessions['axiosAddDevice']['request'].path;
      const axiosAddDeviceRequestPathValid: Lib_Auth_ADTPulseAuth_AddTrustedDevice_AxiosAddDeviceRequestPathValid = requestPathNgaServRunRraProxyHrefRestAdtUiClientMultiFactorAuthAddTrustedDeviceSatXx.test(axiosAddDeviceRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'info', `Request path ➜ ${axiosAddDeviceRequestPath}`);
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'info', `Request path valid ➜ ${axiosAddDeviceRequestPathValid}`);
      }

      // If the final URL of sessions.axiosAddDevice is not the add trusted device page.
      if (axiosAddDeviceRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'error', `"${axiosAddDeviceRequestPath}" is not the add trusted device page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosAddDeviceRequestPath, sessions['axiosAddDevice']);

        return {
          action: 'ADD_TRUSTED_DEVICE',
          success: false,
          info: {
            message: `"${axiosAddDeviceRequestPath}" is not the add trusted device page`,
          },
        };
      }

      // Parse the JSON response.
      const parsedValidateCode: Lib_Auth_ADTPulseAuth_AddTrustedDevice_ParsedValidateCode = otpResponse.safeParse(sessions['axiosAddDevice'].data);

      // If the response body does not match the expected schema.
      if (parsedValidateCode.success === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'error', 'The response body of the add trusted device page is invalid');
        }

        return {
          action: 'ADD_TRUSTED_DEVICE',
          success: false,
          info: {
            message: 'The response body of the add trusted device page is invalid',
          },
        };
      }

      // Check if the trusted device could not be added.
      if (parsedValidateCode.data['detail'].includes('OK') === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'error', `The trusted device could not be added ➜ "${parsedValidateCode.data['detail']}"`);
        }

        return {
          action: 'ADD_TRUSTED_DEVICE',
          success: false,
          info: {
            message: `The trusted device could not be added ➜ "${parsedValidateCode.data['detail']}"`,
          },
        };
      }

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'success', `Successfully added trusted device at "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'ADD_TRUSTED_DEVICE',
        success: true,
        info: null,
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'ADD_TRUSTED_DEVICE',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * Lib - Auth - Complete Sign In.
   *
   * Finalizes the portal sign-in after verification and clears the MFA
   * state so the session behaves like a normal authenticated login.
   *
   * @returns {Lib_Auth_ADTPulseAuth_CompleteSignIn_Returns}
   *
   * @since 1.0.0
   */
  public async completeSignIn(): Lib_Auth_ADTPulseAuth_CompleteSignIn_Returns {
    let errorObject: Lib_Auth_ADTPulseAuth_CompleteSignIn_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.completeSignIn()', 'info', `Attempting to complete sign in at "${this.#internal['baseUrl']}"`);
    }

    try {
      const sessions: Lib_Auth_ADTPulseAuth_CompleteSignIn_Sessions = {};

      // sessions.axiosPostSignIn: Emulate a post sign-in request.
      sessions.axiosPostSignIn = await this.#session['httpClient'].get<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/access/PostSigninProcessServ`,
        this.getRequestConfig({
          headers: {
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/mfa/mfaSignIn.jsp?workflow=challenge`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosPostSignIn'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.completeSignIn()', 'error', `The remote server responded with a HTTP ${sessions['axiosPostSignIn'].status} status code`);
        }

        return {
          action: 'COMPLETE_SIGN_IN',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosPostSignIn'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosPostSignIn']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.completeSignIn()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'COMPLETE_SIGN_IN',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosPostSignInRequestPath: Lib_Auth_ADTPulseAuth_CompleteSignIn_AxiosPostSignInRequestPath = sessions['axiosPostSignIn']['request'].path;
      const axiosPostSignInRequestPathValid: Lib_Auth_ADTPulseAuth_CompleteSignIn_AxiosPostSignInRequestPathValid = requestPathSummarySummary.test(axiosPostSignInRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.completeSignIn()', 'info', `Request path ➜ ${axiosPostSignInRequestPath}`);
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.completeSignIn()', 'info', `Request path valid ➜ ${axiosPostSignInRequestPathValid}`);
      }

      // If the final URL of sessions.axiosPostSignIn is not the summary page.
      if (axiosPostSignInRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.completeSignIn()', 'error', `"${axiosPostSignInRequestPath}" is not the summary page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosPostSignInRequestPath, sessions['axiosPostSignIn']);

        return {
          action: 'COMPLETE_SIGN_IN',
          success: false,
          info: {
            message: `"${axiosPostSignInRequestPath}" is not the summary page`,
          },
        };
      }

      // Clean-up the MFA object after complete sign-in.
      this.#session.mfa = {
        clientType: null,
        locale: null,
        login: null,
        preAuthToken: null,
        satCode: null,
        token: null,
        trustedDevices: [],
        verificationMethods: [],
      };

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.completeSignIn()', 'success', `Successfully completed sign in at "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'COMPLETE_SIGN_IN',
        success: true,
        info: null,
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.completeSignIn()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'COMPLETE_SIGN_IN',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * Lib - Auth - Get Sensors.
   *
   * Loads the system page and parses the sensors table so the plugin setup
   * flow can generate sensor configuration entries.
   *
   * @returns {Lib_Auth_ADTPulseAuth_GetSensors_Returns}
   *
   * @since 1.0.0
   */
  public async getSensors(): Lib_Auth_ADTPulseAuth_GetSensors_Returns {
    let errorObject: Lib_Auth_ADTPulseAuth_GetSensors_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getSensors()', 'info', `Attempting to retrieve sensors from "${this.#internal['baseUrl']}"`);
    }

    try {
      const sessions: Lib_Auth_ADTPulseAuth_GetSensors_Sessions = {};

      // sessions.axiosSystem: Load the system page.
      sessions.axiosSystem = await this.#session['httpClient'].get<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/system/system.jsp`,
        this.getRequestConfig({
          headers: {
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/summary/summary.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosSystem'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getSensors()', 'error', `The remote server responded with a HTTP ${sessions['axiosSystem'].status} status code`);
        }

        return {
          action: 'GET_SENSORS',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosSystem'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosSystem']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getSensors()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_SENSORS',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSystemRequestPath: Lib_Auth_ADTPulseAuth_GetSensors_AxiosSystemRequestPath = sessions['axiosSystem']['request'].path;
      const axiosSystemRequestPathValid: Lib_Auth_ADTPulseAuth_GetSensors_AxiosSystemRequestPathValid = requestPathSystemSystem.test(axiosSystemRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getSensors()', 'info', `Request path ➜ ${axiosSystemRequestPath}`);
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getSensors()', 'info', `Request path valid ➜ ${axiosSystemRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSystem is not the system page.
      if (axiosSystemRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getSensors()', 'error', `"${axiosSystemRequestPath}" is not the system page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSystemRequestPath, sessions['axiosSystem']);

        return {
          action: 'GET_SENSORS',
          success: false,
          info: {
            message: `"${axiosSystemRequestPath}" is not the system page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions['axiosSystem'].data !== 'string') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getSensors()', 'error', 'The response body of the system page is not of type "string"');
        }

        return {
          action: 'GET_SENSORS',
          success: false,
          info: {
            message: 'The response body of the system page is not of type "string"',
          },
        };
      }

      // sessions.jsdomSystem: Parse the system page.
      sessions.jsdomSystem = new JSDOM(
        sessions['axiosSystem'].data,
        {
          url: sessions['axiosSystem'].config.url,
          referrer: sessions['axiosSystem'].config.headers['Referer'],
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * Detailed parsing information for "sensorsConfig".
       *
       * The system page renders each sensor as a table row and "parseSensorsTable()"
       * converts every row into adtName, adtZone, and adtType fields.
       * NOTICE: Responses may be inaccurate or missing.
       *
       * @since 1.0.0
       */
      const jsdomSystemSensorsTable: Lib_Auth_ADTPulseAuth_GetSensors_JsdomSystemSensorsTable = sessions['jsdomSystem'].window.document.querySelectorAll('#systemContentList tr[class^=\'p_row\'] tr.p_listRow');
      const parsedSensorsConfigTable: Lib_Auth_ADTPulseAuth_GetSensors_ParsedSensorsConfigTable = parseSensorsTable('sensors-config', jsdomSystemSensorsTable) as Lib_Auth_ADTPulseAuth_GetSensors_ParsedSensorsConfigTable;

      // Check if the parsing function is parsing data incorrectly.
      await this.newInformationDispatcher('debug-parser', {
        method: 'generateSensorsConfig',
        response: parsedSensorsConfigTable,
        rawHtml: sessions['axiosSystem'].data,
      });

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getSensors()', 'success', `Successfully retrieved sensors from "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'GET_SENSORS',
        success: true,
        info: {
          sensors: parsedSensorsConfigTable,
        },
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.getSensors()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'GET_SENSORS',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * Lib - Auth - Get Fingerprint.
   *
   * Exposes the generated login fingerprint so users can copy it into the
   * plugin configuration after registering the trusted device.
   *
   * @returns {Lib_Auth_ADTPulseAuth_GetFingerprint_Returns}
   *
   * @since 1.0.0
   */
  public getFingerprint(): Lib_Auth_ADTPulseAuth_GetFingerprint_Returns {
    // Exposing the snapshot-backed value freezes it so a later network lookup
    // cannot silently change a fingerprint already copied by a caller.
    this.#fingerprintPrepared = true;

    return this.#credentials['fingerprint'];
  }

  /**
   * Lib - Auth - Reset Session.
   *
   * Rebuilds the HTTP client and MFA state from scratch so a failed or
   * stale sign-in attempt does not leak into the next one.
   *
   * @returns {Lib_Auth_ADTPulseAuth_ResetSession_Returns}
   *
   * @since 1.0.0
   */
  public resetSession(): Lib_Auth_ADTPulseAuth_ResetSession_Returns {
    this.#session = {
      httpClient: wrapper(axios.create({
        jar: new CookieJar(),
        validateStatus: () => true,
      })),
      mfa: {
        clientType: null,
        locale: null,
        login: null,
        preAuthToken: null,
        satCode: null,
        token: null,
        trustedDevices: [],
        verificationMethods: [],
      },
      portalVersion: null,
      status: 'logged-out',
    };

    return;
  }

  /**
   * Lib - Auth - New Information Dispatcher.
   *
   * Routes newly observed portal data to the matching detector and
   * remembers reported hashes so the same finding is not sent twice.
   *
   * @param {Lib_Auth_ADTPulseAuth_NewInformationDispatcher_Type} type - Type.
   * @param {Lib_Auth_ADTPulseAuth_NewInformationDispatcher_Data} data - Data.
   *
   * @private
   *
   * @returns {Lib_Auth_ADTPulseAuth_NewInformationDispatcher_Returns}
   *
   * @since 1.0.0
   */
  private async newInformationDispatcher(type: Lib_Auth_ADTPulseAuth_NewInformationDispatcher_Type, data: Lib_Auth_ADTPulseAuth_NewInformationDispatcher_Data): Lib_Auth_ADTPulseAuth_NewInformationDispatcher_Returns {
    const dataHash: Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DataHash = generateHash(data);

    // If the detector has not reported this event before.
    if (this.#internal['reportedHashes'].find((reportedHash) => dataHash === reportedHash) === undefined) {
      let detectedNew: Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DetectedNew = false;

      // Determine what information needs to be checked.
      switch (type) {
        case 'debug-parser': {
          detectedNew = await detectGlobalDebugParser(data as Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DataDebugParser, null, this.#internal['debug']);

          break;
        }

        case 'portal-version': {
          detectedNew = await detectGlobalPortalVersion(data as Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DataPortalVersion, null, this.#internal['debug']);

          break;
        }

        default: {
          break;
        }
      }

      // Save this hash so the detector does not detect the same thing multiple times.
      if (detectedNew === true) {
        this.#internal['reportedHashes'].push(dataHash);
      }
    }

    return;
  }

  /**
   * Lib - Auth - Get Request Config.
   *
   * Builds the browser-like Axios request configuration and merges in
   * per-request overrides while omitting keys explicitly set to null.
   *
   * @param {Lib_Auth_ADTPulseAuth_GetRequestConfig_ExtraConfig} extraConfig - Extra config.
   *
   * @private
   *
   * @returns {Lib_Auth_ADTPulseAuth_GetRequestConfig_Returns}
   *
   * @since 1.0.0
   */
  private getRequestConfig(extraConfig?: Lib_Auth_ADTPulseAuth_GetRequestConfig_ExtraConfig): Lib_Auth_ADTPulseAuth_GetRequestConfig_Returns {
    const defaultConfig: Lib_Auth_ADTPulseAuth_GetRequestConfig_DefaultConfig = {
      family: 4,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Host': `${this.#connection['subdomain']}.adtpulse.com`,
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        ...getFingerprintRequestHeaders(this.#credentials['fingerprint']),
      },
      timeout: 15000, // 15 seconds.
    };

    if (extraConfig === undefined) {
      return defaultConfig;
    }

    // If one or more of "extraConfig" keys are "undefined" or "null", omit those keys for both configs.
    return _.merge(
      _.omit(defaultConfig, findNullKeys(extraConfig)),
      _.omit(extraConfig, findNullKeys(extraConfig)),
    );
  }

  /**
   * Lib - Auth - Handle Login Failure.
   *
   * Inspects the redirect path after a failed request, logs the likely
   * cause, and resets the session when the portal signed this instance out.
   *
   * @param {Lib_Auth_ADTPulseAuth_HandleLoginFailure_RequestPath} requestPath - Request path.
   * @param {Lib_Auth_ADTPulseAuth_HandleLoginFailure_Session}     session     - Session.
   *
   * @private
   *
   * @returns {Lib_Auth_ADTPulseAuth_HandleLoginFailure_Returns}
   *
   * @since 1.0.0
   */
  private handleLoginFailure(requestPath: Lib_Auth_ADTPulseAuth_HandleLoginFailure_RequestPath, session: Lib_Auth_ADTPulseAuth_HandleLoginFailure_Session): Lib_Auth_ADTPulseAuth_HandleLoginFailure_Returns {
    if (requestPath === null) {
      return;
    }

    if (requestPathAccessSignIn.test(requestPath) === true || requestPathAccessSignInEXxPartnerAdt.test(requestPath) === true) {
      if (this.#internal['debug'] === true) {
        const errorMessage: Lib_Auth_ADTPulseAuth_HandleLoginFailure_ErrorMessage = fetchErrorMessage(session);

        debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.handleLoginFailure()', 'error', 'Either the username or password is incorrect, fingerprint format is invalid, or was signed out due to inactivity');

        // Show the portal error message if it exists.
        if (errorMessage !== null) {
          debugLog(this.#internal['logger'], 'auth.ts / ADTPulseAuth.handleLoginFailure()', 'warn', `Portal message ➜ "${errorMessage}"`);
        }
      }

      // Reset the session state for "this instance".
      this.resetSession();
    }

    return;
  }
}
