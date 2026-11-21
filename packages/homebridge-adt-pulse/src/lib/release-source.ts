import axios from 'axios';

import type {
  Lib_ReleaseSource_DefaultReleaseSource,
  Lib_ReleaseSource_HttpReleaseSource_Constructor_RegistryUrl,
  Lib_ReleaseSource_HttpReleaseSource_Feeds,
  Lib_ReleaseSource_HttpReleaseSource_FetchBrowserFeed_Body,
  Lib_ReleaseSource_HttpReleaseSource_FetchBrowserFeed_Feed,
  Lib_ReleaseSource_HttpReleaseSource_FetchBrowserFeed_Response,
  Lib_ReleaseSource_HttpReleaseSource_FetchBrowserFeed_Returns,
  Lib_ReleaseSource_HttpReleaseSource_FetchLatestPluginVersion_FetchedVersion,
  Lib_ReleaseSource_HttpReleaseSource_FetchLatestPluginVersion_Response,
  Lib_ReleaseSource_HttpReleaseSource_FetchLatestPluginVersion_ResponseData,
  Lib_ReleaseSource_HttpReleaseSource_FetchLatestPluginVersion_Returns,
  Lib_ReleaseSource_HttpReleaseSource_RegistryUrl,
  Lib_ReleaseSource_HttpReleaseSource_ReleaseSource,
} from '../types/lib/release-source.d.ts';

/**
 * Lib - Release Source.
 *
 * Reads the npm registry and the official browser vendor feeds over HTTP. It
 * owns every release endpoint, so callers only see the release source contract.
 *
 * @since 3.5.11
 */
export class HttpReleaseSource implements Lib_ReleaseSource_HttpReleaseSource_ReleaseSource {
  /**
   * Http Release Source - Feeds.
   *
   * Official vendor endpoints used for Stable-channel release metadata.
   * These are queried only while creating a new fingerprint or building.
   *
   * @private
   *
   * @since 3.5.11
   */
  readonly #feeds: Lib_ReleaseSource_HttpReleaseSource_Feeds;

  /**
   * Http Release Source - Registry Url.
   *
   * Points at the npm registry record for the latest published plugin, which
   * detectors read to skip reports from installations that are out of date.
   *
   * @private
   *
   * @since 3.5.11
   */
  readonly #registryUrl: Lib_ReleaseSource_HttpReleaseSource_RegistryUrl;

  /**
   * Lib - Release Source - Constructor.
   *
   * Sets the registry and vendor feed endpoints this source reads. Keeping them
   * here means an upstream address change only touches this one adapter.
   *
   * @param {Lib_ReleaseSource_HttpReleaseSource_Constructor_RegistryUrl} registryUrl - Registry url.
   *
   * @since 3.5.11
   */
  public constructor(registryUrl: Lib_ReleaseSource_HttpReleaseSource_Constructor_RegistryUrl = 'https://registry.npmjs.org/homebridge-adt-pulse/latest') {
    this.#feeds = {
      chrome: 'https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json',
      edge: 'https://edgeupdates.microsoft.com/api/products?view=enterprise',
      firefox: 'https://product-details.mozilla.org/1.0/firefox_versions.json',
      opera: 'https://blogs.opera.com/desktop/category/stable-2/feed/',
      operaArchive: 'https://get.opera.com/pub/opera/desktop/',
    };
    this.#registryUrl = registryUrl;

    return;
  }

  /**
   * Lib - Release Source - Fetch Browser Feed.
   *
   * Downloads one vendor release feed and hands back its status and body. The
   * caller parses the body, so an unavailable feed is reported, never guessed.
   *
   * @param {Lib_ReleaseSource_HttpReleaseSource_FetchBrowserFeed_Feed} feed - Feed.
   *
   * @returns {Lib_ReleaseSource_HttpReleaseSource_FetchBrowserFeed_Returns}
   *
   * @since 3.5.11
   */
  public async fetchBrowserFeed(feed: Lib_ReleaseSource_HttpReleaseSource_FetchBrowserFeed_Feed): Lib_ReleaseSource_HttpReleaseSource_FetchBrowserFeed_Returns {
    const response: Lib_ReleaseSource_HttpReleaseSource_FetchBrowserFeed_Response = await fetch(this.#feeds[feed], { signal: AbortSignal.timeout(10000) });

    // A failed feed is reported by status only, so its body is never read.
    if (response.ok === false) {
      return {
        ok: false,
        status: response.status,
        body: '',
      };
    }

    const body: Lib_ReleaseSource_HttpReleaseSource_FetchBrowserFeed_Body = await response.text();

    return {
      ok: true,
      status: response.status,
      body,
    };
  }

  /**
   * Lib - Release Source - Fetch Latest Plugin Version.
   *
   * Reads the latest published plugin version from the npm registry. A missing
   * or malformed version comes back as "undefined" for the caller to handle.
   *
   * @returns {Lib_ReleaseSource_HttpReleaseSource_FetchLatestPluginVersion_Returns}
   *
   * @since 3.5.11
   */
  public async fetchLatestPluginVersion(): Lib_ReleaseSource_HttpReleaseSource_FetchLatestPluginVersion_Returns {
    const response: Lib_ReleaseSource_HttpReleaseSource_FetchLatestPluginVersion_Response = await axios.get(
      this.#registryUrl,
      {
        family: 4,
        timeout: 5000,
      },
    );
    const responseData: Lib_ReleaseSource_HttpReleaseSource_FetchLatestPluginVersion_ResponseData = response.data;

    const fetchedVersion: Lib_ReleaseSource_HttpReleaseSource_FetchLatestPluginVersion_FetchedVersion = (responseData !== undefined && responseData !== null) ? responseData['version'] : undefined;

    if (typeof fetchedVersion !== 'string') {
      return undefined;
    }

    return fetchedVersion;
  }
}

/**
 * Lib - Release Source - Default Release Source.
 *
 * The one place the plugin's release source is constructed. Callers depend on
 * the release source contract, not on the HTTP implementation behind it.
 *
 * @since 3.5.11
 */
export const defaultReleaseSource: Lib_ReleaseSource_DefaultReleaseSource = new HttpReleaseSource();
