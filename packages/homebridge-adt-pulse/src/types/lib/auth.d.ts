import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { Logger } from 'homebridge';
import type { JSDOM } from 'jsdom';
import type { ErrorObject } from 'serialize-error';
import type { z } from 'zod';

import type { multiFactorAuth, otpResponse } from '../../lib/schema.js';
import type { Constant_PortalSubdomain, Constant_PortalVersion } from '../constant.d.ts';
import type {
  AxiosResponseNodeJs,
  Shared_ApiResponse,
  Shared_BaseUrl,
  Shared_BrowserName,
  Shared_Connection,
  Shared_Credentials,
  Shared_DebugParser,
  Shared_InternalConfig,
  Shared_MfaDevice,
  Shared_MfaTrustedDevice,
  Shared_PortalVersionContent,
  Shared_SensorConfig,
  Shared_Sessions,
  Shared_Uuid,
} from '../shared.d.ts';

/**
 * Lib - Auth - Connection.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_Connection = Shared_Connection;

/**
 * Lib - Auth - Credentials.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_Credentials = Shared_Credentials;

/**
 * Lib - Auth - Internal.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_Internal_BaseUrl = Shared_BaseUrl;

export type Lib_Auth_ADTPulseAuth_Internal_Debug = boolean;

export type Lib_Auth_ADTPulseAuth_Internal_Logger = Logger | null;

export type Lib_Auth_ADTPulseAuth_Internal_ReportedHash = string;

export type Lib_Auth_ADTPulseAuth_Internal_ReportedHashes = Lib_Auth_ADTPulseAuth_Internal_ReportedHash[];

export type Lib_Auth_ADTPulseAuth_Internal = {
  baseUrl: Lib_Auth_ADTPulseAuth_Internal_BaseUrl;
  debug: Lib_Auth_ADTPulseAuth_Internal_Debug;
  logger: Lib_Auth_ADTPulseAuth_Internal_Logger;
  reportedHashes: Lib_Auth_ADTPulseAuth_Internal_ReportedHashes;
};

/**
 * Lib - Auth - Session.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_Session_HttpClient = AxiosInstance;

export type Lib_Auth_ADTPulseAuth_Session_Mfa_ClientType = string | null;

export type Lib_Auth_ADTPulseAuth_Session_Mfa_Locale = string | null;

export type Lib_Auth_ADTPulseAuth_Session_Mfa_Login = string | null;

export type Lib_Auth_ADTPulseAuth_Session_Mfa_PreAuthToken = string | null;

export type Lib_Auth_ADTPulseAuth_Session_Mfa_SatCode = Shared_Uuid | null;

export type Lib_Auth_ADTPulseAuth_Session_Mfa_Token = string | null;

export type Lib_Auth_ADTPulseAuth_Session_Mfa_TrustedDevices = Shared_MfaTrustedDevice[];

export type Lib_Auth_ADTPulseAuth_Session_Mfa_VerificationMethods = Shared_MfaDevice[];

export type Lib_Auth_ADTPulseAuth_Session_Mfa = {
  clientType: Lib_Auth_ADTPulseAuth_Session_Mfa_ClientType;
  locale: Lib_Auth_ADTPulseAuth_Session_Mfa_Locale;
  login: Lib_Auth_ADTPulseAuth_Session_Mfa_Login;
  preAuthToken: Lib_Auth_ADTPulseAuth_Session_Mfa_PreAuthToken;
  satCode: Lib_Auth_ADTPulseAuth_Session_Mfa_SatCode;
  token: Lib_Auth_ADTPulseAuth_Session_Mfa_Token;
  trustedDevices: Lib_Auth_ADTPulseAuth_Session_Mfa_TrustedDevices;
  verificationMethods: Lib_Auth_ADTPulseAuth_Session_Mfa_VerificationMethods;
};

export type Lib_Auth_ADTPulseAuth_Session_PortalVersion = Constant_PortalVersion | null;

export type Lib_Auth_ADTPulseAuth_Session_Status = 'complete' | 'logged-out' | 'not-required';

export type Lib_Auth_ADTPulseAuth_Session = {
  httpClient: Lib_Auth_ADTPulseAuth_Session_HttpClient;
  mfa: Lib_Auth_ADTPulseAuth_Session_Mfa;
  portalVersion: Lib_Auth_ADTPulseAuth_Session_PortalVersion;
  status: Lib_Auth_ADTPulseAuth_Session_Status;
};

/**
 * Lib - Auth - Add Trusted Device.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_AddTrustedDevice_DeviceName = string;

export type Lib_Auth_ADTPulseAuth_AddTrustedDevice_ReturnsInfo = null;

export type Lib_Auth_ADTPulseAuth_AddTrustedDevice_Returns = Promise<Shared_ApiResponse<'ADD_TRUSTED_DEVICE', Lib_Auth_ADTPulseAuth_AddTrustedDevice_ReturnsInfo>>;

export type Lib_Auth_ADTPulseAuth_AddTrustedDevice_ErrorObject = ErrorObject | undefined;

export type Lib_Auth_ADTPulseAuth_AddTrustedDevice_Sessions = Shared_Sessions<{
  axiosAddDevice?: AxiosResponseNodeJs<unknown>;
}>;

export type Lib_Auth_ADTPulseAuth_AddTrustedDevice_TrustedDeviceForm = URLSearchParams;

export type Lib_Auth_ADTPulseAuth_AddTrustedDevice_AxiosAddDeviceRequestPath = string;

export type Lib_Auth_ADTPulseAuth_AddTrustedDevice_AxiosAddDeviceRequestPathValid = boolean;

export type Lib_Auth_ADTPulseAuth_AddTrustedDevice_ParsedValidateCode = z.ZodSafeParseResult<z.infer<typeof otpResponse>>;

/**
 * Lib - Auth - Complete Sign In.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_CompleteSignIn_ReturnsInfo = null;

export type Lib_Auth_ADTPulseAuth_CompleteSignIn_Returns = Promise<Shared_ApiResponse<'COMPLETE_SIGN_IN', Lib_Auth_ADTPulseAuth_CompleteSignIn_ReturnsInfo>>;

export type Lib_Auth_ADTPulseAuth_CompleteSignIn_ErrorObject = ErrorObject | undefined;

export type Lib_Auth_ADTPulseAuth_CompleteSignIn_Sessions = Shared_Sessions<{
  axiosPostSignIn?: AxiosResponseNodeJs<unknown>;
}>;

export type Lib_Auth_ADTPulseAuth_CompleteSignIn_AxiosPostSignInRequestPath = string;

export type Lib_Auth_ADTPulseAuth_CompleteSignIn_AxiosPostSignInRequestPathValid = boolean;

/**
 * Lib - Auth - Constructor.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_Constructor_Config_Password = string;

export type Lib_Auth_ADTPulseAuth_Constructor_Config_Subdomain = Constant_PortalSubdomain;

export type Lib_Auth_ADTPulseAuth_Constructor_Config_Username = string;

export type Lib_Auth_ADTPulseAuth_Constructor_Config = {
  password: Lib_Auth_ADTPulseAuth_Constructor_Config_Password;
  subdomain: Lib_Auth_ADTPulseAuth_Constructor_Config_Subdomain;
  username: Lib_Auth_ADTPulseAuth_Constructor_Config_Username;
};

export type Lib_Auth_ADTPulseAuth_Constructor_InternalConfig = Omit<Shared_InternalConfig, 'testMode'> & {
  browserCacheDirectory?: string | undefined;
};

export type Lib_Auth_ADTPulseAuth_Browser = Shared_BrowserName;

export type Lib_Auth_ADTPulseAuth_BrowserCacheDirectory = string | undefined;

export type Lib_Auth_ADTPulseAuth_FingerprintPrepared = boolean;

export type Lib_Auth_ADTPulseAuth_Constructor_Browsers = Shared_BrowserName[];

/**
 * Lib - Auth - Get Fingerprint.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_GetFingerprint_Returns = string;

/**
 * Lib - Auth - Get Request Config.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_GetRequestConfig_ExtraConfig = AxiosRequestConfig;

export type Lib_Auth_ADTPulseAuth_GetRequestConfig_Returns = AxiosRequestConfig;

export type Lib_Auth_ADTPulseAuth_GetRequestConfig_DefaultConfig = AxiosRequestConfig;

/**
 * Lib - Auth - Get Sensors.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_GetSensors_ReturnsInfo_Sensors = Shared_SensorConfig[];

export type Lib_Auth_ADTPulseAuth_GetSensors_ReturnsInfo = {
  sensors: Lib_Auth_ADTPulseAuth_GetSensors_ReturnsInfo_Sensors;
};

export type Lib_Auth_ADTPulseAuth_GetSensors_Returns = Promise<Shared_ApiResponse<'GET_SENSORS', Lib_Auth_ADTPulseAuth_GetSensors_ReturnsInfo>>;

export type Lib_Auth_ADTPulseAuth_GetSensors_ErrorObject = ErrorObject | undefined;

export type Lib_Auth_ADTPulseAuth_GetSensors_Sessions = Shared_Sessions<{
  axiosSystem?: AxiosResponseNodeJs<unknown>;
  jsdomSystem?: JSDOM;
}>;

export type Lib_Auth_ADTPulseAuth_GetSensors_AxiosSystemRequestPath = string;

export type Lib_Auth_ADTPulseAuth_GetSensors_AxiosSystemRequestPathValid = boolean;

export type Lib_Auth_ADTPulseAuth_GetSensors_JsdomSystemSensorsTable = NodeListOf<Element>;

export type Lib_Auth_ADTPulseAuth_GetSensors_ParsedSensorsConfigTable = Shared_SensorConfig[];

/**
 * Lib - Auth - Get Trusted Devices.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_GetTrustedDevices_ReturnsInfo_TrustedDevices = Shared_MfaTrustedDevice[];

export type Lib_Auth_ADTPulseAuth_GetTrustedDevices_ReturnsInfo = {
  trustedDevices: Lib_Auth_ADTPulseAuth_GetTrustedDevices_ReturnsInfo_TrustedDevices;
};

export type Lib_Auth_ADTPulseAuth_GetTrustedDevices_Returns = Promise<Shared_ApiResponse<'GET_TRUSTED_DEVICES', Lib_Auth_ADTPulseAuth_GetTrustedDevices_ReturnsInfo>>;

export type Lib_Auth_ADTPulseAuth_GetTrustedDevices_ErrorObject = ErrorObject | undefined;

export type Lib_Auth_ADTPulseAuth_GetTrustedDevices_Sessions = Shared_Sessions<{
  axiosDevicePoll?: AxiosResponseNodeJs<unknown>;
}>;

export type Lib_Auth_ADTPulseAuth_GetTrustedDevices_AxiosDevicePollRequestPath = string;

export type Lib_Auth_ADTPulseAuth_GetTrustedDevices_AxiosDevicePollRequestPathValid = boolean;

export type Lib_Auth_ADTPulseAuth_GetTrustedDevices_ParsedDevicePoll = z.ZodSafeParseResult<z.infer<typeof multiFactorAuth>>;

export type Lib_Auth_ADTPulseAuth_GetTrustedDevices_ParsedTrustedDevices = Shared_MfaTrustedDevice[];

/**
 * Lib - Auth - Get Verification Methods.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_ReturnsInfo_Methods = Shared_MfaDevice[];

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_ReturnsInfo_Status = 'complete' | 'not-required';

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_ReturnsInfo = {
  methods: Lib_Auth_ADTPulseAuth_GetVerificationMethods_ReturnsInfo_Methods;
  status: Lib_Auth_ADTPulseAuth_GetVerificationMethods_ReturnsInfo_Status;
};

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_Returns = Promise<Shared_ApiResponse<'GET_VERIFICATION_METHODS', Lib_Auth_ADTPulseAuth_GetVerificationMethods_ReturnsInfo>>;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_ErrorObject = ErrorObject | undefined;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_Sessions = Shared_Sessions<{
  axiosIndex?: AxiosResponseNodeJs<unknown>;
  axiosSignIn?: AxiosResponseNodeJs<unknown>;
  axiosMethods?: AxiosResponseNodeJs<unknown>;
}>;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosIndexRequestPath = string;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosIndexRequestPathValid = boolean;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_LoginForm = URLSearchParams;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_PortalVersion = Constant_PortalVersion;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosSignInRequestPath = string;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosSignInRequestPathValid = boolean;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_ErrorMessage = string | null;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_MatchClientType = RegExpMatchArray | null;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_MatchLocale = RegExpMatchArray | null;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_MatchLogin = RegExpMatchArray | null;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_MatchPreAuthToken = RegExpMatchArray | null;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_MatchSatCode = RegExpMatchArray | null;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosMethodsRequestPath = string;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_AxiosMethodsRequestPathValid = boolean;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_ParsedMethods = z.ZodSafeParseResult<z.infer<typeof multiFactorAuth>>;

export type Lib_Auth_ADTPulseAuth_GetVerificationMethods_ParsedMultiFactorMethods = Shared_MfaDevice[];

/**
 * Lib - Auth - Handle Login Failure.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_HandleLoginFailure_RequestPath = string | null;

export type Lib_Auth_ADTPulseAuth_HandleLoginFailure_Session = AxiosResponseNodeJs<unknown> | undefined;

export type Lib_Auth_ADTPulseAuth_HandleLoginFailure_Returns = void;

export type Lib_Auth_ADTPulseAuth_HandleLoginFailure_ErrorMessage = string | null;

/**
 * Lib - Auth - New Information Dispatcher.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_NewInformationDispatcher_Type = 'debug-parser' | 'portal-version';

export type Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DataMap<Type extends Lib_Auth_ADTPulseAuth_NewInformationDispatcher_Type> =
  Type extends 'debug-parser' ? Shared_DebugParser<'generateSensorsConfig'>
    : Type extends 'portal-version' ? Shared_PortalVersionContent
      : Type extends 'sensors-config' ? Shared_SensorConfig[]
        : never;

export type Lib_Auth_ADTPulseAuth_NewInformationDispatcher_Data = Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DataMap<Lib_Auth_ADTPulseAuth_NewInformationDispatcher_Type>;

export type Lib_Auth_ADTPulseAuth_NewInformationDispatcher_Returns = Promise<void>;

export type Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DataHash = string;

export type Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DetectedNew = boolean;

export type Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DataDebugParser = Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DataMap<'debug-parser'>;

export type Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DataPortalVersion = Lib_Auth_ADTPulseAuth_NewInformationDispatcher_DataMap<'portal-version'>;

/**
 * Lib - Auth - Request Code.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_RequestCode_MethodId = string;

export type Lib_Auth_ADTPulseAuth_RequestCode_ReturnsInfo = null;

export type Lib_Auth_ADTPulseAuth_RequestCode_Returns = Promise<Shared_ApiResponse<'REQUEST_CODE', Lib_Auth_ADTPulseAuth_RequestCode_ReturnsInfo>>;

export type Lib_Auth_ADTPulseAuth_RequestCode_ErrorObject = ErrorObject | undefined;

export type Lib_Auth_ADTPulseAuth_RequestCode_Sessions = Shared_Sessions<{
  axiosRequestCode?: AxiosResponseNodeJs<unknown>;
}>;

export type Lib_Auth_ADTPulseAuth_RequestCode_RequestCodeForm = URLSearchParams;

export type Lib_Auth_ADTPulseAuth_RequestCode_AxiosRequestCodeRequestPath = string;

export type Lib_Auth_ADTPulseAuth_RequestCode_AxiosRequestCodeRequestPathValid = boolean;

export type Lib_Auth_ADTPulseAuth_RequestCode_ParsedRequestCode = z.ZodSafeParseResult<z.infer<typeof otpResponse>>;

/**
 * Lib - Auth - Reset Session.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_ResetSession_Returns = void;

/**
 * Lib - Auth - Validate Code.
 *
 * @since 1.0.0
 */
export type Lib_Auth_ADTPulseAuth_ValidateCode_OtpCode = string;

export type Lib_Auth_ADTPulseAuth_ValidateCode_ReturnsInfo = null;

export type Lib_Auth_ADTPulseAuth_ValidateCode_Returns = Promise<Shared_ApiResponse<'VALIDATE_CODE', Lib_Auth_ADTPulseAuth_ValidateCode_ReturnsInfo>>;

export type Lib_Auth_ADTPulseAuth_ValidateCode_ErrorObject = ErrorObject | undefined;

export type Lib_Auth_ADTPulseAuth_ValidateCode_Sessions = Shared_Sessions<{
  axiosValidateCode?: AxiosResponseNodeJs<unknown>;
}>;

export type Lib_Auth_ADTPulseAuth_ValidateCode_ValidateCodeForm = URLSearchParams;

export type Lib_Auth_ADTPulseAuth_ValidateCode_AxiosValidateCodeRequestPath = string;

export type Lib_Auth_ADTPulseAuth_ValidateCode_AxiosValidateCodeRequestPathValid = boolean;

export type Lib_Auth_ADTPulseAuth_ValidateCode_ParsedValidateCode = z.ZodSafeParseResult<z.infer<typeof otpResponse>>;
