import axios from 'axios';

import type {
  Lib_ReportSink_DetectReportSink,
  Lib_ReportSink_NtfyReportSink_Constructor_Url,
  Lib_ReportSink_NtfyReportSink_GetUrl_Returns,
  Lib_ReportSink_NtfyReportSink_ReportSink,
  Lib_ReportSink_NtfyReportSink_Send_Body,
  Lib_ReportSink_NtfyReportSink_Send_Returns,
  Lib_ReportSink_NtfyReportSink_Send_SessionData,
  Lib_ReportSink_NtfyReportSink_Send_SessionResponse,
  Lib_ReportSink_NtfyReportSink_Send_Title,
  Lib_ReportSink_NtfyReportSink_Send_Token,
  Lib_ReportSink_NtfyReportSink_Url,
} from '../types/lib/report-sink.d.ts';

/**
 * Lib - Report Sink.
 *
 * Delivers detection reports through the ntfy service the plugin author reads.
 * It owns the endpoint and both HTTP calls, so the detector never sees them.
 *
 * @since 3.5.11
 */
export class NtfyReportSink implements Lib_ReportSink_NtfyReportSink_ReportSink {
  /**
   * Ntfy Report Sink - Url.
   *
   * Stores the ntfy topic endpoint that receives detection reports, so the
   * session request and the report itself always target the same topic.
   *
   * @private
   *
   * @since 3.5.11
   */
  readonly #url: Lib_ReportSink_NtfyReportSink_Url;

  /**
   * Lib - Report Sink - Constructor.
   *
   * Keeps the ntfy topic endpoint for later sends. Callers normally use the
   * default endpoint, while tests can point the sink at a fake address.
   *
   * @param {Lib_ReportSink_NtfyReportSink_Constructor_Url} url - Url.
   *
   * @since 3.5.11
   */
  public constructor(url: Lib_ReportSink_NtfyReportSink_Constructor_Url = 'https://mhQKf8mFu6LJQtYwRDAc.ntfy.liang.nyc') {
    this.#url = url;

    return;
  }

  /**
   * Lib - Report Sink - Get URL.
   *
   * Provides the endpoint where detection reports for unknown devices and
   * statuses are sent so the plugin author can add support for them.
   *
   * @returns {Lib_ReportSink_NtfyReportSink_GetUrl_Returns}
   *
   * @since 3.5.11
   */
  public getUrl(): Lib_ReportSink_NtfyReportSink_GetUrl_Returns {
    return this.#url;
  }

  /**
   * Lib - Report Sink - Send.
   *
   * Gets a one-use session token from the report endpoint, then sends the
   * report with it, so posts that skip the token never reach the author.
   *
   * @param {Lib_ReportSink_NtfyReportSink_Send_Title} title - Title.
   * @param {Lib_ReportSink_NtfyReportSink_Send_Body}  body  - Body.
   *
   * @returns {Lib_ReportSink_NtfyReportSink_Send_Returns}
   *
   * @since 3.5.11
   */
  public async send(title: Lib_ReportSink_NtfyReportSink_Send_Title, body: Lib_ReportSink_NtfyReportSink_Send_Body): Lib_ReportSink_NtfyReportSink_Send_Returns {
    // Both requests stay on IPv4, because a session token only works from the address that asked for it.
    const sessionResponse: Lib_ReportSink_NtfyReportSink_Send_SessionResponse = await axios.post(
      `${this.#url}/session`,
      '',
      {
        family: 4,
        headers: {
          'User-Agent': 'homebridge-adt-pulse',
        },
      },
    );
    const sessionData: Lib_ReportSink_NtfyReportSink_Send_SessionData = sessionResponse.data;
    const token: Lib_ReportSink_NtfyReportSink_Send_Token = (sessionData !== undefined && sessionData !== null) ? sessionData['token'] : undefined;

    if (typeof token !== 'string') {
      throw new Error('Detect report session did not return a token');
    }

    await axios.post(
      this.#url,
      body,
      {
        family: 4,
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'homebridge-adt-pulse',
          'X-Title': title,
        },
      },
    );

    return;
  }
}

/**
 * Lib - Report Sink - Detect Report Sink.
 *
 * The one place the detector's report destination is constructed. Detectors
 * depend on the report sink contract, not on the ntfy implementation.
 *
 * @since 3.5.11
 */
export const detectReportSink: Lib_ReportSink_DetectReportSink = new NtfyReportSink();
