import type { AxiosResponse } from 'axios';

import type {
  Shared_ReleaseFeed,
  Shared_ReleaseFeedResponse,
  Shared_ReleaseSource,
} from '../shared.d.ts';

/**
 * Lib - Release Source.
 *
 * @since 3.5.11
 */
export type Lib_ReleaseSource_DefaultReleaseSource = Shared_ReleaseSource;

/**
 * Lib - Release Source.
 *
 * @since 3.5.11
 */
export type Lib_ReleaseSource_HttpReleaseSource_ReleaseSource = Shared_ReleaseSource;

export type Lib_ReleaseSource_HttpReleaseSource_Feeds = Record<Shared_ReleaseFeed, `https://${string}`>;

export type Lib_ReleaseSource_HttpReleaseSource_RegistryUrl = `https://${string}`;

/**
 * Lib - Release Source - Constructor.
 *
 * @since 3.5.11
 */
export type Lib_ReleaseSource_HttpReleaseSource_Constructor_RegistryUrl = `https://${string}`;

/**
 * Lib - Release Source - Fetch Browser Feed.
 *
 * @since 3.5.11
 */
export type Lib_ReleaseSource_HttpReleaseSource_FetchBrowserFeed_Feed = Shared_ReleaseFeed;

export type Lib_ReleaseSource_HttpReleaseSource_FetchBrowserFeed_Returns = Promise<Shared_ReleaseFeedResponse>;

export type Lib_ReleaseSource_HttpReleaseSource_FetchBrowserFeed_Response = Response;

export type Lib_ReleaseSource_HttpReleaseSource_FetchBrowserFeed_Body = string;

/**
 * Lib - Release Source - Fetch Latest Plugin Version.
 *
 * @since 3.5.11
 */
export type Lib_ReleaseSource_HttpReleaseSource_FetchLatestPluginVersion_Returns = Promise<string | undefined>;

export type Lib_ReleaseSource_HttpReleaseSource_FetchLatestPluginVersion_Response = AxiosResponse;

export type Lib_ReleaseSource_HttpReleaseSource_FetchLatestPluginVersion_ResponseDataVersion = string;

export type Lib_ReleaseSource_HttpReleaseSource_FetchLatestPluginVersion_ResponseData = {
  version?: Lib_ReleaseSource_HttpReleaseSource_FetchLatestPluginVersion_ResponseDataVersion;
} | null | undefined;

export type Lib_ReleaseSource_HttpReleaseSource_FetchLatestPluginVersion_FetchedVersion = string | undefined;
