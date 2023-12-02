import chalk from 'chalk';
import { readFileSync } from 'fs';
import _ from 'lodash';
import os from 'os';
import readline from 'readline';
import util from 'util';

import { ADTPulse } from '@/lib/api';
import { platformConfig } from '@/lib/schema';
import { debugLog } from '@/lib/utility';
import type {
  ADTPulseTestAskQuestionMode,
  ADTPulseTestAskQuestionReturns,
  ADTPulseTestFindConfigParsedFile,
  ADTPulseTestFindConfigPossibleLocations,
  ADTPulseTestFindConfigRawFile,
  ADTPulseTestFindConfigReturns,
  ADTPulseTestPrintTestOutputIsSuccess,
  ADTPulseTestPrintTestOutputReturns,
  ADTPulseTestSelectedConfigLocation,
  ADTPulseTestSelectedPlatform,
  ADTPulseTestStartTestReturns,
} from '@/types';

/**
 * ADT Pulse Test.
 *
 * @since 1.0.0
 */
class ADTPulseTest {
  /**
   * ADT Pulse Test - Selected config location.
   *
   * @private
   *
   * @since 1.0.0
   */
  #selectedConfigLocation: ADTPulseTestSelectedConfigLocation;

  /**
   * ADT Pulse Test - Selected platform.
   *
   * @private
   *
   * @since 1.0.0
   */
  #selectedPlatform: ADTPulseTestSelectedPlatform;

  /**
   * ADT Pulse Test - Start test.
   *
   * @returns {ADTPulseTestStartTestReturns}
   *
   * @since 1.0.0
   */
  async startTest(): ADTPulseTestStartTestReturns {
    try {
      const userAcceptedDisclaimer = await ADTPulseTest.askQuestion('disclaimer');

      if (!userAcceptedDisclaimer) {
        process.exit(0);
      }

      // Used to pad the user input away from the next line.
      console.log('\r');

      const configFoundAndSet = this.findConfig();

      if (!configFoundAndSet || this.#selectedPlatform === undefined) {
        ADTPulseTest.printTestOutput(false);

        process.exit(1);
      }

      const instance = new ADTPulse(_.merge(
        this.#selectedPlatform,
        {
          debug: true,
        },
      ), {
        baseUrl: `https://${this.#selectedPlatform.subdomain}.adtpulse.com`,
        testMode: {
          enabled: true,
          isDisarmChecked: false,
        },
      });
      const instanceFunctions = [
        instance.login.bind(instance),
        instance.getGatewayInformation.bind(instance),
        instance.getPanelInformation.bind(instance),
        instance.getPanelStatus.bind(instance),
        instance.setPanelStatus.bind(instance, 'away'),
        instance.setPanelStatus.bind(instance, 'stay'),
        instance.setPanelStatus.bind(instance, 'night'),
        instance.setPanelStatus.bind(instance, 'off'),
        instance.getSensorStatuses.bind(instance),
        instance.performSyncCheck.bind(instance),
        instance.performKeepAlive.bind(instance),
        instance.logout.bind(instance),
      ];

      for (let i = 0; i < instanceFunctions.length; i += 1) {
        const response = await instanceFunctions[i]();

        if (!response.success) {
          ADTPulseTest.printTestOutput(false);

          process.exit(1);
        }

        console.log(util.inspect(response, {
          showHidden: false,
          depth: null,
          colors: true,
        }));
      }

      ADTPulseTest.printTestOutput(true);

      process.exit(0);
    } catch (error) {
      ADTPulseTest.printTestOutput(false);

      process.exit(1);
    }
  }

  /**
   * ADT Pulse Test - Find config.
   *
   * @returns {ADTPulseTestFindConfigReturns}
   *
   * @since 1.0.0
   */
  findConfig(): ADTPulseTestFindConfigReturns {
    const possibleLocations: ADTPulseTestFindConfigPossibleLocations = [
      '/homebridge/config.json', // "homebridge" Docker.
      '/var/lib/homebridge/config.json', // Debian or Raspbian.
      `${os.homedir()}/.homebridge/config.json`, // macOS.
      `${os.homedir()}\\.homebridge\\config.json`, // Windows.
    ];

    for (let i = 0; i < possibleLocations.length; i += 1) {
      // Don't run again if config location and platform have been selected.
      if (this.#selectedConfigLocation !== undefined && this.#selectedPlatform !== undefined) {
        break;
      }

      debugLog('test-api.ts', 'info', `Attempt ${i + 1}: Finding the Homebridge config file in "${possibleLocations[i]}"`);

      try {
        const rawFile: ADTPulseTestFindConfigRawFile = readFileSync(possibleLocations[i], 'utf-8');
        const parsedFile: ADTPulseTestFindConfigParsedFile = JSON.parse(rawFile);
        const platforms = _.get(parsedFile, ['platforms']);
        const adtPlatform = _.find(platforms, (platform) => _.get(platform, ['platform']) === 'ADTPulse');

        if (adtPlatform !== undefined) {
          const validAdtPlatform = platformConfig.safeParse(adtPlatform);

          if (validAdtPlatform.success) {
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
      debugLog('test-api.ts', 'error', 'Unable to find a parsable Homebridge config file with a validated "ADTPulse" platform');

      return false;
    }

    debugLog('test-api.ts', 'info', `Found valid Homebridge config in "${this.#selectedConfigLocation}"`);

    return true;
  }

  /**
   * ADT Pulse Test - Ask question.
   *
   * @param {ADTPulseTestAskQuestionMode} mode - Mode.
   *
   * @returns {ADTPulseTestAskQuestionReturns}
   *
   * @since 1.0.0
   */
  static async askQuestion(mode: ADTPulseTestAskQuestionMode): ADTPulseTestAskQuestionReturns {
    const rlInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const questions = {
      disclaimer: [
        chalk.cyanBright('##############################################################'),
        chalk.cyanBright('####         ADT Pulse for Homebridge Plugin Test         ####'),
        chalk.cyanBright('#### https://github.com/mrjackyliang/homebridge-adt-pulse ####'),
        chalk.cyanBright('####                                                      ####'),
        chalk.cyanBright('####     Copyright (c) 2023 Jacky Liang. ISC License.     ####'),
        chalk.cyanBright('##############################################################'),
        'Before you begin, please make sure of the following:',
        '',
        '1. You have the proper authorization to carry out system testing.',
        '2. You are currently ON THE PROPERTY where the test is being conducted.',
        '3. You have disarmed the system and have >= 1 door/window open.',
        '4. You have access to MyADT and have placed the system in test mode.',
        '',
        `${chalk.redBright('WARNING:')} If you DO NOT have access to MyADT or CANNOT place the system into`,
        'test mode, please DO NOT PROCEED. The author is NOT RESPONSIBLE if the test causes',
        'an accidental trigger or if ADT agents/local authorities become involved.',
        '',
        chalk.yellowBright('Type "I Agree" (without quotes) to acknowledge that you have read through,'),
        chalk.yellowBright('understood, and agree to the disclaimer and instructions above ...'),
        '➜ ',
      ].join('\n'),
    };

    return new Promise((resolve) => {
      rlInterface.question(questions[mode], (input) => {
        if (input !== 'I Agree') {
          resolve(false);
        }

        resolve(true);
      });
    });
  }

  /**
   * ADT Pulse Test - Print test output.
   *
   * @param {ADTPulseTestPrintTestOutputIsSuccess} isSuccess - Is success.
   *
   * @returns {ADTPulseTestPrintTestOutputReturns}
   *
   * @since 1.0.0
   */
  static printTestOutput(isSuccess: ADTPulseTestPrintTestOutputIsSuccess): ADTPulseTestPrintTestOutputReturns {
    if (!isSuccess) {
      console.log([
        '',
        chalk.redBright('########################################################################'),
        chalk.redBright('#####       Test has failed! Please check the error response       #####'),
        chalk.redBright('#####  above, attempt to resolve them, then run this tester again  #####'),
        chalk.redBright('########################################################################'),
      ].join('\n'));

      return;
    }

    console.log([
      '',
      chalk.greenBright('########################################################################'),
      chalk.greenBright('#####       Test has completed! If you find my plugin useful       #####'),
      chalk.greenBright('#####  please consider donating to my efforts via GitHub Sponsors  #####'),
      chalk.greenBright('########################################################################'),
    ].join('\n'));
  }
}

const instance = new ADTPulseTest();
await instance.startTest();
