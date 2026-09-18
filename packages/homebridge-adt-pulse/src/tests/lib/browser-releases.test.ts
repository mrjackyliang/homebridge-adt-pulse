import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  fetchBrowserSnapshot,
  fetchStableBrowserRelease,
  readPackagedBrowserSnapshot,
  resolveBrowserRelease,
} from '../../lib/browser-releases.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockReleaseFeeds() {
  const responses = new Map([
    ['last-known-good-versions.json', JSON.stringify({ channels: { Stable: { version: '153.0.8010.47' } } })],
    ['firefox_versions.json', JSON.stringify({ LATEST_FIREFOX_VERSION: '156.0' })],
    ['products?view=enterprise', JSON.stringify([
      { Product: 'Beta', Releases: [{ Platform: 'Windows', Architecture: 'x64', ProductVersion: '154.0.0.1' }] },
      { Product: 'Stable', Releases: [{ Platform: 'Windows', Architecture: 'x64', ProductVersion: '153.0.4234.32' }] },
    ])],
    ['stable-2/feed/', '<rss><channel><item><title>Opera 136 Stable</title><description>Built on Chromium 152.0.7977.120.</description></item></channel></rss>'],
    ['/pub/opera/desktop/', '<a href="135.0.5000.1/">old</a><a href="136.0.6008.22/">current</a>'],
  ]);

  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    const match = Array.from(responses.entries()).find(([suffix]) => url.includes(suffix));

    return match === undefined ? new Response('', { status: 404 }) : new Response(match[1], { status: 200 });
  }));
}

describe('browser release sources', () => {
  it('builds a complete snapshot from official Stable feeds', async () => {
    mockReleaseFeeds();

    const snapshot = await fetchBrowserSnapshot();

    expect(snapshot.releases.chrome.version).toBe('153.0.8010.47');
    expect(snapshot.releases.edge.version).toBe('153.0.4234.32');
    expect(snapshot.releases.firefox.version).toBe('156.0');
    expect(snapshot.releases.opera.version).toBe('136.0.6008.22');
    expect(snapshot.releases.opera.chromiumVersion).toBe('152.0.7977.120');
  });

  it('rejects a release feed with no Stable version', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ channels: {} }))));

    await expect(fetchStableBrowserRelease('chrome')).rejects.toThrow();
  });

  it('falls back to the last verified cache, then the package snapshot', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'adt-pulse-releases-'));

    try {
      mockReleaseFeeds();

      const live = await resolveBrowserRelease('chrome', directory);
      const cachedFile = JSON.parse(await readFile(join(directory, 'adt-pulse-browser-releases.json'), 'utf8'));

      expect(live.source).toBe('live');
      expect(cachedFile.releases.chrome.version).toBe('153.0.8010.47');

      vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));

      expect((await resolveBrowserRelease('chrome', directory)).source).toBe('cache');
      expect((await resolveBrowserRelease('chrome')).release.version).toBe(readPackagedBrowserSnapshot().releases.chrome.version);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
