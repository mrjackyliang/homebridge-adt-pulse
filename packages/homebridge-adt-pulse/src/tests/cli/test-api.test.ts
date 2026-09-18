import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { CLIHeader } from '@cbnventures/nova/toolkit';

const testMocks = vi.hoisted(() => ({
  exit: vi.fn(),
  login: vi.fn().mockResolvedValue({ action: 'LOGIN' }),
  other: vi.fn().mockResolvedValue({ success: true }),
  question: vi.fn(),
}));

vi.mock('node:fs', async (importOriginal) => ({
  ...await importOriginal<typeof import('node:fs')>(),
  readFileSync: vi.fn(() => JSON.stringify({
    platforms: [{
      fingerprint: 'fixture-fingerprint',
      mode: 'normal',
      name: 'ADT Pulse',
      password: 'fixture-password',
      platform: 'ADTPulse',
      sensors: [],
      speed: 1,
      subdomain: 'portal',
      username: 'fixture-user',
    }],
  })),
}));

vi.mock('node:process', async (importOriginal) => ({
  ...await importOriginal<typeof import('node:process')>(),
  exit: testMocks.exit,
}));

vi.mock('node:readline', () => ({
  default: {
    createInterface: vi.fn(() => ({
      question: (prompt: string, callback: (answer: string) => void) => {
        testMocks.question(prompt);
        callback('I Agree');
      },
    })),
  },
}));

vi.mock('../../lib/api.js', () => ({
  ADTPulseAPI: function MockApi() {
    return {
      login: testMocks.login,
      getGatewayInformation: testMocks.other,
      getPanelInformation: testMocks.other,
      getPanelStatus: testMocks.other,
      setPanelStatus: testMocks.other,
      getSensorsInformation: testMocks.other,
      getSensorsStatus: testMocks.other,
      getOrbSecurityButtons: testMocks.other,
      performSyncCheck: testMocks.other,
      performKeepAlive: testMocks.other,
      logout: testMocks.other,
    };
  },
}));

vi.mock('../../cli/identity.js', () => ({
  resolveCliIdentity: vi.fn(() => ({
    repository: 'https://example.test/homebridge-adt-pulse',
    copyright: 'Copyright © 2026 Example Author. Released under MIT.',
  })),
}));

describe('API tester', () => {
  it('fails closed when an API response omits success', async () => {
    const header = vi.spyOn(CLIHeader, 'render');
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    testMocks.exit.mockImplementationOnce(() => {
      throw new Error('Expected process exit');
    });

    await import('../../cli/test-api.js');
    await vi.waitFor(() => expect(testMocks.exit).toHaveBeenCalledWith(1));

    expect(testMocks.login).toHaveBeenCalledOnce();
    expect(testMocks.other).not.toHaveBeenCalled();
    expect(testMocks.question).toHaveBeenCalledWith(expect.stringContaining('\n\nBefore you begin, please make sure of the following:'));
    expect(header).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.stringContaining('ADT Pulse for Homebridge Plugin Test'),
        expect.stringContaining('https://example.test/homebridge-adt-pulse'),
        expect.stringContaining('Example Author'),
      ]),
      expect.objectContaining({ width: 72 }),
    );
  });
});
