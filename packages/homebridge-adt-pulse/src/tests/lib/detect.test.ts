import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

const detectorMocks = vi.hoisted(() => ({
  isPluginOutdated: vi.fn(),
  post: vi.fn(),
  stackTracer: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    post: detectorMocks.post,
  },
}));

vi.mock('../../lib/utility.js', async (importOriginal) => ({
  ...await importOriginal<typeof import('../../lib/utility.js')>(),
  isPluginOutdated: detectorMocks.isPluginOutdated,
  stackTracer: detectorMocks.stackTracer,
}));

import {
  detectApiDoSubmitHandlers,
  detectApiGatewayInformation,
  detectApiOrbSecurityButtons,
  detectApiPanelInformation,
  detectApiPanelStatus,
  detectApiSensorsInformation,
  detectApiSensorsStatus,
  detectGlobalDebugParser,
  detectGlobalPortalVersion,
  detectPlatformUnknownSensorsAction,
} from '../../lib/detect.js';

import type { Logger } from 'homebridge';

const loggerMethods = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  log: vi.fn(),
  success: vi.fn(),
  warn: vi.fn(),
};
const detectLogger = loggerMethods as unknown as Logger;

const knownDetections = [
  ['do submit handlers', () => detectApiDoSubmitHandlers([], null, false)],
  ['gateway information', () => detectApiGatewayInformation({
    status: 'Online',
  } as unknown as Parameters<typeof detectApiGatewayInformation>[0], null, false)],
  ['orb security buttons', () => detectApiOrbSecurityButtons([], null, false)],
  ['panel information', () => detectApiPanelInformation({
    status: 'Online',
  } as unknown as Parameters<typeof detectApiPanelInformation>[0], null, false)],
  ['panel status', () => detectApiPanelStatus({
    rawData: {
      unknownPieces: [],
    },
  } as unknown as Parameters<typeof detectApiPanelStatus>[0], null, false)],
  ['sensors information', () => detectApiSensorsInformation([{
    deviceType: 'Door/Window Sensor',
    status: 'Online',
  }] as unknown as Parameters<typeof detectApiSensorsInformation>[0], null, false)],
  ['sensors status', () => detectApiSensorsStatus([{
    icon: 'devStatOK',
    statuses: ['Closed'],
  }] as unknown as Parameters<typeof detectApiSensorsStatus>[0], null, false)],
  ['debug parser', () => detectGlobalDebugParser({
    method: 'getSensorsStatus',
    rawHtml: '<div id="orbSensorsList"></div>',
    response: [],
  } as unknown as Parameters<typeof detectGlobalDebugParser>[0], null, false)],
  ['portal version', () => detectGlobalPortalVersion({
    version: '30.0.0-61',
  }, null, false)],
  ['sensor actions', () => detectPlatformUnknownSensorsAction([{
    status: {
      statuses: ['Closed'],
    },
    type: 'doorWindow',
  }] as unknown as Parameters<typeof detectPlatformUnknownSensorsAction>[0], null, false)],
] as const;

const unknownDetections = [
  ['do submit handlers', (logger: Logger | null = null, debugMode = false) => detectApiDoSubmitHandlers([{
    relativeUrl: 'fixture/unknown.jsp',
    urlParams: {
      arm: null,
      armState: null,
      href: 'fixture/unknown',
      sat: 'fixture-sat',
    },
  }] as unknown as Parameters<typeof detectApiDoSubmitHandlers>[0], logger, debugMode)],
  ['gateway information', (logger: Logger | null = null, debugMode = false) => detectApiGatewayInformation({
    status: 'Unexpected Gateway State',
  } as unknown as Parameters<typeof detectApiGatewayInformation>[0], logger, debugMode)],
  ['orb security buttons', (logger: Logger | null = null, debugMode = false) => detectApiOrbSecurityButtons([{
    buttonDisabled: true,
    buttonText: 'Unexpected Button',
  }] as unknown as Parameters<typeof detectApiOrbSecurityButtons>[0], logger, debugMode)],
  ['panel information', (logger: Logger | null = null, debugMode = false) => detectApiPanelInformation({
    status: 'Unexpected Panel State',
  } as unknown as Parameters<typeof detectApiPanelInformation>[0], logger, debugMode)],
  ['panel status', (logger: Logger | null = null, debugMode = false) => detectApiPanelStatus({
    rawData: {
      unknownPieces: ['Unexpected Status'],
    },
  } as unknown as Parameters<typeof detectApiPanelStatus>[0], logger, debugMode)],
  ['sensors information', (logger: Logger | null = null, debugMode = false) => detectApiSensorsInformation([{
    deviceType: 'Unexpected Sensor',
    status: 'Online',
  }] as unknown as Parameters<typeof detectApiSensorsInformation>[0], logger, debugMode)],
  ['sensors status', (logger: Logger | null = null, debugMode = false) => detectApiSensorsStatus([{
    icon: 'devStatUnexpected',
    statuses: ['Unexpected Status'],
  }] as unknown as Parameters<typeof detectApiSensorsStatus>[0], logger, debugMode)],
  ['debug parser', (logger: Logger | null = null, debugMode = false) => detectGlobalDebugParser({
    method: 'getSensorsInformation',
    rawHtml: '<html></html>',
    response: [],
  } as unknown as Parameters<typeof detectGlobalDebugParser>[0], logger, debugMode)],
  ['portal version', (logger: Logger | null = null, debugMode = false) => detectGlobalPortalVersion({
    version: '99.0.0-1',
  } as unknown as Parameters<typeof detectGlobalPortalVersion>[0], logger, debugMode)],
  ['sensor actions', (logger: Logger | null = null, debugMode = false) => detectPlatformUnknownSensorsAction([{
    info: {
      name: 'Front Door',
      zone: 1,
    },
    status: {
      name: 'Front Door',
      statuses: ['Okay'],
      zone: 1,
    },
    type: 'doorWindow',
  }] as unknown as Parameters<typeof detectPlatformUnknownSensorsAction>[0], logger, debugMode)],
] as const;

describe('detect', () => {
  beforeEach(() => {
    detectorMocks.isPluginOutdated.mockReset();
    detectorMocks.isPluginOutdated.mockResolvedValue(false);
    detectorMocks.post.mockReset();
    detectorMocks.post.mockResolvedValue({
      status: 204,
    });
    detectorMocks.stackTracer.mockReset();
    Object.values(loggerMethods).forEach((method) => method.mockReset());
  });

  it.each(knownDetections)('does not report documented %s', async (_label, detect) => {
    await expect(detect()).resolves.toBe(false);
    expect(detectorMocks.isPluginOutdated).not.toHaveBeenCalled();
    expect(detectorMocks.post).not.toHaveBeenCalled();
  });

  it.each(unknownDetections)('reports undocumented %s', async (_label, detect) => {
    await expect(detect(detectLogger, true)).resolves.toBe(true);
    expect(detectorMocks.isPluginOutdated).toHaveBeenCalledOnce();
    expect(detectorMocks.post).toHaveBeenCalledOnce();
    expect(detectorMocks.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'User-Agent': 'homebridge-adt-pulse',
        }),
      }),
    );
    expect(loggerMethods.warn).toHaveBeenCalled();
  });

  it.each(unknownDetections)('suppresses undocumented %s when the plugin is outdated', async (_label, detect) => {
    detectorMocks.isPluginOutdated.mockResolvedValueOnce(true);

    await expect(detect(detectLogger, true)).resolves.toBe(false);

    expect(loggerMethods.warn).toHaveBeenCalledWith(expect.stringContaining('older plugin version'));
    expect(detectorMocks.post).not.toHaveBeenCalled();
  });

  it.each(unknownDetections)('retries undocumented %s after a version-check failure', async (_label, detect) => {
    detectorMocks.isPluginOutdated.mockRejectedValueOnce(new Error('registry unavailable'));

    await expect(detect(detectLogger, true)).resolves.toBe(false);

    expect(detectorMocks.post).not.toHaveBeenCalled();
    expect(detectorMocks.stackTracer).toHaveBeenCalledWith(
      'serialize-error',
      expect.objectContaining({ message: 'registry unavailable' }),
    );
  });

  it.each(unknownDetections)('retries undocumented %s after a report-delivery failure', async (_label, detect) => {
    detectorMocks.post.mockRejectedValueOnce(new Error('report endpoint unavailable'));

    await expect(detect(detectLogger, true)).resolves.toBe(false);

    expect(detectorMocks.stackTracer).toHaveBeenCalledWith(
      'serialize-error',
      expect.objectContaining({ message: 'report endpoint unavailable' }),
    );
  });

  it('suppresses reports when the installed plugin is outdated', async () => {
    const loggerMethods = {
      warn: vi.fn(),
    };
    const logger = loggerMethods as unknown as Parameters<typeof detectGlobalPortalVersion>[1];
    detectorMocks.isPluginOutdated.mockResolvedValueOnce(true);

    await expect(detectGlobalPortalVersion({
      version: '99.0.0-1',
    } as unknown as Parameters<typeof detectGlobalPortalVersion>[0], logger, false)).resolves.toBe(false);

    expect(loggerMethods.warn).toHaveBeenCalledWith(expect.stringContaining('older plugin version'));
    expect(detectorMocks.post).not.toHaveBeenCalled();
  });

  it('retries later when the version check fails', async () => {
    detectorMocks.isPluginOutdated.mockRejectedValueOnce(new Error('registry unavailable'));

    await expect(detectGlobalPortalVersion({
      version: '99.0.0-1',
    } as unknown as Parameters<typeof detectGlobalPortalVersion>[0], null, true)).resolves.toBe(false);

    expect(detectorMocks.post).not.toHaveBeenCalled();
    expect(detectorMocks.stackTracer).toHaveBeenCalledWith(
      'serialize-error',
      expect.objectContaining({
        message: 'registry unavailable',
      }),
    );
  });

  it('retries later when report delivery fails', async () => {
    detectorMocks.post.mockRejectedValueOnce(new Error('report endpoint unavailable'));

    await expect(detectGlobalPortalVersion({
      version: '99.0.0-1',
    } as unknown as Parameters<typeof detectGlobalPortalVersion>[0], null, true)).resolves.toBe(false);

    expect(detectorMocks.stackTracer).toHaveBeenCalledWith(
      'serialize-error',
      expect.objectContaining({
        message: 'report endpoint unavailable',
      }),
    );
  });
});
