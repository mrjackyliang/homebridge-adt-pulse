import { HomebridgePluginUiServer } from '@homebridge/plugin-ui-utils';
import _ from 'lodash';
import { isErrorLike, serializeError } from 'serialize-error';

import { ADTPulseAuth } from '../lib/auth.js';
import {
  configServerGenerateConfig,
  configServerLogin,
  configServerRequestCode,
  configServerValidate,
} from '../lib/schema.js';
import { createTrustedDeviceName, debugLog } from '../lib/utility.js';

import type {
  ConfigUi_Server_ADTPulseConfigServer_Auth,
  ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_OldConfig,
  ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_ParsedPayload,
  ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Payload,
  ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_PayloadSensors,
  ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Response,
  ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Returns,
  ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_SerializedError,
  ConfigUi_Server_ADTPulseConfigServer_GetMethods_Response,
  ConfigUi_Server_ADTPulseConfigServer_GetMethods_Returns,
  ConfigUi_Server_ADTPulseConfigServer_GetMethods_SerializedError,
  ConfigUi_Server_ADTPulseConfigServer_Initialize_ParsedPayload,
  ConfigUi_Server_ADTPulseConfigServer_Initialize_Payload,
  ConfigUi_Server_ADTPulseConfigServer_Initialize_Returns,
  ConfigUi_Server_ADTPulseConfigServer_RequestCode_ParsedPayload,
  ConfigUi_Server_ADTPulseConfigServer_RequestCode_Payload,
  ConfigUi_Server_ADTPulseConfigServer_RequestCode_Response,
  ConfigUi_Server_ADTPulseConfigServer_RequestCode_Returns,
  ConfigUi_Server_ADTPulseConfigServer_RequestCode_SerializedError,
  ConfigUi_Server_ADTPulseConfigServer_StartBackend_Returns,
  ConfigUi_Server_ADTPulseConfigServer_UserInput,
  ConfigUi_Server_ADTPulseConfigServer_Validate_ParsedPayload,
  ConfigUi_Server_ADTPulseConfigServer_Validate_Payload,
  ConfigUi_Server_ADTPulseConfigServer_Validate_Requests,
  ConfigUi_Server_ADTPulseConfigServer_Validate_Response,
  ConfigUi_Server_ADTPulseConfigServer_Validate_Returns,
  ConfigUi_Server_ADTPulseConfigServer_Validate_SerializedError,
} from '../types/config-ui/server.d.ts';

/**
 * Config UI - Server.
 *
 * Runs inside the Homebridge UI as the backend half of the custom user
 * interface, exposing request handlers that walk users through ADT Pulse login.
 *
 * @since 1.0.0
 */
class ADTPulseConfigServer extends HomebridgePluginUiServer {
  /**
   * ADT Pulse Config Server - Auth.
   *
   * Holds the authentication API instance created during initialization so
   * later requests can reuse the same login session across handler calls.
   *
   * @private
   *
   * @since 1.0.0
   */
  #auth: ConfigUi_Server_ADTPulseConfigServer_Auth;

  /**
   * ADT Pulse Config Server - User input.
   *
   * Caches the credentials submitted from the UI so the plugin configuration
   * can be generated later without asking the user to enter them again.
   *
   * @private
   *
   * @since 1.0.0
   */
  #userInput: ConfigUi_Server_ADTPulseConfigServer_UserInput;

  /**
   * Config UI - Server - Start Backend.
   *
   * Registers every request route the UI frontend may call, then signals the
   * Homebridge UI framework that the backend is ready to accept requests.
   *
   * @returns {ConfigUi_Server_ADTPulseConfigServer_StartBackend_Returns}
   *
   * @since 1.0.0
   */
  public startBackend(): ConfigUi_Server_ADTPulseConfigServer_StartBackend_Returns {
    this.onRequest('/initialize', this['initialize'].bind(this));

    this.onRequest('/get-methods', this['getMethods'].bind(this));

    this.onRequest('/request-code', this['requestCode'].bind(this));

    this.onRequest('/validate', this['validate'].bind(this));

    this.onRequest('/generate-config', this['generateConfig'].bind(this));

    // Backend is now ready to accept requests.
    this.ready();

    return;
  }

  /**
   * Config UI - Server - Initialize.
   *
   * Validates the submitted credentials payload, then creates the auth API
   * instance and caches the user input for the later configuration steps.
   *
   * @param {ConfigUi_Server_ADTPulseConfigServer_Initialize_Payload} payload - Payload.
   *
   * @private
   *
   * @returns {ConfigUi_Server_ADTPulseConfigServer_Initialize_Returns}
   *
   * @since 1.0.0
   */
  private async initialize(payload: ConfigUi_Server_ADTPulseConfigServer_Initialize_Payload): ConfigUi_Server_ADTPulseConfigServer_Initialize_Returns {
    const parsedPayload: ConfigUi_Server_ADTPulseConfigServer_Initialize_ParsedPayload = configServerLogin.safeParse(payload);

    // If the payload is invalid.
    if (parsedPayload.success === false) {
      debugLog(null, 'server.ts / ADTPulseConfigServer.initialize()', 'error', 'Invalid payload');

      return {
        action: 'UI_INITIALIZE',
        success: false,
        info: {
          message: 'Invalid payload',
        },
      };
    }

    // Initialize the auth API.
    this.#auth = new ADTPulseAuth({
      subdomain: parsedPayload.data['subdomain'],
      username: parsedPayload.data['username'],
      password: parsedPayload.data['password'],
    }, {
      debug: false,
      browserCacheDirectory: this.homebridgeStoragePath,
    });

    // Store user input for use later.
    this.#userInput = {
      subdomain: parsedPayload.data['subdomain'],
      username: parsedPayload.data['username'],
      password: parsedPayload.data['password'],
    };

    return {
      action: 'UI_INITIALIZE',
      success: true,
      info: null,
    };
  }

  /**
   * Config UI - Server - Get Methods.
   *
   * Retrieves the multi-factor verification methods available on the account
   * so the UI can let the user pick where the one-time code is delivered.
   *
   * @private
   *
   * @returns {ConfigUi_Server_ADTPulseConfigServer_GetMethods_Returns}
   *
   * @since 1.0.0
   */
  private async getMethods(): ConfigUi_Server_ADTPulseConfigServer_GetMethods_Returns {
    if (this.#auth === undefined || this.#userInput === undefined) {
      debugLog(null, 'server.ts / ADTPulseConfigServer.getMethods()', 'error', 'Auth API has not been initialized');

      return {
        action: 'UI_GET_METHODS',
        success: false,
        info: {
          message: 'Auth API has not been initialized',
        },
      };
    }

    try {
      const response: ConfigUi_Server_ADTPulseConfigServer_GetMethods_Response = await this.#auth.getVerificationMethods();

      // If the auth API failed to respond successfully.
      if (response['success'] === false) {
        if (response['info']['message'] !== undefined && response['info']['message'] !== '') {
          debugLog(null, 'server.ts / ADTPulseConfigServer.getMethods()', 'error', response['info']['message']);
        }

        return {
          action: 'UI_GET_METHODS',
          success: false,
          info: response['info'],
        };
      }

      return {
        action: 'UI_GET_METHODS',
        success: true,
        info: response['info'],
      };
    } catch (error) {
      const serializedError: ConfigUi_Server_ADTPulseConfigServer_GetMethods_SerializedError = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));

      debugLog(null, 'server.ts / ADTPulseConfigServer.getMethods()', 'error', 'Method encountered an error during execution');

      return {
        action: 'UI_GET_METHODS',
        success: false,
        info: {
          error: serializedError,
        },
      };
    }
  }

  /**
   * Config UI - Server - Request Code.
   *
   * Asks the auth API to send a one-time verification code using the delivery
   * method the user selected, ensuring the backend was initialized first.
   *
   * @param {ConfigUi_Server_ADTPulseConfigServer_RequestCode_Payload} payload - Payload.
   *
   * @private
   *
   * @returns {ConfigUi_Server_ADTPulseConfigServer_RequestCode_Returns}
   *
   * @since 1.0.0
   */
  private async requestCode(payload: ConfigUi_Server_ADTPulseConfigServer_RequestCode_Payload): ConfigUi_Server_ADTPulseConfigServer_RequestCode_Returns {
    if (this.#auth === undefined || this.#userInput === undefined) {
      debugLog(null, 'server.ts / ADTPulseConfigServer.requestCode()', 'error', 'Auth API has not been initialized');

      return {
        action: 'UI_REQUEST_CODE',
        success: false,
        info: {
          message: 'Auth API has not been initialized',
        },
      };
    }

    const parsedPayload: ConfigUi_Server_ADTPulseConfigServer_RequestCode_ParsedPayload = configServerRequestCode.safeParse(payload);

    // If the payload is invalid.
    if (parsedPayload.success === false) {
      debugLog(null, 'server.ts / ADTPulseConfigServer.requestCode()', 'error', 'Invalid payload');

      return {
        action: 'UI_REQUEST_CODE',
        success: false,
        info: {
          message: 'Invalid payload',
        },
      };
    }

    try {
      const response: ConfigUi_Server_ADTPulseConfigServer_RequestCode_Response = await this.#auth.requestCode(parsedPayload.data['methodId']);

      // If the auth API failed to respond successfully.
      if (response['success'] === false) {
        if (response['info']['message'] !== undefined && response['info']['message'] !== '') {
          debugLog(null, 'server.ts / ADTPulseConfigServer.requestCode()', 'error', response['info']['message']);
        }

        return {
          action: 'UI_REQUEST_CODE',
          success: false,
          info: response['info'],
        };
      }

      return {
        action: 'UI_REQUEST_CODE',
        success: true,
        info: response['info'],
      };
    } catch (error) {
      const serializedError: ConfigUi_Server_ADTPulseConfigServer_RequestCode_SerializedError = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));

      debugLog(null, 'server.ts / ADTPulseConfigServer.requestCode()', 'error', 'Method encountered an error during execution');

      return {
        action: 'UI_REQUEST_CODE',
        success: false,
        info: {
          error: serializedError,
        },
      };
    }
  }

  /**
   * Config UI - Server - Validate.
   *
   * Verifies the one-time code, then registers this device as trusted and
   * completes the sign-in so future logins can skip multi-factor prompts.
   *
   * @param {ConfigUi_Server_ADTPulseConfigServer_Validate_Payload} payload - Payload.
   *
   * @private
   *
   * @returns {ConfigUi_Server_ADTPulseConfigServer_Validate_Returns}
   *
   * @since 1.0.0
   */
  private async validate(payload: ConfigUi_Server_ADTPulseConfigServer_Validate_Payload): ConfigUi_Server_ADTPulseConfigServer_Validate_Returns {
    if (this.#auth === undefined || this.#userInput === undefined) {
      debugLog(null, 'server.ts / ADTPulseConfigServer.validate()', 'error', 'Auth API has not been initialized');

      return {
        action: 'UI_VALIDATE',
        success: false,
        info: {
          message: 'Auth API has not been initialized',
        },
      };
    }

    const parsedPayload: ConfigUi_Server_ADTPulseConfigServer_Validate_ParsedPayload = configServerValidate.safeParse(payload);

    // If the payload is invalid.
    if (parsedPayload.success === false) {
      debugLog(null, 'server.ts / ADTPulseConfigServer.validate()', 'error', 'Invalid payload');

      return {
        action: 'UI_VALIDATE',
        success: false,
        info: {
          message: 'Invalid payload',
        },
      };
    }

    try {
      const requests: ConfigUi_Server_ADTPulseConfigServer_Validate_Requests = [
        this.#auth.validateCode.bind(this.#auth, parsedPayload.data['otpCode']),
        this.#auth.getTrustedDevices.bind(this.#auth),
        this.#auth.addTrustedDevice.bind(this.#auth, createTrustedDeviceName(parsedPayload.data['instanceName'])),
        this.#auth.completeSignIn.bind(this.#auth),
      ];

      for (const request of requests) {
        const response: ConfigUi_Server_ADTPulseConfigServer_Validate_Response = await request();

        // If response is not successful, stop here.
        if (response['success'] === false) {
          if (response['info']['message'] !== undefined && response['info']['message'] !== '') {
            debugLog(null, 'server.ts / ADTPulseConfigServer.validate()', 'error', response['info']['message']);
          }

          return {
            action: 'UI_VALIDATE',
            success: false,
            info: response['info'],
          };
        }
      }

      return {
        action: 'UI_VALIDATE',
        success: true,
        info: null,
      };
    } catch (error) {
      const serializedError: ConfigUi_Server_ADTPulseConfigServer_Validate_SerializedError = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));

      debugLog(null, 'server.ts / ADTPulseConfigServer.validate()', 'error', 'Method encountered an error during execution');

      return {
        action: 'UI_VALIDATE',
        success: false,
        info: {
          error: serializedError,
        },
      };
    }
  }

  /**
   * Config UI - Server - Generate Config.
   *
   * Builds the final plugin configuration from cached user input and the
   * generated fingerprint, optionally refreshing sensors from the ADT portal.
   *
   * @param {ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Payload} payload - Payload.
   *
   * @private
   *
   * @returns {ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Returns}
   *
   * @since 1.0.0
   */
  private async generateConfig(payload: ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Payload): ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Returns {
    if (this.#auth === undefined || this.#userInput === undefined) {
      debugLog(null, 'server.ts / ADTPulseConfigServer.generateConfig()', 'error', 'Auth API has not been initialized');

      return {
        action: 'UI_GENERATE_CONFIG',
        success: false,
        info: {
          message: 'Auth API has not been initialized',
        },
      };
    }

    const parsedPayload: ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_ParsedPayload = configServerGenerateConfig.safeParse(payload);

    // If the payload is invalid.
    if (parsedPayload.success === false) {
      debugLog(null, 'server.ts / ADTPulseConfigServer.generateConfig()', 'error', 'Invalid payload');

      return {
        action: 'UI_GENERATE_CONFIG',
        success: false,
        info: {
          message: 'Invalid payload',
        },
      };
    }

    const oldConfig: ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_OldConfig = parsedPayload.data['oldConfig'] as ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_OldConfig;

    try {
      let payloadSensors: ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_PayloadSensors = oldConfig['sensors'] ?? [];

      // If user would like to update existing sensors.
      if (parsedPayload.data['updateSensors'] === true) {
        const response: ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Response = await this.#auth.getSensors();

        // If the auth API failed to respond successfully.
        if (response['success'] === false) {
          return {
            action: 'UI_GENERATE_CONFIG',
            success: false,
            info: {
              message: 'Failed to get new sensors',
            },
          };
        }

        // Update the sensors by merging new changes (to be safe, user will manually remove sensors themselves).
        payloadSensors = _.merge(payloadSensors, response['info']['sensors']);
      }

      return {
        action: 'UI_GENERATE_CONFIG',
        success: true,
        info: {
          config: {
            platform: oldConfig['platform'] ?? 'ADTPulse',
            name: oldConfig['name'] ?? 'ADT Pulse',
            subdomain: this.#userInput['subdomain'],
            username: this.#userInput['username'],
            password: this.#userInput['password'],
            fingerprint: this.#auth.getFingerprint(),
            mode: oldConfig['mode'] ?? 'normal',
            speed: oldConfig['speed'] ?? 1,
            options: oldConfig['options'] ?? [],
            sensors: payloadSensors,
          },
        },
      };
    } catch (error) {
      const serializedError: ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_SerializedError = (isErrorLike(error) === true) ? serializeError(error) : serializeError(new Error('Unknown error'));

      debugLog(null, 'server.ts / ADTPulseConfigServer.generateConfig()', 'error', 'Method encountered an error during execution');

      return {
        action: 'UI_GENERATE_CONFIG',
        success: false,
        info: {
          error: serializedError,
        },
      };
    }
  }
}

/**
 * Config UI - Server - Instance.
 *
 * Bootstraps the Config UI backend by instantiating the server and starting it,
 * so the Homebridge UI can begin handling ADT Pulse login requests.
 *
 * @since 1.0.0
 */
const instance = new ADTPulseConfigServer();

instance.startBackend();
