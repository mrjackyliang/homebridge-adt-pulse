import type repl from 'node:repl';

import type { ADTPulseAPI } from '../../lib/api.js';
import type { ADTPulseAuth } from '../../lib/auth.js';
import type { Shared_CliIdentity } from '../shared.d.ts';

/**
 * CLI - Repl - Api.
 *
 * @since 1.0.0
 */
export type Cli_Repl_ADTPulseRepl_Api = ADTPulseAPI | undefined;

/**
 * CLI - Repl - Auth.
 *
 * @since 1.0.0
 */
export type Cli_Repl_ADTPulseRepl_Auth = ADTPulseAuth | undefined;

/**
 * CLI - Repl - Repl Server.
 *
 * @since 1.0.0
 */
export type Cli_Repl_ADTPulseRepl_ReplServer = repl.REPLServer | undefined;

/**
 * CLI - Repl - Constructor - Action.
 *
 * @since 1.0.0
 */
export type Cli_Repl_ADTPulseRepl_Constructor_Action_Returns = void;

/**
 * CLI - Repl - Display Help Header.
 *
 * @since 1.0.0
 */
export type Cli_Repl_ADTPulseRepl_DisplayHelpHeader_Returns = void;

export type Cli_Repl_ADTPulseRepl_DisplayHelpHeader_Identity = Shared_CliIdentity;

/**
 * CLI - Repl - Display Help Menu.
 *
 * @since 1.0.0
 */
export type Cli_Repl_ADTPulseRepl_DisplayHelpMenu_Returns = void;

/**
 * CLI - Repl - Display Startup Header.
 *
 * @since 1.0.0
 */
export type Cli_Repl_ADTPulseRepl_DisplayStartupHeader_Returns = void;

export type Cli_Repl_ADTPulseRepl_DisplayStartupHeader_Identity = Shared_CliIdentity;

/**
 * CLI - Repl - Set API Instance.
 *
 * @since 1.0.0
 */
export type Cli_Repl_ADTPulseRepl_SetApiInstance_Subdomain = unknown;

export type Cli_Repl_ADTPulseRepl_SetApiInstance_Username = unknown;

export type Cli_Repl_ADTPulseRepl_SetApiInstance_Password = unknown;

export type Cli_Repl_ADTPulseRepl_SetApiInstance_Fingerprint = unknown;

export type Cli_Repl_ADTPulseRepl_SetApiInstance_Returns = void;

/**
 * CLI - Repl - Set Auth Instance.
 *
 * @since 1.0.0
 */
export type Cli_Repl_ADTPulseRepl_SetAuthInstance_Subdomain = unknown;

export type Cli_Repl_ADTPulseRepl_SetAuthInstance_Username = unknown;

export type Cli_Repl_ADTPulseRepl_SetAuthInstance_Password = unknown;

export type Cli_Repl_ADTPulseRepl_SetAuthInstance_Returns = void;
