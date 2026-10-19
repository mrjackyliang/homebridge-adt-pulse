import { writeFile } from 'node:fs/promises';

import { resolveBuildBrowserSnapshot } from '../lib/browser-releases.js';

import type { Cli_GenerateBrowserSnapshot_Main_Output, Cli_GenerateBrowserSnapshot_Main_Returns } from '../types/cli/generate-browser-snapshot.d.ts';

/**
 * CLI - Generate Browser Snapshot - Main.
 *
 * Refreshes the verified Stable browser data in the packaged build output.
 * Offline builds package the verified source fallback.
 *
 * @returns {Cli_GenerateBrowserSnapshot_Main_Returns}
 *
 * @since 3.5.0
 */
async function main(): Cli_GenerateBrowserSnapshot_Main_Returns {
  const output: Cli_GenerateBrowserSnapshot_Main_Output = new URL('../browser-releases.json', import.meta.url);

  await writeFile(output, `${JSON.stringify(await resolveBuildBrowserSnapshot(), null, 2)}\n`, 'utf8');

  return;
}

await main();
