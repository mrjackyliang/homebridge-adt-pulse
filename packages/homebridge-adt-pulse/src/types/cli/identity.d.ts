import type { NovaIdentity } from '@cbnventures/nova/toolkit';

import type { Shared_CliIdentity } from '../shared.d.ts';

/**
 * CLI - Identity - Read Packaged Identity.
 *
 * @since 3.5.0
 */
export type Cli_Identity_ReadPackagedIdentity_SnapshotUrl = URL;

export type Cli_Identity_ReadPackagedIdentity_Returns = Shared_CliIdentity;

export type Cli_Identity_ReadPackagedIdentity_SnapshotContents = string;

export type Cli_Identity_ReadPackagedIdentity_Parsed = unknown;

/**
 * CLI - Identity - Read Source Identity.
 *
 * @since 3.5.0
 */
export type Cli_Identity_ReadSourceIdentity_Returns = Shared_CliIdentity;

export type Cli_Identity_ReadSourceIdentity_SourcePath = string;

export type Cli_Identity_ReadSourceIdentity_SourceDirectory = string;

export type Cli_Identity_ReadSourceIdentity_DocsIdentity = ReturnType<NovaIdentity['forDocs']>;

/**
 * CLI - Identity - Resolve CLI Identity.
 *
 * @since 3.5.0
 */
export type Cli_Identity_ResolveCliIdentity_Returns = Shared_CliIdentity;
