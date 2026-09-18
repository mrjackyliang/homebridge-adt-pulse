import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ADTPulseAuth } from '../../lib/auth.js';

const httpMocks = vi.hoisted(() => ({
  create: vi.fn(() => ({})),
  get: vi.fn(),
  post: vi.fn(),
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

vi.mock('../../lib/detect.js', () => ({
  detectGlobalDebugParser: vi.fn().mockResolvedValue(false),
  detectGlobalPortalVersion: vi.fn().mockResolvedValue(false),
}));

afterEach(() => {
  vi.unstubAllGlobals();
});

function createAuth() {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Release feed unavailable in portal tests')));

  return new ADTPulseAuth({
    password: 'fixture-password',
    subdomain: 'portal',
    username: 'fixture-user',
  }, {
    baseUrl: 'https://fixture.invalid',
    debug: false,
    logger: null,
  });
}

function queueVerificationMethods() {
  httpMocks.get.mockResolvedValueOnce({
    data: '',
    request: {
      path: '/myhome/30.0.0-61/access/signin.jsp',
    },
    status: 200,
  });
  httpMocks.post.mockResolvedValueOnce({
    data: [
      "xClientType: 'browser',",
      "locale: 'en_US',",
      "xLogin: 'fixture-user',",
      "xPreAuthToken: 'fixture-token',",
      "sat: 'fixture-sat',",
    ].join('\n'),
    request: {
      path: '/myhome/30.0.0-61/mfa/mfaSignIn.jsp?workflow=challenge',
    },
    status: 200,
  });
  httpMocks.get.mockResolvedValueOnce({
    data: {
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
        numTrustedDevices: 0,
        trustedDevices: [],
      },
    },
    request: {
      path: '/myhome/30.0.0-61/nga/serv/RunRRAProxy?href=rest/icontrol/ui/client/multiFactorAuth&sat=fixture-sat',
    },
    status: 200,
  });
}

describe('ADTPulseAuth HTTP error responses', () => {
  beforeEach(() => {
    httpMocks.create.mockClear();
    httpMocks.get.mockReset();
    httpMocks.post.mockReset();
  });

  it('does not change a fingerprint after it has been read', async () => {
    queueVerificationMethods();

    const auth = createAuth();
    const fingerprint = auth.getFingerprint();

    expect((await auth.getVerificationMethods()).success).toBe(true);
    expect(auth.getFingerprint()).toBe(fingerprint);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects an HTTP error when requesting a verification code', async () => {
    queueVerificationMethods();

    const auth = createAuth();

    expect((await auth.getVerificationMethods()).success).toBe(true);

    httpMocks.post.mockResolvedValueOnce({ status: 429 });

    expect(await auth.requestCode('sms-1')).toEqual({
      action: 'REQUEST_CODE',
      success: false,
      info: {
        message: 'The remote server responded with a HTTP 429 status code',
      },
    });
  });

  it('rejects an HTTP error when validating a verification code', async () => {
    httpMocks.post.mockResolvedValueOnce({ status: 500 });

    expect(await createAuth().validateCode('123456')).toEqual({
      action: 'VALIDATE_CODE',
      success: false,
      info: {
        message: 'The remote server responded with a HTTP 500 status code',
      },
    });
  });

  it('rejects an HTTP error when retrieving trusted devices', async () => {
    httpMocks.get.mockResolvedValueOnce({ status: 503 });

    expect(await createAuth().getTrustedDevices()).toEqual({
      action: 'GET_TRUSTED_DEVICES',
      success: false,
      info: {
        message: 'The remote server responded with a HTTP 503 status code',
      },
    });
  });

  it('rejects an HTTP error when adding a trusted device', async () => {
    httpMocks.post.mockResolvedValueOnce({ status: 400 });

    expect(await createAuth().addTrustedDevice('Homebridge')).toEqual({
      action: 'ADD_TRUSTED_DEVICE',
      success: false,
      info: {
        message: 'The remote server responded with a HTTP 400 status code',
      },
    });
  });
});
