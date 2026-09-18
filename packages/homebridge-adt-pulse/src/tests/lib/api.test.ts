import { readFile } from 'node:fs/promises';

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type { Logger } from 'homebridge';

import { ADTPulseAPI } from '../../lib/api.js';

import type {
  Lib_Api_ADTPulseAPI_Constructor_Config,
  Lib_Api_ADTPulseAPI_Constructor_InternalConfig,
} from '../../types/lib/api.d.ts';

const httpMocks = vi.hoisted(() => ({
  create: vi.fn(() => ({})),
  get: vi.fn(),
  post: vi.fn(),
}));

const utilityMocks = vi.hoisted(() => ({
  sleep: vi.fn().mockResolvedValue(undefined),
  stackTracer: vi.fn(),
}));

const detectMocks = vi.hoisted(() => ({
  detectApiDoSubmitHandlers: vi.fn().mockResolvedValue(false),
  detectApiGatewayInformation: vi.fn().mockResolvedValue(false),
  detectApiOrbSecurityButtons: vi.fn().mockResolvedValue(false),
  detectApiPanelInformation: vi.fn().mockResolvedValue(false),
  detectApiPanelStatus: vi.fn().mockResolvedValue(false),
  detectApiSensorsInformation: vi.fn().mockResolvedValue(false),
  detectApiSensorsStatus: vi.fn().mockResolvedValue(false),
  detectGlobalDebugParser: vi.fn().mockResolvedValue(false),
  detectGlobalPortalVersion: vi.fn().mockResolvedValue(false),
}));

vi.mock('axios', () => ({
  default: {
    create: httpMocks.create,
  },
}));

vi.mock('axios-cookiejar-support', () => ({
  wrapper: vi.fn(() => ({
    get: httpMocks.get,
    post: httpMocks.post,
  })),
}));

vi.mock('../../lib/detect.js', () => detectMocks);

vi.mock('../../lib/utility.js', async (importOriginal) => ({
  ...await importOriginal<typeof import('../../lib/utility.js')>(),
  sleep: utilityMocks.sleep,
  stackTracer: utilityMocks.stackTracer,
}));

const logger = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  log: vi.fn(),
  prefix: 'ADT Pulse',
  success: vi.fn(),
  warn: vi.fn(),
} as unknown as Logger;

type Tests_Lib_Api_CreateApi_Options = {
  baseUrl?: `https://${string}`;
  debug?: boolean;
  logger?: Logger | null;
  speed?: 0.25 | 0.5 | 0.75 | 1;
  testMode?: Lib_Api_ADTPulseAPI_Constructor_InternalConfig['testMode'];
};

type Tests_Lib_Api_CreateApi_Returns = ADTPulseAPI;

type Tests_Lib_Api_CreateApi_Config = Lib_Api_ADTPulseAPI_Constructor_Config;

type Tests_Lib_Api_CreateApi_InternalConfig = Lib_Api_ADTPulseAPI_Constructor_InternalConfig;

type Tests_Lib_Api_ApiCall = (api: ADTPulseAPI) => Promise<unknown>;

type Tests_Lib_Api_GetGatewayInformationCall = Tests_Lib_Api_ApiCall;

type Tests_Lib_Api_GetOrbSecurityButtonsCall = Tests_Lib_Api_ApiCall;

type Tests_Lib_Api_GetPanelInformationCall = Tests_Lib_Api_ApiCall;

type Tests_Lib_Api_GetPanelStatusCall = Tests_Lib_Api_ApiCall;

type Tests_Lib_Api_GetSensorsInformationCall = Tests_Lib_Api_ApiCall;

type Tests_Lib_Api_GetSensorsStatusCall = Tests_Lib_Api_ApiCall;

type Tests_Lib_Api_PerformKeepAliveCall = Tests_Lib_Api_ApiCall;

type Tests_Lib_Api_PerformSyncCheckCall = Tests_Lib_Api_ApiCall;

const getGatewayInformationCall: Tests_Lib_Api_GetGatewayInformationCall = (api) => api.getGatewayInformation();

const getOrbSecurityButtonsCall: Tests_Lib_Api_GetOrbSecurityButtonsCall = (api) => api.getOrbSecurityButtons();

const getPanelInformationCall: Tests_Lib_Api_GetPanelInformationCall = (api) => api.getPanelInformation();

const getPanelStatusCall: Tests_Lib_Api_GetPanelStatusCall = (api) => api.getPanelStatus();

const getSensorsInformationCall: Tests_Lib_Api_GetSensorsInformationCall = (api) => api.getSensorsInformation();

const getSensorsStatusCall: Tests_Lib_Api_GetSensorsStatusCall = (api) => api.getSensorsStatus();

const performKeepAliveCall: Tests_Lib_Api_PerformKeepAliveCall = (api) => api.performKeepAlive();

const performSyncCheckCall: Tests_Lib_Api_PerformSyncCheckCall = (api) => api.performSyncCheck();

function createApi(options: Tests_Lib_Api_CreateApi_Options = {}): Tests_Lib_Api_CreateApi_Returns {
  const debug = options.debug ?? true;
  const config: Tests_Lib_Api_CreateApi_Config = {
    fingerprint: 'fixture-fingerprint',
    mode: 'normal',
    name: 'ADT Pulse',
    options: [],
    password: 'fixture-password',
    platform: 'ADTPulse',
    sensors: [],
    speed: options.speed ?? 1,
    subdomain: 'portal',
    username: 'fixture-user',
  };
  const internalConfig: Tests_Lib_Api_CreateApi_InternalConfig = {
    baseUrl: options.baseUrl ?? 'https://fixture.invalid',
    debug,
    logger: options.logger === undefined ? logger : options.logger,
    testMode: options.testMode!,
  };

  return new ADTPulseAPI(config, internalConfig);
}

function readyButton(armState: 'away' | 'disarmed' | 'night' | 'night+stay' | 'off' | 'stay', arm: 'away' | 'night' | 'off' | 'stay' = 'away') {
  return {
    buttonDisabled: false as const,
    buttonId: 'ready',
    buttonIndex: 0,
    buttonText: arm === 'off' ? 'Disarm' : `Arm ${arm}`,
    changeAccessCode: true,
    loadingText: arm === 'off' ? 'Disarming' : `Arming ${arm}`,
    relativeUrl: 'quickcontrol/armDisarm.jsp' as const,
    totalButtons: 1,
    urlParams: {
      arm,
      armState,
      href: 'rest/adt/ui/client/security/setArmState' as const,
      sat: 'fixture-sat',
    },
  };
}

function createHtmlResponse(data: string, path: string) {
  return {
    config: {
      headers: {
        Referer: 'https://fixture.invalid/referrer',
      },
      url: `https://fixture.invalid${path}`,
    },
    data,
    request: {
      path,
    },
    status: 200,
  };
}

function createForceArmHtml(options: { includeArmState?: boolean } = {}) {
  const forceArmUrl = options.includeArmState === false
    ? '/myhome/3.5.0/quickcontrol/serv/RunRRACommand.jsp?sat=fixture-sat&href=rest/adt/ui/client/security/cancelForceArm'
    : '/myhome/3.5.0/quickcontrol/serv/RunRRACommand.jsp?sat=fixture-sat&href=rest/adt/ui/client/security/setForceArm&armstate=away&arm=away';

  return [
    '<div class="p_whiteBoxMiddleCenter">',
    '<div class="p_armDisarmWrapper">',
    '<div>One or more sensors are open</div>',
    `<input onclick="doSubmit('${forceArmUrl}')">`,
    '</div>',
    '</div>',
  ].join('');
}

async function authenticateApi(signInData = '<a href="?networkid=1234567890"></a><a href="?sat=fixture-sat"></a>') {
  const api = createApi();

  httpMocks.get.mockResolvedValueOnce(createHtmlResponse(
    '',
    '/myhome/30.0.0-61/access/signin.jsp',
  ));
  httpMocks.post.mockResolvedValueOnce(createHtmlResponse(
    signInData,
    '/myhome/30.0.0-61/summary/summary.jsp',
  ));

  await api.login();

  return api;
}

describe('ADTPulseAPI', () => {
  beforeEach(() => {
    httpMocks.create.mockClear();
    httpMocks.get.mockReset();
    httpMocks.post.mockReset();
    utilityMocks.sleep.mockClear();
    utilityMocks.stackTracer.mockClear();

    for (const detector of Object.values(detectMocks)) {
      detector.mockReset();
      detector.mockResolvedValue(false);
    }

    for (const method of ['debug', 'error', 'info', 'log', 'success', 'warn'] as const) {
      vi.mocked(logger[method]).mockClear();
    }
  });

  it('starts unauthenticated and treats logout as an idempotent operation', async () => {
    const api = createApi();

    expect(api.isAuthenticated()).toBe(false);
    await expect(api.logout()).resolves.toEqual({
      action: 'LOGOUT',
      info: {
        backupSatCode: null,
        networkId: null,
        portalVersion: null,
      },
      success: true,
    });
    expect(httpMocks.get).not.toHaveBeenCalled();
  });

  it('logs in, reuses the authenticated session, and logs out cleanly', async () => {
    const api = createApi();
    const portalVersion = '30.0.0-61';
    const networkId = '1234567890';
    const backupSatCode = 'fixture-sat-code';

    httpMocks.get
      .mockResolvedValueOnce(createHtmlResponse(
        '',
        `/myhome/${portalVersion}/access/signin.jsp`,
      ))
      .mockResolvedValueOnce(createHtmlResponse(
        '',
        `/myhome/${portalVersion}/access/signin.jsp?networkid=${networkId}&partner=adt`,
      ));
    httpMocks.post.mockResolvedValueOnce(createHtmlResponse(
      `<a href='?networkid=${networkId}'></a><a href='?sat=${backupSatCode}'></a>`,
      `/myhome/${portalVersion}/summary/summary.jsp`,
    ));

    const login = await api.login();

    expect(login).toEqual({
      action: 'LOGIN',
      info: {
        backupSatCode,
        networkId,
        portalVersion,
      },
      success: true,
    });
    expect(api.isAuthenticated()).toBe(true);

    await expect(api.login()).resolves.toEqual(login);
    expect(httpMocks.post).toHaveBeenCalledOnce();

    await expect(api.logout()).resolves.toEqual({
      action: 'LOGOUT',
      info: {
        backupSatCode: null,
        networkId: null,
        portalVersion: null,
      },
      success: true,
    });
    expect(api.isAuthenticated()).toBe(false);
  });

  it('returns a typed login failure when the client omits request metadata', async () => {
    httpMocks.get.mockResolvedValueOnce({
      status: 200,
    });

    await expect(createApi().login()).resolves.toEqual({
      action: 'LOGIN',
      info: {
        message: 'The HTTP client responded without the "request" object',
      },
      success: false,
    });
  });

  it('rejects login homepage server errors and unexpected redirects', async () => {
    httpMocks.get.mockResolvedValueOnce({ status: 503 });

    await expect(createApi().login()).resolves.toMatchObject({
      info: { message: 'The remote server responded with a HTTP 503 status code' },
      success: false,
    });

    httpMocks.get.mockResolvedValueOnce(createHtmlResponse('', '/unexpected'));

    await expect(createApi().login()).resolves.toMatchObject({
      info: { message: '"/unexpected is not the sign-in page' },
      success: false,
    });
  });

  it.each([
    [
      { status: 200 },
      'The HTTP client responded without the "request" object',
    ],
    [
      createHtmlResponse('', '/unexpected'),
      '"/unexpected" is not the summary page',
    ],
    [
      {
        ...createHtmlResponse('', '/myhome/30.0.0-61/summary/summary.jsp'),
        data: { unexpected: true },
      },
      'The response body of the summary page is not of type "string"',
    ],
  ])('validates each sign-in response stage', async (signInResponse, message) => {
    httpMocks.get.mockResolvedValueOnce(createHtmlResponse(
      '',
      '/myhome/30.0.0-61/access/signin.jsp',
    ));
    httpMocks.post.mockResolvedValueOnce(signInResponse);

    await expect(createApi().login()).resolves.toMatchObject({
      info: { message },
      success: false,
    });
  });

  it('serializes a thrown login request and accepts a login without a backup sat token', async () => {
    httpMocks.get.mockRejectedValueOnce(new Error('login network failure'));

    await expect(createApi().login()).resolves.toMatchObject({
      info: { error: { message: 'login network failure' } },
      success: false,
    });

    const api = await authenticateApi('<a href="?networkid=1234567890"></a>');

    expect(api.isAuthenticated()).toBe(true);
    expect(logger.warn).toHaveBeenCalled();
  });

  it.each([
    [
      { status: 503 },
      'The remote server responded with a HTTP 503 status code',
    ],
    [
      { status: 200 },
      'The HTTP client responded without the "request" object',
    ],
    [
      createHtmlResponse('', '/unexpected'),
      '"/unexpected" is not the sign-in page with "networkid" and "partner=adt" parameters',
    ],
  ])('validates each sign-out response stage', async (signOutResponse, message) => {
    const api = await authenticateApi();
    httpMocks.get.mockResolvedValueOnce(signOutResponse);

    await expect(api.logout()).resolves.toMatchObject({
      info: { message },
      success: false,
    });
  });

  it('serializes a thrown sign-out request', async () => {
    const api = await authenticateApi();
    httpMocks.get.mockRejectedValueOnce(new Error('logout network failure'));

    await expect(api.logout()).resolves.toMatchObject({
      info: { error: { message: 'logout network failure' } },
      success: false,
    });
  });

  it('parses gateway information from a portal fixture', async () => {
    const fixtureUrl = new URL('../fixtures/gateway-information.html', import.meta.url);
    const fixture = await readFile(fixtureUrl, 'utf8');
    const path = '/myhome/3.5.0/system/gateway.jsp';

    httpMocks.get.mockResolvedValueOnce(createHtmlResponse(fixture, path));

    const response = await createApi().getGatewayInformation();

    expect(response).toEqual({
      action: 'GET_GATEWAY_INFORMATION',
      info: {
        communication: {
          broadbandConnectionStatus: 'Connected',
          cellularConnectionStatus: 'Connected',
          cellularSignalStrength: 'Good',
          primaryConnectionType: 'Broadband',
        },
        manufacturer: 'iControl',
        model: 'ADT Pulse Gateway iHub-3001',
        network: {
          broadband: {
            ip: '192.0.2.10',
            mac: '00:11:22:33:44:55',
          },
          device: {
            ip: '192.0.2.11',
            mac: '00:11:22:33:44:66',
          },
          router: {
            lanIp: '192.0.2.1',
            wanIp: '198.51.100.20',
          },
        },
        serialNumber: 'GW-12345',
        status: 'Online',
        update: {
          last: '07/15/2026 10:00 AM',
          next: '07/15/2026 10:05 AM',
        },
        versions: {
          firmware: '5.2.1',
          hardware: '3',
        },
      },
      success: true,
    });
  });

  it('parses panel status from a portal fixture', async () => {
    const fixtureUrl = new URL('../fixtures/panel-status.html', import.meta.url);
    const fixture = await readFile(fixtureUrl, 'utf8');
    const path = '/myhome/3.5.0/summary/summary.jsp';

    httpMocks.get.mockResolvedValueOnce(createHtmlResponse(fixture, path));

    const response = await createApi().getPanelStatus();

    expect(response).toEqual({
      action: 'GET_PANEL_STATUS',
      info: {
        panelNotes: [],
        panelStates: [
          'Disarmed',
        ],
        panelStatuses: [
          'All Quiet',
        ],
        rawData: {
          node: 'Disarmed. All Quiet.',
          unknownPieces: [],
        },
      },
      success: true,
    });
  });

  it('returns a typed failure for a portal server error', async () => {
    httpMocks.get.mockResolvedValueOnce({
      status: 503,
    });

    const response = await createApi().getGatewayInformation();

    expect(response).toEqual({
      action: 'GET_GATEWAY_INFORMATION',
      info: {
        message: 'The remote server responded with a HTTP 503 status code',
      },
      success: false,
    });
  });

  it.each([
    ['GET_PANEL_INFORMATION', 'get', getPanelInformationCall],
    ['GET_PANEL_STATUS', 'get', getPanelStatusCall],
    ['GET_SENSORS_INFORMATION', 'get', getSensorsInformationCall],
    ['GET_SENSORS_STATUS', 'get', getSensorsStatusCall],
    ['GET_ORB_SECURITY_BUTTONS', 'get', getOrbSecurityButtonsCall],
    ['PERFORM_SYNC_CHECK', 'get', performSyncCheckCall],
    ['PERFORM_KEEP_ALIVE', 'post', performKeepAliveCall],
  ] as const)('reports HTTP server failures from %s', async (action, transport, call) => {
    httpMocks[transport].mockResolvedValueOnce({ status: 503 });

    await expect(call(createApi())).resolves.toEqual({
      action,
      info: {
        message: 'The remote server responded with a HTTP 503 status code',
      },
      success: false,
    });
  });

  it.each([
    ['GET_GATEWAY_INFORMATION', 'get', getGatewayInformationCall],
    ['GET_PANEL_INFORMATION', 'get', getPanelInformationCall],
    ['GET_PANEL_STATUS', 'get', getPanelStatusCall],
    ['GET_SENSORS_INFORMATION', 'get', getSensorsInformationCall],
    ['GET_SENSORS_STATUS', 'get', getSensorsStatusCall],
    ['GET_ORB_SECURITY_BUTTONS', 'get', getOrbSecurityButtonsCall],
    ['PERFORM_SYNC_CHECK', 'get', performSyncCheckCall],
    ['PERFORM_KEEP_ALIVE', 'post', performKeepAliveCall],
  ] as const)('rejects a sign-in redirect from %s', async (action, transport, call) => {
    const path = '/myhome/3.5.0/access/signin.jsp';
    httpMocks[transport].mockResolvedValueOnce(createHtmlResponse(
      '<div id="warnMsgContents">Session <br> expired</div>',
      path,
    ));

    const response = await call(createApi());

    expect(response).toMatchObject({
      action,
      info: {
        message: expect.stringContaining(path),
      },
      success: false,
    });
    expect(logger.warn).toHaveBeenCalledWith(
      'DEBUG',
      'WARNING:',
      expect.stringContaining('Portal message'),
    );
  });

  it.each([
    ['GET_PANEL_INFORMATION', 'get', getPanelInformationCall],
    ['GET_PANEL_STATUS', 'get', getPanelStatusCall],
    ['GET_SENSORS_INFORMATION', 'get', getSensorsInformationCall],
    ['GET_SENSORS_STATUS', 'get', getSensorsStatusCall],
    ['GET_ORB_SECURITY_BUTTONS', 'get', getOrbSecurityButtonsCall],
    ['PERFORM_SYNC_CHECK', 'get', performSyncCheckCall],
    ['PERFORM_KEEP_ALIVE', 'post', performKeepAliveCall],
  ] as const)('serializes thrown transport errors from %s', async (action, transport, call) => {
    httpMocks[transport].mockRejectedValueOnce(new Error(`${action} network failure`));

    await expect(call(createApi())).resolves.toMatchObject({
      action,
      info: {
        error: {
          message: `${action} network failure`,
        },
      },
      success: false,
    });
  });

  it('reports MFA redirects and validates non-string sync-check responses', async () => {
    const mfaPath = '/myhome/3.5.0/mfa/mfaSignIn.jsp?workflow=challenge';
    httpMocks.get.mockResolvedValueOnce(createHtmlResponse('', mfaPath));

    await expect(createApi().getGatewayInformation()).resolves.toMatchObject({
      success: false,
    });
    expect(logger.error).toHaveBeenCalledWith(
      'DEBUG',
      'ERROR:',
      expect.stringContaining('fingerprint was revoked'),
    );

    httpMocks.get.mockResolvedValueOnce({
      ...createHtmlResponse('', '/myhome/3.5.0/Ajax/SyncCheckServ?t=1234567890'),
      data: { unexpected: true },
    });

    await expect(createApi().performSyncCheck()).resolves.toMatchObject({
      info: {
        message: 'The response body of the sync check page is not of type "string"',
      },
      success: false,
    });
  });

  it('uses an always-valid Axios status predicate and tolerates an unknown speed value', () => {
    createApi({
      debug: false,
      speed: 0.9 as 1,
    });
    const axiosCreateCalls = httpMocks.create.mock.calls as unknown as Array<[{
      validateStatus?: () => boolean;
    }]>;
    const axiosConfig = axiosCreateCalls.at(-1)?.[0];

    expect(axiosConfig?.validateStatus?.()).toBe(true);
  });

  it.each([
    ['GET_GATEWAY_INFORMATION', getGatewayInformationCall],
    ['GET_PANEL_INFORMATION', getPanelInformationCall],
    ['GET_PANEL_STATUS', getPanelStatusCall],
    ['GET_SENSORS_INFORMATION', getSensorsInformationCall],
    ['GET_SENSORS_STATUS', getSensorsStatusCall],
    ['GET_ORB_SECURITY_BUTTONS', getOrbSecurityButtonsCall],
    ['PERFORM_SYNC_CHECK', performSyncCheckCall],
  ] as const)('handles missing request metadata from %s', async (action, call) => {
    httpMocks.get.mockResolvedValueOnce({
      status: 200,
    });

    const response = await call(createApi());

    expect(response).toEqual({
      action,
      info: {
        message: 'The HTTP client responded without the "request" object',
      },
      success: false,
    });
  });

  it.each([
    [
      'GET_PANEL_INFORMATION',
      '/myhome/3.5.0/system/device.jsp?id=1',
      'system device id 1',
      getPanelInformationCall,
    ],
    [
      'GET_PANEL_STATUS',
      '/myhome/3.5.0/summary/summary.jsp',
      'summary',
      getPanelStatusCall,
    ],
    [
      'GET_SENSORS_INFORMATION',
      '/myhome/3.5.0/system/system.jsp',
      'system',
      getSensorsInformationCall,
    ],
    [
      'GET_SENSORS_STATUS',
      '/myhome/3.5.0/summary/summary.jsp',
      'summary',
      getSensorsStatusCall,
    ],
    [
      'GET_ORB_SECURITY_BUTTONS',
      '/myhome/3.5.0/summary/summary.jsp',
      'summary',
      getOrbSecurityButtonsCall,
    ],
  ] as const)('rejects non-HTML response data from %s', async (action, path, pageName, call) => {
    httpMocks.get.mockResolvedValueOnce({
      ...createHtmlResponse('', path),
      data: {
        unexpected: true,
      },
    });

    const response = await call(createApi());

    expect(response).toEqual({
      action,
      info: {
        message: `The response body of the ${pageName} page is not of type "string"`,
      },
      success: false,
    });
  });

  it('returns a typed failure when a portal request is redirected to sign-in', async () => {
    const path = '/myhome/3.5.0/access/signin.jsp?e=to&partner=adt';
    httpMocks.get.mockResolvedValueOnce(createHtmlResponse('', path));

    const response = await createApi().getSensorsStatus();

    expect(response).toEqual({
      action: 'GET_SENSORS_STATUS',
      info: {
        message: `"${path}" is not the summary page`,
      },
      success: false,
    });
  });

  it.each([
    [
      'GET_PANEL_INFORMATION',
      '/myhome/3.5.0/system/device.jsp?id=1',
      getPanelInformationCall,
    ],
    [
      'GET_SENSORS_INFORMATION',
      '/myhome/3.5.0/system/system.jsp',
      getSensorsInformationCall,
    ],
    [
      'GET_SENSORS_STATUS',
      '/myhome/3.5.0/summary/summary.jsp',
      getSensorsStatusCall,
    ],
    [
      'GET_ORB_SECURITY_BUTTONS',
      '/myhome/3.5.0/summary/summary.jsp',
      getOrbSecurityButtonsCall,
    ],
  ] as const)('accepts an empty but structurally valid page from %s', async (action, path, call) => {
    httpMocks.get.mockResolvedValueOnce(createHtmlResponse('<html><body></body></html>', path));

    const response = await call(createApi());

    expect(response).toMatchObject({
      action,
      success: true,
    });
  });

  it('validates and returns the portal sync code', async () => {
    httpMocks.get.mockResolvedValueOnce(createHtmlResponse(
      '2-1-0',
      '/myhome/3.5.0/Ajax/SyncCheckServ?t=1234567890',
    ));

    await expect(createApi().performSyncCheck()).resolves.toEqual({
      action: 'PERFORM_SYNC_CHECK',
      info: {
        syncCode: '2-1-0',
      },
      success: true,
    });
  });

  it('rejects a malformed portal sync code', async () => {
    httpMocks.get.mockResolvedValueOnce(createHtmlResponse(
      'not-a-sync-code',
      '/myhome/3.5.0/Ajax/SyncCheckServ?t=1234567890',
    ));

    await expect(createApi().performSyncCheck()).resolves.toEqual({
      action: 'PERFORM_SYNC_CHECK',
      info: {
        message: 'The sync code structure is invalid',
      },
      success: false,
    });
  });

  it('performs a keep-alive request and validates its final path', async () => {
    httpMocks.post.mockResolvedValueOnce(createHtmlResponse(
      '',
      '/myhome/3.5.0/KeepAlive',
    ));

    await expect(createApi().performKeepAlive()).resolves.toEqual({
      action: 'PERFORM_KEEP_ALIVE',
      info: null,
      success: true,
    });
  });

  it('handles keep-alive server errors', async () => {
    httpMocks.post.mockResolvedValueOnce({
      status: 502,
    });

    await expect(createApi().performKeepAlive()).resolves.toEqual({
      action: 'PERFORM_KEEP_ALIVE',
      info: {
        message: 'The remote server responded with a HTTP 502 status code',
      },
      success: false,
    });
  });

  it.each([
    ['away', 'away', false],
    ['night', 'night', false],
    ['stay', 'stay', false],
    ['off', 'off', false],
  ] as const)('short-circuits equivalent panel state %s', async (armFrom, armTo, isAlarmActive) => {
    await expect(createApi().setPanelStatus(armFrom, armTo, isAlarmActive)).resolves.toEqual({
      action: 'SET_PANEL_STATUS',
      info: {
        forceArmRequired: false,
      },
      success: true,
    });
    expect(httpMocks.get).not.toHaveBeenCalled();
  });

  it('validates panel state inputs at runtime', async () => {
    const api = createApi();

    await expect(api.setPanelStatus('invalid' as 'off', 'away', false)).resolves.toMatchObject({
      info: {
        message: '"invalid" is an invalid arm from state',
      },
      success: false,
    });
    await expect(api.setPanelStatus('off', 'invalid' as 'away', false)).resolves.toMatchObject({
      info: {
        message: '"invalid" is an invalid arm to state',
      },
      success: false,
    });
    await expect(api.setPanelStatus('off', 'away', null as unknown as boolean)).resolves.toMatchObject({
      info: {
        message: 'You must specify if the system\'s alarm is currently ringing (true) or not (false)',
      },
      success: false,
    });
  });

  it('propagates a missing-security-buttons failure while changing panel state', async () => {
    httpMocks.get.mockResolvedValueOnce(createHtmlResponse(
      '<html><body></body></html>',
      '/myhome/3.5.0/summary/summary.jsp',
    ));

    await expect(createApi().setPanelStatus('off', 'away', false)).resolves.toEqual({
      action: 'SET_PANEL_STATUS',
      info: {
        message: 'No security buttons were found and replacement failed because no backup sat code exists',
      },
      success: false,
    });
  });

  it.each([
    [1, 5000],
    [0.75, 6000],
    [0.5, 7000],
    [0.25, 8000],
  ] as const)('arms through the public API at %sx operational speed', async (speed, expectedWait) => {
    const api = createApi({ speed });
    vi.spyOn(api, 'getOrbSecurityButtons')
      .mockResolvedValueOnce({
        action: 'GET_ORB_SECURITY_BUTTONS',
        info: [readyButton('off', 'away')],
        success: true,
      } as never)
      .mockResolvedValueOnce({
        action: 'GET_ORB_SECURITY_BUTTONS',
        info: [readyButton('away', 'off')],
        success: true,
      } as never);
    httpMocks.post.mockResolvedValueOnce(createHtmlResponse(
      '<html><body></body></html>',
      '/myhome/3.5.0/quickcontrol/armDisarm.jsp',
    ));

    await expect(api.setPanelStatus('off', 'away', false)).resolves.toEqual({
      action: 'SET_PANEL_STATUS',
      info: {
        forceArmRequired: false,
      },
      success: true,
    });
    expect(utilityMocks.sleep).toHaveBeenCalledWith(expectedWait);
  });

  it('disarms an active alarm before applying the requested armed state', async () => {
    const api = createApi();
    vi.spyOn(api, 'getOrbSecurityButtons')
      .mockResolvedValueOnce({
        action: 'GET_ORB_SECURITY_BUTTONS',
        info: [readyButton('away', 'off')],
        success: true,
      } as never)
      .mockResolvedValueOnce({
        action: 'GET_ORB_SECURITY_BUTTONS',
        info: [readyButton('off', 'stay')],
        success: true,
      } as never)
      .mockResolvedValueOnce({
        action: 'GET_ORB_SECURITY_BUTTONS',
        info: [readyButton('stay', 'off')],
        success: true,
      } as never);
    httpMocks.post
      .mockResolvedValueOnce(createHtmlResponse(
        '<html><body></body></html>',
        '/myhome/3.5.0/quickcontrol/armDisarm.jsp',
      ))
      .mockResolvedValueOnce(createHtmlResponse(
        '<html><body></body></html>',
        '/myhome/3.5.0/quickcontrol/armDisarm.jsp',
      ));

    await expect(api.setPanelStatus('away', 'stay', true)).resolves.toEqual({
      action: 'SET_PANEL_STATUS',
      info: {
        forceArmRequired: false,
      },
      success: true,
    });
    expect(httpMocks.post).toHaveBeenCalledTimes(2);
    expect(utilityMocks.sleep).toHaveBeenCalledTimes(2);
  });

  it.each([
    [
      { status: 503 },
      'The remote server responded with a HTTP 503 status code',
    ],
    [
      { status: 200 },
      'The HTTP client responded without the "request" object',
    ],
    [
      createHtmlResponse('', '/unexpected'),
      '"/unexpected" is not the arm disarm page',
    ],
    [
      {
        ...createHtmlResponse('', '/myhome/3.5.0/quickcontrol/armDisarm.jsp'),
        data: { unexpected: true },
      },
      'The response body of the arm disarm page is not of type "string"',
    ],
  ])('reports arm/disarm request failures through setPanelStatus', async (response, message) => {
    const api = createApi();
    vi.spyOn(api, 'getOrbSecurityButtons').mockResolvedValueOnce({
      action: 'GET_ORB_SECURITY_BUTTONS',
      info: [readyButton('off', 'away')],
      success: true,
    } as never);
    httpMocks.post.mockResolvedValueOnce(response);

    await expect(api.setPanelStatus('off', 'away', false)).resolves.toMatchObject({
      action: 'SET_PANEL_STATUS',
      info: { message },
      success: false,
    });
  });

  it('force-arms when the portal presents an Arm Anyway action', async () => {
    const api = createApi();
    vi.spyOn(api, 'getOrbSecurityButtons')
      .mockResolvedValueOnce({
        action: 'GET_ORB_SECURITY_BUTTONS',
        info: [readyButton('off', 'away')],
        success: true,
      } as never)
      .mockResolvedValueOnce({
        action: 'GET_ORB_SECURITY_BUTTONS',
        info: [readyButton('away', 'off')],
        success: true,
      } as never);
    httpMocks.post
      .mockResolvedValueOnce(createHtmlResponse(
        createForceArmHtml(),
        '/myhome/3.5.0/quickcontrol/armDisarm.jsp',
      ))
      .mockResolvedValueOnce(createHtmlResponse(
        'Error: 1.0-OKAY',
        '/myhome/3.5.0/quickcontrol/serv/RunRRACommand',
      ));

    await expect(api.setPanelStatus('off', 'away', false)).resolves.toEqual({
      action: 'SET_PANEL_STATUS',
      info: {
        forceArmRequired: true,
      },
      success: true,
    });
    expect(httpMocks.post).toHaveBeenCalledTimes(2);
  });

  it.each([
    [
      { status: 503 },
      'The remote server responded with a HTTP 503 status code',
    ],
    [
      { status: 200 },
      'The HTTP client responded without the "request" object',
    ],
    [
      createHtmlResponse('', '/unexpected'),
      '"/unexpected" is not the run rra command page',
    ],
    [
      {
        ...createHtmlResponse('', '/myhome/3.5.0/quickcontrol/serv/RunRRACommand'),
        data: { unexpected: true },
      },
      'The response body of the run rra command page is not of type "string"',
    ],
    [
      createHtmlResponse('Method not allowed', '/myhome/3.5.0/quickcontrol/serv/RunRRACommand'),
      'The response body of the run rra command page does not include "1.0-OKAY"',
    ],
  ])('reports force-arm request failures through setPanelStatus', async (forceResponse, message) => {
    const api = createApi();
    vi.spyOn(api, 'getOrbSecurityButtons').mockResolvedValueOnce({
      action: 'GET_ORB_SECURITY_BUTTONS',
      info: [readyButton('off', 'away')],
      success: true,
    } as never);
    httpMocks.post
      .mockResolvedValueOnce(createHtmlResponse(
        createForceArmHtml(),
        '/myhome/3.5.0/quickcontrol/armDisarm.jsp',
      ))
      .mockResolvedValueOnce(forceResponse);

    await expect(api.setPanelStatus('off', 'away', false)).resolves.toMatchObject({
      action: 'SET_PANEL_STATUS',
      info: { message },
      success: false,
    });
  });

  it('rejects a force-arm page without an Arm Anyway action', async () => {
    const api = createApi();
    vi.spyOn(api, 'getOrbSecurityButtons').mockResolvedValueOnce({
      action: 'GET_ORB_SECURITY_BUTTONS',
      info: [readyButton('off', 'away')],
      success: true,
    } as never);
    httpMocks.post.mockResolvedValueOnce(createHtmlResponse(
      createForceArmHtml({ includeArmState: false }),
      '/myhome/3.5.0/quickcontrol/armDisarm.jsp',
    ));

    await expect(api.setPanelStatus('off', 'away', false)).resolves.toMatchObject({
      info: {
        message: 'Force arming failed because the "Arm Anyway" button was not found',
      },
      success: false,
    });
  });

  it('enforces both test-mode safety checks', async () => {
    const armedApi = createApi({
      testMode: {
        enabled: true,
        isSystemDisarmedBeforeTest: false,
      },
    });
    vi.spyOn(armedApi, 'getOrbSecurityButtons').mockResolvedValueOnce({
      action: 'GET_ORB_SECURITY_BUTTONS',
      info: [readyButton('away', 'off')],
      success: true,
    } as never);

    await expect(armedApi.setPanelStatus('away', 'off', false)).resolves.toMatchObject({
      info: {
        message: 'Test mode is active and system is not disarmed',
      },
      success: false,
    });

    const noOpenSensorsApi = createApi({
      testMode: {
        enabled: true,
        isSystemDisarmedBeforeTest: false,
      },
    });
    vi.spyOn(noOpenSensorsApi, 'getOrbSecurityButtons').mockResolvedValueOnce({
      action: 'GET_ORB_SECURITY_BUTTONS',
      info: [readyButton('off', 'away')],
      success: true,
    } as never);
    httpMocks.post.mockResolvedValueOnce(createHtmlResponse(
      '<html><body></body></html>',
      '/myhome/3.5.0/quickcontrol/armDisarm.jsp',
    ));

    await expect(noOpenSensorsApi.setPanelStatus('off', 'away', false)).resolves.toMatchObject({
      info: {
        message: 'Test mode is active but no doors or windows were open',
      },
      success: false,
    });
  });

  it('propagates security-button refresh errors from both state-change stages', async () => {
    const initialApi = createApi();
    vi.spyOn(initialApi, 'getOrbSecurityButtons').mockResolvedValueOnce({
      action: 'GET_ORB_SECURITY_BUTTONS',
      info: { message: 'initial lookup failed' },
      success: false,
    } as never);

    await expect(initialApi.setPanelStatus('off', 'away', false)).resolves.toMatchObject({
      info: { message: 'initial lookup failed' },
      success: false,
    });

    const refreshApi = createApi();
    vi.spyOn(refreshApi, 'getOrbSecurityButtons')
      .mockResolvedValueOnce({
        action: 'GET_ORB_SECURITY_BUTTONS',
        info: [readyButton('off', 'away')],
        success: true,
      } as never)
      .mockResolvedValueOnce({
        action: 'GET_ORB_SECURITY_BUTTONS',
        info: { message: 'refresh failed' },
        success: false,
      } as never);
    httpMocks.post.mockResolvedValueOnce(createHtmlResponse(
      '<html><body></body></html>',
      '/myhome/3.5.0/quickcontrol/armDisarm.jsp',
    ));

    await expect(refreshApi.setPanelStatus('off', 'away', false)).resolves.toMatchObject({
      info: { message: 'refresh failed' },
      success: false,
    });
  });

  it('deduplicates newly detected portal information by content hash', async () => {
    const fixtureUrl = new URL('../fixtures/gateway-information.html', import.meta.url);
    const fixture = await readFile(fixtureUrl, 'utf8');
    const response = createHtmlResponse(fixture, '/myhome/3.5.0/system/gateway.jsp');
    const api = createApi();
    detectMocks.detectApiGatewayInformation.mockResolvedValue(true);
    httpMocks.get.mockResolvedValue(response);

    await api.getGatewayInformation();
    await api.getGatewayInformation();

    expect(detectMocks.detectApiGatewayInformation).toHaveBeenCalledOnce();
  });

  it('serializes thrown HTTP client errors', async () => {
    httpMocks.get.mockRejectedValueOnce(new Error('fixture network failure'));

    const response = await createApi().getGatewayInformation();

    expect(response).toMatchObject({
      action: 'GET_GATEWAY_INFORMATION',
      info: {
        error: {
          message: 'fixture network failure',
          name: 'Error',
        },
      },
      success: false,
    });
  });
});
