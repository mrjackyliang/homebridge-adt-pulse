import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  readPackagedIdentity,
  readSourceIdentity,
  resolveCliIdentity,
} from '../../cli/identity.js';

describe('CLI identity', () => {
  it('reads current identity from the source repository', () => {
    const identity = readSourceIdentity();

    expect(resolveCliIdentity()).toEqual(identity);
    expect(identity['repository']).toBe('https://github.com/mrjackyliang/homebridge-adt-pulse');
    expect(identity['copyright']).toContain('Jacky Liang');
  });

  it('reads the packaged identity without consulting Nova config', () => {
    const snapshotUrl = new URL('../fixtures/cli-identity.json', import.meta.url);

    expect(readPackagedIdentity(snapshotUrl)).toEqual({
      repository: 'https://example.test/homebridge-adt-pulse',
      copyright: 'Copyright © 2026 Example Author. Released under MIT.',
    });
  });
});
