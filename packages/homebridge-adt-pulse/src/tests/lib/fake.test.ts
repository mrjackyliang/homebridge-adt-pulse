import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  generateFakeDynatracePCHeaderValue,
  generateFakeFingerprintFonts,
  generateFakeFingerprintPlugins,
  generateFakeFingerprintScreenResolution,
  generateFakeFingerprintTimezone,
  generateFakeFingerprintUserAgent,
  generateFakeLoginFingerprint,
  generateFakeReadyButtons,
  getFingerprintRequestHeaders,
} from '../../lib/fake.js';

describe('fingerprint generators', () => {
  it.each([
    'force-arm',
    'keep-alive',
  ] as const)('generates a Dynatrace header in %s mode', (mode) => {
    const header = generateFakeDynatracePCHeaderValue(mode);

    expect(header).toMatch(/^[13567]\$[0-9]{8,9}_[0-9]{3}h[0-9]{1,2}v[A-W]{32}-0e0$/);
  });

  it('generates a sorted, non-empty font collection', () => {
    const fonts = generateFakeFingerprintFonts();

    expect(fonts.length).toBeGreaterThanOrEqual(28);
    expect(fonts).toContain('Segoe UI');
    expect(fonts).toEqual([...fonts].sort());
    expect(new Set(fonts).size).toBe(fonts.length);
  });

  it('generates a sorted browser plugin collection', () => {
    const plugins = generateFakeFingerprintPlugins();

    expect(plugins.length).toBeGreaterThanOrEqual(1);
    expect(plugins.length).toBeLessThanOrEqual(6);
    expect(plugins).toEqual([...plugins].sort());
    expect(plugins).toEqual(['PDF Viewer.application/pdf::pdf']);
  });

  it('generates a positive screen resolution', () => {
    const resolution = generateFakeFingerprintScreenResolution();

    expect(resolution.width).toBeGreaterThan(0);
    expect(resolution.height).toBeGreaterThan(0);
    expect(resolution.width).toBeGreaterThanOrEqual(1280);
    expect(resolution.width).toBeGreaterThanOrEqual(resolution.height);
  });

  it('generates a valid timezone and offset pair', () => {
    const timezone = generateFakeFingerprintTimezone();

    expect(timezone.timezone.length).toBeGreaterThan(0);
    expect(Number.isFinite(timezone.timezoneOffset)).toBe(true);
  });

  it('generates a coherent parsed user-agent shape', () => {
    const userAgent = generateFakeFingerprintUserAgent();

    expect(userAgent.ua.length).toBeGreaterThan(0);
    expect(userAgent.browser).toHaveProperty('name');
    expect(userAgent.cpu).toHaveProperty('architecture');
    expect(userAgent.device).toHaveProperty('model');
    expect(userAgent.engine).toHaveProperty('name');
    expect(userAgent.os).toHaveProperty('name');
  });

  it('encodes a complete login fingerprint as base64 JSON', () => {
    const encoded = generateFakeLoginFingerprint();
    const decoded = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));

    expect(decoded).toHaveProperty('fingerprint');
    expect(decoded.fingerprint.language).toBe('en-US');
    expect(decoded.fingerprint.colorDepth).toBe(24);
    expect(decoded.fingerprint.cookieSupport).toBe(true);
    expect(decoded.fingerprint.screenResolution).toMatch(/^[0-9]+x[0-9]+$/);
    expect(decoded.fingerprint.availableScreenResolution).toBe(
      decoded.fingerprint.screenResolution,
    );
  });

  it.each([
    [{ browser: 'chrome', version: '153.0.8010.47' }, 'Google Chrome', '153'],
    [{ browser: 'edge', version: '153.0.4234.32' }, 'Microsoft Edge', '153'],
    [{ browser: 'opera', version: '136.0.6008.22', chromiumVersion: '152.0.7977.120' }, 'Opera', '152'],
  ] as const)('keeps %s fingerprint and Chromium headers together', (release, brand, chromiumMajor) => {
    const fingerprint = generateFakeLoginFingerprint(release);
    const decoded = JSON.parse(Buffer.from(fingerprint, 'base64').toString('utf8'));
    const headers = getFingerprintRequestHeaders(fingerprint);

    expect(headers['User-Agent']).toBe(decoded.fingerprint.uaString);
    expect(headers['sec-ch-ua']).toContain(brand);
    expect(headers['sec-ch-ua']).toContain(`"Chromium";v="${chromiumMajor}"`);
    expect(headers['sec-ch-ua-platform']).toBe('"Windows"');
  });

  it('does not send Chromium client hints for Firefox', () => {
    const fingerprint = generateFakeLoginFingerprint({ browser: 'firefox', version: '156.0' });
    const headers = getFingerprintRequestHeaders(fingerprint);

    expect(headers['User-Agent']).toContain('Firefox/156.0');
    expect(headers).not.toHaveProperty('sec-ch-ua');
  });

  it('keeps an existing configured browser identity unchanged', () => {
    const fingerprint = Buffer.from(JSON.stringify({
      fingerprint: {
        uaString: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        uaBrowser: { name: 'Chrome', major: '126' },
        uaPlatform: 'MacIntel',
      },
    })).toString('base64');
    const headers = getFingerprintRequestHeaders(fingerprint);

    expect(headers['User-Agent']).toContain('Chrome/126.0.0.0');
    expect(headers['sec-ch-ua-platform']).toBe('"macOS"');
  });
});

describe('generateFakeReadyButtons', () => {
  const options = {
    href: 'rest/adt/ui/client/security/setArmState',
    relativeUrl: 'quickcontrol/armDisarm.jsp',
    sat: 'fixture-sat',
  } as Parameters<typeof generateFakeReadyButtons>[2];

  it('turns a disarming placeholder into away and stay actions', () => {
    const buttons = [{
      buttonDisabled: true,
      buttonId: 'security_button_0',
      buttonText: 'Disarming',
    }] as Parameters<typeof generateFakeReadyButtons>[0];

    const readyButtons = generateFakeReadyButtons(buttons, true, options);

    expect(readyButtons).toHaveLength(2);
    expect(readyButtons.map((button) => button.buttonText)).toEqual([
      'Arm Away',
      'Arm Stay',
    ]);
    expect(readyButtons.map((button) => (
      ('urlParams' in button) ? button.urlParams.armState : undefined
    ))).toEqual([
      'off',
      'off',
    ]);
  });

  it('uses the dirty disarmed state for predicted arm actions', () => {
    const buttons = [{
      buttonDisabled: true,
      buttonId: 'security_button_0',
      buttonText: 'Disarming',
    }] as Parameters<typeof generateFakeReadyButtons>[0];

    const readyButtons = generateFakeReadyButtons(buttons, false, options);

    expect(readyButtons.every((button) => (
      'urlParams' in button && button.urlParams.armState === 'disarmed'
    ))).toBe(true);
  });

  it.each([
    ['Arming Away', 'away'],
    ['Arming Night', 'night+stay'],
    ['Arming Stay', 'stay'],
  ] as const)('turns %s into a disarm action', (buttonText, armState) => {
    const buttons = [{
      buttonDisabled: true,
      buttonId: 'security_button_0',
      buttonText,
    }] as Parameters<typeof generateFakeReadyButtons>[0];

    const readyButtons = generateFakeReadyButtons(buttons, false, options);

    expect(readyButtons).toHaveLength(1);
    expect(readyButtons[0]).toMatchObject({
      buttonDisabled: false,
      buttonText: 'Disarm',
      urlParams: {
        arm: 'off',
        armState,
      },
    });
  });

  it('preserves buttons that are already ready', () => {
    const button = {
      buttonDisabled: false,
      buttonId: 'security_button_0',
      buttonIndex: 0,
      buttonText: 'Arm Away',
      changeAccessCode: false,
      loadingText: 'Arming Away',
      relativeUrl: options.relativeUrl,
      totalButtons: 1,
      urlParams: {
        arm: 'away',
        armState: 'off',
        href: options.href,
        sat: options.sat,
      },
    } as Parameters<typeof generateFakeReadyButtons>[0][number];

    expect(generateFakeReadyButtons([button], true, options)).toEqual([button]);
  });

  it('ignores unknown pending button text', () => {
    const buttons = [{
      buttonDisabled: true,
      buttonId: 'security_button_0',
      buttonText: 'Unknown',
    }] as unknown as Parameters<typeof generateFakeReadyButtons>[0];

    expect(generateFakeReadyButtons(buttons, true, options)).toEqual([]);
  });
});
