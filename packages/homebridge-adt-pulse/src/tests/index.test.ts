import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import initialize from '../index.js';
import { ADTPulsePlatform } from '../lib/platform.js';

import type { Index_Initialize_Api } from '../types/index.d.ts';

describe('initialize', () => {
  it('registers the ADT Pulse platform with Homebridge', () => {
    const registerPlatform = vi.fn();
    const api = {
      registerPlatform,
    } as unknown as Index_Initialize_Api;

    initialize(api);

    expect(registerPlatform).toHaveBeenCalledOnce();
    expect(registerPlatform).toHaveBeenCalledWith('ADTPulse', ADTPulsePlatform);
  });
});
