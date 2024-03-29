import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { JSDOM } from 'jsdom';
import _ from 'lodash';
import { serializeError } from 'serialize-error';
import { CookieJar } from 'tough-cookie';

import {
  detectApiDebugParser,
  detectApiDoSubmitHandlers,
  detectApiGatewayInformation,
  detectApiOrbSecurityButtons,
  detectApiPanelInformation,
  detectApiPanelStatus,
  detectApiPortalVersion,
  detectApiSensorsInformation,
  detectApiSensorsStatus,
} from '@/lib/detect.js';
import {
  paramNetworkId,
  paramSat,
  requestPathAccessSignIn,
  requestPathAccessSignInEXxPartnerAdt,
  requestPathAccessSignInNetworkIdXxPartnerAdt,
  requestPathAjaxSyncCheckServTXx,
  requestPathKeepAlive,
  requestPathMfaMfaSignInWorkflowChallenge,
  requestPathQuickControlArmDisarm,
  requestPathQuickControlServRunRraCommand,
  requestPathSummarySummary,
  requestPathSystemDeviceId1,
  requestPathSystemGateway,
  requestPathSystemSystem,
  textPanelEmergencyKeys,
  textPanelTypeModel,
} from '@/lib/regex.js';
import {
  debugLog,
  fetchErrorMessage,
  fetchMissingSatCode,
  fetchTableCells,
  findGatewayManufacturerModel,
  findNullKeys,
  findPanelManufacturer,
  generateDynatracePCHeaderValue,
  generateFakeReadyButtons,
  generateHash,
  isPortalSyncCode,
  isSessionCleanState,
  parseArmDisarmMessage,
  parseDoSubmitHandlers,
  parseOrbSecurityButtons,
  parseOrbSensors,
  parseOrbTextSummary,
  parseSensorsTable,
  sleep,
  stackTracer,
} from '@/lib/utility.js';
import type {
  ADTPulseArmDisarmHandlerIsAlarmActive,
  ADTPulseArmDisarmHandlerOptions,
  ADTPulseArmDisarmHandlerReadyButton,
  ADTPulseArmDisarmHandlerReturns,
  ADTPulseArmDisarmHandlerSessions,
  ADTPulseConstructorConfig,
  ADTPulseConstructorInternalConfig,
  ADTPulseCredentials,
  ADTPulseForceArmHandlerRelativeUrl,
  ADTPulseForceArmHandlerResponse,
  ADTPulseForceArmHandlerReturns,
  ADTPulseForceArmHandlerSessions,
  ADTPulseForceArmHandlerTracker,
  ADTPulseGetGatewayInformationReturns,
  ADTPulseGetGatewayInformationReturnsStatus,
  ADTPulseGetGatewayInformationSessions,
  ADTPulseGetOrbSecurityButtonsReturns,
  ADTPulseGetOrbSecurityButtonsSessions,
  ADTPulseGetPanelInformationReturns,
  ADTPulseGetPanelInformationReturnsStatus,
  ADTPulseGetPanelInformationSessions,
  ADTPulseGetPanelStatusReturns,
  ADTPulseGetPanelStatusSessions,
  ADTPulseGetRequestConfigDefaultConfig,
  ADTPulseGetRequestConfigExtraConfig,
  ADTPulseGetRequestConfigReturns,
  ADTPulseGetSensorsInformationReturns,
  ADTPulseGetSensorsInformationSessions,
  ADTPulseGetSensorsStatusReturns,
  ADTPulseGetSensorsStatusSessions,
  ADTPulseHandleLoginFailureRequestPath,
  ADTPulseHandleLoginFailureReturns,
  ADTPulseHandleLoginFailureSession,
  ADTPulseInternal,
  ADTPulseIsAuthenticatedReturns,
  ADTPulseLoginPortalVersion,
  ADTPulseLoginReturns,
  ADTPulseLoginSessions,
  ADTPulseLogoutReturns,
  ADTPulseLogoutSessions,
  ADTPulseNewInformationDispatcherData,
  ADTPulseNewInformationDispatcherReturns,
  ADTPulseNewInformationDispatcherType,
  ADTPulsePerformKeepAliveReturns,
  ADTPulsePerformKeepAliveSessions,
  ADTPulsePerformSyncCheckReturns,
  ADTPulsePerformSyncCheckSessions,
  ADTPulseResetSessionReturns,
  ADTPulseSession,
  ADTPulseSetPanelStatusArmFrom,
  ADTPulseSetPanelStatusArmTo,
  ADTPulseSetPanelStatusIsAlarmActive,
  ADTPulseSetPanelStatusReadyButton,
  ADTPulseSetPanelStatusReturns,
} from '@/types/index.d.ts';

/**
 * ADT Pulse.
 *
 * @since 1.0.0
 */
export class ADTPulse {
  /**
   * ADT Pulse - Credentials.
   *
   * @private
   *
   * @since 1.0.0
   */
  #credentials: ADTPulseCredentials;

  /**
   * ADT Pulse - Internal.
   *
   * @private
   *
   * @since 1.0.0
   */
  #internal: ADTPulseInternal;

  /**
   * ADT Pulse - Session.
   *
   * @private
   *
   * @since 1.0.0
   */
  #session: ADTPulseSession;

  /**
   * ADT Pulse - Constructor.
   *
   * @param {ADTPulseConstructorConfig}         config         - Config.
   * @param {ADTPulseConstructorInternalConfig} internalConfig - Internal config.
   *
   * @since 1.0.0
   */
  public constructor(config: ADTPulseConstructorConfig, internalConfig: ADTPulseConstructorInternalConfig) {
    // Set config options.
    this.#credentials = {
      fingerprint: config.fingerprint,
      password: config.password,
      subdomain: config.subdomain,
      username: config.username,
    };

    // Set internal config options.
    this.#internal = {
      baseUrl: internalConfig.baseUrl ?? `https://${this.#credentials.subdomain}.adtpulse.com`,
      debug: internalConfig.debug ?? false,
      logger: internalConfig.logger ?? null,
      reportedHashes: [],
      testMode: {
        enabled: internalConfig.testMode?.enabled ?? false,
        isSystemDisarmedBeforeTest: internalConfig.testMode?.isSystemDisarmedBeforeTest ?? false,
      },
      waitTimeAfterArm: 5000, // 5 seconds.
    };

    // Set session information to defaults.
    this.#session = {
      backupSatCode: null,
      httpClient: wrapper(axios.create({
        jar: new CookieJar(),
        validateStatus: () => true,
      })),
      isAuthenticated: false,
      isCleanState: true,
      networkId: null,
      portalVersion: null,
    };

    // If the config specifies that plugin should run under reduced speed mode.
    if (config.speed !== 1) {
      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.constructor()', 'warn', `Plugin is now running under ${config.speed}x operational speed. You may see slower device updates`);
      }

      // Should be statically calculated to prevent excessive waiting.
      switch (config.speed) {
        case 0.75:
          this.#internal.waitTimeAfterArm = 6000; // 6 seconds.
          break;
        case 0.5:
          this.#internal.waitTimeAfterArm = 7000; // 7 seconds.
          break;
        case 0.25:
          this.#internal.waitTimeAfterArm = 8000; // 8 seconds.
          break;
        default:
          break;
      }
    }
  }

  /**
   * ADT Pulse - Login.
   *
   * @returns {ADTPulseLoginReturns}
   *
   * @since 1.0.0
   */
  public async login(): ADTPulseLoginReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.login()', 'info', `Attempting to login to "${this.#internal.baseUrl}"`);
    }

    try {
      const sessions: ADTPulseLoginSessions = {};

      // Check if "this instance" has already authenticated.
      if (this.isAuthenticated()) {
        if (this.#internal.debug) {
          debugLog(
            this.#internal.logger,
            'api.ts / ADTPulse.login()',
            'info',
            [
              'Already logged in',
              [
                '(',
                [
                  `backup sat code: ${this.#session.backupSatCode}`,
                  `network id: ${this.#session.networkId}`,
                  `portal version: ${this.#session.portalVersion}`,
                ].join(', '),
                ')',
              ].join(''),
            ].join(' '),
          );
        }

        return {
          action: 'LOGIN',
          success: true,
          info: {
            backupSatCode: this.#session.backupSatCode,
            networkId: this.#session.networkId,
            portalVersion: this.#session.portalVersion,
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
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.login()', 'error', `The remote server responded with a HTTP ${sessions.axiosIndex.status} status code`);
        }

        return {
          action: 'LOGIN',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosIndex.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosIndex?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.login()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'LOGIN',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosIndexRequestPath = sessions.axiosIndex.request.path;
      const axiosIndexRequestPathValid = requestPathAccessSignIn.test(axiosIndexRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.login()', 'info', `Request path ➜ ${axiosIndexRequestPath}`);
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.login()', 'info', `Request path valid ➜ ${axiosIndexRequestPathValid}`);
      }

      // If the final URL of sessions.axiosIndex is not the sign-in page.
      if (!axiosIndexRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.login()', 'error', `"${axiosIndexRequestPath} is not the sign-in page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosIndexRequestPath, sessions.axiosIndex);

        return {
          action: 'LOGIN',
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
      this.#session.portalVersion = axiosIndexRequestPath.replace(requestPathAccessSignIn, '$2') as ADTPulseLoginPortalVersion;

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
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('portal-version', { version: this.#session.portalVersion });

      // sessions.axiosSignin: Emulate a sign-in request.
      sessions.axiosSignin = await this.#session.httpClient.post<unknown>(
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
      if (sessions.axiosIndex.status >= 400) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.login()', 'error', `The remote server responded with a HTTP ${sessions.axiosIndex.status} status code`);
        }

        return {
          action: 'LOGIN',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosIndex.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosSignin?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.login()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'LOGIN',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSigninRequestPath = sessions.axiosSignin.request.path;
      const axiosSigninRequestPathValid = requestPathSummarySummary.test(axiosSigninRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.login()', 'info', `Request path ➜ ${axiosSigninRequestPath}`);
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.login()', 'info', `Request path valid ➜ ${axiosSigninRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSignin is not the summary page.
      if (!axiosSigninRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.login()', 'error', `"${axiosSigninRequestPath}" is not the summary page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSigninRequestPath, sessions.axiosSignin);

        return {
          action: 'LOGIN',
          success: false,
          info: {
            message: `"${axiosSigninRequestPath}" is not the summary page`,
          },
        };
      }

      // Make sure we are able to use the "String.prototype.match()" method on the response data.
      if (typeof sessions.axiosSignin.data !== 'string') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.login()', 'error', 'The response body of the summary page is not of type "string"');
        }

        return {
          action: 'LOGIN',
          success: false,
          info: {
            message: 'The response body of the summary page is not of type "string"',
          },
        };
      }

      /**
       * Original matches for the network ID (site ID).
       *
       * - "?networkid=1234567890"
       * - "1234567890"
       *
       * Only need to store the network ID (site ID), and should be
       * two elements. It is loosely matched for more to take unexpected
       * changes into account. Used for logout links.
       *
       * @since 1.0.0
       */
      const matchNetworkId = sessions.axiosSignin.data.match(paramNetworkId);
      this.#session.networkId = (matchNetworkId !== null && matchNetworkId.length >= 2) ? matchNetworkId[1] : null;

      /**
       * Original matches for the sat code.
       *
       * - "sat=3b59d412-0dcb-41fb-b925-3fcfe3144633"
       * - "3b59d412-0dcb-41fb-b925-3fcfe3144633"
       *
       * Only need to store the sat code, and should be two elements.
       * It is loosely matched for more to take unexpected changes into
       * account. Used in case sat code is not found.
       *
       * If during login, the system status was unavailable, this value
       * will be null, and things like creating a fake Disarm button would not
       * work. Will try to recover on "summary/summary.jsp" page loads.
       *
       * @since 1.0.0
       */
      const matchSatCode = sessions.axiosSignin.data.match(paramSat);
      this.#session.backupSatCode = (matchSatCode !== null && matchSatCode.length >= 2) ? matchSatCode[1] : null;

      // If backup sat code was unavailable at this time.
      if (this.#session.backupSatCode === null && this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.login()', 'warn', 'Unable to backup sat code, will try again when system becomes available');
      }

      // Mark the session for "this instance" as authenticated.
      this.#session.isAuthenticated = true;

      if (this.#internal.debug) {
        debugLog(
          this.#internal.logger,
          'api.ts / ADTPulse.login()',
          'success',
          [
            'Login successful',
            [
              '(',
              [
                `backup sat code: ${this.#session.backupSatCode}`,
                `network id: ${this.#session.networkId}`,
                `portal version: ${this.#session.portalVersion}`,
              ].join(', '),
              ')',
            ].join(''),
          ].join(' '),
        );
      }

      return {
        action: 'LOGIN',
        success: true,
        info: {
          backupSatCode: this.#session.backupSatCode,
          networkId: this.#session.networkId,
          portalVersion: this.#session.portalVersion,
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.login()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'LOGIN',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * ADT Pulse - Logout.
   *
   * @returns {ADTPulseLogoutReturns}
   *
   * @since 1.0.0
   */
  public async logout(): ADTPulseLogoutReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.logout()', 'info', `Attempting to logout of "${this.#internal.baseUrl}"`);
    }

    try {
      const sessions: ADTPulseLogoutSessions = {};

      // Check if "this instance" has already de-authenticated.
      if (!this.isAuthenticated()) {
        if (this.#internal.debug) {
          debugLog(
            this.#internal.logger,
            'api.ts / ADTPulse.logout()',
            'info',
            [
              'Already logged out',
              [
                '(',
                [
                  `backup sat code: ${this.#session.backupSatCode}`,
                  `network id: ${this.#session.networkId}`,
                  `portal version: ${this.#session.portalVersion}`,
                ].join(', '),
                ')',
              ].join(''),
            ].join(' '),
          );
        }

        return {
          action: 'LOGOUT',
          success: true,
          info: {
            backupSatCode: this.#session.backupSatCode,
            networkId: this.#session.networkId,
            portalVersion: this.#session.portalVersion,
          },
        };
      }

      // sessions.axiosSignout: Emulate a sign-out request.
      sessions.axiosSignout = await this.#session.httpClient.get<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/access/signout.jsp?networkid=${this.#session.networkId}&partner=adt`,
        this.getRequestConfig({
          headers: {
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions.axiosSignout.status >= 400) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.logout()', 'error', `The remote server responded with a HTTP ${sessions.axiosSignout.status} status code`);
        }

        return {
          action: 'LOGOUT',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosSignout.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosSignout?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.logout()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'LOGOUT',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSignoutRequestPath = sessions.axiosSignout.request.path;
      const axiosSignoutRequestPathValid = requestPathAccessSignInNetworkIdXxPartnerAdt.test(axiosSignoutRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.logout()', 'info', `Request path ➜ ${axiosSignoutRequestPath}`);
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.logout()', 'info', `Request path valid ➜ ${axiosSignoutRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSignout is not the sign-in page with "networkid" and "partner=adt" parameters.
      if (!axiosSignoutRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.logout()', 'error', `"${axiosSignoutRequestPath}" is not the sign-in page with "networkid" and "partner=adt" parameters`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSignoutRequestPath, sessions.axiosSignout);

        return {
          action: 'LOGOUT',
          success: false,
          info: {
            message: `"${axiosSignoutRequestPath}" is not the sign-in page with "networkid" and "partner=adt" parameters`,
          },
        };
      }

      // Reset the session state for "this instance".
      this.resetSession();

      if (this.#internal.debug) {
        debugLog(
          this.#internal.logger,
          'api.ts / ADTPulse.logout()',
          'success',
          [
            'Logout successful',
            [
              '(',
              [
                `backup sat code: ${this.#session.backupSatCode}`,
                `network id: ${this.#session.networkId}`,
                `portal version: ${this.#session.portalVersion}`,
              ].join(', '),
              ')',
            ].join(''),
          ].join(' '),
        );
      }

      return {
        action: 'LOGOUT',
        success: true,
        info: {
          backupSatCode: this.#session.backupSatCode,
          networkId: this.#session.networkId,
          portalVersion: this.#session.portalVersion,
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.logout()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'LOGOUT',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * ADT Pulse - Get gateway information.
   *
   * @returns {ADTPulseGetGatewayInformationReturns}
   *
   * @since 1.0.0
   */
  public async getGatewayInformation(): ADTPulseGetGatewayInformationReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.getGatewayInformation()', 'info', `Attempting to retrieve gateway information from "${this.#internal.baseUrl}"`);
    }

    try {
      const sessions: ADTPulseGetGatewayInformationSessions = {};

      // sessions.axiosSystemGateway: Load the system gateway page.
      sessions.axiosSystemGateway = await this.#session.httpClient.get<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/system/gateway.jsp`,
        this.getRequestConfig({
          headers: {
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/system/system.jsp`,
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
          },
        }),
      );

      // Check for server error response.
      if (sessions.axiosSystemGateway.status >= 400) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getGatewayInformation()', 'error', `The remote server responded with a HTTP ${sessions.axiosSystemGateway.status} status code`);
        }

        return {
          action: 'GET_GATEWAY_INFORMATION',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosSystemGateway.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosSystemGateway?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getGatewayInformation()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_GATEWAY_INFORMATION',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSystemGatewayRequestPath = sessions.axiosSystemGateway.request.path;
      const axiosSystemGatewayRequestPathValid = requestPathSystemGateway.test(axiosSystemGatewayRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getGatewayInformation()', 'info', `Request path ➜ ${axiosSystemGatewayRequestPath}`);
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getGatewayInformation()', 'info', `Request path valid ➜ ${axiosSystemGatewayRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSystemGateway is not the system gateway page.
      if (!axiosSystemGatewayRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getGatewayInformation()', 'error', `"${axiosSystemGatewayRequestPath}" is not the system gateway page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSystemGatewayRequestPath, sessions.axiosSystemGateway);

        return {
          action: 'GET_GATEWAY_INFORMATION',
          success: false,
          info: {
            message: `"${axiosSystemGatewayRequestPath}" is not the system gateway page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions.axiosSystemGateway.data !== 'string') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getGatewayInformation()', 'error', 'The response body of the system gateway page is not of type "string"');
        }

        return {
          action: 'GET_GATEWAY_INFORMATION',
          success: false,
          info: {
            message: 'The response body of the system gateway page is not of type "string"',
          },
        };
      }

      // sessions.jsdomSystemGateway: Parse the system gateway page.
      sessions.jsdomSystemGateway = new JSDOM(
        sessions.axiosSystemGateway.data,
        {
          url: sessions.axiosSystemGateway.config.url,
          referrer: sessions.axiosSystemGateway.config.headers.Referer,
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * Detailed parsing information for "gatewayInformation".
       *
       * NOTICE: Responses may be inaccurate or missing.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * How the data may be displayed:
       * ➜ <tr>
       *     <td>Manufacturer:</td>
       *     <td>ADT Pulse Gateway</td>
       *   </tr>
       *   <tr>
       *     <td>Model:</td>
       *     <td>1234567890</td>
       *   </tr>
       *
       * Example data after being processed by "fetchTableCells()" function/method:
       * ➜ {
       *     'Manufacturer:': [
       *       'ADT Pulse Gateway',
       *     ],
       *     'Model:': [
       *       '1234567890',
       *     ],
       *   }
       *
       * @since 1.0.0
       */
      const jsdomSystemGatewayTableCells = sessions.jsdomSystemGateway.window.document.querySelectorAll('td');
      const fetchedTableCells = fetchTableCells(
        jsdomSystemGatewayTableCells,
        [
          'Broadband Connection Status:',
          'Broadband LAN IP Address:',
          'Broadband LAN MAC:',
          'Cellular Connection Status:',
          'Cellular Signal Strength:',
          'Device LAN IP Address:',
          'Device LAN MAC:',
          'Firmware Version:',
          'Hardware Version:',
          'Last Update:',
          'Manufacturer:',
          'Model:',
          'Next Update:',
          'Primary Connection Type:',
          'Router LAN IP Address:',
          'Router WAN IP Address:',
          'Serial Number:',
          'Status:',
        ],
        1,
        1,
      );
      const manufacturer = _.get(fetchedTableCells, ['Manufacturer:', 0], null);
      const model = _.get(fetchedTableCells, ['Model:', 0], null);
      const parsedManufacturer = findGatewayManufacturerModel('manufacturer', manufacturer, model);
      const parsedModel = findGatewayManufacturerModel('model', manufacturer, model);
      const gatewayInformation = {
        communication: {
          broadbandConnectionStatus: _.get(fetchedTableCells, ['Broadband Connection Status:', 0], null),
          cellularConnectionStatus: _.get(fetchedTableCells, ['Cellular Connection Status:', 0], null),
          cellularSignalStrength: _.get(fetchedTableCells, ['Cellular Signal Strength:', 0], null),
          primaryConnectionType: _.get(fetchedTableCells, ['Primary Connection Type:', 0], null),
        },
        manufacturer: parsedManufacturer,
        model: parsedModel,
        network: {
          broadband: {
            ip: _.get(fetchedTableCells, ['Broadband LAN IP Address:', 0], null),
            mac: _.get(fetchedTableCells, ['Broadband LAN MAC:', 0], null),
          },
          device: {
            ip: _.get(fetchedTableCells, ['Device LAN IP Address:', 0], null),
            mac: _.get(fetchedTableCells, ['Device LAN MAC:', 0], null),
          },
          router: {
            lanIp: _.get(fetchedTableCells, ['Router LAN IP Address:', 0], null),
            wanIp: _.get(fetchedTableCells, ['Router WAN IP Address:', 0], null),
          },
        },
        serialNumber: _.get(fetchedTableCells, ['Serial Number:', 0], null),
        status: _.get(fetchedTableCells, ['Status:', 0], null) as ADTPulseGetGatewayInformationReturnsStatus,
        update: {
          last: _.get(fetchedTableCells, ['Last Update:', 0], null),
          next: _.get(fetchedTableCells, ['Next Update:', 0], null),
        },
        versions: {
          firmware: _.get(fetchedTableCells, ['Firmware Version:', 0], null),
          hardware: _.get(fetchedTableCells, ['Hardware Version:', 0], null),
        },
      };

      /**
       * Check if "gatewayInformation" needs documenting or testing.
       *
       * NOTICE: Parts NOT SHOWN below will NOT be tracked, documented, or tested.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * status: 'Offline'
       *         'Online'
       *         'Status Unknown'
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('gateway-information', gatewayInformation);

      // Check if the parsing function is parsing data incorrectly.
      await this.newInformationDispatcher('debug-parser', {
        method: 'getGatewayInformation',
        response: fetchedTableCells,
        rawHtml: sessions.axiosSystemGateway.data,
      });

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getGatewayInformation()', 'success', `Successfully retrieved gateway information from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'GET_GATEWAY_INFORMATION',
        success: true,
        info: gatewayInformation,
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.getGatewayInformation()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'GET_GATEWAY_INFORMATION',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * ADT Pulse - Get panel information.
   *
   * @returns {ADTPulseGetPanelInformationReturns}
   *
   * @since 1.0.0
   */
  public async getPanelInformation(): ADTPulseGetPanelInformationReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelInformation()', 'info', `Attempting to retrieve panel information from "${this.#internal.baseUrl}"`);
    }

    try {
      const sessions: ADTPulseGetPanelInformationSessions = {};

      // sessions.axiosSystemDeviceId1: Load the system device id 1 page.
      sessions.axiosSystemDeviceId1 = await this.#session.httpClient.get<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/system/device.jsp?id=1`,
        this.getRequestConfig({
          headers: {
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/system/system.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions.axiosSystemDeviceId1.status >= 400) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelInformation()', 'error', `The remote server responded with a HTTP ${sessions.axiosSystemDeviceId1.status} status code`);
        }

        return {
          action: 'GET_PANEL_INFORMATION',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosSystemDeviceId1.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosSystemDeviceId1?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelInformation()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_PANEL_INFORMATION',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSystemDeviceId1RequestPath = sessions.axiosSystemDeviceId1.request.path;
      const axiosSystemDeviceId1RequestPathValid = requestPathSystemDeviceId1.test(axiosSystemDeviceId1RequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelInformation()', 'info', `Request path ➜ ${axiosSystemDeviceId1RequestPath}`);
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelInformation()', 'info', `Request path valid ➜ ${axiosSystemDeviceId1RequestPathValid}`);
      }

      // If the final URL of sessions.axiosSystemDeviceId1 is not the system device id 1 page.
      if (!axiosSystemDeviceId1RequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelInformation()', 'error', `"${axiosSystemDeviceId1RequestPath}" is not the system device id 1 page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSystemDeviceId1RequestPath, sessions.axiosSystemDeviceId1);

        return {
          action: 'GET_PANEL_INFORMATION',
          success: false,
          info: {
            message: `"${axiosSystemDeviceId1RequestPath}" is not the system device id 1 page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions.axiosSystemDeviceId1.data !== 'string') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelInformation()', 'error', 'The response body of the system device id 1 page is not of type "string"');
        }

        return {
          action: 'GET_PANEL_INFORMATION',
          success: false,
          info: {
            message: 'The response body of the system device id 1 page is not of type "string"',
          },
        };
      }

      // sessions.jsdomSystemDeviceId1: Parse the system device id 1 page.
      sessions.jsdomSystemDeviceId1 = new JSDOM(
        sessions.axiosSystemDeviceId1.data,
        {
          url: sessions.axiosSystemDeviceId1.config.url,
          referrer: sessions.axiosSystemDeviceId1.config.headers.Referer,
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * Detailed parsing information for "panelInformation".
       *
       * NOTICE: Responses may be inaccurate or missing.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * How the data may be displayed:
       * ➜ <tr>
       *     <td>Manufacturer/Provider:</td>
       *     <td>ADT</td>
       *   </tr>
       *   <tr>
       *     <td>Emergency Keys:</td>
       *     <td>
       *       <div>Button:&nbsp;Sample&nbsp;Alarm&nbsp;(Zone&nbsp;99)</div>
       *       <div>Button:&nbsp;Sample&nbsp;Alarm&nbsp;(Zone&nbsp;99)</div>
       *     </td>
       *   </tr>
       *
       * Example data after being processed by "fetchTableCells()" function/method:
       * ➜ {
       *     'Manufacturer/Provider:': [
       *       'ADT Pulse Gateway',
       *     ],
       *     'Emergency Keys:': [
       *       'Button: Sample Alarm (Zone 99) Button: Sample Alarm (Zone 99)',
       *     ],
       *   }
       *
       * @since 1.0.0
       */
      const jsdomSystemDeviceId1TableCells = sessions.jsdomSystemDeviceId1.window.document.querySelectorAll('td');
      const fetchedTableCells = fetchTableCells(
        jsdomSystemDeviceId1TableCells,
        [
          'Emergency Keys:',
          'Manufacturer/Provider:',
          'Security Panel Master Code:',
          'Status:',
          'Type/Model:',
        ],
        1,
        1,
      );
      const emergencyKeys = _.get(fetchedTableCells, ['Emergency Keys:', 0], null);
      const manufacturerProvider = _.get(fetchedTableCells, ['Manufacturer/Provider:', 0], null);
      const typeModel = _.get(fetchedTableCells, ['Type/Model:', 0], null);
      const parsedEmergencyKeys = (emergencyKeys !== null) ? emergencyKeys.match(textPanelEmergencyKeys) : null;
      const parsedManufacturer = findPanelManufacturer(manufacturerProvider, typeModel);
      const parsedType = (typeModel !== null && typeModel.includes(' - ')) ? typeModel.replace(textPanelTypeModel, '$1') : null;
      const parsedModel = (typeModel !== null) ? typeModel.replace(textPanelTypeModel, '$2') : null;
      const panelInformation = {
        emergencyKeys: parsedEmergencyKeys,
        manufacturer: parsedManufacturer,
        masterCode: _.get(fetchedTableCells, ['Security Panel Master Code:', 0], null),
        provider: 'ADT',
        type: parsedType,
        model: parsedModel,
        status: _.get(fetchedTableCells, ['Status:', 0], null) as ADTPulseGetPanelInformationReturnsStatus,
      };

      /**
       * Check if "panelInformation" needs documenting or testing.
       *
       * NOTICE: Parts NOT SHOWN below will NOT be tracked, documented, or tested.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * status: 'Offline'
       *         'Online'
       *         'Status Unknown'
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('panel-information', panelInformation);

      // Check if the parsing function is parsing data incorrectly.
      await this.newInformationDispatcher('debug-parser', {
        method: 'getPanelInformation',
        response: fetchedTableCells,
        rawHtml: sessions.axiosSystemDeviceId1.data,
      });

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelInformation()', 'success', `Successfully retrieved panel information from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'GET_PANEL_INFORMATION',
        success: true,
        info: panelInformation,
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelInformation()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'GET_PANEL_INFORMATION',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * ADT Pulse - Get panel status.
   *
   * @returns {ADTPulseGetPanelStatusReturns}
   *
   * @since 1.0.0
   */
  public async getPanelStatus(): ADTPulseGetPanelStatusReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelStatus()', 'info', `Attempting to retrieve panel status from "${this.#internal.baseUrl}"`);
    }

    try {
      const sessions: ADTPulseGetPanelStatusSessions = {};

      // sessions.axiosSummary: Load the summary page.
      sessions.axiosSummary = await this.#session.httpClient.get<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
        this.getRequestConfig({
          headers: {
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions.axiosSummary.status >= 400) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelStatus()', 'error', `The remote server responded with a HTTP ${sessions.axiosSummary.status} status code`);
        }

        return {
          action: 'GET_PANEL_STATUS',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosSummary.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosSummary?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelStatus()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_PANEL_STATUS',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSummaryRequestPath = sessions.axiosSummary.request.path;
      const axiosSummaryRequestPathValid = requestPathSummarySummary.test(axiosSummaryRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelStatus()', 'info', `Request path ➜ ${axiosSummaryRequestPath}`);
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelStatus()', 'info', `Request path valid ➜ ${axiosSummaryRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSummary is not the summary page.
      if (!axiosSummaryRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelStatus()', 'error', `"${axiosSummaryRequestPath}" is not the summary page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSummaryRequestPath, sessions.axiosSummary);

        return {
          action: 'GET_PANEL_STATUS',
          success: false,
          info: {
            message: `"${axiosSummaryRequestPath}" is not the summary page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions.axiosSummary.data !== 'string') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelStatus()', 'error', 'The response body of the summary page is not of type "string"');
        }

        return {
          action: 'GET_PANEL_STATUS',
          success: false,
          info: {
            message: 'The response body of the summary page is not of type "string"',
          },
        };
      }

      // Recover sat code if it was missing during login.
      if (this.#session.backupSatCode === null) {
        const missingSatCode = fetchMissingSatCode(sessions.axiosSummary);

        if (missingSatCode !== null) {
          if (this.#internal.debug) {
            debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelStatus()', 'success', 'Backup sat code was successfully recovered from previous failed retrieval');
          }

          this.#session.backupSatCode = missingSatCode;
        }
      }

      // sessions.jsdomSummary: Parse the summary page.
      sessions.jsdomSummary = new JSDOM(
        sessions.axiosSummary.data,
        {
          url: sessions.axiosSummary.config.url,
          referrer: sessions.axiosSummary.config.headers.Referer,
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * Detailed parsing information for "panelStatus".
       *
       * NOTICE: Responses may be inaccurate or missing.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * How the data may be displayed:
       * ➜ "Disarmed. All Quiet."
       * ➜ "Status Unavailable. "
       * ➜ "All Quiet."
       * ➜ "Armed Stay. All Quiet. This may take several minutes."
       * ➜ "Armed Stay, No Entry Delay. All Quiet."
       *
       * Example data after being processed by "parseOrbTextSummary()" function/method (excluding "rawData"):
       * ➜ {
       *     panelStates: ['Disarmed'],
       *     panelStatuses: ['All Quiet'],
       *     panelNotes: [],
       *   }
       * ➜ {
       *     panelStates: ['Status Unavailable'],
       *     panelStatuses: [],
       *     panelNotes: [],
       *   }
       * ➜ {
       *     panelStates: [],
       *     panelStatuses: ['All Quiet'],
       *     panelNotes: [],
       *   }
       * ➜ {
       *     panelStates: ['Armed Stay'],
       *     panelStatuses: ['All Quiet'],
       *     panelNotes: ['This may take several minutes'],
       *   }
       * ➜ {
       *     panelStates: ['Armed Stay', 'No Entry Delay'],
       *     panelStatuses: ['All Quiet'],
       *     panelNotes: [],
       *   }
       *
       * @since 1.0.0
       */
      const jsdomSummaryOrbTextSummary = sessions.jsdomSummary.window.document.querySelector('#divOrbTextSummary');
      const parsedOrbTextSummary = parseOrbTextSummary(jsdomSummaryOrbTextSummary);

      /**
       * Check if "panelStatus" needs documenting or testing.
       *
       * NOTICE: Parts NOT SHOWN below will NOT be tracked, documented, or tested.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * state: 'Armed Away'
       *        'Armed Night'
       *        'Armed Stay'
       *        'Disarmed'
       *        'No Entry Delay'
       *        'Status Unavailable'
       *
       * status: '1 Sensor Open'
       *         '[# of sensors open] Sensors Open'
       *         'All Quiet'
       *         'BURGLARY ALARM'
       *         'Carbon Monoxide Alarm'
       *         'FIRE ALARM'
       *         'Motion'
       *         'Sensor Bypassed'
       *         'Sensor Problem'
       *         'Sensor Problems'
       *         'Sensors Bypassed'
       *         'Sensors Tripped'
       *         'Sensor Tripped'
       *         'Uncleared Alarm'
       *         'WATER ALARM'
       *
       * note: 'This may take several minutes'
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('panel-status', parsedOrbTextSummary);

      // Check if the parsing function is parsing data incorrectly.
      await this.newInformationDispatcher('debug-parser', {
        method: 'getPanelStatus',
        response: parsedOrbTextSummary,
        rawHtml: sessions.axiosSummary.data,
      });

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelStatus()', 'success', `Successfully retrieved panel status from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'GET_PANEL_STATUS',
        success: true,
        info: parsedOrbTextSummary,
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.getPanelStatus()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'GET_PANEL_STATUS',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * ADT Pulse - Set panel status.
   *
   * @param {ADTPulseSetPanelStatusArmFrom}       armFrom       - Arm from.
   * @param {ADTPulseSetPanelStatusArmTo}         armTo         - Arm to.
   * @param {ADTPulseSetPanelStatusIsAlarmActive} isAlarmActive - Is alarm active.
   *
   * @returns {ADTPulseSetPanelStatusReturns}
   *
   * @since 1.0.0
   */
  public async setPanelStatus(armFrom: ADTPulseSetPanelStatusArmFrom, armTo: ADTPulseSetPanelStatusArmTo, isAlarmActive: ADTPulseSetPanelStatusIsAlarmActive): ADTPulseSetPanelStatusReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'info', `Attempting to update panel status from "${armFrom}" to "${armTo}" at "${this.#internal.baseUrl}"`);
    }

    if (
      armFrom !== 'away'
      && armFrom !== 'night'
      && armFrom !== 'off'
      && armFrom !== 'stay'
    ) {
      return {
        action: 'SET_PANEL_STATUS',
        success: false,
        info: {
          message: `"${armFrom}" is an invalid arm from state`,
        },
      };
    }

    if (
      armTo !== 'away'
      && armTo !== 'night'
      && armTo !== 'off'
      && armTo !== 'stay'
    ) {
      return {
        action: 'SET_PANEL_STATUS',
        success: false,
        info: {
          message: `"${armTo}" is an invalid arm to state`,
        },
      };
    }

    // Meant for REPL mode, since it doesn't type check during runtime.
    if (typeof isAlarmActive !== 'boolean') {
      return {
        action: 'SET_PANEL_STATUS',
        success: false,
        info: {
          message: 'You must specify if the system\'s alarm is currently ringing (true) or not (false)',
        },
      };
    }

    // If system is being set to the current arm state (e.g. off to off) and alarm is not active.
    if (
      (
        armFrom === 'away'
        && armTo === 'away'
      )
      || (
        armFrom === 'night'
        && armTo === 'night'
      )
      || (
        armFrom === 'stay'
        && armTo === 'stay'
      )
      || (
        armFrom === 'off'
        && armTo === 'off'
        && !isAlarmActive
      )
    ) {
      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'info', `No need to change arm state from "${armFrom}" to "${armTo}" due to its equivalence`);
      }

      return {
        action: 'SET_PANEL_STATUS',
        success: true,
        info: {
          forceArmRequired: false,
        },
      };
    }

    // If alarm is currently ringing.
    if (this.#internal.debug && isAlarmActive) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'warn', `Alarm is currently ringing and arm state is being changed from "${armFrom}" to "${armTo}"`);
    }

    try {
      let isAlarmCurrentlyActive = isAlarmActive;

      // Get the security buttons.
      const securityButtonsResponse = await this.getOrbSecurityButtons();

      if (!securityButtonsResponse.success) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'error', 'An error occurred while retrieving security buttons');
        }

        return {
          action: 'SET_PANEL_STATUS',
          success: false,
          info: securityButtonsResponse.info,
        };
      }

      const securityButtons = securityButtonsResponse.info;

      // Only keep all ready (enabled) orb security buttons.
      let readyButtons = securityButtons.filter((securityButton): securityButton is ADTPulseSetPanelStatusReadyButton => !securityButton.buttonDisabled);

      // Generate "fake" ready buttons if arming tasks become stuck (backup sat code required).
      if (readyButtons.length === 0 && this.#session.backupSatCode !== null) {
        readyButtons = generateFakeReadyButtons(securityButtons, this.#session.isCleanState, {
          relativeUrl: 'quickcontrol/armDisarm.jsp',
          href: 'rest/adt/ui/client/security/setArmState',
          sat: this.#session.backupSatCode,
        });

        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'warn', 'No security buttons were found. Replacing stuck orb security buttons with fake buttons');
          stackTracer('fake-ready-buttons', {
            before: securityButtons,
            after: readyButtons,
          });
        }
      }

      // If arming tasks become stuck, but no backup sat code was available, return an error.
      if (readyButtons.length === 0 && this.#session.backupSatCode === null) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'error', 'No security buttons were found and replacement failed because no backup sat code exists');
        }

        return {
          action: 'SET_PANEL_STATUS',
          success: false,
          info: {
            message: 'No security buttons were found and replacement failed because no backup sat code exists',
          },
        };
      }

      // Make sure there is at least 1 security button available.
      if (readyButtons.length < 1) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'error', 'Security buttons are not found on the summary page');
        }

        return {
          action: 'SET_PANEL_STATUS',
          success: false,
          info: {
            message: 'Security buttons are not found on the summary page',
          },
        };
      }

      // In test mode, system must be disarmed first.
      if (
        this.#internal.testMode.enabled
        && !this.#internal.testMode.isSystemDisarmedBeforeTest
      ) {
        // If system is not disarmed, end the test.
        if (!['off', 'disarmed'].includes(readyButtons[0].urlParams.armState)) {
          if (this.#internal.debug) {
            debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'error', 'Test mode is active and system is not disarmed');
          }

          return {
            action: 'SET_PANEL_STATUS',
            success: false,
            info: {
              message: 'Test mode is active and system is not disarmed',
            },
          };
        }

        // If system is disarmed, set "isSystemDisarmedBeforeTest" to true, so it does not check again.
        this.#internal.testMode.isSystemDisarmedBeforeTest = true;
      }

      // If current arm state is not truly "disarmed" or alarm is currently active, disarm it first.
      while (isAlarmCurrentlyActive || !['off', 'disarmed'].includes(readyButtons[0].urlParams.armState)) {
        // Accessing index 0 is guaranteed, because of the check above.
        const armDisarmResponse = await this.armDisarmHandler(
          isAlarmCurrentlyActive,
          {
            relativeUrl: readyButtons[0].relativeUrl,
            href: readyButtons[0].urlParams.href,
            armState: readyButtons[0].urlParams.armState,
            arm: 'off',
            sat: readyButtons[0].urlParams.sat,
          },
        );

        if (!armDisarmResponse.success) {
          if (this.#internal.debug) {
            debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'error', 'An error occurred in the arm disarm handler (while disarming)');
          }

          return {
            action: 'SET_PANEL_STATUS',
            success: false,
            info: armDisarmResponse.info,
          };
        }

        // Make sure there is at least 1 security button available.
        if (armDisarmResponse.info.readyButtons.length < 1) {
          if (this.#internal.debug) {
            debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'error', 'Arm disarm handler failed to find new security buttons');
          }

          return {
            action: 'SET_PANEL_STATUS',
            success: false,
            info: {
              message: 'Arm disarm handler failed to find new security buttons',
            },
          };
        }

        // Update the ready buttons to the latest known state.
        readyButtons = armDisarmResponse.info.readyButtons;

        // At this point, the alarm should stop ringing, and state should be "Uncleared Alarm".
        if (isAlarmCurrentlyActive) {
          isAlarmCurrentlyActive = false;
        }
      }

      // Track if force arming was required.
      let forceArmRequired = false;

      // Set the arm state based on "armTo" if system is not being disarmed.
      if (armTo !== 'off') {
        // Accessing index 0 is guaranteed, because of the check above.
        const armDisarmResponse = await this.armDisarmHandler(
          false, // At this point, alarm should not be active.
          {
            relativeUrl: readyButtons[0].relativeUrl,
            href: readyButtons[0].urlParams.href,
            armState: readyButtons[0].urlParams.armState, // At this point, "armState" should be "off" or "disarmed".
            arm: armTo,
            sat: readyButtons[0].urlParams.sat,
          },
        );

        if (!armDisarmResponse.success) {
          if (this.#internal.debug) {
            debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'error', 'An error occurred in the arm disarm handler (while arming)');
          }

          return {
            action: 'SET_PANEL_STATUS',
            success: false,
            info: armDisarmResponse.info,
          };
        }

        forceArmRequired = armDisarmResponse.info.forceArmRequired;
      }

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'success', `Successfully updated panel status from "${armFrom}" to "${armTo}" at "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'SET_PANEL_STATUS',
        success: true,
        info: {
          forceArmRequired,
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'SET_PANEL_STATUS',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * ADT Pulse - Get sensors information.
   *
   * @returns {ADTPulseGetSensorsInformationReturns}
   *
   * @since 1.0.0
   */
  public async getSensorsInformation(): ADTPulseGetSensorsInformationReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsInformation()', 'info', `Attempting to retrieve sensors information from "${this.#internal.baseUrl}"`);
    }

    try {
      const sessions: ADTPulseGetSensorsInformationSessions = {};

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
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsInformation()', 'error', `The remote server responded with a HTTP ${sessions.axiosSystem.status} status code`);
        }

        return {
          action: 'GET_SENSORS_INFORMATION',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosSystem.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosSystem?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsInformation()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_SENSORS_INFORMATION',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSystemRequestPath = sessions.axiosSystem.request.path;
      const axiosSystemRequestPathValid = requestPathSystemSystem.test(axiosSystemRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsInformation()', 'info', `Request path ➜ ${axiosSystemRequestPath}`);
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsInformation()', 'info', `Request path valid ➜ ${axiosSystemRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSystem is not the system page.
      if (!axiosSystemRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsInformation()', 'error', `"${axiosSystemRequestPath}" is not the system page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSystemRequestPath, sessions.axiosSystem);

        return {
          action: 'GET_SENSORS_INFORMATION',
          success: false,
          info: {
            message: `"${axiosSystemRequestPath}" is not the system page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions.axiosSystem.data !== 'string') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsInformation()', 'error', 'The response body of the system page is not of type "string"');
        }

        return {
          action: 'GET_SENSORS_INFORMATION',
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
       * Detailed parsing information for "sensorsInformation".
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
       *       deviceId: 2,
       *       deviceType: 'Door/Window Sensor',
       *       name: 'Sensor 1',
       *       status: 'Online',
       *       zone: 1,
       *     },
       *   ]
       *
       * @since 1.0.0
       */
      const jsdomSystemSensorsTable = sessions.jsdomSystem.window.document.querySelectorAll('#systemContentList tr[class^=\'p_row\'] tr.p_listRow');
      const parsedSensorsTable = parseSensorsTable(jsdomSystemSensorsTable);

      /**
       * Check if "sensorsInformation" needs documenting or testing.
       *
       * NOTICE: Parts NOT SHOWN below will NOT be tracked, documented, or tested.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * deviceType: 'Carbon Monoxide Detector'
       *             'Door/Window Sensor'
       *             'Door Sensor'
       *             'Fire (Smoke/Heat) Detector'
       *             'Glass Break Detector'
       *             'Heat (Rate-of-Rise) Detector'
       *             'Motion Sensor'
       *             'Motion Sensor (Notable Events Only)'
       *             'Shock Sensor'
       *             'Temperature Sensor'
       *             'Water/Flood Sensor'
       *             'Window Sensor'
       *
       * status: 'Installing'
       *         'Offline'
       *         'Online'
       *         'Status Unknown'
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('sensors-information', parsedSensorsTable);

      // Check if the parsing function is parsing data incorrectly.
      await this.newInformationDispatcher('debug-parser', {
        method: 'getSensorsInformation',
        response: parsedSensorsTable,
        rawHtml: sessions.axiosSystem.data,
      });

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsInformation()', 'success', `Successfully retrieved sensors information from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'GET_SENSORS_INFORMATION',
        success: true,
        info: {
          rawHtml: sessions.axiosSystem.data,
          sensors: parsedSensorsTable,
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsInformation()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'GET_SENSORS_INFORMATION',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * ADT Pulse - Get sensors status.
   *
   * @returns {ADTPulseGetSensorsStatusReturns}
   *
   * @since 1.0.0
   */
  public async getSensorsStatus(): ADTPulseGetSensorsStatusReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsStatus()', 'info', `Attempting to retrieve sensors status from "${this.#internal.baseUrl}"`);
    }

    try {
      const sessions: ADTPulseGetSensorsStatusSessions = {};

      // sessions.axiosSummary: Load the summary page.
      sessions.axiosSummary = await this.#session.httpClient.get<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
        this.getRequestConfig({
          headers: {
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions.axiosSummary.status >= 400) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsStatus()', 'error', `The remote server responded with a HTTP ${sessions.axiosSummary.status} status code`);
        }

        return {
          action: 'GET_SENSORS_STATUS',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosSummary.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosSummary?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsStatus()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_SENSORS_STATUS',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSummaryRequestPath = sessions.axiosSummary.request.path;
      const axiosSummaryRequestPathValid = requestPathSummarySummary.test(axiosSummaryRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsStatus()', 'info', `Request path ➜ ${axiosSummaryRequestPath}`);
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsStatus()', 'info', `Request path valid ➜ ${axiosSummaryRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSummary is not the summary page.
      if (!axiosSummaryRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsStatus()', 'error', `"${axiosSummaryRequestPath}" is not the summary page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSummaryRequestPath, sessions.axiosSummary);

        return {
          action: 'GET_SENSORS_STATUS',
          success: false,
          info: {
            message: `"${axiosSummaryRequestPath}" is not the summary page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions.axiosSummary.data !== 'string') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsStatus()', 'error', 'The response body of the summary page is not of type "string"');
        }

        return {
          action: 'GET_SENSORS_STATUS',
          success: false,
          info: {
            message: 'The response body of the summary page is not of type "string"',
          },
        };
      }

      // Recover sat code if it was missing during login.
      if (this.#session.backupSatCode === null) {
        const missingSatCode = fetchMissingSatCode(sessions.axiosSummary);

        if (missingSatCode !== null) {
          if (this.#internal.debug) {
            debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsStatus()', 'success', 'Backup sat code was successfully recovered from previous failed retrieval');
          }

          this.#session.backupSatCode = missingSatCode;
        }
      }

      // sessions.jsdomSummary: Parse the summary page.
      sessions.jsdomSummary = new JSDOM(
        sessions.axiosSummary.data,
        {
          url: sessions.axiosSummary.config.url,
          referrer: sessions.axiosSummary.config.headers.Referer,
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * Detailed parsing information for "sensorsStatus".
       *
       * NOTICE: Responses may be inaccurate or missing.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * How the data may be displayed:
       * ➜ <tr>
       *     <td>
       *       <span>
       *         <canvas icon="devStatOK"></canvas>
       *       </span>
       *     </td>
       *     <td>
       *       <img src="/myhome/16.0.0-131/images/spacer.gif">
       *     </td>
       *     <td>
       *       <a class="p_deviceNameText">Sensor 1</a>
       *       &nbsp;
       *       <span class="p_grayNormalText">Zone&nbsp;1</div>
       *     </td>
       *     <td>
       *       Closed&nbsp;
       *     </td>
       *   </tr>
       * ➜ <tr>
       *     <td>
       *       <span>
       *         <canvas icon="devStatMotion"></canvas>
       *       </span>
       *     </td>
       *     <td>
       *       <img src="/myhome/16.0.0-131/images/spacer.gif">
       *     </td>
       *     <td>
       *       <a class="p_deviceNameText">Sensor 2</a>
       *       &nbsp;
       *       <div class="p_grayNormalText">Zone&nbsp;2</div>
       *     </td>
       *     <td>
       *       Motion&nbsp;
       *     </td>
       *   </tr>
       *
       * Example data after being processed by "parseOrbSensors()" function/method:
       * ➜ [
       *     {
       *       icon: 'devStatOK',
       *       name: 'Sensor 1',
       *       status: 'Closed',
       *       zone: 1,
       *     },
       *   ]
       * ➜ [
       *     {
       *       icon: 'devStatMotion',
       *       name: 'Sensor 2',
       *       status: 'Motion',
       *       zone: 2,
       *     },
       *   ]
       *
       * @since 1.0.0
       */
      const jsdomSummaryOrbSensors = sessions.jsdomSummary.window.document.querySelectorAll('#orbSensorsList tr.p_listRow');
      const parsedOrbSensors = parseOrbSensors(jsdomSummaryOrbSensors);

      /**
       * Check if "sensorsStatus" needs documenting or testing.
       *
       * NOTICE: Parts NOT SHOWN below will NOT be tracked, documented, or tested.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * icon: 'devStatAlarm'
       *       'devStatInstalling'
       *       'devStatLowBatt'
       *       'devStatMotion'
       *       'devStatOffline'
       *       'devStatOK'
       *       'devStatOpen'
       *       'devStatTamper'
       *       'devStatUnknown'
       *
       * status: 'ALARM'
       *         'Bypassed'
       *         'Closed'
       *         'Installing'
       *         'Low Battery'
       *         'Motion'
       *         'No Motion'
       *         'Offline'
       *         'Okay'
       *         'Open'
       *         'Tripped'
       *         'Trouble'
       *         'Unknown'
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('sensors-status', parsedOrbSensors);

      // Check if the parsing function is parsing data incorrectly.
      await this.newInformationDispatcher('debug-parser', {
        method: 'getSensorsStatus',
        response: parsedOrbSensors,
        rawHtml: sessions.axiosSummary.data,
      });

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsStatus()', 'success', `Successfully retrieved sensors status from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'GET_SENSORS_STATUS',
        success: true,
        info: {
          rawHtml: sessions.axiosSummary.data,
          sensors: parsedOrbSensors,
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsStatus()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'GET_SENSORS_STATUS',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * ADT Pulse - Get orb security buttons.
   *
   * @returns {ADTPulseGetOrbSecurityButtonsReturns}
   *
   * @since 1.0.0
   */
  public async getOrbSecurityButtons(): ADTPulseGetOrbSecurityButtonsReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.getOrbSecurityButtons()', 'info', `Attempting to retrieve orb security buttons from "${this.#internal.baseUrl}"`);
    }

    try {
      const sessions: ADTPulseGetOrbSecurityButtonsSessions = {};

      // sessions.axiosSummary: Load the summary page.
      sessions.axiosSummary = await this.#session.httpClient.get<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
        this.getRequestConfig({
          headers: {
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions.axiosSummary.status >= 400) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getOrbSecurityButtons()', 'error', `The remote server responded with a HTTP ${sessions.axiosSummary.status} status code`);
        }

        return {
          action: 'GET_ORB_SECURITY_BUTTONS',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosSummary.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosSummary?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getOrbSecurityButtons()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_ORB_SECURITY_BUTTONS',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSummaryRequestPath = sessions.axiosSummary.request.path;
      const axiosSummaryRequestPathValid = requestPathSummarySummary.test(axiosSummaryRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getOrbSecurityButtons()', 'info', `Request path ➜ ${axiosSummaryRequestPath}`);
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getOrbSecurityButtons()', 'info', `Request path valid ➜ ${axiosSummaryRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSummary is not the summary page.
      if (!axiosSummaryRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getOrbSecurityButtons()', 'error', `"${axiosSummaryRequestPath}" is not the summary page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSummaryRequestPath, sessions.axiosSummary);

        return {
          action: 'GET_ORB_SECURITY_BUTTONS',
          success: false,
          info: {
            message: `"${axiosSummaryRequestPath}" is not the summary page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions.axiosSummary.data !== 'string') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.getOrbSecurityButtons()', 'error', 'The response body of the summary page is not of type "string"');
        }

        return {
          action: 'GET_ORB_SECURITY_BUTTONS',
          success: false,
          info: {
            message: 'The response body of the summary page is not of type "string"',
          },
        };
      }

      // Recover sat code if it was missing during login.
      if (this.#session.backupSatCode === null) {
        const missingSatCode = fetchMissingSatCode(sessions.axiosSummary);

        if (missingSatCode !== null) {
          if (this.#internal.debug) {
            debugLog(this.#internal.logger, 'api.ts / ADTPulse.getOrbSecurityButtons()', 'success', 'Backup sat code was successfully recovered from previous failed retrieval');
          }

          this.#session.backupSatCode = missingSatCode;
        }
      }

      // sessions.jsdomSummary: Parse the summary page.
      sessions.jsdomSummary = new JSDOM(
        sessions.axiosSummary.data,
        {
          url: sessions.axiosSummary.config.url,
          referrer: sessions.axiosSummary.config.headers.Referer,
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * Detailed parsing information for "orbSecurityButtons".
       *
       * NOTICE: Responses may be inaccurate or missing.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * How the data may be displayed:
       * ➜ <input id="security_button_1" value="Arm Stay" onclick="setArmState('quickcontrol/armDisarm.jsp','Arming Stay','1','2','false','href=rest/adt/ui/client/security/setArmState&amp;armstate=off&amp;arm=stay&amp;sat=21580428-e539-4075-8237-5c58b6c6fec8')">
       * ➜ <input id="security_button_1" value="Arming Stay" disabled="">
       *
       * Example data after being processed by "parseOrbSecurityButtons()" function/method:
       * ➜ [
       *     {
       *       buttonDisabled: false,
       *       buttonId: 'security_button_1',
       *       buttonIndex: 1,
       *       buttonText: 'Arm Stay',
       *       changeAccessCode: false,
       *       loadingText: 'Arming Stay',
       *       relativeUrl: 'quickcontrol/armDisarm.jsp',
       *       totalButtons: 2,
       *       urlParams: {
       *         arm: 'stay',
       *         armState: 'off',
       *         href: 'rest/adt/ui/client/security/setArmState',
       *         sat: '21580428-e539-4075-8237-5c58b6c6fec8',
       *       },
       *     },
       *   ]
       * ➜ [
       *     {
       *       buttonDisabled: true,
       *       buttonId: 'security_button_1',
       *       buttonText: 'Arming Stay',
       *     },
       *   ]
       *
       * Notes I've gathered during the process:
       * - After disarming, "armState" will be set to "disarmed". It will be set to "off" after re-login.¹
       * - After turning off siren, "armState" will be set to "disarmed+with+alarm". It will be set to "disarmed_with_alarm" after re-login.¹²
       * - After arming night, "armState" will be set to "night+stay". It will be set to "night" after re-login.¹
       * - The "sat" code is required for all arm/disarm actions (UUID, generated on every login).
       * - If "armState" is not "off" or "disarmed", you must disarm first before setting to other modes.
       *
       * Footnotes:
       * ¹ States are synced across an entire site (per home). If one account arms, every user signed in during that phase becomes "dirty".
       * ² Turning off siren means system is in "Uncleared Alarm" mode, not truly "Disarmed" mode.
       *
       * @since 1.0.0
       */
      const jsdomSummaryOrbSecurityButtons = sessions.jsdomSummary.window.document.querySelectorAll('#divOrbSecurityButtons input');
      const parsedOrbSecurityButtons = parseOrbSecurityButtons(jsdomSummaryOrbSecurityButtons);

      /**
       * Check if "orbSecurityButtons" needs documenting or testing.
       *
       * NOTICE: Parts NOT SHOWN below will NOT be tracked, documented, or tested.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * buttonText: 'Arm Away'
       *             'Arm Night'
       *             'Arm Stay'
       *             'Clear Alarm'
       *             'Disarm'
       *
       * loadingText: 'Arming Away'
       *              'Arming Night'
       *              'Arming Stay'
       *              'Disarming'
       *
       * relativeUrl: 'quickcontrol/armDisarm.jsp'
       *
       * urlParams.arm: 'away'
       *                'night'
       *                'off'
       *                'stay'
       *
       * urlParams.armState: 'away'
       *                     'disarmed'
       *                     'disarmed_with_alarm'
       *                     'disarmed+with+alarm'
       *                     'night'
       *                     'night+stay'
       *                     'off'
       *                     'stay'
       *
       * urlParams.href: 'rest/adt/ui/client/security/setArmState'
       *
       * Notes I've gathered during the process:
       * - When a button is in pending (disabled) state, the "buttonText" will be the "loadingText".
       * - Currently, "disarmed+with+alarm" and "night+stay" are considered dirty states.
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('orb-security-buttons', parsedOrbSecurityButtons);

      // Check if the parsing function is parsing data incorrectly.
      await this.newInformationDispatcher('debug-parser', {
        method: 'getOrbSecurityButtons',
        response: parsedOrbSecurityButtons,
        rawHtml: sessions.axiosSummary.data,
      });

      // "armState" can be dirty without the plugin changing the state itself. Most likely when multiple users are logged in.
      this.#session.isCleanState = isSessionCleanState(parsedOrbSecurityButtons);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getOrbSecurityButtons()', 'success', `Successfully retrieved orb security buttons from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'GET_ORB_SECURITY_BUTTONS',
        success: true,
        info: parsedOrbSecurityButtons,
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.getOrbSecurityButtons()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'GET_ORB_SECURITY_BUTTONS',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * ADT Pulse - Perform sync check.
   *
   * @returns {ADTPulsePerformSyncCheckReturns}
   *
   * @since 1.0.0
   */
  public async performSyncCheck(): ADTPulsePerformSyncCheckReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.performSyncCheck()', 'info', `Attempting to perform a sync check from "${this.#internal.baseUrl}"`);
    }

    try {
      const sessions: ADTPulsePerformSyncCheckSessions = {};

      // sessions.axiosSyncCheck: Load the sync check page.
      sessions.axiosSyncCheck = await this.#session.httpClient.get<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/Ajax/SyncCheckServ?t=${Date.now()}`,
        this.getRequestConfig({
          headers: {
            Accept: '*/*',
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
            'Upgrade-Insecure-Requests': undefined,
          },
        }),
      );

      // Check for server error response.
      if (sessions.axiosSyncCheck.status >= 400) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.performSyncCheck()', 'error', `The remote server responded with a HTTP ${sessions.axiosSyncCheck.status} status code`);
        }

        return {
          action: 'PERFORM_SYNC_CHECK',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosSyncCheck.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosSyncCheck?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.performSyncCheck()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'PERFORM_SYNC_CHECK',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const syncCheckRequestPath = sessions.axiosSyncCheck.request.path;
      const syncCheckRequestPathValid = requestPathAjaxSyncCheckServTXx.test(syncCheckRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.performSyncCheck()', 'info', `Request path ➜ ${syncCheckRequestPath}`);
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.performSyncCheck()', 'info', `Request path valid ➜ ${syncCheckRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSyncCheck is not the sync check page.
      if (!syncCheckRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.performSyncCheck()', 'error', `"${syncCheckRequestPath}" is not the sync check page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(syncCheckRequestPath, sessions.axiosSyncCheck);

        return {
          action: 'PERFORM_SYNC_CHECK',
          success: false,
          info: {
            message: `"${syncCheckRequestPath}" is not the sync check page`,
          },
        };
      }

      // Make sure we are able to pass on the response data.
      if (typeof sessions.axiosSyncCheck.data !== 'string') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.performSyncCheck()', 'error', 'The response body of the sync check page is not of type "string"');
        }

        return {
          action: 'PERFORM_SYNC_CHECK',
          success: false,
          info: {
            message: 'The response body of the sync check page is not of type "string"',
          },
        };
      }

      // Make sure the sync code is valid.
      if (!isPortalSyncCode(sessions.axiosSyncCheck.data)) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.performSyncCheck()', 'error', 'The sync code structure is invalid');
        }

        return {
          action: 'PERFORM_SYNC_CHECK',
          success: false,
          info: {
            message: 'The sync code structure is invalid',
          },
        };
      }

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.performSyncCheck()', 'success', `Successfully performed a sync check from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'PERFORM_SYNC_CHECK',
        success: true,
        info: {
          /**
           * A breakdown of the responses when parsing the "syncCheckServ" response body.
           *
           * NOTE: Responses may be inaccurate or missing.
           * LINK: https://patents.google.com/patent/US20170070361A1/en
           *
           * - 1-0-0
           * - 2-0-0
           * - [integer]-0-0
           * - [integer]-[integer]-0
           *
           * @since 1.0.0
           */
          syncCode: sessions.axiosSyncCheck.data,
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.performSyncCheck()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'PERFORM_SYNC_CHECK',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * ADT Pulse - Perform keep alive.
   *
   * @returns {ADTPulsePerformKeepAliveReturns}
   *
   * @since 1.0.0
   */
  public async performKeepAlive(): ADTPulsePerformKeepAliveReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.performKeepAlive()', 'info', `Attempting to perform a keep alive from "${this.#internal.baseUrl}"`);
    }

    try {
      const sessions: ADTPulsePerformKeepAliveSessions = {};

      // sessions.axiosKeepAlive: Load the keep alive page.
      sessions.axiosKeepAlive = await this.#session.httpClient.post<unknown>(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/KeepAlive`,
        '',
        this.getRequestConfig({
          headers: {
            Accept: '*/*',
            'Content-type': 'application/x-www-form-urlencoded',
            Origin: this.#internal.baseUrl,
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
            'Upgrade-Insecure-Requests': undefined,
            'x-dtpc': generateDynatracePCHeaderValue('keep-alive'),
          },
        }),
      );

      // Check for server error response.
      if (sessions.axiosKeepAlive.status >= 400) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.performKeepAlive()', 'error', `The remote server responded with a HTTP ${sessions.axiosKeepAlive.status} status code`);
        }

        return {
          action: 'PERFORM_KEEP_ALIVE',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosKeepAlive.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosKeepAlive?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.performKeepAlive()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'PERFORM_KEEP_ALIVE',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosKeepAliveRequestPath = sessions.axiosKeepAlive.request.path;
      const axiosKeepAliveRequestPathValid = requestPathKeepAlive.test(axiosKeepAliveRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.performKeepAlive()', 'info', `Request path ➜ ${axiosKeepAliveRequestPath}`);
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.performKeepAlive()', 'info', `Request path valid ➜ ${axiosKeepAliveRequestPathValid}`);
      }

      // If the final URL of sessions.axiosKeepAlive is not the keep alive page.
      if (!axiosKeepAliveRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.performKeepAlive()', 'error', `"${axiosKeepAliveRequestPath}" is not the keep alive page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosKeepAliveRequestPath, sessions.axiosKeepAlive);

        return {
          action: 'PERFORM_KEEP_ALIVE',
          success: false,
          info: {
            message: `"${axiosKeepAliveRequestPath}" is not the keep alive page`,
          },
        };
      }

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.performKeepAlive()', 'success', `Successfully performed a keep alive from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'PERFORM_KEEP_ALIVE',
        success: true,
        info: null,
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.performKeepAlive()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'PERFORM_KEEP_ALIVE',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * ADT Pulse - Is authenticated.
   *
   * @returns {ADTPulseIsAuthenticatedReturns}
   *
   * @since 1.0.0
   */
  public isAuthenticated(): ADTPulseIsAuthenticatedReturns {
    return this.#session.isAuthenticated;
  }

  /**
   * ADT Pulse - Reset session.
   *
   * @returns {ADTPulseResetSessionReturns}
   *
   * @since 1.0.0
   */
  public resetSession(): ADTPulseResetSessionReturns {
    this.#session = {
      backupSatCode: null,
      httpClient: wrapper(axios.create({
        jar: new CookieJar(),
        validateStatus: () => true,
      })),
      isAuthenticated: false,
      isCleanState: true,
      networkId: null,
      portalVersion: null,
    };
  }

  /**
   * ADT Pulse - Arm disarm handler.
   *
   * @param {ADTPulseArmDisarmHandlerIsAlarmActive} isAlarmActive - Is alarm active.
   * @param {ADTPulseArmDisarmHandlerOptions}       options       - Options.
   *
   * @private
   *
   * @returns {ADTPulseArmDisarmHandlerReturns}
   *
   * @since 1.0.0
   */
  private async armDisarmHandler(isAlarmActive: ADTPulseArmDisarmHandlerIsAlarmActive, options: ADTPulseArmDisarmHandlerOptions): ADTPulseArmDisarmHandlerReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'info', `Attempting to update arm state from "${options.armState}" to "${options.arm}" on "${this.#internal.baseUrl}"`);
    }

    // If system is being set to the current arm state (e.g. disarmed to off) and alarm is not active.
    if (
      (
        options.armState === 'away'
        && options.arm === 'away'
      )
      || (
        (
          options.armState === 'night'
          || options.armState === 'night+stay'
        )
        && options.arm === 'night'
      )
      || (
        options.armState === 'stay'
        && options.arm === 'stay'
      )
      || (
        (
          options.armState === 'disarmed'
          || options.armState === 'off'
        )
        && options.arm === 'off'
        && !isAlarmActive
      )
    ) {
      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'info', `No need to change arm state from "${options.armState}" to "${options.arm}" due to its equivalence`);
      }

      return {
        action: 'ARM_DISARM_HANDLER',
        success: true,
        info: {
          forceArmRequired: false,
          readyButtons: [],
        },
      };
    }

    try {
      const sessions: ADTPulseArmDisarmHandlerSessions = {};

      // Build an "application/x-www-form-urlencoded" form for use with arming and disarming.
      const armDisarmForm = new URLSearchParams();
      armDisarmForm.append('href', options.href);
      armDisarmForm.append('armstate', options.armState);
      armDisarmForm.append('arm', options.arm);
      armDisarmForm.append('sat', options.sat);

      // sessions.axiosSetArmMode: Emulate an arm state update request.
      sessions.axiosSetArmMode = await this.#session.httpClient.post<unknown>(
        /**
         * A breakdown of the links to set arm mode.
         *
         * NOTE: Responses may be inaccurate or missing.
         * LINK: https://patents.google.com/patent/US20170070361A1/en
         *
         * - When "Disarmed" mode:
         *   - Clicking the "Arm Away" button:
         *     - Clean mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=off&arm=away&sat=<sat>
         *     - Dirty mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=disarmed&arm=away&sat=<sat>
         *   - Clicking the "Arm Stay" button:
         *     - Clean mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=off&arm=stay&sat=<sat>
         *     - Dirty mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=disarmed&arm=stay&sat=<sat>
         *   - Clicking the "Arm Night" button:
         *     - Clean mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=off&arm=night&sat=<sat>
         *     - Dirty mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=disarmed&arm=night&sat=<sat>
         *
         * - When "Armed Away" mode:
         *   - Clicking the "Disarm" button:
         *     - Clean mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=away&arm=off&sat=<sat>
         *     - Dirty mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=away&arm=off&sat=<sat>
         *
         * - When "Armed Stay" mode:
         *   - Clicking the "Disarm" button:
         *     - Clean mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=stay&arm=off&sat=<sat>
         *     - Dirty mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=stay&arm=off&sat=<sat>
         *
         * - When "Armed Night" mode:
         *   - Clicking the "Disarm" button:
         *     - Clean mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=night&arm=off&sat=<sat>
         *     - Dirty mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=night+stay&arm=off&sat=<sat>
         *
         * - When alarm is triggered (when siren is SCREAMING REALLY LOUD):
         *   - Clicking the "Disarm" button when "Armed Away":
         *     - Clean mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=away&arm=off&sat=<sat>
         *     - Dirty mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=away&arm=off&sat=<sat>
         *   - Clicking the "Disarm" button when "Armed Stay":
         *     - Clean mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=stay&arm=off&sat=<sat>
         *     - Dirty mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=stay&arm=off&sat=<sat>
         *   - Clicking the "Disarm" button when "Armed Night":
         *     - Clean mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=night&arm=off&sat=<sat>
         *     - Dirty mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=night+stay&arm=off&sat=<sat>
         *
         * - When alarm is triggered (when siren is done screaming):
         *   - Clicking the "Clear Alarm" button:
         *     - Clean mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=disarmed_with_alarm&arm=off&sat=<sat>
         *     - Dirty mode: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=disarmed+with+alarm&arm=off&sat=<sat>
         *
         * Notes I've gathered during the process:
         * - States are synced across an entire site (per home). If one account arms, every user signed in during that phase becomes "dirty"
         * - When arming and disarming in the portal, POST requests are made. However, GET requests still work when URL is pasted in.
         *
         * @since 1.0.0
         */
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/${options.relativeUrl}`,
        armDisarmForm,
        this.getRequestConfig({
          headers: {
            'Cache-Control': 'max-age=0',
            'Content-Type': 'application/x-www-form-urlencoded',
            Origin: this.#internal.baseUrl,
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
            'Sec-Fetch-Dest': 'iframe',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
          },
        }),
      );

      // Check for server error response.
      if (sessions.axiosSetArmMode.status >= 400) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'error', `The remote server responded with a HTTP ${sessions.axiosSetArmMode.status} status code`);
        }

        return {
          action: 'ARM_DISARM_HANDLER',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions.axiosSetArmMode.status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosSetArmMode?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'ARM_DISARM_HANDLER',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSetArmModeRequestPath = sessions.axiosSetArmMode.request.path;
      const axiosSetArmModeRequestPathValid = requestPathQuickControlArmDisarm.test(axiosSetArmModeRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'info', `Request path ➜ ${axiosSetArmModeRequestPath}`);
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'info', `Request path valid ➜ ${axiosSetArmModeRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSetArmMode is not the arm disarm page.
      if (!axiosSetArmModeRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'error', `"${axiosSetArmModeRequestPath}" is not the arm disarm page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSetArmModeRequestPath, sessions.axiosSetArmMode);

        return {
          action: 'ARM_DISARM_HANDLER',
          success: false,
          info: {
            message: `"${axiosSetArmModeRequestPath}" is not the arm disarm page`,
          },
        };
      }

      // Track if force arming was required.
      let forceArmRequired = false;

      // No need to force arm if system is not being set to arm.
      if (options.arm !== 'off') {
        // Passing the force arming task to the handler.
        const forceArmResponse = await this.forceArmHandler(sessions.axiosSetArmMode, options.relativeUrl);

        if (!forceArmResponse.success) {
          if (this.#internal.debug) {
            debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'error', 'An error occurred in the force arm handler');
          }

          return {
            action: 'ARM_DISARM_HANDLER',
            success: false,
            info: forceArmResponse.info,
          };
        }

        forceArmRequired = forceArmResponse.info.forceArmRequired;
      }

      // Allow some time for the security orb buttons to refresh.
      await sleep(this.#internal.waitTimeAfterArm);

      // Get the security buttons.
      const securityButtonsResponse = await this.getOrbSecurityButtons();

      if (!securityButtonsResponse.success) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'error', 'An error occurred while retrieving security buttons');
        }

        return {
          action: 'ARM_DISARM_HANDLER',
          success: false,
          info: securityButtonsResponse.info,
        };
      }

      const securityButtons = securityButtonsResponse.info;

      let readyButtons = securityButtons.filter((securityButton): securityButton is ADTPulseArmDisarmHandlerReadyButton => !securityButton.buttonDisabled);

      // Generate "fake" ready buttons if arming tasks become stuck.
      if (readyButtons.length === 0) {
        readyButtons = generateFakeReadyButtons(securityButtons, this.#session.isCleanState, {
          relativeUrl: options.relativeUrl,
          href: options.href,
          sat: options.sat,
        });

        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'warn', 'No security buttons were found. Replacing stuck orb security buttons with fake buttons');
          stackTracer('fake-ready-buttons', {
            before: securityButtons,
            after: readyButtons,
          });
        }
      }

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'success', `Successfully updated arm state from "${options.armState}" to "${options.arm}" on "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'ARM_DISARM_HANDLER',
        success: true,
        info: {
          forceArmRequired,
          readyButtons,
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'ARM_DISARM_HANDLER',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * ADT Pulse - Force arm handler.
   *
   * @param {ADTPulseForceArmHandlerResponse}    response    - Response.
   * @param {ADTPulseForceArmHandlerRelativeUrl} relativeUrl - Relative url.
   *
   * @private
   *
   * @returns {ADTPulseForceArmHandlerReturns}
   *
   * @since 1.0.0
   */
  private async forceArmHandler(response: ADTPulseForceArmHandlerResponse, relativeUrl: ADTPulseForceArmHandlerRelativeUrl): ADTPulseForceArmHandlerReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.forceArmHandler()', 'info', `Attempting to force arm on "${this.#internal.baseUrl}"`);
    }

    try {
      const sessions: ADTPulseForceArmHandlerSessions = {};

      // Make sure we are able to use JSDOM on the response data.
      if (typeof response.data !== 'string') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.forceArmHandler()', 'error', 'The response body of the arm disarm page is not of type "string"');
        }

        return {
          action: 'FORCE_ARM_HANDLER',
          success: false,
          info: {
            message: 'The response body of the arm disarm page is not of type "string"',
          },
        };
      }

      // sessions.jsdomArmDisarm: Parse the arm disarm page.
      sessions.jsdomArmDisarm = new JSDOM(
        response.data,
        {
          url: response.config.url,
          referrer: response.config.headers.Referer,
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * Detailed parsing information for "doSubmitHandlers".
       *
       * NOTICE: Responses may be inaccurate or missing.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * How the data may be displayed:
       * ➜ <input onclick="doSubmit( '/myhome/16.0.0-131/quickcontrol/serv/RunRRACommand?sat=f8e7c824-a88c-4fd2-ad4d-9b4b69039b09&href=rest\/adt\/ui\/client\/security\/setForceArm&armstate=forcearm&arm=stay' )">
       * ➜ <input onclick="doSubmit( '/myhome/16.0.0-131/quickcontrol/serv/RunRRACommand?sat=f8e7c824-a88c-4fd2-ad4d-9b4b69039b09&href=rest\/adt\/ui\/client\/security\/setCancelProtest' )">
       *
       * Example data after being processed by "parseDoSubmitHandlers()" function/method:
       * ➜ [
       *     {
       *       relativeUrl: '/myhome/16.0.0-131/quickcontrol/serv/RunRRACommand',
       *       urlParams: {
       *         arm: 'stay',
       *         armState: 'forcearm',
       *         href: 'rest/adt/ui/client/security/setForceArm',
       *         sat: 'f8e7c824-a88c-4fd2-ad4d-9b4b69039b09',
       *       },
       *     },
       *   ]
       * ➜ [
       *    {
       *       relativeUrl: '/myhome/16.0.0-131/quickcontrol/serv/RunRRACommand',
       *       urlParams: {
       *         arm: null,
       *         armState: null,
       *         href: 'rest/adt/ui/client/security/setCancelProtest',
       *         sat: 'f8e7c824-a88c-4fd2-ad4d-9b4b69039b09',
       *       },
       *     },
       *   ]
       *
       * Notes I've gathered during the process:
       * - The "sat" code is required for all force arm actions (UUID, generated on every login).
       *
       * @since 1.0.0
       */
      const jsdomArmDisarmDoSubmitHandlers = sessions.jsdomArmDisarm.window.document.querySelectorAll('.p_whiteBoxMiddleCenter .p_armDisarmWrapper input');
      const jsdomArmDisarmArmDisarmMessage = sessions.jsdomArmDisarm.window.document.querySelector('.p_armDisarmWrapper div:first-child');
      const parsedArmDisarmMessage = parseArmDisarmMessage(jsdomArmDisarmArmDisarmMessage);
      const parsedDoSubmitHandlers = parseDoSubmitHandlers(jsdomArmDisarmDoSubmitHandlers);

      /**
       * Check if "doSubmitHandlers" needs documenting or testing.
       *
       * NOTICE: Parts NOT SHOWN below will NOT be tracked, documented, or tested.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * relativeUrl: '/myhome/16.0.0-131/quickcontrol/serv/RunRRACommand'
       *
       * urlParams.arm: 'away'
       *                'night'
       *                'stay'
       *
       * urlParams.armState: 'forcearm'
       *
       * urlParams.href: 'rest/adt/ui/client/security/setForceArm'
       *                 'rest/adt/ui/client/security/setCancelProtest'
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('do-submit-handlers', parsedDoSubmitHandlers);

      // Check if the parsing function is parsing data incorrectly.
      await this.newInformationDispatcher('debug-parser', {
        method: 'forceArmHandler',
        response: parsedDoSubmitHandlers,
        rawHtml: response.data,
      });

      // Check if there are no force arm buttons available.
      if (parsedDoSubmitHandlers.length === 0) {
        // In test mode, system must detect at least 1 door or window open.
        if (this.#internal.testMode.enabled) {
          if (this.#internal.debug) {
            debugLog(this.#internal.logger, 'api.ts / ADTPulse.forceArmHandler()', 'error', 'Test mode is active but no doors or windows were open');
          }

          return {
            action: 'FORCE_ARM_HANDLER',
            success: false,
            info: {
              message: 'Test mode is active but no doors or windows were open',
            },
          };
        }

        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.forceArmHandler()', 'info', 'Force arming not required');
        }

        return {
          action: 'FORCE_ARM_HANDLER',
          success: true,
          info: {
            forceArmRequired: false,
          },
        };
      }

      // Helps track the latest force arming response because the use of the loop.
      const tracker: ADTPulseForceArmHandlerTracker = {
        complete: false,
        errorMessage: null,
        requestUrl: null,
      };

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.forceArmHandler()', 'warn', `Portal message ➜ "${parsedArmDisarmMessage}"`);
      }

      // Purpose of this loop is to determine the correct button position for force arming.
      for (let i = 0; i < parsedDoSubmitHandlers.length; i += 1) {
        const forceArmRelativeUrl = parsedDoSubmitHandlers[i].relativeUrl;
        const forceArmSat = parsedDoSubmitHandlers[i].urlParams.sat;
        const forceArmHref = parsedDoSubmitHandlers[i].urlParams.href;
        const forceArmArmState = parsedDoSubmitHandlers[i].urlParams.armState;
        const forceArmArm = parsedDoSubmitHandlers[i].urlParams.arm;

        if (
          (
            tracker.complete // If force arm already completed.
            && tracker.errorMessage === null // If there is no error message.
          )
          || forceArmArmState === null // If "armState" does not exist, it is not an "Arm Anyway" button.
          || forceArmArm === null // If "arm" does not exist, it is not an "Arm Anyway" button.
        ) {
          continue;
        }

        // Build an "application/x-www-form-urlencoded" form for use with force arming.
        const forceArmForm = new URLSearchParams();
        forceArmForm.append('sat', forceArmSat);
        forceArmForm.append('href', forceArmHref);
        forceArmForm.append('armstate', forceArmArmState);
        forceArmForm.append('arm', forceArmArm);

        // sessions.axiosForceArm: Emulate a force arm state update request.
        sessions.axiosForceArm = await this.#session.httpClient.post<unknown>(
          /**
           * A breakdown of the links to force set arm mode.
           *
           * NOTE: Responses may be inaccurate or missing.
           * LINK: https://patents.google.com/patent/US20170070361A1/en
           *
           * - When trying to "Arm Away":
           *   - "Arm Anyway" button link: https://<subdomain>.adtpulse.com<relativeUrl>?sat=<sat>&href=<href>&armstate=forcearm&arm=away
           *   - "Cancel" button link:     https://<subdomain>.adtpulse.com<relativeUrl>?sat=<sat>&href=<href>
           * - When trying to "Arm Stay":
           *   - "Arm Anyway" button link: https://<subdomain>.adtpulse.com<relativeUrl>?sat=<sat>&href=<href>&armstate=forcearm&arm=stay
           *   - "Cancel" button link:     https://<subdomain>.adtpulse.com<relativeUrl>?sat=<sat>&href=<href>
           * - When trying to "Arm Night":
           *   - "Arm Anyway" button link: https://<subdomain>.adtpulse.com<relativeUrl>?sat=<sat>&href=<href>&armstate=forcearm&arm=night
           *   - "Cancel" button link:     https://<subdomain>.adtpulse.com<relativeUrl>?sat=<sat>&href=<href>
           *
           * Notes I've gathered during the process:
           * - When arming and disarming in the portal, POST requests are made. However, GET requests still work when URL is pasted in.
           *
           * @since 1.0.0
           */
          this.#internal.baseUrl + forceArmRelativeUrl,
          forceArmForm,
          this.getRequestConfig({
            headers: {
              Accept: '*/*',
              'Content-type': 'application/x-www-form-urlencoded',
              Origin: this.#internal.baseUrl,
              Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/${relativeUrl}`,
              'Sec-Fetch-Dest': 'empty',
              'Sec-Fetch-Mode': 'cors',
              'Sec-Fetch-Site': 'same-origin',
              'Sec-Fetch-User': undefined,
              'x-dtpc': generateDynatracePCHeaderValue('force-arm'),
            },
          }),
        );

        // Check for server error response.
        if (sessions.axiosForceArm.status >= 400) {
          if (this.#internal.debug) {
            debugLog(this.#internal.logger, 'api.ts / ADTPulse.forceArmHandler()', 'error', `The remote server responded with a HTTP ${sessions.axiosForceArm.status} status code`);
          }

          return {
            action: 'FORCE_ARM_HANDLER',
            success: false,
            info: {
              message: `The remote server responded with a HTTP ${sessions.axiosForceArm.status} status code`,
            },
          };
        }

        // If the "ClientRequest" object does not exist in the Axios response.
        if (typeof sessions.axiosForceArm?.request === 'undefined') {
          if (this.#internal.debug) {
            debugLog(this.#internal.logger, 'api.ts / ADTPulse.forceArmHandler()', 'error', 'The HTTP client responded without the "request" object');
          }

          return {
            action: 'FORCE_ARM_HANDLER',
            success: false,
            info: {
              message: 'The HTTP client responded without the "request" object',
            },
          };
        }

        const axiosForceArmRequestPath = sessions.axiosForceArm.request.path;
        const axiosForceArmRequestPathValid = requestPathQuickControlServRunRraCommand.test(axiosForceArmRequestPath);

        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.forceArmHandler()', 'info', `Request path ➜ ${axiosForceArmRequestPath}`);
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.forceArmHandler()', 'info', `Request path valid ➜ ${axiosForceArmRequestPathValid}`);
        }

        // If the final URL of sessions.axiosForceArm is not the run rra command page.
        if (!axiosForceArmRequestPathValid) {
          tracker.errorMessage = `"${axiosForceArmRequestPath}" is not the run rra command page`;
          tracker.requestUrl = axiosForceArmRequestPath;

          continue;
        }

        // Make sure we are able to use the "String.prototype.includes()" method on the response data.
        if (typeof sessions.axiosForceArm.data !== 'string') {
          tracker.errorMessage = 'The response body of the run rra command page is not of type "string"';
          tracker.requestUrl = axiosForceArmRequestPath;

          continue;
        }

        // The server reported that the force arm failed.
        if (!sessions.axiosForceArm.data.includes('1.0-OKAY')) {
          /**
           * A breakdown of the responses when parsing the "RunRRACommand" response body.
           *
           * NOTE: Responses may be inaccurate or missing.
           * LINK: https://patents.google.com/patent/US20170070361A1/en
           *
           * When force arming is successful:
           * - "Could not process the request!</br></br>Error: 1.0-OKAY"
           *
           * When force arming is not successful:
           * - "Could not process the request!</br></br>Error: Method not allowed.  Allowed methods GET, HEAD"
           *
           * Notes I've gathered during the process:
           * - "Method not allowed" error appeared when "parseDoSubmitHandlers().href" has escaped forward slashes (e.g. rest\/adt\/ui\/client\/security\/setForceArm).
           * - POST method is allowed. The error message steers user into the wrong direction. Either message is outdated or due to security reasons.
           *
           * @since 1.0.0
           */
          tracker.errorMessage = 'The response body of the run rra command page does not include "1.0-OKAY"';
          tracker.requestUrl = axiosForceArmRequestPath;

          continue;
        }

        // Mark the force arm as complete.
        tracker.complete = true;
        tracker.errorMessage = null;
        tracker.requestUrl = null;
      }

      // If "tracker.errorMessage" has a pending error message to display.
      if (tracker.errorMessage !== null) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.forceArmHandler()', 'error', tracker.errorMessage);
        }

        // If "this instance" was not signed in at this time.
        this.handleLoginFailure(tracker.requestUrl, sessions.axiosForceArm);

        return {
          action: 'FORCE_ARM_HANDLER',
          success: false,
          info: {
            message: tracker.errorMessage,
          },
        };
      }

      // If force arming failed because the "Arm Anyway" button was not found.
      if (!tracker.complete) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.forceArmHandler()', 'error', 'Force arming failed because the "Arm Anyway" button was not found');
        }

        return {
          action: 'FORCE_ARM_HANDLER',
          success: false,
          info: {
            message: 'Force arming failed because the "Arm Anyway" button was not found',
          },
        };
      }

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.forceArmHandler()', 'success', `Successfully forced arm on "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'FORCE_ARM_HANDLER',
        success: true,
        info: {
          forceArmRequired: true,
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.forceArmHandler()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'FORCE_ARM_HANDLER',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * ADT Pulse - New information dispatcher.
   *
   * @param {ADTPulseNewInformationDispatcherType} type - Type.
   * @param {ADTPulseNewInformationDispatcherData} data - Data.
   *
   * @private
   *
   * @returns {ADTPulseNewInformationDispatcherReturns}
   *
   * @since 1.0.0
   */
  private async newInformationDispatcher(type: ADTPulseNewInformationDispatcherType, data: ADTPulseNewInformationDispatcherData<ADTPulseNewInformationDispatcherType>): ADTPulseNewInformationDispatcherReturns {
    const dataHash = generateHash(data);

    // If the detector has not reported this event before.
    if (this.#internal.reportedHashes.find((reportedHash) => dataHash === reportedHash) === undefined) {
      let detectedNew = false;

      // Determine what information needs to be checked.
      switch (type) {
        case 'debug-parser':
          detectedNew = await detectApiDebugParser(data as ADTPulseNewInformationDispatcherData<'debug-parser'>, this.#internal.logger, this.#internal.debug);
          break;
        case 'do-submit-handlers':
          detectedNew = await detectApiDoSubmitHandlers(data as ADTPulseNewInformationDispatcherData<'do-submit-handlers'>, this.#internal.logger, this.#internal.debug);
          break;
        case 'gateway-information':
          detectedNew = await detectApiGatewayInformation(data as ADTPulseNewInformationDispatcherData<'gateway-information'>, this.#internal.logger, this.#internal.debug);
          break;
        case 'orb-security-buttons':
          detectedNew = await detectApiOrbSecurityButtons(data as ADTPulseNewInformationDispatcherData<'orb-security-buttons'>, this.#internal.logger, this.#internal.debug);
          break;
        case 'panel-information':
          detectedNew = await detectApiPanelInformation(data as ADTPulseNewInformationDispatcherData<'panel-information'>, this.#internal.logger, this.#internal.debug);
          break;
        case 'panel-status':
          detectedNew = await detectApiPanelStatus(data as ADTPulseNewInformationDispatcherData<'panel-status'>, this.#internal.logger, this.#internal.debug);
          break;
        case 'portal-version':
          detectedNew = await detectApiPortalVersion(data as ADTPulseNewInformationDispatcherData<'portal-version'>, this.#internal.logger, this.#internal.debug);
          break;
        case 'sensors-information':
          detectedNew = await detectApiSensorsInformation(data as ADTPulseNewInformationDispatcherData<'sensors-information'>, this.#internal.logger, this.#internal.debug);
          break;
        case 'sensors-status':
          detectedNew = await detectApiSensorsStatus(data as ADTPulseNewInformationDispatcherData<'sensors-status'>, this.#internal.logger, this.#internal.debug);
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
   * ADT Pulse - Get request config.
   *
   * @param {ADTPulseGetRequestConfigExtraConfig} extraConfig - Extra config.
   *
   * @private
   *
   * @returns {ADTPulseGetRequestConfigReturns}
   *
   * @since 1.0.0
   */
  private getRequestConfig(extraConfig?: ADTPulseGetRequestConfigExtraConfig): ADTPulseGetRequestConfigReturns {
    const defaultConfig: ADTPulseGetRequestConfigDefaultConfig = {
      family: 4,
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        Host: `${this.#credentials.subdomain}.adtpulse.com`,
        Pragma: 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
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
   * ADT Pulse - Handle login failure.
   *
   * @param {ADTPulseHandleLoginFailureRequestPath} requestPath - Request path.
   * @param {ADTPulseHandleLoginFailureSession}     session     - Session.
   *
   * @private
   *
   * @returns {ADTPulseHandleLoginFailureReturns}
   *
   * @since 1.0.0
   */
  private handleLoginFailure(requestPath: ADTPulseHandleLoginFailureRequestPath, session: ADTPulseHandleLoginFailureSession): ADTPulseHandleLoginFailureReturns {
    if (requestPath === null) {
      return;
    }

    if (
      requestPathAccessSignIn.test(requestPath)
      || requestPathAccessSignInEXxPartnerAdt.test(requestPath)
      || requestPathMfaMfaSignInWorkflowChallenge.test(requestPath)
    ) {
      if (this.#internal.debug) {
        const errorMessage = fetchErrorMessage(session);

        // Determine if "this instance" was redirected to the sign-in page.
        if (requestPathAccessSignIn.test(requestPath) || requestPathAccessSignInEXxPartnerAdt.test(requestPath)) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.handleLoginFailure()', 'error', 'Either the username or password is incorrect, fingerprint format is invalid, or was signed out due to inactivity');
        }

        // Determine if "this instance" was redirected to the MFA challenge page.
        if (requestPathMfaMfaSignInWorkflowChallenge.test(requestPath)) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.handleLoginFailure()', 'error', 'Either the fingerprint expired or "Trust this device" was not selected after completing MFA challenge');
        }

        // Show the portal error message if it exists.
        if (errorMessage !== null) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.handleLoginFailure()', 'warn', `Portal message ➜ "${errorMessage}"`);
        }
      }

      // Reset the session state for "this instance".
      this.resetSession();
    }
  }
}
