import { readFileSync } from 'node:fs';
import os from 'node:os';
import { exit, stdin, stdout } from 'node:process';
import readline from 'node:readline';
import util from 'node:util';

import { CLIHeader } from '@cbnventures/nova/toolkit';
import chalk from 'chalk';
import _ from 'lodash';

import { ADTPulseAPI } from '../lib/api.js';
import { platformConfig } from '../lib/schema.js';
import { debugLog, isForwardSlashOS, stackTracer } from '../lib/utility.js';
import { resolveCliIdentity } from './identity.js';

import type {
  Cli_TestApi_ADTPulseTest_AskQuestion_Identity,
  Cli_TestApi_ADTPulseTest_AskQuestion_Mode,
  Cli_TestApi_ADTPulseTest_AskQuestion_Questions,
  Cli_TestApi_ADTPulseTest_AskQuestion_Returns,
  Cli_TestApi_ADTPulseTest_AskQuestion_RlInterface,
  Cli_TestApi_ADTPulseTest_Constructor_ConfigFoundAndSet,
  Cli_TestApi_ADTPulseTest_Constructor_Instance,
  Cli_TestApi_ADTPulseTest_Constructor_InstanceFunctions,
  Cli_TestApi_ADTPulseTest_Constructor_Response,
  Cli_TestApi_ADTPulseTest_Constructor_UserAcceptedDisclaimer,
  Cli_TestApi_ADTPulseTest_FindConfig_AdtPlatform,
  Cli_TestApi_ADTPulseTest_FindConfig_ParsedFile,
  Cli_TestApi_ADTPulseTest_FindConfig_Platforms,
  Cli_TestApi_ADTPulseTest_FindConfig_PossibleLocations,
  Cli_TestApi_ADTPulseTest_FindConfig_RawFile,
  Cli_TestApi_ADTPulseTest_FindConfig_Returns,
  Cli_TestApi_ADTPulseTest_FindConfig_ValidAdtPlatform,
  Cli_TestApi_ADTPulseTest_PrintTestOutput_IsSuccess,
  Cli_TestApi_ADTPulseTest_PrintTestOutput_Returns,
  Cli_TestApi_ADTPulseTest_SelectedConfigLocation,
  Cli_TestApi_ADTPulseTest_SelectedPlatform,
  Cli_TestApi_ADTPulseTest_ZodParseResponse,
} from '../types/cli/test-api.d.ts';

/**
 * CLI - Test API.
 *
 * Drives a full end-to-end exercise of the ADT Pulse API using the credentials
 * found in the local Homebridge config, so plugin issues can be reproduced
 * outside of a running Homebridge instance.
 *
 * @since 1.0.0
 */
class ADTPulseTest {
  /**
   * CLI - Test API - Selected Config Location.
   *
   * Stores the path of the Homebridge config file that the tester successfully
   * parsed, so later output can reference where the validated configuration
   * came from.
   *
   * @private
   *
   * @since 1.0.0
   */
  #selectedConfigLocation: Cli_TestApi_ADTPulseTest_SelectedConfigLocation;

  /**
   * CLI - Test API - Selected Platform.
   *
   * Holds the validated "ADTPulse" platform configuration extracted from the
   * Homebridge config file, which the tester uses to authenticate against the
   * ADT Pulse portal.
   *
   * @private
   *
   * @since 1.0.0
   */
  #selectedPlatform: Cli_TestApi_ADTPulseTest_SelectedPlatform;

  /**
   * CLI - Test API - Zod Parse Response.
   *
   * Keeps the most recent Zod parse result so that validation errors can be
   * shown to the user when no usable platform configuration is found.
   *
   * @private
   *
   * @since 1.0.0
   */
  #zodParseResponse: Cli_TestApi_ADTPulseTest_ZodParseResponse;

  /**
   * CLI - Test API - Constructor.
   *
   * Runs the interactive test flow as soon as the class is instantiated,
   * walking through the disclaimer, config discovery, and every supported API
   * call in sequence.
   *
   * @since 1.0.0
   */
  public constructor() {
    (async () => {
      try {
        const userAcceptedDisclaimer: Cli_TestApi_ADTPulseTest_Constructor_UserAcceptedDisclaimer = await ADTPulseTest.askQuestion('disclaimer');

        if (userAcceptedDisclaimer === false) {
          exit(0);
        }

        // Used to pad the user input to the next line.
        console.info('\r');

        const configFoundAndSet: Cli_TestApi_ADTPulseTest_Constructor_ConfigFoundAndSet = this.findConfig();

        if (configFoundAndSet === false || this.#selectedPlatform === undefined) {
          ADTPulseTest.printTestOutput(false);

          exit(1);
        }

        const instance: Cli_TestApi_ADTPulseTest_Constructor_Instance = new ADTPulseAPI(
          this.#selectedPlatform,
          {
            debug: true,
            testMode: {
              enabled: true,
            },
          },
        );
        const instanceFunctions: Cli_TestApi_ADTPulseTest_Constructor_InstanceFunctions = [
          instance.login.bind(instance),
          instance.getGatewayInformation.bind(instance),
          instance.getPanelInformation.bind(instance),
          instance.getPanelStatus.bind(instance),
          instance.setPanelStatus.bind(instance, 'off', 'away', false),
          instance.setPanelStatus.bind(instance, 'away', 'stay', false),
          instance.setPanelStatus.bind(instance, 'stay', 'night', false),
          instance.setPanelStatus.bind(instance, 'night', 'off', false),
          instance.getSensorsInformation.bind(instance),
          instance.getSensorsStatus.bind(instance),
          instance.getOrbSecurityButtons.bind(instance),
          instance.performSyncCheck.bind(instance),
          instance.performKeepAlive.bind(instance),
          instance.logout.bind(instance),
        ];

        for (const instanceFunction of instanceFunctions) {
          const response: Cli_TestApi_ADTPulseTest_Constructor_Response = await instanceFunction();

          // If response is not successful, end the test.
          if (response['success'] !== true) {
            ADTPulseTest.printTestOutput(false);

            exit(1);
          }

          // Print success responses.
          console.info(util.inspect(response, {
            showHidden: false,
            depth: Infinity,
            colors: true,
          }));
        }

        ADTPulseTest.printTestOutput(true);

        return exit(0);
      } catch {
        ADTPulseTest.printTestOutput(false);

        return exit(1);
      }
    })();

    return;
  }

  /**
   * CLI - Test API - Find Config.
   *
   * Searches the known Homebridge config locations for a parsable config file
   * that contains a valid "ADTPulse" platform, then caches the location and
   * platform for the test run.
   *
   * @private
   *
   * @returns {Cli_TestApi_ADTPulseTest_FindConfig_Returns}
   *
   * @since 1.0.0
   */
  private findConfig(): Cli_TestApi_ADTPulseTest_FindConfig_Returns {
    const possibleLocations: Cli_TestApi_ADTPulseTest_FindConfig_PossibleLocations = [
      ...(isForwardSlashOS() === true) ? [
        '/homebridge/config.json', // "homebridge" Docker.
        '/var/lib/homebridge/config.json', // Debian or Raspbian.
        `${os.homedir()}/.homebridge/config.json`, // macOS.
      ] : [],
      ...(isForwardSlashOS() === false) ? [`${os.homedir()}\\.homebridge\\config.json`] : [], // Windows.
    ];

    for (let i = 0; i < possibleLocations.length; i += 1) {
      // Don't run again if config location and platform have been selected.
      if (this.#selectedConfigLocation !== undefined && this.#selectedPlatform !== undefined) {
        break;
      }

      debugLog(null, 'test-api.ts / ADTPulseTest.findConfig()', 'info', `Attempt ${i + 1}: Finding the Homebridge config file in "${possibleLocations[i]}"`);

      try {
        const rawFile: Cli_TestApi_ADTPulseTest_FindConfig_RawFile = readFileSync(possibleLocations[i]!, 'utf-8');
        const parsedFile: Cli_TestApi_ADTPulseTest_FindConfig_ParsedFile = JSON.parse(rawFile);
        const platforms: Cli_TestApi_ADTPulseTest_FindConfig_Platforms = _.get(parsedFile, ['platforms']);
        const adtPlatform: Cli_TestApi_ADTPulseTest_FindConfig_AdtPlatform = _.find(platforms, (platform) => _.get(platform, ['platform']) === 'ADTPulse');

        if (adtPlatform !== undefined) {
          const validAdtPlatform: Cli_TestApi_ADTPulseTest_FindConfig_ValidAdtPlatform = platformConfig.safeParse(adtPlatform);

          // Set this to the instance in case "zod" parse failed.
          this.#zodParseResponse = validAdtPlatform;

          if (validAdtPlatform.success === true) {
            this.#selectedConfigLocation = possibleLocations[i];
            this.#selectedPlatform = validAdtPlatform.data;
          }
        }
      } catch {
        this.#selectedConfigLocation = undefined;
        this.#selectedPlatform = undefined;
      }
    }

    if (this.#selectedConfigLocation === undefined || this.#selectedPlatform === undefined) {
      debugLog(null, 'test-api.ts / ADTPulseTest.findConfig()', 'error', 'Unable to find a parsable Homebridge config file with a validated "ADTPulse" platform');

      if (this.#zodParseResponse !== undefined) {
        debugLog(null, 'test-api.ts / ADTPulseTest.findConfig()', 'warn', 'If you just upgraded from "v2 to v3" or from "v3 to v3.1", please update your configuration');
        debugLog(null, 'test-api.ts / ADTPulseTest.findConfig()', 'warn', 'Carefully observe the error below. The answer you are looking for is there');
        stackTracer('zod-error', this.#zodParseResponse);
      }

      return false;
    }

    debugLog(null, 'test-api.ts / ADTPulseTest.findConfig()', 'success', `Found valid Homebridge config in "${this.#selectedConfigLocation}"`);

    return true;
  }

  /**
   * CLI - Test API - Ask Question.
   *
   * Prompts the user through the terminal and waits for their response, which
   * gates the test run behind an explicit disclaimer acknowledgment.
   *
   * @param {Cli_TestApi_ADTPulseTest_AskQuestion_Mode} mode - Mode.
   *
   * @private
   *
   * @returns {Cli_TestApi_ADTPulseTest_AskQuestion_Returns}
   *
   * @since 1.0.0
   */
  private static async askQuestion(mode: Cli_TestApi_ADTPulseTest_AskQuestion_Mode): Cli_TestApi_ADTPulseTest_AskQuestion_Returns {
    const rlInterface: Cli_TestApi_ADTPulseTest_AskQuestion_RlInterface = readline.createInterface({
      input: stdin,
      output: stdout,
    });
    const identity: Cli_TestApi_ADTPulseTest_AskQuestion_Identity = resolveCliIdentity();
    const questions: Cli_TestApi_ADTPulseTest_AskQuestion_Questions = {
      disclaimer: [
        CLIHeader.render([
          chalk.cyanBright('ADT Pulse for Homebridge Plugin Test'),
          chalk.cyanBright(identity['repository']),
          '',
          chalk.cyanBright(identity['copyright']),
        ], {
          style: 'round',
          width: 72,
          paddingX: 4,
          paddingY: 1,
        }),
        '',
        'Before you begin, please make sure of the following:',
        '',
        '1. You have the proper authorization to carry out system testing.',
        '2. You are currently ON THE PROPERTY where the test is being conducted.',
        '3. You have disarmed the system and have >= 1 door/window open.',
        '4. You have access to MyADT and have placed the system in test mode.',
        '',
        `${chalk.redBright('WARNING')}: If you DO NOT have access to MyADT or CANNOT place the system into`,
        'test mode, please DO NOT PROCEED. The author is NOT RESPONSIBLE if the test causes',
        'an accidental trigger or if ADT agents/local authorities become involved.',
        '',
        `${chalk.yellowBright('NOTICE')}: The API gathers anonymous analytics to detect potential bugs or issues.`,
        '        All personally identifiable information will be redacted.',
        '',
        chalk.yellowBright('Type "I Agree" (without quotes) to fully acknowledge that you have read through'),
        chalk.yellowBright('and understood the instructions, and agree to the disclaimer above ...'),
        '➜ ',
      ].join('\n'),
    };

    return new Promise((resolve) => {
      rlInterface.question(questions[mode], (input) => {
        if (input !== 'I Agree') {
          resolve(false);
        }

        resolve(true);

        return;
      });

      return;
    });
  }

  /**
   * CLI - Test API - Print Test Output.
   *
   * Prints a banner summarizing whether the test run passed or failed so the
   * result is obvious at the end of the console output.
   *
   * @param {Cli_TestApi_ADTPulseTest_PrintTestOutput_IsSuccess} isSuccess - Is success.
   *
   * @private
   *
   * @returns {Cli_TestApi_ADTPulseTest_PrintTestOutput_Returns}
   *
   * @since 1.0.0
   */
  private static printTestOutput(isSuccess: Cli_TestApi_ADTPulseTest_PrintTestOutput_IsSuccess): Cli_TestApi_ADTPulseTest_PrintTestOutput_Returns {
    if (isSuccess === false) {
      console.info([
        '',
        CLIHeader.render([
          chalk.redBright('Test has failed!'),
          chalk.redBright('Please check the error response above,'),
          chalk.redBright('attempt to resolve them, then run this tester again'),
        ], {
          style: 'round',
          width: 72,
          paddingX: 4,
        }),
      ].join('\n'));

      return;
    }

    console.info([
      '',
      CLIHeader.render([
        chalk.greenBright('Test has completed!'),
        chalk.greenBright('If you find my plugin useful, please consider'),
        chalk.greenBright('donating to my efforts via GitHub Sponsors'),
      ], {
        style: 'round',
        width: 72,
        paddingX: 4,
      }),
    ].join('\n'));

    return;
  }
}

/**
 * CLI - Test API - Adt Pulse Test.
 *
 * Instantiates the API tester entry point so it can be launched as a script and
 * exported for consumers that need to run the end-to-end exercise.
 *
 * @since 1.0.0
 */
const adtPulseTest = new ADTPulseTest();

export default adtPulseTest;
