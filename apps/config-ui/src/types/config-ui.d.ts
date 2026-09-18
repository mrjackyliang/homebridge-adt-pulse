import type { IHomebridgePluginUi, PluginConfig } from '@homebridge/plugin-ui-utils/dist/ui.interface';
import type React from 'react';
import type {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  UseFieldArrayReturn,
  UseFormGetValues,
  UseFormReturn,
  UseFormSetValue,
} from 'react-hook-form';
import type { z } from 'zod';

import type {
  configUiLogin,
  configUiLoginResponse,
  configUiRequestCode,
  configUiValidateCode,
  platformConfig,
} from '../../../../packages/homebridge-adt-pulse/src/lib/schema';

/**
 * Config.
 *
 * @since 1.0.0
 */
export type Config = z.infer<typeof platformConfig>;

/**
 * Current view.
 *
 * @since 1.0.0
 */
export type CurrentView = 'settings' | 'settings-classic' | 'setup' | undefined;

/**
 * Mfa device.
 *
 * @since 1.0.0
 */
export type MfaDevice_Id = string;

export type MfaDevice_Type = 'EMAIL' | 'SMS';

export type MfaDevice_Label = string;

export type MfaDevice = {
  id: MfaDevice_Id;
  type: MfaDevice_Type;
  label: MfaDevice_Label;
};

/**
 * Plugin setting options.
 *
 * @since 1.0.0
 */
export type PluginSettingOptions =
  'disableAlarmRingingSwitch'
  | 'ignoreSensorProblemStatus';

/**
 * ADT Pulse Config Interface - Homebridge.
 *
 * @since 1.0.0
 */
export type AdtPulseConfigInterfaceHomebridge = IHomebridgePluginUi | undefined;

/**
 * ADT Pulse Config Interface - Root.
 *
 * @since 1.0.0
 */
export type AdtPulseConfigInterfaceRoot = HTMLElement | undefined;

export type AdtPulseConfigInterfaceShadow = ShadowRoot;

export type AdtPulseConfigInterfaceLink = HTMLLinkElement;

export type AdtPulseConfigInterfaceStyle = HTMLStyleElement;

export type AdtPulseConfigInterfaceMount = HTMLElement;

/**
 * ADT Pulse Config Interface - Start frontend.
 *
 * @since 1.0.0
 */
export type AdtPulseConfigInterfaceStartFrontendReturns = void;

/**
 * Fingerprint table.
 *
 * @since 1.0.0
 */
export type FingerprintTableProps_Fingerprint = string;

export type FingerprintTableProps = {
  fingerprint: FingerprintTableProps_Fingerprint;
};

export type FingerprintTableParsedObject = object;

export type FingerprintTableSetParsedObject = React.Dispatch<React.SetStateAction<FingerprintTableParsedObject>>;

export type FingerprintTableParsedObjectState = [FingerprintTableParsedObject, FingerprintTableSetParsedObject];

export type FingerprintTableStatus = 'failed' | 'loading' | 'success';

export type FingerprintTableSetStatus = React.Dispatch<React.SetStateAction<FingerprintTableStatus>>;

export type FingerprintTableStatusState = [FingerprintTableStatus, FingerprintTableSetStatus];

/**
 * Fingerprint table - Render table.
 *
 * @since 1.0.0
 */
export type FingerprintTableRenderTableData = object;

export type FingerprintTableRenderTableReturns = React.ReactNode;

export type FingerprintTableRenderTable = (data: FingerprintTableRenderTableData) => FingerprintTableRenderTableReturns;

/**
 * Fingerprint table - Render table property.
 *
 * @since 1.0.0
 */
export type FingerprintTableRenderTablePropertyProperty = string;

export type FingerprintTableRenderTablePropertyReturns = string;

export type FingerprintTableRenderTablePropertyProperties = Record<string, string>;

export type FingerprintTableRenderTableProperty = (property: FingerprintTableRenderTablePropertyProperty) => FingerprintTableRenderTablePropertyReturns;

/**
 * Fingerprint table - Render table value.
 *
 * @since 1.0.0
 */
export type FingerprintTableRenderTableValueProperty = string;

export type FingerprintTableRenderTableValueValue = unknown;

export type FingerprintTableRenderTableValueReturns = React.ReactNode;

export type FingerprintTableRenderTableValueItems = string[];

export type FingerprintTableRenderTableValue = (property: FingerprintTableRenderTableValueProperty, value: FingerprintTableRenderTableValueValue) => FingerprintTableRenderTableValueReturns;

/**
 * Router.
 *
 * @since 1.0.0
 */
export type RouterProps_Homebridge = IHomebridgePluginUi | undefined;

export type RouterProps = {
  homebridge: RouterProps_Homebridge;
};

export type RouterView = CurrentView;

export type RouterSetView = React.Dispatch<React.SetStateAction<RouterView>>;

export type RouterViewState = [RouterView, RouterSetView];

export type RouterConfig = PluginConfig;

export type RouterConfigs = PluginConfig[];

/**
 * Screen toggle.
 *
 * @since 1.0.0
 */
export type ScreenToggleProps_Children = React.ReactNode;

export type ScreenToggleProps_Homebridge = IHomebridgePluginUi | undefined;

export type ScreenToggleProps_SetView = React.Dispatch<React.SetStateAction<CurrentView>>;

export type ScreenToggleProps_View = CurrentView;

export type ScreenToggleProps = {
  children: ScreenToggleProps_Children;
  homebridge: ScreenToggleProps_Homebridge;
  setView: ScreenToggleProps_SetView;
  view: ScreenToggleProps_View;
};

export type ScreenToggleBackground = string;

export type ScreenToggleTheme = string;

export type ScreenToggleSetTheme = React.Dispatch<React.SetStateAction<ScreenToggleTheme>>;

export type ScreenToggleThemeState = [ScreenToggleTheme, ScreenToggleSetTheme];

export type ScreenToggleRoot = HTMLElement | null;

export type ScreenToggleMount = Element | null;

/**
 * Settings.
 *
 * @since 1.0.0
 */
export type SettingsProps_Homebridge = IHomebridgePluginUi | undefined;

export type SettingsProps_SetView = React.Dispatch<React.SetStateAction<CurrentView>>;

export type SettingsProps = {
  homebridge: SettingsProps_Homebridge;
  setView: SettingsProps_SetView;
};

export type SettingsForm = UseFormReturn<z.input<typeof platformConfig>, unknown, z.output<typeof platformConfig>>;

export type SettingsControl = SettingsForm['control'];

export type SettingsGetValues = SettingsForm['getValues'];

export type SettingsReset = SettingsForm['reset'];

export type SettingsSetValue = SettingsForm['setValue'];

export type SettingsWatch = SettingsForm['watch'];

export type SettingsReady = boolean;

export type SettingsSetReady = React.Dispatch<React.SetStateAction<SettingsReady>>;

export type SettingsReadyState = [SettingsReady, SettingsSetReady];

export type SettingsTab = 'general' | 'login' | 'fingerprint' | 'sensors' | 'plugin';

export type SettingsSetTab = React.Dispatch<React.SetStateAction<SettingsTab>>;

export type SettingsTabState = [SettingsTab, SettingsSetTab];

export type SettingsFormChanges = z.input<typeof platformConfig>;

export type SettingsParsedChanges = ReturnType<typeof platformConfig.safeParse>;

export type SettingsConfig = PluginConfig;

export type SettingsConfigs = PluginConfig[];

/**
 * Settings classic.
 *
 * @since 1.0.0
 */
export type SettingsClassicProps_Homebridge = IHomebridgePluginUi | undefined;

export type SettingsClassicProps_SetView = React.Dispatch<React.SetStateAction<CurrentView>>;

export type SettingsClassicProps = {
  homebridge: SettingsClassicProps_Homebridge;
  setView: SettingsClassicProps_SetView;
};

export type SettingsClassicReady = boolean;

export type SettingsClassicSetReady = React.Dispatch<React.SetStateAction<SettingsClassicReady>>;

export type SettingsClassicReadyState = [SettingsClassicReady, SettingsClassicSetReady];

/**
 * Settings fingerprint.
 *
 * @since 1.0.0
 */
export type SettingsFingerprintProps_Fingerprint = string;

export type SettingsFingerprintProps = {
  fingerprint: SettingsFingerprintProps_Fingerprint;
};

/**
 * Settings general.
 *
 * @since 1.0.0
 */
export type SettingsGeneralProps_Control = Control<z.input<typeof platformConfig>>;

export type SettingsGeneralProps_GetValues = UseFormGetValues<z.input<typeof platformConfig>>;

export type SettingsGeneralProps_SetValue = UseFormSetValue<z.input<typeof platformConfig>>;

export type SettingsGeneralProps = {
  control: SettingsGeneralProps_Control;
  getValues: SettingsGeneralProps_GetValues;
  setValue: SettingsGeneralProps_SetValue;
};

export type SettingsGeneralOptionsCheckbox_Id = string;

export type SettingsGeneralOptionsCheckbox_Label = string;

export type SettingsGeneralOptionsCheckbox_Value = PluginSettingOptions;

export type SettingsGeneralOptionsCheckbox = {
  id: SettingsGeneralOptionsCheckbox_Id;
  label: SettingsGeneralOptionsCheckbox_Label;
  value: SettingsGeneralOptionsCheckbox_Value;
};

export type SettingsGeneralOptionsCheckboxes = SettingsGeneralOptionsCheckbox[];

/**
 * Settings general - Handle options change.
 *
 * @since 1.0.0
 */
export type SettingsGeneralHandleOptionsChangeChecked = boolean;

export type SettingsGeneralHandleOptionsChangeValue = PluginSettingOptions;

export type SettingsGeneralHandleOptionsChangeReturns = void;

export type SettingsGeneralHandleOptionsChangePreviousValues = PluginSettingOptions[];

export type SettingsGeneralHandleOptionsChangeUpdatedValues = PluginSettingOptions[];

export type SettingsGeneralHandleOptionsChange = (checked: SettingsGeneralHandleOptionsChangeChecked, value: SettingsGeneralHandleOptionsChangeValue) => SettingsGeneralHandleOptionsChangeReturns;

/**
 * Settings login.
 *
 * @since 1.0.0
 */
export type SettingsLoginProps_Control = Control<z.input<typeof platformConfig>>;

export type SettingsLoginProps_GetValues = UseFormGetValues<z.input<typeof platformConfig>>;

export type SettingsLoginProps = {
  control: SettingsLoginProps_Control;
  getValues: SettingsLoginProps_GetValues;
};

/**
 * Settings login - Render password.
 *
 * @since 1.0.0
 */
export type SettingsLoginRenderPasswordField = ControllerRenderProps<z.input<typeof platformConfig>, 'password'>;

export type SettingsLoginRenderPasswordFieldState = ControllerFieldState;

/**
 * Settings login - Render subdomain.
 *
 * @since 1.0.0
 */
export type SettingsLoginRenderSubdomainField = ControllerRenderProps<z.input<typeof platformConfig>, 'subdomain'>;

export type SettingsLoginRenderSubdomainFieldState = ControllerFieldState;

/**
 * Settings login - Render username.
 *
 * @since 1.0.0
 */
export type SettingsLoginRenderUsernameField = ControllerRenderProps<z.input<typeof platformConfig>, 'username'>;

export type SettingsLoginRenderUsernameFieldState = ControllerFieldState;

/**
 * Settings plugin.
 *
 * @since 1.0.0
 */
export type SettingsPluginProps_Homebridge = IHomebridgePluginUi | undefined;

export type SettingsPluginProps_SetView = React.Dispatch<React.SetStateAction<CurrentView>>;

export type SettingsPluginProps = {
  homebridge: SettingsPluginProps_Homebridge;
  setView: SettingsPluginProps_SetView;
};

export type SettingsPluginInformation_Name = string;

export type SettingsPluginInformation_Version = string;

export type SettingsPluginInformation_Verified = boolean;

export type SettingsPluginInformation_InstanceName = string;

export type SettingsPluginInformation_InstanceId = string;

export type SettingsPluginInformation_HomebridgeVersion = string;

export type SettingsPluginInformation_NodeVersion = string;

export type SettingsPluginInformation_Platform = string;

export type SettingsPluginInformation_RunningOn = string;

export type SettingsPluginInformation = {
  name: SettingsPluginInformation_Name;
  version: SettingsPluginInformation_Version;
  verified: SettingsPluginInformation_Verified;
  instanceName: SettingsPluginInformation_InstanceName;
  instanceId: SettingsPluginInformation_InstanceId;
  homebridgeVersion: SettingsPluginInformation_HomebridgeVersion;
  nodeVersion: SettingsPluginInformation_NodeVersion;
  platform: SettingsPluginInformation_Platform;
  runningOn: SettingsPluginInformation_RunningOn;
};

export type SettingsPluginSetInformation = React.Dispatch<React.SetStateAction<SettingsPluginInformation>>;

export type SettingsPluginInformationState = [SettingsPluginInformation, SettingsPluginSetInformation];

export type SettingsPluginRunningNames = Record<string, string>;

export type SettingsPluginRunning = string[];

/**
 * Settings sensors.
 *
 * @since 1.0.0
 */
export type SettingsSensorsProps_Control = Control<z.input<typeof platformConfig>>;

export type SettingsSensorsProps = {
  control: SettingsSensorsProps_Control;
};

export type SettingsSensorsFieldArray = UseFieldArrayReturn<z.input<typeof platformConfig>, 'sensors'>;

export type SettingsSensorsSensors = SettingsSensorsFieldArray['fields'];

export type SettingsSensorsAppend = SettingsSensorsFieldArray['append'];

export type SettingsSensorsRemove = SettingsSensorsFieldArray['remove'];

export type SettingsSensorsWatch = NonNullable<z.input<typeof platformConfig>['sensors']>;

export type SettingsSensorsOpenSensor = string | null;

export type SettingsSensorsSetOpenSensor = React.Dispatch<React.SetStateAction<SettingsSensorsOpenSensor>>;

export type SettingsSensorsOpenSensorState = [SettingsSensorsOpenSensor, SettingsSensorsSetOpenSensor];

/**
 * Settings sensors - Get sensor header.
 *
 * @since 1.0.0
 */
export type SettingsSensorsGetSensorHeaderIndex = number;

export type SettingsSensorsGetSensorHeaderReturns_Name = string | null;

export type SettingsSensorsGetSensorHeaderReturns_AdtName = string | null;

export type SettingsSensorsGetSensorHeaderReturns = {
  name: SettingsSensorsGetSensorHeaderReturns_Name;
  adtName: SettingsSensorsGetSensorHeaderReturns_AdtName;
};

export type SettingsSensorsGetSensorHeaderSensor = SettingsSensorsWatch[number] | undefined;

export type SettingsSensorsGetSensorHeaderSensorName = NonNullable<SettingsSensorsGetSensorHeaderSensor>['name'];

export type SettingsSensorsGetSensorHeaderSensorAdtName = NonNullable<SettingsSensorsGetSensorHeaderSensor>['adtName'];

export type SettingsSensorsGetSensorHeader = (index: SettingsSensorsGetSensorHeaderIndex) => SettingsSensorsGetSensorHeaderReturns;

/**
 * Setup.
 *
 * @since 1.0.0
 */
export type SetupProps_Homebridge = IHomebridgePluginUi | undefined;

export type SetupProps = {
  homebridge: SetupProps_Homebridge;
};

export type SetupAvailableMethods = MfaDevice[];

export type SetupSetAvailableMethods = React.Dispatch<React.SetStateAction<SetupAvailableMethods>>;

export type SetupAvailableMethodsState = [SetupAvailableMethods, SetupSetAvailableMethods];

export type SetupCurrentPage = number;

export type SetupSetCurrentPage = React.Dispatch<React.SetStateAction<SetupCurrentPage>>;

export type SetupCurrentPageState = [SetupCurrentPage, SetupSetCurrentPage];

export type SetupSelectedMethod = string;

export type SetupSetSelectedMethod = React.Dispatch<React.SetStateAction<SetupSelectedMethod>>;

export type SetupSelectedMethodState = [SetupSelectedMethod, SetupSetSelectedMethod];

export type SetupUpdateSensors = boolean;

export type SetupSetUpdateSensors = React.Dispatch<React.SetStateAction<SetupUpdateSensors>>;

export type SetupUpdateSensorsState = [SetupUpdateSensors, SetupSetUpdateSensors];

/**
 * Setup complete.
 *
 * @since 1.0.0
 */
export type SetupCompleteProps_Homebridge = IHomebridgePluginUi | undefined;

export type SetupCompleteProps_UpdateSensors = boolean;

export type SetupCompleteProps = {
  homebridge: SetupCompleteProps_Homebridge;
  updateSensors: SetupCompleteProps_UpdateSensors;
};

/**
 * Setup complete - On submit.
 *
 * @since 1.0.0
 */
export type SetupCompleteOnSubmitConfig = PluginConfig;

export type SetupCompleteOnSubmitConfigs = PluginConfig[];

export type SetupCompleteOnSubmitGenerateConfigResponse = Awaited<ReturnType<IHomebridgePluginUi['request']>>;

export type SetupCompleteOnSubmitReturns = Promise<void>;

export type SetupCompleteOnSubmit = () => SetupCompleteOnSubmitReturns;

/**
 * Setup login.
 *
 * @since 1.0.0
 */
export type SetupLoginProps_Homebridge = IHomebridgePluginUi | undefined;

export type SetupLoginProps_SetAvailableMethods = React.Dispatch<React.SetStateAction<MfaDevice[]>>;

export type SetupLoginProps_SetCurrentPage = React.Dispatch<React.SetStateAction<number>>;

export type SetupLoginProps = {
  homebridge: SetupLoginProps_Homebridge;
  setAvailableMethods: SetupLoginProps_SetAvailableMethods;
  setCurrentPage: SetupLoginProps_SetCurrentPage;
};

export type SetupLoginForm = UseFormReturn<z.infer<typeof configUiLogin>>;

export type SetupLoginControl = SetupLoginForm['control'];

export type SetupLoginFormState = SetupLoginForm['formState'];

export type SetupLoginHandleSubmit = SetupLoginForm['handleSubmit'];

/**
 * Setup login - On form submit.
 *
 * @since 1.0.0
 */
export type SetupLoginOnFormSubmitValues_Password = string;

export type SetupLoginOnFormSubmitValues_Subdomain = string;

export type SetupLoginOnFormSubmitValues_Username = string;

export type SetupLoginOnFormSubmitValues = {
  password: SetupLoginOnFormSubmitValues_Password;
  subdomain: SetupLoginOnFormSubmitValues_Subdomain;
  username: SetupLoginOnFormSubmitValues_Username;
};

export type SetupLoginOnFormSubmitInitializeResponse = Awaited<ReturnType<IHomebridgePluginUi['request']>>;

export type SetupLoginOnFormSubmitMethodsResponse = Awaited<ReturnType<IHomebridgePluginUi['request']>>;

export type SetupLoginOnFormSubmitParsedMethodsResponse = z.ZodSafeParseResult<z.infer<typeof configUiLoginResponse>>;

export type SetupLoginOnFormSubmitReturns = Promise<void>;

export type SetupLoginOnFormSubmit = (values: SetupLoginOnFormSubmitValues) => SetupLoginOnFormSubmitReturns;

/**
 * Setup request code.
 *
 * @since 1.0.0
 */
export type SetupRequestCodeProps_AvailableMethods = MfaDevice[];

export type SetupRequestCodeProps_Homebridge = IHomebridgePluginUi | undefined;

export type SetupRequestCodeProps_SetCurrentPage = React.Dispatch<React.SetStateAction<number>>;

export type SetupRequestCodeProps_SetSelectedMethod = React.Dispatch<React.SetStateAction<string>>;

export type SetupRequestCodeProps = {
  availableMethods: SetupRequestCodeProps_AvailableMethods;
  homebridge: SetupRequestCodeProps_Homebridge;
  setCurrentPage: SetupRequestCodeProps_SetCurrentPage;
  setSelectedMethod: SetupRequestCodeProps_SetSelectedMethod;
};

export type SetupRequestCodeForm = UseFormReturn<z.infer<typeof configUiRequestCode>>;

export type SetupRequestCodeControl = SetupRequestCodeForm['control'];

export type SetupRequestCodeFormState = SetupRequestCodeForm['formState'];

export type SetupRequestCodeHandleSubmit = SetupRequestCodeForm['handleSubmit'];

/**
 * Setup request code - On form submit.
 *
 * @since 1.0.0
 */
export type SetupRequestCodeOnFormSubmitValues_MethodId = string;

export type SetupRequestCodeOnFormSubmitValues = {
  methodId: SetupRequestCodeOnFormSubmitValues_MethodId;
};

export type SetupRequestCodeOnFormSubmitRequestCodeResponse = Awaited<ReturnType<IHomebridgePluginUi['request']>>;

export type SetupRequestCodeOnFormSubmitReturns = Promise<void>;

export type SetupRequestCodeOnFormSubmitSelectedMethod = MfaDevice | undefined;

export type SetupRequestCodeOnFormSubmit = (values: SetupRequestCodeOnFormSubmitValues) => SetupRequestCodeOnFormSubmitReturns;

/**
 * Setup sensors.
 *
 * @since 1.0.0
 */
export type SetupSensorsProps_Homebridge = IHomebridgePluginUi | undefined;

export type SetupSensorsProps_SetCurrentPage = React.Dispatch<React.SetStateAction<number>>;

export type SetupSensorsProps_SetUpdateSensors = React.Dispatch<React.SetStateAction<boolean>>;

export type SetupSensorsProps = {
  homebridge: SetupSensorsProps_Homebridge;
  setCurrentPage: SetupSensorsProps_SetCurrentPage;
  setUpdateSensors: SetupSensorsProps_SetUpdateSensors;
};

export type SetupSensorsHasExistingSensors = boolean;

export type SetupSensorsSetHasExistingSensors = React.Dispatch<React.SetStateAction<SetupSensorsHasExistingSensors>>;

export type SetupSensorsHasExistingSensorsState = [SetupSensorsHasExistingSensors, SetupSensorsSetHasExistingSensors];

export type SetupSensorsConfig = PluginConfig;

export type SetupSensorsConfigs = PluginConfig[];

/**
 * Setup sensors - On submit.
 *
 * @since 1.0.0
 */
export type SetupSensorsOnSubmitUpdateSensors = boolean;

export type SetupSensorsOnSubmitReturns = Promise<void>;

export type SetupSensorsOnSubmit = (updateSensors: SetupSensorsOnSubmitUpdateSensors) => SetupSensorsOnSubmitReturns;

/**
 * Setup validate.
 *
 * @since 1.0.0
 */
export type SetupValidateProps_Homebridge = IHomebridgePluginUi | undefined;

export type SetupValidateProps_SelectedMethod = string;

export type SetupValidateProps_SetCurrentPage = React.Dispatch<React.SetStateAction<number>>;

export type SetupValidateProps = {
  homebridge: SetupValidateProps_Homebridge;
  selectedMethod: SetupValidateProps_SelectedMethod;
  setCurrentPage: SetupValidateProps_SetCurrentPage;
};

export type SetupValidateForm = UseFormReturn<z.infer<typeof configUiValidateCode>>;

export type SetupValidateControl = SetupValidateForm['control'];

export type SetupValidateFormState = SetupValidateForm['formState'];

export type SetupValidateHandleSubmit = SetupValidateForm['handleSubmit'];

/**
 * Setup validate - On form submit.
 *
 * @since 1.0.0
 */
export type SetupValidateOnFormSubmitValues_OtpCode = string;

export type SetupValidateOnFormSubmitValues = {
  otpCode: SetupValidateOnFormSubmitValues_OtpCode;
};

export type SetupValidateOnFormSubmitReturns = Promise<void>;

export type SetupValidateOnFormSubmitValidateResponse = Awaited<ReturnType<IHomebridgePluginUi['request']>>;

export type SetupValidateOnFormSubmit = (values: SetupValidateOnFormSubmitValues) => SetupValidateOnFormSubmitReturns;

/**
 * Setup welcome.
 *
 * @since 1.0.0
 */
export type SetupWelcomeProps_SetCurrentPage = React.Dispatch<React.SetStateAction<number>>;

export type SetupWelcomeProps = {
  setCurrentPage: SetupWelcomeProps_SetCurrentPage;
};

/**
 * Styles.
 *
 * @since 1.0.0
 */
export type Styles = Record<string, React.CSSProperties>;
