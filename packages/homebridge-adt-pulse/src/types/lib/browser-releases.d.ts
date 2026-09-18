import type {
  Shared_BrowserName,
  Shared_BrowserRelease,
  Shared_BrowserReleaseSnapshot,
  Shared_ResolvedBrowserRelease,
} from '../shared.d.ts';

/**
 * Lib - Browser Releases - Fetch Browser Snapshot.
 *
 * @since 3.5.0
 */
export type Lib_BrowserReleases_FetchBrowserSnapshot_Returns = Promise<Shared_BrowserReleaseSnapshot>;

export type Lib_BrowserReleases_FetchBrowserSnapshot_Releases = Shared_BrowserRelease[];

/**
 * Lib - Browser Releases - Fetch Stable Browser Release.
 *
 * @since 3.5.0
 */
export type Lib_BrowserReleases_FetchStableBrowserRelease_Browser = Shared_BrowserName;

export type Lib_BrowserReleases_FetchStableBrowserRelease_Returns = Promise<Shared_BrowserRelease>;

export type Lib_BrowserReleases_FetchStableBrowserRelease_Response = Response;

export type Lib_BrowserReleases_FetchStableBrowserRelease_ChromePayload = unknown;

export type Lib_BrowserReleases_FetchStableBrowserRelease_ChromeParsed_Channels_Stable_Version = string;

export type Lib_BrowserReleases_FetchStableBrowserRelease_ChromeParsed_Channels_Stable = {
  version: Lib_BrowserReleases_FetchStableBrowserRelease_ChromeParsed_Channels_Stable_Version;
};

export type Lib_BrowserReleases_FetchStableBrowserRelease_ChromeParsed_Channels = {
  Stable: Lib_BrowserReleases_FetchStableBrowserRelease_ChromeParsed_Channels_Stable;
};

export type Lib_BrowserReleases_FetchStableBrowserRelease_ChromeParsed = {
  channels: Lib_BrowserReleases_FetchStableBrowserRelease_ChromeParsed_Channels;
};

export type Lib_BrowserReleases_FetchStableBrowserRelease_FirefoxPayload = unknown;

export type Lib_BrowserReleases_FetchStableBrowserRelease_FirefoxParsed_LATEST_FIREFOX_VERSION = string;

export type Lib_BrowserReleases_FetchStableBrowserRelease_FirefoxParsed = {
  LATEST_FIREFOX_VERSION: Lib_BrowserReleases_FetchStableBrowserRelease_FirefoxParsed_LATEST_FIREFOX_VERSION;
};

export type Lib_BrowserReleases_FetchStableBrowserRelease_EdgePayload = unknown;

export type Lib_BrowserReleases_FetchStableBrowserRelease_EdgeParsed_Product = string;

export type Lib_BrowserReleases_FetchStableBrowserRelease_EdgeParsed_Releases_Platform = string;

export type Lib_BrowserReleases_FetchStableBrowserRelease_EdgeParsed_Releases_Architecture = string;

export type Lib_BrowserReleases_FetchStableBrowserRelease_EdgeParsed_Releases_ProductVersion = string;

export type Lib_BrowserReleases_FetchStableBrowserRelease_EdgeParsed_Releases = {
  Platform: Lib_BrowserReleases_FetchStableBrowserRelease_EdgeParsed_Releases_Platform;
  Architecture: Lib_BrowserReleases_FetchStableBrowserRelease_EdgeParsed_Releases_Architecture;
  ProductVersion: Lib_BrowserReleases_FetchStableBrowserRelease_EdgeParsed_Releases_ProductVersion;
}[];

export type Lib_BrowserReleases_FetchStableBrowserRelease_EdgeParsed = {
  Product: Lib_BrowserReleases_FetchStableBrowserRelease_EdgeParsed_Product;
  Releases: Lib_BrowserReleases_FetchStableBrowserRelease_EdgeParsed_Releases;
}[];

export type Lib_BrowserReleases_FetchStableBrowserRelease_Stable = string[];

export type Lib_BrowserReleases_FetchStableBrowserRelease_Xml = string;

export type Lib_BrowserReleases_FetchStableBrowserRelease_Feed = Document;

export type Lib_BrowserReleases_FetchStableBrowserRelease_Items = Element[];

export type Lib_BrowserReleases_FetchStableBrowserRelease_FirstItem = Element | undefined;

export type Lib_BrowserReleases_FetchStableBrowserRelease_FirstTitle = Element | null;

export type Lib_BrowserReleases_FetchStableBrowserRelease_CurrentTitle = string;

export type Lib_BrowserReleases_FetchStableBrowserRelease_CurrentMatch = RegExpExecArray | null;

export type Lib_BrowserReleases_FetchStableBrowserRelease_CurrentVersion = string | undefined;

export type Lib_BrowserReleases_FetchStableBrowserRelease_CurrentMajor = string | undefined;

export type Lib_BrowserReleases_FetchStableBrowserRelease_CurrentPost = Element | undefined;

export type Lib_BrowserReleases_FetchStableBrowserRelease_TitleElement = Element | null;

export type Lib_BrowserReleases_FetchStableBrowserRelease_Title = string;

export type Lib_BrowserReleases_FetchStableBrowserRelease_TitleMatch = RegExpExecArray | null;

export type Lib_BrowserReleases_FetchStableBrowserRelease_Version = string | undefined;

export type Lib_BrowserReleases_FetchStableBrowserRelease_Major = string | undefined;

export type Lib_BrowserReleases_FetchStableBrowserRelease_ChromiumMatch = RegExpExecArray | null;

export type Lib_BrowserReleases_FetchStableBrowserRelease_ChromiumVersion = string | undefined;

export type Lib_BrowserReleases_FetchStableBrowserRelease_ArchiveResponse = Response;

export type Lib_BrowserReleases_FetchStableBrowserRelease_Archive = Document;

export type Lib_BrowserReleases_FetchStableBrowserRelease_Versions = string[];

export type Lib_BrowserReleases_FetchStableBrowserRelease_ArchiveMatch = RegExpExecArray | null;

/**
 * Lib - Browser Releases - Read Packaged Browser Snapshot.
 *
 * @since 3.5.0
 */
export type Lib_BrowserReleases_ReadPackagedBrowserSnapshot_Returns = Shared_BrowserReleaseSnapshot;

export type Lib_BrowserReleases_ReadPackagedBrowserSnapshot_SnapshotUrl = URL;

/**
 * Lib - Browser Releases - Resolve Browser Release.
 *
 * @since 3.5.0
 */
export type Lib_BrowserReleases_ResolveBrowserRelease_Browser = Shared_BrowserName;

export type Lib_BrowserReleases_ResolveBrowserRelease_CacheDirectory = string | undefined;

export type Lib_BrowserReleases_ResolveBrowserRelease_Returns = Promise<Shared_ResolvedBrowserRelease>;

export type Lib_BrowserReleases_ResolveBrowserRelease_Packaged = Shared_BrowserReleaseSnapshot;

export type Lib_BrowserReleases_ResolveBrowserRelease_CachePath = string | undefined;

export type Lib_BrowserReleases_ResolveBrowserRelease_Cached = Shared_BrowserReleaseSnapshot | undefined;

export type Lib_BrowserReleases_ResolveBrowserRelease_Release = Shared_BrowserRelease;

export type Lib_BrowserReleases_ResolveBrowserRelease_Updated = Shared_BrowserReleaseSnapshot;

export type Lib_BrowserReleases_ResolveBrowserRelease_TemporaryPath = string;
