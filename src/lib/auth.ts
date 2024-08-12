import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { JSDOM } from 'jsdom';
import _ from 'lodash';
import { serializeError } from 'serialize-error';
import { CookieJar } from 'tough-cookie';

import { detectGlobalDebugParser, detectGlobalPortalVersion } from '@/lib/detect.js';
import { generateFakeDynatracePCHeaderValue, generateFakeLoginFingerprint } from '@/lib/fake.js';
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
} from '@/lib/regex.js';
import { multiFactorAuth, otpResponse } from '@/lib/schema.js';
import {
  debugLog,
  fetchErrorMessage,
  findNullKeys,
  generateHash,
  parseMultiFactorMethods,
  parseMultiFactorTrustedDevices,
  parseSensorsTable,
  stackTracer,
} from '@/lib/utility.js';
import type {
  ADTPulseAuthAddTrustedDeviceDeviceName,
  ADTPulseAuthAddTrustedDeviceReturns,
  ADTPulseAuthAddTrustedDeviceSessions,
  ADTPulseAuthCompleteSignInReturns,
  ADTPulseAuthCompleteSignInSessions,
  ADTPulseAuthConnection,
  ADTPulseAuthConstructorConfig,
  ADTPulseAuthConstructorInternalConfig,
  ADTPulseAuthCredentials,
  ADTPulseAuthGetFingerprintReturns,
  ADTPulseAuthGetRequestConfigDefaultConfig,
  ADTPulseAuthGetRequestConfigExtraConfig,
  ADTPulseAuthGetRequestConfigReturns,
  ADTPulseAuthGetSensorsParsedSensorsConfigTable,
  ADTPulseAuthGetSensorsReturns,
  ADTPulseAuthGetSensorsSessions,
  ADTPulseAuthGetTrustedDevicesParsedTrustedDevices,
  ADTPulseAuthGetTrustedDevicesReturns,
  ADTPulseAuthGetTrustedDevicesSessions,
  ADTPulseAuthGetVerificationMethodsPortalVersion,
  ADTPulseAuthGetVerificationMethodsReturns,
  ADTPulseAuthGetVerificationMethodsSessions,
  ADTPulseAuthHandleLoginFailureRequestPath,
  ADTPulseAuthHandleLoginFailureReturns,
  ADTPulseAuthHandleLoginFailureSession,
  ADTPulseAuthInternal,
  ADTPulseAuthNewInformationDispatcherData,
  ADTPulseAuthNewInformationDispatcherReturns,
  ADTPulseAuthNewInformationDispatcherType,
  ADTPulseAuthRequestCodeMethodId,
  ADTPulseAuthRequestCodeReturns,
  ADTPulseAuthRequestCodeSessions,
  ADTPulseAuthResetSessionReturns,
  ADTPulseAuthSession,
  ADTPulseAuthValidateCodeOtpCode,
  ADTPulseAuthValidateCodeReturns,
  ADTPulseAuthValidateCodeSessions,
} from '@/types/index.d.ts';

/**
 * ADT Pulse Auth.
 *
 * @since 1.0.0
 */
export class ADTPulseAuth {
  /**
   * ADT Pulse Auth - Connection.
   *
   * @private
   *
   * @since 1.0.0
   */
  #connection: ADTPulseAuthConnection;

  /**
   * ADT Pulse Auth - Credentials.
   *
   * @private
   *
   * @since 1.0.0
   */
  #credentials: ADTPulseAuthCredentials;

  /**
   * ADT Pulse Auth - Internal.
   *
   * @private
   *
   * @since 1.0.0
   */
  #internal: ADTPulseAuthInternal;

  /**
   * ADT Pulse Auth - Session.
   *
   * @private
   *
   * @since 1.0.0
   */
  #session: ADTPulseAuthSession;

  /**
   * ADT Pulse Auth - Constructor.
   *
   * @param {ADTPulseAuthConstructorConfig}         config         - Config.
   * @param {ADTPulseAuthConstructorInternalConfig} internalConfig - Internal config.
   *
   * @since 1.0.0
   */
  public constructor(config: ADTPulseAuthConstructorConfig, internalConfig: ADTPulseAuthConstructorInternalConfig) {
    // Set connection options.
    this.#connection = {
      subdomain: config.subdomain,
    };

    // Set credentials options.
    this.#credentials = {
      fingerprint: generateFakeLoginFingerprint(),
      password: config.password,
      username: config.username,
    };

    // Set internal options.
    this.#internal = {
      baseUrl: internalConfig.baseUrl ?? `https://${this.#connection.subdomain}.adtpulse.com`,
      debug: internalConfig.debug ?? false,
      logger: internalConfig.logger ?? null,
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
  }

  /**
   * ADT Pulse Auth - Get verification methods.
   *
   * @returns {ADTPulseAuthGetVerificationMethodsReturns}
   *
   * @since 1.0.0
   */
  public async getVerificationMethods(): ADTPulseAuthGetVerificationMethodsReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Attempting to retrieve verification methods from "${this.#internal.baseUrl}"`);
    }

    try {
      const sessions: ADTPulseAuthGetVerificationMethodsSessions = {};

      // Check if "this instance" has already retrieved verification methods.
      if (
        this.#session.status === 'complete'
        || this.#session.status === 'not-required'
      ) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', 'Already retrieved verification methods');
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: true,
          info: {
            methods: this.#session.mfa.verificationMethods,
            status: this.#session.status,
          },
        };
      }

      // sessions.axiosIndex: Load the homepage.
      sessions.axiosIndex = await this.#session.httpClient.get<unknown>(
        `${this.#internal.baseUrl}/`,
        this.getRequestConfig(),
      );

      // Check for server error response.
      if (sessions.axiosIndex.status >= 400) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', `The remote server responded with a HTTP ${sessions.axiosIndex.status} status code`);
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosIndex.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosIndex?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosIndexRequestPath = sessions.axiosIndex.request.path;
      const axiosIndexRequestPathValid = requestPathAccessSignIn.test(axiosIndexRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Request path ➜ ${axiosIndexRequestPath}`);
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Request path valid ➜ ${axiosIndexRequestPathValid}`);
      }

      // If the final URL of sessions.axiosIndex is not the sign-in page.
      if (!axiosIndexRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', `"${axiosIndexRequestPath} is not the sign-in page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosIndexRequestPath, sessions.axiosIndex);

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: `"${axiosIndexRequestPath} is not the sign-in page`,
          },
        };
      }

      // Build an "application/x-www-form-urlencoded" form for use with logging in.
      const loginForm = new URLSearchParams();
      loginForm.append('usernameForm', this.#credentials.username);
      loginForm.append('passwordForm', this.#credentials.password);
      loginForm.append('sun', 'yes'); // Remember my username.
      loginForm.append('networkid', ''); // Blank if URL does not have the "networkid" param.
      loginForm.append('fingerprint', this.#credentials.fingerprint);

      /**
       * Detailed parsing information for "portalVersion".
       *
       * NOTICE: Responses may be inaccurate or missing.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * How the data may be displayed:
       * ➜ /myhome/16.0.0-131/access/signin.jsp
       *
       * Example data after being processed by "replace()" function/method:
       * ➜ 16.0.0-131
       *
       * @since 1.0.0
       */
      this.#session.portalVersion = axiosIndexRequestPath.replace(requestPathAccessSignIn, '$2') as ADTPulseAuthGetVerificationMethodsPortalVersion;

      /**
       * Check if "portalVersion" needs documenting or testing.
       *
       * NOTICE: Parts NOT SHOWN below will NOT be tracked, documented, or tested.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * version: '16.0.0-131'
       *          '17.0.0-69'
       *          '18.0.0-78'
       *          '19.0.0-89'
       *          '20.0.0-221'
       *          '20.0.0-244'
       *          '21.0.0-344'
       *          '21.0.0-353'
       *          '21.0.0-354'
       *          '22.0.0-233'
       *          '23.0.0-99'
       *          '24.0.0-117'
       *          '25.0.0-21'
       *          '26.0.0-32'
       *          '27.0.0-140'
       *          '28.0.0-57'
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('portal-version', { version: this.#session.portalVersion });

      // sessions.axiosSignIn: Emulate a sign-in request.
      sessions.axiosSignIn = await this.#session.httpClient.post<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/access/signin.jsp?e=ns&partner=adt`,
        loginForm,
        this.getRequestConfig({
          headers: {
            'Cache-Control': 'max-age=0',
            'Content-Type': 'application/x-www-form-urlencoded',
            Origin: this.#internal.baseUrl,
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/access/signin.jsp?e=ns&partner=adt`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions.axiosSignIn.status >= 400) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', `The remote server responded with a HTTP ${sessions.axiosSignIn.status} status code`);
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosSignIn.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosSignIn?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSignInRequestPath = sessions.axiosSignIn.request.path;
      const axiosSignInRequestPathValid = requestPathMfaMfaSignInWorkflowChallenge.test(axiosSignInRequestPath) || requestPathSummarySummary.test(axiosSignInRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Request path ➜ ${axiosSignInRequestPath}`);
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Request path valid ➜ ${axiosSignInRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSignIn is the summary page.
      if (requestPathSummarySummary.test(axiosSignInRequestPath)) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Verification methods not required from "${this.#internal.baseUrl}"`);
        }

        // Mark the session for "this instance" as authenticated.
        this.#session.status = 'not-required';

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: true,
          info: {
            methods: this.#session.mfa.verificationMethods,
            status: this.#session.status,
          },
        };
      }

      // If the final URL of sessions.axiosSignIn is the login page.
      if (requestPathAccessSignInEXxPartnerAdt.test(axiosSignInRequestPath)) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'Invalid username and/or password');
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSignInRequestPath, sessions.axiosSignIn);

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: 'Invalid username and/or password',
          },
        };
      }

      // If the final URL of sessions.axiosSignIn is not the workflow challenge page.
      if (!axiosSignInRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', `"${axiosSignInRequestPath}" is not the workflow challenge page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSignInRequestPath, sessions.axiosSignIn);

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: `"${axiosSignInRequestPath}" is not the workflow challenge page`,
          },
        };
      }

      // Make sure we are able to use the "String.prototype.match()" method on the response data.
      if (typeof sessions.axiosSignIn.data !== 'string') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'The response body of the workflow challenge page is not of type "string"');
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
       * ➜ window.g.mfa = {
       *     xToken: '',
       *     xPreAuthToken: 'ABCDEF0123456789',
       *     xLogin: "user@example.com",
       *     userEmail: "user@example.com",
       *     xClientType: "web",
       *     env: "prod",
       *     locale: "en_US",
       *     partner: "adt",
       *     sat: '3b59d412-0dcb-41fb-b925-3fcfe3144633',
       *     proxyServletUrl: "/nga/serv/RunRRAProxy",
       *     rootAddress: "",
       *     workflow: workflow,
       *     shouldForceMfaSetup: null,
       *     supportPhoneNumber: "1 (800) 251-9581",
       *     mockApi: false,
       *     testCase: 0,
       *     returnToPortalCb: returnToPortalCb
       *   };
       *
       * Only need to store part of the "window.g.mfa" object. Each key should
       * be two elements. It is loosely matched for more to take unexpected changes
       * into account. Used for retrieving verification methods.
       *
       * @since 1.0.0
       */
      const matchClientType = sessions.axiosSignIn.data.match(objectKeyClientType);
      const matchLocale = sessions.axiosSignIn.data.match(objectKeyLocale);
      const matchLogin = sessions.axiosSignIn.data.match(objectKeyLogin);
      const matchPreAuthToken = sessions.axiosSignIn.data.match(objectKeyPreAuthToken);
      const matchSatCode = sessions.axiosSignIn.data.match(objectKeySat);
      this.#session.mfa.clientType = (matchClientType !== null && matchClientType.length >= 2) ? matchClientType[1] : null;
      this.#session.mfa.locale = (matchLocale !== null && matchLocale.length >= 2) ? matchLocale[1] : null;
      this.#session.mfa.login = (matchLogin !== null && matchLogin.length >= 2) ? matchLogin[1] : null;
      this.#session.mfa.preAuthToken = (matchPreAuthToken !== null && matchPreAuthToken.length >= 2) ? matchPreAuthToken[1] : null;
      this.#session.mfa.satCode = (matchSatCode !== null && matchSatCode.length >= 2) ? matchSatCode[1] : null;

      if (
        this.#session.mfa.clientType === null // Make sure the "xClientType" key exists in "window.g.mfa" object.
        || this.#session.mfa.locale === null // Make sure the "locale" key exists in "window.g.mfa" object.
        || this.#session.mfa.login === null // Make sure the "xLogin" key exists in "window.g.mfa" object.
        || this.#session.mfa.preAuthToken === null // Make sure the "xPreAuthToken" key exists in "window.g.mfa" object.
        || this.#session.mfa.satCode === null // Make sure the "sat" key exists in "window.g.mfa" object.
      ) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'Failed to retrieve required MFA details from the workflow challenge page');
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
      sessions.axiosMethods = await this.#session.httpClient.get<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/nga/serv/RunRRAProxy?href=rest/icontrol/ui/client/multiFactorAuth&sat=${this.#session.mfa.satCode}`,
        this.getRequestConfig({
          headers: {
            Accept: 'application/json',
            'Content-Type': undefined,
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/mfa/mfaSignIn.jsp?workflow=challenge`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
            'Upgrade-Insecure-Requests': undefined,
            'X-clientType': this.#session.mfa.clientType,
            'X-format': 'json',
            'X-locale': this.#session.mfa.locale,
            'X-login': this.#session.mfa.login,
            'X-preAuthToken': this.#session.mfa.preAuthToken,
            'X-version': '7.0',
            'x-dtpc': generateFakeDynatracePCHeaderValue('multi-factor'),
          },
        }),
      );

      // Check for server error response.
      if (sessions.axiosMethods.status >= 400) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', `The remote server responded with a HTTP ${sessions.axiosMethods.status} status code`);
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosMethods.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosMethods?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosMethodsRequestPath = sessions.axiosMethods.request.path;
      const axiosMethodsRequestPathValid = requestPathNgaServRunRraProxyHrefRestIcontrolUiClientMultiFactorAuthSatXx.test(axiosMethodsRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Request path ➜ ${axiosMethodsRequestPath}`);
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'info', `Request path valid ➜ ${axiosMethodsRequestPathValid}`);
      }

      // If the final URL of sessions.axiosMethods is not the MFA auth page.
      if (!axiosMethodsRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', `"${axiosMethodsRequestPath}" is not the MFA auth page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosMethodsRequestPath, sessions.axiosMethods);

        return {
          action: 'GET_VERIFICATION_METHODS',
          success: false,
          info: {
            message: `"${axiosMethodsRequestPath}" is not the MFA auth page`,
          },
        };
      }

      // Parse the JSON response.
      const parsedMethods = multiFactorAuth.safeParse(sessions.axiosMethods.data);

      // If the response body does not match the expected schema.
      if (!parsedMethods.success) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'The response body of the MFA auth page is invalid');
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
       * NOTICE: Responses may be inaccurate or missing.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * How the data may be displayed:
       * ➜ {
       *     state: {
       *       mfaEnabled: true,
       *       label: 'Enabled (2 verification methods)',
       *       mfaProperties: [
       *         {
       *           id: 'SMS',
       *           type: 'SMS',
       *           label: '(***) ***-1234',
       *           caption: 'Text message to <span class="ic_strong">(***) ***-1234</span>'
       *         },
       *         {
       *           id: 'EMAIL',
       *           type: 'EMAIL',
       *           label: 'u***@e***.com',
       *           caption: 'Email to <span class="ic_strong">u***@e***.com</span>'
       *         },
       *       ],
       *     },
       *   }
       *
       * Example data after being processed by "parseMultiFactorMethods()" function/method:
       * ➜ [
       *     {
       *       id: 'SMS',
       *       type: 'SMS',
       *       label: '(***) ***-1234',
       *     },
       *     {
       *       id: 'EMAIL',
       *       type: 'EMAIL',
       *       label: 'u***@e***.com',
       *     },
       *   ]
       *
       * @since 1.0.0
       */
      const parsedMultiFactorMethods = parseMultiFactorMethods(parsedMethods.data);

      // If the verification methods come back as an empty array.
      if (parsedMultiFactorMethods.length === 0) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'Failed to retrieve verification methods');
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
      this.#session.mfa.verificationMethods = parsedMultiFactorMethods;

      // Mark the session for "this instance" as authenticated.
      this.#session.status = 'complete';

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'success', `Successfully retrieved verification methods from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'GET_VERIFICATION_METHODS',
        success: true,
        info: {
          methods: parsedMultiFactorMethods,
          status: this.#session.status,
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getVerificationMethods()', 'error', 'Method encountered an error during execution');
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
   * ADT Pulse Auth - Request code.
   *
   * @param {ADTPulseAuthRequestCodeMethodId} methodId - Method id.
   *
   * @returns {ADTPulseAuthRequestCodeReturns}
   *
   * @since 1.0.0
   */
  public async requestCode(methodId: ADTPulseAuthRequestCodeMethodId): ADTPulseAuthRequestCodeReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.requestCode()', 'info', `Attempting to request a code using the "${methodId}" method at "${this.#internal.baseUrl}"`);
    }

    // Validate if the verification method exists.
    if (this.#session.mfa.verificationMethods.find((device) => device.id === methodId) === undefined) {
      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.requestCode()', 'error', `The "${methodId}" verification method does not exist. Did you run the "getVerificationMethods()" yet?`);
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
      const sessions: ADTPulseAuthRequestCodeSessions = {};

      // Build an "application/x-www-form-urlencoded" form for use with requesting a code.
      const requestCodeForm = new URLSearchParams();
      requestCodeForm.append('id', methodId);

      // sessions.axiosRequestCode: Emulate a request code request.
      sessions.axiosRequestCode = await this.#session.httpClient.post<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/nga/serv/RunRRAProxy?href=rest/adt/ui/client/multiFactorAuth/requestOtpForRegisteredProperty&sat=${this.#session.mfa.satCode}`,
        requestCodeForm,
        this.getRequestConfig({
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Origin: this.#internal.baseUrl,
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/mfa/mfaSignIn.jsp?workflow=challenge`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
            'Upgrade-Insecure-Requests': undefined,
            'X-clientType': this.#session.mfa.clientType,
            'X-format': 'json',
            'X-locale': this.#session.mfa.locale,
            'X-login': this.#session.mfa.login,
            'X-preAuthToken': this.#session.mfa.preAuthToken,
            'X-version': '7.0',
            'x-dtpc': generateFakeDynatracePCHeaderValue('multi-factor'),
          },
        }),
      );

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosRequestCode?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.requestCode()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'REQUEST_CODE',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosRequestCodeRequestPath = sessions.axiosRequestCode.request.path;
      const axiosRequestCodeRequestPathValid = requestPathNgaServRunRraProxyHrefRestAdtUiClientMultiFactorAuthRequestOtpForRegisteredPropertySatXx.test(axiosRequestCodeRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.requestCode()', 'info', `Request path ➜ ${axiosRequestCodeRequestPath}`);
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.requestCode()', 'info', `Request path valid ➜ ${axiosRequestCodeRequestPathValid}`);
      }

      // If the final URL of sessions.axiosRequestCode is not the request code page.
      if (!axiosRequestCodeRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.requestCode()', 'error', `"${axiosRequestCodeRequestPath}" is not the request code page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosRequestCodeRequestPath, sessions.axiosRequestCode);

        return {
          action: 'REQUEST_CODE',
          success: false,
          info: {
            message: `"${axiosRequestCodeRequestPath}" is not the request code page`,
          },
        };
      }

      // Parse the JSON response.
      const parsedRequestCode = otpResponse.safeParse(sessions.axiosRequestCode.data);

      // If the response body does not match the expected schema.
      if (!parsedRequestCode.success) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.requestCode()', 'error', 'The response body of the request code page is invalid');
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
      if (!parsedRequestCode.data.detail.includes('OK')) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.requestCode()', 'error', `Unable to get a verification code ➜ "${parsedRequestCode.data.detail}"`);
        }

        return {
          action: 'REQUEST_CODE',
          success: false,
          info: {
            message: `Unable to get a verification code ➜ "${parsedRequestCode.data.detail}"`,
          },
        };
      }

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.requestCode()', 'success', `Successfully requested a code for "${methodId}" at "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'REQUEST_CODE',
        success: true,
        info: null,
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.requestCode()', 'error', 'Method encountered an error during execution');
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
   * ADT Pulse Auth - Validate code.
   *
   * @param {ADTPulseAuthValidateCodeOtpCode} otpCode - Otp code.
   *
   * @returns {ADTPulseAuthValidateCodeReturns}
   *
   * @since 1.0.0
   */
  public async validateCode(otpCode: ADTPulseAuthValidateCodeOtpCode): ADTPulseAuthValidateCodeReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.validateCode()', 'info', `Attempting to validate verification code at "${this.#internal.baseUrl}"`);
    }

    // Validate the verification code format.
    if (!textOneTimePasscode.test(otpCode)) {
      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.validateCode()', 'error', `"${otpCode}" is an invalid verification code format`);
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
      const sessions: ADTPulseAuthValidateCodeSessions = {};

      // Build an "application/x-www-form-urlencoded" form for use with validating a code.
      const validateCodeForm = new URLSearchParams();
      validateCodeForm.append('otp', otpCode);

      // sessions.axiosValidateCode: Emulate a validate code request.
      sessions.axiosValidateCode = await this.#session.httpClient.post<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/nga/serv/RunRRAProxy?href=rest/adt/ui/client/multiFactorAuth/validateOtp&sat=${this.#session.mfa.satCode}`,
        validateCodeForm,
        this.getRequestConfig({
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Origin: this.#internal.baseUrl,
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/mfa/mfaSignIn.jsp?workflow=challenge`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
            'Upgrade-Insecure-Requests': undefined,
            'X-clientType': this.#session.mfa.clientType,
            'X-format': 'json',
            'X-locale': this.#session.mfa.locale,
            'X-login': this.#session.mfa.login,
            'X-preAuthToken': this.#session.mfa.preAuthToken,
            'X-version': '7.0',
            'x-dtpc': generateFakeDynatracePCHeaderValue('multi-factor'),
          },
        }),
      );

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosValidateCode?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.validateCode()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'VALIDATE_CODE',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosValidateCodeRequestPath = sessions.axiosValidateCode.request.path;
      const axiosValidateCodeRequestPathValid = requestPathNgaServRunRraProxyHrefRestAdtUiClientMultiFactorAuthValidateOtpSatXx.test(axiosValidateCodeRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.validateCode()', 'info', `Request path ➜ ${axiosValidateCodeRequestPath}`);
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.validateCode()', 'info', `Request path valid ➜ ${axiosValidateCodeRequestPathValid}`);
      }

      // If the final URL of sessions.axiosValidateCode is not the validate code page.
      if (!axiosValidateCodeRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.validateCode()', 'error', `"${axiosValidateCodeRequestPath}" is not the validate code page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosValidateCodeRequestPath, sessions.axiosValidateCode);

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
        typeof sessions.axiosValidateCode.data === 'string'
        && sessions.axiosValidateCode.data === ''
      ) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.validateCode()', 'error', 'Already passed verification');
        }

        return {
          action: 'VALIDATE_CODE',
          success: true,
          info: null,
        };
      }

      // Parse the JSON response.
      const parsedValidateCode = otpResponse.safeParse(sessions.axiosValidateCode.data);

      // If the response body does not match the expected schema.
      if (!parsedValidateCode.success) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.validateCode()', 'error', 'The response body of the validate code page is invalid');
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
      if (!parsedValidateCode.data.detail.startsWith('u=')) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.validateCode()', 'error', 'The verification code submitted is either invalidated or expired');
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
      this.#session.mfa.token = parsedValidateCode.data.detail;

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.validateCode()', 'success', `Successfully validated verification code at "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'VALIDATE_CODE',
        success: true,
        info: null,
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.validateCode()', 'error', 'Method encountered an error during execution');
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
   * ADT Pulse Auth - Get trusted devices.
   *
   * @returns {ADTPulseAuthGetTrustedDevicesReturns}
   *
   * @since 1.0.0
   */
  public async getTrustedDevices(): ADTPulseAuthGetTrustedDevicesReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'info', `Attempting to retrieve trusted devices at "${this.#internal.baseUrl}"`);
    }

    try {
      const sessions: ADTPulseAuthGetTrustedDevicesSessions = {};

      // sessions.axiosDevicePoll: Emulate a multi-factor device polling request.
      sessions.axiosDevicePoll = await this.#session.httpClient.get<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/nga/serv/RunRRAProxy?only=client.multiFactorAuth&exclude=&sat=${this.#session.mfa.satCode}&href=rest/adt/ui/updates&sat=${this.#session.mfa.satCode}&`,
        this.getRequestConfig({
          headers: {
            Accept: 'application/json',
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/mfa/mfaSignIn.jsp?workflow=challenge`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
            'Upgrade-Insecure-Requests': undefined,
            'X-clientType': this.#session.mfa.clientType,
            'X-format': 'json',
            'X-locale': this.#session.mfa.locale,
            'X-login': this.#session.mfa.login,
            'X-token': this.#session.mfa.token,
            'X-version': '7.0',
            'x-dtpc': generateFakeDynatracePCHeaderValue('multi-factor'),
          },
        }),
      );

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosDevicePoll?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_TRUSTED_DEVICES',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosDevicePollRequestPath = sessions.axiosDevicePoll.request.path;
      const axiosDevicePollRequestPathValid = requestPathNgaServRunRraProxyOnlyClientMultiFactorAuthExcludeSatXxHrefRestAdtUiUpdatesSatXx.test(axiosDevicePollRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'info', `Request path ➜ ${axiosDevicePollRequestPath}`);
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'info', `Request path valid ➜ ${axiosDevicePollRequestPathValid}`);
      }

      // If the final URL of sessions.axiosDevicePoll is not the device polling page.
      if (!axiosDevicePollRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'error', `"${axiosDevicePollRequestPath}" is not the device polling page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosDevicePollRequestPath, sessions.axiosDevicePoll);

        return {
          action: 'GET_TRUSTED_DEVICES',
          success: false,
          info: {
            message: `"${axiosDevicePollRequestPath}" is not the device polling page`,
          },
        };
      }

      // Parse the JSON response.
      const parsedDevicePoll = multiFactorAuth.safeParse(_.get(sessions.axiosDevicePoll.data, ['update', 0, 'data', 'client', 'multiFactorAuth']));

      // If the response body does not match the expected schema.
      if (!parsedDevicePoll.success) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'error', 'The response body of the device polling page is invalid');
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
       * NOTICE: Responses may be inaccurate or missing.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * How the data may be displayed:
       * ➜ {
       *     update: [
       *       {
       *         data: {
       *           client: {
       *             multiFactorAuth: {
       *               state: {
       *                 trustedDevices: [
       *                   {
       *                     id: 'Ub7YQwK4B4==',
       *                     name: 'My Trusted Device',
       *                     label: '<span class="ic_strong">My Trusted Device</span>',
       *                   }
       *                 ],
       *               },
       *             },
       *           },
       *         },
       *         ts: 123456789,
       *         type: 'replaceall',
       *       },
       *     ],
       *     count: 1,
       *     ts: 123456789,
       *   }
       *
       * Example data after being processed by "parseMultiFactorTrustedDevices()" function/method:
       * ➜ [
       *    {
       *      id: 'Ub7YQwK4B4==',
       *      name: 'My Trusted Device',
       *    },
       *   ]
       *
       * @since 1.0.0
       */
      const parsedTrustedDevices: ADTPulseAuthGetTrustedDevicesParsedTrustedDevices = parseMultiFactorTrustedDevices(parsedDevicePoll.data);

      // Save the trusted devices into "this instance".
      this.#session.mfa.trustedDevices = parsedTrustedDevices;

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'success', `Successfully retrieved trusted devices at "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'GET_TRUSTED_DEVICES',
        success: true,
        info: {
          trustedDevices: parsedTrustedDevices,
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getTrustedDevices()', 'error', 'Method encountered an error during execution');
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
   * ADT Pulse Auth - Add trusted device.
   *
   * @param {ADTPulseAuthAddTrustedDeviceDeviceName} deviceName - Device name.
   *
   * @returns {ADTPulseAuthAddTrustedDeviceReturns}
   *
   * @since 1.0.0
   */
  public async addTrustedDevice(deviceName: ADTPulseAuthAddTrustedDeviceDeviceName): ADTPulseAuthAddTrustedDeviceReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'info', `Attempting to add trusted device at "${this.#internal.baseUrl}"`);
    }

    // Validate if the trusted device name already exists.
    if (this.#session.mfa.trustedDevices.find((trustedDevice) => trustedDevice.name === encodeURIComponent(deviceName)) !== undefined) { // Will be encoded twice, intentional.
      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'error', 'The name for the trusted device already exists');
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
      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'error', 'The name for the trusted device must be between 1 to 100 characters');
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
      const sessions: ADTPulseAuthAddTrustedDeviceSessions = {};

      // Build an "application/x-www-form-urlencoded" form for use with adding a trusted device.
      const trustedDeviceForm = new URLSearchParams();
      trustedDeviceForm.append('name', encodeURIComponent(deviceName)); // Will be encoded twice, intentional.

      // sessions.axiosAddDevice: Emulate an add trusted device request.
      sessions.axiosAddDevice = await this.#session.httpClient.post<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/nga/serv/RunRRAProxy?href=rest/adt/ui/client/multiFactorAuth/addTrustedDevice&sat=${this.#session.mfa.satCode}`,
        trustedDeviceForm,
        this.getRequestConfig({
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Origin: this.#internal.baseUrl,
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/mfa/mfaSignIn.jsp?workflow=challenge`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
            'Upgrade-Insecure-Requests': undefined,
            'X-clientType': this.#session.mfa.clientType,
            'X-format': 'json',
            'X-locale': this.#session.mfa.locale,
            'X-login': this.#session.mfa.login,
            'X-token': this.#session.mfa.token,
            'X-version': '7.0',
            'x-dtpc': generateFakeDynatracePCHeaderValue('multi-factor'),
          },
        }),
      );

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosAddDevice?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'ADD_TRUSTED_DEVICE',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosAddDeviceRequestPath = sessions.axiosAddDevice.request.path;
      const axiosAddDeviceRequestPathValid = requestPathNgaServRunRraProxyHrefRestAdtUiClientMultiFactorAuthAddTrustedDeviceSatXx.test(axiosAddDeviceRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'info', `Request path ➜ ${axiosAddDeviceRequestPath}`);
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'info', `Request path valid ➜ ${axiosAddDeviceRequestPathValid}`);
      }

      // If the final URL of sessions.axiosAddDevice is not the add trusted device page.
      if (!axiosAddDeviceRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'error', `"${axiosAddDeviceRequestPath}" is not the add trusted device page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosAddDeviceRequestPath, sessions.axiosAddDevice);

        return {
          action: 'ADD_TRUSTED_DEVICE',
          success: false,
          info: {
            message: `"${axiosAddDeviceRequestPath}" is not the add trusted device page`,
          },
        };
      }

      // Parse the JSON response.
      const parsedValidateCode = otpResponse.safeParse(sessions.axiosAddDevice.data);

      // If the response body does not match the expected schema.
      if (!parsedValidateCode.success) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'error', 'The response body of the add trusted device page is invalid');
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
      if (!parsedValidateCode.data.detail.includes('OK')) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'error', `The trusted device could not be added ➜ "${parsedValidateCode.data.detail}"`);
        }

        return {
          action: 'ADD_TRUSTED_DEVICE',
          success: false,
          info: {
            message: `The trusted device could not be added ➜ "${parsedValidateCode.data.detail}"`,
          },
        };
      }

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'success', `Successfully added trusted device at "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'ADD_TRUSTED_DEVICE',
        success: true,
        info: null,
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.addTrustedDevice()', 'error', 'Method encountered an error during execution');
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
   * ADT Pulse Auth - Complete sign in.
   *
   * @returns {ADTPulseAuthCompleteSignInReturns}
   *
   * @since 1.0.0
   */
  public async completeSignIn(): ADTPulseAuthCompleteSignInReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.completeSignIn()', 'info', `Attempting to complete sign in at "${this.#internal.baseUrl}"`);
    }

    try {
      const sessions: ADTPulseAuthCompleteSignInSessions = {};

      // sessions.axiosPostSignIn: Emulate a post sign-in request.
      sessions.axiosPostSignIn = await this.#session.httpClient.get<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/access/PostSigninProcessServ`,
        this.getRequestConfig({
          headers: {
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/mfa/mfaSignIn.jsp?workflow=challenge`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions.axiosPostSignIn.status >= 400) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.completeSignIn()', 'error', `The remote server responded with a HTTP ${sessions.axiosPostSignIn.status} status code`);
        }

        return {
          action: 'COMPLETE_SIGN_IN',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosPostSignIn.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosPostSignIn?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.completeSignIn()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'COMPLETE_SIGN_IN',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosPostSignInRequestPath = sessions.axiosPostSignIn.request.path;
      const axiosPostSignInRequestPathValid = requestPathSummarySummary.test(axiosPostSignInRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.completeSignIn()', 'info', `Request path ➜ ${axiosPostSignInRequestPath}`);
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.completeSignIn()', 'info', `Request path valid ➜ ${axiosPostSignInRequestPathValid}`);
      }

      // If the final URL of sessions.axiosPostSignIn is not the summary page.
      if (!axiosPostSignInRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.completeSignIn()', 'error', `"${axiosPostSignInRequestPath}" is not the summary page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosPostSignInRequestPath, sessions.axiosPostSignIn);

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

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.completeSignIn()', 'success', `Successfully completed sign in at "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'COMPLETE_SIGN_IN',
        success: true,
        info: null,
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.completeSignIn()', 'error', 'Method encountered an error during execution');
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
   * ADT Pulse Auth - Get sensors.
   *
   * @returns {ADTPulseAuthGetSensorsReturns}
   *
   * @since 1.0.0
   */
  public async getSensors(): ADTPulseAuthGetSensorsReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getSensors()', 'info', `Attempting to retrieve sensors from "${this.#internal.baseUrl}"`);
    }

    try {
      const sessions: ADTPulseAuthGetSensorsSessions = {};

      // sessions.axiosSystem: Load the system page.
      sessions.axiosSystem = await this.#session.httpClient.get<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/system/system.jsp`,
        this.getRequestConfig({
          headers: {
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions.axiosSystem.status >= 400) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getSensors()', 'error', `The remote server responded with a HTTP ${sessions.axiosSystem.status} status code`);
        }

        return {
          action: 'GET_SENSORS',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosSystem.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosSystem?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getSensors()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_SENSORS',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSystemRequestPath = sessions.axiosSystem.request.path;
      const axiosSystemRequestPathValid = requestPathSystemSystem.test(axiosSystemRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getSensors()', 'info', `Request path ➜ ${axiosSystemRequestPath}`);
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getSensors()', 'info', `Request path valid ➜ ${axiosSystemRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSystem is not the system page.
      if (!axiosSystemRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getSensors()', 'error', `"${axiosSystemRequestPath}" is not the system page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSystemRequestPath, sessions.axiosSystem);

        return {
          action: 'GET_SENSORS',
          success: false,
          info: {
            message: `"${axiosSystemRequestPath}" is not the system page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions.axiosSystem.data !== 'string') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getSensors()', 'error', 'The response body of the system page is not of type "string"');
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
        sessions.axiosSystem.data,
        {
          url: sessions.axiosSystem.config.url,
          referrer: sessions.axiosSystem.config.headers.Referer,
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * Detailed parsing information for "sensorsConfig".
       *
       * NOTICE: Responses may be inaccurate or missing.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * How the data may be displayed:
       * ➜ <tr onclick="goToUrl('device.jsp?id=2');">
       *     <td>
       *       <canvas title="Online"></canvas>
       *     </td>
       *     <td>
       *       <a>Sensor 1</a>
       *     </td>
       *     <td> 1</td>
       *     <td>&nbsp;</td>
       *     <td>Door/Window Sensor</td>
       *   </tr>
       *
       * Example data after being processed by "parseSensorsTable()" function/method:
       * ➜ [
       *     {
       *       adtName: 'Sensor 1',
       *       adtType: 'doorWindow',
       *       adtZone: 1,
       *     },
       *   ]
       *
       * @since 1.0.0
       */
      const jsdomSystemSensorsTable = sessions.jsdomSystem.window.document.querySelectorAll('#systemContentList tr[class^=\'p_row\'] tr.p_listRow');
      const parsedSensorsConfigTable = parseSensorsTable('sensors-config', jsdomSystemSensorsTable) as ADTPulseAuthGetSensorsParsedSensorsConfigTable;

      // Check if the parsing function is parsing data incorrectly.
      await this.newInformationDispatcher('debug-parser', {
        method: 'generateSensorsConfig',
        response: parsedSensorsConfigTable,
        rawHtml: sessions.axiosSystem.data,
      });

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getSensors()', 'success', `Successfully retrieved sensors from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'GET_SENSORS',
        success: true,
        info: {
          sensors: parsedSensorsConfigTable,
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.getSensors()', 'error', 'Method encountered an error during execution');
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
   * ADT Pulse Auth - Get fingerprint.
   *
   * @returns {ADTPulseAuthGetFingerprintReturns}
   *
   * @since 1.0.0
   */
  public getFingerprint(): ADTPulseAuthGetFingerprintReturns {
    return this.#credentials.fingerprint;
  }

  /**
   * ADT Pulse Auth - Reset session.
   *
   * @returns {ADTPulseAuthResetSessionReturns}
   *
   * @since 1.0.0
   */
  public resetSession(): ADTPulseAuthResetSessionReturns {
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
  }

  /**
   * ADT Pulse Auth - New information dispatcher.
   *
   * @param {ADTPulseAuthNewInformationDispatcherType} type - Type.
   * @param {ADTPulseAuthNewInformationDispatcherData} data - Data.
   *
   * @private
   *
   * @returns {ADTPulseAuthNewInformationDispatcherReturns}
   *
   * @since 1.0.0
   */
  private async newInformationDispatcher(type: ADTPulseAuthNewInformationDispatcherType, data: ADTPulseAuthNewInformationDispatcherData<ADTPulseAuthNewInformationDispatcherType>): ADTPulseAuthNewInformationDispatcherReturns {
    const dataHash = generateHash(data);

    // If the detector has not reported this event before.
    if (this.#internal.reportedHashes.find((reportedHash) => dataHash === reportedHash) === undefined) {
      let detectedNew = false;

      // Determine what information needs to be checked.
      switch (type) {
        case 'debug-parser':
          detectedNew = await detectGlobalDebugParser(data as ADTPulseAuthNewInformationDispatcherData<'debug-parser'>, null, this.#internal.debug);
          break;
        case 'portal-version':
          detectedNew = await detectGlobalPortalVersion(data as ADTPulseAuthNewInformationDispatcherData<'portal-version'>, null, this.#internal.debug);
          break;
        default:
          break;
      }

      // Save this hash so the detector does not detect the same thing multiple times.
      if (detectedNew) {
        this.#internal.reportedHashes.push(dataHash);
      }
    }
  }

  /**
   * ADT Pulse Auth - Get request config.
   *
   * @param {ADTPulseAuthGetRequestConfigExtraConfig} extraConfig - Extra config.
   *
   * @private
   *
   * @returns {ADTPulseAuthGetRequestConfigReturns}
   *
   * @since 1.0.0
   */
  private getRequestConfig(extraConfig?: ADTPulseAuthGetRequestConfigExtraConfig): ADTPulseAuthGetRequestConfigReturns {
    const defaultConfig: ADTPulseAuthGetRequestConfigDefaultConfig = {
      family: 4,
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        Host: `${this.#connection.subdomain}.adtpulse.com`,
        Pragma: 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
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
   * ADT Pulse Auth - Handle login failure.
   *
   * @param {ADTPulseAuthHandleLoginFailureRequestPath} requestPath - Request path.
   * @param {ADTPulseAuthHandleLoginFailureSession}     session     - Session.
   *
   * @private
   *
   * @returns {ADTPulseAuthHandleLoginFailureReturns}
   *
   * @since 1.0.0
   */
  private handleLoginFailure(requestPath: ADTPulseAuthHandleLoginFailureRequestPath, session: ADTPulseAuthHandleLoginFailureSession): ADTPulseAuthHandleLoginFailureReturns {
    if (requestPath === null) {
      return;
    }

    if (requestPathAccessSignIn.test(requestPath) || requestPathAccessSignInEXxPartnerAdt.test(requestPath)) {
      if (this.#internal.debug) {
        const errorMessage = fetchErrorMessage(session);

        // Determine if "this instance" was redirected to the sign-in page.
        if (requestPathAccessSignIn.test(requestPath) || requestPathAccessSignInEXxPartnerAdt.test(requestPath)) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.handleLoginFailure()', 'error', 'Either the username or password is incorrect, fingerprint format is invalid, or was signed out due to inactivity');
        }

        // Determine if "this instance" does not require to authenticate the generated fingerprint.
        if (requestPathSummarySummary.test(requestPath)) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.handleLoginFailure()', 'error', 'The generated fingerprint is already validated');
        }

        // Show the portal error message if it exists.
        if (errorMessage !== null) {
          debugLog(this.#internal.logger, 'auth.ts / ADTPulseAuth.handleLoginFailure()', 'warn', `Portal message ➜ "${errorMessage}"`);
        }
      }

      // Reset the session state for "this instance".
      this.resetSession();
    }
  }
}
