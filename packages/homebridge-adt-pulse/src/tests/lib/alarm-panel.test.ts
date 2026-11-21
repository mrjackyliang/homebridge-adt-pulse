import { describe, expect, it } from 'vitest';

import { createAlarmPanel } from '../../lib/alarm-panel.js';
import { ADTPulseAPI } from '../../lib/api.js';

describe('alarm panel factory', () => {
  it('builds the portal driver behind the alarm panel contract', () => {
    const panel = createAlarmPanel({
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
    }, {
      baseUrl: 'https://fixture.invalid',
      debug: false,
      logger: null,
    });

    expect(panel).toBeInstanceOf(ADTPulseAPI);
    expect(panel.isAuthenticated()).toBe(false);
  });
});
