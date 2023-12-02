import axios from 'axios';
import { wrapper as cookieJarWrapper } from 'axios-cookiejar-support';
import { JSDOM } from 'jsdom';
import _ from 'lodash';
import { serializeError } from 'serialize-error';
import { CookieJar } from 'tough-cookie';

import {
  armDisarmResponsePath,
  gatewayResponsePath,
  homepageResponsePath,
  keepAliveResponsePath,
  networkIdParam,
  panelInformationEmergencyKeys,
  panelResponsePath,
  runRRACommandResponsePath,
  satCodeParam,
  signInMfaResponsePath,
  signInSummaryResponsePath,
  signOutResponsePath,
  summaryRefreshResponsePath,
  syncCheckServResponsePath,
} from '@/lib/regex';
import {
  clearHtmlLineBreak,
  clearWhitespace,
  debugLog,
  fetchTableCells,
  findNullKeys,
  generateDynatracePCHeaderValue,
  parseArmDisarmMessage,
  parseDoSubmitHandlers,
  parseOrbSecurityButtons,
  parseOrbSensors,
  parseOrbTextSummary,
  sleep,
  stackTraceLog,
} from '@/lib/utility';
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
  ADTPulseFetchErrorMessageResponse,
  ADTPulseFetchErrorMessageReturns,
  ADTPulseFetchErrorMessageSessions,
  ADTPulseForceArmHandlerRelativeUrl,
  ADTPulseForceArmHandlerResponse,
  ADTPulseForceArmHandlerReturns,
  ADTPulseForceArmHandlerSessions,
  ADTPulseForceArmHandlerTracker,
  ADTPulseGetGatewayInformationReturns,
  ADTPulseGetGatewayInformationSessions,
  ADTPulseGetPanelInformationReturns,
  ADTPulseGetPanelInformationSessions,
  ADTPulseGetPanelStatusReturns,
  ADTPulseGetPanelStatusSessions,
  ADTPulseGetRequestConfigDefaultConfig,
  ADTPulseGetRequestConfigExtraConfig,
  ADTPulseGetRequestConfigReturns,
  ADTPulseGetSensorStatusesReturns,
  ADTPulseGetSensorStatusesSessions,
  ADTPulseInternal,
  ADTPulseIsPortalAccessibleReturns,
  ADTPulseLoginReturns,
  ADTPulseLoginSessions,
  ADTPulseLogoutReturns,
  ADTPulseLogoutSessions,
  ADTPulseOptions,
  ADTPulsePerformKeepAliveReturns,
  ADTPulsePerformKeepAliveSessions,
  ADTPulsePerformSyncCheckReturns,
  ADTPulsePerformSyncCheckSessions,
  ADTPulseResetSessionReturns,
  ADTPulseSession,
  ADTPulseSetPanelStatusArmTo,
  ADTPulseSetPanelStatusReadyButton,
  ADTPulseSetPanelStatusReturns,
  ADTPulseSetPanelStatusSessions,
} from '@/types';

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
   * ADT Pulse - Options.
   *
   * @private
   *
   * @since 1.0.0
   */
  #options: ADTPulseOptions;

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
   * @param {ADTPulseConstructorConfig}         config           - Config.
   * @param {ADTPulseConstructorInternalConfig} [internalConfig] - Internal config.
   *
   * @since 1.0.0
   */
  constructor(config: ADTPulseConstructorConfig, internalConfig?: ADTPulseConstructorInternalConfig) {
    // Set config options.
    this.#credentials = {
      fingerprint: config.fingerprint,
      password: config.password,
      subdomain: config.subdomain,
      username: config.username,
    };
    this.#options = {
      debug: config.debug ?? false,
      sensors: config.sensors,
    };

    // Set internal config options.
    if (internalConfig !== undefined) {
      this.#internal = {
        baseUrl: internalConfig.baseUrl,
        testMode: {
          enabled: internalConfig.testMode.enabled,
          isDisarmChecked: internalConfig.testMode.isDisarmChecked,
        },
      };
    } else {
      this.#internal = {
        baseUrl: `https://${this.#credentials.subdomain}.adtpulse.com`,
        testMode: {
          enabled: false,
          isDisarmChecked: false,
        },
      };
    }

    // Set session information to defaults.
    this.#session = {
      backupSatCode: null,
      httpClient: cookieJarWrapper(axios.create({
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
  async login(): ADTPulseLoginReturns {
    let errorObject;

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.login()', 'info', `Attempting to login to "${this.#internal.baseUrl}"`);
    }

    try {
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseLoginSessions = {
        axios: [],
      };

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'LOGIN',
          success: false,
          info: internet.info,
        };
      }

      // Check if "this instance" has already authenticated.
      if (
        this.#session.isAuthenticated
        && this.#session.backupSatCode !== null
        && this.#session.networkId !== null
        && this.#session.portalVersion !== null
      ) {
        if (this.#options.debug) {
          debugLog(
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

      // sessions.axios[0]: Load the portal homepage.
      sessions.axios[0] = await this.#session.httpClient.get(
        `${this.#internal.baseUrl}/`,
        this.getRequestConfig(),
      );

      const axios0RequestPath = sessions.axios[0].request.path;
      const axios0RequestPathValid = homepageResponsePath.test(axios0RequestPath);

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.login()', 'info', `Request path ➜ ${axios0RequestPath}`);
        debugLog('api.ts / ADTPulse.login()', 'info', `Request path valid ➜ ${axios0RequestPathValid}`);
      }

      // If the final URL of sessions.axios[0] is not the sign-in page.
      if (!axios0RequestPathValid) {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.login()', 'error', `"${axios0RequestPath} is not the sign-in page`);
        }

        return {
          action: 'LOGIN',
          success: false,
          info: {
            message: `"${axios0RequestPath} is not the sign-in page`,
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

      // Get and set the portal version based on the request path.
      this.#session.portalVersion = axios0RequestPath.replace(homepageResponsePath, '$2');

      // sessions.axios[1]: Emulate a sign-in request.
      sessions.axios[1] = await this.#session.httpClient.post(
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

      const axios1RequestPath = sessions.axios[1].request.path;
      const axios1RequestPathValid = signInSummaryResponsePath.test(axios1RequestPath);

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.login()', 'info', `Request path ➜ ${axios1RequestPath}`);
        debugLog('api.ts / ADTPulse.login()', 'info', `Request path valid ➜ ${axios1RequestPathValid}`);
      }

      // If the final URL of sessions.axios[1] is not the summary page.
      if (!axios1RequestPathValid) {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.login()', 'error', `"${axios1RequestPath}" is not the summary page`);

          // Determine if "this instance" was redirected to the MFA challenge page.
          if (signInMfaResponsePath.test(axios1RequestPath)) {
            debugLog('api.ts / ADTPulse.login()', 'error', 'Fingerprint is invalid or "Trust this device" was not selected after completing MFA challenge');
          } else {
            const errorMessage = ADTPulse.fetchErrorMessage(sessions.axios[1]);

            if (errorMessage !== null) {
              debugLog('api.ts / ADTPulse.login()', 'error', `Portal Message: "${errorMessage}"`);
            } else {
              debugLog('api.ts / ADTPulse.login()', 'error', 'Unknown error');
            }
          }
        }

        return {
          action: 'LOGIN',
          success: false,
          info: {
            message: `"${axios1RequestPath}" is not the summary page`,
          },
        };
      }

      // Make sure we are able to use the "String.prototype.match()" method on the response data.
      if (typeof sessions.axios[1].data !== 'string') {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.login()', 'error', 'The response body of the summary page is not of type "string"');
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
      const matchNetworkId = sessions.axios[1].data.match(networkIdParam);
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
       * @since 1.0.0
       */
      const matchSatCode = sessions.axios[1].data.match(satCodeParam);
      this.#session.backupSatCode = (matchSatCode !== null && matchSatCode.length >= 2) ? matchSatCode[1] : null;

      // Mark the session for "this instance" as authenticated.
      this.#session.isAuthenticated = true;

      if (this.#options.debug) {
        debugLog(
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

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.login()', 'error', 'Method encountered an error during execution');
      stackTraceLog(errorObject);
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
  async logout(): ADTPulseLogoutReturns {
    let errorObject;

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.logout()', 'info', `Attempting to logout of "${this.#internal.baseUrl}"`);
    }

    try {
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseLogoutSessions = {
        axios: [],
      };

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'LOGOUT',
          success: false,
          info: internet.info,
        };
      }

      // Check if "this instance" has already de-authenticated.
      if (
        !this.#session.isAuthenticated
        && this.#session.backupSatCode === null
        && this.#session.networkId === null
        && this.#session.portalVersion === null
      ) {
        if (this.#options.debug) {
          debugLog(
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

      // sessions.axios[0]: Emulate a sign out request.
      sessions.axios[0] = await this.#session.httpClient.get(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/access/signout.jsp?networkid=${this.#session.networkId}&partner=adt`,
        this.getRequestConfig({
          headers: {
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      const axios0RequestPath = sessions.axios[0].request.path;
      const axios0RequestPathValid = signOutResponsePath.test(axios0RequestPath);

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.logout()', 'info', `Request path ➜ ${axios0RequestPath}`);
        debugLog('api.ts / ADTPulse.logout()', 'info', `Request path valid ➜ ${axios0RequestPathValid}`);
      }

      // If the final URL of sessions.axios[0] is not the sign-in page with "networkid" and "partner=adt" parameters.
      if (!axios0RequestPathValid) {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.logout()', 'error', `"${axios0RequestPath}" is not the sign-in page with "networkid" and "partner=adt" parameters`);
        }

        return {
          action: 'LOGOUT',
          success: false,
          info: {
            message: `"${axios0RequestPath}" is not the sign-in page with "networkid" and "partner=adt" parameters`,
          },
        };
      }

      // Reset the session state for "this instance".
      this.resetSession();

      if (this.#options.debug) {
        debugLog(
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

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.logout()', 'error', 'Method encountered an error during execution');
      stackTraceLog(errorObject);
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
  async getGatewayInformation(): ADTPulseGetGatewayInformationReturns {
    let errorObject;

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.getGatewayInformation()', 'info', `Attempting to retrieve gateway information from "${this.#internal.baseUrl}"`);
    }

    try {
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseGetGatewayInformationSessions = {
        axios: [],
        jsdom: [],
      };

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'GET_GATEWAY_INFORMATION',
          success: false,
          info: internet.info,
        };
      }

      // sessions.axios[0]: Load the system gateway page.
      sessions.axios[0] = await this.#session.httpClient.get(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/system/gateway.jsp`,
        this.getRequestConfig({
          headers: {
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/system/system.jsp`,
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
          },
        }),
      );

      const axios0RequestPath = sessions.axios[0].request.path;
      const axios0RequestPathValid = gatewayResponsePath.test(axios0RequestPath);

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.getGatewayInformation()', 'info', `Request path ➜ ${axios0RequestPath}`);
        debugLog('api.ts / ADTPulse.getGatewayInformation()', 'info', `Request path valid ➜ ${axios0RequestPathValid}`);
      }

      // If the final URL of sessions.axios[0] is not the system gateway page.
      if (!axios0RequestPathValid) {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.getGatewayInformation()', 'error', `"${axios0RequestPath}" is not the system gateway page`);
        }

        return {
          action: 'GET_GATEWAY_INFORMATION',
          success: false,
          info: {
            message: `"${axios0RequestPath}" is not the system gateway page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions.axios[0].data !== 'string') {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.getGatewayInformation()', 'error', 'The response body of the system gateway page is not of type "string"');
        }

        return {
          action: 'GET_GATEWAY_INFORMATION',
          success: false,
          info: {
            message: 'The response body of the system gateway page is not of type "string"',
          },
        };
      }

      // sessions.jsdom[0]: Parse the system gateway page.
      sessions.jsdom[0] = new JSDOM(
        sessions.axios[0].data,
        {
          url: sessions.axios[0].config.url,
          referrer: sessions.axios[0].config.headers.Referer,
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      const jsdom0TableCells = sessions.jsdom[0].window.document.querySelectorAll('td');
      const fetchedTableCells = fetchTableCells(
        jsdom0TableCells,
        [
          'Broadband LAN IP Address:',
          'Broadband LAN MAC:',
          'Device LAN IP Address:',
          'Device LAN MAC:',
          'Firmware Version:',
          'Hardware Version:',
          'Last Update:',
          'Manufacturer:',
          'Model:',
          'Next Update:',
          'Serial Number:',
          'Status:',
        ],
        1,
        1,
      );

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.getGatewayInformation()', 'success', `Successfully retrieved gateway information from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'GET_GATEWAY_INFORMATION',
        success: true,
        info: {
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
          },
          serialNumber: _.get(fetchedTableCells, ['Serial Number:', 0], null),
          status: _.get(fetchedTableCells, ['Status:', 0], null),
          update: {
            last: _.get(fetchedTableCells, ['Last Update:', 0], null),
            next: _.get(fetchedTableCells, ['Next Update:', 0], null),
          },
          versions: {
            firmware: _.get(fetchedTableCells, ['Firmware Version:', 0], null),
            hardware: _.get(fetchedTableCells, ['Hardware Version:', 0], null),
          },
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.getGatewayInformation()', 'error', 'Method encountered an error during execution');
      stackTraceLog(errorObject);
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
  async getPanelInformation(): ADTPulseGetPanelInformationReturns {
    let errorObject;

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.getPanelInformation()', 'info', `Attempting to retrieve panel information from "${this.#internal.baseUrl}"`);
    }

    try {
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseGetPanelInformationSessions = {
        axios: [],
        jsdom: [],
      };

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'GET_PANEL_INFORMATION',
          success: false,
          info: internet.info,
        };
      }

      // sessions.axios[0]: Load the system device page.
      sessions.axios[0] = await this.#session.httpClient.get(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/system/device.jsp?id=1`,
        this.getRequestConfig({
          headers: {
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/system/system.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      const axios0RequestPath = sessions.axios[0].request.path;
      const axios0RequestPathValid = panelResponsePath.test(axios0RequestPath);

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.getPanelInformation()', 'info', `Request path ➜ ${axios0RequestPath}`);
        debugLog('api.ts / ADTPulse.getPanelInformation()', 'info', `Request path valid ➜ ${axios0RequestPathValid}`);
      }

      // If the final URL of sessions.axios[0] is not the system device page.
      if (!axios0RequestPathValid) {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.getPanelInformation()', 'error', `"${axios0RequestPath}" is not the system device page`);
        }

        return {
          action: 'GET_PANEL_INFORMATION',
          success: false,
          info: {
            message: `"${axios0RequestPath}" is not the system device page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions.axios[0].data !== 'string') {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.getPanelInformation()', 'error', 'The response body of the system device page is not of type "string"');
        }

        return {
          action: 'GET_PANEL_INFORMATION',
          success: false,
          info: {
            message: 'The response body of the system device page is not of type "string"',
          },
        };
      }

      // sessions.jsdom[0]: Parse the system device page.
      sessions.jsdom[0] = new JSDOM(
        sessions.axios[0].data,
        {
          url: sessions.axios[0].config.url,
          referrer: sessions.axios[0].config.headers.Referer,
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      const jsdom0TableCells = sessions.jsdom[0].window.document.querySelectorAll('td');
      const fetchedTableCells = fetchTableCells(
        jsdom0TableCells,
        [
          'Manufacturer/Provider:',
          'Type/Model:',
          'Emergency Keys:',
          'Status:',
        ],
        1,
        1,
      );
      const emergencyKeys = _.get(fetchedTableCells, ['Emergency Keys:', 0], null);
      const newEmergencyKeys = (typeof emergencyKeys === 'string') ? emergencyKeys.match(panelInformationEmergencyKeys) : null;

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.getPanelInformation()', 'success', `Successfully retrieved panel information from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'GET_PANEL_INFORMATION',
        success: true,
        info: {
          emergencyKeys: newEmergencyKeys,
          manufacturerProvider: _.get(fetchedTableCells, ['Manufacturer/Provider:', 0], null),
          typeModel: _.get(fetchedTableCells, ['Type/Model:', 0], null),
          status: _.get(fetchedTableCells, ['Status:', 0], null),
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.getPanelInformation()', 'error', 'Method encountered an error during execution');
      stackTraceLog(errorObject);
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
  async getPanelStatus(): ADTPulseGetPanelStatusReturns {
    let errorObject;

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.getPanelStatus()', 'info', `Attempting to retrieve panel status from "${this.#internal.baseUrl}"`);
    }

    try {
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseGetPanelStatusSessions = {
        axios: [],
        jsdom: [],
      };

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'GET_PANEL_STATUS',
          success: false,
          info: internet.info,
        };
      }

      // sessions.axios[0]: Load the summary page.
      sessions.axios[0] = await this.#session.httpClient.get(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
        this.getRequestConfig({
          headers: {
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      const axios0RequestPath = sessions.axios[0].request.path;
      const axios0RequestPathValid = summaryRefreshResponsePath.test(axios0RequestPath);

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.getPanelStatus()', 'info', `Request path ➜ ${axios0RequestPath}`);
        debugLog('api.ts / ADTPulse.getPanelStatus()', 'info', `Request path valid ➜ ${axios0RequestPathValid}`);
      }

      // If the final URL of sessions.axios[0] is not the summary page.
      if (!axios0RequestPathValid) {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.getPanelStatus()', 'error', `"${axios0RequestPath}" is not the summary page`);
        }

        return {
          action: 'GET_PANEL_STATUS',
          success: false,
          info: {
            message: `"${axios0RequestPath}" is not the summary page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions.axios[0].data !== 'string') {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.getPanelStatus()', 'error', 'The response body of the summary page is not of type "string"');
        }

        return {
          action: 'GET_PANEL_STATUS',
          success: false,
          info: {
            message: 'The response body of the summary page is not of type "string"',
          },
        };
      }

      // sessions.jsdom[0]: Parse the summary page.
      sessions.jsdom[0] = new JSDOM(
        sessions.axios[0].data,
        {
          url: sessions.axios[0].config.url,
          referrer: sessions.axios[0].config.headers.Referer,
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * A breakdown of the orb text summary shown in the portal.
       *
       * Original strings are displayed like this:
       * - "Disarmed. All Quiet."
       * - "Status Unavailable. "
       *
       * After processing by the "parseOrbTextSummary()" function (two statuses):
       * - state: 'Disarmed'
       * - status: 'All Quiet'
       *
       * After processing by the "parseOrbTextSummary()" function (one status):
       * - state: 'Status Unavailable'
       * - status: null
       *
       * @since 1.0.0
       */
      const jsdom0OrbTextSummary = sessions.jsdom[0].window.document.querySelector('#divOrbTextSummary');
      const parsedOrbTextSummary = parseOrbTextSummary(jsdom0OrbTextSummary);

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.getPanelStatus()', 'success', `Successfully retrieved panel status from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'GET_PANEL_STATUS',
        success: true,
        /**
         * A breakdown of the responses when panel statuses are parsed.
         *
         * NOTE: Responses may be inaccurate or missing.
         * LINK: https://patents.google.com/patent/US20170070361A1/en
         *
         * state: 'Disarmed'
         *        'Armed Away'
         *        'Armed Stay'
         *        'Armed Night'
         *        'Status Unavailable'
         *
         * status: 'All Quiet'
         *         '1 Sensor Open'
         *         '[# of sensors open] Sensors Open'
         *         'Sensor Bypassed'
         *         'Sensors Bypassed'
         *         'Sensor Tripped'
         *         'Sensors Tripped'
         *         'Motion'
         *         'Uncleared Alarm'
         *         'Carbon Monoxide Alarm'
         *         'FIRE ALARM'
         *         'BURGLARY ALARM'
         *         'Sensor Problem'
         *         null
         *
         * @since 1.0.0
         */
        info: parsedOrbTextSummary,
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.getPanelStatus()', 'error', 'Method encountered an error during execution');
      stackTraceLog(errorObject);
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
   * @param {ADTPulseSetPanelStatusArmTo} armTo - Arm to.
   *
   * @returns {ADTPulseSetPanelStatusReturns}
   *
   * @since 1.0.0
   */
  async setPanelStatus(armTo: ADTPulseSetPanelStatusArmTo): ADTPulseSetPanelStatusReturns {
    let errorObject;

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.setPanelStatus()', 'info', `Attempting to update panel status to "${armTo}" at "${this.#internal.baseUrl}"`);
    }

    try {
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseSetPanelStatusSessions = {
        axios: [],
        jsdom: [],
      };

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'SET_PANEL_STATUS',
          success: false,
          info: internet.info,
        };
      }

      // sessions.axios[0]: Load the summary page.
      sessions.axios[0] = await this.#session.httpClient.get(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
        this.getRequestConfig({
          headers: {
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      const axios0RequestPath = sessions.axios[0].request.path;
      const axios0RequestPathValid = summaryRefreshResponsePath.test(axios0RequestPath);

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.setPanelStatus()', 'info', `Request path ➜ ${axios0RequestPath}`);
        debugLog('api.ts / ADTPulse.setPanelStatus()', 'info', `Request path valid ➜ ${axios0RequestPathValid}`);
      }

      // If the final URL of sessions.axios[0] is not the summary page.
      if (!axios0RequestPathValid) {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.setPanelStatus()', 'error', `"${axios0RequestPath}" is not the summary page`);
        }

        return {
          action: 'SET_PANEL_STATUS',
          success: false,
          info: {
            message: `"${axios0RequestPath}" is not the summary page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions.axios[0].data !== 'string') {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.setPanelStatus()', 'error', 'The response body of the summary page is not of type "string"');
        }

        return {
          action: 'SET_PANEL_STATUS',
          success: false,
          info: {
            message: 'The response body of the summary page is not of type "string"',
          },
        };
      }

      // sessions.jsdom[0]: Parse the summary page.
      sessions.jsdom[0] = new JSDOM(
        sessions.axios[0].data,
        {
          url: sessions.axios[0].config.url,
          referrer: sessions.axios[0].config.headers.Referer,
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * A breakdown of the "setArmState" function used in the portal.
       *
       * The original function call is displayed like this:
       * - setArmState('quickcontrol/armDisarm.jsp','Arming Stay','1','2','false','href=rest/adt/ui/client/security/setArmState&armstate=off&arm=stay&sat=21580428-e539-4075-8237-5c58b6c6fec8')
       *
       * After processing by the "parseOrbSecurityButtons()" function (ready buttons):
       * - buttonDisabled: false
       * - buttonId: 'security_button_1'
       * - buttonIndex: 1
       * - buttonTitle: 'Arm Stay'
       * - changeAccessCode: false
       * - loadingText: 'Arming Stay'
       * - relativeUrl: 'quickcontrol/armDisarm.jsp'
       * - totalButtons: 2
       * - urlParams
       *   - arm: 'stay'
       *   - armState: 'off'
       *   - href: 'rest/adt/ui/client/security/setArmState'
       *   - sat: '21580428-e539-4075-8237-5c58b6c6fec8'
       *
       * After processing by the "parseOrbSecurityButtons()" function (pending buttons):
       * - buttonDisabled: true
       * - buttonId: 'security_button_1'
       * - buttonTitle: 'Arming Stay'
       *
       * Notes I've gathered during the process:
       * - After disarming, "armState" will be set to "disarmed". It will be set to "off" after re-login.¹
       * - After turning off siren, "armState" will be set to "disarmed+with+alarm". It will be set to "disarmed_with_alarm" after re-login.¹²
       * - After arming night, "armState" will be set to "night+stay". It will be set to "night" after re-login.¹
       * - The "sat" code is required for all arm/disarm actions (UUID, generated on every login).
       * - If "armState" is not "off" or "disarmed", you must disarm first before setting to other modes.
       *
       * ¹ States are synced across an entire site (per home). If one account arms, every user signed in during that phase becomes "dirty"
       * ² Turning off siren means system is in "Uncleared Alarm" mode, not truly "Disarmed" mode.
       *
       * @since 1.0.0
       */
      const jsdom0OrbSecurityButtons = sessions.jsdom[0].window.document.querySelectorAll('#divOrbSecurityButtons input');
      const parsedOrbSecurityButtons = parseOrbSecurityButtons(jsdom0OrbSecurityButtons);

      // WORKAROUND FOR ARM NIGHT BUTTON BUG: Find the "Arming Night" button location.
      const armingNightButtonIndex = parsedOrbSecurityButtons.findIndex((parsedOrbSecurityButton) => {
        const parsedOrbSecurityButtonButtonDisabled = parsedOrbSecurityButton.buttonDisabled;
        const parsedOrbSecurityButtonButtonTitle = parsedOrbSecurityButton.buttonTitle;

        return (parsedOrbSecurityButtonButtonDisabled && parsedOrbSecurityButtonButtonTitle === 'Arming Night');
      });

      // WORKAROUND FOR ARM NIGHT BUTTON BUG: Replace the "Arming Night" button with a fake "Disarm" button.
      if (
        this.#session.backupSatCode !== null // Backup sat code must be available.
        && armingNightButtonIndex >= 0 // Make sure that the pending "Arming Night" button is there.
      ) {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.setPanelStatus()', 'warn', 'Replacing the stuck "Arming Night" button with a fake "Disarm" button');
        }

        parsedOrbSecurityButtons[armingNightButtonIndex] = {
          buttonDisabled: false,
          buttonId: 'security_button_0',
          buttonIndex: 0,
          buttonTitle: 'Disarm',
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
      if (parsedOrbSecurityButtons.length < 1) {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.setPanelStatus()', 'error', 'Security buttons are not found on the summary page');
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
        && !this.#internal.testMode.isDisarmChecked
      ) {
        // If system is not disarmed, end the test.
        if (!['off', 'disarmed'].includes(readyButtons[0].urlParams.armState)) {
          if (this.#options.debug) {
            debugLog('api.ts / ADTPulse.setPanelStatus()', 'error', 'Test mode is active and system is not disarmed');
          }

          return {
            action: 'SET_PANEL_STATUS',
            success: false,
            info: {
              message: 'Test mode is active and system is not disarmed',
            },
          };
        }

        // If system is disarmed, set "isDisarmChecked" to true, so it does not check again.
        this.#internal.testMode.isDisarmChecked = true;
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
          if (this.#options.debug) {
            debugLog('api.ts / ADTPulse.setPanelStatus()', 'error', 'An error occurred in the arm disarm handler (while disarming)');
          }

          return {
            action: 'SET_PANEL_STATUS',
            success: false,
            info: armDisarmResponse.info,
          };
        }

        // Make sure there is at least 1 security button available.
        if (armDisarmResponse.info.newReadyButtons.length < 1) {
          if (this.#options.debug) {
            debugLog('api.ts / ADTPulse.setPanelStatus()', 'error', 'Arm disarm handler failed to find new security buttons');
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
        readyButtons = armDisarmResponse.info.newReadyButtons;
      }

      // Set the arm state based on "armTo" if user is not disarming (because system already disarmed).
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
          if (this.#options.debug) {
            debugLog('api.ts / ADTPulse.setPanelStatus()', 'error', 'An error occurred in the arm disarm handler (while arming)');
          }

          return {
            action: 'SET_PANEL_STATUS',
            success: false,
            info: armDisarmResponse.info,
          };
        }
      }

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.setPanelStatus()', 'success', `Successfully updated panel status to "${armTo}" at "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'SET_PANEL_STATUS',
        success: true,
        info: null,
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.setPanelStatus()', 'error', 'Method encountered an error during execution');
      stackTraceLog(errorObject);
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
   * ADT Pulse - Get sensor statuses.
   *
   * @returns {ADTPulseGetSensorStatusesReturns}
   *
   * @since 1.0.0
   */
  async getSensorStatuses(): ADTPulseGetSensorStatusesReturns {
    let errorObject;

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.getSensorStatuses()', 'info', `Attempting to retrieve sensor statuses from "${this.#internal.baseUrl}"`);
    }

    try {
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseGetSensorStatusesSessions = {
        axios: [],
        jsdom: [],
      };

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'GET_SENSOR_STATUSES',
          success: false,
          info: internet.info,
        };
      }

      // sessions.axios[0]: Load the summary page.
      sessions.axios[0] = await this.#session.httpClient.get(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
        this.getRequestConfig({
          headers: {
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      const axios0RequestPath = sessions.axios[0].request.path;
      const axios0RequestPathValid = summaryRefreshResponsePath.test(axios0RequestPath);

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.getSensorStatuses()', 'info', `Request path ➜ ${axios0RequestPath}`);
        debugLog('api.ts / ADTPulse.getSensorStatuses()', 'info', `Request path valid ➜ ${axios0RequestPathValid}`);
      }

      // If the final URL of sessions.axios[0] is not the summary page.
      if (!axios0RequestPathValid) {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.getSensorStatuses()', 'error', `"${axios0RequestPath}" is not the summary page`);
        }

        return {
          action: 'GET_SENSOR_STATUSES',
          success: false,
          info: {
            message: `"${axios0RequestPath}" is not the summary page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions.axios[0].data !== 'string') {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.getSensorStatuses()', 'error', 'The response body of the summary page is not of type "string"');
        }

        return {
          action: 'GET_SENSOR_STATUSES',
          success: false,
          info: {
            message: 'The response body of the summary page is not of type "string"',
          },
        };
      }

      // sessions.jsdom[0]: Parse the summary page.
      sessions.jsdom[0] = new JSDOM(
        sessions.axios[0].data,
        {
          url: sessions.axios[0].config.url,
          referrer: sessions.axios[0].config.headers.Referer,
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      const jsdom0OrbSensors = sessions.jsdom[0].window.document.querySelectorAll('#orbSensorsList tr.p_listRow');
      const parsedOrbSensors = parseOrbSensors(jsdom0OrbSensors);

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.getSensorStatuses()', 'success', `Successfully retrieved sensor statuses from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'GET_SENSOR_STATUSES',
        success: true,
        info: {
          /**
           * A breakdown of the responses when orb sensors are parsed.
           *
           * NOTE: Responses may be inaccurate or missing.
           * LINK: https://patents.google.com/patent/US20170070361A1/en
           *
           * icon: 'devStatOK'
           *       'devStatOpen'
           *       'devStatMotion'
           *       'devStatTamper'
           *       'devStatAlarm'
           *       'devStatLowBatt'
           *       'devStatInstalling'
           *       'devStatOffline'
           *       'devStatUnknown'
           *
           * name: 'Sensor 1'
           *
           * status: 'Okay'
           *         'Open'
           *         'Closed'
           *         'Motion'
           *         'No Motion'
           *         'Tripped'
           *
           * zone: 1
           *
           * @since 1.0.0
           */
          sensors: parsedOrbSensors,
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.getSensorStatuses()', 'error', 'Method encountered an error during execution');
      stackTraceLog(errorObject);
    }

    return {
      action: 'GET_SENSOR_STATUSES',
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
  async performSyncCheck(): ADTPulsePerformSyncCheckReturns {
    let errorObject;

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.performSyncCheck()', 'info', `Attempting to perform a sync check from "${this.#internal.baseUrl}"`);
    }

    try {
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulsePerformSyncCheckSessions = {
        axios: [],
      };

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'PERFORM_SYNC_CHECK',
          success: false,
          info: internet.info,
        };
      }

      // sessions.axios[0]: Load the sync check page.
      sessions.axios[0] = await this.#session.httpClient.get(
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

      const axios0RequestPath = sessions.axios[0].request.path;
      const axios0RequestPathValid = syncCheckServResponsePath.test(axios0RequestPath);

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.performSyncCheck()', 'info', `Request path ➜ ${axios0RequestPath}`);
        debugLog('api.ts / ADTPulse.performSyncCheck()', 'info', `Request path valid ➜ ${axios0RequestPathValid}`);
      }

      // If the final URL of sessions.axios[0] is not the sync check page.
      if (!axios0RequestPathValid) {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.performSyncCheck()', 'error', `"${axios0RequestPath}" is not the sync check page`);
        }

        return {
          action: 'PERFORM_SYNC_CHECK',
          success: false,
          info: {
            message: `"${axios0RequestPath}" is not the sync check page`,
          },
        };
      }

      // Make sure we are able to pass on the response data.
      if (typeof sessions.axios[0].data !== 'string') {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.performSyncCheck()', 'error', 'The response body of the sync check page is not of type "string"');
        }

        return {
          action: 'PERFORM_SYNC_CHECK',
          success: false,
          info: {
            message: 'The response body of the sync check page is not of type "string"',
          },
        };
      }

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.performSyncCheck()', 'success', `Successfully performed a sync check from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'PERFORM_SYNC_CHECK',
        success: true,
        info: {
          /**
           * A breakdown of the responses when "syncCheckServ" is called.
           *
           * - 1-0-0
           * - 2-0-0
           * - [integer]-0-0
           * - [integer]-[integer]-0
           *
           * @since 1.0.0
           */
          syncCode: sessions.axios[0].data,
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.performSyncCheck()', 'error', 'Method encountered an error during execution');
      stackTraceLog(errorObject);
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
  async performKeepAlive(): ADTPulsePerformKeepAliveReturns {
    let errorObject;

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.performKeepAlive()', 'info', `Attempting to perform a keep alive from "${this.#internal.baseUrl}"`);
    }

    try {
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulsePerformKeepAliveSessions = {
        axios: [],
      };

      // Check if portal is accessible.
      if (!internet.success) {
        return {
          action: 'PERFORM_KEEP_ALIVE',
          success: false,
          info: internet.info,
        };
      }

      // sessions.axios[0]: Load the keep alive page.
      sessions.axios[0] = await this.#session.httpClient.post(
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

      const axios0RequestPath = sessions.axios[0].request.path;
      const axios0RequestPathValid = keepAliveResponsePath.test(axios0RequestPath);

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.performKeepAlive()', 'info', `Request path ➜ ${axios0RequestPath}`);
        debugLog('api.ts / ADTPulse.performKeepAlive()', 'info', `Request path valid ➜ ${axios0RequestPathValid}`);
      }

      // If the final URL of sessions.axios[0] is not the sync check page.
      if (!axios0RequestPathValid) {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.performKeepAlive()', 'error', `"${axios0RequestPath}" is not the keep alive page`);
        }

        return {
          action: 'PERFORM_KEEP_ALIVE',
          success: false,
          info: {
            message: `"${axios0RequestPath}" is not the keep alive page`,
          },
        };
      }

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.performKeepAlive()', 'success', `Successfully performed a keep alive from "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'PERFORM_KEEP_ALIVE',
        success: true,
        info: null,
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.performKeepAlive()', 'error', 'Method encountered an error during execution');
      stackTraceLog(errorObject);
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

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.armDisarmHandler()', 'info', `Attempting to update arm state from "${armState}" to "${arm}" on "${this.#internal.baseUrl}"`);
    }

    // If user changing to the current arm state (e.g. disarmed to disarmed).
    if (
      armState === arm
      || (
        armState === 'disarmed'
        && arm === 'off'
      )
    ) {
      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.armDisarmHandler()', 'info', `No need to change arm state from "${armState}" to "${arm}" due to its equivalence`);
      }

      return {
        action: 'ARM_DISARM_HANDLER',
        success: true,
        info: {
          newReadyButtons: [],
        },
      };
    }

    try {
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseArmDisarmHandlerSessions = {
        axios: [],
        jsdom: [],
      };

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

      // sessions.axios[0]: Emulate an arm state update request.
      sessions.axios[0] = await this.#session.httpClient.post(
        /**
         * A breakdown of the links to set arm state.
         *
         * When arming and disarming in the portal, POST requests are made.
         * However, GET requests still work from playing around.
         *
         * - When "Disarmed" mode:
         *   - Clicking the "Arm Away" button:
         *     - Initial login state:    https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=off&arm=away&sat=<sat>
         *     - After 1st state change: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=disarmed&arm=away&sat=<sat>
         *   - Clicking the "Arm Stay" button:
         *     - Initial login state:    https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=off&arm=stay&sat=<sat>
         *     - After 1st state change: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=disarmed&arm=stay&sat=<sat>
         *   - Clicking the "Arm Night" button:
         *     - Initial login state:    https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=off&arm=night&sat=<sat>
         *     - After 1st state change: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=disarmed&arm=night&sat=<sat>
         *
         * - When "Armed Away" mode:
         *   - Clicking the "Disarm" button:
         *     - Initial login state:    https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=away&arm=off&sat=<sat>
         *     - After 1st state change: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=away&arm=off&sat=<sat>
         *
         * - When "Armed Stay" mode:
         *   - Clicking the "Disarm" button:
         *     - Initial login state:    https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=stay&arm=off&sat=<sat>
         *     - After 1st state change: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=stay&arm=off&sat=<sat>
         *
         * - When "Armed Night" mode:
         *   - Clicking the "Disarm" button:
         *     - Initial login state:    https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=night&arm=off&sat=<sat>
         *     - After 1st state change: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=night+stay&arm=off&sat=<sat>
         *
         * - When alarm is triggered (when siren is SCREAMING REALLY LOUD):
         *   - Clicking the "Disarm" button when "Armed Away":
         *     - Initial login state:    https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=away&arm=off&sat=<sat>
         *     - After 1st state change: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=away&arm=off&sat=<sat>
         *   - Clicking the "Disarm" button when "Armed Stay":
         *     - Initial login state:    https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=stay&arm=off&sat=<sat>
         *     - After 1st state change: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=stay&arm=off&sat=<sat>
         *   - Clicking the "Disarm" button when "Armed Night":
         *     - Initial login state:    https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=night&arm=off&sat=<sat>
         *     - After 1st state change: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=night+stay&arm=off&sat=<sat>
         *
         * - When alarm is triggered (when siren is done screaming at you):
         *   - Clicking the "Clear Alarm" button:
         *     - Initial login state:    https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=disarmed_with_alarm&arm=off&sat=<sat>
         *     - After 1st state change: https://<subdomain>.adtpulse.com/myhome/<version>/<relativeUrl>?href=<href>&armstate=disarmed+with+alarm&arm=off&sat=<sat>
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

      const axios0RequestPath = sessions.axios[0].request.path;
      const axios0RequestPathValid = armDisarmResponsePath.test(axios0RequestPath);

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.armDisarmHandler()', 'info', `Request path ➜ ${axios0RequestPath}`);
        debugLog('api.ts / ADTPulse.armDisarmHandler()', 'info', `Request path valid ➜ ${axios0RequestPathValid}`);
      }

      // If the final URL of sessions.axios[0] is not the arm disarm page.
      if (!axios0RequestPathValid) {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.armDisarmHandler()', 'error', `"${axios0RequestPath}" is not the arm disarm page`);
        }

        return {
          action: 'ARM_DISARM_HANDLER',
          success: false,
          info: {
            message: `"${axios0RequestPath}" is not the arm disarm page`,
          },
        };
      }

      // No need to force arm if system is not being armed.
      if (arm !== 'off') {
        // Passing the force arming task to the handler.
        const forceArmResponse = await this.forceArmHandler(sessions.axios[0], relativeUrl);

        if (!forceArmResponse.success) {
          if (this.#options.debug) {
            debugLog('api.ts / ADTPulse.armDisarmHandler()', 'error', 'An error occurred in the force arm handler');
          }

          return {
            action: 'ARM_DISARM_HANDLER',
            success: false,
            info: forceArmResponse.info,
          };
        }
      }

      // After changing any arm state, the "armState" may be different from when you logged into the portal.
      this.#session.isCleanState = false;

      // Allow the security orb buttons to refresh (usually takes around 5 seconds).
      await sleep(5000);

      // sessions.axios[2]: Load the summary page.
      sessions.axios[2] = await this.#session.httpClient.get(
        `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
        this.getRequestConfig({
          headers: {
            Referer: `${this.#internal.baseUrl}/myhome/${this.#session.portalVersion}/summary/summary.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      const axios2RequestPath = sessions.axios[2].request.path;
      const axios2RequestPathValid = summaryRefreshResponsePath.test(axios2RequestPath);

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.armDisarmHandler()', 'info', `Request path ➜ ${axios2RequestPath}`);
        debugLog('api.ts / ADTPulse.armDisarmHandler()', 'info', `Request path valid ➜ ${axios2RequestPathValid}`);
      }

      // If the final URL of sessions.axios[2] is not the summary page.
      if (!axios2RequestPathValid) {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.armDisarmHandler()', 'error', `"${axios2RequestPath}" is not the summary page`);
        }

        return {
          action: 'ARM_DISARM_HANDLER',
          success: false,
          info: {
            message: `"${axios2RequestPath}" is not the summary page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions.axios[2].data !== 'string') {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.armDisarmHandler()', 'error', 'The response body of the summary page is not of type "string"');
        }

        return {
          action: 'ARM_DISARM_HANDLER',
          success: false,
          info: {
            message: 'The response body of the summary page is not of type "string"',
          },
        };
      }

      // sessions.jsdom[1]: Parse the summary page.
      sessions.jsdom[1] = new JSDOM(
        sessions.axios[2].data,
        {
          url: sessions.axios[2].config.url,
          referrer: sessions.axios[2].config.headers.Referer,
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      const jsdom1OrbSecurityButtons = sessions.jsdom[1].window.document.querySelectorAll('#divOrbSecurityButtons input');
      const parsedOrbSecurityButtons = parseOrbSecurityButtons(jsdom1OrbSecurityButtons);

      let readyButtons = parsedOrbSecurityButtons.filter((parsedOrbSecurityButton): parsedOrbSecurityButton is ADTPulseArmDisarmHandlerReadyButton => !parsedOrbSecurityButton.buttonDisabled);

      // WORKAROUND FOR ARM NIGHT BUTTON BUG: Generate a fake "parsedOrbSecurityButtons" response after system has been set to "night" mode if "Arming Night" is stuck.
      if (
        ['disarmed', 'off'].includes(armState) // Checks if state was "disarmed" (dirty) or "off" (clean).
        && ['night'].includes(arm) // Checks if user was trying to change to "night" mode.
        && readyButtons.length === 0 // Check if there are no ready (enabled) buttons.
      ) {
        readyButtons = [
          {
            buttonDisabled: false,
            buttonId: 'security_button_0',
            buttonIndex: 0,
            buttonTitle: 'Disarm',
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

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.armDisarmHandler()', 'success', `Successfully updated arm state from "${armState}" to "${arm}" on "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'ARM_DISARM_HANDLER',
        success: true,
        info: {
          newReadyButtons: readyButtons,
        },
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.armDisarmHandler()', 'error', 'Method encountered an error during execution');
      stackTraceLog(errorObject);
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

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.forceArmHandler()', 'info', `Attempting to force arm on "${this.#internal.baseUrl}"`);
    }

    try {
      const internet = await this.isPortalAccessible();
      const sessions: ADTPulseForceArmHandlerSessions = {
        axios: [],
        jsdom: [],
      };

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
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.forceArmHandler()', 'error', 'The response body of the arm disarm page is not of type "string"');
        }

        return {
          action: 'FORCE_ARM_HANDLER',
          success: false,
          info: {
            message: 'The response body of the arm disarm page is not of type "string"',
          },
        };
      }

      // sessions.jsdom[0]: Parse the arm disarm page.
      sessions.jsdom[0] = new JSDOM(
        response.data,
        {
          url: response.config.url,
          referrer: response.config.headers.Referer,
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * A breakdown of the "doSubmit" function used in the portal.
       *
       * The original function call is displayed like this:
       * - doSubmit( '/myhome/<portalVersion>/quickcontrol/serv/RunRRACommand?sat=f8e7c824-a88c-4fd2-ad4d-9b4b69039b09&href=rest\/adt\/ui\/client\/security\/setForceArm&armstate=forcearm&arm=stay' )
       * - doSubmit( '/myhome/<portalVersion>/quickcontrol/serv/RunRRACommand?sat=f8e7c824-a88c-4fd2-ad4d-9b4b69039b09&href=rest\/adt\/ui\/client\/security\/setCancelProtest' )
       *
       * After processing by the "parseDoSubmitHandlers()" function:
       * - Index 0:
       *   - relativeUrl: '/myhome/<portalVersion>/quickcontrol/serv/RunRRACommand'
       *   - urlParams
       *     - arm: 'stay'
       *     - armState: 'forcearm'
       *     - href: 'rest/adt/ui/client/security/setForceArm'
       *     - sat: 'f8e7c824-a88c-4fd2-ad4d-9b4b69039b09'
       * - Index 1:
       *   - relativeUrl: '/myhome/<portalVersion>/quickcontrol/serv/RunRRACommand'
       *   - urlParams
       *     - arm: null
       *     - armState: null
       *     - href: 'rest/adt/ui/client/security/setCancelProtest'
       *     - sat: 'f8e7c824-a88c-4fd2-ad4d-9b4b69039b09'
       *
       * Notes I've gathered during the process:
       * - Index 0 of the "parseDoSubmitHandlers()" response is the "Arm Anyway" button.
       * - Index 1 of the "parseDoSubmitHandlers()" response is the "Cancel" button.
       * - The "sat" code is required for all force arm actions (UUID, generated on every login).
       *
       * @since 1.0.0
       */
      const jsdom0DoSubmitHandlers = sessions.jsdom[0].window.document.querySelectorAll('.p_armDisarmWrapper input');
      const jsdom0ArmDisarmMessage = sessions.jsdom[0].window.document.querySelector('.p_armDisarmWrapper div:first-child');
      const parsedDoSubmitHandlers = parseDoSubmitHandlers(jsdom0DoSubmitHandlers);
      const parsedArmDisarmMessage = parseArmDisarmMessage(jsdom0ArmDisarmMessage);

      // Check if there are no force arm buttons available.
      if (
        parsedDoSubmitHandlers.length === 0
        || parsedArmDisarmMessage === null
      ) {
        // In test mode, system must detect at least 1 door or window open.
        if (this.#internal.testMode.enabled) {
          if (this.#options.debug) {
            debugLog('api.ts / ADTPulse.forceArmHandler()', 'error', 'Test mode is active but no doors or windows were open');
          }

          return {
            action: 'FORCE_ARM_HANDLER',
            success: false,
            info: {
              message: 'Test mode is active but no doors or windows were open',
            },
          };
        }

        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.forceArmHandler()', 'info', 'Force arming not required');
        }

        return {
          action: 'FORCE_ARM_HANDLER',
          success: true,
          info: null,
        };
      }

      // Helps track the latest force arming response because the use of the loop.
      const tracker: ADTPulseForceArmHandlerTracker = {
        complete: false,
        errorMessage: null,
      };

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.forceArmHandler()', 'info', `Portal Message: "${parsedArmDisarmMessage}"`);
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

        // sessions.axios[0]: Emulate a force arm state update request.
        sessions.axios[0] = await this.#session.httpClient.post(
          /**
           * A breakdown of the links to force set arm state.
           *
           * When arming and disarming in the portal, POST requests are made.
           * However, GET requests still work from playing around.
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

        const axios0RequestPath = sessions.axios[0].request.path;
        const axios0RequestPathValid = runRRACommandResponsePath.test(axios0RequestPath);

        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.forceArmHandler()', 'info', `Request path ➜ ${axios0RequestPath}`);
          debugLog('api.ts / ADTPulse.forceArmHandler()', 'info', `Request path valid ➜ ${axios0RequestPathValid}`);
        }

        // If the final URL of sessions.axios[0] is not the arm disarm page.
        if (!axios0RequestPathValid) {
          tracker.errorMessage = `"${axios0RequestPath}" is not the force arm disarm page`;

          continue;
        }

        // Make sure we are able to use the "String.prototype.includes()" method on the response data.
        if (typeof sessions.axios[0].data !== 'string') {
          tracker.errorMessage = 'The response body of the force arm disarm page is not of type "string"';

          continue;
        }

        // The server reported that the force arm failed.
        if (!sessions.axios[0].data.includes('1.0-OKAY')) {
          /**
           * A breakdown of the responses when force arming.
           *
           * "Could not process the request!</br></br>Error: 1.0-OKAY"
           * - Got this when force arming is successful.
           *
           * "Could not process the request!</br></br>Error: Method not allowed.  Allowed methods GET, HEAD"
           * - The method not allowed is an incorrect error message. They do accept POST requests.
           * - Got this when "parseDoSubmitHandlers().href" has escaped forward slashes (e.g. dirA\/dirB\/dirC).
           *
           * @since 1.0.0
           */
          tracker.errorMessage = 'The response body of the force arm disarm page does not include "1.0-OKAY"';

          continue;
        }

        // Mark the force arm as complete.
        tracker.complete = true;
        tracker.errorMessage = null;
      }

      // If "tracker.errorMessage" has a pending error message to display.
      if (tracker.errorMessage !== null) {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.forceArmHandler()', 'error', tracker.errorMessage);
        }

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
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.forceArmHandler()', 'error', 'Force arming failed because the "Arm Anyway" button was not found');
        }

        return {
          action: 'FORCE_ARM_HANDLER',
          success: false,
          info: {
            message: 'Force arming failed because the "Arm Anyway" button was not found',
          },
        };
      }

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.forceArmHandler()', 'success', `Successfully forced arm on "${this.#internal.baseUrl}"`);
      }

      return {
        action: 'FORCE_ARM_HANDLER',
        success: true,
        info: null,
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.forceArmHandler()', 'error', 'Method encountered an error during execution');
      stackTraceLog(errorObject);
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

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.isPortalAccessible()', 'info', `Attempting to check if "${this.#internal.baseUrl}" is accessible`);
    }

    try {
      // Send request using a new instance to prevent cookie jar cross-contamination.
      const response = await axios.head(
        this.#internal.baseUrl,
        this.getRequestConfig(),
      );

      if (response.status !== 200 || response.statusText !== 'OK') {
        if (this.#options.debug) {
          debugLog('api.ts / ADTPulse.isPortalAccessible()', 'info', `The portal at "${this.#internal.baseUrl}" is not accessible`);
        }

        return {
          action: 'IS_PORTAL_ACCESSIBLE',
          success: false,
          info: {
            message: `The portal at "${this.#internal.baseUrl}" is not accessible`,
          },
        };
      }

      if (this.#options.debug) {
        debugLog('api.ts / ADTPulse.isPortalAccessible()', 'success', `Successfully checked if "${this.#internal.baseUrl}" is accessible`);
      }

      return {
        action: 'IS_PORTAL_ACCESSIBLE',
        success: true,
        info: null,
      };
    } catch (error) {
      errorObject = serializeError(error);
    }

    if (this.#options.debug) {
      debugLog('api.ts / ADTPulse.isPortalAccessible()', 'error', 'Method encountered an error during execution');
      stackTraceLog(errorObject);
    }

    // We don't know how long internet maybe out, so it's best to start the session state fresh.
    this.resetSession();

    return {
      action: 'IS_PORTAL_ACCESSIBLE',
      success: false,
      info: {
        error: errorObject,
      },
    };
  }

  /**
   * ADT Pulse - Fetch error message.
   *
   * @param {ADTPulseFetchErrorMessageResponse} response - Response.
   *
   * @private
   *
   * @returns {ADTPulseFetchErrorMessageReturns}
   *
   * @since 1.0.0
   */
  private static fetchErrorMessage(response: ADTPulseFetchErrorMessageResponse): ADTPulseFetchErrorMessageReturns {
    if (typeof response.data !== 'string') {
      return null;
    }

    const sessions: ADTPulseFetchErrorMessageSessions = {
      jsdom: [],
    };

    // sessions.jsdom[0]: Parse the sign-in page.
    sessions.jsdom[0] = new JSDOM(
      response.data,
      {
        url: response.config.url,
        referrer: response.config.headers.Referer,
        contentType: 'text/html',
        pretendToBeVisual: true,
      },
    );

    const jsdom0WarnMessage = sessions.jsdom[0].window.document.querySelector('#warnMsgContents');

    if (jsdom0WarnMessage !== null) {
      return clearWhitespace(clearHtmlLineBreak(jsdom0WarnMessage.innerHTML));
    }

    return null;
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
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
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
      httpClient: cookieJarWrapper(axios.create({
        jar: new CookieJar(),
      })),
      isAuthenticated: false,
      isCleanState: true,
      networkId: null,
      portalVersion: null,
    };
  }
}
