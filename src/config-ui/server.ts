import { HomebridgePluginUiServer, RequestError } from '@homebridge/plugin-ui-utils';
import _ from 'lodash';
import { serializeError } from 'serialize-error';

import { ADTPulseAuth } from '@/lib/auth.js';
import { configServerLogin, configServerRequestCode, configServerValidate } from '@/lib/schema.js';
import { debugLog } from '@/lib/utility.js';
import type {
  ADTPulseConfigServerAuth,
  ADTPulseConfigServerGenerateConfigPayload,
  ADTPulseConfigServerGenerateConfigReturns,
  ADTPulseConfigServerGetMethodsReturns,
  ADTPulseConfigServerInitializePayload,
  ADTPulseConfigServerInitializeReturns,
  ADTPulseConfigServerRequestCodePayload,
  ADTPulseConfigServerRequestCodeReturns,
  ADTPulseConfigServerStartBackendReturns,
  ADTPulseConfigServerUserInput,
  ADTPulseConfigServerValidatePayload,
  ADTPulseConfigServerValidateReturns,
} from '@/types/config-ui.d.ts';

/**
 * ADT Pulse Config Server.
 *
 * @since 1.0.0
 */
class ADTPulseConfigServer extends HomebridgePluginUiServer {
  /**
   * ADT Pulse Config Server - Auth.
   *
   * @private
   *
   * @since 1.0.0
   */
  #auth: ADTPulseConfigServerAuth;

  /**
   * ADT Pulse Config Server - User input.
   *
   * @private
   *
   * @since 1.0.0
   */
  #userInput: ADTPulseConfigServerUserInput;

  /**
   * ADT Pulse Config Server - Start backend.
   *
   * @returns {ADTPulseConfigServerStartBackendReturns}
   *
   * @since 1.0.0
   */
  public startBackend(): ADTPulseConfigServerStartBackendReturns {
    this.onRequest('/initialize', this.initialize.bind(this));
    this.onRequest('/get-methods', this.getMethods.bind(this));
    this.onRequest('/request-code', this.requestCode.bind(this));
    this.onRequest('/validate', this.validate.bind(this));
    this.onRequest('/generate-config', this.generateConfig.bind(this));

    // Backend is now ready to accept requests.
    this.ready();
  }

  /**
   * ADT Pulse Config Server - Initialize.
   *
   * @param {ADTPulseConfigServerInitializePayload} payload - Payload.
   *
   * @private
   *
   * @returns {ADTPulseConfigServerInitializeReturns}
   *
   * @since 1.0.0
   */
  private async initialize(payload: ADTPulseConfigServerInitializePayload): ADTPulseConfigServerInitializeReturns {
    const parsedPayload = configServerLogin.safeParse(payload);

    // If the payload is invalid.
    if (!parsedPayload.success) {
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
      subdomain: parsedPayload.data.subdomain,
      username: parsedPayload.data.username,
      password: parsedPayload.data.password,
    }, {
      debug: false,
    });

    // Store user input for use later.
    this.#userInput = {
      subdomain: parsedPayload.data.subdomain,
      username: parsedPayload.data.username,
      password: parsedPayload.data.password,
    };

    return {
      action: 'UI_INITIALIZE',
      success: true,
      info: null,
    };
  }

  /**
   * ADT Pulse Config Server - Get methods.
   *
   * @private
   *
   * @returns {ADTPulseConfigServerGetMethodsReturns}
   *
   * @since 1.0.0
   */
  private async getMethods(): ADTPulseConfigServerGetMethodsReturns {
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
      const response = await this.#auth.getVerificationMethods();

      // If the auth API failed to respond successfully.
      if (!response.success) {
        if (response.info.message) {
          debugLog(null, 'server.ts / ADTPulseConfigServer.getMethods()', 'error', response.info.message);
        }

        return {
          action: 'UI_GET_METHODS',
          success: false,
          info: response.info,
        };
      }

      return {
        action: 'UI_GET_METHODS',
        success: true,
        info: response.info,
      };
    } catch (error) {
      throw new RequestError('Failed to get methods', {
        message: error,
      });
    }
  }

  /**
   * ADT Pulse Config Server - Request code.
   *
   * @param {ADTPulseConfigServerRequestCodePayload} payload - Payload.
   *
   * @private
   *
   * @returns {ADTPulseConfigServerRequestCodeReturns}
   *
   * @since 1.0.0
   */
  private async requestCode(payload: ADTPulseConfigServerRequestCodePayload): ADTPulseConfigServerRequestCodeReturns {
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

    const parsedPayload = configServerRequestCode.safeParse(payload);

    // If the payload is invalid.
    if (!parsedPayload.success) {
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
      const response = await this.#auth.requestCode(parsedPayload.data.methodId);

      // If the auth API failed to respond successfully.
      if (!response.success) {
        if (response.info.message) {
          debugLog(null, 'server.ts / ADTPulseConfigServer.requestCode()', 'error', response.info.message);
        }

        return {
          action: 'UI_REQUEST_CODE',
          success: false,
          info: response.info,
        };
      }

      return {
        action: 'UI_REQUEST_CODE',
        success: true,
        info: response.info,
      };
    } catch (error) {
      const serializedError = serializeError(error);

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
   * ADT Pulse Config Server - Validate.
   *
   * @param {ADTPulseConfigServerValidatePayload} payload - Payload.
   *
   * @private
   *
   * @returns {ADTPulseConfigServerValidateReturns}
   *
   * @since 1.0.0
   */
  private async validate(payload: ADTPulseConfigServerValidatePayload): ADTPulseConfigServerValidateReturns {
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

    const parsedPayload = configServerValidate.safeParse(payload);

    // If the payload is invalid.
    if (!parsedPayload.success) {
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
      const requests = [
        this.#auth.validateCode.bind(this.#auth, parsedPayload.data.otpCode),
        this.#auth.getTrustedDevices.bind(this.#auth),
        this.#auth.addTrustedDevice.bind(this.#auth, parsedPayload.data.deviceName),
        this.#auth.completeSignIn.bind(this.#auth),
      ];

      for (let i = 0; i < requests.length; i += 1) {
        const response = await requests[i]();

        // If response is not successful, stop here.
        if (!response.success) {
          if (response.info.message) {
            debugLog(null, 'server.ts / ADTPulseConfigServer.validate()', 'error', response.info.message);
          }

          return {
            action: 'UI_VALIDATE',
            success: false,
            info: response.info,
          };
        }
      }

      return {
        action: 'UI_VALIDATE',
        success: true,
        info: null,
      };
    } catch (error) {
      const serializedError = serializeError(error);

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
   * ADT Pulse Config Server - Generate config.
   *
   * @param {ADTPulseConfigServerGenerateConfigPayload} payload - Payload.
   *
   * @private
   *
   * @returns {ADTPulseConfigServerGenerateConfigReturns}
   *
   * @since 1.0.0
   */
  private async generateConfig(payload: ADTPulseConfigServerGenerateConfigPayload): ADTPulseConfigServerGenerateConfigReturns {
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

    try {
      let payloadSensors = payload.oldConfig.sensors ?? [];

      // If user would like to update existing sensors.
      if (payload.updateSensors === true) {
        const response = await this.#auth.getSensors();

        // If the auth API failed to respond successfully.
        if (!response.success) {
          return {
            action: 'UI_GENERATE_CONFIG',
            success: false,
            info: {
              message: 'Failed to get new sensors',
            },
          };
        }

        // Update the sensors by merging new changes (to be safe, user will manually remove sensors themselves).
        payloadSensors = _.merge(payloadSensors, response.info.sensors);
      }

      return {
        action: 'UI_GENERATE_CONFIG',
        success: true,
        info: {
          config: {
            platform: payload.oldConfig.platform ?? 'ADTPulse',
            name: payload.oldConfig.name ?? 'ADT Pulse',
            subdomain: this.#userInput.subdomain,
            username: this.#userInput.username,
            password: this.#userInput.password,
            fingerprint: this.#auth.getFingerprint(),
            mode: payload.oldConfig.mode ?? 'normal',
            speed: payload.oldConfig.speed ?? 1,
            options: payload.oldConfig.options ?? [],
            sensors: payloadSensors,
          },
        },
      };
    } catch (error) {
      const serializedError = serializeError(error);

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

const instance = new ADTPulseConfigServer();
instance.startBackend();
