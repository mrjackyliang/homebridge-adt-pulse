import type { z } from 'zod';

import type { ADTPulseAuth } from '../../lib/auth.js';
import type {
  configServerGenerateConfig,
  configServerLogin,
  configServerRequestCode,
  configServerValidate,
  platformConfig,
} from '../../lib/schema.js';
import type {
  Shared_ApiResponse,
  Shared_ApiResponseFail_Info_Error,
  Shared_MfaDevice,
} from '../shared.d.ts';

/**
 * Config UI - Server - Auth.
 *
 * @since 1.0.0
 */
export type ConfigUi_Server_ADTPulseConfigServer_Auth = ADTPulseAuth | undefined;

/**
 * Config UI - Server - User Input.
 *
 * @since 1.0.0
 */
export type ConfigUi_Server_ADTPulseConfigServer_UserInput = z.infer<typeof configServerLogin> | undefined;

/**
 * Config UI - Server - Generate Config.
 *
 * @since 1.0.0
 */
export type ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Payload_OldConfig = Partial<z.infer<typeof platformConfig>>;

export type ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Payload_UpdateSensors = boolean;

export type ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Payload = {
  oldConfig: ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Payload_OldConfig;
  updateSensors?: ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Payload_UpdateSensors;
};

export type ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Returns_Info_Config = z.infer<typeof platformConfig>;

export type ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Returns_Info = {
  config: ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Returns_Info_Config;
};

export type ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Returns = Promise<Shared_ApiResponse<'UI_GENERATE_CONFIG', ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Returns_Info>>;

export type ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_ParsedPayload = z.ZodSafeParseResult<z.infer<typeof configServerGenerateConfig>>;

export type ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_OldConfig = ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Payload_OldConfig;

export type ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_PayloadSensors = z.infer<typeof platformConfig>['sensors'];

export type ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_Response = Awaited<ReturnType<ADTPulseAuth['getSensors']>>;

export type ConfigUi_Server_ADTPulseConfigServer_GenerateConfig_SerializedError = Shared_ApiResponseFail_Info_Error;

/**
 * Config UI - Server - Get Methods.
 *
 * @since 1.0.0
 */
export type ConfigUi_Server_ADTPulseConfigServer_GetMethods_Returns_Info_Methods = Shared_MfaDevice[];

export type ConfigUi_Server_ADTPulseConfigServer_GetMethods_Returns_Info = {
  methods: ConfigUi_Server_ADTPulseConfigServer_GetMethods_Returns_Info_Methods;
};

export type ConfigUi_Server_ADTPulseConfigServer_GetMethods_Returns = Promise<Shared_ApiResponse<'UI_GET_METHODS', ConfigUi_Server_ADTPulseConfigServer_GetMethods_Returns_Info>>;

export type ConfigUi_Server_ADTPulseConfigServer_GetMethods_Response = Awaited<ReturnType<ADTPulseAuth['getVerificationMethods']>>;

export type ConfigUi_Server_ADTPulseConfigServer_GetMethods_SerializedError = Shared_ApiResponseFail_Info_Error;

/**
 * Config UI - Server - Initialize.
 *
 * @since 1.0.0
 */
export type ConfigUi_Server_ADTPulseConfigServer_Initialize_Payload = z.infer<typeof configServerLogin>;

export type ConfigUi_Server_ADTPulseConfigServer_Initialize_Returns_Info = null;

export type ConfigUi_Server_ADTPulseConfigServer_Initialize_Returns = Promise<Shared_ApiResponse<'UI_INITIALIZE', ConfigUi_Server_ADTPulseConfigServer_Initialize_Returns_Info>>;

export type ConfigUi_Server_ADTPulseConfigServer_Initialize_ParsedPayload = z.ZodSafeParseResult<z.infer<typeof configServerLogin>>;

/**
 * Config UI - Server - Request Code.
 *
 * @since 1.0.0
 */
export type ConfigUi_Server_ADTPulseConfigServer_RequestCode_Payload = z.infer<typeof configServerRequestCode>;

export type ConfigUi_Server_ADTPulseConfigServer_RequestCode_Returns_Info = null;

export type ConfigUi_Server_ADTPulseConfigServer_RequestCode_Returns = Promise<Shared_ApiResponse<'UI_REQUEST_CODE', ConfigUi_Server_ADTPulseConfigServer_RequestCode_Returns_Info>>;

export type ConfigUi_Server_ADTPulseConfigServer_RequestCode_ParsedPayload = z.ZodSafeParseResult<z.infer<typeof configServerRequestCode>>;

export type ConfigUi_Server_ADTPulseConfigServer_RequestCode_Response = Awaited<ReturnType<ADTPulseAuth['requestCode']>>;

export type ConfigUi_Server_ADTPulseConfigServer_RequestCode_SerializedError = Shared_ApiResponseFail_Info_Error;

/**
 * Config UI - Server - Start Backend.
 *
 * @since 1.0.0
 */
export type ConfigUi_Server_ADTPulseConfigServer_StartBackend_Returns = void;

/**
 * Config UI - Server - Validate.
 *
 * @since 1.0.0
 */
export type ConfigUi_Server_ADTPulseConfigServer_Validate_Payload = z.infer<typeof configServerValidate>;

export type ConfigUi_Server_ADTPulseConfigServer_Validate_Returns_Info = null;

export type ConfigUi_Server_ADTPulseConfigServer_Validate_Returns = Promise<Shared_ApiResponse<'UI_VALIDATE', ConfigUi_Server_ADTPulseConfigServer_Validate_Returns_Info>>;

export type ConfigUi_Server_ADTPulseConfigServer_Validate_ParsedPayload = z.ZodSafeParseResult<z.infer<typeof configServerValidate>>;

export type ConfigUi_Server_ADTPulseConfigServer_Validate_Request = () => ReturnType<ADTPulseAuth['addTrustedDevice']> | ReturnType<ADTPulseAuth['completeSignIn']> | ReturnType<ADTPulseAuth['getTrustedDevices']> | ReturnType<ADTPulseAuth['validateCode']>;

export type ConfigUi_Server_ADTPulseConfigServer_Validate_Requests = ConfigUi_Server_ADTPulseConfigServer_Validate_Request[];

export type ConfigUi_Server_ADTPulseConfigServer_Validate_Response = Awaited<ReturnType<ConfigUi_Server_ADTPulseConfigServer_Validate_Request>>;

export type ConfigUi_Server_ADTPulseConfigServer_Validate_SerializedError = Shared_ApiResponseFail_Info_Error;
