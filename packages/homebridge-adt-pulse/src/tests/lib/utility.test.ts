import axios from 'axios';
import { Categories } from 'homebridge';
import { JSDOM } from 'jsdom';
import { DateTime } from 'luxon';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import packageJson from '../../../package.json';

import {
  clearHtmlLineBreak,
  clearWhitespace,
  condensePanelStates,
  condenseSensorType,
  convertPanelCharacteristicValue,
  createTrustedDeviceName,
  debugLog,
  fetchErrorMessage,
  fetchMissingSatCode,
  fetchTableCells,
  findGatewayManufacturerModel,
  findIndexWithValue,
  findNullKeys,
  findPanelManufacturer,
  generateHash,
  getAccessoryCategory,
  getDetectReportUrl,
  getPackageVersion,
  getPluralForm,
  isEmptyOrbTextSummary,
  isForwardSlashOS,
  isMaintenancePeriod,
  isPanelAlarmActive,
  isPluginOutdated,
  isPortalSyncCode,
  isSessionCleanState,
  isUnknownDoSubmitHandlerCollection,
  isUnknownGatewayDevice,
  isUnknownOrbSecurityButtonCollection,
  isUnknownPanelDevice,
  parseArmDisarmMessage,
  parseDoSubmitHandlers,
  parseMultiFactorMethods,
  parseMultiFactorTrustedDevices,
  parseOrbSecurityButtons,
  parseOrbSensors,
  parseOrbTextSummary,
  parseSensorsTable,
  removePersonalIdentifiableInformation,
  sleep,
} from '../../lib/utility.js';

const characteristic = {
  SecuritySystemCurrentState: {
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
} as Parameters<typeof condensePanelStates>[0];

describe('trusted device names', () => {
  it('uses the instance name and a collision-resistant UUID within the portal limit', () => {
    const first = createTrustedDeviceName('Homebridge');
    const second = createTrustedDeviceName('Homebridge');
    const long = createTrustedDeviceName('a'.repeat(200));

    expect(first).toMatch(/^Homebridge\.[0-9a-f-]{36}$/);
    expect(first).not.toBe(second);
    expect(long.length).toBe(100);
  });
});

function createPortalResponse(data: unknown) {
  return {
    config: {
      headers: {
        Referer: 'https://fixture.invalid/signin',
      },
      url: 'https://fixture.invalid/signin',
    },
    data,
  };
}

function createReadyButton(buttonText: string, armState = 'off') {
  return {
    buttonDisabled: false,
    buttonId: 'security_button_0',
    buttonIndex: 0,
    buttonText,
    changeAccessCode: false,
    loadingText: `Loading ${buttonText}`,
    relativeUrl: '/arm',
    totalButtons: 1,
    urlParams: {
      arm: 'away',
      armState,
      href: 'rest/adt/ui/client/security/setArmState',
      sat: 'fixture-sat',
    },
  };
}

describe('text and HomeKit conversions', () => {
  it('normalizes HTML line breaks and whitespace', () => {
    expect(clearHtmlLineBreak(' First<br>Second ')).toBe(
      'First Second',
    );
    expect(clearWhitespace('  First\n\t Second   Third  ')).toBe(
      'First Second Third',
    );
  });

  it.each([
    ['Armed Away', 'away', 1, 1],
    ['Armed Night', 'night', 2, 2],
    ['Armed Stay', 'stay', 0, 0],
    ['Disarmed', 'off', 3, 3],
  ] as const)('condenses %s panel state', (state, armValue, current, target) => {
    expect(condensePanelStates(characteristic, [state])).toEqual({
      armValue,
      characteristicValue: {
        current,
        target,
      },
    });
  });

  it('returns undefined for an unknown panel state', () => {
    expect(condensePanelStates(characteristic, [])).toBeUndefined();
  });

  it.each([
    ['Carbon Monoxide Detector', 'co'],
    ['Door Sensor', 'doorWindow'],
    ['Window Sensor', 'doorWindow'],
    ['Fire (Smoke/Heat) Detector', 'fire'],
    ['Water/Flood Sensor', 'flood'],
    ['Glass Break Detector', 'glass'],
    ['Heat (Rate-of-Rise) Detector', 'heat'],
    ['Motion Sensor (Notable Events Only)', 'motion'],
    ['Shock Sensor', 'shock'],
    ['Temperature Sensor', 'temperature'],
  ] as const)('condenses %s sensor type', (source, expected) => {
    expect(condenseSensorType(source)).toBe(expected);
  });

  it('returns undefined for an unsupported sensor type', () => {
    expect(condenseSensorType(
      'Unknown Device Type' as Parameters<typeof condenseSensorType>[0],
    )).toBeUndefined();
  });

  it.each([
    ['current-to-target', 1, 1],
    ['current-to-target', 0, 0],
    ['current-to-target', 2, 2],
    ['current-to-target', 3, 3],
    ['target-to-current', 1, 1],
    ['target-to-current', 0, 0],
    ['target-to-current', 2, 2],
    ['target-to-current', 3, 3],
  ] as const)('converts %s characteristic value %s', (mode, value, expected) => {
    expect(convertPanelCharacteristicValue(mode, characteristic, value)).toBe(expected);
  });

  it('returns undefined for an unsupported characteristic value', () => {
    expect(convertPanelCharacteristicValue(
      'current-to-target',
      characteristic,
      99,
    )).toBeUndefined();
  });
});

describe('logging and response helpers', () => {
  it.each([
    ['error', 'error'],
    ['warn', 'warn'],
    ['success', 'info'],
    ['info', 'info'],
  ] as const)('routes %s debug output through logger.%s', (type, method) => {
    const loggerMethods = {
      error: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
    };

    debugLog(
      loggerMethods as unknown as Parameters<typeof debugLog>[0],
      'utility.test.ts / fixture()',
      type,
      'message',
    );

    expect(loggerMethods[method]).toHaveBeenCalledOnce();
  });

  it('falls back to the console when no logger exists', () => {
    const consoleInfo = vi.spyOn(console, 'info').mockImplementation(() => undefined);

    debugLog(null, 'utility.test.ts / fixture()', 'info', 'message');

    expect(consoleInfo).toHaveBeenCalledOnce();

    consoleInfo.mockRestore();
  });

  it('extracts and cleans a portal warning message', () => {
    const response = createPortalResponse(
      '<div id="warnMsgContents">Invalid<br> credentials</div>',
    ) as unknown as Parameters<typeof fetchErrorMessage>[0];

    expect(fetchErrorMessage(response)).toBe('Invalid credentials');
  });

  it('returns null for missing or malformed warning responses', () => {
    expect(fetchErrorMessage(undefined)).toBeNull();
    expect(fetchErrorMessage(
      createPortalResponse({}) as unknown as Parameters<typeof fetchErrorMessage>[0],
    )).toBeNull();
    expect(fetchErrorMessage(
      createPortalResponse('<div>No warning</div>') as unknown as Parameters<typeof fetchErrorMessage>[0],
    )).toBeNull();
  });

  it('recovers a missing sat code from response HTML', () => {
    expect(fetchMissingSatCode(
      createPortalResponse('href="/arm?sat=12345678-abcd&next=1"') as unknown as Parameters<typeof fetchMissingSatCode>[0],
    )).toBe('12345678-abcd');
    expect(fetchMissingSatCode(
      createPortalResponse('no code') as unknown as Parameters<typeof fetchMissingSatCode>[0],
    )).toBeNull();
    expect(fetchMissingSatCode(
      createPortalResponse({}) as unknown as Parameters<typeof fetchMissingSatCode>[0],
    )).toBeNull();
  });

  it('collects table values after matching labels', () => {
    const document = new JSDOM([
      '<table><tr>',
      '<td>Label:</td><td> First </td><td>Second</td>',
      '</tr></table>',
    ].join('')).window.document;
    const cells = document.querySelectorAll('td');

    expect(fetchTableCells(cells, ['Label:'], 1, 2)).toEqual({
      'Label:': [
        'First',
        'Second',
      ],
    });
    expect(fetchTableCells(cells, ['Label:'], -1, -2)).toEqual({});
  });
});

describe('device and collection helpers', () => {
  it.each([
    ['manufacturer', 'ADT Pulse Gateway', 'iHub-3001', 'iControl'],
    ['model', 'ADT Pulse Gateway', 'iHub-3001', 'ADT Pulse Gateway iHub-3001'],
    ['manufacturer', 'ADT Pulse Gateway', 'PGZNG1', 'NETGEAR'],
    ['manufacturer', null, 'Compact SMA Protocol Gateway', 'iControl'],
    ['manufacturer', null, 'Lynx/QuickConnect Cellular-Only Gateway', 'Ademco/ADT'],
    ['model', 'Other', 'Other Model', 'Other Model'],
  ] as const)('normalizes gateway %s for %s / %s', (mode, manufacturer, model, expected) => {
    expect(findGatewayManufacturerModel(mode, manufacturer, model)).toBe(expected);
  });

  it('finds an index and value together', () => {
    expect(findIndexWithValue([
      'a',
      'b',
      'c',
    ], (value) => value === 'b')).toEqual({
      index: 1,
      value: 'b',
    });
    expect(findIndexWithValue(['a'], (value) => value === 'z')).toEqual({
      index: -1,
      value: undefined,
    });
  });

  it('finds nested null and undefined keys', () => {
    expect(findNullKeys({
      gateway: {
        ip: null,
        model: 'iHub',
      },
      panel: undefined,
    })).toEqual([
      'gateway.ip',
      'panel',
    ]);
  });

  it('uses explicit and inferred panel manufacturers', () => {
    expect(findPanelManufacturer('DSC', 'Security Panel - Impassa')).toBe('DSC');
    expect(findPanelManufacturer(null, 'Security Panel - LYNX/QuickConnect')).toBe('Ademco/ADT');
    expect(findPanelManufacturer(null, 'Unknown')).toBeNull();
  });

  it('omits volatile personal information from generated hashes', () => {
    const first = generateHash({
      manufacturer: 'iControl',
      serialNumber: 'first',
      update: {
        last: 'today',
      },
    });
    const second = generateHash({
      manufacturer: 'iControl',
      serialNumber: 'second',
      update: {
        last: 'tomorrow',
      },
    });
    const changed = generateHash({
      manufacturer: 'NETGEAR',
      serialNumber: 'second',
    });

    expect(first).toBe(second);
    expect(changed).not.toBe(first);
    expect(first).toHaveLength(128);
  });

  it.each([
    ['ALARM_SYSTEM', Categories.ALARM_SYSTEM],
    ['OTHER', Categories.OTHER],
    ['SECURITY_SYSTEM', Categories.SECURITY_SYSTEM],
    ['SENSOR', Categories.SENSOR],
    ['SWITCH', Categories.SWITCH],
  ] as const)('maps %s to a Homebridge category', (category, expected) => {
    expect(getAccessoryCategory(category)).toBe(expected);
  });

  it('uses OTHER as the category fallback', () => {
    expect(getAccessoryCategory('UNKNOWN' as Parameters<typeof getAccessoryCategory>[0])).toBe(
      Categories.OTHER,
    );
  });

  it('recognizes known and unknown gateway shapes', () => {
    expect(isUnknownGatewayDevice({
      'Manufacturer:': ['ADT Pulse Gateway'],
      'Model:': ['iHub-3001'],
      'Primary Connection Type:': ['Broadband'],
    })).toBe(false);
    expect(isUnknownGatewayDevice({
      'Manufacturer:': ['Unknown'],
      'Model:': ['Unknown'],
      'Primary Connection Type:': ['Satellite'],
    })).toBe(true);
  });

  it('recognizes known and unknown panel shapes', () => {
    expect(isUnknownPanelDevice({
      'Manufacturer/Provider:': ['ADT'],
      'Type/Model:': ['Security Panel - Safewatch Pro 3000/3000CN'],
    })).toBe(false);
    expect(isUnknownPanelDevice({
      'Manufacturer/Provider:': ['Unknown'],
      'Type/Model:': ['Unknown'],
    })).toBe(true);
  });

  it('recognizes known force-arm handler collections', () => {
    const known = [
      {
        relativeUrl: '/myhome/24.0.0-117/quickcontrol/serv/RunRRACommand',
        urlParams: {
          arm: null,
          armState: null,
          href: 'rest/adt/ui/client/security/setForceArm',
          sat: 'fixture',
        },
      },
      {
        relativeUrl: '/myhome/24.0.0-117/quickcontrol/serv/RunRRACommand',
        urlParams: {
          arm: null,
          armState: null,
          href: 'rest/adt/ui/client/security/setCancelProtest',
          sat: 'fixture',
        },
      },
    ] as unknown as Parameters<typeof isUnknownDoSubmitHandlerCollection>[0];

    expect(isUnknownDoSubmitHandlerCollection(known)).toBe(false);
    expect(isUnknownDoSubmitHandlerCollection(known.slice(0, 1))).toBe(true);
  });

  it('recognizes known orb button collections', () => {
    const known = [
      {
        ...createReadyButton('Arm Away'),
        loadingText: 'Arming Away',
      },
      {
        ...createReadyButton('Arm Stay'),
        loadingText: 'Arming Stay',
      },
    ] as Parameters<typeof isUnknownOrbSecurityButtonCollection>[0];

    expect(isUnknownOrbSecurityButtonCollection(known)).toBe(false);
    expect(isUnknownOrbSecurityButtonCollection([
      createReadyButton('Unknown'),
    ] as Parameters<typeof isUnknownOrbSecurityButtonCollection>[0])).toBe(true);
  });
});

describe('status and environment helpers', () => {
  it('returns fixed metadata helpers', () => {
    expect(getDetectReportUrl()).toMatch(/^https:\/\//);
    expect(getPackageVersion()).toBe(packageJson.version);
    expect(getPluralForm(1, 'item', 'items')).toBe('item');
    expect(getPluralForm(2, 'item', 'items')).toBe('items');
    expect(isForwardSlashOS()).toBe(true);
  });

  it('identifies empty and populated orb summaries', () => {
    expect(isEmptyOrbTextSummary({
      panelNotes: [],
      panelStates: [],
      panelStatuses: [],
      rawData: {
        node: '',
        unknownPieces: [],
      },
    })).toBe(true);
    expect(isEmptyOrbTextSummary({
      panelNotes: [],
      panelStates: ['Disarmed'],
      panelStatuses: [],
      rawData: {
        node: 'Disarmed',
        unknownPieces: [],
      },
    })).toBe(false);
  });

  it('identifies the nightly maintenance window', () => {
    const dateTimeNow = vi.spyOn(DateTime, 'now');

    dateTimeNow.mockReturnValue(DateTime.fromISO(
      '2026-07-15T23:00:00',
      { zone: 'America/Los_Angeles' },
    ) as ReturnType<typeof DateTime.now>);
    expect(isMaintenancePeriod()).toBe(true);

    dateTimeNow.mockReturnValue(DateTime.fromISO(
      '2026-07-15T12:00:00',
      { zone: 'America/Los_Angeles' },
    ) as ReturnType<typeof DateTime.now>);
    expect(isMaintenancePeriod()).toBe(false);

    dateTimeNow.mockRestore();
  });

  it.each([
    'BURGLARY ALARM',
    'Carbon Monoxide Alarm',
    'FIRE ALARM',
    'Uncleared Alarm',
    'WATER ALARM',
  ] as const)('treats %s as an active alarm', (status) => {
    expect(isPanelAlarmActive(
      [status],
      [],
      false,
    )).toBe(true);
  });

  it('only treats sensor problems as alarms with trouble buttons', () => {
    const troubleButtons = [
      createReadyButton('Disarm'),
      createReadyButton('Arm Away'),
      createReadyButton('Arm Stay'),
    ] as Parameters<typeof isPanelAlarmActive>[1];

    expect(isPanelAlarmActive(['Sensor Problem'], troubleButtons, false)).toBe(true);
    expect(isPanelAlarmActive(['Sensor Problem'], troubleButtons, true)).toBe(false);
    expect(isPanelAlarmActive(['All Quiet'], troubleButtons, false)).toBe(false);
  });

  it.each([
    ['1-0-0', true],
    ['123-45-6', true],
    ['invalid', false],
    ['1-2', false],
  ])('validates portal sync code %s', (syncCode, expected) => {
    expect(isPortalSyncCode(syncCode)).toBe(expected);
  });

  it('recognizes clean, busy, and special session states', () => {
    const clean = [
      createReadyButton('Arm Away', 'off'),
    ] as Parameters<typeof isSessionCleanState>[0];
    const special = [
      createReadyButton('Disarm', 'disarmed'),
    ] as Parameters<typeof isSessionCleanState>[0];
    const busy = [{
      buttonDisabled: true,
      buttonId: 'security_button_0',
      buttonText: 'Arming Away',
    }] as Parameters<typeof isSessionCleanState>[0];

    expect(isSessionCleanState(clean)).toBe(true);
    expect(isSessionCleanState(special)).toBe(false);
    expect(isSessionCleanState(busy)).toBe(false);
  });

  it('compares the installed package version with npm metadata', async () => {
    const axiosGet = vi.spyOn(axios, 'get');

    axiosGet.mockResolvedValueOnce({ data: { version: '99.0.0' } });
    await expect(isPluginOutdated()).resolves.toBe(true);

    axiosGet.mockResolvedValueOnce({ data: { version: '1.0.0' } });
    await expect(isPluginOutdated()).resolves.toBe(false);

    axiosGet.mockResolvedValueOnce({ data: {} });
    await expect(isPluginOutdated()).resolves.toBe(true);

    axiosGet.mockRejectedValueOnce(new Error('offline'));
    await expect(isPluginOutdated()).resolves.toBe(true);

    axiosGet.mockRestore();
  });
});

describe('portal parsers', () => {
  it('parses arm and disarm confirmation text', () => {
    const document = new JSDOM('<div id="message">  System   disarmed  </div>').window.document;

    expect(parseArmDisarmMessage(document.querySelector('#message'))).toBe('System disarmed');
    expect(parseArmDisarmMessage(null)).toBeNull();
  });

  it('parses force-arm submit handlers and ignores inert buttons', () => {
    const html = [
      '<button onclick="doSubmit(\'',
      '/myhome/3.5.0/quickcontrol/serv/RunRRACommand.jsp?',
      'sat=fixture-sat&href=rest\\/adt\\/ui\\/client\\/security\\/setForceArm',
      '&armstate=away&arm=away\')"></button>',
      '<button></button>',
    ].join('');
    const elements = new JSDOM(html).window.document.querySelectorAll('button');

    expect(parseDoSubmitHandlers(elements)).toEqual([{
      relativeUrl: '/myhome/3.5.0/quickcontrol/serv/RunRRACommand.jsp',
      urlParams: {
        arm: 'away',
        armState: 'away',
        href: 'rest/adt/ui/client/security/setForceArm',
        sat: 'fixture-sat',
      },
    }]);
  });

  it('parses multi-factor methods and trusted devices', () => {
    const response = {
      state: {
        mfaProperties: [{
          caption: 'Text',
          id: 'sms-1',
          label: 'SMS ending 12',
          type: 'SMS',
        }],
        trustedDevices: [{
          id: 'device-1',
          label: 'Homebridge',
          name: 'Homebridge',
        }],
      },
    };

    expect(parseMultiFactorMethods(
      response as Parameters<typeof parseMultiFactorMethods>[0],
    )).toEqual([{
      id: 'sms-1',
      label: 'SMS ending 12',
      type: 'SMS',
    }]);
    expect(parseMultiFactorTrustedDevices(
      response as Parameters<typeof parseMultiFactorTrustedDevices>[0],
    )).toEqual([{
      id: 'device-1',
      name: 'Homebridge',
    }]);
    expect(parseMultiFactorTrustedDevices({
      state: {
        mfaProperties: [],
      },
    } as unknown as Parameters<typeof parseMultiFactorTrustedDevices>[0])).toEqual([]);
  });

  it('parses and sorts orb sensors while excluding invalid zones', () => {
    const html = [
      '<table><tbody>',
      '<tr><td><canvas icon="door"></canvas></td><td></td><td>',
      '<a class="p_deviceNameText">Back Door</a>',
      '<span class="p_grayNormalText">Zone 2</span></td><td>Open, Low Battery</td></tr>',
      '<tr><td><canvas icon="motion"></canvas></td><td></td><td>',
      '<a class="p_deviceNameText">Hall Motion</a>',
      '<span class="p_grayNormalText">Zone 1</span></td><td>Motion</td></tr>',
      '<tr><td><canvas icon="other"></canvas></td><td></td><td>',
      '<a class="p_deviceNameText">Keypad</a>',
      '<span class="p_grayNormalText">Zone 100</span></td><td>Online</td></tr>',
      '</tbody></table>',
    ].join('');
    const elements = new JSDOM(html).window.document.querySelectorAll('tr');

    expect(parseOrbSensors(elements)).toEqual([
      {
        icon: 'motion',
        name: 'Hall Motion',
        statuses: ['Motion'],
        zone: 1,
      },
      {
        icon: 'door',
        name: 'Back Door',
        statuses: [
          'Open',
          'Low Battery',
        ],
        zone: 2,
      },
    ]);
  });

  it('classifies panel states, statuses, notes, and unknown text', () => {
    const document = new JSDOM([
      '<div id="summary">Armed Away. Sensor Problem. ',
      'This may take several minutes. Something New.</div>',
    ].join('')).window.document;

    expect(parseOrbTextSummary(document.querySelector('#summary'))).toEqual({
      panelNotes: ['This may take several minutes'],
      panelStates: ['Armed Away'],
      panelStatuses: ['Sensor Problem'],
      rawData: {
        node: 'Armed Away. Sensor Problem. This may take several minutes. Something New.',
        unknownPieces: ['Something New'],
      },
    });
    expect(parseOrbTextSummary(null)).toEqual({
      panelNotes: [],
      panelStates: [],
      panelStatuses: [],
      rawData: {
        node: '',
        unknownPieces: [],
      },
    });
  });

  it('parses pending and ready orb security buttons', () => {
    const html = [
      '<input disabled id="pending" value="Arming Away">',
      '<input id="ready" value="Arm Away" onclick="',
      "setArmState('/arm', 'Arming Away', '0', '2', 'true', ",
      "'href=rest/adt/ui/client/security/setArmState&armstate=off&arm=away&sat=fixture-sat')",
      '">',
    ].join('');
    const elements = new JSDOM(html).window.document.querySelectorAll('input');

    expect(parseOrbSecurityButtons(elements)).toEqual([
      {
        buttonDisabled: true,
        buttonId: 'pending',
        buttonText: 'Arming Away',
      },
      {
        buttonDisabled: false,
        buttonId: 'ready',
        buttonIndex: 0,
        buttonText: 'Arm Away',
        changeAccessCode: true,
        loadingText: 'Arming Away',
        relativeUrl: '/arm',
        totalButtons: 2,
        urlParams: {
          arm: 'away',
          armState: 'off',
          href: 'rest/adt/ui/client/security/setArmState',
          sat: 'fixture-sat',
        },
      },
    ]);
  });

  it('parses an orb button that does not change the access code', () => {
    const html = [
      '<input id="ready" value="Arm Away" onclick="',
      "setArmState('/arm', 'Arming Away', '0', '1', 'false', ",
      "'href=rest/adt/ui/client/security/setArmState&armstate=off&arm=away&sat=fixture-sat')",
      '">',
    ].join('');
    const elements = new JSDOM(html).window.document.querySelectorAll('input');

    expect(parseOrbSecurityButtons(elements)).toMatchObject([{
      buttonDisabled: false,
      changeAccessCode: false,
    }]);
  });

  it('parses sensor information and configuration tables', () => {
    const html = [
      '<table><tbody>',
      '<tr><td class="p_listRow"><h2 class="p_boldNormalText">Sensors</h2></td></tr>',
      '<tr onclick="goToUrl(\'device.jsp?id=2\');">',
      '<td><canvas title="Online"></canvas></td><td><a>Back Door</a></td>',
      '<td>2</td><td></td><td>Door/Window Sensor</td></tr>',
      '<tr onclick="goToUrl(\'device.jsp?id=1\');">',
      '<td><canvas title="Offline"></canvas></td><td><a>Hall Motion</a></td>',
      '<td>1</td><td></td><td>Motion Sensor</td></tr>',
      '<tr onclick="goToUrl(\'device.jsp?id=3\');">',
      '<td><canvas title="Online"></canvas></td><td><a>Unsupported</a></td>',
      '<td>3</td><td></td><td>System/Supervisory</td></tr>',
      '<tr><td></td></tr>',
      '</tbody></table>',
    ].join('');
    const rows = new JSDOM(html).window.document.querySelectorAll('tr');

    expect(parseSensorsTable('sensors-information', rows)).toEqual([
      {
        deviceId: 1,
        deviceType: 'Motion Sensor',
        name: 'Hall Motion',
        status: 'Offline',
        zone: 1,
      },
      {
        deviceId: 2,
        deviceType: 'Door/Window Sensor',
        name: 'Back Door',
        status: 'Online',
        zone: 2,
      },
    ]);
    expect(parseSensorsTable('sensors-config', rows)).toEqual([
      {
        adtName: 'Hall Motion',
        adtType: 'motion',
        adtZone: 1,
      },
      {
        adtName: 'Back Door',
        adtType: 'doorWindow',
        adtZone: 2,
      },
    ]);
  });
});

describe('privacy and timing helpers', () => {
  it('redacts nested objects, arrays, and direct private fields without mutation', () => {
    const source = {
      devices: [{
        name: 'Gateway',
        serial: 'secret',
      }],
      masterCode: '1234',
      network: {
        ip: '192.0.2.1',
        model: 'iHub',
      },
      sat: [
        'first',
        'second',
      ],
    };

    expect(removePersonalIdentifiableInformation(source)).toEqual({
      devices: [{
        name: 'Gateway',
        serial: '*** REDACTED FOR PRIVACY ***',
      }],
      masterCode: '*** REDACTED FOR PRIVACY ***',
      network: {
        ip: '*** REDACTED FOR PRIVACY ***',
        model: 'iHub',
      },
      sat: [
        '*** REDACTED FOR PRIVACY ***',
        '*** REDACTED FOR PRIVACY ***',
      ],
    });
    expect(source.masterCode).toBe('1234');
  });

  it('redacts top-level object arrays', () => {
    expect(removePersonalIdentifiableInformation([
      {
        serialNumber: 'secret',
      },
    ])).toEqual([
      {
        serialNumber: '*** REDACTED FOR PRIVACY ***',
      },
    ]);
  });

  it('resolves sleep after the requested timer', async () => {
    vi.useFakeTimers();

    const sleeping = sleep(250);

    await vi.advanceTimersByTimeAsync(249);

    let resolved = false;

    sleeping.then(() => {
      resolved = true;
    });

    await Promise.resolve();

    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await sleeping;

    expect(resolved).toBe(true);

    vi.useRealTimers();
  });
});
