import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { NovaIdentity } from '@cbnventures/nova/toolkit';
import { z } from 'zod';

import type {
  Cli_Identity_ReadPackagedIdentity_Parsed,
  Cli_Identity_ReadPackagedIdentity_Returns,
  Cli_Identity_ReadPackagedIdentity_SnapshotContents,
  Cli_Identity_ReadPackagedIdentity_SnapshotUrl,
  Cli_Identity_ReadSourceIdentity_DocsIdentity,
  Cli_Identity_ReadSourceIdentity_Returns,
  Cli_Identity_ReadSourceIdentity_SourceDirectory,
  Cli_Identity_ReadSourceIdentity_SourcePath,
  Cli_Identity_ResolveCliIdentity_Returns,
} from '../types/cli/identity.d.ts';

/**
 * CLI - Identity - Snapshot Schema.
 *
 * Validates the two project identity fields consumed by the CLI banners.
 * This catches missing source settings and malformed packaged snapshots.
 *
 * @since 3.5.0
 */
const snapshotSchema = z.object({
  repository: z.url(),
  copyright: z.string().min(1),
});

/**
 * CLI - Identity - Read Source Identity.
 *
 * Reads the nearby Nova config on each source-mode call. The path is anchored
 * to this module so a caller's working directory cannot select another repo.
 *
 * @returns {Cli_Identity_ReadSourceIdentity_Returns}
 *
 * @since 3.5.0
 */
export function readSourceIdentity(): Cli_Identity_ReadSourceIdentity_Returns {
  const sourcePath: Cli_Identity_ReadSourceIdentity_SourcePath = fileURLToPath(import.meta.url);
  const sourceDirectory: Cli_Identity_ReadSourceIdentity_SourceDirectory = dirname(sourcePath);
  const docsIdentity: Cli_Identity_ReadSourceIdentity_DocsIdentity = new NovaIdentity(sourceDirectory).forDocs();

  return snapshotSchema.parse({
    repository: docsIdentity['repository'],
    copyright: docsIdentity['copyright'],
  });
}

/**
 * CLI - Identity - Read Packaged Identity.
 *
 * Reads the build-time snapshot beside the compiled CLI files, allowing the
 * published package to run without the repository's Nova config.
 *
 * @param {Cli_Identity_ReadPackagedIdentity_SnapshotUrl} [snapshotUrl] - Snapshot url.
 *
 * @returns {Cli_Identity_ReadPackagedIdentity_Returns}
 *
 * @since 3.5.0
 */
export function readPackagedIdentity(snapshotUrl: Cli_Identity_ReadPackagedIdentity_SnapshotUrl = new URL('../cli-identity.json', import.meta.url)): Cli_Identity_ReadPackagedIdentity_Returns {
  const snapshotContents: Cli_Identity_ReadPackagedIdentity_SnapshotContents = readFileSync(snapshotUrl, 'utf8');
  const parsed: Cli_Identity_ReadPackagedIdentity_Parsed = JSON.parse(snapshotContents);

  return snapshotSchema.parse(parsed);
}

/**
 * CLI - Identity - Resolve CLI Identity.
 *
 * Chooses live config data for TypeScript source and the packaged snapshot
 * for compiled JavaScript, independent of environment variables or cwd.
 *
 * @returns {Cli_Identity_ResolveCliIdentity_Returns}
 *
 * @since 3.5.0
 */
export function resolveCliIdentity(): Cli_Identity_ResolveCliIdentity_Returns {
  if (import.meta.url.endsWith('.ts') === true) {
    return readSourceIdentity();
  }

  return readPackagedIdentity();
}
