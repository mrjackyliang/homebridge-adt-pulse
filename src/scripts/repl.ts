import chalk from 'chalk';
import repl from 'node:repl';

import { ADTPulse } from '@/lib/api.js';
import type {
  ADTPulseDisplayHelpHeaderReturns,
  ADTPulseDisplayHelpMenuReturns,
  ADTPulseDisplayStartupHeaderReturns,
  ADTPulseReplApi,
  ADTPulseReplColorLogMessage,
  ADTPulseReplColorLogReturns,
  ADTPulseReplColorLogType,
  ADTPulseReplReplServer,
  ADTPulseReplSetInstanceFingerprint,
  ADTPulseReplSetInstancePassword,
  ADTPulseReplSetInstanceReturns,
  ADTPulseReplSetInstanceSubdomain,
  ADTPulseReplSetInstanceUsername,
  ADTPulseReplStartReplReturns,
} from '@/types/index.d.ts';

/**
 * ADT Pulse Repl.
 *
 * @since 1.0.0
 */
class ADTPulseRepl {
  /**
   * ADT Pulse Repl - Api.
   *
   * @private
   *
   * @since 1.0.0
   */
  #api: ADTPulseReplApi;

  /**
   * ADT Pulse Repl - Repl server.
   *
   * @private
   *
   * @since 1.0.0
   */
  #replServer: ADTPulseReplReplServer;

  /**
   * ADT Pulse Repl - Start repl.
   *
   * @returns {ADTPulseReplStartReplReturns}
   *
   * @since 1.0.0
   */
  public async startRepl(): ADTPulseReplStartReplReturns {
    ADTPulseRepl.displayStartupHeader();
    ADTPulseRepl.displayHelpMenu();

    // Start the REPL server.
    this.#replServer = repl.start({
      ignoreUndefined: true,
      prompt: '> ',
    });

    // Set the REPL server context on start-up.
    this.#replServer.context.repl = this;

    // Replace the default ".break" command.
    this.#replServer.defineCommand('break', {
      help: 'Sometimes you get stuck, this gets you out',
      action() {
        ADTPulseRepl.colorLog('error', 'The ".break" command is not allowed.');
        this.displayPrompt();
      },
    });

    // Replace the default ".clear" command.
    this.#replServer.defineCommand('clear', {
      help: 'Break, and also clear the local context',
      action() {
        ADTPulseRepl.colorLog('error', 'The ".clear" command is not allowed.');
        this.displayPrompt();
      },
    });

    // Replace the default ".editor" command.
    this.#replServer.defineCommand('editor', {
      help: 'Enter editor mode',
      action() {
        ADTPulseRepl.colorLog('error', 'The ".editor" command is not allowed.');
        this.displayPrompt();
      },
    });

    // Replace the default ".help" command.
    this.#replServer.defineCommand('help', {
      help: 'Print this help message',
      action() {
        ADTPulseRepl.displayHelpHeader();
        ADTPulseRepl.displayHelpMenu();
        this.displayPrompt();
      },
    });

    // Replace the default ".load" command.
    this.#replServer.defineCommand('load', {
      help: 'Load JS from a file into the REPL session',
      action() {
        ADTPulseRepl.colorLog('error', 'The ".load" command is not allowed.');
        this.displayPrompt();
      },
    });

    // Replace the default ".save" command.
    this.#replServer.defineCommand('save', {
      help: 'Save all evaluated commands in this REPL session to a file',
      action() {
        ADTPulseRepl.colorLog('error', 'The ".save" command is not allowed.');
        this.displayPrompt();
      },
    });
  }

  /**
   * ADT Pulse Repl - Set instance.
   *
   * @param {ADTPulseReplSetInstanceSubdomain}   subdomain   - Subdomain.
   * @param {ADTPulseReplSetInstanceUsername}    username    - Username.
   * @param {ADTPulseReplSetInstancePassword}    password    - Password.
   * @param {ADTPulseReplSetInstanceFingerprint} fingerprint - Fingerprint.
   *
   * @returns {ADTPulseReplSetInstanceReturns}
   *
   * @since 1.0.0
   */
  public setInstance(subdomain: ADTPulseReplSetInstanceSubdomain, username: ADTPulseReplSetInstanceUsername, password: ADTPulseReplSetInstancePassword, fingerprint: ADTPulseReplSetInstanceFingerprint): ADTPulseReplSetInstanceReturns {
    if (subdomain !== 'portal' && subdomain !== 'portal-ca') {
      ADTPulseRepl.colorLog('error', 'Invalid subdomain specified. Valid values are either "portal" or "portal-ca".');

      return;
    }

    if (typeof username !== 'string' || username === '') {
      ADTPulseRepl.colorLog('error', 'Username must be a string and cannot be empty.');

      return;
    }

    if (typeof password !== 'string' || password === '') {
      ADTPulseRepl.colorLog('error', 'Password must be a string and cannot be empty.');

      return;
    }

    if (typeof fingerprint !== 'string' || fingerprint === '') {
      ADTPulseRepl.colorLog('error', 'Fingerprint must be a string and cannot be empty.');

      return;
    }

    // If the values are valid, set a new instance.
    this.#api = new ADTPulse({
      platform: 'ADTPulse',
      name: 'ADT Pulse',
      subdomain,
      username,
      password,
      fingerprint,
      mode: 'normal',
      speed: 1,
      sensors: [],
    }, {
      debug: true,
    });

    // Check if "this.#replServer" was properly set during startup.
    if (this.#replServer === undefined) {
      ADTPulseRepl.colorLog('error', 'Failed to set context because "this.#replServer" is undefined.');

      return;
    }

    // Set the REPL server context after setting the instance.
    this.#replServer.context.api = this.#api;

    ADTPulseRepl.colorLog('info', 'Instance has been successfully set.');
    ADTPulseRepl.colorLog('info', 'You may now use the available API methods to test the system!');
    ADTPulseRepl.colorLog('info', '\n');
  }

  /**
   * ADT Pulse Repl - Color log.
   *
   * @param {ADTPulseReplColorLogType}    type    - Type.
   * @param {ADTPulseReplColorLogMessage} message - Message.
   *
   * @private
   *
   * @returns {ADTPulseReplColorLogReturns}
   *
   * @since 1.0.0
   */
  private static colorLog(type: ADTPulseReplColorLogType, message: ADTPulseReplColorLogMessage): ADTPulseReplColorLogReturns {
    switch (type) {
      case 'error':
        console.error(chalk.redBright(message));
        break;
      case 'info':
        console.info(chalk.greenBright(message));
        break;
      default:
        break;
    }
  }

  /**
   * ADT Pulse Repl - Display help header.
   *
   * @returns {ADTPulseDisplayHelpHeaderReturns}
   *
   * @since 1.0.0
   */
  private static displayHelpHeader(): ADTPulseDisplayHelpHeaderReturns {
    console.info([
      chalk.cyanBright('########################################################'),
      chalk.cyanBright('#### ADT Pulse for Homebridge Plugin REPL Help Menu ####'),
      chalk.cyanBright('########################################################'),
      '',
      'This is the help menu on how to use this REPL interface. If you have questions on how',
      'to use this, please refer to the documentation using the link below:',
      '',
      'https://github.com/mrjackyliang/homebridge-adt-pulse',
    ].join('\n'));
  }

  /**
   * ADT Pulse Repl - Display help menu.
   *
   * @returns {ADTPulseDisplayHelpMenuReturns}
   *
   * @since 1.0.0
   */
  private static displayHelpMenu(): ADTPulseDisplayHelpMenuReturns {
    console.info([
      '',
      chalk.bold('Method parameter documentation:'),
      `    {'portal' | 'portal-ca'}           ${chalk.magentaBright('subdomain')}   - Set the domain for either USA or Canada subscribers`,
      `    {string}                           ${chalk.magentaBright('username')}    - The username for logging in to ADT Pulse portal`,
      `    {string}                           ${chalk.magentaBright('password')}    - The password for logging in to ADT Pulse portal`,
      `    {string}                           ${chalk.magentaBright('fingerprint')} - The fingerprint for logging in to ADT Pulse portal`,
      `    {'arm' | 'night' | 'off' | 'stay'} ${chalk.magentaBright('armTo')}       - Available methods to arm the system`,
      '',
      chalk.bold('Before you use the API, set the instance using this command:'),
      `    ${chalk.yellowBright(`repl.setInstance(${chalk.magentaBright('subdomain')}, ${chalk.magentaBright('username')}, ${chalk.magentaBright('password')}, ${chalk.magentaBright('fingerprint')});`)}`,
      '',
      chalk.bold('Once an instance is set, interact with the portal using these methods:'),
      `    ${chalk.yellowBright('await api.login();')}`,
      `    ${chalk.yellowBright('await api.logout();')}`,
      `    ${chalk.yellowBright('await api.getGatewayInformation();')}`,
      `    ${chalk.yellowBright('await api.getPanelInformation();')}`,
      `    ${chalk.yellowBright('await api.getPanelStatus();')}`,
      `    ${chalk.yellowBright(`await api.setPanelStatus(${chalk.magentaBright('armTo')});`)}`,
      `    ${chalk.yellowBright('await api.getSensorsInformation();')}`,
      `    ${chalk.yellowBright('await api.getSensorsStatus();')}`,
      `    ${chalk.yellowBright('await api.performSyncCheck();')}`,
      `    ${chalk.yellowBright('await api.performKeepAlive();')}`,
      `    ${chalk.yellowBright('      api.isAuthenticated();')}`,
      '',
      chalk.bold('You may also wrap the above methods with this to see the entire response:'),
      `    ${chalk.yellowBright(`console.log(util.inspect(${chalk.magentaBright('replace me without the ending semi-colon')}, false, null, true));`)}`,
      chalk.bold('A small reference for REPL commands:'),
      `    ${chalk.yellowBright('.exit')}`,
      `    ${chalk.yellowBright('.help')}`,
      '',
    ].join('\n'));
  }

  /**
   * ADT Pulse Repl - Display startup header.
   *
   * @returns {ADTPulseDisplayStartupHeaderReturns}
   *
   * @since 1.0.0
   */
  private static displayStartupHeader(): ADTPulseDisplayStartupHeaderReturns {
    console.info([
      chalk.cyanBright('##############################################################'),
      chalk.cyanBright('####         ADT Pulse for Homebridge Plugin REPL         ####'),
      chalk.cyanBright('#### https://github.com/mrjackyliang/homebridge-adt-pulse ####'),
      chalk.cyanBright('####                                                      ####'),
      chalk.cyanBright('####     Copyright (c) 2023 Jacky Liang. ISC License.     ####'),
      chalk.cyanBright('##############################################################'),
      '',
      'Welcome to the REPL interface for ADT Pulse for Homebridge. This interface',
      'allows you to interact with the ADT Pulse portal via the included API and is designed',
      `for advanced users only. ${chalk.redBright('PLEASE USE WITH CAUTION, NO WARRANTY IS PROVIDED.')}`,
      '',
      `${chalk.yellowBright('NOTICE')}: The API gathers anonymous analytics to detect potential bugs or issues.`,
      '        All personally identifiable information will be redacted.',
    ].join('\n'));
  }
}

const adtPulseRepl = new ADTPulseRepl();
await adtPulseRepl.startRepl();
