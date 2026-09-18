import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ADTPulseAccessory } from '../../lib/accessory.js';
import { platformConfig } from '../../lib/schema.js';

import type { CharacteristicValue } from 'homebridge';
import type {
  Lib_Accessory_ADTPulseAccessory_Constructor_Accessory,
  Lib_Accessory_ADTPulseAccessory_Constructor_Api,
  Lib_Accessory_ADTPulseAccessory_Constructor_Characteristic,
  Lib_Accessory_ADTPulseAccessory_Constructor_Instance,
  Lib_Accessory_ADTPulseAccessory_Constructor_Log,
  Lib_Accessory_ADTPulseAccessory_Constructor_Service,
  Lib_Accessory_ADTPulseAccessory_Constructor_State,
} from '../../types/lib/accessory.d.ts';
import type { Shared_Device_Type } from '../../types/shared.d.ts';
import type {
  Constant_PortalPanelState,
  Constant_PortalPanelStatus,
  Constant_PortalSensorStatusIcon,
  Constant_PortalSensorStatusText,
} from '../../types/constant.d.ts';

class MockHapStatusError extends Error {
  public readonly hapStatus: number;

  public constructor(hapStatus: number) {
    super(`HAP status ${hapStatus}`);
    this.hapStatus = hapStatus;
  }
}

const hapStatus = {
  INVALID_VALUE_IN_REQUEST: -70410,
  NOT_ALLOWED_IN_CURRENT_STATE: -70412,
  OPERATION_TIMED_OUT: -70408,
  RESOURCE_BUSY: -70403,
  RESOURCE_DOES_NOT_EXIST: -70409,
  SERVICE_COMMUNICATION_FAILURE: -70402,
  SUCCESS: 0,
};

const characteristic = {
  CarbonMonoxideDetected: {
    CO_LEVELS_ABNORMAL: 1,
    CO_LEVELS_NORMAL: 0,
  },
  ContactSensorState: {
    CONTACT_DETECTED: 0,
    CONTACT_NOT_DETECTED: 1,
  },
  CurrentTemperature: 'CurrentTemperature',
  FirmwareRevision: 'FirmwareRevision',
  HardwareRevision: 'HardwareRevision',
  Identify: 'Identify',
  LeakDetected: {
    LEAK_DETECTED: 1,
    LEAK_NOT_DETECTED: 0,
  },
  Manufacturer: 'Manufacturer',
  Model: 'Model',
  MotionDetected: 'MotionDetected',
  Name: 'Name',
  OccupancyDetected: {
    OCCUPANCY_DETECTED: 1,
    OCCUPANCY_NOT_DETECTED: 0,
  },
  On: 'On',
  SecuritySystemAlarmType: 'SecuritySystemAlarmType',
  SecuritySystemCurrentState: {
    ALARM_TRIGGERED: 4,
    AWAY_ARM: 1,
    DISARMED: 3,
    NIGHT_ARM: 2,
    STAY_ARM: 0,
  },
  SecuritySystemTargetState: {
    AWAY_ARM: 1,
    DISARM: 3,
    NIGHT_ARM: 2,
    STAY_ARM: 0,
  },
  SerialNumber: 'SerialNumber',
  SmokeDetected: {
    SMOKE_DETECTED: 1,
    SMOKE_NOT_DETECTED: 0,
  },
  SoftwareRevision: 'SoftwareRevision',
  StatusActive: 'StatusActive',
  StatusFault: {
    GENERAL_FAULT: 1,
    NO_FAULT: 0,
  },
  StatusLowBattery: {
    BATTERY_LEVEL_LOW: 1,
    BATTERY_LEVEL_NORMAL: 0,
  },
  StatusTampered: {
    NOT_TAMPERED: 0,
    TAMPERED: 1,
  },
};

const service = {
  AccessoryInformation: 'AccessoryInformation',
  CarbonMonoxideSensor: 'CarbonMonoxideSensor',
  ContactSensor: 'ContactSensor',
  LeakSensor: 'LeakSensor',
  MotionSensor: 'MotionSensor',
  OccupancySensor: 'OccupancySensor',
  SecuritySystem: 'SecuritySystem',
  SmokeSensor: 'SmokeSensor',
  Switch: 'Switch',
  TemperatureSensor: 'TemperatureSensor',
};

type Tests_Lib_Accessory_CreateHarness_GetRecord_Setter = (value: CharacteristicValue) => Promise<void>;

type Tests_Lib_Accessory_CreateHarness_GetRecord_Record = {
  onSet: ReturnType<typeof vi.fn>;
  setter: Tests_Lib_Accessory_CreateHarness_GetRecord_Setter | undefined;
  updateValue: ReturnType<typeof vi.fn>;
};

type Tests_Lib_Accessory_CreateHarness_GetRecord_CaptureSetter = (setter: Tests_Lib_Accessory_CreateHarness_GetRecord_Setter) => Tests_Lib_Accessory_CreateHarness_GetRecord_Record;

type Tests_Lib_Accessory_CreateHarness_Type = Shared_Device_Type;

type Tests_Lib_Accessory_CreateHarness_Options = {
  icon?: Constant_PortalSensorStatusIcon;
  panelStates?: Constant_PortalPanelState[];
  panelStatuses?: Constant_PortalPanelStatus[];
  sensorStatuses?: Constant_PortalSensorStatusText[];
};

function createHarness(type: Tests_Lib_Accessory_CreateHarness_Type, options: Tests_Lib_Accessory_CreateHarness_Options = {}) {
  const records = new Map<unknown, Tests_Lib_Accessory_CreateHarness_GetRecord_Record>();

  const getRecord = (key: unknown): Tests_Lib_Accessory_CreateHarness_GetRecord_Record => {
    const existing = records.get(key);

    if (existing !== undefined) {
      return existing;
    }

    const record: Tests_Lib_Accessory_CreateHarness_GetRecord_Record = {
      onSet: vi.fn(),
      setter: undefined,
      updateValue: vi.fn(),
    };

    const captureSetter: Tests_Lib_Accessory_CreateHarness_GetRecord_CaptureSetter = (setter) => {
      record.setter = setter;

      return record;
    };

    record.onSet.mockImplementation(captureSetter);
    record.updateValue.mockReturnValue(record);
    records.set(key, record);

    return record;
  };

  const serviceMock = {
    getCharacteristic: vi.fn((key: unknown) => getRecord(key)),
    setCharacteristic: vi.fn(),
  };
  serviceMock.setCharacteristic.mockReturnValue(serviceMock);

  const accessory = {
    addService: vi.fn(() => serviceMock),
    context: {
      category: 'Sensor',
      firmware: '1.2.3',
      hardware: '4.5.6',
      id: 'fixture-device',
      manufacturer: 'ADT',
      model: 'Fixture',
      name: 'Fixture Device',
      originalName: 'Portal Fixture',
      serial: 'fixture-serial',
      software: '7.8.9',
      type,
      uuid: 'fixture-uuid',
      zone: type === 'panel' || type === 'panelSwitch' || type === 'gateway' ? null : 1,
    },
    getService: vi.fn(() => undefined),
  } as unknown as Lib_Accessory_ADTPulseAccessory_Constructor_Accessory;
  const state = {
    activity: {
      isAdtKeepingAlive: false,
      isAdtSyncChecking: false,
      isLoggingIn: false,
      isSyncing: false,
    },
    data: {
      gatewayInfo: null,
      orbSecurityButtons: [],
      panelInfo: null,
      panelStatus: {
        panelNotes: [],
        panelStates: options.panelStates ?? ['Disarmed'],
        panelStatuses: options.panelStatuses ?? ['All Quiet'],
        rawData: {
          node: '',
          unknownPieces: [],
        },
      },
      sensorsInfo: [],
      sensorsStatus: type === 'panel' || type === 'panelSwitch' || type === 'gateway'
        ? []
        : [{
            icon: options.icon ?? 'devStatOK',
            name: 'Portal Fixture',
            statuses: options.sensorStatuses ?? ['Okay'],
            zone: 1,
          }],
      syncCode: null,
    },
    eventCounters: {
      failedLogins: 0,
    },
    intervals: {
      synchronize: undefined,
    },
    lastRunOn: {
      adtKeepAlive: 0,
      adtLastLogin: 0,
      adtSyncCheck: 0,
    },
    reportedHashes: [],
  } as unknown as Lib_Accessory_ADTPulseAccessory_Constructor_State;
  const instanceMethods = {
    setPanelStatus: vi.fn().mockResolvedValue({
      success: true,
    }),
  };
  const loggerMethods = {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    log: vi.fn(),
    success: vi.fn(),
    warn: vi.fn(),
  };
  const handler = new ADTPulseAccessory(
    accessory,
    state,
    platformConfig.parse({
      fingerprint: 'fixture-fingerprint',
      mode: 'normal',
      name: 'ADT Pulse',
      options: [],
      password: 'fixture-password',
      platform: 'ADTPulse',
      sensors: [],
      speed: 1,
      subdomain: 'portal',
      username: 'fixture-user',
    }),
    instanceMethods as unknown as Lib_Accessory_ADTPulseAccessory_Constructor_Instance,
    service as unknown as Lib_Accessory_ADTPulseAccessory_Constructor_Service,
    characteristic as unknown as Lib_Accessory_ADTPulseAccessory_Constructor_Characteristic,
    {
      hap: {
        HAPStatus: hapStatus,
        HapStatusError: MockHapStatusError,
      },
    } as unknown as Lib_Accessory_ADTPulseAccessory_Constructor_Api,
    loggerMethods as unknown as Lib_Accessory_ADTPulseAccessory_Constructor_Log,
  );

  const recordFor = (key: unknown): Tests_Lib_Accessory_CreateHarness_GetRecord_Record => {
    const record = records.get(key);

    if (record === undefined) {
      throw new Error('Expected characteristic to have been initialized.');
    }

    return record;
  };

  return {
    accessory,
    handler,
    instanceMethods,
    loggerMethods,
    recordFor,
    state,
  };
}

describe('ADTPulseAccessory', () => {
  it.each([
    ['co', ['Okay'], characteristic.CarbonMonoxideDetected, characteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL],
    ['co', ['Tripped'], characteristic.CarbonMonoxideDetected, characteristic.CarbonMonoxideDetected.CO_LEVELS_ABNORMAL],
    ['doorWindow', ['Closed'], characteristic.ContactSensorState, characteristic.ContactSensorState.CONTACT_DETECTED],
    ['doorWindow', ['Open'], characteristic.ContactSensorState, characteristic.ContactSensorState.CONTACT_NOT_DETECTED],
    ['fire', ['Okay'], characteristic.SmokeDetected, characteristic.SmokeDetected.SMOKE_NOT_DETECTED],
    ['fire', ['Tripped'], characteristic.SmokeDetected, characteristic.SmokeDetected.SMOKE_DETECTED],
    ['flood', ['Okay'], characteristic.LeakDetected, characteristic.LeakDetected.LEAK_NOT_DETECTED],
    ['flood', ['Tripped'], characteristic.LeakDetected, characteristic.LeakDetected.LEAK_DETECTED],
    ['glass', ['Okay'], characteristic.OccupancyDetected, characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED],
    ['glass', ['Tripped'], characteristic.OccupancyDetected, characteristic.OccupancyDetected.OCCUPANCY_DETECTED],
    ['heat', ['Okay'], characteristic.OccupancyDetected, characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED],
    ['heat', ['Tripped'], characteristic.OccupancyDetected, characteristic.OccupancyDetected.OCCUPANCY_DETECTED],
    ['motion', ['No Motion'], characteristic.MotionDetected, false],
    ['motion', ['Motion'], characteristic.MotionDetected, true],
    ['shock', ['Okay'], characteristic.OccupancyDetected, characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED],
    ['shock', ['Tripped'], characteristic.OccupancyDetected, characteristic.OccupancyDetected.OCCUPANCY_DETECTED],
    ['temperature', ['Okay'], characteristic.CurrentTemperature, 0],
    ['temperature', ['Tripped'], characteristic.CurrentTemperature, 100],
  ] as const)('maps %s sensor state %s to its required HomeKit value', (type, sensorStatuses, key, expected) => {
    const harness = createHarness(type, {
      sensorStatuses: [...sensorStatuses],
    });

    harness.handler.updater();

    expect(harness.recordFor(key).updateValue).toHaveBeenCalledWith(expected);
    expect(harness.recordFor(characteristic.StatusActive).updateValue).toHaveBeenCalledWith(true);
  });

  it('maps sensor fault, battery, and tamper status to optional characteristics', () => {
    const harness = createHarness('doorWindow', {
      sensorStatuses: ['ALARM', 'Low Battery', 'Tampered', 'Open'],
    });

    harness.handler.updater();

    expect(harness.recordFor(characteristic.StatusFault).updateValue).toHaveBeenCalledWith(
      characteristic.StatusFault.GENERAL_FAULT,
    );
    expect(harness.recordFor(characteristic.StatusLowBattery).updateValue).toHaveBeenCalledWith(
      characteristic.StatusLowBattery.BATTERY_LEVEL_LOW,
    );
    expect(harness.recordFor(characteristic.StatusTampered).updateValue).toHaveBeenCalledWith(
      characteristic.StatusTampered.TAMPERED,
    );
  });

  it.each([
    ['devStatAlarm', characteristic.StatusFault, characteristic.StatusFault.GENERAL_FAULT],
    ['devStatLowBatt', characteristic.StatusLowBattery, characteristic.StatusLowBattery.BATTERY_LEVEL_LOW],
    ['devStatTamper', characteristic.StatusTampered, characteristic.StatusTampered.TAMPERED],
  ] as const)('uses the %s icon as a health signal', (icon, key, expected) => {
    const harness = createHarness('co', {
      icon,
      sensorStatuses: ['Okay'],
    });

    harness.handler.updater();

    expect(harness.recordFor(key).updateValue).toHaveBeenCalledWith(expected);
  });

  it('returns HAP status errors for offline and unrecognized sensor states', () => {
    const offline = createHarness('co', {
      sensorStatuses: ['Offline'],
    });
    const unrecognized = createHarness('co', {
      sensorStatuses: ['Installing'],
    });

    offline.handler.updater();
    unrecognized.handler.updater();

    const offlineValue = offline.recordFor(characteristic.CarbonMonoxideDetected).updateValue.mock.calls[0]?.[0];
    const unrecognizedValue = unrecognized.recordFor(characteristic.CarbonMonoxideDetected).updateValue.mock.calls[0]?.[0];

    expect(offlineValue).toBeInstanceOf(MockHapStatusError);
    expect(offlineValue).toMatchObject({
      hapStatus: hapStatus.NOT_ALLOWED_IN_CURRENT_STATE,
    });
    expect(offline.recordFor(characteristic.StatusActive).updateValue).toHaveBeenCalledWith(false);
    expect(unrecognizedValue).toMatchObject({
      hapStatus: hapStatus.INVALID_VALUE_IN_REQUEST,
    });
  });

  it.each([
    ['doorWindow', characteristic.ContactSensorState],
    ['fire', characteristic.SmokeDetected],
    ['flood', characteristic.LeakDetected],
    ['glass', characteristic.OccupancyDetected],
    ['heat', characteristic.OccupancyDetected],
    ['motion', characteristic.MotionDetected],
    ['shock', characteristic.OccupancyDetected],
    ['temperature', characteristic.CurrentTemperature],
  ] as const)('returns an invalid-value status for an unimplemented %s sensor action', (type, key) => {
    const harness = createHarness(type, {
      sensorStatuses: ['Installing'],
    });

    harness.handler.updater();

    expect(harness.recordFor(key).updateValue.mock.calls[0]?.[0]).toMatchObject({
      hapStatus: hapStatus.INVALID_VALUE_IN_REQUEST,
    });
  });

  it('returns a missing-resource status when the configured sensor cannot be found', () => {
    const harness = createHarness('co');
    harness.state.data.sensorsStatus = [];

    harness.handler.updater();

    expect(harness.recordFor(characteristic.CarbonMonoxideDetected).updateValue.mock.calls[0]?.[0]).toMatchObject({
      hapStatus: hapStatus.RESOURCE_DOES_NOT_EXIST,
    });
    expect(harness.loggerMethods.error).toHaveBeenCalled();
  });

  it('maps a quiet armed panel to current, target, and health characteristics', () => {
    const harness = createHarness('panel', {
      panelStates: ['Armed Away'],
      panelStatuses: ['All Quiet'],
    });

    harness.handler.updater();

    expect(harness.recordFor(characteristic.SecuritySystemCurrentState).updateValue).toHaveBeenCalledWith(
      characteristic.SecuritySystemCurrentState.AWAY_ARM,
    );
    expect(harness.recordFor(characteristic.SecuritySystemTargetState).updateValue).toHaveBeenCalledWith(
      characteristic.SecuritySystemTargetState.AWAY_ARM,
    );
    expect(harness.recordFor(characteristic.SecuritySystemAlarmType).updateValue).toHaveBeenCalledWith(0);
    expect(harness.recordFor(characteristic.StatusFault).updateValue).toHaveBeenCalledWith(
      characteristic.StatusFault.NO_FAULT,
    );
    expect(harness.recordFor(characteristic.StatusTampered).updateValue).toHaveBeenCalledWith(
      characteristic.StatusTampered.NOT_TAMPERED,
    );
  });

  it('reports an active alarm, fault, and tamper condition on the panel', () => {
    const harness = createHarness('panel', {
      panelStates: ['Disarmed'],
      panelStatuses: ['BURGLARY ALARM', 'Sensor Problem'],
    });

    harness.handler.updater();

    expect(harness.recordFor(characteristic.SecuritySystemCurrentState).updateValue).toHaveBeenCalledWith(
      characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED,
    );
    expect(harness.recordFor(characteristic.SecuritySystemAlarmType).updateValue).toHaveBeenCalledWith(1);
    expect(harness.recordFor(characteristic.StatusFault).updateValue).toHaveBeenCalledWith(
      characteristic.StatusFault.GENERAL_FAULT,
    );
    expect(harness.recordFor(characteristic.StatusTampered).updateValue).toHaveBeenCalledWith(
      characteristic.StatusTampered.TAMPERED,
    );
  });

  it.each([
    [
      'Armed Stay',
      characteristic.SecuritySystemCurrentState.STAY_ARM,
      characteristic.SecuritySystemTargetState.STAY_ARM,
    ],
    [
      'Armed Night',
      characteristic.SecuritySystemCurrentState.NIGHT_ARM,
      characteristic.SecuritySystemTargetState.NIGHT_ARM,
    ],
  ] as const)('maps %s to matching current and target states', (panelState, current, target) => {
    const harness = createHarness('panel', {
      panelStates: [panelState],
    });

    harness.handler.updater();

    expect(harness.recordFor(characteristic.SecuritySystemCurrentState).updateValue).toHaveBeenCalledWith(current);
    expect(harness.recordFor(characteristic.SecuritySystemTargetState).updateValue).toHaveBeenCalledWith(target);
  });

  it.each([
    [null, hapStatus.RESOURCE_BUSY],
    [{
      panelNotes: [],
      panelStates: ['Status Unavailable'],
      panelStatuses: ['All Quiet'],
      rawData: { node: 'Status Unavailable.', unknownPieces: [] },
    }, hapStatus.RESOURCE_BUSY],
    [{
      panelNotes: [],
      panelStates: ['Armed Custom'],
      panelStatuses: ['All Quiet'],
      rawData: { node: 'Armed Custom.', unknownPieces: [] },
    }, hapStatus.SERVICE_COMMUNICATION_FAILURE],
  ] as const)('surfaces unavailable and unimplemented panel states as HAP errors', (panelStatus, expectedStatus) => {
    const harness = createHarness('panel');
    harness.state.data.panelStatus = panelStatus as typeof harness.state.data.panelStatus;

    harness.handler.updater();

    expect(harness.recordFor(characteristic.SecuritySystemCurrentState).updateValue.mock.calls.at(-1)?.[0]).toMatchObject({
      hapStatus: expectedStatus,
    });
    expect(harness.recordFor(characteristic.SecuritySystemTargetState).updateValue.mock.calls.at(-1)?.[0]).toMatchObject({
      hapStatus: expectedStatus,
    });
  });

  it('rejects panel writes until status exists and while status is unavailable', async () => {
    const missing = createHarness('panel');
    missing.state.data.panelStatus = null;
    missing.handler.updater();

    await expect(missing.recordFor(characteristic.SecuritySystemTargetState).setter?.(
      characteristic.SecuritySystemTargetState.AWAY_ARM,
    )).rejects.toMatchObject({ hapStatus: hapStatus.RESOURCE_BUSY });

    const unavailable = createHarness('panel', {
      panelStates: ['Status Unavailable'],
    });
    unavailable.handler.updater();

    await expect(unavailable.recordFor(characteristic.SecuritySystemTargetState).setter?.(
      characteristic.SecuritySystemTargetState.AWAY_ARM,
    )).rejects.toMatchObject({ hapStatus: hapStatus.RESOURCE_BUSY });
  });

  it.each([
    ['Disarmed', characteristic.SecuritySystemTargetState.STAY_ARM, 'stay'],
    ['Disarmed', characteristic.SecuritySystemTargetState.AWAY_ARM, 'away'],
    ['Disarmed', characteristic.SecuritySystemTargetState.NIGHT_ARM, 'night'],
    ['Armed Away', characteristic.SecuritySystemTargetState.DISARM, 'off'],
  ] as const)('sends a %s panel transition to the portal as %s', async (initialState, target, portalArm) => {
    const harness = createHarness('panel', {
      panelStates: [initialState],
    });
    harness.handler.updater();

    const setter = harness.recordFor(characteristic.SecuritySystemTargetState).setter;

    expect(setter).toBeTypeOf('function');
    await setter?.(target);

    expect(harness.instanceMethods.setPanelStatus).toHaveBeenCalledWith(
      initialState === 'Disarmed' ? 'off' : 'away',
      portalArm,
      false,
    );
  });

  it('does not send a request when HomeKit selects the current panel state', async () => {
    const harness = createHarness('panel', {
      panelStates: ['Disarmed'],
    });
    harness.handler.updater();

    await harness.recordFor(characteristic.SecuritySystemTargetState).setter?.(
      characteristic.SecuritySystemTargetState.DISARM,
    );

    expect(harness.instanceMethods.setPanelStatus).not.toHaveBeenCalled();
  });

  it('surfaces invalid targets and unsuccessful panel requests as HAP errors', async () => {
    const invalidTarget = createHarness('panel');
    invalidTarget.handler.updater();
    const failedRequest = createHarness('panel');
    failedRequest.instanceMethods.setPanelStatus.mockResolvedValue({
      success: false,
    });
    failedRequest.handler.updater();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(invalidTarget.recordFor(characteristic.SecuritySystemTargetState).setter?.(99)).rejects.toMatchObject({
      hapStatus: hapStatus.INVALID_VALUE_IN_REQUEST,
    });
    await expect(failedRequest.recordFor(characteristic.SecuritySystemTargetState).setter?.(
      characteristic.SecuritySystemTargetState.AWAY_ARM,
    )).rejects.toMatchObject({
      hapStatus: hapStatus.OPERATION_TIMED_OUT,
    });

    consoleError.mockRestore();
  });

  it('uses the panel switch to report and clear a ringing alarm', async () => {
    const harness = createHarness('panelSwitch', {
      panelStates: ['Armed Away'],
      panelStatuses: ['BURGLARY ALARM'],
    });
    harness.handler.updater();

    expect(harness.recordFor(characteristic.On).updateValue).toHaveBeenCalledWith(true);

    await harness.recordFor(characteristic.On).setter?.(false);

    expect(harness.instanceMethods.setPanelStatus).toHaveBeenCalledWith('away', 'off', true);
    await expect(harness.recordFor(characteristic.On).setter?.(true)).rejects.toMatchObject({
      hapStatus: hapStatus.SUCCESS,
    });
  });

  it('reports unavailable panel-switch state and failed alarm-clearing requests', async () => {
    const unavailable = createHarness('panelSwitch');
    unavailable.state.data.panelStatus = null;
    unavailable.handler.updater();

    expect(unavailable.recordFor(characteristic.On).updateValue.mock.calls.at(-1)?.[0]).toMatchObject({
      hapStatus: hapStatus.RESOURCE_BUSY,
    });
    await expect(unavailable.recordFor(characteristic.On).setter?.(false)).rejects.toMatchObject({
      hapStatus: hapStatus.RESOURCE_BUSY,
    });

    const failed = createHarness('panelSwitch', {
      panelStates: ['Armed Away'],
      panelStatuses: ['BURGLARY ALARM'],
    });
    failed.instanceMethods.setPanelStatus.mockResolvedValue({ success: false });
    failed.handler.updater();

    await expect(failed.recordFor(characteristic.On).setter?.(false)).rejects.toMatchObject({
      hapStatus: hapStatus.OPERATION_TIMED_OUT,
    });
  });

  it('clears the panel-switch busy state after a portal error', async () => {
    const harness = createHarness('panelSwitch', {
      panelStates: ['Armed Away'],
      panelStatuses: ['BURGLARY ALARM'],
    });
    harness.instanceMethods.setPanelStatus.mockRejectedValueOnce(new Error('Portal unavailable'));
    harness.handler.updater();

    const setter = harness.recordFor(characteristic.On).setter;

    await expect(setter?.(false)).rejects.toThrow('Portal unavailable');
    await expect(setter?.(false)).resolves.toBeUndefined();

    expect(harness.instanceMethods.setPanelStatus).toHaveBeenCalledTimes(2);
  });

  it('leaves the gateway service-free without logging an update error', () => {
    const harness = createHarness('gateway');

    harness.handler.updater();

    expect(harness.loggerMethods.error).not.toHaveBeenCalled();
  });
});
