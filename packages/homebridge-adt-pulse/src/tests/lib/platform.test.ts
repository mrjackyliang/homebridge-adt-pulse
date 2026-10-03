import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ADTPulsePlatform } from '../../lib/platform.js';

import type {
  API,
  Logger,
  PlatformConfig,
} from 'homebridge';
import type {
  Lib_Platform_ADTPulsePlatform_Accessory,
  Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Accessory,
} from '../../types/lib/platform.d.ts';

const apiConstructor = vi.hoisted(() => vi.fn());
const accessoryMocks = vi.hoisted(() => ({
  constructor: vi.fn(),
  updater: vi.fn(),
}));
const platformUtilityMocks = vi.hoisted(() => ({
  isMaintenancePeriod: vi.fn(() => false),
  sleep: vi.fn().mockResolvedValue(undefined),
  stackTracer: vi.fn(),
}));
const unknownSensorDetector = vi.hoisted(() => vi.fn().mockResolvedValue(false));

vi.mock('../../lib/api.js', () => ({
  ADTPulseAPI: apiConstructor,
}));

vi.mock('../../lib/accessory.js', () => ({
  ADTPulseAccessory: accessoryMocks.constructor,
}));

vi.mock('../../lib/detect.js', () => ({
  detectPlatformUnknownSensorsAction: unknownSensorDetector,
}));

vi.mock('../../lib/utility.js', async (importOriginal) => ({
  ...await importOriginal<typeof import('../../lib/utility.js')>(),
  isMaintenancePeriod: platformUtilityMocks.isMaintenancePeriod,
  sleep: platformUtilityMocks.sleep,
  stackTracer: platformUtilityMocks.stackTracer,
}));

type Tests_Lib_Platform_InvalidConfig = PlatformConfig;

type Tests_Lib_Platform_Statuses = Array<'Closed' | 'Open'>;

function createLoggerMock() {
  const methods = {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    log: vi.fn(),
    success: vi.fn(),
    warn: vi.fn(),
  };

  return {
    logger: methods as unknown as Logger,
    methods,
  };
}

function createApiMock() {
  let didFinishLaunching: (() => Promise<void>) | undefined = undefined;

  const methods = {
    registerPlatformAccessories: vi.fn(),
    unregisterPlatformAccessories: vi.fn(),
    updatePlatformAccessories: vi.fn(),
    uuidGenerate: vi.fn((value: string) => `uuid-${value}`),
  };
  const api = {
    hap: {
      Characteristic: {},
      Service: {},
      uuid: {
        generate: methods.uuidGenerate,
      },
    },
    on: vi.fn((event: string, handler: () => Promise<void>) => {
      if (event === 'didFinishLaunching') {
        didFinishLaunching = handler;
      }

      return api;
    }),
    platformAccessory: class PlatformAccessoryMock {
      public context: Record<string, unknown> = {};
      public displayName: string;

      public constructor(displayName: string) {
        this.displayName = displayName;
      }
    },
    registerPlatformAccessories: methods.registerPlatformAccessories,
    serverVersion: '2.4.0',
    unregisterPlatformAccessories: methods.unregisterPlatformAccessories,
    updatePlatformAccessories: methods.updatePlatformAccessories,
  };

  return {
    api: api as unknown as API,
    getDidFinishLaunching: () => didFinishLaunching,
    methods,
  };
}

type Tests_Lib_Platform_CreatePausedConfig_Returns = PlatformConfig;

function createPausedConfig(): Tests_Lib_Platform_CreatePausedConfig_Returns {
  return {
    fingerprint: 'fixture-fingerprint',
    mode: 'paused',
    name: 'ADT Pulse',
    options: [],
    password: 'fixture-password',
    platform: 'ADTPulse',
    sensors: [],
    speed: 1,
    subdomain: 'portal',
    username: 'fixture-user',
  };
}

type Tests_Lib_Platform_CreateNormalConfig_Overrides = Partial<PlatformConfig>;

type Tests_Lib_Platform_CreateNormalConfig_Returns = PlatformConfig;

function createNormalConfig(overrides: Tests_Lib_Platform_CreateNormalConfig_Overrides = {}): Tests_Lib_Platform_CreateNormalConfig_Returns {
  return {
    ...createPausedConfig(),
    mode: 'normal',
    ...overrides,
  };
}

function createDevice() {
  return {
    category: 'SENSOR',
    firmware: null,
    hardware: null,
    id: 'adt-device-2',
    manufacturer: 'ADT',
    model: 'Door/Window Sensor',
    name: 'Front Door',
    originalName: 'Front Door',
    serial: null,
    software: '3.5.0',
    type: 'doorWindow',
    uuid: 'fixture-uuid',
    zone: 2,
  } as const;
}

type Tests_Lib_Platform_CreatePortalClient_Overrides = Record<string, unknown>;

function createPortalClient(overrides: Tests_Lib_Platform_CreatePortalClient_Overrides = {}) {
  return {
    getGatewayInformation: vi.fn().mockResolvedValue({
      info: {
        manufacturer: 'iControl',
        model: 'ADT Pulse Gateway',
        serialNumber: 'gateway-serial',
        status: 'Online',
        versions: {
          firmware: '5.2.1',
          hardware: '3',
        },
      },
      success: true,
    }),
    getOrbSecurityButtons: vi.fn().mockResolvedValue({ info: [], success: true }),
    getPanelInformation: vi.fn().mockResolvedValue({
      info: {
        manufacturer: 'Honeywell',
        model: 'Vista 20P',
        status: 'Online',
      },
      success: true,
    }),
    getPanelStatus: vi.fn().mockResolvedValue({
      info: {
        panelNotes: [],
        panelStates: ['Disarmed'],
        panelStatuses: ['All Quiet'],
        rawData: {
          node: 'Disarmed. All Quiet.',
          unknownPieces: [],
        },
      },
      success: true,
    }),
    getSensorsInformation: vi.fn().mockResolvedValue({ info: { sensors: [] }, success: true }),
    getSensorsStatus: vi.fn().mockResolvedValue({ info: { sensors: [] }, success: true }),
    isAuthenticated: vi.fn(() => true),
    login: vi.fn().mockResolvedValue({
      info: {
        backupSatCode: 'fixture-sat',
        networkId: '1234567890',
        portalVersion: '30.0.0-61',
      },
      success: true,
    }),
    performKeepAlive: vi.fn().mockResolvedValue({ info: null, success: true }),
    performSyncCheck: vi.fn().mockResolvedValue({ info: { syncCode: '1-0-0' }, success: true }),
    resetSession: vi.fn(),
    ...overrides,
  };
}

type Tests_Lib_Platform_LaunchPlatform_Config = PlatformConfig;

type Tests_Lib_Platform_LaunchPlatform_PortalClient = Record<string, unknown>;

async function launchPlatform(config: Tests_Lib_Platform_LaunchPlatform_Config, portalClient: Tests_Lib_Platform_LaunchPlatform_PortalClient) {
  const loggerMock = createLoggerMock();
  const apiMock = createApiMock();
  const intervalCallbacks: Array<() => Promise<void>> = [];
  const setIntervalSpy = vi.spyOn(globalThis, 'setInterval').mockImplementation((callback) => {
    intervalCallbacks.push(callback as () => Promise<void>);

    return intervalCallbacks.length as unknown as NodeJS.Timeout;
  });
  apiConstructor.mockImplementation(function PortalClientMock() {
    return portalClient;
  });
  const platform = new ADTPulsePlatform(loggerMock.logger, config, apiMock.api);
  const didFinishLaunching = apiMock.getDidFinishLaunching();

  if (didFinishLaunching === undefined) {
    throw new Error('Expected the didFinishLaunching handler to be registered.');
  }

  await didFinishLaunching();

  return {
    apiMock,
    intervalCallbacks,
    loggerMock,
    platform,
    setIntervalSpy,
  };
}

describe('ADTPulsePlatform', () => {
  beforeEach(() => {
    apiConstructor.mockReset();
    accessoryMocks.constructor.mockReset();
    accessoryMocks.updater.mockReset();
    accessoryMocks.constructor.mockImplementation(function AccessoryMock() {
      return {
        updater: accessoryMocks.updater,
      };
    });
    platformUtilityMocks.isMaintenancePeriod.mockReset();
    platformUtilityMocks.isMaintenancePeriod.mockReturnValue(false);
    platformUtilityMocks.sleep.mockReset();
    platformUtilityMocks.sleep.mockResolvedValue(undefined);
    platformUtilityMocks.stackTracer.mockReset();
    unknownSensorDetector.mockReset();
    unknownSensorDetector.mockResolvedValue(false);
  });

  it('rejects invalid configuration before subscribing to launch', () => {
    const loggerMock = createLoggerMock();
    const apiMock = createApiMock();
    const invalidConfig: Tests_Lib_Platform_InvalidConfig = {
      platform: 'ADTPulse',
    };
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    new ADTPulsePlatform(loggerMock.logger, invalidConfig, apiMock.api);

    expect(loggerMock.methods.error).toHaveBeenCalledWith(
      'Plugin is unable to initialize due to an invalid platform configuration.',
    );
    expect(apiMock.getDidFinishLaunching()).toBeUndefined();

    consoleError.mockRestore();
  });

  it('honors paused mode without constructing the portal client', async () => {
    const loggerMock = createLoggerMock();
    const apiMock = createApiMock();

    new ADTPulsePlatform(loggerMock.logger, createPausedConfig(), apiMock.api);

    const didFinishLaunching = apiMock.getDidFinishLaunching();

    expect(didFinishLaunching).toBeTypeOf('function');

    if (didFinishLaunching === undefined) {
      throw new Error('Expected the didFinishLaunching handler to be registered.');
    }

    await didFinishLaunching();

    expect(loggerMock.methods.warn).toHaveBeenCalledWith(
      'Plugin is now paused and all related accessories will no longer respond.',
    );
    expect(apiConstructor).not.toHaveBeenCalled();
  });

  it('restores and unregisters a cached accessory', () => {
    const loggerMock = createLoggerMock();
    const apiMock = createApiMock();
    const platform = new ADTPulsePlatform(
      loggerMock.logger,
      createPausedConfig(),
      apiMock.api,
    );
    const accessory = {
      context: createDevice(),
    } as unknown as Lib_Platform_ADTPulsePlatform_Accessory;

    platform.configureAccessory(accessory);
    platform.removeAccessory(accessory, 'fixture cleanup');

    expect(apiMock.methods.unregisterPlatformAccessories).toHaveBeenCalledOnce();
    expect(apiMock.methods.unregisterPlatformAccessories).toHaveBeenCalledWith(
      'homebridge-adt-pulse',
      'ADTPulse',
      [accessory],
    );
  });

  it('constructs the portal client and starts synchronization in normal mode', async () => {
    const loggerMock = createLoggerMock();
    const apiMock = createApiMock();
    const config = createNormalConfig();
    const portalClient = {
      isAuthenticated: vi.fn(() => true),
    };
    apiConstructor.mockImplementation(function PortalClientMock() {
      return portalClient;
    });
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval').mockImplementation(
      () => 1 as unknown as NodeJS.Timeout,
    );
    const platform = new ADTPulsePlatform(loggerMock.logger, config, apiMock.api);
    const didFinishLaunching = apiMock.getDidFinishLaunching();

    if (didFinishLaunching === undefined) {
      throw new Error('Expected the didFinishLaunching handler to be registered.');
    }

    await didFinishLaunching();

    expect(apiConstructor).toHaveBeenCalledWith(config, {
      debug: expect.any(Boolean),
      logger: loggerMock.logger,
    });
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    expect(platform).toBeInstanceOf(ADTPulsePlatform);

    setIntervalSpy.mockRestore();
  });

  it('registers a new accessory and immediately updates its characteristics', async () => {
    const loggerMock = createLoggerMock();
    const apiMock = createApiMock();
    apiConstructor.mockImplementation(function PortalClientMock() {
      return {
        isAuthenticated: vi.fn(() => true),
      };
    });
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval').mockImplementation(
      () => 1 as unknown as NodeJS.Timeout,
    );
    const platform = new ADTPulsePlatform(
      loggerMock.logger,
      createNormalConfig(),
      apiMock.api,
    );
    const didFinishLaunching = apiMock.getDidFinishLaunching();

    if (didFinishLaunching === undefined) {
      throw new Error('Expected the didFinishLaunching handler to be registered.');
    }

    await didFinishLaunching();
    platform.addAccessory(createDevice());

    expect(accessoryMocks.constructor).toHaveBeenCalledOnce();
    expect(accessoryMocks.updater).toHaveBeenCalledOnce();
    expect(apiMock.methods.registerPlatformAccessories).toHaveBeenCalledWith(
      'homebridge-adt-pulse',
      'ADTPulse',
      [expect.objectContaining({
        context: createDevice(),
        displayName: 'Front Door',
      })],
    );

    setIntervalSpy.mockRestore();
  });

  it('updates a cached accessory context, display name, and handler', async () => {
    const loggerMock = createLoggerMock();
    const apiMock = createApiMock();
    apiConstructor.mockImplementation(function PortalClientMock() {
      return {
        isAuthenticated: vi.fn(() => true),
      };
    });
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval').mockImplementation(
      () => 1 as unknown as NodeJS.Timeout,
    );
    const platform = new ADTPulsePlatform(
      loggerMock.logger,
      createNormalConfig(),
      apiMock.api,
    );
    const cachedAccessory = {
      context: createDevice(),
      displayName: 'Old Front Door',
    } as unknown as Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Accessory;
    platform.configureAccessory(cachedAccessory);
    const didFinishLaunching = apiMock.getDidFinishLaunching();

    if (didFinishLaunching === undefined) {
      throw new Error('Expected the didFinishLaunching handler to be registered.');
    }

    await didFinishLaunching();
    const updatedDevice = {
      ...createDevice(),
      name: 'Entry Door',
    };
    platform.updateAccessory(updatedDevice);

    expect(cachedAccessory.context).toEqual(updatedDevice);
    expect(cachedAccessory.displayName).toBe('Entry Door');
    expect(accessoryMocks.updater).toHaveBeenCalledOnce();
    expect(apiMock.methods.updatePlatformAccessories).toHaveBeenCalledWith([cachedAccessory]);

    setIntervalSpy.mockRestore();
  });

  it('rejects duplicate additions before constructing an accessory handler', () => {
    const loggerMock = createLoggerMock();
    const apiMock = createApiMock();
    const platform = new ADTPulsePlatform(
      loggerMock.logger,
      createPausedConfig(),
      apiMock.api,
    );
    const device = createDevice();
    platform.configureAccessory({
      context: device,
    } as unknown as Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Accessory);

    platform.addAccessory(device);

    expect(loggerMock.methods.error).toHaveBeenCalledWith(
      expect.stringContaining('accessory that already exists'),
    );
    expect(accessoryMocks.constructor).not.toHaveBeenCalled();
    expect(apiMock.methods.registerPlatformAccessories).not.toHaveBeenCalled();
  });

  it('reports add and update attempts made before the portal client is available', () => {
    const loggerMock = createLoggerMock();
    const apiMock = createApiMock();
    const platform = new ADTPulsePlatform(
      loggerMock.logger,
      createPausedConfig(),
      apiMock.api,
    );
    const device = createDevice();

    platform.addAccessory(device);
    platform.updateAccessory(device);

    expect(loggerMock.methods.error).toHaveBeenCalledWith(
      expect.stringContaining('API instance is not available'),
    );
    expect(loggerMock.methods.warn).toHaveBeenCalledWith(
      expect.stringContaining('accessory that does not exist'),
    );
  });

  it('logs in and refreshes accessories when the portal sync code changes', async () => {
    const loggerMock = createLoggerMock();
    const apiMock = createApiMock();
    let authenticated = false;
    const portalClient = {
      getGatewayInformation: vi.fn().mockResolvedValue({
        info: {
          manufacturer: 'iControl',
          model: 'ADT Pulse Gateway',
          serialNumber: 'gateway-serial',
          status: 'Online',
          versions: {
            firmware: '5.2.1',
            hardware: '3',
          },
        },
        success: true,
      }),
      getOrbSecurityButtons: vi.fn().mockResolvedValue({
        info: [],
        success: true,
      }),
      getPanelInformation: vi.fn().mockResolvedValue({
        info: {
          manufacturer: 'Honeywell',
          model: 'Vista 20P',
          status: 'Online',
        },
        success: true,
      }),
      getPanelStatus: vi.fn().mockResolvedValue({
        info: {
          panelNotes: [],
          panelStates: ['Disarmed'],
          panelStatuses: ['All Quiet'],
          rawData: {
            node: 'Disarmed. All Quiet.',
            unknownPieces: [],
          },
        },
        success: true,
      }),
      getSensorsInformation: vi.fn().mockResolvedValue({
        info: {
          sensors: [],
        },
        success: true,
      }),
      getSensorsStatus: vi.fn().mockResolvedValue({
        info: {
          sensors: [],
        },
        success: true,
      }),
      isAuthenticated: vi.fn(() => authenticated),
      login: vi.fn(async () => {
        authenticated = true;

        return {
          info: {
            backupSatCode: 'fixture-sat',
            networkId: '1234567890',
            portalVersion: '30.0.0-61',
          },
          success: true,
        };
      }),
      performSyncCheck: vi.fn().mockResolvedValue({
        info: {
          syncCode: '2-0-0',
        },
        success: true,
      }),
      resetSession: vi.fn(),
    };
    apiConstructor.mockImplementation(function PortalClientMock() {
      return portalClient;
    });
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval').mockImplementation(
      () => 1 as unknown as NodeJS.Timeout,
    );
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1_000);
    const platform = new ADTPulsePlatform(
      loggerMock.logger,
      createNormalConfig(),
      apiMock.api,
    );
    const didFinishLaunching = apiMock.getDidFinishLaunching();

    if (didFinishLaunching === undefined) {
      throw new Error('Expected the didFinishLaunching handler to be registered.');
    }

    await didFinishLaunching();
    const synchronize = setIntervalSpy.mock.calls[0]?.[0] as (() => Promise<void>) | undefined;

    if (synchronize === undefined) {
      throw new Error('Expected the synchronization callback to be scheduled.');
    }

    await synchronize();

    expect(portalClient.login).toHaveBeenCalledOnce();
    expect(portalClient.performSyncCheck).not.toHaveBeenCalled();

    nowSpy.mockReturnValue(5_000);
    await synchronize();

    await vi.waitFor(() => {
      expect(apiMock.methods.registerPlatformAccessories).toHaveBeenCalledTimes(3);
    });
    expect(portalClient.getGatewayInformation).toHaveBeenCalledOnce();
    expect(portalClient.getPanelInformation).toHaveBeenCalledOnce();
    expect(portalClient.getPanelStatus).toHaveBeenCalledOnce();
    expect(portalClient.getSensorsInformation).toHaveBeenCalledOnce();
    expect(portalClient.getSensorsStatus).toHaveBeenCalledOnce();
    expect(portalClient.getOrbSecurityButtons).toHaveBeenCalledOnce();
    expect(loggerMock.methods.error.mock.calls).toEqual([]);
    expect(apiMock.methods.uuidGenerate).toHaveBeenCalledTimes(3);
    expect(accessoryMocks.updater).toHaveBeenCalledTimes(3);
    expect(platform).toBeInstanceOf(ADTPulsePlatform);

    nowSpy.mockRestore();
    setIntervalSpy.mockRestore();
  });

  it('paces keep-alive and unchanged sync-check requests for an authenticated session', async () => {
    const loggerMock = createLoggerMock();
    const apiMock = createApiMock();
    const portalClient = {
      isAuthenticated: vi.fn(() => true),
      performKeepAlive: vi.fn().mockResolvedValue({
        info: null,
        success: true,
      }),
      performSyncCheck: vi.fn().mockResolvedValue({
        info: {
          syncCode: '1-0-0',
        },
        success: true,
      }),
      resetSession: vi.fn(),
    };
    apiConstructor.mockImplementation(function PortalClientMock() {
      return portalClient;
    });
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval').mockImplementation(
      () => 1 as unknown as NodeJS.Timeout,
    );
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(600_000);
    new ADTPulsePlatform(loggerMock.logger, createNormalConfig(), apiMock.api);
    const didFinishLaunching = apiMock.getDidFinishLaunching();

    if (didFinishLaunching === undefined) {
      throw new Error('Expected the didFinishLaunching handler to be registered.');
    }

    await didFinishLaunching();
    const synchronize = setIntervalSpy.mock.calls[0]?.[0] as (() => Promise<void>) | undefined;

    if (synchronize === undefined) {
      throw new Error('Expected the synchronization callback to be scheduled.');
    }

    await synchronize();

    await vi.waitFor(() => {
      expect(portalClient.performKeepAlive).toHaveBeenCalledOnce();
      expect(portalClient.performSyncCheck).toHaveBeenCalledOnce();
    });
    expect(loggerMock.methods.debug).toHaveBeenCalledWith(
      expect.stringContaining('data is up to date'),
    );

    nowSpy.mockRestore();
    setIntervalSpy.mockRestore();
  });

  it('logs failed authentication attempts without polling portal state', async () => {
    const loggerMock = createLoggerMock();
    const apiMock = createApiMock();
    const portalClient = {
      isAuthenticated: vi.fn(() => false),
      login: vi.fn().mockResolvedValue({
        info: {
          message: 'Invalid credentials',
        },
        success: false,
      }),
      resetSession: vi.fn(),
    };
    apiConstructor.mockImplementation(function PortalClientMock() {
      return portalClient;
    });
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval').mockImplementation(
      () => 1 as unknown as NodeJS.Timeout,
    );
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    new ADTPulsePlatform(loggerMock.logger, createNormalConfig(), apiMock.api);
    const didFinishLaunching = apiMock.getDidFinishLaunching();

    if (didFinishLaunching === undefined) {
      throw new Error('Expected the didFinishLaunching handler to be registered.');
    }

    await didFinishLaunching();
    const synchronize = setIntervalSpy.mock.calls[0]?.[0] as (() => Promise<void>) | undefined;

    if (synchronize === undefined) {
      throw new Error('Expected the synchronization callback to be scheduled.');
    }

    await synchronize();

    expect(loggerMock.methods.error).toHaveBeenCalledWith(
      'Login attempt has failed. Trying 2 more times ...',
    );
    expect(portalClient.isAuthenticated).toHaveBeenCalledTimes(2);

    consoleError.mockRestore();
    setIntervalSpy.mockRestore();
  });

  it('runs the reset countdown and removes every cached accessory', async () => {
    const loggerMock = createLoggerMock();
    const apiMock = createApiMock();
    const config = {
      ...createPausedConfig(),
      mode: 'reset',
    };
    const platform = new ADTPulsePlatform(loggerMock.logger, config, apiMock.api);
    const firstAccessory = {
      context: createDevice(),
    } as unknown as Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Accessory;
    const secondAccessory = {
      context: {
        ...createDevice(),
        id: 'adt-device-3',
        name: 'Back Door',
        uuid: 'fixture-uuid-2',
      },
    } as unknown as Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Accessory;
    platform.configureAccessory(firstAccessory);
    platform.configureAccessory(secondAccessory);
    const didFinishLaunching = apiMock.getDidFinishLaunching();

    if (didFinishLaunching === undefined) {
      throw new Error('Expected the didFinishLaunching handler to be registered.');
    }

    await didFinishLaunching();

    expect(platformUtilityMocks.sleep).toHaveBeenCalledTimes(4);
    expect(loggerMock.methods.warn).toHaveBeenCalledWith(expect.stringContaining('FIRST WARNING'));
    expect(loggerMock.methods.warn).toHaveBeenCalledWith(expect.stringContaining('SECOND WARNING'));
    expect(loggerMock.methods.warn).toHaveBeenCalledWith(expect.stringContaining('FINAL WARNING'));
    expect(apiMock.methods.unregisterPlatformAccessories).toHaveBeenCalledTimes(2);
    expect(apiConstructor).not.toHaveBeenCalled();
  });

  it('applies reduced speed and advanced options during launch', async () => {
    const portalClient = createPortalClient();
    const launched = await launchPlatform(createNormalConfig({
      options: ['disableAlarmRingingSwitch'],
      speed: 0.5,
    }), portalClient);

    expect(launched.setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 2000);
    expect(launched.loggerMock.methods.warn).toHaveBeenCalledWith(
      expect.stringContaining('0.5x operational speed'),
    );
    expect(platformUtilityMocks.stackTracer).toHaveBeenCalledWith(
      'config-content',
      ['disableAlarmRingingSwitch'],
    );

    launched.setIntervalSpy.mockRestore();
  });

  it('reports an update for a cached accessory before launch has created the API client', () => {
    const loggerMock = createLoggerMock();
    const apiMock = createApiMock();
    const platform = new ADTPulsePlatform(loggerMock.logger, createPausedConfig(), apiMock.api);
    platform.configureAccessory({
      context: createDevice(),
    } as unknown as Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Accessory);

    platform.updateAccessory(createDevice());

    expect(loggerMock.methods.error).toHaveBeenCalledWith(
      expect.stringContaining('API instance is not available'),
    );
  });

  it('resets a stale authenticated session and recovers from an unexpected scheduler error', async () => {
    let authenticated = false;
    const portalClient = createPortalClient({
      isAuthenticated: vi.fn(() => authenticated),
      login: vi.fn(async () => {
        authenticated = true;

        return { info: {}, success: true };
      }),
    });
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1_000);
    const launched = await launchPlatform(createNormalConfig(), portalClient);
    const synchronize = launched.intervalCallbacks[0];

    await synchronize!();
    nowSpy.mockReturnValue(20_000_000);
    await synchronize!();

    expect(portalClient.resetSession).toHaveBeenCalledOnce();

    vi.mocked(portalClient.isAuthenticated).mockImplementationOnce(() => {
      throw new Error('authentication state unavailable');
    });
    nowSpy.mockReturnValue(20_000_001);
    await synchronize!();

    expect(launched.loggerMock.methods.error).toHaveBeenCalledWith(
      'synchronize() has unexpectedly thrown an error, will continue to sync.',
    );
    expect(platformUtilityMocks.stackTracer).toHaveBeenCalledWith(
      'serialize-error',
      expect.objectContaining({ message: 'authentication state unavailable' }),
    );

    nowSpy.mockRestore();
    launched.setIntervalSpy.mockRestore();
  });

  it('suppresses overlapping synchronization and suspends after the login retry limit', async () => {
    let resolveFirstLogin: ((value: { info: object; success: false }) => void) | undefined;
    const firstLogin = new Promise<{ info: object; success: false }>((resolve) => {
      resolveFirstLogin = resolve;
    });
    const login = vi.fn()
      .mockReturnValueOnce(firstLogin)
      .mockResolvedValue({ info: { message: 'Invalid credentials' }, success: false });
    const portalClient = createPortalClient({
      isAuthenticated: vi.fn(() => false),
      login,
    });
    platformUtilityMocks.isMaintenancePeriod.mockReturnValue(true);
    const launched = await launchPlatform(createNormalConfig(), portalClient);
    const synchronize = launched.intervalCallbacks[0];

    const firstRun = synchronize!();
    await vi.waitFor(() => expect(login).toHaveBeenCalledOnce());
    await synchronize!();
    expect(login).toHaveBeenCalledOnce();
    resolveFirstLogin?.({ info: { message: 'Invalid credentials' }, success: false });
    await firstRun;
    await synchronize!();
    await synchronize!();

    expect(login).toHaveBeenCalledTimes(3);
    expect(platformUtilityMocks.sleep).toHaveBeenCalledWith(1_800_000);
    expect(platformUtilityMocks.isMaintenancePeriod).toHaveBeenCalledOnce();
    expect(launched.loggerMock.methods.warn).toHaveBeenCalledWith(
      expect.stringContaining('maintenance period'),
    );

    launched.setIntervalSpy.mockRestore();
  });

  it('classifies keep-alive failures and continues after a thrown request', async () => {
    const performKeepAlive = vi.fn()
      .mockResolvedValueOnce({ info: { error: { code: 'ECONNABORTED' } }, success: false })
      .mockResolvedValueOnce({ info: { error: { code: 'EHOSTUNREACH' } }, success: false })
      .mockResolvedValueOnce({ info: { message: 'portal failure' }, success: false })
      .mockRejectedValueOnce(new Error('keep alive exploded'));
    const portalClient = createPortalClient({ performKeepAlive });
    let now = 600_000;
    const nowSpy = vi.spyOn(Date, 'now').mockImplementation(() => now);
    const launched = await launchPlatform(createNormalConfig(), portalClient);
    const synchronize = launched.intervalCallbacks[0];

    for (let attempt = 1; attempt <= 4; attempt += 1) {
      await synchronize!();
      await vi.waitFor(() => expect(performKeepAlive).toHaveBeenCalledTimes(attempt));
      await vi.waitFor(() => expect(launched.loggerMock.methods.debug.mock.calls.length + launched.loggerMock.methods.error.mock.calls.length).toBeGreaterThanOrEqual(attempt));
      now += 600_000;
    }

    expect(launched.loggerMock.methods.debug).toHaveBeenCalledWith(expect.stringContaining('connection timed out'));
    expect(launched.loggerMock.methods.debug).toHaveBeenCalledWith(expect.stringContaining('EHOSTUNREACH'));
    expect(launched.loggerMock.methods.error).toHaveBeenCalledWith('Keeping alive attempt has failed. Trying again later.');
    expect(launched.loggerMock.methods.error).toHaveBeenCalledWith(
      'synchronizeKeepAlive() has unexpectedly thrown an error, will continue to keep alive.',
    );

    nowSpy.mockRestore();
    launched.setIntervalSpy.mockRestore();
  });

  it('classifies sync-check failures and continues after a thrown request', async () => {
    const performSyncCheck = vi.fn()
      .mockResolvedValueOnce({ info: { error: { code: 'ECONNABORTED' } }, success: false })
      .mockResolvedValueOnce({ info: { error: { code: 'ECONNRESET' } }, success: false })
      .mockResolvedValueOnce({ info: { error: { code: 'EHOSTUNREACH' } }, success: false })
      .mockResolvedValueOnce({ info: { message: 'portal failure' }, success: false })
      .mockRejectedValueOnce(new Error('sync check exploded'));
    const portalClient = createPortalClient({ performSyncCheck });
    let now = 4_000;
    const nowSpy = vi.spyOn(Date, 'now').mockImplementation(() => now);
    const launched = await launchPlatform(createNormalConfig(), portalClient);
    const synchronize = launched.intervalCallbacks[0];

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      await synchronize!();
      await vi.waitFor(() => expect(performSyncCheck).toHaveBeenCalledTimes(attempt));
      await Promise.resolve();
      now += 4_000;
    }

    expect(launched.loggerMock.methods.debug).toHaveBeenCalledWith(expect.stringContaining('connection timed out'));
    expect(launched.loggerMock.methods.debug).toHaveBeenCalledWith(expect.stringContaining('connection was reset'));
    expect(launched.loggerMock.methods.debug).toHaveBeenCalledWith(expect.stringContaining('EHOSTUNREACH'));
    expect(launched.loggerMock.methods.error).toHaveBeenCalledWith('Sync checking attempt has failed. Trying again later.');
    expect(launched.loggerMock.methods.error).toHaveBeenCalledWith(
      'synchronizeSyncCheck() has unexpectedly thrown an error, will continue to sync check.',
    );

    nowSpy.mockRestore();
    launched.setIntervalSpy.mockRestore();
  });

  it('logs portal changes, reconciles devices, and deduplicates unknown sensor reports', async () => {
    const sensorInformation = (status: 'Offline' | 'Online', includeSecond = false) => [{
      deviceId: 2,
      deviceType: 'Door/Window Sensor',
      name: 'Front Door',
      status,
      zone: 2,
    }, ...includeSecond ? [{
      deviceId: 3,
      deviceType: 'Motion Sensor',
      name: 'Hall Motion',
      status: 'Online' as const,
      zone: 3,
    }] : []];
    const sensorStatus = (statuses: Tests_Lib_Platform_Statuses, includeSecond = false) => [{
      icon: statuses.includes('Open') ? 'devStatOpen' : 'devStatOK',
      name: 'Front Door',
      statuses,
      zone: 2,
    }, ...includeSecond ? [{
      icon: 'devStatOK',
      name: 'Hall Motion',
      statuses: ['No Motion'],
      zone: 3,
    }] : []];
    const gateway = vi.fn()
      .mockResolvedValueOnce({
        info: {
          manufacturer: 'iControl', model: 'Gateway', serialNumber: 'serial', status: 'Online', versions: { firmware: '1', hardware: '1' },
        },
        success: true,
      })
      .mockResolvedValueOnce({
        info: {
          manufacturer: 'iControl', model: 'Gateway', serialNumber: 'serial', status: 'Offline', versions: { firmware: '1', hardware: '1' },
        },
        success: true,
      })
      .mockResolvedValue({
        info: {
          manufacturer: 'iControl', model: 'Gateway', serialNumber: 'serial', status: 'Offline', versions: { firmware: '1', hardware: '1' },
        },
        success: true,
      });
    const panelInformation = vi.fn()
      .mockResolvedValueOnce({ info: { manufacturer: 'Honeywell', model: 'Vista', status: 'Online' }, success: true })
      .mockResolvedValueOnce({ info: { manufacturer: 'Honeywell', model: 'Vista', status: 'Offline' }, success: true })
      .mockResolvedValue({ info: { manufacturer: 'Honeywell', model: 'Vista', status: 'Offline' }, success: true });
    const panelStatus = vi.fn()
      .mockResolvedValueOnce({
        info: { panelNotes: [], panelStates: ['Disarmed'], panelStatuses: ['All Quiet'], rawData: { node: 'Disarmed. All Quiet.', unknownPieces: [] } },
        success: true,
      })
      .mockResolvedValueOnce({
        info: { panelNotes: [], panelStates: ['Armed Away'], panelStatuses: ['Sensor Problem'], rawData: { node: 'Armed Away. Sensor Problem.', unknownPieces: [] } },
        success: true,
      })
      .mockResolvedValue({
        info: { panelNotes: [], panelStates: ['Armed Away'], panelStatuses: ['Sensor Problem'], rawData: { node: 'Armed Away. Sensor Problem.', unknownPieces: [] } },
        success: true,
      });
    const sensorsInformation = vi.fn()
      .mockResolvedValueOnce({ info: { sensors: sensorInformation('Online') }, success: true })
      .mockResolvedValueOnce({ info: { sensors: sensorInformation('Offline') }, success: true })
      .mockResolvedValue({ info: { sensors: sensorInformation('Offline', true) }, success: true });
    const sensorsStatus = vi.fn()
      .mockResolvedValueOnce({ info: { sensors: sensorStatus(['Closed']) }, success: true })
      .mockResolvedValueOnce({ info: { sensors: sensorStatus(['Open']) }, success: true })
      .mockResolvedValue({ info: { sensors: sensorStatus(['Open'], true) }, success: true });
    const performSyncCheck = vi.fn()
      .mockResolvedValueOnce({ info: { syncCode: '2-0-0' }, success: true })
      .mockResolvedValueOnce({ info: { syncCode: '3-0-0' }, success: true })
      .mockResolvedValueOnce({ info: { syncCode: '4-0-0' }, success: true })
      .mockResolvedValueOnce({ info: { syncCode: '5-0-0' }, success: true });
    const portalClient = createPortalClient({
      getGatewayInformation: gateway,
      getPanelInformation: panelInformation,
      getPanelStatus: panelStatus,
      getSensorsInformation: sensorsInformation,
      getSensorsStatus: sensorsStatus,
      performSyncCheck,
    });
    unknownSensorDetector.mockResolvedValue(true);
    let now = 4_000;
    const nowSpy = vi.spyOn(Date, 'now').mockImplementation(() => now);
    const launched = await launchPlatform(createNormalConfig({
      sensors: [{
        adtName: 'Front Door',
        adtType: 'doorWindow',
        adtZone: 2,
        name: 'Entry Door',
      }],
    }), portalClient);
    const synchronize = launched.intervalCallbacks[0];

    await synchronize!();
    await vi.waitFor(() => expect(launched.apiMock.methods.registerPlatformAccessories).toHaveBeenCalledTimes(4));
    now += 4_000;
    await synchronize!();
    await vi.waitFor(() => expect(launched.apiMock.methods.updatePlatformAccessories).toHaveBeenCalledTimes(4));
    now += 4_000;
    await synchronize!();
    await vi.waitFor(() => expect(platformUtilityMocks.stackTracer).toHaveBeenCalledWith(
      'log-status-changes',
      expect.any(Object),
    ));
    now += 4_000;
    await synchronize!();
    await vi.waitFor(() => expect(performSyncCheck).toHaveBeenCalledTimes(4));

    expect(launched.loggerMock.methods.info).toHaveBeenCalledWith(expect.stringContaining('Gateway'));
    expect(launched.loggerMock.methods.info).toHaveBeenCalledWith(expect.stringContaining('Security Panel'));
    expect(launched.loggerMock.methods.info).toHaveBeenCalledWith(expect.stringContaining('Entry Door'));
    expect(unknownSensorDetector).toHaveBeenCalledTimes(3);

    nowSpy.mockRestore();
    launched.setIntervalSpy.mockRestore();
  });

  it('uses HomeKit-safe fallback names without changing portal names or custom names', async () => {
    const portalClient = createPortalClient({
      getSensorsInformation: vi.fn().mockResolvedValue({
        info: {
          sensors: [{
            deviceId: 11,
            deviceType: 'Door/Window Sensor',
            name: 'Family Room Window (11)',
            status: 'Online',
            zone: 11,
          }, {
            deviceId: 12,
            deviceType: 'Door/Window Sensor',
            name: 'Kitchen Window (12)',
            status: 'Online',
            zone: 12,
          }, {
            deviceId: 13,
            deviceType: 'Door/Window Sensor',
            name: 'Garage Door (13)',
            status: 'Online',
            zone: 13,
          }],
        },
        success: true,
      }),
      performSyncCheck: vi.fn().mockResolvedValue({ info: { syncCode: '2-0-0' }, success: true }),
    });
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(4_000);
    const launched = await launchPlatform(createNormalConfig({
      sensors: [{
        adtName: 'Family Room Window (11)',
        adtType: 'doorWindow',
        adtZone: 11,
      }, {
        adtName: 'Kitchen Window (12)',
        adtType: 'doorWindow',
        adtZone: 12,
        name: 'Kitchen Casement',
      }, {
        adtName: 'Garage Door (13)',
        adtType: 'doorWindow',
        adtZone: 13,
        name: '',
      }],
    }), portalClient);

    await launched.intervalCallbacks[0]!();
    await vi.waitFor(() => expect(launched.apiMock.methods.registerPlatformAccessories).toHaveBeenCalledTimes(6));

    expect(launched.apiMock.methods.registerPlatformAccessories).toHaveBeenCalledWith(
      'homebridge-adt-pulse',
      'ADTPulse',
      [expect.objectContaining({
        context: expect.objectContaining({
          name: 'Family Room Window 11',
          originalName: 'Family Room Window (11)',
          uuid: 'uuid-adt-device-11',
        }),
        displayName: 'Family Room Window 11',
      })],
    );
    expect(launched.apiMock.methods.registerPlatformAccessories).toHaveBeenCalledWith(
      'homebridge-adt-pulse',
      'ADTPulse',
      [expect.objectContaining({
        context: expect.objectContaining({
          name: 'Kitchen Casement',
          originalName: 'Kitchen Window (12)',
          uuid: 'uuid-adt-device-12',
        }),
        displayName: 'Kitchen Casement',
      })],
    );
    expect(launched.apiMock.methods.registerPlatformAccessories).toHaveBeenCalledWith(
      'homebridge-adt-pulse',
      'ADTPulse',
      [expect.objectContaining({
        context: expect.objectContaining({
          name: 'Garage Door 13',
          originalName: 'Garage Door (13)',
          uuid: 'uuid-adt-device-13',
        }),
        displayName: 'Garage Door 13',
      })],
    );

    nowSpy.mockRestore();
    launched.setIntervalSpy.mockRestore();
  });

  it('removes disabled and unconfigured accessories while warning about missing portal sensors', async () => {
    const portalClient = createPortalClient({
      getSensorsInformation: vi.fn().mockResolvedValue({
        info: {
          sensors: [{
            deviceId: 2,
            deviceType: 'Door/Window Sensor',
            name: 'Front Door',
            status: 'Online',
            zone: 2,
          }],
        },
        success: true,
      }),
      performSyncCheck: vi.fn().mockResolvedValue({ info: { syncCode: '2-0-0' }, success: true }),
    });
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(4_000);
    const launched = await launchPlatform(createNormalConfig({
      options: ['disableAlarmRingingSwitch'],
      sensors: [{ adtName: 'Front Door', adtType: 'doorWindow', adtZone: 2 }, {
        adtName: 'Missing Sensor', adtType: 'motion', adtZone: 9,
      }],
    }), portalClient);
    launched.platform.configureAccessory({
      context: {
        ...createDevice(),
        id: 'adt-device-1-switch',
        name: 'Alarm Ringing',
        originalName: 'Alarm Ringing',
        type: 'panelSwitch',
        uuid: 'uuid-adt-device-1-switch',
        zone: null,
      },
    } as unknown as Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Accessory);
    launched.platform.configureAccessory({
      context: {
        ...createDevice(),
        id: 'adt-device-99',
        name: 'Orphan Sensor',
        originalName: 'Orphan Sensor',
        uuid: 'uuid-orphan',
        zone: 99,
      },
    } as unknown as Lib_Platform_ADTPulsePlatform_ConfigureAccessory_Accessory);

    await launched.intervalCallbacks[0]!();
    await vi.waitFor(() => expect(launched.apiMock.methods.unregisterPlatformAccessories).toHaveBeenCalledTimes(2));

    expect(launched.loggerMock.methods.warn).toHaveBeenCalledWith(
      expect.stringContaining('Missing Sensor'),
    );

    nowSpy.mockRestore();
    launched.setIntervalSpy.mockRestore();
  });

  it('tolerates partial fetch failures and a rejected portal request', async () => {
    const failedResponse = { info: { message: 'unavailable' }, success: false };
    const gateway = vi.fn()
      .mockResolvedValueOnce(failedResponse)
      .mockRejectedValueOnce(new Error('gateway request exploded'));
    const portalClient = createPortalClient({
      getGatewayInformation: gateway,
      getOrbSecurityButtons: vi.fn().mockResolvedValue(failedResponse),
      getPanelInformation: vi.fn().mockResolvedValue(failedResponse),
      getPanelStatus: vi.fn().mockResolvedValue(failedResponse),
      getSensorsInformation: vi.fn().mockResolvedValue(failedResponse),
      getSensorsStatus: vi.fn().mockResolvedValue(failedResponse),
      performSyncCheck: vi.fn()
        .mockResolvedValueOnce({ info: { syncCode: '2-0-0' }, success: true })
        .mockResolvedValueOnce({ info: { syncCode: '3-0-0' }, success: true }),
    });
    let now = 4_000;
    const nowSpy = vi.spyOn(Date, 'now').mockImplementation(() => now);
    const launched = await launchPlatform(createNormalConfig(), portalClient);

    await launched.intervalCallbacks[0]!();
    await vi.waitFor(() => expect(gateway).toHaveBeenCalledOnce());
    await vi.waitFor(() => expect(unknownSensorDetector).toHaveBeenCalledOnce());
    now += 4_000;
    await launched.intervalCallbacks[0]!();
    await vi.waitFor(() => expect(launched.loggerMock.methods.error).toHaveBeenCalledWith(
      'fetchUpdatedInformation() has unexpectedly thrown an error, will continue to fetch.',
    ));

    expect(launched.apiMock.methods.registerPlatformAccessories).not.toHaveBeenCalled();
    expect(platformUtilityMocks.stackTracer).toHaveBeenCalledWith(
      'serialize-error',
      expect.objectContaining({ message: 'gateway request exploded' }),
    );

    nowSpy.mockRestore();
    launched.setIntervalSpy.mockRestore();
  });
});
