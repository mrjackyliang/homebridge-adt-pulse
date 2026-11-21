import axios from 'axios';
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { defaultReleaseSource, HttpReleaseSource } from '../../lib/release-source.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('http release source', () => {
  it('builds the default release source from the HTTP implementation', () => {
    expect(defaultReleaseSource).toBeInstanceOf(HttpReleaseSource);
  });

  it('reads the latest plugin version from the npm registry over IPv4', async () => {
    const axiosGet = vi.spyOn(axios, 'get');

    axiosGet.mockResolvedValueOnce({ data: { version: '99.0.0' } });

    await expect(new HttpReleaseSource().fetchLatestPluginVersion()).resolves.toBe('99.0.0');
    expect(axiosGet).toHaveBeenCalledWith(
      'https://registry.npmjs.org/homebridge-adt-pulse/latest',
      {
        family: 4,
        timeout: 5000,
      },
    );

    axiosGet.mockRestore();
  });

  it.each([
    ['an empty body', {}],
    ['a null body', null],
    ['a numeric version', { version: 99 }],
  ])('returns no plugin version for %s', async (_label, data) => {
    const axiosGet = vi.spyOn(axios, 'get');

    axiosGet.mockResolvedValueOnce({ data });

    await expect(new HttpReleaseSource().fetchLatestPluginVersion()).resolves.toBeUndefined();

    axiosGet.mockRestore();
  });

  it('passes registry failures to the caller', async () => {
    const axiosGet = vi.spyOn(axios, 'get');

    axiosGet.mockRejectedValueOnce(new Error('offline'));

    await expect(new HttpReleaseSource().fetchLatestPluginVersion()).rejects.toThrow('offline');

    axiosGet.mockRestore();
  });

  it.each([
    ['chrome', 'https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json'],
    ['edge', 'https://edgeupdates.microsoft.com/api/products?view=enterprise'],
    ['firefox', 'https://product-details.mozilla.org/1.0/firefox_versions.json'],
    ['opera', 'https://blogs.opera.com/desktop/category/stable-2/feed/'],
    ['operaArchive', 'https://get.opera.com/pub/opera/desktop/'],
  ] as const)('reads the %s feed with a ten second timeout', async (feed, url) => {
    const fakeFetch = vi.fn(async () => new Response('fake feed body', { status: 200 }));

    vi.stubGlobal('fetch', fakeFetch);

    await expect(new HttpReleaseSource().fetchBrowserFeed(feed)).resolves.toEqual({
      ok: true,
      status: 200,
      body: 'fake feed body',
    });
    expect(fakeFetch).toHaveBeenCalledWith(url, { signal: expect.any(AbortSignal) });
  });

  it('reports a failed feed by status without reading its body', async () => {
    const failed = new Response('not found', { status: 404 });
    const text = vi.spyOn(failed, 'text');

    vi.stubGlobal('fetch', vi.fn(async () => failed));

    await expect(new HttpReleaseSource().fetchBrowserFeed('chrome')).resolves.toEqual({
      ok: false,
      status: 404,
      body: '',
    });
    expect(text).not.toHaveBeenCalled();
  });
});
