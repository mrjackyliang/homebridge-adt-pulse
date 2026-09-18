import type readline from 'node:readline';

import type { z } from 'zod';

import type { ADTPulseAPI } from '../../lib/api.js';
import type { platformConfig } from '../../lib/schema.js';
import type {
  Shared_ApiResponse,
  Shared_ApiResponseAction,
  Shared_ApiResponseSuccess_Info,
  Shared_CliIdentity,
  Shared_Config,
} from '../shared.d.ts';

/**
 * CLI - Test API - Selected Config Location.
 *
 * @since 1.0.0
 */
export type Cli_TestApi_ADTPulseTest_SelectedConfigLocation = string | undefined;

/**
 * CLI - Test API - Selected Platform.
 *
 * @since 1.0.0
 */
export type Cli_TestApi_ADTPulseTest_SelectedPlatform = Shared_Config | undefined;

/**
 * CLI - Test API - Zod Parse Response.
 *
 * @since 1.0.0
 */
export type Cli_TestApi_ADTPulseTest_ZodParseResponse = z.ZodSafeParseResult<unknown> | undefined;

/**
 * CLI - Test API - Ask Question.
 *
 * @since 1.0.0
 */
export type Cli_TestApi_ADTPulseTest_AskQuestion_Mode = 'disclaimer';

export type Cli_TestApi_ADTPulseTest_AskQuestion_Returns = Promise<boolean>;

export type Cli_TestApi_ADTPulseTest_AskQuestion_RlInterface = readline.Interface;

export type Cli_TestApi_ADTPulseTest_AskQuestion_Identity = Shared_CliIdentity;

export type Cli_TestApi_ADTPulseTest_AskQuestion_Questions_Disclaimer = string;

export type Cli_TestApi_ADTPulseTest_AskQuestion_Questions = {
  disclaimer: Cli_TestApi_ADTPulseTest_AskQuestion_Questions_Disclaimer;
};

/**
 * CLI - Test API - Constructor.
 *
 * @since 1.0.0
 */
export type Cli_TestApi_ADTPulseTest_Constructor_UserAcceptedDisclaimer = boolean;

export type Cli_TestApi_ADTPulseTest_Constructor_ConfigFoundAndSet = boolean;

export type Cli_TestApi_ADTPulseTest_Constructor_Instance = ADTPulseAPI;

export type Cli_TestApi_ADTPulseTest_Constructor_InstanceFunction = () => Promise<Shared_ApiResponse<Shared_ApiResponseAction, Shared_ApiResponseSuccess_Info>>;

export type Cli_TestApi_ADTPulseTest_Constructor_InstanceFunctions = Cli_TestApi_ADTPulseTest_Constructor_InstanceFunction[];

export type Cli_TestApi_ADTPulseTest_Constructor_Response = Shared_ApiResponse<Shared_ApiResponseAction, Shared_ApiResponseSuccess_Info>;

/**
 * CLI - Test API - Find Config.
 *
 * @since 1.0.0
 */
export type Cli_TestApi_ADTPulseTest_FindConfig_Returns = boolean;

export type Cli_TestApi_ADTPulseTest_FindConfig_PossibleLocation = string;

export type Cli_TestApi_ADTPulseTest_FindConfig_PossibleLocations = Cli_TestApi_ADTPulseTest_FindConfig_PossibleLocation[];

export type Cli_TestApi_ADTPulseTest_FindConfig_RawFile = string;

export type Cli_TestApi_ADTPulseTest_FindConfig_ParsedFile = unknown;

export type Cli_TestApi_ADTPulseTest_FindConfig_Platform = unknown;

export type Cli_TestApi_ADTPulseTest_FindConfig_Platforms = Cli_TestApi_ADTPulseTest_FindConfig_Platform[] | undefined;

export type Cli_TestApi_ADTPulseTest_FindConfig_AdtPlatform = unknown;

export type Cli_TestApi_ADTPulseTest_FindConfig_ValidAdtPlatform = z.ZodSafeParseResult<z.output<typeof platformConfig>>;

/**
 * CLI - Test API - Print Test Output.
 *
 * @since 1.0.0
 */
export type Cli_TestApi_ADTPulseTest_PrintTestOutput_IsSuccess = boolean;

export type Cli_TestApi_ADTPulseTest_PrintTestOutput_Returns = void;
