import type { IHomebridgePluginUi } from '@homebridge/plugin-ui-utils/dist/ui.interface';
import type { z } from 'zod';

import type { ADTPulseAuth } from '@/lib/auth.js';
import type {
  configServerLogin,
  configServerRequestCode,
  configServerValidate,
  platformConfig,
} from '@/lib/schema.js';
import type { ApiResponse, CurrentView, MfaDevice } from '@/types/shared.d.ts';

/**
 * ADT Pulse Config Interface - Homebridge.
 *
 * @since 1.0.0
 */
export type ADTPulseConfigInterfaceHomebridge = IHomebridgePluginUi | undefined;

/**
 * ADT Pulse Config Interface - Load bootstrap.
 *
 * @since 1.0.0
 */
export type ADTPulseConfigInterfaceLoadBootstrapReturns = void;

export type ADTPulseConfigInterfaceLoadBootstrapScriptElement = string;

export type ADTPulseConfigInterfaceLoadBootstrapScriptParam = [string, string];

export type ADTPulseConfigInterfaceLoadBootstrapScriptParams = ADTPulseConfigInterfaceLoadBootstrapScriptParam[];

export type ADTPulseConfigInterfaceLoadBootstrapScript = {
  element: ADTPulseConfigInterfaceLoadBootstrapScriptElement;
  params: ADTPulseConfigInterfaceLoadBootstrapScriptParams;
};

export type ADTPulseConfigInterfaceLoadBootstrapScripts = ADTPulseConfigInterfaceLoadBootstrapScript[];

/**
 * ADT Pulse Config Interface - Root.
 *
 * @since 1.0.0
 */
export type ADTPulseConfigInterfaceRoot = HTMLElement | undefined;

/**
 * ADT Pulse Config Interface - Start frontend.
 *
 * @since 1.0.0
 */
export type ADTPulseConfigInterfaceStartFrontendReturns = void;

/**
 * ADT Pulse Config Server - Auth.
 *
 * @since 1.0.0
 */
export type ADTPulseConfigServerAuth = ADTPulseAuth | undefined;

/**
 * ADT Pulse Config Server - Generate config.
 *
 * @since 1.0.0
 */
export type ADTPulseConfigServerGenerateConfigPayloadOldConfig = Partial<z.infer<typeof platformConfig>>;

export type ADTPulseConfigServerGenerateConfigPayloadUpdateSensors = boolean;

export type ADTPulseConfigServerGenerateConfigPayload = {
  oldConfig: ADTPulseConfigServerGenerateConfigPayloadOldConfig;
  updateSensors?: ADTPulseConfigServerGenerateConfigPayloadUpdateSensors;
};

export type ADTPulseConfigServerGenerateConfigReturnsInfoConfig = z.infer<typeof platformConfig>;

export type ADTPulseConfigServerGenerateConfigReturnsInfo = {
  config: ADTPulseConfigServerGenerateConfigReturnsInfoConfig;
};

export type ADTPulseConfigServerGenerateConfigReturns = Promise<ApiResponse<'UI_GENERATE_CONFIG', ADTPulseConfigServerGenerateConfigReturnsInfo>>;

/**
 * ADT Pulse Config Server - Get methods.
 *
 * @since 1.0.0
 */
export type ADTPulseConfigServerGetMethodsReturnsInfoMethods = MfaDevice[];

export type ADTPulseConfigServerGetMethodsReturnsInfo = {
  methods: ADTPulseConfigServerGetMethodsReturnsInfoMethods;
};

export type ADTPulseConfigServerGetMethodsReturns = Promise<ApiResponse<'UI_GET_METHODS', ADTPulseConfigServerGetMethodsReturnsInfo>>;

/**
 * ADT Pulse Config Server - Initialize.
 *
 * @since 1.0.0
 */
export type ADTPulseConfigServerInitializePayload = z.infer<typeof configServerLogin>;

export type ADTPulseConfigServerInitializeReturnsInfo = null;

export type ADTPulseConfigServerInitializeReturns = Promise<ApiResponse<'UI_INITIALIZE', ADTPulseConfigServerInitializeReturnsInfo>>;

/**
 * ADT Pulse Config Server - Request code.
 *
 * @since 1.0.0
 */
export type ADTPulseConfigServerRequestCodePayload = z.infer<typeof configServerRequestCode>;

export type ADTPulseConfigServerRequestCodeReturnsInfo = null;

export type ADTPulseConfigServerRequestCodeReturns = Promise<ApiResponse<'UI_REQUEST_CODE', ADTPulseConfigServerRequestCodeReturnsInfo>>;

/**
 * ADT Pulse Config Server - Start backend.
 *
 * @since 1.0.0
 */
export type ADTPulseConfigServerStartBackendReturns = void;

/**
 * ADT Pulse Config Server - User input.
 *
 * @since 1.0.0
 */
export type ADTPulseConfigServerUserInput = z.infer<typeof configServerLogin> | undefined;

/**
 * ADT Pulse Config Server - Validate.
 *
 * @since 1.0.0
 */
export type ADTPulseConfigServerValidatePayload = z.infer<typeof configServerValidate>;

export type ADTPulseConfigServerValidateReturnsInfo = null;

export type ADTPulseConfigServerValidateReturns = Promise<ApiResponse<'UI_VALIDATE', ADTPulseConfigServerValidateReturnsInfo>>;

/**
 * Router.
 *
 * @since 1.0.0
 */
export type RouterPropsHomebridge = IHomebridgePluginUi | undefined;

export type RouterProps = {
  homebridge: RouterPropsHomebridge;
};

export type RouterView = CurrentView;

/**
 * Screen toggle.
 *
 * @since 1.0.0
 */
export type ScreenTogglePropsChildren = React.ReactNode;

export type ScreenTogglePropsSetView = React.Dispatch<React.SetStateAction<CurrentView>>;

export type ScreenTogglePropsView = CurrentView;

export type ScreenToggleProps = {
  children: ScreenTogglePropsChildren;
  setView: ScreenTogglePropsSetView;
  view: ScreenTogglePropsView;
};

/**
 * Settings.
 *
 * @since 1.0.0
 */
export type SettingsPropsHomebridge = IHomebridgePluginUi | undefined;

export type SettingsPropsSetView = React.Dispatch<React.SetStateAction<CurrentView>>;

export type SettingsProps = {
  homebridge: SettingsPropsHomebridge;
  setView: SettingsPropsSetView;
};

/**
 * Setup.
 *
 * @since 1.0.0
 */
export type SetupPropsHomebridge = IHomebridgePluginUi | undefined;

export type SetupProps = {
  homebridge: SetupPropsHomebridge;
};

export type SetupAvailableMethods = MfaDevice[];

/**
 * Setup complete.
 *
 * @since 1.0.0
 */
export type SetupCompletePropsHomebridge = IHomebridgePluginUi | undefined;

export type SetupCompletePropsUpdateSensors = boolean;

export type SetupCompleteProps = {
  homebridge:SetupCompletePropsHomebridge;
  updateSensors: SetupCompletePropsUpdateSensors;
};

/**
 * Setup complete - On submit.
 *
 * @since 1.0.0
 */
export type SetupCompleteOnSubmitReturns = Promise<void>;

/**
 * Setup login.
 *
 * @since 1.0.0
 */
export type SetupLoginPropsHomebridge = IHomebridgePluginUi | undefined;

export type SetupLoginPropsSetAvailableMethods = React.Dispatch<React.SetStateAction<MfaDevice[]>>;

export type SetupLoginPropsSetCurrentPage = React.Dispatch<React.SetStateAction<number>>;

export type SetupLoginProps = {
  homebridge: SetupLoginPropsHomebridge;
  setAvailableMethods: SetupLoginPropsSetAvailableMethods;
  setCurrentPage: SetupLoginPropsSetCurrentPage;
};

/**
 * Setup login - On form submit.
 *
 * @since 1.0.0
 */
export type SetupLoginOnFormSubmitValuesPassword = string;

export type SetupLoginOnFormSubmitValuesSubdomain = string;

export type SetupLoginOnFormSubmitValuesUsername = string;

export type SetupLoginOnFormSubmitValues = {
  password: SetupLoginOnFormSubmitValuesPassword;
  subdomain: SetupLoginOnFormSubmitValuesSubdomain;
  username: SetupLoginOnFormSubmitValuesUsername;
};

export type SetupLoginOnFormSubmitReturns = Promise<void>;

/**
 * Setup request code.
 *
 * @since 1.0.0
 */
export type SetupRequestCodePropsAvailableMethods = MfaDevice[];

export type SetupRequestCodePropsHomebridge = IHomebridgePluginUi | undefined;

export type SetupRequestCodePropsSetCurrentPage = React.Dispatch<React.SetStateAction<number>>;

export type SetupRequestCodePropsSetSelectedMethod = React.Dispatch<React.SetStateAction<string>>;

export type SetupRequestCodeProps = {
  availableMethods: SetupRequestCodePropsAvailableMethods;
  homebridge: SetupRequestCodePropsHomebridge;
  setCurrentPage: SetupRequestCodePropsSetCurrentPage;
  setSelectedMethod: SetupRequestCodePropsSetSelectedMethod;
};

/**
 * Setup request code - On form submit.
 *
 * @since 1.0.0
 */
export type SetupRequestCodeOnFormSubmitValuesMethodId = string;

export type SetupRequestCodeOnFormSubmitValues = {
  methodId: SetupRequestCodeOnFormSubmitValuesMethodId;
};

export type SetupRequestCodeOnFormSubmitReturns = Promise<void>;

/**
 * Setup sensors.
 *
 * @since 1.0.0
 */
export type SetupSensorsPropsHomebridge = IHomebridgePluginUi | undefined;

export type SetupSensorsPropsSetCurrentPage = React.Dispatch<React.SetStateAction<number>>;

export type SetupSensorsPropsSetUpdateSensors = React.Dispatch<React.SetStateAction<boolean>>;

export type SetupSensorsProps = {
  homebridge: SetupSensorsPropsHomebridge;
  setCurrentPage: SetupSensorsPropsSetCurrentPage;
  setUpdateSensors: SetupSensorsPropsSetUpdateSensors;
};

/**
 * Setup sensors - On submit.
 *
 * @since 1.0.0
 */
export type SetupSensorsOnSubmitUpdateSensors = boolean;

export type SetupSensorsOnSubmitReturns = Promise<void>;

/**
 * Setup validate.
 *
 * @since 1.0.0
 */
export type SetupValidatePropsHomebridge = IHomebridgePluginUi | undefined;

export type SetupValidatePropsSelectedMethod = string;

export type SetupValidatePropsSetCurrentPage = React.Dispatch<React.SetStateAction<number>>;

export type SetupValidateProps = {
  homebridge: SetupValidatePropsHomebridge;
  selectedMethod: SetupValidatePropsSelectedMethod;
  setCurrentPage: SetupValidatePropsSetCurrentPage;
};

/**
 * Setup validate - On form submit.
 *
 * @since 1.0.0
 */
export type SetupValidateOnFormSubmitValuesOtpCode = string;

export type SetupValidateOnFormSubmitValues = {
  otpCode: SetupValidateOnFormSubmitValuesOtpCode;
};

export type SetupValidateOnFormSubmitReturns = Promise<void>;

/**
 * Setup welcome.
 *
 * @since 1.0.0
 */
export type SetupWelcomePropsSetCurrentPage = React.Dispatch<React.SetStateAction<number>>;

export type SetupWelcomeProps = {
  setCurrentPage: SetupWelcomePropsSetCurrentPage;
};

/**
 * Styles.
 *
 * @since 1.0.0
 */
export type Styles = React.CSSProperties;