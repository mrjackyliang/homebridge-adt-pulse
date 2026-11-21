import type { AxiosResponse } from 'axios';

import type { Shared_ReportSink } from '../shared.d.ts';

/**
 * Lib - Report Sink.
 *
 * @since 3.5.11
 */
export type Lib_ReportSink_DetectReportSink = Shared_ReportSink;

/**
 * Lib - Report Sink.
 *
 * @since 3.5.11
 */
export type Lib_ReportSink_NtfyReportSink_ReportSink = Shared_ReportSink;

export type Lib_ReportSink_NtfyReportSink_Url = `https://${string}`;

/**
 * Lib - Report Sink - Constructor.
 *
 * @since 3.5.11
 */
export type Lib_ReportSink_NtfyReportSink_Constructor_Url = `https://${string}`;

/**
 * Lib - Report Sink - Get URL.
 *
 * @since 3.5.11
 */
export type Lib_ReportSink_NtfyReportSink_GetUrl_Returns = `https://${string}`;

/**
 * Lib - Report Sink - Send.
 *
 * @since 3.5.11
 */
export type Lib_ReportSink_NtfyReportSink_Send_Title = string;

export type Lib_ReportSink_NtfyReportSink_Send_Body = string;

export type Lib_ReportSink_NtfyReportSink_Send_Returns = Promise<void>;

export type Lib_ReportSink_NtfyReportSink_Send_SessionResponse = AxiosResponse;

export type Lib_ReportSink_NtfyReportSink_Send_SessionDataToken = unknown;

export type Lib_ReportSink_NtfyReportSink_Send_SessionData = {
  token?: Lib_ReportSink_NtfyReportSink_Send_SessionDataToken;
} | null | undefined;

export type Lib_ReportSink_NtfyReportSink_Send_Token = unknown;
