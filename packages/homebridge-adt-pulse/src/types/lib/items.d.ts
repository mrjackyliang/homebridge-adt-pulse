import type {
  Constant_PluginDeviceSensorType,
  Constant_PortalDeviceGatewayStatus,
  Constant_PortalDevicePanelStatus,
  Constant_PortalDeviceSensorStatus,
  Constant_PortalPanelArmButtonHref,
  Constant_PortalPanelArmButtonLoadingText,
  Constant_PortalPanelArmButtonRelativeUrl,
  Constant_PortalPanelArmButtonText,
  Constant_PortalPanelArmStateClean,
  Constant_PortalPanelArmStateDirty,
  Constant_PortalPanelArmStateForce,
  Constant_PortalPanelArmValue,
  Constant_PortalPanelForceArmButtonHref,
  Constant_PortalPanelForceArmButtonRelativeUrl,
  Constant_PortalPanelNote,
  Constant_PortalPanelState,
  Constant_PortalPanelStatus,
  Constant_PortalSensorDeviceType,
  Constant_PortalSensorStatusIcon,
  Constant_PortalSensorStatusText,
  Constant_PortalVersion,
} from '../constant.d.ts';

/**
 * Lib - Items - Collection Do Submit Handlers.
 *
 * @since 1.0.0
 */
export type Lib_Items_CollectionDoSubmitHandler_Description = string;

export type Lib_Items_CollectionDoSubmitHandler_Handler_Href = Constant_PortalPanelForceArmButtonHref;

export type Lib_Items_CollectionDoSubmitHandler_Handler = {
  href: Lib_Items_CollectionDoSubmitHandler_Handler_Href;
};

export type Lib_Items_CollectionDoSubmitHandler_Handlers = Lib_Items_CollectionDoSubmitHandler_Handler[];

export type Lib_Items_CollectionDoSubmitHandler = {
  description: Lib_Items_CollectionDoSubmitHandler_Description;
  handlers: Lib_Items_CollectionDoSubmitHandler_Handlers;
};

export type Lib_Items_CollectionDoSubmitHandlers = Lib_Items_CollectionDoSubmitHandler[];

/**
 * Lib - Items - Collection Orb Security Buttons.
 *
 * @since 1.0.0
 */
export type Lib_Items_CollectionOrbSecurityButton_Description = string;

export type Lib_Items_CollectionOrbSecurityButton_Button_ButtonDisabled = boolean;

export type Lib_Items_CollectionOrbSecurityButton_Button_ButtonText = Constant_PortalPanelArmButtonText | Constant_PortalPanelArmButtonLoadingText;

export type Lib_Items_CollectionOrbSecurityButton_Button_LoadingText = Constant_PortalPanelArmButtonLoadingText | null;

export type Lib_Items_CollectionOrbSecurityButton_Button = {
  buttonDisabled: Lib_Items_CollectionOrbSecurityButton_Button_ButtonDisabled;
  buttonText: Lib_Items_CollectionOrbSecurityButton_Button_ButtonText;
  loadingText: Lib_Items_CollectionOrbSecurityButton_Button_LoadingText;
};

export type Lib_Items_CollectionOrbSecurityButton_Buttons = Lib_Items_CollectionOrbSecurityButton_Button[];

export type Lib_Items_CollectionOrbSecurityButton = {
  description: Lib_Items_CollectionOrbSecurityButton_Description;
  buttons: Lib_Items_CollectionOrbSecurityButton_Buttons;
};

export type Lib_Items_CollectionOrbSecurityButtons = Lib_Items_CollectionOrbSecurityButton[];

/**
 * Lib - Items - Collection Sensor Actions.
 *
 * @since 1.0.0
 */
export type Lib_Items_CollectionSensorAction_Type = Constant_PluginDeviceSensorType;

export type Lib_Items_CollectionSensorAction_Status = string;

export type Lib_Items_CollectionSensorAction_Statuses = Lib_Items_CollectionSensorAction_Status[];

export type Lib_Items_CollectionSensorAction = {
  type: Lib_Items_CollectionSensorAction_Type;
  statuses: Lib_Items_CollectionSensorAction_Statuses;
};

export type Lib_Items_CollectionSensorActions = Lib_Items_CollectionSensorAction[];

/**
 * Lib - Items - Device Gateways.
 *
 * @since 1.0.0
 */
export type Lib_Items_DeviceGateway_Description = string;

export type Lib_Items_DeviceGateway_Gateway_Manufacturer = string | null;

export type Lib_Items_DeviceGateway_Gateway_Model = string | null;

export type Lib_Items_DeviceGateway_Gateway_PrimaryConnectionType = string | null;

export type Lib_Items_DeviceGateway_Gateway = {
  manufacturer: Lib_Items_DeviceGateway_Gateway_Manufacturer;
  model: Lib_Items_DeviceGateway_Gateway_Model;
  primaryConnectionType: Lib_Items_DeviceGateway_Gateway_PrimaryConnectionType;
};

export type Lib_Items_DeviceGateway = {
  description: Lib_Items_DeviceGateway_Description;
  gateway: Lib_Items_DeviceGateway_Gateway;
};

export type Lib_Items_DeviceGateways = Lib_Items_DeviceGateway[];

/**
 * Lib - Items - Device Security Panels.
 *
 * @since 1.0.0
 */
export type Lib_Items_DeviceSecurityPanel_Description = string;

export type Lib_Items_DeviceSecurityPanel_Panel_ManufacturerProvider = string | null;

export type Lib_Items_DeviceSecurityPanel_Panel_TypeModel = string | null;

export type Lib_Items_DeviceSecurityPanel_Panel = {
  manufacturerProvider: Lib_Items_DeviceSecurityPanel_Panel_ManufacturerProvider;
  typeModel: Lib_Items_DeviceSecurityPanel_Panel_TypeModel;
};

export type Lib_Items_DeviceSecurityPanel = {
  description: Lib_Items_DeviceSecurityPanel_Description;
  panel: Lib_Items_DeviceSecurityPanel_Panel;
};

export type Lib_Items_DeviceSecurityPanels = Lib_Items_DeviceSecurityPanel[];

/**
 * Lib - Items - Item Condensed Sensor Types.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemCondensedSensorType = Constant_PluginDeviceSensorType;

export type Lib_Items_ItemCondensedSensorTypes = Lib_Items_ItemCondensedSensorType[];

/**
 * Lib - Items - Item Do Submit Handler Relative URLs.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemDoSubmitHandlerRelativeUrl = Constant_PortalPanelForceArmButtonRelativeUrl;

export type Lib_Items_ItemDoSubmitHandlerRelativeUrls = Lib_Items_ItemDoSubmitHandlerRelativeUrl[];

/**
 * Lib - Items - Item Do Submit Handler URL Params Arm States.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemDoSubmitHandlerUrlParamsArmState = Constant_PortalPanelArmStateForce;

export type Lib_Items_ItemDoSubmitHandlerUrlParamsArmStates = Lib_Items_ItemDoSubmitHandlerUrlParamsArmState[];

/**
 * Lib - Items - Item Do Submit Handler URL Params Arms.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemDoSubmitHandlerUrlParamsArm = Exclude<Constant_PortalPanelArmValue, 'off'>;

export type Lib_Items_ItemDoSubmitHandlerUrlParamsArms = Lib_Items_ItemDoSubmitHandlerUrlParamsArm[];

/**
 * Lib - Items - Item Do Submit Handler URL Params Hrefs.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemDoSubmitHandlerUrlParamsHref = Constant_PortalPanelForceArmButtonHref;

export type Lib_Items_ItemDoSubmitHandlerUrlParamsHrefs = Lib_Items_ItemDoSubmitHandlerUrlParamsHref[];

/**
 * Lib - Items - Item Gateway Information Statuses.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemGatewayInformationStatus = Constant_PortalDeviceGatewayStatus;

export type Lib_Items_ItemGatewayInformationStatuses = Lib_Items_ItemGatewayInformationStatus[];

/**
 * Lib - Items - Item Orb Security Button Button Texts.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemOrbSecurityButtonButtonText = Constant_PortalPanelArmButtonText;

export type Lib_Items_ItemOrbSecurityButtonButtonTexts = Lib_Items_ItemOrbSecurityButtonButtonText[];

/**
 * Lib - Items - Item Orb Security Button Loading Texts.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemOrbSecurityButtonLoadingText = Constant_PortalPanelArmButtonLoadingText;

export type Lib_Items_ItemOrbSecurityButtonLoadingTexts = Lib_Items_ItemOrbSecurityButtonLoadingText[];

/**
 * Lib - Items - Item Orb Security Button Relative URLs.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemOrbSecurityButtonRelativeUrl = Constant_PortalPanelArmButtonRelativeUrl;

export type Lib_Items_ItemOrbSecurityButtonRelativeUrls = Lib_Items_ItemOrbSecurityButtonRelativeUrl[];

/**
 * Lib - Items - Item Orb Security Button URL Params Arm States.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemOrbSecurityButtonUrlParamsArmState = '' | Constant_PortalPanelArmStateClean | Constant_PortalPanelArmStateDirty;

export type Lib_Items_ItemOrbSecurityButtonUrlParamsArmStates = Lib_Items_ItemOrbSecurityButtonUrlParamsArmState[];

/**
 * Lib - Items - Item Orb Security Button URL Params Arms.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemOrbSecurityButtonUrlParamsArm = Constant_PortalPanelArmValue;

export type Lib_Items_ItemOrbSecurityButtonUrlParamsArms = Lib_Items_ItemOrbSecurityButtonUrlParamsArm[];

/**
 * Lib - Items - Item Orb Security Button URL Params Hrefs.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemOrbSecurityButtonUrlParamsHref = Constant_PortalPanelArmButtonHref;

export type Lib_Items_ItemOrbSecurityButtonUrlParamsHrefs = Lib_Items_ItemOrbSecurityButtonUrlParamsHref[];

/**
 * Lib - Items - Item Panel Information Statuses.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemPanelInformationStatus = Constant_PortalDevicePanelStatus;

export type Lib_Items_ItemPanelInformationStatuses = Lib_Items_ItemPanelInformationStatus[];

/**
 * Lib - Items - Item Panel Status Notes.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemPanelStatusNote = Constant_PortalPanelNote;

export type Lib_Items_ItemPanelStatusNotes = Lib_Items_ItemPanelStatusNote[];

/**
 * Lib - Items - Item Panel Status States.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemPanelStatusState = Constant_PortalPanelState;

export type Lib_Items_ItemPanelStatusStates = Lib_Items_ItemPanelStatusState[];

/**
 * Lib - Items - Item Panel Status Statuses.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemPanelStatusStatus = Constant_PortalPanelStatus;

export type Lib_Items_ItemPanelStatusStatuses = Lib_Items_ItemPanelStatusStatus[];

export type Lib_Items_ItemPanelStatusStatuses_SensorsOpen = `${number} Sensors Open`;

/**
 * Lib - Items - Item Portal Versions.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemPortalVersion = Constant_PortalVersion;

export type Lib_Items_ItemPortalVersions = Lib_Items_ItemPortalVersion[];

/**
 * Lib - Items - Item Sensor Information Device Types.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemSensorInformationDeviceType = Constant_PortalSensorDeviceType;

export type Lib_Items_ItemSensorInformationDeviceTypes = Lib_Items_ItemSensorInformationDeviceType[];

/**
 * Lib - Items - Item Sensor Information Statuses.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemSensorInformationStatus = Constant_PortalDeviceSensorStatus;

export type Lib_Items_ItemSensorInformationStatuses = Lib_Items_ItemSensorInformationStatus[];

/**
 * Lib - Items - Item Sensor Status Icons.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemSensorStatusIcon = Constant_PortalSensorStatusIcon;

export type Lib_Items_ItemSensorStatusIcons = Lib_Items_ItemSensorStatusIcon[];

/**
 * Lib - Items - Item Sensor Status Statuses.
 *
 * @since 1.0.0
 */
export type Lib_Items_ItemSensorStatusStatus = Constant_PortalSensorStatusText;

export type Lib_Items_ItemSensorStatusStatuses = Lib_Items_ItemSensorStatusStatus[];
