import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { JSDOM } from 'jsdom';
import _ from 'lodash';
import { isErrorLike, serializeError } from 'serialize-error';
import { CookieJar } from 'tough-cookie';

import {
  detectApiDoSubmitHandlers,
  detectApiGatewayInformation,
  detectApiOrbSecurityButtons,
  detectApiPanelInformation,
  detectApiPanelStatus,
  detectApiSensorsInformation,
  detectApiSensorsStatus,
  detectGlobalDebugParser,
  detectGlobalPortalVersion,
} from './detect.js';
import {
  generateFakeDynatracePCHeaderValue,
  generateFakeReadyButtons,
  getFingerprintRequestHeaders,
} from './fake.js';
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
} from './regex.js';
import {
  debugLog,
  fetchErrorMessage,
  fetchMissingSatCode,
  fetchTableCells,
  findGatewayManufacturerModel,
  findNullKeys,
  findPanelManufacturer,
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
} from './utility.js';

import type {
  Lib_Api_ADTPulseAPI_ArmDisarmHandler_ArmDisarmForm,
  Lib_Api_ADTPulseAPI_ArmDisarmHandler_AxiosSetArmModeRequestPath,
  Lib_Api_ADTPulseAPI_ArmDisarmHandler_AxiosSetArmModeRequestPathValid,
  Lib_Api_ADTPulseAPI_ArmDisarmHandler_ErrorObject,
  Lib_Api_ADTPulseAPI_ArmDisarmHandler_ForceArmRequired,
  Lib_Api_ADTPulseAPI_ArmDisarmHandler_ForceArmResponse,
  Lib_Api_ADTPulseAPI_ArmDisarmHandler_IsAlarmActive,
  Lib_Api_ADTPulseAPI_ArmDisarmHandler_Options,
  Lib_Api_ADTPulseAPI_ArmDisarmHandler_ReadyButton,
  Lib_Api_ADTPulseAPI_ArmDisarmHandler_ReadyButtons,
  Lib_Api_ADTPulseAPI_ArmDisarmHandler_Returns,
  Lib_Api_ADTPulseAPI_ArmDisarmHandler_SecurityButtons,
  Lib_Api_ADTPulseAPI_ArmDisarmHandler_SecurityButtonsResponse,
  Lib_Api_ADTPulseAPI_ArmDisarmHandler_Sessions,
  Lib_Api_ADTPulseAPI_Connection,
  Lib_Api_ADTPulseAPI_Constructor_Config,
  Lib_Api_ADTPulseAPI_Constructor_InternalConfig,
  Lib_Api_ADTPulseAPI_Credentials,
  Lib_Api_ADTPulseAPI_ForceArmHandler_AxiosForceArmRequestPath,
  Lib_Api_ADTPulseAPI_ForceArmHandler_AxiosForceArmRequestPathValid,
  Lib_Api_ADTPulseAPI_ForceArmHandler_ErrorObject,
  Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmArm,
  Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmArmState,
  Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmForm,
  Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmHref,
  Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmRelativeUrl,
  Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmSat,
  Lib_Api_ADTPulseAPI_ForceArmHandler_JsdomArmDisarmArmDisarmMessage,
  Lib_Api_ADTPulseAPI_ForceArmHandler_JsdomArmDisarmDoSubmitHandlers,
  Lib_Api_ADTPulseAPI_ForceArmHandler_ParsedArmDisarmMessage,
  Lib_Api_ADTPulseAPI_ForceArmHandler_ParsedDoSubmitHandlers,
  Lib_Api_ADTPulseAPI_ForceArmHandler_RelativeUrl,
  Lib_Api_ADTPulseAPI_ForceArmHandler_Response,
  Lib_Api_ADTPulseAPI_ForceArmHandler_Returns,
  Lib_Api_ADTPulseAPI_ForceArmHandler_Sessions,
  Lib_Api_ADTPulseAPI_ForceArmHandler_Tracker,
  Lib_Api_ADTPulseAPI_GetGatewayInformation_AxiosSystemGatewayRequestPath,
  Lib_Api_ADTPulseAPI_GetGatewayInformation_AxiosSystemGatewayRequestPathValid,
  Lib_Api_ADTPulseAPI_GetGatewayInformation_ErrorObject,
  Lib_Api_ADTPulseAPI_GetGatewayInformation_FetchedTableCells,
  Lib_Api_ADTPulseAPI_GetGatewayInformation_GatewayInformation,
  Lib_Api_ADTPulseAPI_GetGatewayInformation_JsdomSystemGatewayTableCells,
  Lib_Api_ADTPulseAPI_GetGatewayInformation_Manufacturer,
  Lib_Api_ADTPulseAPI_GetGatewayInformation_Model,
  Lib_Api_ADTPulseAPI_GetGatewayInformation_ParsedManufacturer,
  Lib_Api_ADTPulseAPI_GetGatewayInformation_ParsedModel,
  Lib_Api_ADTPulseAPI_GetGatewayInformation_Returns,
  Lib_Api_ADTPulseAPI_GetGatewayInformation_ReturnsStatus,
  Lib_Api_ADTPulseAPI_GetGatewayInformation_Sessions,
  Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_AxiosSummaryRequestPath,
  Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_AxiosSummaryRequestPathValid,
  Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_ErrorObject,
  Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_JsdomSummaryOrbSecurityButtons,
  Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_MissingSatCode,
  Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_ParsedOrbSecurityButtons,
  Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_Returns,
  Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_Sessions,
  Lib_Api_ADTPulseAPI_GetPanelInformation_AxiosSystemDeviceId1RequestPath,
  Lib_Api_ADTPulseAPI_GetPanelInformation_AxiosSystemDeviceId1RequestPathValid,
  Lib_Api_ADTPulseAPI_GetPanelInformation_EmergencyKeys,
  Lib_Api_ADTPulseAPI_GetPanelInformation_ErrorObject,
  Lib_Api_ADTPulseAPI_GetPanelInformation_FetchedTableCells,
  Lib_Api_ADTPulseAPI_GetPanelInformation_JsdomSystemDeviceId1TableCells,
  Lib_Api_ADTPulseAPI_GetPanelInformation_ManufacturerProvider,
  Lib_Api_ADTPulseAPI_GetPanelInformation_PanelInformation,
  Lib_Api_ADTPulseAPI_GetPanelInformation_ParsedEmergencyKeys,
  Lib_Api_ADTPulseAPI_GetPanelInformation_ParsedManufacturer,
  Lib_Api_ADTPulseAPI_GetPanelInformation_ParsedModel,
  Lib_Api_ADTPulseAPI_GetPanelInformation_ParsedType,
  Lib_Api_ADTPulseAPI_GetPanelInformation_Returns,
  Lib_Api_ADTPulseAPI_GetPanelInformation_ReturnsStatus,
  Lib_Api_ADTPulseAPI_GetPanelInformation_Sessions,
  Lib_Api_ADTPulseAPI_GetPanelInformation_TypeModel,
  Lib_Api_ADTPulseAPI_GetPanelStatus_AxiosSummaryRequestPath,
  Lib_Api_ADTPulseAPI_GetPanelStatus_AxiosSummaryRequestPathValid,
  Lib_Api_ADTPulseAPI_GetPanelStatus_ErrorObject,
  Lib_Api_ADTPulseAPI_GetPanelStatus_JsdomSummaryOrbTextSummary,
  Lib_Api_ADTPulseAPI_GetPanelStatus_MissingSatCode,
  Lib_Api_ADTPulseAPI_GetPanelStatus_ParsedOrbTextSummary,
  Lib_Api_ADTPulseAPI_GetPanelStatus_Returns,
  Lib_Api_ADTPulseAPI_GetPanelStatus_Sessions,
  Lib_Api_ADTPulseAPI_GetRequestConfig_DefaultConfig,
  Lib_Api_ADTPulseAPI_GetRequestConfig_ExtraConfig,
  Lib_Api_ADTPulseAPI_GetRequestConfig_Returns,
  Lib_Api_ADTPulseAPI_GetSensorsInformation_AxiosSystemRequestPath,
  Lib_Api_ADTPulseAPI_GetSensorsInformation_AxiosSystemRequestPathValid,
  Lib_Api_ADTPulseAPI_GetSensorsInformation_ErrorObject,
  Lib_Api_ADTPulseAPI_GetSensorsInformation_JsdomSystemSensorsTable,
  Lib_Api_ADTPulseAPI_GetSensorsInformation_ParsedSensorsInformationTable,
  Lib_Api_ADTPulseAPI_GetSensorsInformation_Returns,
  Lib_Api_ADTPulseAPI_GetSensorsInformation_Sessions,
  Lib_Api_ADTPulseAPI_GetSensorsStatus_AxiosSummaryRequestPath,
  Lib_Api_ADTPulseAPI_GetSensorsStatus_AxiosSummaryRequestPathValid,
  Lib_Api_ADTPulseAPI_GetSensorsStatus_ErrorObject,
  Lib_Api_ADTPulseAPI_GetSensorsStatus_JsdomSummaryOrbSensors,
  Lib_Api_ADTPulseAPI_GetSensorsStatus_MissingSatCode,
  Lib_Api_ADTPulseAPI_GetSensorsStatus_ParsedOrbSensors,
  Lib_Api_ADTPulseAPI_GetSensorsStatus_Returns,
  Lib_Api_ADTPulseAPI_GetSensorsStatus_Sessions,
  Lib_Api_ADTPulseAPI_HandleLoginFailure_ErrorMessage,
  Lib_Api_ADTPulseAPI_HandleLoginFailure_RequestPath,
  Lib_Api_ADTPulseAPI_HandleLoginFailure_Returns,
  Lib_Api_ADTPulseAPI_HandleLoginFailure_Session,
  Lib_Api_ADTPulseAPI_Internal,
  Lib_Api_ADTPulseAPI_IsAuthenticated_Returns,
  Lib_Api_ADTPulseAPI_Login_AxiosIndexRequestPath,
  Lib_Api_ADTPulseAPI_Login_AxiosIndexRequestPathValid,
  Lib_Api_ADTPulseAPI_Login_AxiosSignInRequestPath,
  Lib_Api_ADTPulseAPI_Login_AxiosSignInRequestPathValid,
  Lib_Api_ADTPulseAPI_Login_ErrorObject,
  Lib_Api_ADTPulseAPI_Login_LoginForm,
  Lib_Api_ADTPulseAPI_Login_MatchNetworkId,
  Lib_Api_ADTPulseAPI_Login_MatchSatCode,
  Lib_Api_ADTPulseAPI_Login_PortalVersion,
  Lib_Api_ADTPulseAPI_Login_Returns,
  Lib_Api_ADTPulseAPI_Login_Sessions,
  Lib_Api_ADTPulseAPI_Logout_AxiosSignoutRequestPath,
  Lib_Api_ADTPulseAPI_Logout_AxiosSignoutRequestPathValid,
  Lib_Api_ADTPulseAPI_Logout_ErrorObject,
  Lib_Api_ADTPulseAPI_Logout_Returns,
  Lib_Api_ADTPulseAPI_Logout_Sessions,
  Lib_Api_ADTPulseAPI_NewInformationDispatcher_Data,
  Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataDebugParser,
  Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataDoSubmitHandlers,
  Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataGatewayInformation,
  Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataHash,
  Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataOrbSecurityButtons,
  Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataPanelInformation,
  Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataPanelStatus,
  Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataPortalVersion,
  Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataSensorsInformation,
  Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataSensorsStatus,
  Lib_Api_ADTPulseAPI_NewInformationDispatcher_DetectedNew,
  Lib_Api_ADTPulseAPI_NewInformationDispatcher_Returns,
  Lib_Api_ADTPulseAPI_NewInformationDispatcher_Type,
  Lib_Api_ADTPulseAPI_PerformKeepAlive_AxiosKeepAliveRequestPath,
  Lib_Api_ADTPulseAPI_PerformKeepAlive_AxiosKeepAliveRequestPathValid,
  Lib_Api_ADTPulseAPI_PerformKeepAlive_ErrorObject,
  Lib_Api_ADTPulseAPI_PerformKeepAlive_Returns,
  Lib_Api_ADTPulseAPI_PerformKeepAlive_Sessions,
  Lib_Api_ADTPulseAPI_PerformSyncCheck_AxiosSyncCheckRequestPath,
  Lib_Api_ADTPulseAPI_PerformSyncCheck_AxiosSyncCheckRequestPathValid,
  Lib_Api_ADTPulseAPI_PerformSyncCheck_ErrorObject,
  Lib_Api_ADTPulseAPI_PerformSyncCheck_Returns,
  Lib_Api_ADTPulseAPI_PerformSyncCheck_Sessions,
  Lib_Api_ADTPulseAPI_ResetSession_Returns,
  Lib_Api_ADTPulseAPI_Session,
  Lib_Api_ADTPulseAPI_SetPanelStatus_ArmDisarmResponse,
  Lib_Api_ADTPulseAPI_SetPanelStatus_ArmFrom,
  Lib_Api_ADTPulseAPI_SetPanelStatus_ArmTo,
  Lib_Api_ADTPulseAPI_SetPanelStatus_DisarmResponse,
  Lib_Api_ADTPulseAPI_SetPanelStatus_ErrorObject,
  Lib_Api_ADTPulseAPI_SetPanelStatus_ForceArmRequired,
  Lib_Api_ADTPulseAPI_SetPanelStatus_IsAlarmActive,
  Lib_Api_ADTPulseAPI_SetPanelStatus_IsAlarmCurrentlyActive,
  Lib_Api_ADTPulseAPI_SetPanelStatus_ReadyButton,
  Lib_Api_ADTPulseAPI_SetPanelStatus_ReadyButtons,
  Lib_Api_ADTPulseAPI_SetPanelStatus_Returns,
  Lib_Api_ADTPulseAPI_SetPanelStatus_SecurityButtons,
  Lib_Api_ADTPulseAPI_SetPanelStatus_SecurityButtonsResponse,
} from '../types/lib/api.d.ts';

/**
 * Lib - API.
 *
 * Drives all interactions with the ADT Pulse portal by emulating a real
 * browser session, so the plugin can authenticate, read device state, and
 * arm or disarm the security panel without an official API.
 *
 * @since 1.0.0
 */
export class ADTPulseAPI {
  /**
   * ADT Pulse API - Connection.
   *
   * Stores the portal subdomain so every request made by this instance
   * consistently targets the same regional ADT Pulse host.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #connection: Lib_Api_ADTPulseAPI_Connection;

  /**
   * ADT Pulse API - Credentials.
   *
   * Holds the username, password, and fingerprint used to authenticate,
   * allowing the instance to sign back in whenever the session expires.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #credentials: Lib_Api_ADTPulseAPI_Credentials;

  /**
   * ADT Pulse API - Internal.
   *
   * Keeps instance-level runtime settings, such as the base URL, debug
   * mode, logger, and test mode, that shape how requests are performed.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #internal: Lib_Api_ADTPulseAPI_Internal;

  /**
   * ADT Pulse API - Session.
   *
   * Tracks the mutable state of the current portal session, including the
   * HTTP client, authentication status, and recovered portal metadata.
   *
   * @private
   *
   * @since 1.0.0
   */
  #session: Lib_Api_ADTPulseAPI_Session;

  /**
   * Lib - API - Constructor.
   *
   * Applies user configuration onto fresh connection, credentials,
   * internal, and session containers, and slows the arm wait time when
   * the plugin is configured for reduced operational speed.
   *
   * @param {Lib_Api_ADTPulseAPI_Constructor_Config}         config         - Config.
   * @param {Lib_Api_ADTPulseAPI_Constructor_InternalConfig} internalConfig - Internal config.
   *
   * @since 1.0.0
   */
  public constructor(config: Lib_Api_ADTPulseAPI_Constructor_Config, internalConfig: Lib_Api_ADTPulseAPI_Constructor_InternalConfig) {
    // Set connection options.
    this.#connection = {
      subdomain: config['subdomain'],
    };

    // Set credentials options.
    this.#credentials = {
      fingerprint: config['fingerprint'],
      password: config['password'],
      username: config['username'],
    };

    // Set internal options.
    this.#internal = {
      baseUrl: internalConfig['baseUrl'] ?? `https://${this.#connection['subdomain']}.adtpulse.com`,
      debug: internalConfig['debug'] ?? false,
      logger: internalConfig['logger'] ?? null,
      reportedHashes: [],
      testMode: {
        enabled: (internalConfig['testMode'] !== undefined && internalConfig['testMode']['enabled'] !== undefined) ? internalConfig['testMode']['enabled'] : false,
        isSystemDisarmedBeforeTest: (internalConfig['testMode'] !== undefined && internalConfig['testMode']['isSystemDisarmedBeforeTest'] !== undefined) ? internalConfig['testMode']['isSystemDisarmedBeforeTest'] : false,
      },
      waitTimeAfterArm: 5000, // 5 seconds.
    };

    // Set session options.
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
    if (config['speed'] !== 1) {
      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.constructor()', 'warn', `Plugin is now running under ${config['speed']}x operational speed. You may see slower device updates`);
      }

      // Should be statically calculated to prevent excessive waiting.
      switch (config['speed']) {
        case 0.75: {
          this.#internal.waitTimeAfterArm = 6000; // 6 seconds.
          break;
        }

        case 0.5: {
          this.#internal.waitTimeAfterArm = 7000; // 7 seconds.
          break;
        }

        case 0.25: {
          this.#internal.waitTimeAfterArm = 8000; // 8 seconds.
          break;
        }

        default: {
          break;
        }
      }
    }

    return;
  }

  /**
   * Lib - API - Login.
   *
   * Emulates the portal sign-in flow so the instance can establish an
   * authenticated session and capture the portal version, network ID,
   * and backup sat code needed by later requests.
   *
   * @returns {Lib_Api_ADTPulseAPI_Login_Returns}
   *
   * @since 1.0.0
   */
  public async login(): Lib_Api_ADTPulseAPI_Login_Returns {
    let errorObject: Lib_Api_ADTPulseAPI_Login_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.login()', 'info', `Attempting to login to "${this.#internal['baseUrl']}"`);
    }

    try {
      const sessions: Lib_Api_ADTPulseAPI_Login_Sessions = {};

      // Check if "this instance" was already authenticated.
      if (this.isAuthenticated() === true) {
        if (this.#internal['debug'] === true) {
          debugLog(
            this.#internal['logger'],
            'api.ts / ADTPulseAPI.login()',
            'info',
            [
              'Already logged in',
              [
                '(',
                [
                  `backup sat code: ${this.#session['backupSatCode']}`,
                  `network id: ${this.#session['networkId']}`,
                  `portal version: ${this.#session['portalVersion']}`,
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
            backupSatCode: this.#session['backupSatCode'],
            networkId: this.#session['networkId'],
            portalVersion: this.#session['portalVersion'],
          },
        };
      }

      // sessions.axiosIndex: Load the homepage.
      sessions.axiosIndex = await this.#session['httpClient'].get<unknown>(
        `${this.#internal['baseUrl']}/`,
        this.getRequestConfig(),
      );

      // Check for server error response.
      if (sessions['axiosIndex'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.login()', 'error', `The remote server responded with a HTTP ${sessions['axiosIndex'].status} status code`);
        }

        return {
          action: 'LOGIN',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosIndex'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosIndex']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.login()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'LOGIN',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosIndexRequestPath: Lib_Api_ADTPulseAPI_Login_AxiosIndexRequestPath = sessions['axiosIndex']['request'].path;
      const axiosIndexRequestPathValid: Lib_Api_ADTPulseAPI_Login_AxiosIndexRequestPathValid = requestPathAccessSignIn.test(axiosIndexRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.login()', 'info', `Request path ➜ ${axiosIndexRequestPath}`);
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.login()', 'info', `Request path valid ➜ ${axiosIndexRequestPathValid}`);
      }

      // If the final URL of sessions.axiosIndex is not the sign-in page.
      if (axiosIndexRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.login()', 'error', `"${axiosIndexRequestPath} is not the sign-in page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosIndexRequestPath, sessions['axiosIndex']);

        return {
          action: 'LOGIN',
          success: false,
          info: {
            message: `"${axiosIndexRequestPath} is not the sign-in page`,
          },
        };
      }

      // Build an "application/x-www-form-urlencoded" form for use with logging in.
      const loginForm: Lib_Api_ADTPulseAPI_Login_LoginForm = new URLSearchParams();

      loginForm.append('usernameForm', this.#credentials['username']);
      loginForm.append('passwordForm', this.#credentials['password']);
      loginForm.append('sun', 'yes'); // Remember my username.
      loginForm.append('networkid', ''); // Blank if URL does not have the "networkid" param.
      loginForm.append('fingerprint', this.#credentials['fingerprint']);

      /**
       * Detailed parsing information for "portalVersion".
       *
       * Responses may be inaccurate or missing (patent US20170070361A1). The
       * sign-in path (e.g. "/myhome/16.0.0-131/access/signin.jsp") becomes
       * "16.0.0-131" once processed by the "replace()" function/method.
       *
       * @since 1.0.0
       */
      this.#session.portalVersion = axiosIndexRequestPath.replace(requestPathAccessSignIn, '$2') as Lib_Api_ADTPulseAPI_Login_PortalVersion;

      /**
       * Check if "portalVersion" needs documenting or testing.
       *
       * Parts not shown here will not be tracked, documented, or tested
       * (patent US20170070361A1). Known "version" values span "16.0.0-131"
       * through "30.0.0-61" across the portal releases observed so far.
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
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.login()', 'error', `The remote server responded with a HTTP ${sessions['axiosSignIn'].status} status code`);
        }

        return {
          action: 'LOGIN',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosSignIn'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosSignIn']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.login()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'LOGIN',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSignInRequestPath: Lib_Api_ADTPulseAPI_Login_AxiosSignInRequestPath = sessions['axiosSignIn']['request'].path;
      const axiosSignInRequestPathValid: Lib_Api_ADTPulseAPI_Login_AxiosSignInRequestPathValid = requestPathSummarySummary.test(axiosSignInRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.login()', 'info', `Request path ➜ ${axiosSignInRequestPath}`);
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.login()', 'info', `Request path valid ➜ ${axiosSignInRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSignIn is not the summary page.
      if (axiosSignInRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.login()', 'error', `"${axiosSignInRequestPath}" is not the summary page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSignInRequestPath, sessions['axiosSignIn']);

        return {
          action: 'LOGIN',
          success: false,
          info: {
            message: `"${axiosSignInRequestPath}" is not the summary page`,
          },
        };
      }

      // Make sure we are able to use the "String.prototype.match()" method on the response data.
      if (typeof sessions['axiosSignIn'].data !== 'string') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.login()', 'error', 'The response body of the summary page is not of type "string"');
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
       * Matches look like "?networkid=1234567890" then "1234567890". Only the
       * network ID (site ID) needs storing, and should be two elements. It is
       * loosely matched to take unexpected changes into account (logout links).
       *
       * @since 1.0.0
       */
      const matchNetworkId: Lib_Api_ADTPulseAPI_Login_MatchNetworkId = sessions['axiosSignIn'].data.match(paramNetworkId);
      this.#session.networkId = (matchNetworkId !== null && matchNetworkId.length >= 2) ? matchNetworkId[1]! : null;

      /**
       * Original matches for the sat code.
       *
       * Matches look like "sat=<uuid>" then "<uuid>". Only the sat code needs
       * storing (two elements, loosely matched). If system status was
       * unavailable at login, this stays null until "summary.jsp" recovers it.
       *
       * @since 1.0.0
       */
      const matchSatCode: Lib_Api_ADTPulseAPI_Login_MatchSatCode = sessions['axiosSignIn'].data.match(paramSat);
      this.#session.backupSatCode = (matchSatCode !== null && matchSatCode.length >= 2) ? matchSatCode[1]! : null;

      // If backup sat code was unavailable at this time.
      if (this.#session['backupSatCode'] === null && this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.login()', 'warn', 'Unable to backup sat code, will try again when system becomes available');
      }

      // Mark the session for "this instance" as authenticated.
      this.#session.isAuthenticated = true;

      if (this.#internal['debug'] === true) {
        debugLog(
          this.#internal['logger'],
          'api.ts / ADTPulseAPI.login()',
          'success',
          [
            'Login successful',
            [
              '(',
              [
                `backup sat code: ${this.#session['backupSatCode']}`,
                `network id: ${this.#session['networkId']}`,
                `portal version: ${this.#session['portalVersion']}`,
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
          backupSatCode: this.#session['backupSatCode'],
          networkId: this.#session['networkId'],
          portalVersion: this.#session['portalVersion'],
        },
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.login()', 'error', 'Method encountered an error during execution');
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
   * Lib - API - Logout.
   *
   * Emulates the portal sign-out flow so the session ends cleanly on the
   * server, then resets local session state for future logins.
   *
   * @returns {Lib_Api_ADTPulseAPI_Logout_Returns}
   *
   * @since 1.0.0
   */
  public async logout(): Lib_Api_ADTPulseAPI_Logout_Returns {
    let errorObject: Lib_Api_ADTPulseAPI_Logout_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.logout()', 'info', `Attempting to logout of "${this.#internal['baseUrl']}"`);
    }

    try {
      const sessions: Lib_Api_ADTPulseAPI_Logout_Sessions = {};

      // Check if "this instance" was already de-authenticated.
      if (this.isAuthenticated() === false) {
        if (this.#internal['debug'] === true) {
          debugLog(
            this.#internal['logger'],
            'api.ts / ADTPulseAPI.logout()',
            'info',
            [
              'Already logged out',
              [
                '(',
                [
                  `backup sat code: ${this.#session['backupSatCode']}`,
                  `network id: ${this.#session['networkId']}`,
                  `portal version: ${this.#session['portalVersion']}`,
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
            backupSatCode: this.#session['backupSatCode'],
            networkId: this.#session['networkId'],
            portalVersion: this.#session['portalVersion'],
          },
        };
      }

      // sessions.axiosSignout: Emulate a sign-out request.
      sessions.axiosSignout = await this.#session['httpClient'].get<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/access/signout.jsp?networkid=${this.#session['networkId']}&partner=adt`,
        this.getRequestConfig({
          headers: {
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/summary/summary.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosSignout'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.logout()', 'error', `The remote server responded with a HTTP ${sessions['axiosSignout'].status} status code`);
        }

        return {
          action: 'LOGOUT',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosSignout'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosSignout']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.logout()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'LOGOUT',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSignoutRequestPath: Lib_Api_ADTPulseAPI_Logout_AxiosSignoutRequestPath = sessions['axiosSignout']['request'].path;
      const axiosSignoutRequestPathValid: Lib_Api_ADTPulseAPI_Logout_AxiosSignoutRequestPathValid = requestPathAccessSignInNetworkIdXxPartnerAdt.test(axiosSignoutRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.logout()', 'info', `Request path ➜ ${axiosSignoutRequestPath}`);
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.logout()', 'info', `Request path valid ➜ ${axiosSignoutRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSignout is not the sign-in page with "networkid" and "partner=adt" parameters.
      if (axiosSignoutRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.logout()', 'error', `"${axiosSignoutRequestPath}" is not the sign-in page with "networkid" and "partner=adt" parameters`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSignoutRequestPath, sessions['axiosSignout']);

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

      if (this.#internal['debug'] === true) {
        debugLog(
          this.#internal['logger'],
          'api.ts / ADTPulseAPI.logout()',
          'success',
          [
            'Logout successful',
            [
              '(',
              [
                `backup sat code: ${this.#session['backupSatCode']}`,
                `network id: ${this.#session['networkId']}`,
                `portal version: ${this.#session['portalVersion']}`,
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
          backupSatCode: this.#session['backupSatCode'],
          networkId: this.#session['networkId'],
          portalVersion: this.#session['portalVersion'],
        },
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.logout()', 'error', 'Method encountered an error during execution');
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
   * Lib - API - Get Gateway Information.
   *
   * Scrapes the system gateway page so the plugin can expose gateway
   * details, such as manufacturer, model, network, and update times.
   *
   * @returns {Lib_Api_ADTPulseAPI_GetGatewayInformation_Returns}
   *
   * @since 1.0.0
   */
  public async getGatewayInformation(): Lib_Api_ADTPulseAPI_GetGatewayInformation_Returns {
    let errorObject: Lib_Api_ADTPulseAPI_GetGatewayInformation_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getGatewayInformation()', 'info', `Attempting to retrieve gateway information from "${this.#internal['baseUrl']}"`);
    }

    try {
      const sessions: Lib_Api_ADTPulseAPI_GetGatewayInformation_Sessions = {};

      // sessions.axiosSystemGateway: Load the system gateway page.
      sessions.axiosSystemGateway = await this.#session['httpClient'].get<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/system/gateway.jsp`,
        this.getRequestConfig({
          headers: {
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/system/system.jsp`,
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosSystemGateway'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getGatewayInformation()', 'error', `The remote server responded with a HTTP ${sessions['axiosSystemGateway'].status} status code`);
        }

        return {
          action: 'GET_GATEWAY_INFORMATION',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosSystemGateway'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosSystemGateway']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getGatewayInformation()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_GATEWAY_INFORMATION',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSystemGatewayRequestPath: Lib_Api_ADTPulseAPI_GetGatewayInformation_AxiosSystemGatewayRequestPath = sessions['axiosSystemGateway']['request'].path;
      const axiosSystemGatewayRequestPathValid: Lib_Api_ADTPulseAPI_GetGatewayInformation_AxiosSystemGatewayRequestPathValid = requestPathSystemGateway.test(axiosSystemGatewayRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getGatewayInformation()', 'info', `Request path ➜ ${axiosSystemGatewayRequestPath}`);
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getGatewayInformation()', 'info', `Request path valid ➜ ${axiosSystemGatewayRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSystemGateway is not the system gateway page.
      if (axiosSystemGatewayRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getGatewayInformation()', 'error', `"${axiosSystemGatewayRequestPath}" is not the system gateway page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSystemGatewayRequestPath, sessions['axiosSystemGateway']);

        return {
          action: 'GET_GATEWAY_INFORMATION',
          success: false,
          info: {
            message: `"${axiosSystemGatewayRequestPath}" is not the system gateway page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions['axiosSystemGateway'].data !== 'string') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getGatewayInformation()', 'error', 'The response body of the system gateway page is not of type "string"');
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
        sessions['axiosSystemGateway'].data,
        {
          url: sessions['axiosSystemGateway'].config.url,
          referrer: sessions['axiosSystemGateway'].config.headers['Referer'],
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * Detailed parsing information for "gatewayInformation".
       *
       * Responses may be inaccurate or missing (patent US20170070361A1). Table
       * rows with cells like "Manufacturer:" and "Model:" become keyed arrays
       * once processed by the "fetchTableCells()" function/method.
       *
       * @since 1.0.0
       */
      const jsdomSystemGatewayTableCells: Lib_Api_ADTPulseAPI_GetGatewayInformation_JsdomSystemGatewayTableCells = sessions['jsdomSystemGateway'].window.document.querySelectorAll('td');
      const fetchedTableCells: Lib_Api_ADTPulseAPI_GetGatewayInformation_FetchedTableCells = fetchTableCells(
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
      const manufacturer: Lib_Api_ADTPulseAPI_GetGatewayInformation_Manufacturer = _.get(fetchedTableCells, [
        'Manufacturer:',
        0,
      ], null);
      const model: Lib_Api_ADTPulseAPI_GetGatewayInformation_Model = _.get(fetchedTableCells, [
        'Model:',
        0,
      ], null);
      const parsedManufacturer: Lib_Api_ADTPulseAPI_GetGatewayInformation_ParsedManufacturer = findGatewayManufacturerModel('manufacturer', manufacturer, model);
      const parsedModel: Lib_Api_ADTPulseAPI_GetGatewayInformation_ParsedModel = findGatewayManufacturerModel('model', manufacturer, model);
      const gatewayInformation: Lib_Api_ADTPulseAPI_GetGatewayInformation_GatewayInformation = {
        communication: {
          broadbandConnectionStatus: _.get(fetchedTableCells, [
            'Broadband Connection Status:',
            0,
          ], null),
          cellularConnectionStatus: _.get(fetchedTableCells, [
            'Cellular Connection Status:',
            0,
          ], null),
          cellularSignalStrength: _.get(fetchedTableCells, [
            'Cellular Signal Strength:',
            0,
          ], null),
          primaryConnectionType: _.get(fetchedTableCells, [
            'Primary Connection Type:',
            0,
          ], null),
        },
        manufacturer: parsedManufacturer,
        model: parsedModel,
        network: {
          broadband: {
            ip: _.get(fetchedTableCells, [
              'Broadband LAN IP Address:',
              0,
            ], null),
            mac: _.get(fetchedTableCells, [
              'Broadband LAN MAC:',
              0,
            ], null),
          },
          device: {
            ip: _.get(fetchedTableCells, [
              'Device LAN IP Address:',
              0,
            ], null),
            mac: _.get(fetchedTableCells, [
              'Device LAN MAC:',
              0,
            ], null),
          },
          router: {
            lanIp: _.get(fetchedTableCells, [
              'Router LAN IP Address:',
              0,
            ], null),
            wanIp: _.get(fetchedTableCells, [
              'Router WAN IP Address:',
              0,
            ], null),
          },
        },
        serialNumber: _.get(fetchedTableCells, [
          'Serial Number:',
          0,
        ], null),
        status: _.get(fetchedTableCells, [
          'Status:',
          0,
        ], null) as Lib_Api_ADTPulseAPI_GetGatewayInformation_ReturnsStatus,
        update: {
          last: _.get(fetchedTableCells, [
            'Last Update:',
            0,
          ], null),
          next: _.get(fetchedTableCells, [
            'Next Update:',
            0,
          ], null),
        },
        versions: {
          firmware: _.get(fetchedTableCells, [
            'Firmware Version:',
            0,
          ], null),
          hardware: _.get(fetchedTableCells, [
            'Hardware Version:',
            0,
          ], null),
        },
      };

      /**
       * Check if "gatewayInformation" needs documenting or testing.
       *
       * Parts not shown here will not be tracked, documented, or tested
       * (patent US20170070361A1). Known "status" values are "Offline",
       * "Online", and "Status Unknown".
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('gateway-information', gatewayInformation);

      // Check if the parsing function is parsing data incorrectly.
      await this.newInformationDispatcher('debug-parser', {
        method: 'getGatewayInformation',
        response: fetchedTableCells,
        rawHtml: sessions['axiosSystemGateway'].data,
      });

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getGatewayInformation()', 'success', `Successfully retrieved gateway information from "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'GET_GATEWAY_INFORMATION',
        success: true,
        info: gatewayInformation,
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getGatewayInformation()', 'error', 'Method encountered an error during execution');
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
   * Lib - API - Get Panel Information.
   *
   * Scrapes the system device page so the plugin can expose panel details,
   * such as manufacturer, type, model, emergency keys, and status.
   *
   * @returns {Lib_Api_ADTPulseAPI_GetPanelInformation_Returns}
   *
   * @since 1.0.0
   */
  public async getPanelInformation(): Lib_Api_ADTPulseAPI_GetPanelInformation_Returns {
    let errorObject: Lib_Api_ADTPulseAPI_GetPanelInformation_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelInformation()', 'info', `Attempting to retrieve panel information from "${this.#internal['baseUrl']}"`);
    }

    try {
      const sessions: Lib_Api_ADTPulseAPI_GetPanelInformation_Sessions = {};

      // sessions.axiosSystemDeviceId1: Load the system device id 1 page.
      sessions.axiosSystemDeviceId1 = await this.#session['httpClient'].get<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/system/device.jsp?id=1`,
        this.getRequestConfig({
          headers: {
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/system/system.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosSystemDeviceId1'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelInformation()', 'error', `The remote server responded with a HTTP ${sessions['axiosSystemDeviceId1'].status} status code`);
        }

        return {
          action: 'GET_PANEL_INFORMATION',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosSystemDeviceId1'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosSystemDeviceId1']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelInformation()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_PANEL_INFORMATION',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSystemDeviceId1RequestPath: Lib_Api_ADTPulseAPI_GetPanelInformation_AxiosSystemDeviceId1RequestPath = sessions['axiosSystemDeviceId1']['request'].path;
      const axiosSystemDeviceId1RequestPathValid: Lib_Api_ADTPulseAPI_GetPanelInformation_AxiosSystemDeviceId1RequestPathValid = requestPathSystemDeviceId1.test(axiosSystemDeviceId1RequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelInformation()', 'info', `Request path ➜ ${axiosSystemDeviceId1RequestPath}`);
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelInformation()', 'info', `Request path valid ➜ ${axiosSystemDeviceId1RequestPathValid}`);
      }

      // If the final URL of sessions.axiosSystemDeviceId1 is not the system device id 1 page.
      if (axiosSystemDeviceId1RequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelInformation()', 'error', `"${axiosSystemDeviceId1RequestPath}" is not the system device id 1 page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSystemDeviceId1RequestPath, sessions['axiosSystemDeviceId1']);

        return {
          action: 'GET_PANEL_INFORMATION',
          success: false,
          info: {
            message: `"${axiosSystemDeviceId1RequestPath}" is not the system device id 1 page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions['axiosSystemDeviceId1'].data !== 'string') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelInformation()', 'error', 'The response body of the system device id 1 page is not of type "string"');
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
        sessions['axiosSystemDeviceId1'].data,
        {
          url: sessions['axiosSystemDeviceId1'].config.url,
          referrer: sessions['axiosSystemDeviceId1'].config.headers['Referer'],
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * Detailed parsing information for "panelInformation".
       *
       * Responses may be inaccurate or missing (patent US20170070361A1). Table
       * rows with cells like "Manufacturer/Provider:" and "Emergency Keys:"
       * become keyed arrays once processed by "fetchTableCells()".
       *
       * @since 1.0.0
       */
      const jsdomSystemDeviceId1TableCells: Lib_Api_ADTPulseAPI_GetPanelInformation_JsdomSystemDeviceId1TableCells = sessions['jsdomSystemDeviceId1'].window.document.querySelectorAll('td');
      const fetchedTableCells: Lib_Api_ADTPulseAPI_GetPanelInformation_FetchedTableCells = fetchTableCells(
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
      const emergencyKeys: Lib_Api_ADTPulseAPI_GetPanelInformation_EmergencyKeys = _.get(fetchedTableCells, [
        'Emergency Keys:',
        0,
      ], null);
      const manufacturerProvider: Lib_Api_ADTPulseAPI_GetPanelInformation_ManufacturerProvider = _.get(fetchedTableCells, [
        'Manufacturer/Provider:',
        0,
      ], null);
      const typeModel: Lib_Api_ADTPulseAPI_GetPanelInformation_TypeModel = _.get(fetchedTableCells, [
        'Type/Model:',
        0,
      ], null);
      const parsedEmergencyKeys: Lib_Api_ADTPulseAPI_GetPanelInformation_ParsedEmergencyKeys = (emergencyKeys !== null) ? emergencyKeys.match(new RegExp(textPanelEmergencyKeys, 'g')) : null;
      const parsedManufacturer: Lib_Api_ADTPulseAPI_GetPanelInformation_ParsedManufacturer = findPanelManufacturer(manufacturerProvider, typeModel);
      const parsedType: Lib_Api_ADTPulseAPI_GetPanelInformation_ParsedType = (typeModel !== null && typeModel.includes(' - ') === true) ? typeModel.replace(textPanelTypeModel, '$1') : null;
      const parsedModel: Lib_Api_ADTPulseAPI_GetPanelInformation_ParsedModel = (typeModel !== null) ? typeModel.replace(textPanelTypeModel, '$2') : null;
      const panelInformation: Lib_Api_ADTPulseAPI_GetPanelInformation_PanelInformation = {
        emergencyKeys: parsedEmergencyKeys,
        manufacturer: parsedManufacturer,
        masterCode: _.get(fetchedTableCells, [
          'Security Panel Master Code:',
          0,
        ], null),
        provider: 'ADT',
        type: parsedType,
        model: parsedModel,
        status: _.get(fetchedTableCells, [
          'Status:',
          0,
        ], null) as Lib_Api_ADTPulseAPI_GetPanelInformation_ReturnsStatus,
      };

      /**
       * Check if "panelInformation" needs documenting or testing.
       *
       * Parts not shown here will not be tracked, documented, or tested
       * (patent US20170070361A1). Known "status" values are "Offline",
       * "Online", and "Status Unknown".
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('panel-information', panelInformation);

      // Check if the parsing function is parsing data incorrectly.
      await this.newInformationDispatcher('debug-parser', {
        method: 'getPanelInformation',
        response: fetchedTableCells,
        rawHtml: sessions['axiosSystemDeviceId1'].data,
      });

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelInformation()', 'success', `Successfully retrieved panel information from "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'GET_PANEL_INFORMATION',
        success: true,
        info: panelInformation,
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelInformation()', 'error', 'Method encountered an error during execution');
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
   * Lib - API - Get Panel Status.
   *
   * Scrapes the summary page orb text so the plugin can report the current
   * panel arm state, statuses, and notes to Homebridge accessories.
   *
   * @returns {Lib_Api_ADTPulseAPI_GetPanelStatus_Returns}
   *
   * @since 1.0.0
   */
  public async getPanelStatus(): Lib_Api_ADTPulseAPI_GetPanelStatus_Returns {
    let errorObject: Lib_Api_ADTPulseAPI_GetPanelStatus_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelStatus()', 'info', `Attempting to retrieve panel status from "${this.#internal['baseUrl']}"`);
    }

    try {
      const sessions: Lib_Api_ADTPulseAPI_GetPanelStatus_Sessions = {};

      // sessions.axiosSummary: Load the summary page.
      sessions.axiosSummary = await this.#session['httpClient'].get<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/summary/summary.jsp`,
        this.getRequestConfig({
          headers: {
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/summary/summary.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosSummary'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelStatus()', 'error', `The remote server responded with a HTTP ${sessions['axiosSummary'].status} status code`);
        }

        return {
          action: 'GET_PANEL_STATUS',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosSummary'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosSummary']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelStatus()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_PANEL_STATUS',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSummaryRequestPath: Lib_Api_ADTPulseAPI_GetPanelStatus_AxiosSummaryRequestPath = sessions['axiosSummary']['request'].path;
      const axiosSummaryRequestPathValid: Lib_Api_ADTPulseAPI_GetPanelStatus_AxiosSummaryRequestPathValid = requestPathSummarySummary.test(axiosSummaryRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelStatus()', 'info', `Request path ➜ ${axiosSummaryRequestPath}`);
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelStatus()', 'info', `Request path valid ➜ ${axiosSummaryRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSummary is not the summary page.
      if (axiosSummaryRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelStatus()', 'error', `"${axiosSummaryRequestPath}" is not the summary page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSummaryRequestPath, sessions['axiosSummary']);

        return {
          action: 'GET_PANEL_STATUS',
          success: false,
          info: {
            message: `"${axiosSummaryRequestPath}" is not the summary page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions['axiosSummary'].data !== 'string') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelStatus()', 'error', 'The response body of the summary page is not of type "string"');
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
      if (this.#session['backupSatCode'] === null) {
        const missingSatCode: Lib_Api_ADTPulseAPI_GetPanelStatus_MissingSatCode = fetchMissingSatCode(sessions['axiosSummary']);

        if (missingSatCode !== null) {
          if (this.#internal['debug'] === true) {
            debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelStatus()', 'success', 'Backup sat code was successfully recovered from previous failed retrieval');
          }

          this.#session.backupSatCode = missingSatCode;
        }
      }

      // sessions.jsdomSummary: Parse the summary page.
      sessions.jsdomSummary = new JSDOM(
        sessions['axiosSummary'].data,
        {
          url: sessions['axiosSummary'].config.url,
          referrer: sessions['axiosSummary'].config.headers['Referer'],
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * Detailed parsing information for "panelStatus".
       *
       * Responses may be inaccurate or missing (patent US20170070361A1). Text
       * like "Disarmed. All Quiet." becomes "panelStates", "panelStatuses",
       * and "panelNotes" arrays once processed by "parseOrbTextSummary()".
       *
       * @since 1.0.0
       */
      const jsdomSummaryOrbTextSummary: Lib_Api_ADTPulseAPI_GetPanelStatus_JsdomSummaryOrbTextSummary = sessions['jsdomSummary'].window.document.querySelector('#divOrbTextSummary');
      const parsedOrbTextSummary: Lib_Api_ADTPulseAPI_GetPanelStatus_ParsedOrbTextSummary = parseOrbTextSummary(jsdomSummaryOrbTextSummary);

      /**
       * Check if "panelStatus" needs documenting or testing.
       *
       * Parts not shown here will not be tracked, documented, or tested
       * (patent US20170070361A1). Tracked values cover "state" (e.g. "Armed
       * Away"), "status" (e.g. "All Quiet"), and "note" (e.g. alarm notes).
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('panel-status', parsedOrbTextSummary);

      // Check if the parsing function is parsing data incorrectly.
      await this.newInformationDispatcher('debug-parser', {
        method: 'getPanelStatus',
        response: parsedOrbTextSummary,
        rawHtml: sessions['axiosSummary'].data,
      });

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelStatus()', 'success', `Successfully retrieved panel status from "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'GET_PANEL_STATUS',
        success: true,
        info: parsedOrbTextSummary,
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getPanelStatus()', 'error', 'Method encountered an error during execution');
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
   * Lib - API - Set Panel Status.
   *
   * Orchestrates arm state changes by validating the request, disarming
   * first when needed, then arming to the requested state through the
   * arm disarm handler (force arming included when required).
   *
   * @param {Lib_Api_ADTPulseAPI_SetPanelStatus_ArmFrom}       armFrom       - Arm from.
   * @param {Lib_Api_ADTPulseAPI_SetPanelStatus_ArmTo}         armTo         - Arm to.
   * @param {Lib_Api_ADTPulseAPI_SetPanelStatus_IsAlarmActive} isAlarmActive - Is alarm active.
   *
   * @returns {Lib_Api_ADTPulseAPI_SetPanelStatus_Returns}
   *
   * @since 1.0.0
   */
  public async setPanelStatus(armFrom: Lib_Api_ADTPulseAPI_SetPanelStatus_ArmFrom, armTo: Lib_Api_ADTPulseAPI_SetPanelStatus_ArmTo, isAlarmActive: Lib_Api_ADTPulseAPI_SetPanelStatus_IsAlarmActive): Lib_Api_ADTPulseAPI_SetPanelStatus_Returns {
    let errorObject: Lib_Api_ADTPulseAPI_SetPanelStatus_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.setPanelStatus()', 'info', `Attempting to update panel status from "${armFrom}" to "${armTo}" at "${this.#internal['baseUrl']}"`);
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
        && isAlarmActive === false
      )
    ) {
      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.setPanelStatus()', 'info', `No need to change arm state from "${armFrom}" to "${armTo}" due to its equivalence`);
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
    if (this.#internal['debug'] === true && isAlarmActive === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.setPanelStatus()', 'warn', `Alarm is currently ringing and arm state is being changed from "${armFrom}" to "${armTo}"`);
    }

    try {
      let isAlarmCurrentlyActive: Lib_Api_ADTPulseAPI_SetPanelStatus_IsAlarmCurrentlyActive = isAlarmActive;

      // Get the security buttons.
      const securityButtonsResponse: Lib_Api_ADTPulseAPI_SetPanelStatus_SecurityButtonsResponse = await this.getOrbSecurityButtons();

      if (securityButtonsResponse['success'] === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.setPanelStatus()', 'error', 'An error occurred while retrieving security buttons');
        }

        return {
          action: 'SET_PANEL_STATUS',
          success: false,
          info: securityButtonsResponse['info'],
        };
      }

      const securityButtons: Lib_Api_ADTPulseAPI_SetPanelStatus_SecurityButtons = securityButtonsResponse['info'];

      // Only keep all ready (enabled) orb security buttons.
      let readyButtons: Lib_Api_ADTPulseAPI_SetPanelStatus_ReadyButtons = securityButtons.filter((securityButton): securityButton is Lib_Api_ADTPulseAPI_SetPanelStatus_ReadyButton => securityButton['buttonDisabled'] === false);

      // Generate "fake" ready buttons if arming tasks become stuck (backup sat code required).
      if (readyButtons.length === 0 && this.#session['backupSatCode'] !== null) {
        readyButtons = generateFakeReadyButtons(securityButtons, this.#session['isCleanState'], {
          relativeUrl: 'quickcontrol/armDisarm.jsp',
          href: 'rest/adt/ui/client/security/setArmState',
          sat: this.#session['backupSatCode'],
        });

        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.setPanelStatus()', 'warn', 'No security buttons were found. Replacing stuck orb security buttons with fake buttons');
          stackTracer('fake-ready-buttons', {
            before: securityButtons,
            after: readyButtons,
          });
        }
      }

      // If arming tasks become stuck, but no backup sat code was available, return an error.
      if (readyButtons.length === 0 && this.#session['backupSatCode'] === null) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.setPanelStatus()', 'error', 'No security buttons were found and replacement failed because no backup sat code exists');
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
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.setPanelStatus()', 'error', 'Security buttons are not found on the summary page');
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
        this.#internal['testMode']['enabled'] === true
        && this.#internal['testMode']['isSystemDisarmedBeforeTest'] === false
      ) {
        // If system is not disarmed, end the test.
        if ([
          'off',
          'disarmed',
        ].includes(readyButtons[0]!['urlParams']['armState']) === false) {
          if (this.#internal['debug'] === true) {
            debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.setPanelStatus()', 'error', 'Test mode is active and system is not disarmed');
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
        this.#internal['testMode'].isSystemDisarmedBeforeTest = true;
      }

      // If current arm state is not truly "disarmed" or alarm is currently active, disarm it first.
      while (isAlarmCurrentlyActive === true || [
        'off',
        'disarmed',
      ].includes(readyButtons[0]!['urlParams']['armState']) === false) {
        // Accessing index 0 is guaranteed, because of the check above.
        const disarmResponse: Lib_Api_ADTPulseAPI_SetPanelStatus_DisarmResponse = await this.armDisarmHandler(
          isAlarmCurrentlyActive,
          {
            relativeUrl: readyButtons[0]!['relativeUrl'],
            href: readyButtons[0]!['urlParams']['href'],
            armState: readyButtons[0]!['urlParams']['armState'],
            arm: 'off',
            sat: readyButtons[0]!['urlParams']['sat'],
          },
        );

        if (disarmResponse['success'] === false) {
          if (this.#internal['debug'] === true) {
            debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.setPanelStatus()', 'error', 'An error occurred in the arm disarm handler (while disarming)');
          }

          return {
            action: 'SET_PANEL_STATUS',
            success: false,
            info: disarmResponse['info'],
          };
        }

        // Make sure there is at least 1 security button available.
        if (disarmResponse['info']['readyButtons'].length < 1) {
          if (this.#internal['debug'] === true) {
            debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.setPanelStatus()', 'error', 'Arm disarm handler failed to find new security buttons');
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
        readyButtons = disarmResponse['info']['readyButtons'];

        // At this point, the alarm should stop ringing, and state should be "Uncleared Alarm".
        if (isAlarmCurrentlyActive === true) {
          isAlarmCurrentlyActive = false;
        }
      }

      // Track if force arming was required.
      let forceArmRequired: Lib_Api_ADTPulseAPI_SetPanelStatus_ForceArmRequired = false;

      // Set the arm state based on "armTo" if system is not being disarmed.
      if (armTo !== 'off') {
        // Accessing index 0 is guaranteed, because of the check above.
        const armDisarmResponse: Lib_Api_ADTPulseAPI_SetPanelStatus_ArmDisarmResponse = await this.armDisarmHandler(
          false, // At this point, alarm should not be active.
          {
            relativeUrl: readyButtons[0]!['relativeUrl'],
            href: readyButtons[0]!['urlParams']['href'],
            armState: readyButtons[0]!['urlParams']['armState'], // At this point, "armState" should be "off" or "disarmed".
            arm: armTo,
            sat: readyButtons[0]!['urlParams']['sat'],
          },
        );

        if (armDisarmResponse['success'] === false) {
          if (this.#internal['debug'] === true) {
            debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.setPanelStatus()', 'error', 'An error occurred in the arm disarm handler (while arming)');
          }

          return {
            action: 'SET_PANEL_STATUS',
            success: false,
            info: armDisarmResponse['info'],
          };
        }

        forceArmRequired = armDisarmResponse['info']['forceArmRequired'];
      }

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.setPanelStatus()', 'success', `Successfully updated panel status from "${armFrom}" to "${armTo}" at "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'SET_PANEL_STATUS',
        success: true,
        info: {
          forceArmRequired,
        },
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.setPanelStatus()', 'error', 'Method encountered an error during execution');
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
   * Lib - API - Get Sensors Information.
   *
   * Scrapes the system page sensor table so the plugin can enumerate
   * installed sensors with their device types, names, statuses, and zones.
   *
   * @returns {Lib_Api_ADTPulseAPI_GetSensorsInformation_Returns}
   *
   * @since 1.0.0
   */
  public async getSensorsInformation(): Lib_Api_ADTPulseAPI_GetSensorsInformation_Returns {
    let errorObject: Lib_Api_ADTPulseAPI_GetSensorsInformation_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsInformation()', 'info', `Attempting to retrieve sensors information from "${this.#internal['baseUrl']}"`);
    }

    try {
      const sessions: Lib_Api_ADTPulseAPI_GetSensorsInformation_Sessions = {};

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
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsInformation()', 'error', `The remote server responded with a HTTP ${sessions['axiosSystem'].status} status code`);
        }

        return {
          action: 'GET_SENSORS_INFORMATION',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosSystem'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosSystem']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsInformation()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_SENSORS_INFORMATION',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSystemRequestPath: Lib_Api_ADTPulseAPI_GetSensorsInformation_AxiosSystemRequestPath = sessions['axiosSystem']['request'].path;
      const axiosSystemRequestPathValid: Lib_Api_ADTPulseAPI_GetSensorsInformation_AxiosSystemRequestPathValid = requestPathSystemSystem.test(axiosSystemRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsInformation()', 'info', `Request path ➜ ${axiosSystemRequestPath}`);
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsInformation()', 'info', `Request path valid ➜ ${axiosSystemRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSystem is not the system page.
      if (axiosSystemRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsInformation()', 'error', `"${axiosSystemRequestPath}" is not the system page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSystemRequestPath, sessions['axiosSystem']);

        return {
          action: 'GET_SENSORS_INFORMATION',
          success: false,
          info: {
            message: `"${axiosSystemRequestPath}" is not the system page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions['axiosSystem'].data !== 'string') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsInformation()', 'error', 'The response body of the system page is not of type "string"');
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
        sessions['axiosSystem'].data,
        {
          url: sessions['axiosSystem'].config.url,
          referrer: sessions['axiosSystem'].config.headers['Referer'],
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * Detailed parsing information for "sensorsInformation".
       *
       * Responses may be inaccurate or missing (patent US20170070361A1).
       * Sensor table rows become objects with "deviceId", "deviceType",
       * "name", "status", and "zone" once processed by "parseSensorsTable()".
       *
       * @since 1.0.0
       */
      const jsdomSystemSensorsTable: Lib_Api_ADTPulseAPI_GetSensorsInformation_JsdomSystemSensorsTable = sessions['jsdomSystem'].window.document.querySelectorAll('#systemContentList tr[class^=\'p_row\'] tr.p_listRow');
      const parsedSensorsInformationTable: Lib_Api_ADTPulseAPI_GetSensorsInformation_ParsedSensorsInformationTable = parseSensorsTable('sensors-information', jsdomSystemSensorsTable) as Lib_Api_ADTPulseAPI_GetSensorsInformation_ParsedSensorsInformationTable;

      /**
       * Check if "sensorsInformation" needs documenting or testing.
       *
       * Parts not shown here will not be tracked, documented, or tested
       * (patent US20170070361A1). Tracked values cover "deviceType" (e.g.
       * "Door/Window Sensor") and "status" (e.g. "Installing", "Online").
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('sensors-information', parsedSensorsInformationTable);

      // Check if the parsing function is parsing data incorrectly.
      await this.newInformationDispatcher('debug-parser', {
        method: 'getSensorsInformation',
        response: parsedSensorsInformationTable,
        rawHtml: sessions['axiosSystem'].data,
      });

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsInformation()', 'success', `Successfully retrieved sensors information from "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'GET_SENSORS_INFORMATION',
        success: true,
        info: {
          sensors: parsedSensorsInformationTable,
        },
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsInformation()', 'error', 'Method encountered an error during execution');
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
   * Lib - API - Get Sensors Status.
   *
   * Scrapes the summary page orb sensors so the plugin can report each
   * sensor's current icon, name, status, and zone in real time.
   *
   * @returns {Lib_Api_ADTPulseAPI_GetSensorsStatus_Returns}
   *
   * @since 1.0.0
   */
  public async getSensorsStatus(): Lib_Api_ADTPulseAPI_GetSensorsStatus_Returns {
    let errorObject: Lib_Api_ADTPulseAPI_GetSensorsStatus_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsStatus()', 'info', `Attempting to retrieve sensors status from "${this.#internal['baseUrl']}"`);
    }

    try {
      const sessions: Lib_Api_ADTPulseAPI_GetSensorsStatus_Sessions = {};

      // sessions.axiosSummary: Load the summary page.
      sessions.axiosSummary = await this.#session['httpClient'].get<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/summary/summary.jsp`,
        this.getRequestConfig({
          headers: {
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/summary/summary.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosSummary'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsStatus()', 'error', `The remote server responded with a HTTP ${sessions['axiosSummary'].status} status code`);
        }

        return {
          action: 'GET_SENSORS_STATUS',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosSummary'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosSummary']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsStatus()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_SENSORS_STATUS',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSummaryRequestPath: Lib_Api_ADTPulseAPI_GetSensorsStatus_AxiosSummaryRequestPath = sessions['axiosSummary']['request'].path;
      const axiosSummaryRequestPathValid: Lib_Api_ADTPulseAPI_GetSensorsStatus_AxiosSummaryRequestPathValid = requestPathSummarySummary.test(axiosSummaryRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsStatus()', 'info', `Request path ➜ ${axiosSummaryRequestPath}`);
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsStatus()', 'info', `Request path valid ➜ ${axiosSummaryRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSummary is not the summary page.
      if (axiosSummaryRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsStatus()', 'error', `"${axiosSummaryRequestPath}" is not the summary page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSummaryRequestPath, sessions['axiosSummary']);

        return {
          action: 'GET_SENSORS_STATUS',
          success: false,
          info: {
            message: `"${axiosSummaryRequestPath}" is not the summary page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions['axiosSummary'].data !== 'string') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsStatus()', 'error', 'The response body of the summary page is not of type "string"');
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
      if (this.#session['backupSatCode'] === null) {
        const missingSatCode: Lib_Api_ADTPulseAPI_GetSensorsStatus_MissingSatCode = fetchMissingSatCode(sessions['axiosSummary']);

        if (missingSatCode !== null) {
          if (this.#internal['debug'] === true) {
            debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsStatus()', 'success', 'Backup sat code was successfully recovered from previous failed retrieval');
          }

          this.#session.backupSatCode = missingSatCode;
        }
      }

      // sessions.jsdomSummary: Parse the summary page.
      sessions.jsdomSummary = new JSDOM(
        sessions['axiosSummary'].data,
        {
          url: sessions['axiosSummary'].config.url,
          referrer: sessions['axiosSummary'].config.headers['Referer'],
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * Detailed parsing information for "sensorsStatus".
       *
       * Responses may be inaccurate or missing (patent US20170070361A1).
       * Summary table rows become objects with "icon", "name", "status", and
       * "zone" once processed by the "parseOrbSensors()" function/method.
       *
       * @since 1.0.0
       */
      const jsdomSummaryOrbSensors: Lib_Api_ADTPulseAPI_GetSensorsStatus_JsdomSummaryOrbSensors = sessions['jsdomSummary'].window.document.querySelectorAll('#orbSensorsList tr.p_listRow');
      const parsedOrbSensors: Lib_Api_ADTPulseAPI_GetSensorsStatus_ParsedOrbSensors = parseOrbSensors(jsdomSummaryOrbSensors);

      /**
       * Check if "sensorsStatus" needs documenting or testing.
       *
       * Parts not shown here will not be tracked, documented, or tested
       * (patent US20170070361A1). Tracked values cover "icon" (e.g.
       * "devStatOK") and "status" (e.g. "ALARM", "Closed", "Motion", "Open").
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('sensors-status', parsedOrbSensors);

      // Check if the parsing function is parsing data incorrectly.
      await this.newInformationDispatcher('debug-parser', {
        method: 'getSensorsStatus',
        response: parsedOrbSensors,
        rawHtml: sessions['axiosSummary'].data,
      });

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsStatus()', 'success', `Successfully retrieved sensors status from "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'GET_SENSORS_STATUS',
        success: true,
        info: {
          sensors: parsedOrbSensors,
        },
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getSensorsStatus()', 'error', 'Method encountered an error during execution');
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
   * Lib - API - Get Orb Security Buttons.
   *
   * Scrapes the summary page security buttons so arm and disarm actions
   * can reuse the exact URLs, parameters, and sat codes the portal expects.
   *
   * @returns {Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_Returns}
   *
   * @since 1.0.0
   */
  public async getOrbSecurityButtons(): Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_Returns {
    let errorObject: Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getOrbSecurityButtons()', 'info', `Attempting to retrieve orb security buttons from "${this.#internal['baseUrl']}"`);
    }

    try {
      const sessions: Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_Sessions = {};

      // sessions.axiosSummary: Load the summary page.
      sessions.axiosSummary = await this.#session['httpClient'].get<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/summary/summary.jsp`,
        this.getRequestConfig({
          headers: {
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/summary/summary.jsp`,
            'Sec-Fetch-Site': 'same-origin',
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosSummary'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getOrbSecurityButtons()', 'error', `The remote server responded with a HTTP ${sessions['axiosSummary'].status} status code`);
        }

        return {
          action: 'GET_ORB_SECURITY_BUTTONS',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosSummary'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosSummary']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getOrbSecurityButtons()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'GET_ORB_SECURITY_BUTTONS',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSummaryRequestPath: Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_AxiosSummaryRequestPath = sessions['axiosSummary']['request'].path;
      const axiosSummaryRequestPathValid: Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_AxiosSummaryRequestPathValid = requestPathSummarySummary.test(axiosSummaryRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getOrbSecurityButtons()', 'info', `Request path ➜ ${axiosSummaryRequestPath}`);
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getOrbSecurityButtons()', 'info', `Request path valid ➜ ${axiosSummaryRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSummary is not the summary page.
      if (axiosSummaryRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getOrbSecurityButtons()', 'error', `"${axiosSummaryRequestPath}" is not the summary page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSummaryRequestPath, sessions['axiosSummary']);

        return {
          action: 'GET_ORB_SECURITY_BUTTONS',
          success: false,
          info: {
            message: `"${axiosSummaryRequestPath}" is not the summary page`,
          },
        };
      }

      // Make sure we are able to use JSDOM on the response data.
      if (typeof sessions['axiosSummary'].data !== 'string') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getOrbSecurityButtons()', 'error', 'The response body of the summary page is not of type "string"');
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
      if (this.#session['backupSatCode'] === null) {
        const missingSatCode: Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_MissingSatCode = fetchMissingSatCode(sessions['axiosSummary']);

        if (missingSatCode !== null) {
          if (this.#internal['debug'] === true) {
            debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getOrbSecurityButtons()', 'success', 'Backup sat code was successfully recovered from previous failed retrieval');
          }

          this.#session.backupSatCode = missingSatCode;
        }
      }

      // sessions.jsdomSummary: Parse the summary page.
      sessions.jsdomSummary = new JSDOM(
        sessions['axiosSummary'].data,
        {
          url: sessions['axiosSummary'].config.url,
          referrer: sessions['axiosSummary'].config.headers['Referer'],
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * Detailed parsing information for "orbSecurityButtons".
       *
       * Responses may be inaccurate or missing (patent US20170070361A1).
       * Button inputs become pending or ready button objects once processed
       * by "parseOrbSecurityButtons()" ("sat" required, made per login).
       *
       * @since 1.0.0
       */
      const jsdomSummaryOrbSecurityButtons: Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_JsdomSummaryOrbSecurityButtons = sessions['jsdomSummary'].window.document.querySelectorAll('#divOrbSecurityButtons input');
      const parsedOrbSecurityButtons: Lib_Api_ADTPulseAPI_GetOrbSecurityButtons_ParsedOrbSecurityButtons = parseOrbSecurityButtons(jsdomSummaryOrbSecurityButtons);

      /**
       * Check if "orbSecurityButtons" needs documenting or testing.
       *
       * Parts not shown here will not be tracked, documented, or tested
       * (patent US20170070361A1). Tracked values cover button text, loading
       * text, relative URLs, and "urlParams" ("arm", "armState", "href").
       *
       * @since 1.0.0
       */
      await this.newInformationDispatcher('orb-security-buttons', parsedOrbSecurityButtons);

      // Check if the parsing function is parsing data incorrectly.
      await this.newInformationDispatcher('debug-parser', {
        method: 'getOrbSecurityButtons',
        response: parsedOrbSecurityButtons,
        rawHtml: sessions['axiosSummary'].data,
      });

      // "armState" can be dirty without the plugin changing the state itself. Most likely when multiple users are logged in.
      this.#session.isCleanState = isSessionCleanState(parsedOrbSecurityButtons);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getOrbSecurityButtons()', 'success', `Successfully retrieved orb security buttons from "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'GET_ORB_SECURITY_BUTTONS',
        success: true,
        info: parsedOrbSecurityButtons,
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.getOrbSecurityButtons()', 'error', 'Method encountered an error during execution');
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
   * Lib - API - Perform Sync Check.
   *
   * Polls the portal sync check endpoint so the plugin knows when device
   * state changed and a fresh scrape of the portal pages is worthwhile.
   *
   * @returns {Lib_Api_ADTPulseAPI_PerformSyncCheck_Returns}
   *
   * @since 1.0.0
   */
  public async performSyncCheck(): Lib_Api_ADTPulseAPI_PerformSyncCheck_Returns {
    let errorObject: Lib_Api_ADTPulseAPI_PerformSyncCheck_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performSyncCheck()', 'info', `Attempting to perform a sync check from "${this.#internal['baseUrl']}"`);
    }

    try {
      const sessions: Lib_Api_ADTPulseAPI_PerformSyncCheck_Sessions = {};

      // sessions.axiosSyncCheck: Load the sync check page.
      sessions.axiosSyncCheck = await this.#session['httpClient'].get<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/Ajax/SyncCheckServ?t=${Date.now()}`,
        this.getRequestConfig({
          headers: {
            'Accept': '*/*',
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/summary/summary.jsp`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
            'Upgrade-Insecure-Requests': undefined,
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosSyncCheck'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performSyncCheck()', 'error', `The remote server responded with a HTTP ${sessions['axiosSyncCheck'].status} status code`);
        }

        return {
          action: 'PERFORM_SYNC_CHECK',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosSyncCheck'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosSyncCheck']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performSyncCheck()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'PERFORM_SYNC_CHECK',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSyncCheckRequestPath: Lib_Api_ADTPulseAPI_PerformSyncCheck_AxiosSyncCheckRequestPath = sessions['axiosSyncCheck']['request'].path;
      const axiosSyncCheckRequestPathValid: Lib_Api_ADTPulseAPI_PerformSyncCheck_AxiosSyncCheckRequestPathValid = requestPathAjaxSyncCheckServTXx.test(axiosSyncCheckRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performSyncCheck()', 'info', `Request path ➜ ${axiosSyncCheckRequestPath}`);
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performSyncCheck()', 'info', `Request path valid ➜ ${axiosSyncCheckRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSyncCheck is not the sync check page.
      if (axiosSyncCheckRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performSyncCheck()', 'error', `"${axiosSyncCheckRequestPath}" is not the sync check page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSyncCheckRequestPath, sessions['axiosSyncCheck']);

        return {
          action: 'PERFORM_SYNC_CHECK',
          success: false,
          info: {
            message: `"${axiosSyncCheckRequestPath}" is not the sync check page`,
          },
        };
      }

      // Make sure we are able to validate the response data.
      if (typeof sessions['axiosSyncCheck'].data !== 'string') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performSyncCheck()', 'error', 'The response body of the sync check page is not of type "string"');
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
      if (isPortalSyncCode(sessions['axiosSyncCheck'].data) === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performSyncCheck()', 'error', 'The sync code structure is invalid');
        }

        return {
          action: 'PERFORM_SYNC_CHECK',
          success: false,
          info: {
            message: 'The sync code structure is invalid',
          },
        };
      }

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performSyncCheck()', 'success', `Successfully performed a sync check from "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'PERFORM_SYNC_CHECK',
        success: true,
        info: {
          /**
           * A breakdown of the responses when parsing the "syncCheckServ" response body.
           *
           * Responses may be inaccurate or missing (patent US20170070361A1).
           * Known shapes are "1-0-0", "2-0-0", "[integer]-0-0", and
           * "[integer]-[integer]-0".
           *
           * @since 1.0.0
           */
          syncCode: sessions['axiosSyncCheck'].data,
        },
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performSyncCheck()', 'error', 'Method encountered an error during execution');
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
   * Lib - API - Perform Keep Alive.
   *
   * Pings the portal keep alive endpoint so the authenticated session
   * does not expire while the plugin remains idle between updates.
   *
   * @returns {Lib_Api_ADTPulseAPI_PerformKeepAlive_Returns}
   *
   * @since 1.0.0
   */
  public async performKeepAlive(): Lib_Api_ADTPulseAPI_PerformKeepAlive_Returns {
    let errorObject: Lib_Api_ADTPulseAPI_PerformKeepAlive_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performKeepAlive()', 'info', `Attempting to perform a keep alive from "${this.#internal['baseUrl']}"`);
    }

    try {
      const sessions: Lib_Api_ADTPulseAPI_PerformKeepAlive_Sessions = {};

      // sessions.axiosKeepAlive: Load the keep alive page.
      sessions.axiosKeepAlive = await this.#session['httpClient'].post<unknown>(
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/KeepAlive`,
        '',
        this.getRequestConfig({
          headers: {
            'Accept': '*/*',
            'Content-type': 'application/x-www-form-urlencoded',
            'Origin': this.#internal['baseUrl'],
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/summary/summary.jsp`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
            'Upgrade-Insecure-Requests': undefined,
            'x-dtpc': generateFakeDynatracePCHeaderValue('keep-alive'),
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosKeepAlive'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performKeepAlive()', 'error', `The remote server responded with a HTTP ${sessions['axiosKeepAlive'].status} status code`);
        }

        return {
          action: 'PERFORM_KEEP_ALIVE',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosKeepAlive'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosKeepAlive']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performKeepAlive()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'PERFORM_KEEP_ALIVE',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosKeepAliveRequestPath: Lib_Api_ADTPulseAPI_PerformKeepAlive_AxiosKeepAliveRequestPath = sessions['axiosKeepAlive']['request'].path;
      const axiosKeepAliveRequestPathValid: Lib_Api_ADTPulseAPI_PerformKeepAlive_AxiosKeepAliveRequestPathValid = requestPathKeepAlive.test(axiosKeepAliveRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performKeepAlive()', 'info', `Request path ➜ ${axiosKeepAliveRequestPath}`);
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performKeepAlive()', 'info', `Request path valid ➜ ${axiosKeepAliveRequestPathValid}`);
      }

      // If the final URL of sessions.axiosKeepAlive is not the keep alive page.
      if (axiosKeepAliveRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performKeepAlive()', 'error', `"${axiosKeepAliveRequestPath}" is not the keep alive page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosKeepAliveRequestPath, sessions['axiosKeepAlive']);

        return {
          action: 'PERFORM_KEEP_ALIVE',
          success: false,
          info: {
            message: `"${axiosKeepAliveRequestPath}" is not the keep alive page`,
          },
        };
      }

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performKeepAlive()', 'success', `Successfully performed a keep alive from "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'PERFORM_KEEP_ALIVE',
        success: true,
        info: null,
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.performKeepAlive()', 'error', 'Method encountered an error during execution');
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
   * Lib - API - Is Authenticated.
   *
   * Reports whether this instance currently holds an authenticated portal
   * session, letting callers decide if a login is required first.
   *
   * @returns {Lib_Api_ADTPulseAPI_IsAuthenticated_Returns}
   *
   * @since 1.0.0
   */
  public isAuthenticated(): Lib_Api_ADTPulseAPI_IsAuthenticated_Returns {
    return this.#session['isAuthenticated'];
  }

  /**
   * Lib - API - Reset Session.
   *
   * Replaces the session container with a pristine one, including a new
   * cookie jar, so stale credentials never leak into the next login.
   *
   * @returns {Lib_Api_ADTPulseAPI_ResetSession_Returns}
   *
   * @since 1.0.0
   */
  public resetSession(): Lib_Api_ADTPulseAPI_ResetSession_Returns {
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

    return;
  }

  /**
   * Lib - API - Arm Disarm Handler.
   *
   * Performs the low-level arm state update request, delegates force
   * arming when doors or windows are open, and returns refreshed ready
   * buttons so callers can continue chaining state changes.
   *
   * @param {Lib_Api_ADTPulseAPI_ArmDisarmHandler_IsAlarmActive} isAlarmActive - Is alarm active.
   * @param {Lib_Api_ADTPulseAPI_ArmDisarmHandler_Options}       options       - Options.
   *
   * @private
   *
   * @returns {Lib_Api_ADTPulseAPI_ArmDisarmHandler_Returns}
   *
   * @since 1.0.0
   */
  private async armDisarmHandler(isAlarmActive: Lib_Api_ADTPulseAPI_ArmDisarmHandler_IsAlarmActive, options: Lib_Api_ADTPulseAPI_ArmDisarmHandler_Options): Lib_Api_ADTPulseAPI_ArmDisarmHandler_Returns {
    let errorObject: Lib_Api_ADTPulseAPI_ArmDisarmHandler_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.armDisarmHandler()', 'info', `Attempting to update arm state from "${options['armState']}" to "${options['arm']}" on "${this.#internal['baseUrl']}"`);
    }

    // If system is being set to the current arm state (e.g. disarmed to off) and alarm is not active.
    if (
      (
        options['armState'] === 'away'
        && options['arm'] === 'away'
      )
      || (
        (
          options['armState'] === 'night'
          || options['armState'] === 'night+stay'
        )
        && options['arm'] === 'night'
      )
      || (
        options['armState'] === 'stay'
        && options['arm'] === 'stay'
      )
      || (
        (
          options['armState'] === 'disarmed'
          || options['armState'] === 'off'
        )
        && options['arm'] === 'off'
        && isAlarmActive === false
      )
    ) {
      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.armDisarmHandler()', 'info', `No need to change arm state from "${options['armState']}" to "${options['arm']}" due to its equivalence`);
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
      const sessions: Lib_Api_ADTPulseAPI_ArmDisarmHandler_Sessions = {};

      // Build an "application/x-www-form-urlencoded" form for use with arming and disarming.
      const armDisarmForm: Lib_Api_ADTPulseAPI_ArmDisarmHandler_ArmDisarmForm = new URLSearchParams();

      armDisarmForm.append('href', options['href']);
      armDisarmForm.append('armstate', options['armState']);
      armDisarmForm.append('arm', options['arm']);
      armDisarmForm.append('sat', options['sat']);

      // sessions.axiosSetArmMode: Emulate an arm state update request.
      sessions.axiosSetArmMode = await this.#session['httpClient'].post<unknown>(
        /**
         * A breakdown of the links to set arm mode.
         *
         * Responses may be inaccurate or missing (patent US20170070361A1).
         * Arm mode links pass "href", "armstate", "arm", and "sat" params,
         * and dirty sessions send alternate "armstate" values (e.g. "night+stay").
         *
         * @since 1.0.0
         */
        `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/${options['relativeUrl']}`,
        armDisarmForm,
        this.getRequestConfig({
          headers: {
            'Cache-Control': 'max-age=0',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': this.#internal['baseUrl'],
            'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/summary/summary.jsp`,
            'Sec-Fetch-Dest': 'iframe',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': undefined,
          },
        }),
      );

      // Check for server error response.
      if (sessions['axiosSetArmMode'].status >= 400) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.armDisarmHandler()', 'error', `The remote server responded with a HTTP ${sessions['axiosSetArmMode'].status} status code`);
        }

        return {
          action: 'ARM_DISARM_HANDLER',
          success: false,
          info: {
            message: `The remote server responded with a HTTP ${sessions['axiosSetArmMode'].status} status code`,
          },
        };
      }

      // If the "ClientRequest" object does not exist in the Axios response.
      if (typeof sessions['axiosSetArmMode']['request'] === 'undefined') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.armDisarmHandler()', 'error', 'The HTTP client responded without the "request" object');
        }

        return {
          action: 'ARM_DISARM_HANDLER',
          success: false,
          info: {
            message: 'The HTTP client responded without the "request" object',
          },
        };
      }

      const axiosSetArmModeRequestPath: Lib_Api_ADTPulseAPI_ArmDisarmHandler_AxiosSetArmModeRequestPath = sessions['axiosSetArmMode']['request'].path;
      const axiosSetArmModeRequestPathValid: Lib_Api_ADTPulseAPI_ArmDisarmHandler_AxiosSetArmModeRequestPathValid = requestPathQuickControlArmDisarm.test(axiosSetArmModeRequestPath);

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.armDisarmHandler()', 'info', `Request path ➜ ${axiosSetArmModeRequestPath}`);
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.armDisarmHandler()', 'info', `Request path valid ➜ ${axiosSetArmModeRequestPathValid}`);
      }

      // If the final URL of sessions.axiosSetArmMode is not the arm disarm page.
      if (axiosSetArmModeRequestPathValid === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.armDisarmHandler()', 'error', `"${axiosSetArmModeRequestPath}" is not the arm disarm page`);
        }

        // Check if "this instance" was not signed in during this time.
        this.handleLoginFailure(axiosSetArmModeRequestPath, sessions['axiosSetArmMode']);

        return {
          action: 'ARM_DISARM_HANDLER',
          success: false,
          info: {
            message: `"${axiosSetArmModeRequestPath}" is not the arm disarm page`,
          },
        };
      }

      // Track if force arming was required.
      let forceArmRequired: Lib_Api_ADTPulseAPI_ArmDisarmHandler_ForceArmRequired = false;

      // No need to force arm if system is not being set to arm.
      if (options['arm'] !== 'off') {
        // Passing the force arming task to the handler.
        const forceArmResponse: Lib_Api_ADTPulseAPI_ArmDisarmHandler_ForceArmResponse = await this.forceArmHandler(sessions['axiosSetArmMode'], options['relativeUrl']);

        if (forceArmResponse['success'] === false) {
          if (this.#internal['debug'] === true) {
            debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.armDisarmHandler()', 'error', 'An error occurred in the force arm handler');
          }

          return {
            action: 'ARM_DISARM_HANDLER',
            success: false,
            info: forceArmResponse['info'],
          };
        }

        forceArmRequired = forceArmResponse['info']['forceArmRequired'];
      }

      // Allow some time for the security orb buttons to refresh.
      await sleep(this.#internal['waitTimeAfterArm']);

      // Get the security buttons.
      const securityButtonsResponse: Lib_Api_ADTPulseAPI_ArmDisarmHandler_SecurityButtonsResponse = await this.getOrbSecurityButtons();

      if (securityButtonsResponse['success'] === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.armDisarmHandler()', 'error', 'An error occurred while retrieving security buttons');
        }

        return {
          action: 'ARM_DISARM_HANDLER',
          success: false,
          info: securityButtonsResponse['info'],
        };
      }

      const securityButtons: Lib_Api_ADTPulseAPI_ArmDisarmHandler_SecurityButtons = securityButtonsResponse['info'];

      let readyButtons: Lib_Api_ADTPulseAPI_ArmDisarmHandler_ReadyButtons = securityButtons.filter((securityButton): securityButton is Lib_Api_ADTPulseAPI_ArmDisarmHandler_ReadyButton => securityButton['buttonDisabled'] === false);

      // Generate "fake" ready buttons if arming tasks become stuck.
      if (readyButtons.length === 0) {
        readyButtons = generateFakeReadyButtons(securityButtons, this.#session['isCleanState'], {
          relativeUrl: options['relativeUrl'],
          href: options['href'],
          sat: options['sat'],
        });

        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.armDisarmHandler()', 'warn', 'No security buttons were found. Replacing stuck orb security buttons with fake buttons');
          stackTracer('fake-ready-buttons', {
            before: securityButtons,
            after: readyButtons,
          });
        }
      }

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.armDisarmHandler()', 'success', `Successfully updated arm state from "${options['armState']}" to "${options['arm']}" on "${this.#internal['baseUrl']}"`);
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
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.armDisarmHandler()', 'error', 'Method encountered an error during execution');
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
   * Lib - API - Force Arm Handler.
   *
   * Completes arming when the portal interrupts with an "Arm Anyway"
   * prompt, pressing the correct force arm button on the user's behalf.
   *
   * @param {Lib_Api_ADTPulseAPI_ForceArmHandler_Response}    response    - Response.
   * @param {Lib_Api_ADTPulseAPI_ForceArmHandler_RelativeUrl} relativeUrl - Relative url.
   *
   * @private
   *
   * @returns {Lib_Api_ADTPulseAPI_ForceArmHandler_Returns}
   *
   * @since 1.0.0
   */
  private async forceArmHandler(response: Lib_Api_ADTPulseAPI_ForceArmHandler_Response, relativeUrl: Lib_Api_ADTPulseAPI_ForceArmHandler_RelativeUrl): Lib_Api_ADTPulseAPI_ForceArmHandler_Returns {
    let errorObject: Lib_Api_ADTPulseAPI_ForceArmHandler_ErrorObject = undefined;

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.forceArmHandler()', 'info', `Attempting to force arm on "${this.#internal['baseUrl']}"`);
    }

    try {
      const sessions: Lib_Api_ADTPulseAPI_ForceArmHandler_Sessions = {};

      // Make sure we are able to use JSDOM on the response data.
      if (typeof response.data !== 'string') {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.forceArmHandler()', 'error', 'The response body of the arm disarm page is not of type "string"');
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
          referrer: response.config.headers['Referer'],
          contentType: 'text/html',
          pretendToBeVisual: true,
        },
      );

      /**
       * Detailed parsing information for "doSubmitHandlers".
       *
       * Responses may be inaccurate or missing (patent US20170070361A1).
       * The "doSubmit()" onclick handlers become objects with "relativeUrl"
       * and "urlParams" once processed by "parseDoSubmitHandlers()".
       *
       * @since 1.0.0
       */
      const jsdomArmDisarmDoSubmitHandlers: Lib_Api_ADTPulseAPI_ForceArmHandler_JsdomArmDisarmDoSubmitHandlers = sessions['jsdomArmDisarm'].window.document.querySelectorAll('.p_whiteBoxMiddleCenter .p_armDisarmWrapper input');
      const jsdomArmDisarmArmDisarmMessage: Lib_Api_ADTPulseAPI_ForceArmHandler_JsdomArmDisarmArmDisarmMessage = sessions['jsdomArmDisarm'].window.document.querySelector('.p_armDisarmWrapper div:first-child');
      const parsedArmDisarmMessage: Lib_Api_ADTPulseAPI_ForceArmHandler_ParsedArmDisarmMessage = parseArmDisarmMessage(jsdomArmDisarmArmDisarmMessage);
      const parsedDoSubmitHandlers: Lib_Api_ADTPulseAPI_ForceArmHandler_ParsedDoSubmitHandlers = parseDoSubmitHandlers(jsdomArmDisarmDoSubmitHandlers);

      /**
       * Check if "doSubmitHandlers" needs documenting or testing.
       *
       * Parts not shown here will not be tracked, documented, or tested
       * (patent US20170070361A1). Tracked values cover "relativeUrl",
       * "urlParams.arm", "urlParams.armState", and "urlParams.href".
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
        if (this.#internal['testMode']['enabled'] === true) {
          if (this.#internal['debug'] === true) {
            debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.forceArmHandler()', 'error', 'Test mode is active but no doors or windows were open');
          }

          return {
            action: 'FORCE_ARM_HANDLER',
            success: false,
            info: {
              message: 'Test mode is active but no doors or windows were open',
            },
          };
        }

        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.forceArmHandler()', 'info', 'Force arming not required');
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
      const tracker: Lib_Api_ADTPulseAPI_ForceArmHandler_Tracker = {
        complete: false,
        errorMessage: null,
        requestUrl: null,
      };

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.forceArmHandler()', 'warn', `Portal message ➜ "${parsedArmDisarmMessage}"`);
      }

      // Purpose of this loop is to determine the correct button position for force arming.
      for (const parsedDoSubmitHandler of parsedDoSubmitHandlers) {
        const forceArmRelativeUrl: Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmRelativeUrl = parsedDoSubmitHandler['relativeUrl'];
        const forceArmSat: Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmSat = parsedDoSubmitHandler['urlParams']['sat'];
        const forceArmHref: Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmHref = parsedDoSubmitHandler['urlParams']['href'];
        const forceArmArmState: Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmArmState = parsedDoSubmitHandler['urlParams']['armState'];
        const forceArmArm: Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmArm = parsedDoSubmitHandler['urlParams']['arm'];

        if (
          (
            tracker['complete'] === true // If force arm already completed.
            && tracker['errorMessage'] === null // If there is no error message.
          )
          || forceArmArmState === null // If "armState" does not exist, it is not an "Arm Anyway" button.
          || forceArmArm === null // If "arm" does not exist, it is not an "Arm Anyway" button.
        ) {
          continue;
        }

        // Build an "application/x-www-form-urlencoded" form for use with force arming.
        const forceArmForm: Lib_Api_ADTPulseAPI_ForceArmHandler_ForceArmForm = new URLSearchParams();

        forceArmForm.append('sat', forceArmSat);
        forceArmForm.append('href', forceArmHref);
        forceArmForm.append('armstate', forceArmArmState);
        forceArmForm.append('arm', forceArmArm);

        // sessions.axiosForceArm: Emulate a force arm state update request.
        sessions.axiosForceArm = await this.#session['httpClient'].post<unknown>(
          /**
           * A breakdown of the links to force set arm mode.
           *
           * Responses may be inaccurate or missing (patent US20170070361A1).
           * The "Arm Anyway" links append "armstate=forcearm" and "arm"
           * params while "Cancel" links only carry "sat" and "href" params.
           *
           * @since 1.0.0
           */
          this.#internal['baseUrl'] + forceArmRelativeUrl,
          forceArmForm,
          this.getRequestConfig({
            headers: {
              'Accept': '*/*',
              'Content-type': 'application/x-www-form-urlencoded',
              'Origin': this.#internal['baseUrl'],
              'Referer': `${this.#internal['baseUrl']}/myhome/${this.#session['portalVersion']}/${relativeUrl}`,
              'Sec-Fetch-Dest': 'empty',
              'Sec-Fetch-Mode': 'cors',
              'Sec-Fetch-Site': 'same-origin',
              'Sec-Fetch-User': undefined,
              'x-dtpc': generateFakeDynatracePCHeaderValue('force-arm'),
            },
          }),
        );

        // Check for server error response.
        if (sessions['axiosForceArm'].status >= 400) {
          if (this.#internal['debug'] === true) {
            debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.forceArmHandler()', 'error', `The remote server responded with a HTTP ${sessions['axiosForceArm'].status} status code`);
          }

          return {
            action: 'FORCE_ARM_HANDLER',
            success: false,
            info: {
              message: `The remote server responded with a HTTP ${sessions['axiosForceArm'].status} status code`,
            },
          };
        }

        // If the "ClientRequest" object does not exist in the Axios response.
        if (typeof sessions['axiosForceArm']['request'] === 'undefined') {
          if (this.#internal['debug'] === true) {
            debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.forceArmHandler()', 'error', 'The HTTP client responded without the "request" object');
          }

          return {
            action: 'FORCE_ARM_HANDLER',
            success: false,
            info: {
              message: 'The HTTP client responded without the "request" object',
            },
          };
        }

        const axiosForceArmRequestPath: Lib_Api_ADTPulseAPI_ForceArmHandler_AxiosForceArmRequestPath = sessions['axiosForceArm']['request'].path;
        const axiosForceArmRequestPathValid: Lib_Api_ADTPulseAPI_ForceArmHandler_AxiosForceArmRequestPathValid = requestPathQuickControlServRunRraCommand.test(axiosForceArmRequestPath);

        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.forceArmHandler()', 'info', `Request path ➜ ${axiosForceArmRequestPath}`);
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.forceArmHandler()', 'info', `Request path valid ➜ ${axiosForceArmRequestPathValid}`);
        }

        // If the final URL of sessions.axiosForceArm is not the run rra command page.
        if (axiosForceArmRequestPathValid === false) {
          tracker.errorMessage = `"${axiosForceArmRequestPath}" is not the run rra command page`;
          tracker.requestUrl = axiosForceArmRequestPath;

          continue;
        }

        // Make sure we are able to use the "String.prototype.includes()" method on the response data.
        if (typeof sessions['axiosForceArm'].data !== 'string') {
          tracker.errorMessage = 'The response body of the run rra command page is not of type "string"';
          tracker.requestUrl = axiosForceArmRequestPath;

          continue;
        }

        // The server reported that the force arm failed.
        if (sessions['axiosForceArm'].data.includes('1.0-OKAY') === false) {
          /**
           * A breakdown of the responses when parsing the "RunRRACommand" response body.
           *
           * Responses may be inaccurate or missing (patent US20170070361A1).
           * Success responses include "Error: 1.0-OKAY" while failures say
           * "Method not allowed" (misleading, POST works; escaped slashes).
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
      if (tracker['errorMessage'] !== null) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.forceArmHandler()', 'error', tracker['errorMessage']);
        }

        // If "this instance" was not signed in at this time.
        this.handleLoginFailure(tracker['requestUrl'], sessions['axiosForceArm']);

        return {
          action: 'FORCE_ARM_HANDLER',
          success: false,
          info: {
            message: tracker['errorMessage'],
          },
        };
      }

      // If force arming failed because the "Arm Anyway" button was not found.
      if (tracker['complete'] === false) {
        if (this.#internal['debug'] === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.forceArmHandler()', 'error', 'Force arming failed because the "Arm Anyway" button was not found');
        }

        return {
          action: 'FORCE_ARM_HANDLER',
          success: false,
          info: {
            message: 'Force arming failed because the "Arm Anyway" button was not found',
          },
        };
      }

      if (this.#internal['debug'] === true) {
        debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.forceArmHandler()', 'success', `Successfully forced arm on "${this.#internal['baseUrl']}"`);
      }

      return {
        action: 'FORCE_ARM_HANDLER',
        success: true,
        info: {
          forceArmRequired: true,
        },
      };
    } catch (error) {
      errorObject = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));
    }

    if (this.#internal['debug'] === true) {
      debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.forceArmHandler()', 'error', 'Method encountered an error during execution');
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
   * Lib - API - New Information Dispatcher.
   *
   * Routes newly scraped data to the matching detector so unknown portal
   * responses can be reported once, deduplicated by content hash.
   *
   * @param {Lib_Api_ADTPulseAPI_NewInformationDispatcher_Type} type - Type.
   * @param {Lib_Api_ADTPulseAPI_NewInformationDispatcher_Data} data - Data.
   *
   * @private
   *
   * @returns {Lib_Api_ADTPulseAPI_NewInformationDispatcher_Returns}
   *
   * @since 1.0.0
   */
  private async newInformationDispatcher(type: Lib_Api_ADTPulseAPI_NewInformationDispatcher_Type, data: Lib_Api_ADTPulseAPI_NewInformationDispatcher_Data): Lib_Api_ADTPulseAPI_NewInformationDispatcher_Returns {
    const dataHash: Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataHash = generateHash(data);

    // If the detector has not reported this event before.
    if (this.#internal['reportedHashes'].find((reportedHash) => dataHash === reportedHash) === undefined) {
      let detectedNew: Lib_Api_ADTPulseAPI_NewInformationDispatcher_DetectedNew = false;

      // Determine what information needs to be checked.
      switch (type) {
        case 'debug-parser': {
          detectedNew = await detectGlobalDebugParser(data as Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataDebugParser, this.#internal['logger'], this.#internal['debug']);
          break;
        }

        case 'do-submit-handlers': {
          detectedNew = await detectApiDoSubmitHandlers(data as Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataDoSubmitHandlers, this.#internal['logger'], this.#internal['debug']);
          break;
        }

        case 'gateway-information': {
          detectedNew = await detectApiGatewayInformation(data as Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataGatewayInformation, this.#internal['logger'], this.#internal['debug']);
          break;
        }

        case 'orb-security-buttons': {
          detectedNew = await detectApiOrbSecurityButtons(data as Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataOrbSecurityButtons, this.#internal['logger'], this.#internal['debug']);
          break;
        }

        case 'panel-information': {
          detectedNew = await detectApiPanelInformation(data as Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataPanelInformation, this.#internal['logger'], this.#internal['debug']);
          break;
        }

        case 'panel-status': {
          detectedNew = await detectApiPanelStatus(data as Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataPanelStatus, this.#internal['logger'], this.#internal['debug']);
          break;
        }

        case 'portal-version': {
          detectedNew = await detectGlobalPortalVersion(data as Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataPortalVersion, this.#internal['logger'], this.#internal['debug']);
          break;
        }

        case 'sensors-information': {
          detectedNew = await detectApiSensorsInformation(data as Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataSensorsInformation, this.#internal['logger'], this.#internal['debug']);
          break;
        }

        case 'sensors-status': {
          detectedNew = await detectApiSensorsStatus(data as Lib_Api_ADTPulseAPI_NewInformationDispatcher_DataSensorsStatus, this.#internal['logger'], this.#internal['debug']);
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
   * Lib - API - Get Request Config.
   *
   * Builds the Axios request configuration that disguises the plugin as a
   * real Chrome browser, merging in caller overrides when provided.
   *
   * @param {Lib_Api_ADTPulseAPI_GetRequestConfig_ExtraConfig} extraConfig - Extra config.
   *
   * @private
   *
   * @returns {Lib_Api_ADTPulseAPI_GetRequestConfig_Returns}
   *
   * @since 1.0.0
   */
  private getRequestConfig(extraConfig?: Lib_Api_ADTPulseAPI_GetRequestConfig_ExtraConfig): Lib_Api_ADTPulseAPI_GetRequestConfig_Returns {
    const defaultConfig: Lib_Api_ADTPulseAPI_GetRequestConfig_DefaultConfig = {
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
   * Lib - API - Handle Login Failure.
   *
   * Detects when a request was redirected to a sign-in or MFA page, logs
   * the likely cause, and resets the session so a clean login can occur.
   *
   * @param {Lib_Api_ADTPulseAPI_HandleLoginFailure_RequestPath} requestPath - Request path.
   * @param {Lib_Api_ADTPulseAPI_HandleLoginFailure_Session}     session     - Session.
   *
   * @private
   *
   * @returns {Lib_Api_ADTPulseAPI_HandleLoginFailure_Returns}
   *
   * @since 1.0.0
   */
  private handleLoginFailure(requestPath: Lib_Api_ADTPulseAPI_HandleLoginFailure_RequestPath, session: Lib_Api_ADTPulseAPI_HandleLoginFailure_Session): Lib_Api_ADTPulseAPI_HandleLoginFailure_Returns {
    if (requestPath === null) {
      return;
    }

    if (
      requestPathAccessSignIn.test(requestPath) === true
      || requestPathAccessSignInEXxPartnerAdt.test(requestPath) === true
      || requestPathMfaMfaSignInWorkflowChallenge.test(requestPath) === true
    ) {
      if (this.#internal['debug'] === true) {
        const errorMessage: Lib_Api_ADTPulseAPI_HandleLoginFailure_ErrorMessage = fetchErrorMessage(session);

        // Determine if "this instance" was redirected to the sign-in page.
        if (requestPathAccessSignIn.test(requestPath) === true || requestPathAccessSignInEXxPartnerAdt.test(requestPath) === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.handleLoginFailure()', 'error', 'Either the username or password is incorrect, fingerprint format is invalid, or was signed out due to inactivity');
        }

        // Determine if "this instance" was redirected to the multi-factor authentication challenge page.
        if (requestPathMfaMfaSignInWorkflowChallenge.test(requestPath) === true) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.handleLoginFailure()', 'error', 'Either the fingerprint was revoked or "Trust this device" was not selected after completing the multi-factor authentication challenge');
        }

        // Show the portal error message if it exists.
        if (errorMessage !== null) {
          debugLog(this.#internal['logger'], 'api.ts / ADTPulseAPI.handleLoginFailure()', 'warn', `Portal message ➜ "${errorMessage}"`);
        }
      }

      // Reset the session state for "this instance".
      this.resetSession();
    }

    return;
  }
}
