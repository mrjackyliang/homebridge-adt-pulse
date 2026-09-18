import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import {
  mkdir, readFile, rename, writeFile,
} from 'node:fs/promises';
import { join } from 'node:path';

import { JSDOM } from 'jsdom';
import { z } from 'zod';

import {
  browserVersion,
  operaArchiveVersion,
  operaChromiumVersion,
  operaStableTitle,
} from './regex.js';

import type {
  Lib_BrowserReleases_FetchBrowserSnapshot_Releases,
  Lib_BrowserReleases_FetchBrowserSnapshot_Returns,
  Lib_BrowserReleases_FetchStableBrowserRelease_Archive,
  Lib_BrowserReleases_FetchStableBrowserRelease_ArchiveMatch,
  Lib_BrowserReleases_FetchStableBrowserRelease_ArchiveResponse,
  Lib_BrowserReleases_FetchStableBrowserRelease_Browser,
  Lib_BrowserReleases_FetchStableBrowserRelease_ChromeParsed,
  Lib_BrowserReleases_FetchStableBrowserRelease_ChromePayload,
  Lib_BrowserReleases_FetchStableBrowserRelease_ChromiumMatch,
  Lib_BrowserReleases_FetchStableBrowserRelease_ChromiumVersion,
  Lib_BrowserReleases_FetchStableBrowserRelease_CurrentMajor,
  Lib_BrowserReleases_FetchStableBrowserRelease_CurrentMatch,
  Lib_BrowserReleases_FetchStableBrowserRelease_CurrentPost,
  Lib_BrowserReleases_FetchStableBrowserRelease_CurrentTitle,
  Lib_BrowserReleases_FetchStableBrowserRelease_CurrentVersion,
  Lib_BrowserReleases_FetchStableBrowserRelease_EdgeParsed,
  Lib_BrowserReleases_FetchStableBrowserRelease_EdgePayload,
  Lib_BrowserReleases_FetchStableBrowserRelease_Feed,
  Lib_BrowserReleases_FetchStableBrowserRelease_FirefoxParsed,
  Lib_BrowserReleases_FetchStableBrowserRelease_FirefoxPayload,
  Lib_BrowserReleases_FetchStableBrowserRelease_FirstItem,
  Lib_BrowserReleases_FetchStableBrowserRelease_FirstTitle,
  Lib_BrowserReleases_FetchStableBrowserRelease_Items,
  Lib_BrowserReleases_FetchStableBrowserRelease_Major,
  Lib_BrowserReleases_FetchStableBrowserRelease_Response,
  Lib_BrowserReleases_FetchStableBrowserRelease_Returns,
  Lib_BrowserReleases_FetchStableBrowserRelease_Stable,
  Lib_BrowserReleases_FetchStableBrowserRelease_Title,
  Lib_BrowserReleases_FetchStableBrowserRelease_TitleElement,
  Lib_BrowserReleases_FetchStableBrowserRelease_TitleMatch,
  Lib_BrowserReleases_FetchStableBrowserRelease_Version,
  Lib_BrowserReleases_FetchStableBrowserRelease_Versions,
  Lib_BrowserReleases_FetchStableBrowserRelease_Xml,
  Lib_BrowserReleases_ReadPackagedBrowserSnapshot_Returns,
  Lib_BrowserReleases_ReadPackagedBrowserSnapshot_SnapshotUrl,
  Lib_BrowserReleases_ResolveBrowserRelease_Browser,
  Lib_BrowserReleases_ResolveBrowserRelease_Cached,
  Lib_BrowserReleases_ResolveBrowserRelease_CacheDirectory,
  Lib_BrowserReleases_ResolveBrowserRelease_CachePath,
  Lib_BrowserReleases_ResolveBrowserRelease_Packaged,
  Lib_BrowserReleases_ResolveBrowserRelease_Release,
  Lib_BrowserReleases_ResolveBrowserRelease_Returns,
  Lib_BrowserReleases_ResolveBrowserRelease_TemporaryPath,
  Lib_BrowserReleases_ResolveBrowserRelease_Updated,
} from '../types/lib/browser-releases.d.ts';

/**
 * Lib - Browser Releases - Release Schema.
 *
 * Rejects malformed version strings before they enter a device profile.
 * It also validates data restored from disk.
 *
 * @since 3.5.0
 */
const releaseSchema = z.object({
  browser: z.enum([
    'chrome',
    'edge',
    'firefox',
    'opera',
  ]),
  version: z.string().regex(browserVersion),
  chromiumVersion: z.string().regex(browserVersion).optional(),
});

/**
 * Lib - Browser Releases - Snapshot Schema.
 *
 * Requires all four supported browsers in a coherent snapshot.
 * This prevents a partial cache or package file from being used.
 *
 * @since 3.5.0
 */
const snapshotSchema = z.object({
  schemaVersion: z.literal(1),
  generatedAt: z.iso.datetime(),
  releases: z.object({
    chrome: releaseSchema,
    edge: releaseSchema,
    firefox: releaseSchema,
    opera: releaseSchema,
  }),
});

/**
 * Lib - Browser Releases - Sources.
 *
 * Official vendor endpoints used for Stable-channel release metadata.
 * These are queried only while creating a new fingerprint or building.
 *
 * @since 3.5.0
 */
const sources = {
  chrome: 'https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json',
  edge: 'https://edgeupdates.microsoft.com/api/products?view=enterprise',
  firefox: 'https://product-details.mozilla.org/1.0/firefox_versions.json',
  opera: 'https://blogs.opera.com/desktop/category/stable-2/feed/',
  operaArchive: 'https://get.opera.com/pub/opera/desktop/',
} as const;

/**
 * Lib - Browser Releases - Read Packaged Browser Snapshot.
 *
 * Uses the build-produced JSON in the installed package. Source-mode tests and
 * unbuilt development checkouts use a known-good source fallback.
 *
 * @returns {Lib_BrowserReleases_Snapshot}
 *
 * @since 3.5.0
 */
export function readPackagedBrowserSnapshot(): Lib_BrowserReleases_ReadPackagedBrowserSnapshot_Returns {
  const snapshotUrl: Lib_BrowserReleases_ReadPackagedBrowserSnapshot_SnapshotUrl = new URL('../browser-releases.json', import.meta.url);

  if (existsSync(snapshotUrl) === false) {
    if (import.meta.url.endsWith('.ts') === false) {
      throw new Error('Packaged browser release snapshot is missing');
    }

    return {
      schemaVersion: 1,
      generatedAt: '2026-09-17T00:00:00.000Z',
      releases: {
        chrome: {
          browser: 'chrome',
          version: '153.0.8010.47',
        },
        edge: {
          browser: 'edge',
          version: '153.0.4234.32',
        },
        firefox: {
          browser: 'firefox',
          version: '156.0',
        },
        opera: {
          browser: 'opera',
          version: '136.0.6008.22',
          chromiumVersion: '152.0.7977.120',
        },
      },
    };
  }

  return snapshotSchema.parse(JSON.parse(readFileSync(snapshotUrl, 'utf8')));
}

/**
 * Lib - Browser Releases - Fetch Stable Browser Release.
 *
 * Reads only official Stable-channel release feeds. A malformed or unavailable
 * response is an error so a release build cannot silently ship stale metadata.
 *
 * @param {Lib_BrowserReleases_Browser} browser - Browser.
 *
 * @returns {Promise<Lib_BrowserReleases_Release>}
 *
 * @since 3.5.0
 */
export async function fetchStableBrowserRelease(browser: Lib_BrowserReleases_FetchStableBrowserRelease_Browser): Lib_BrowserReleases_FetchStableBrowserRelease_Returns {
  const response: Lib_BrowserReleases_FetchStableBrowserRelease_Response = await fetch(sources[browser], { signal: AbortSignal.timeout(10000) });

  if (response.ok === false) {
    throw new Error(`${browser} stable feed returned HTTP ${response.status}`);
  }

  if (browser === 'chrome') {
    const chromePayload: Lib_BrowserReleases_FetchStableBrowserRelease_ChromePayload = await response.json();
    const chromeParsed: Lib_BrowserReleases_FetchStableBrowserRelease_ChromeParsed = z.object({
      channels: z.object({ Stable: z.object({ version: z.string() }) }),
    }).parse(chromePayload);

    return releaseSchema.parse({
      browser,
      version: chromeParsed['channels']['Stable']['version'],
    });
  }

  if (browser === 'firefox') {
    const firefoxPayload: Lib_BrowserReleases_FetchStableBrowserRelease_FirefoxPayload = await response.json();
    const firefoxParsed: Lib_BrowserReleases_FetchStableBrowserRelease_FirefoxParsed = z.object({
      LATEST_FIREFOX_VERSION: z.string(),
    }).parse(firefoxPayload);

    return releaseSchema.parse({
      browser,
      version: firefoxParsed['LATEST_FIREFOX_VERSION'],
    });
  }

  if (browser === 'edge') {
    const edgePayload: Lib_BrowserReleases_FetchStableBrowserRelease_EdgePayload = await response.json();
    const edgeParsed: Lib_BrowserReleases_FetchStableBrowserRelease_EdgeParsed = z.array(z.object({
      Product: z.string(),
      Releases: z.array(z.object({
        Platform: z.string(),
        Architecture: z.string(),
        ProductVersion: z.string(),
      })),
    })).parse(edgePayload);
    const stable: Lib_BrowserReleases_FetchStableBrowserRelease_Stable = edgeParsed
      .filter((product) => product['Product'] === 'Stable')
      .flatMap((product) => product['Releases'])
      .filter((release) => release['Platform'] === 'Windows' && release['Architecture'] === 'x64')
      .map((release) => release['ProductVersion'])
      .filter((version) => browserVersion.test(version))
      .sort((left, right) => right.localeCompare(left, undefined, { numeric: true }));

    if (stable[0] === undefined) {
      throw new Error('Edge Stable Windows x64 release is missing');
    }

    return releaseSchema.parse({
      browser,
      version: stable[0],
    });
  }

  const xml: Lib_BrowserReleases_FetchStableBrowserRelease_Xml = await response.text();
  const feed: Lib_BrowserReleases_FetchStableBrowserRelease_Feed = new JSDOM(xml, { contentType: 'text/xml' }).window.document;
  const items: Lib_BrowserReleases_FetchStableBrowserRelease_Items = Array.from(feed.querySelectorAll('item'));
  const firstItem: Lib_BrowserReleases_FetchStableBrowserRelease_FirstItem = items[0];
  const firstTitle: Lib_BrowserReleases_FetchStableBrowserRelease_FirstTitle = (firstItem === undefined) ? null : firstItem.querySelector('title');
  const currentTitle: Lib_BrowserReleases_FetchStableBrowserRelease_CurrentTitle = (firstTitle === null) ? '' : firstTitle.textContent ?? '';
  const currentMatch: Lib_BrowserReleases_FetchStableBrowserRelease_CurrentMatch = operaStableTitle.exec(currentTitle);
  const currentVersion: Lib_BrowserReleases_FetchStableBrowserRelease_CurrentVersion = (currentMatch === null) ? undefined : currentMatch[1];
  const currentMajor: Lib_BrowserReleases_FetchStableBrowserRelease_CurrentMajor = (currentVersion === undefined) ? undefined : currentVersion.split('.')[0];

  if (currentMajor === undefined) {
    throw new Error('Opera Stable RSS has no current release');
  }

  const currentPost: Lib_BrowserReleases_FetchStableBrowserRelease_CurrentPost = items.find((item) => {
    const titleElement: Lib_BrowserReleases_FetchStableBrowserRelease_TitleElement = item.querySelector('title');
    const title: Lib_BrowserReleases_FetchStableBrowserRelease_Title = (titleElement === null) ? '' : titleElement.textContent ?? '';
    const titleMatch: Lib_BrowserReleases_FetchStableBrowserRelease_TitleMatch = operaStableTitle.exec(title);
    const version: Lib_BrowserReleases_FetchStableBrowserRelease_Version = (titleMatch === null) ? undefined : titleMatch[1];
    const major: Lib_BrowserReleases_FetchStableBrowserRelease_Major = (version === undefined) ? undefined : version.split('.')[0];

    return major === currentMajor && operaChromiumVersion.test(item.textContent ?? '');
  });
  const chromiumMatch: Lib_BrowserReleases_FetchStableBrowserRelease_ChromiumMatch = operaChromiumVersion.exec((currentPost === undefined) ? '' : currentPost.textContent ?? '');
  const chromiumVersion: Lib_BrowserReleases_FetchStableBrowserRelease_ChromiumVersion = (chromiumMatch === null) ? undefined : chromiumMatch[1];

  if (chromiumVersion === undefined) {
    throw new Error('Opera Stable RSS has no matching Chromium version');
  }

  const archiveResponse: Lib_BrowserReleases_FetchStableBrowserRelease_ArchiveResponse = await fetch(sources['operaArchive'], { signal: AbortSignal.timeout(10000) });

  if (archiveResponse.ok === false) {
    throw new Error(`Opera release archive returned HTTP ${archiveResponse.status}`);
  }

  const archive: Lib_BrowserReleases_FetchStableBrowserRelease_Archive = new JSDOM(await archiveResponse.text()).window.document;
  const versions: Lib_BrowserReleases_FetchStableBrowserRelease_Versions = Array.from(archive.querySelectorAll('a'))
    .flatMap((link) => {
      const archiveMatch: Lib_BrowserReleases_FetchStableBrowserRelease_ArchiveMatch = operaArchiveVersion.exec(link.getAttribute('href') ?? '');

      return (archiveMatch === null || archiveMatch[1] === undefined) ? [] : [archiveMatch[1]];
    })
    .filter((version) => version.split('.')[0] === currentMajor)
    .sort((left, right) => right.localeCompare(left, undefined, { numeric: true }));

  if (versions[0] === undefined) {
    throw new Error('Opera release archive has no matching Stable version');
  }

  return releaseSchema.parse({
    browser,
    version: versions[0],
    chromiumVersion,
  });
}

/**
 * Lib - Browser Releases - Fetch Browser Snapshot.
 *
 * All four feeds must succeed before a build can package this snapshot.
 * Partial results are never written to the published artifact.
 *
 * @returns {Promise<Lib_BrowserReleases_Snapshot>}
 *
 * @since 3.5.0
 */
export async function fetchBrowserSnapshot(): Lib_BrowserReleases_FetchBrowserSnapshot_Returns {
  const releases: Lib_BrowserReleases_FetchBrowserSnapshot_Releases = await Promise.all([
    fetchStableBrowserRelease('chrome'),
    fetchStableBrowserRelease('edge'),
    fetchStableBrowserRelease('firefox'),
    fetchStableBrowserRelease('opera'),
  ]);

  return snapshotSchema.parse({
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    releases: {
      chrome: releases[0],
      edge: releases[1],
      firefox: releases[2],
      opera: releases[3],
    },
  });
}

/**
 * Lib - Browser Releases - Resolve Browser Release.
 *
 * A new device checks the live Stable feed first, then the last verified local
 * cache, then the packaged build snapshot. Existing saved fingerprints are not
 * touched by this lookup.
 *
 * @param {Lib_BrowserReleases_Browser} browser        - Browser.
 * @param {string}                      cacheDirectory - Cache directory.
 *
 * @returns {Promise<Lib_BrowserReleases_ResolvedRelease>}
 *
 * @since 3.5.0
 */
export async function resolveBrowserRelease(browser: Lib_BrowserReleases_ResolveBrowserRelease_Browser, cacheDirectory?: Lib_BrowserReleases_ResolveBrowserRelease_CacheDirectory): Lib_BrowserReleases_ResolveBrowserRelease_Returns {
  const packaged: Lib_BrowserReleases_ResolveBrowserRelease_Packaged = readPackagedBrowserSnapshot();
  const cachePath: Lib_BrowserReleases_ResolveBrowserRelease_CachePath = (cacheDirectory === undefined) ? undefined : join(cacheDirectory, 'adt-pulse-browser-releases.json');
  let cached: Lib_BrowserReleases_ResolveBrowserRelease_Cached = undefined;

  if (cachePath !== undefined) {
    try {
      cached = snapshotSchema.parse(JSON.parse(await readFile(cachePath, 'utf8')));
    } catch {
      cached = undefined;
    }
  }

  try {
    const release: Lib_BrowserReleases_ResolveBrowserRelease_Release = await fetchStableBrowserRelease(browser);

    if (cachePath !== undefined) {
      try {
        const updated: Lib_BrowserReleases_ResolveBrowserRelease_Updated = snapshotSchema.parse({
          schemaVersion: 1,
          generatedAt: new Date().toISOString(),
          releases: {
            ...(cached ?? packaged)['releases'],
            [browser]: release,
          },
        });
        const temporaryPath: Lib_BrowserReleases_ResolveBrowserRelease_TemporaryPath = `${cachePath}.${randomUUID()}.tmp`;

        await mkdir(cacheDirectory!, { recursive: true });
        await writeFile(temporaryPath, JSON.stringify(updated, null, 2), { mode: parseInt('600', 8) });
        await rename(temporaryPath, cachePath);
      } catch {
        // Homebridge storage may be read-only; the release itself is still valid.
      }
    }

    return {
      release,
      source: 'live',
    };
  } catch {
    if (cached !== undefined) {
      return {
        release: cached['releases'][browser],
        source: 'cache',
      };
    }

    return {
      release: packaged['releases'][browser],
      source: 'package',
    };
  }
}
