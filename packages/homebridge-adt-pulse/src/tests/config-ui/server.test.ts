import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

type Tests_ConfigUi_Server_Handler = (payload: Record<string, unknown>) => Promise<unknown> | unknown;

type Tests_ConfigUi_Server_Sensor = {
  name?: string;
  adtName: string;
  adtZone: number;
  adtType: 'doorWindow' | 'flood' | 'motion';
};

const authHarness = vi.hoisted(() => ({
  getSensorsCalls: 0,
  sensorResponses: [] as Tests_ConfigUi_Server_Sensor[][],
}));

const serverHarness = vi.hoisted(() => ({
  handlers: new Map<string, Tests_ConfigUi_Server_Handler>(),
  ready: false,
}));

vi.mock('@homebridge/plugin-ui-utils', () => ({
  HomebridgePluginUiServer: class {
    public get homebridgeStoragePath(): string {
      return '/tmp/homebridge-adt-pulse-tests';
    }

    public onRequest(path: string, handler: Tests_ConfigUi_Server_Handler): void {
      if (serverHarness.ready === true) {
        throw new Error('Cannot register handlers after the server is ready');
      }

      if (serverHarness.handlers.has(path) === true) {
        throw new Error(`Handler already registered for ${path}`);
      }

      serverHarness.handlers.set(path, handler);
    }

    public ready(): void {
      if (serverHarness.handlers.size !== 5) {
        throw new Error('The config server must register all five handlers before becoming ready');
      }

      serverHarness.ready = true;
    }
  },
}));

vi.mock('../../lib/auth.js', () => ({
  ADTPulseAuth: class {
    public async getSensors() {
      const sensors = authHarness.sensorResponses.shift();

      if (sensors === undefined) {
        throw new Error('No portal sensor response was queued');
      }

      if (sensors.length > 147) {
        throw new Error('The portal sensor response exceeds the supported limit');
      }

      authHarness.getSensorsCalls += 1;

      return {
        action: 'GET_SENSORS',
        success: true,
        info: {
          sensors,
        },
      };
    }

    public getFingerprint(): string {
      return 'fixture-fingerprint';
    }
  },
}));

vi.mock('../../lib/utility.js', () => ({
  createTrustedDeviceName: vi.fn((instanceName: string) => instanceName),
  debugLog: vi.fn(),
}));

await import('../../config-ui/server.js');

function getRequestHandler(path: string) {
  const handler = serverHarness.handlers.get(path);

  if (handler === undefined) {
    throw new Error(`No handler registered for ${path}`);
  }

  return handler;
}

describe('config UI sensor updates', () => {
  beforeEach(async () => {
    authHarness.getSensorsCalls = 0;
    authHarness.sensorResponses.length = 0;

    const initialize = getRequestHandler('/initialize');

    await expect(initialize({
      password: 'fixture-password',
      subdomain: 'portal',
      username: 'fixture-user',
    })).resolves.toEqual({
      action: 'UI_INITIALIZE',
      success: true,
      info: null,
    });
  });

  it('preserves custom names by sensor identity and appends sensors missing from the portal', async () => {
    authHarness.sensorResponses.push([
      {
        adtName: 'Front Door',
        adtZone: 1,
        adtType: 'doorWindow',
      },
      {
        adtName: 'Back Door',
        adtZone: 2,
        adtType: 'doorWindow',
      },
      {
        adtName: 'Kitchen Motion',
        adtZone: 3,
        adtType: 'motion',
      },
    ]);

    const generateConfig = getRequestHandler('/generate-config');

    await expect(generateConfig({
      oldConfig: {
        mode: 'normal',
        name: 'ADT Pulse',
        options: [],
        platform: 'ADTPulse',
        sensors: [
          {
            name: 'Kitchen',
            adtName: 'Kitchen Motion',
            adtZone: 3,
            adtType: 'motion',
          },
          {
            name: 'Front Entry',
            adtName: 'Front Door',
            adtZone: 1,
            adtType: 'doorWindow',
          },
          {
            name: 'Garage',
            adtName: 'Garage Motion',
            adtZone: 9,
            adtType: 'motion',
          },
          {
            name: 'Basement',
            adtName: 'Basement Flood',
            adtZone: 8,
            adtType: 'flood',
          },
        ],
        speed: 1,
      },
      updateSensors: true,
    })).resolves.toEqual({
      action: 'UI_GENERATE_CONFIG',
      success: true,
      info: {
        config: {
          fingerprint: 'fixture-fingerprint',
          mode: 'normal',
          name: 'ADT Pulse',
          options: [],
          password: 'fixture-password',
          platform: 'ADTPulse',
          sensors: [
            {
              name: 'Front Entry',
              adtName: 'Front Door',
              adtZone: 1,
              adtType: 'doorWindow',
            },
            {
              adtName: 'Back Door',
              adtZone: 2,
              adtType: 'doorWindow',
            },
            {
              name: 'Kitchen',
              adtName: 'Kitchen Motion',
              adtZone: 3,
              adtType: 'motion',
            },
            {
              name: 'Garage',
              adtName: 'Garage Motion',
              adtZone: 9,
              adtType: 'motion',
            },
            {
              name: 'Basement',
              adtName: 'Basement Flood',
              adtZone: 8,
              adtType: 'flood',
            },
          ],
          speed: 1,
          subdomain: 'portal',
          username: 'fixture-user',
        },
      },
    });

    expect(authHarness.getSensorsCalls).toBe(1);
    expect(authHarness.sensorResponses).toHaveLength(0);
  });

  it('keeps existing sensors when the portal returns an empty list', async () => {
    authHarness.sensorResponses.push([]);

    const generateConfig = getRequestHandler('/generate-config');

    await expect(generateConfig({
      oldConfig: {
        sensors: [
          {
            name: 'Front Entry',
            adtName: 'Front Door',
            adtZone: 1,
            adtType: 'doorWindow',
          },
          {
            name: 'Basement',
            adtName: 'Basement Flood',
            adtZone: 8,
            adtType: 'flood',
          },
        ],
      },
      updateSensors: true,
    })).resolves.toEqual({
      action: 'UI_GENERATE_CONFIG',
      success: true,
      info: {
        config: {
          fingerprint: 'fixture-fingerprint',
          mode: 'normal',
          name: 'ADT Pulse',
          options: [],
          password: 'fixture-password',
          platform: 'ADTPulse',
          sensors: [
            {
              name: 'Front Entry',
              adtName: 'Front Door',
              adtZone: 1,
              adtType: 'doorWindow',
            },
            {
              name: 'Basement',
              adtName: 'Basement Flood',
              adtZone: 8,
              adtType: 'flood',
            },
          ],
          speed: 1,
          subdomain: 'portal',
          username: 'fixture-user',
        },
      },
    });

    expect(authHarness.getSensorsCalls).toBe(1);
    expect(authHarness.sensorResponses).toHaveLength(0);
  });

  it('preserves separate custom names for duplicate sensor identities', async () => {
    authHarness.sensorResponses.push([
      {
        adtName: 'Patio Door',
        adtZone: 4,
        adtType: 'doorWindow',
      },
      {
        adtName: 'Patio Door',
        adtZone: 4,
        adtType: 'doorWindow',
      },
    ]);

    const generateConfig = getRequestHandler('/generate-config');

    await expect(generateConfig({
      oldConfig: {
        sensors: [
          {
            name: 'Patio Left',
            adtName: 'Patio Door',
            adtZone: 4,
            adtType: 'doorWindow',
          },
          {
            name: 'Patio Right',
            adtName: 'Patio Door',
            adtZone: 4,
            adtType: 'doorWindow',
          },
        ],
      },
      updateSensors: true,
    })).resolves.toEqual({
      action: 'UI_GENERATE_CONFIG',
      success: true,
      info: {
        config: {
          fingerprint: 'fixture-fingerprint',
          mode: 'normal',
          name: 'ADT Pulse',
          options: [],
          password: 'fixture-password',
          platform: 'ADTPulse',
          sensors: [
            {
              name: 'Patio Left',
              adtName: 'Patio Door',
              adtZone: 4,
              adtType: 'doorWindow',
            },
            {
              name: 'Patio Right',
              adtName: 'Patio Door',
              adtZone: 4,
              adtType: 'doorWindow',
            },
          ],
          speed: 1,
          subdomain: 'portal',
          username: 'fixture-user',
        },
      },
    });

    expect(authHarness.getSensorsCalls).toBe(1);
    expect(authHarness.sensorResponses).toHaveLength(0);
  });

  it('keeps old sensors without requesting portal sensors when updates are disabled', async () => {
    const generateConfig = getRequestHandler('/generate-config');

    await expect(generateConfig({
      oldConfig: {
        sensors: [
          {
            name: 'Garage',
            adtName: 'Garage Motion',
            adtZone: 9,
            adtType: 'motion',
          },
        ],
      },
      updateSensors: false,
    })).resolves.toEqual({
      action: 'UI_GENERATE_CONFIG',
      success: true,
      info: {
        config: {
          fingerprint: 'fixture-fingerprint',
          mode: 'normal',
          name: 'ADT Pulse',
          options: [],
          password: 'fixture-password',
          platform: 'ADTPulse',
          sensors: [
            {
              name: 'Garage',
              adtName: 'Garage Motion',
              adtZone: 9,
              adtType: 'motion',
            },
          ],
          speed: 1,
          subdomain: 'portal',
          username: 'fixture-user',
        },
      },
    });

    expect(authHarness.getSensorsCalls).toBe(0);
    expect(authHarness.sensorResponses).toHaveLength(0);
  });
});
