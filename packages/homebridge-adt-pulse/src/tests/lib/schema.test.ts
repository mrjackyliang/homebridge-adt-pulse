import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  configServerLogin,
  configServerRequestCode,
  configServerValidate,
  configUiLogin,
  configUiLoginResponse,
  configUiRequestCode,
  configUiValidateCode,
  multiFactorAuth,
  otpResponse,
  platformConfig,
} from '../../lib/schema.js';

function createPlatformConfig() {
  return {
    fingerprint: 'fixture-fingerprint',
    mode: 'normal',
    name: 'ADT Pulse',
    password: 'fixture-password',
    platform: 'ADTPulse',
    speed: 1,
    subdomain: 'portal',
    username: 'fixture-user',
  };
}

describe('config UI schemas', () => {
  it.each([
    'portal',
    'portal-ca',
  ])('accepts the supported %s region', (subdomain) => {
    expect(configUiLogin.safeParse({
      password: 'password',
      subdomain,
      username: 'user',
    }).success).toBe(true);
  });

  it('rejects unsupported regions and empty credentials', () => {
    const result = configUiLogin.safeParse({
      password: '',
      subdomain: 'unsupported',
      username: '',
    });

    expect(result.success).toBe(false);

    if (result.success === true) {
      throw new Error('Expected config UI login validation to fail.');
    }

    expect(result.error.issues.map((issue) => issue.message)).toEqual([
      'Please select a valid region.',
      'Please enter your username.',
      'Please enter your password.',
    ]);
  });

  it('validates login response methods and statuses', () => {
    const valid = configUiLoginResponse.safeParse({
      info: {
        methods: [{
          id: 'sms-1',
          label: 'Text ending in 12',
          type: 'SMS',
        }],
        status: 'complete',
      },
    });
    const invalid = configUiLoginResponse.safeParse({
      info: {
        methods: [{
          id: 'push-1',
          label: 'Push',
          type: 'PUSH',
        }],
        status: 'pending',
      },
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });

  it('requires a selected verification method', () => {
    expect(configUiRequestCode.safeParse({ methodId: 'sms-1' }).success).toBe(true);
    expect(configUiRequestCode.safeParse({ methodId: '' }).success).toBe(false);
  });

  it.each([
    ['123456', true],
    ['12345', false],
    ['abcdef', false],
    ['', false],
  ])('validates one-time passcode %s', (otpCode, success) => {
    expect(configUiValidateCode.safeParse({ otpCode }).success).toBe(success);
  });
});

describe('config server schemas', () => {
  it('accepts a complete login payload', () => {
    expect(configServerLogin.safeParse({
      password: 'password',
      subdomain: 'portal-ca',
      username: 'user',
    }).success).toBe(true);
  });

  it('rejects missing verification method identifiers', () => {
    expect(configServerRequestCode.safeParse({ methodId: '' }).success).toBe(false);
  });

  it('requires a device name and exactly six code characters', () => {
    expect(configServerValidate.safeParse({
      instanceName: 'Homebridge',
      otpCode: '123456',
    }).success).toBe(true);
    expect(configServerValidate.safeParse({
      instanceName: 'Homebridge',
      otpCode: '12345',
    }).success).toBe(false);
  });
});

describe('portal response schemas', () => {
  it('accepts a representative multi-factor response', () => {
    const result = multiFactorAuth.safeParse({
      commands: {
        requestCode: {
          action: 'rest/adt/ui/client/multiFactorAuth/requestCode',
          label: 'Request code',
          method: 'POST',
          params: {
            method: {
              options: [{
                caption: 'Text message',
                label: 'SMS',
                type: 'SMS',
                value: 'sms-1',
              }],
              type: 'select',
            },
          },
        },
      },
      state: {
        label: 'Verify identity',
        mfaEnabled: true,
        mfaProperties: [{
          caption: 'Text message',
          id: 'sms-1',
          label: 'SMS',
          type: 'SMS',
        }],
        numTrustedDevices: 1,
        trustedDevices: [{
          id: 'device-1',
          label: 'Homebridge',
          name: 'Homebridge',
        }],
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects unexpected multi-factor commands', () => {
    const result = multiFactorAuth.safeParse({
      commands: {
        requestCode: {
          action: 'rest/unexpected/requestCode',
          label: 'Request code',
          method: 'GET',
          params: {},
        },
      },
      state: {
        label: 'Verify identity',
        mfaEnabled: true,
        mfaProperties: [],
      },
    });

    expect(result.success).toBe(false);
  });

  it('validates one-time passcode response fields', () => {
    expect(otpResponse.safeParse({ code: 200, detail: 'Accepted' }).success).toBe(true);
    expect(otpResponse.safeParse({ code: '200', detail: null }).success).toBe(false);
  });
});

describe('platformConfig', () => {
  it('applies empty option and sensor defaults', () => {
    const result = platformConfig.parse(createPlatformConfig());

    expect(result.options).toEqual([]);
    expect(result.sensors).toEqual([]);
  });

  it('accepts every supported mode, speed, option, and representative sensor', () => {
    const result = platformConfig.safeParse({
      ...createPlatformConfig(),
      mode: 'reset',
      options: [
        'disableAlarmRingingSwitch',
        'ignoreSensorProblemStatus',
      ],
      sensors: [{
        adtName: 'Front Door',
        adtType: 'doorWindow',
        adtZone: 1,
        name: 'Entry Door',
      }],
      speed: 0.25,
    });

    expect(result.success).toBe(true);
  });

  it.each([
    ['Entry Door', 'Entry Door'],
    ["Jacky's Door", "Jacky's Door"],
    ['Fenêtre 2', 'Fenêtre 2'],
    ['', undefined],
  ])('accepts or normalizes custom sensor name %s', (name, expectedName) => {
    const result = platformConfig.parse({
      ...createPlatformConfig(),
      sensors: [{ adtName: 'Front Door (1)', adtType: 'doorWindow', adtZone: 1, name }],
    });

    expect(result.sensors[0]?.name).toBe(expectedName);
  });

  it.each([
    'A',
    'Front Door (1)',
    ' Front Door',
    'Front Door ',
    'Front 🚪 Door',
  ])('rejects HomeKit-incompatible custom sensor name %s', (name) => {
    const result = platformConfig.safeParse({
      ...createPlatformConfig(),
      sensors: [{ adtName: 'Front Door (1)', adtType: 'doorWindow', adtZone: 1, name }],
    });

    expect(result.success).toBe(false);
  });

  it.each([
    ['platform', 'OtherPlugin'],
    ['subdomain', 'invalid'],
    ['mode', 'disabled'],
    ['speed', 0.8],
  ])('rejects an unsupported %s value', (key, value) => {
    expect(platformConfig.safeParse({
      ...createPlatformConfig(),
      [key]: value,
    }).success).toBe(false);
  });

  it.each([
    [0, 'doorWindow'],
    [100, 'doorWindow'],
    [1, 'camera'],
  ])('rejects invalid sensor zone %s and type %s', (adtZone, adtType) => {
    expect(platformConfig.safeParse({
      ...createPlatformConfig(),
      sensors: [{
        adtName: 'Sensor',
        adtType,
        adtZone,
      }],
    }).success).toBe(false);
  });

  it('accepts 147 sensors and rejects 148 sensors', () => {
    const sensors = Array.from({ length: 148 }, (_, index) => ({
      adtName: `Sensor ${index + 1}`,
      adtType: 'doorWindow',
      adtZone: 1,
    }));

    expect(platformConfig.safeParse({
      ...createPlatformConfig(),
      sensors: sensors.slice(0, 147),
    }).success).toBe(true);
    expect(platformConfig.safeParse({
      ...createPlatformConfig(),
      sensors,
    }).success).toBe(false);
  });
});
