import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { JSDOM } from 'jsdom';
import _ from 'lodash';
import { serializeError } from 'serialize-error';
import { CookieJar } from 'tough-cookie';

import {
  detectedNewDoSubmitHandlers,
  detectedNewGatewayInformation,
  detectedNewOrbSecurityButtons,
  detectedNewPanelInformation,
  detectedNewPanelStatus,
  detectedNewPortalVersion,
  detectedNewSensorsInformation,
  detectedNewSensorsStatus,
} from '@/lib/detect.js';
import {
  paramNetworkId,
  paramSat,
  requestPathAccessSignIn,
  requestPathAccessSignInENsPartnerAdt,
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
} from '@/lib/regex.js';
import {
  debugLog,
  fetchErrorMessage,
  fetchMissingSatCode,
  fetchTableCells,
  findNullKeys,
  generateDynatracePCHeaderValue,
  generateHash,
  isPortalSyncCode,
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
  ADTPulseArmDisarmHandlerArm,
  ADTPulseArmDisarmHandlerArmState,
  ADTPulseArmDisarmHandlerHref,
  ADTPulseArmDisarmHandlerReadyButton,
  ADTPulseArmDisarmHandlerRelativeUrl,
  ADTPulseArmDisarmHandlerReturns,
  ADTPulseArmDisarmHandlerSat,
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
  ADTPulseIsPortalAccessibleReturns,
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
  ADTPulseSetPanelStatusReadyButton,
  ADTPulseSetPanelStatusReturns,
  ADTPulseSetPanelStatusSessions,
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
    };

    // Set session information to defaults.
    this.#session = {
      backupSatCode: null,
      httpClient: wrapper(axios.create({
        jar: new CookieJar(),
      })),
      isAuthenticated: false,
      isCleanState: true,
      networkId: null,
      portalVersion: null,
    };
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
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseLoginSessions = {};

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'LOGIN',
          success: false,
          info: internet.info,
        };
      }

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
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseLogoutSessions = {};

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'LOGOUT',
          success: false,
          info: internet.info,
        };
      }

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
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseGetGatewayInformationSessions = {};

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'GET_GATEWAY_INFORMATION',
          success: false,
          info: internet.info,
        };
      }

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
      const gatewayInformation = {
        communication: {
          broadbandConnectionStatus: _.get(fetchedTableCells, ['Broadband Connection Status:', 0], null),
          cellularConnectionStatus: _.get(fetchedTableCells, ['Cellular Connection Status:', 0], null),
          cellularSignalStrength: _.get(fetchedTableCells, ['Cellular Signal Strength:', 0], null),
          primaryConnectionType: _.get(fetchedTableCells, ['Primary Connection Type:', 0], null),
        },
        manufacturer: _.get(fetchedTableCells, ['Manufacturer:', 0], null),
        model: _.get(fetchedTableCells, ['Model:', 0], null),
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
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseGetPanelInformationSessions = {};

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'GET_PANEL_INFORMATION',
          success: false,
          info: internet.info,
        };
      }

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
      const parsedEmergencyKeys = (emergencyKeys !== null) ? emergencyKeys.match(textPanelEmergencyKeys) : null;
      const manufacturerProvider = _.get(fetchedTableCells, ['Manufacturer/Provider:', 0], null);
      const parsedManufacturer = (manufacturerProvider !== null) ? manufacturerProvider.split(' - ')[0] ?? null : null;
      const parsedProvider = (manufacturerProvider !== null) ? manufacturerProvider.split(' - ')[1] ?? null : null;
      const typeModel = _.get(fetchedTableCells, ['Type/Model:', 0], null);
      const parsedType = (typeModel !== null) ? typeModel.split(' - ')[0] ?? null : null;
      const parsedModel = (typeModel !== null) ? typeModel.split(' - ')[1] ?? null : null;
      const panelInformation = {
        emergencyKeys: parsedEmergencyKeys,
        manufacturer: parsedManufacturer,
        masterCode: _.get(fetchedTableCells, ['Security Panel Master Code:', 0], null),
        provider: parsedProvider,
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
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseGetPanelStatusSessions = {};

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'GET_PANEL_STATUS',
          success: false,
          info: internet.info,
        };
      }

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
   * @param {ADTPulseSetPanelStatusArmFrom} armFrom - Arm from.
   * @param {ADTPulseSetPanelStatusArmTo}   armTo   - Arm to.
   *
   * @returns {ADTPulseSetPanelStatusReturns}
   *
   * @since 1.0.0
   */
  public async setPanelStatus(armFrom: ADTPulseSetPanelStatusArmFrom, armTo: ADTPulseSetPanelStatusArmTo): ADTPulseSetPanelStatusReturns {
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

    // If system is being set to the current arm state (e.g. disarmed to off).
    if (armFrom === armTo) {
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

    try {
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseSetPanelStatusSessions = {};

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'SET_PANEL_STATUS',
          success: false,
          info: internet.info,
        };
      }

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

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosSummary?.request === 'undefined') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'SET_PANEL_STATUS',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSummaryRequestPath = sessions.axiosSummary.request.path;
      const axiosSummaryRequestPathValid = requestPathSummarySummary.test(axiosSummaryRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'info', `Request path ➜ ${axiosSummaryRequestPath}`);
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'info', `Request path valid ➜ ${axiosSummaryRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSummary is not the summary page.
      if (!axiosSummaryRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'error', `"${axiosSummaryRequestPath}" is not the summary page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSummaryRequestPath, sessions.axiosSummary);

        return {
          action: 'SET_PANEL_STATUS',
          success: false,
          info: {
            message: `"${axiosSummaryRequestPath}" is not the summary page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions.axiosSummary.data !== 'string') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'error', 'The response body of the summary page is not of type "string"');
        }

        return {
          action: 'SET_PANEL_STATUS',
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
            debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'success', 'Backup sat code was successfully recovered from previous failed retrieval');
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
       * ¹ States are synced across an entire site (per home). If one account arms, every user signed in during that phase becomes "dirty"
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

      // WORKAROUND: For arm night button bug - Find the "Arming Night" button location.
      const armingNightButtonIndex = parsedOrbSecurityButtons.findIndex((parsedOrbSecurityButton) => {
        const parsedOrbSecurityButtonButtonDisabled = parsedOrbSecurityButton.buttonDisabled;
        const parsedOrbSecurityButtonButtonText = parsedOrbSecurityButton.buttonText;

        return (parsedOrbSecurityButtonButtonDisabled && parsedOrbSecurityButtonButtonText === 'Arming Night');
      });

      // WORKAROUND: For arm night button bug - Replace the "Arming Night" button with a fake "Disarm" button.
      if (
        this.#session.backupSatCode !== null // Backup sat code must be available.
        && armingNightButtonIndex >= 0 // Make sure that the pending "Arming Night" button is there.
      ) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'warn', 'Replacing the stuck "Arming Night" button with a fake "Disarm" button');
        }

        parsedOrbSecurityButtons[armingNightButtonIndex] = {
          buttonDisabled: false,
          buttonId: 'security_button_0',
          buttonIndex: 0,
          buttonText: 'Disarm',
          changeAccessCode: false,
          loadingText: 'Disarming',
          relativeUrl: 'quickcontrol/armDisarm.jsp',
          totalButtons: 1,
          urlParams: {
            arm: 'off',
            armState: (this.#session.isCleanState) ? 'night' : 'night+stay',
            href: 'rest/adt/ui/client/security/setArmState',
            sat: this.#session.backupSatCode,
          },
        };
      }

      // Only keep all ready (enabled) orb security buttons.
      let readyButtons = parsedOrbSecurityButtons.filter((parsedOrbSecurityButton): parsedOrbSecurityButton is ADTPulseSetPanelStatusReadyButton => !parsedOrbSecurityButton.buttonDisabled);

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

      // If current arm state is not truly "disarmed", disarm it first.
      while (!['off', 'disarmed'].includes(readyButtons[0].urlParams.armState)) {
        // Accessing index 0 is guaranteed, because of the check above.
        const armDisarmResponse = await this.armDisarmHandler(
          readyButtons[0].relativeUrl,
          readyButtons[0].urlParams.href,
          readyButtons[0].urlParams.armState,
          'off',
          readyButtons[0].urlParams.sat,
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
      }

      // Track if force arming was required.
      let forceArmRequired = false;

      // Set the arm state based on "armTo" if system is not being disarmed.
      if (armTo !== 'off') {
        // Accessing index 0 is guaranteed, because of the check above.
        const armDisarmResponse = await this.armDisarmHandler(
          readyButtons[0].relativeUrl,
          readyButtons[0].urlParams.href,
          readyButtons[0].urlParams.armState,
          armTo,
          readyButtons[0].urlParams.sat,
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
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.setPanelStatus()', 'success', `Successfully updated panel status to "${armTo}" at "${this.#internal.baseUrl}"`);
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
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseGetSensorsInformationSessions = {};

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'GET_SENSORS_INFORMATION',
          success: false,
          info: internet.info,
        };
      }

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
      const jsdomSystemSensorsTable = sessions.jsdomSystem.window.document.querySelectorAll('#systemContentList tr[onclick^="goToUrl(\'device.jsp?id="]');
      const parsedSensorsTable = parseSensorsTable(jsdomSystemSensorsTable);

      /**
       * Check if "sensorsInformation" needs documenting or testing.
       *
       * NOTICE: Parts NOT SHOWN below will NOT be tracked, documented, or tested.
       * PATENT: https://patents.google.com/patent/US20170070361A1/en
       *
       * deviceType: 'Audible Panic Button/Pendant'
       *             'Carbon Monoxide Detector'
       *             'Door/Window Sensor'
       *             'Door Sensor'
       *             'Fire (Smoke/Heat) Detector'
       *             'Glass Break Detector'
       *             'Keypad/Touchpad'
       *             'Motion Sensor'
       *             'Motion Sensor (Notable Events Only)'
       *             'Shock Sensor'
       *             'Silent Panic Button/Pendant'
       *             'System/Supervisory'
       *             'Temperature Sensor'
       *             'Unknown Device Type'
       *             'Water/Flood Sensor'
       *             'Window Sensor'
       *
       * status: 'Offline'
       *         'Online'
       *         'Status Unknown'
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('sensors-information', parsedSensorsTable);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsInformation()', 'success', `Successfully retrieved sensors information from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'GET_SENSORS_INFORMATION',
        success: true,
        info: {
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
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseGetSensorsStatusSessions = {};

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'GET_SENSORS_STATUS',
          success: false,
          info: internet.info,
        };
      }

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

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.getSensorsStatus()', 'success', `Successfully retrieved sensors status from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'GET_SENSORS_STATUS',
        success: true,
        info: {
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
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulsePerformSyncCheckSessions = {};

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'PERFORM_SYNC_CHECK',
          success: false,
          info: internet.info,
        };
      }

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

      // If the final URL of sessions.axios_syncCheck is not the sync check page.
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
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulsePerformKeepAliveSessions = {};

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'PERFORM_KEEP_ALIVE',
          success: false,
          info: internet.info,
        };
      }

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
   * ADT Pulse - Arm disarm handler.
   *
   * @param {ADTPulseArmDisarmHandlerRelativeUrl} relativeUrl - Relative url.
   * @param {ADTPulseArmDisarmHandlerHref}        href        - Href.
   * @param {ADTPulseArmDisarmHandlerArmState}    armState    - Arm state.
   * @param {ADTPulseArmDisarmHandlerArm}         arm         - Arm.
   * @param {ADTPulseArmDisarmHandlerSat}         sat         - Sat.
   *
   * @private
   *
   * @returns {ADTPulseArmDisarmHandlerReturns}
   *
   * @since 1.0.0
   */
  private async armDisarmHandler(relativeUrl: ADTPulseArmDisarmHandlerRelativeUrl, href: ADTPulseArmDisarmHandlerHref, armState: ADTPulseArmDisarmHandlerArmState, arm: ADTPulseArmDisarmHandlerArm, sat: ADTPulseArmDisarmHandlerSat): ADTPulseArmDisarmHandlerReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'info', `Attempting to update arm state from "${armState}" to "${arm}" on "${this.#internal.baseUrl}"`);
    }

    // If system is being set to the current arm state (e.g. disarmed to off).
    if (
      armState === arm
      || (
        armState === 'disarmed'
        && arm === 'off'
      )
    ) {
      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'info', `No need to change arm state from "${armState}" to "${arm}" due to its equivalence`);
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
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseArmDisarmHandlerSessions = {};

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'ARM_DISARM_HANDLER',
          success: false,
          info: internet.info,
        };
      }

      // Build an "application/x-www-form-urlencoded" form for use with arming and disarming.
      const armDisarmForm = new URLSearchParams();
      armDisarmForm.append('href', href);
      armDisarmForm.append('armstate', armState);
      armDisarmForm.append('arm', arm);
      armDisarmForm.append('sat', sat);

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
         * - When alarm is triggered (when siren is done screaming at you):
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
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/${relativeUrl}`,
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
      if (arm !== 'off') {
        // Passing the force arming task to the handler.
        const forceArmResponse = await this.forceArmHandler(sessions.axiosSetArmMode, relativeUrl);

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

      // After changing any arm state, the "armState" may be different from when you logged into the portal.
      this.#session.isCleanState = false;

      // Allow the security orb buttons to refresh (usually takes around 6 seconds).
      await sleep(6000);

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

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions.axiosSummary?.request === 'undefined') {
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

      const axiosSummaryRequestPath = sessions.axiosSummary.request.path;
      const axiosSummaryRequestPathValid = requestPathSummarySummary.test(axiosSummaryRequestPath);

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'info', `Request path ➜ ${axiosSummaryRequestPath}`);
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'info', `Request path valid ➜ ${axiosSummaryRequestPathValid}`);
      }

      // If the final URL of sessions.axios[1] is not the summary page.
      if (!axiosSummaryRequestPathValid) {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'error', `"${axiosSummaryRequestPath}" is not the summary page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSummaryRequestPath, sessions.axiosSummary);

        return {
          action: 'ARM_DISARM_HANDLER',
          success: false,
          info: {
            message: `"${axiosSummaryRequestPath}" is not the summary page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions.axiosSummary.data !== 'string') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'error', 'The response body of the summary page is not of type "string"');
        }

        return {
          action: 'ARM_DISARM_HANDLER',
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
            debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'success', 'Backup sat code was successfully recovered from previous failed retrieval');
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
       * ¹ States are synced across an entire site (per home). If one account arms, every user signed in during that phase becomes "dirty"
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

      let readyButtons = parsedOrbSecurityButtons.filter((parsedOrbSecurityButton): parsedOrbSecurityButton is ADTPulseArmDisarmHandlerReadyButton => !parsedOrbSecurityButton.buttonDisabled);

      // WORKAROUND: For arm night button bug -  Generate a fake "parsedOrbSecurityButtons" response after system has been set to "night" mode if "Arming Night" is stuck.
      if (
        ['disarmed', 'off'].includes(armState) // Checks if state was "disarmed" (dirty) or "off" (clean).
        && ['night'].includes(arm) // Checks if system was trying to change to "night" mode.
        && readyButtons.length === 0 // Check if there are no ready (enabled) buttons.
      ) {
        readyButtons = [
          {
            buttonDisabled: false,
            buttonId: 'security_button_0',
            buttonIndex: 0,
            buttonText: 'Disarm',
            changeAccessCode: false,
            loadingText: 'Disarming',
            relativeUrl,
            totalButtons: 1,
            urlParams: {
              arm: 'off',
              armState: (this.#session.isCleanState) ? 'night' : 'night+stay',
              href,
              sat,
            },
          },
        ];
      }

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.armDisarmHandler()', 'success', `Successfully updated arm state from "${armState}" to "${arm}" on "${this.#internal.baseUrl}"`);
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
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseForceArmHandlerSessions = {};

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'FORCE_ARM_HANDLER',
          success: false,
          info: internet.info,
        };
      }

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
      const jsdomArmDisarmDoSubmitHandlers = sessions.jsdomArmDisarm.window.document.querySelectorAll('.p_armDisarmWrapper input');
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

      // Check if there are no force arm buttons available.
      if (
        parsedDoSubmitHandlers.length === 0
        || parsedArmDisarmMessage === null
      ) {
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
           * - POST method is allowed. The error message steers in to the wrong direction. Probably for security reasons.
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
   * ADT Pulse - Is portal accessible.
   *
   * @private
   *
   * @returns {ADTPulseIsPortalAccessibleReturns}
   *
   * @since 1.0.0
   */
  private async isPortalAccessible(): ADTPulseIsPortalAccessibleReturns {
    let errorObject;

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.isPortalAccessible()', 'info', `Attempting to check if "${this.#internal.baseUrl}" is accessible`);
    }

    try {
      // Send request using a new instance to prevent cookie jar cross-contamination.
      const response = await axios.head(
        this.#internal.baseUrl,
        this.getRequestConfig(),
      );

      if (response.status !== 200 || response.statusText !== 'OK') {
        if (this.#internal.debug) {
          debugLog(this.#internal.logger, 'api.ts / ADTPulse.isPortalAccessible()', 'error', `The portal at "${this.#internal.baseUrl}" is not accessible`);
        }

        return {
          action: 'IS_PORTAL_ACCESSIBLE',
          success: false,
          info: {
            message: `The portal at "${this.#internal.baseUrl}" is not accessible`,
          },
        };
      }

      if (this.#internal.debug) {
        debugLog(this.#internal.logger, 'api.ts / ADTPulse.isPortalAccessible()', 'success', `Successfully checked if "${this.#internal.baseUrl}" is accessible`);
      }

      return {
        action: 'IS_PORTAL_ACCESSIBLE',
        success: true,
        info: null,
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#internal.debug) {
      debugLog(this.#internal.logger, 'api.ts / ADTPulse.isPortalAccessible()', 'error', 'Method encountered an error during execution');
      stackTracer('serialize-error', errorObject);
    }

    return {
      action: 'IS_PORTAL_ACCESSIBLE',
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
    const dataHash = generateHash(`${type}: ${JSON.stringify(data)}`);

    // If the detector has not reported this event before.
    if (this.#internal.reportedHashes.find((reportedHash) => dataHash === reportedHash) === undefined) {
      let detectedNew = false;

      // Determine what information needs to be checked.
      switch (type) {
        case 'do-submit-handlers':
          detectedNew = await detectedNewDoSubmitHandlers(data as ADTPulseNewInformationDispatcherData<'do-submit-handlers'>, this.#internal.logger, this.#internal.debug);
          break;
        case 'gateway-information':
          detectedNew = await detectedNewGatewayInformation(data as ADTPulseNewInformationDispatcherData<'gateway-information'>, this.#internal.logger, this.#internal.debug);
          break;
        case 'orb-security-buttons':
          detectedNew = await detectedNewOrbSecurityButtons(data as ADTPulseNewInformationDispatcherData<'orb-security-buttons'>, this.#internal.logger, this.#internal.debug);
          break;
        case 'panel-information':
          detectedNew = await detectedNewPanelInformation(data as ADTPulseNewInformationDispatcherData<'panel-information'>, this.#internal.logger, this.#internal.debug);
          break;
        case 'panel-status':
          detectedNew = await detectedNewPanelStatus(data as ADTPulseNewInformationDispatcherData<'panel-status'>, this.#internal.logger, this.#internal.debug);
          break;
        case 'portal-version':
          detectedNew = await detectedNewPortalVersion(data as ADTPulseNewInformationDispatcherData<'portal-version'>, this.#internal.logger, this.#internal.debug);
          break;
        case 'sensors-information':
          detectedNew = await detectedNewSensorsInformation(data as ADTPulseNewInformationDispatcherData<'sensors-information'>, this.#internal.logger, this.#internal.debug);
          break;
        case 'sensors-status':
          detectedNew = await detectedNewSensorsStatus(data as ADTPulseNewInformationDispatcherData<'sensors-status'>, this.#internal.logger, this.#internal.debug);
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
        Connection: 'keep-alive',
        Host: `${this.#credentials.subdomain}.adtpulse.com`,
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
      validateStatus: undefined,
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
      || requestPathAccessSignInENsPartnerAdt.test(requestPath)
      || requestPathMfaMfaSignInWorkflowChallenge.test(requestPath)
    ) {
      if (this.#internal.debug) {
        const errorMessage = fetchErrorMessage(session);

        // Determine if "this instance" was redirected to the sign-in page.
        if (requestPathAccessSignIn.test(requestPath) || requestPathAccessSignInENsPartnerAdt.test(requestPath)) {
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

  /**
   * ADT Pulse - Reset session.
   *
   * @private
   *
   * @returns {ADTPulseResetSessionReturns}
   *
   * @since 1.0.0
   */
  private resetSession(): ADTPulseResetSessionReturns {
    this.#session = {
      backupSatCode: null,
      httpClient: wrapper(axios.create({
        jar: new CookieJar(),
      })),
      isAuthenticated: false,
      isCleanState: true,
      networkId: null,
      portalVersion: null,
    };
  }
}
