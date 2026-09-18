import { writeFile } from 'node:fs/promises';

import { readSourceIdentity } from './identity.js';

import type {
  Cli_GenerateIdentitySnapshot_Main_Contents,
  Cli_GenerateIdentitySnapshot_Main_Identity,
  Cli_GenerateIdentitySnapshot_Main_Output,
  Cli_GenerateIdentitySnapshot_Main_Returns,
} from '../types/cli/generate-identity-snapshot.d.ts';

/**
 * CLI - Generate Identity Snapshot - Main.
 *
 * Flattens the current Nova identity into the plugin build. Both published
 * CLIs then display the same metadata without shipping nova.config.json.
 *
 * @returns {Cli_GenerateIdentitySnapshot_Main_Returns}
 *
 * @since 3.5.0
 */
async function main(): Cli_GenerateIdentitySnapshot_Main_Returns {
  const output: Cli_GenerateIdentitySnapshot_Main_Output = new URL('../cli-identity.json', import.meta.url);
  const identity: Cli_GenerateIdentitySnapshot_Main_Identity = readSourceIdentity();
  const contents: Cli_GenerateIdentitySnapshot_Main_Contents = `${JSON.stringify(identity, null, 2)}\n`;

  await writeFile(output, contents, 'utf8');

  return;
}

await main();
