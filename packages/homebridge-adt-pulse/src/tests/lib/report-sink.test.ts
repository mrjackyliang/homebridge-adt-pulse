import axios from 'axios';
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { detectReportSink, NtfyReportSink } from '../../lib/report-sink.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

// The endpoint probe: a plain GET that refuses redirects and gives up after 10 seconds.
async function probeDetectReportEndpoint() {
  return fetch(new NtfyReportSink().getUrl(), {
    method: 'GET',
    redirect: 'error',
    signal: AbortSignal.timeout(10000),
  });
}

describe('ntfy report sink', () => {
  it('probes the detect report endpoint with a plain GET and accepts an OK answer', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response('', { status: 200 }));

    vi.stubGlobal('fetch', fetchMock);

    const response = await probeDetectReportEndpoint();

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith('https://mhQKf8mFu6LJQtYwRDAc.ntfy.liang.nyc', {
      method: 'GET',
      redirect: 'error',
      signal: expect.any(AbortSignal),
    });

    const init = fetchMock.mock.calls[0]?.[1];

    expect(init?.headers).toBeUndefined();
    expect(init?.body).toBeUndefined();
    expect(response.ok).toBe(true);
  });

  it('reports the detect report endpoint as unavailable on a non-OK answer', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 503 })));

    const response = await probeDetectReportEndpoint();

    expect(response.ok).toBe(false);
  });

  it('fails the detect report endpoint probe when the request errors', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new TypeError('fetch failed');
    }));

    await expect(probeDetectReportEndpoint()).rejects.toThrow('fetch failed');
  });

  it('builds the detector sink from the ntfy implementation', () => {
    expect(detectReportSink).toBeInstanceOf(NtfyReportSink);
    expect(new NtfyReportSink().getUrl()).toBe('https://mhQKf8mFu6LJQtYwRDAc.ntfy.liang.nyc');
  });

  it('gets a session token before sending a detect report', async () => {
    const sink = new NtfyReportSink('https://reports.example.com');
    const axiosPost = vi.spyOn(axios, 'post');

    axiosPost.mockResolvedValueOnce({ data: { status: 'success', token: 'session-token', expires_in: 300 } });
    axiosPost.mockResolvedValueOnce({ status: 200 });

    await expect(sink.send('Detected a new portal version (v1.0.0)', '{"version":"99.0.0-1"}')).resolves.toBeUndefined();

    expect(axiosPost).toHaveBeenCalledTimes(2);
    expect(axiosPost).toHaveBeenNthCalledWith(
      1,
      'https://reports.example.com/session',
      '',
      {
        family: 4,
        headers: {
          'User-Agent': 'homebridge-adt-pulse',
        },
      },
    );
    expect(axiosPost).toHaveBeenNthCalledWith(
      2,
      'https://reports.example.com',
      '{"version":"99.0.0-1"}',
      {
        family: 4,
        headers: {
          'Authorization': 'Bearer session-token',
          'User-Agent': 'homebridge-adt-pulse',
          'X-Title': 'Detected a new portal version (v1.0.0)',
        },
      },
    );

    axiosPost.mockRestore();
  });

  it('does not send a detect report without a session token', async () => {
    const sink = new NtfyReportSink('https://reports.example.com');
    const axiosPost = vi.spyOn(axios, 'post');

    axiosPost.mockResolvedValueOnce({ data: { status: 'error', message: 'Too many session requests' } });

    await expect(sink.send('Detected a new portal version (v1.0.0)', '{}')).rejects.toThrow('Detect report session did not return a token');

    expect(axiosPost).toHaveBeenCalledOnce();

    axiosPost.mockRestore();
  });

  it('does not send a detect report when the session response is empty', async () => {
    const sink = new NtfyReportSink('https://reports.example.com');
    const axiosPost = vi.spyOn(axios, 'post');

    axiosPost.mockResolvedValueOnce({ data: null });

    await expect(sink.send('Detected a new portal version (v1.0.0)', '{}')).rejects.toThrow('Detect report session did not return a token');

    expect(axiosPost).toHaveBeenCalledOnce();

    axiosPost.mockRestore();
  });
});
