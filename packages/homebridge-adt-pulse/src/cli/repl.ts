import repl from 'node:repl';

import { CLIHeader } from '@cbnventures/nova/toolkit';
import chalk from 'chalk';

import { ADTPulseAPI } from '../lib/api.js';
import { ADTPulseAuth } from '../lib/auth.js';
import { debugLog } from '../lib/utility.js';
import { resolveCliIdentity } from './identity.js';

import type {
  Cli_Repl_ADTPulseRepl_Api,
  Cli_Repl_ADTPulseRepl_Auth,
  Cli_Repl_ADTPulseRepl_Constructor_Action_Returns,
  Cli_Repl_ADTPulseRepl_DisplayHelpHeader_Identity,
  Cli_Repl_ADTPulseRepl_DisplayHelpHeader_Returns,
  Cli_Repl_ADTPulseRepl_DisplayHelpMenu_Returns,
  Cli_Repl_ADTPulseRepl_DisplayStartupHeader_Identity,
  Cli_Repl_ADTPulseRepl_DisplayStartupHeader_Returns,
  Cli_Repl_ADTPulseRepl_ReplServer,
  Cli_Repl_ADTPulseRepl_SetApiInstance_Fingerprint,
  Cli_Repl_ADTPulseRepl_SetApiInstance_Password,
  Cli_Repl_ADTPulseRepl_SetApiInstance_Returns,
  Cli_Repl_ADTPulseRepl_SetApiInstance_Subdomain,
  Cli_Repl_ADTPulseRepl_SetApiInstance_Username,
  Cli_Repl_ADTPulseRepl_SetAuthInstance_Password,
  Cli_Repl_ADTPulseRepl_SetAuthInstance_Returns,
  Cli_Repl_ADTPulseRepl_SetAuthInstance_Subdomain,
  Cli_Repl_ADTPulseRepl_SetAuthInstance_Username,
} from '../types/cli/repl.d.ts';

/**
 * CLI - Repl.
 *
 * Provides an interactive console that exposes the ADT Pulse API and auth
 * helpers, letting advanced users exercise portal requests manually without
 * running the full Homebridge plugin.
 *
 * @since 1.0.0
 */
class ADTPulseRepl {
  /**
   * CLI - Repl - Api.
   *
   * Holds the ADTPulseAPI instance created through "setApiInstance()" so the
   * console can share one authenticated session across commands.
   *
   * @private
   *
   * @since 1.0.0
   */
  #api: Cli_Repl_ADTPulseRepl_Api;

  /**
   * CLI - Repl - Auth.
   *
   * Holds the ADTPulseAuth instance created through "setAuthInstance()" so the
   * console can walk through multi-factor verification flows.
   *
   * @private
   *
   * @since 1.0.0
   */
  #auth: Cli_Repl_ADTPulseRepl_Auth;

  /**
   * CLI - Repl - Repl Server.
   *
   * Keeps a reference to the Node.js REPL server so instance methods can
   * attach the API and auth objects to the interactive context.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #replServer: Cli_Repl_ADTPulseRepl_ReplServer;

  /**
   * CLI - Repl - Constructor.
   *
   * Prints the startup banners, boots the REPL server, and replaces unsafe
   * default commands so users cannot break out of the guarded session.
   *
   * @since 1.0.0
   */
  public constructor() {
    ADTPulseRepl.displayStartupHeader();

    ADTPulseRepl.displayHelpMenu();

    // Start the REPL server.
    this.#replServer = repl.start({
      ignoreUndefined: true,
      prompt: '> ',
    });

    // Set the REPL server context on start-up.
    Reflect.set(this.#replServer.context, 'repl', this);

    // Replace the default ".break" command.
    this.#replServer.defineCommand('break', {
      help: 'Sometimes you get stuck, this gets you out',
      action(): Cli_Repl_ADTPulseRepl_Constructor_Action_Returns {
        debugLog(null, 'repl.ts / ADTPulseRepl.startRepl()', 'error', 'The ".break" command is not allowed');

        this.displayPrompt();

        return;
      },
    });

    // Replace the default ".clear" command.
    this.#replServer.defineCommand('clear', {
      help: 'Break, and also clear the local context',
      action(): Cli_Repl_ADTPulseRepl_Constructor_Action_Returns {
        debugLog(null, 'repl.ts / ADTPulseRepl.startRepl()', 'error', 'The ".clear" command is not allowed');

        this.displayPrompt();

        return;
      },
    });

    // Replace the default ".editor" command.
    this.#replServer.defineCommand('editor', {
      help: 'Enter editor mode',
      action(): Cli_Repl_ADTPulseRepl_Constructor_Action_Returns {
        debugLog(null, 'repl.ts / ADTPulseRepl.startRepl()', 'error', 'The ".editor" command is not allowed');

        this.displayPrompt();

        return;
      },
    });

    // Replace the default ".help" command.
    this.#replServer.defineCommand('help', {
      help: 'Print this help message',
      action(): Cli_Repl_ADTPulseRepl_Constructor_Action_Returns {
        ADTPulseRepl.displayHelpHeader();

        ADTPulseRepl.displayHelpMenu();

        this.displayPrompt();

        return;
      },
    });

    // Replace the default ".load" command.
    this.#replServer.defineCommand('load', {
      help: 'Load JS from a file into the REPL session',
      action(): Cli_Repl_ADTPulseRepl_Constructor_Action_Returns {
        debugLog(null, 'repl.ts / ADTPulseRepl.startRepl()', 'error', 'The ".load" command is not allowed');

        this.displayPrompt();

        return;
      },
    });

    // Replace the default ".save" command.
    this.#replServer.defineCommand('save', {
      help: 'Save all evaluated commands in this REPL session to a file',
      action(): Cli_Repl_ADTPulseRepl_Constructor_Action_Returns {
        debugLog(null, 'repl.ts / ADTPulseRepl.startRepl()', 'error', 'The ".save" command is not allowed');

        this.displayPrompt();

        return;
      },
    });

    return;
  }

  /**
   * CLI - Repl - Set API Instance.
   *
   * Validates the given portal credentials and swaps in a fresh ADTPulseAPI
   * instance, exposing it on the REPL context as the "api" global.
   *
   * @param {Cli_Repl_ADTPulseRepl_SetApiInstance_Subdomain}   subdomain   - Subdomain.
   * @param {Cli_Repl_ADTPulseRepl_SetApiInstance_Username}    username    - Username.
   * @param {Cli_Repl_ADTPulseRepl_SetApiInstance_Password}    password    - Password.
   * @param {Cli_Repl_ADTPulseRepl_SetApiInstance_Fingerprint} fingerprint - Fingerprint.
   *
   * @returns {Cli_Repl_ADTPulseRepl_SetApiInstance_Returns}
   *
   * @since 1.0.0
   */
  public setApiInstance(subdomain: Cli_Repl_ADTPulseRepl_SetApiInstance_Subdomain, username: Cli_Repl_ADTPulseRepl_SetApiInstance_Username, password: Cli_Repl_ADTPulseRepl_SetApiInstance_Password, fingerprint: Cli_Repl_ADTPulseRepl_SetApiInstance_Fingerprint): Cli_Repl_ADTPulseRepl_SetApiInstance_Returns {
    if (subdomain !== 'portal' && subdomain !== 'portal-ca') {
      debugLog(null, 'repl.ts / ADTPulseRepl.setApiInstance()', 'error', 'Invalid subdomain specified. Valid values are either "portal" or "portal-ca"');

      return;
    }

    if (typeof username !== 'string' || username === '') {
      debugLog(null, 'repl.ts / ADTPulseRepl.setApiInstance()', 'error', 'Username must be a string and cannot be empty');

      return;
    }

    if (typeof password !== 'string' || password === '') {
      debugLog(null, 'repl.ts / ADTPulseRepl.setApiInstance()', 'error', 'Password must be a string and cannot be empty');

      return;
    }

    if (typeof fingerprint !== 'string' || fingerprint === '') {
      debugLog(null, 'repl.ts / ADTPulseRepl.setApiInstance()', 'error', 'Fingerprint must be a string and cannot be empty');

      return;
    }

    // If the values are valid, set a new instance.
    this.#api = new ADTPulseAPI({
      platform: 'ADTPulse',
      name: 'ADT Pulse',
      subdomain,
      username,
      password,
      fingerprint,
      mode: 'normal',
      speed: 1,
      options: [],
      sensors: [],
    }, {
      debug: true,
    });

    // Check if "this.#replServer" was properly set during startup.
    if (this.#replServer === undefined) {
      debugLog(null, 'repl.ts / ADTPulseRepl.setApiInstance()', 'error', 'Failed to set API context because "this.#replServer" is undefined');

      return;
    }

    // Set the REPL server context after setting the instance.
    Reflect.set(this.#replServer.context, 'api', this.#api);

    debugLog(null, 'repl.ts / ADTPulseRepl.setApiInstance()', 'success', 'API instance has been successfully set');

    return;
  }

  /**
   * CLI - Repl - Set Auth Instance.
   *
   * Validates the given portal credentials and swaps in a fresh ADTPulseAuth
   * instance, exposing it on the REPL context as the "auth" global.
   *
   * @param {Cli_Repl_ADTPulseRepl_SetAuthInstance_Subdomain} subdomain - Subdomain.
   * @param {Cli_Repl_ADTPulseRepl_SetAuthInstance_Username}  username  - Username.
   * @param {Cli_Repl_ADTPulseRepl_SetAuthInstance_Password}  password  - Password.
   *
   * @returns {Cli_Repl_ADTPulseRepl_SetAuthInstance_Returns}
   *
   * @since 1.0.0
   */
  public setAuthInstance(subdomain: Cli_Repl_ADTPulseRepl_SetAuthInstance_Subdomain, username: Cli_Repl_ADTPulseRepl_SetAuthInstance_Username, password: Cli_Repl_ADTPulseRepl_SetAuthInstance_Password): Cli_Repl_ADTPulseRepl_SetAuthInstance_Returns {
    if (subdomain !== 'portal' && subdomain !== 'portal-ca') {
      debugLog(null, 'repl.ts / ADTPulseRepl.setAuthInstance()', 'error', 'Invalid subdomain specified. Valid values are either "portal" or "portal-ca"');

      return;
    }

    if (typeof username !== 'string' || username === '') {
      debugLog(null, 'repl.ts / ADTPulseRepl.setAuthInstance()', 'error', 'Username must be a string and cannot be empty');

      return;
    }

    if (typeof password !== 'string' || password === '') {
      debugLog(null, 'repl.ts / ADTPulseRepl.setAuthInstance()', 'error', 'Password must be a string and cannot be empty');

      return;
    }

    // If the values are valid, set a new instance.
    this.#auth = new ADTPulseAuth({
      subdomain,
      username,
      password,
    }, {
      debug: true,
    });

    // Check if "this.#replServer" was properly set during startup.
    if (this.#replServer === undefined) {
      debugLog(null, 'repl.ts / ADTPulseRepl.setAuthInstance()', 'error', 'Failed to set auth context because "this.#replServer" is undefined');

      return;
    }

    // Set the REPL server context after setting the instance.
    Reflect.set(this.#replServer.context, 'auth', this.#auth);

    debugLog(null, 'repl.ts / ADTPulseRepl.setAuthInstance()', 'success', 'Auth instance has been successfully set');

    return;
  }

  /**
   * CLI - Repl - Display Help Header.
   *
   * Prints the banner shown at the top of the help output so users can tell
   * the help listing apart from regular REPL responses.
   *
   * @private
   *
   * @returns {Cli_Repl_ADTPulseRepl_DisplayHelpHeader_Returns}
   *
   * @since 1.0.0
   */
  private static displayHelpHeader(): Cli_Repl_ADTPulseRepl_DisplayHelpHeader_Returns {
    const identity: Cli_Repl_ADTPulseRepl_DisplayHelpHeader_Identity = resolveCliIdentity();

    console.info([
      CLIHeader.render([chalk.cyanBright('ADT Pulse for Homebridge Plugin REPL Help Menu')], {
        style: 'round',
        width: 72,
        paddingX: 4,
      }),
      '',
      'This is the help menu on how to use this REPL interface. If you have questions on how',
      'to use this, please refer to the documentation using the link below:',
      '',
      identity['repository'],
    ].join('\n'));

    return;
  }

  /**
   * CLI - Repl - Display Help Menu.
   *
   * Prints the list of supported REPL methods along with their parameter
   * descriptions so users know how to drive the API and auth instances.
   *
   * @private
   *
   * @returns {Cli_Repl_ADTPulseRepl_DisplayHelpMenu_Returns}
   *
   * @since 1.0.0
   */
  private static displayHelpMenu(): Cli_Repl_ADTPulseRepl_DisplayHelpMenu_Returns {
    console.info([
      '',
      chalk.bold('Method parameter documentation:'),
      `    {'portal' | 'portal-ca'}           ${chalk.magentaBright('subdomain')}     - Set the domain for either USA or Canada subscribers`,
      `    {string}                           ${chalk.magentaBright('username')}      - The username for logging in to ADT Pulse portal`,
      `    {string}                           ${chalk.magentaBright('password')}      - The password for logging in to ADT Pulse portal`,
      `    {string}                           ${chalk.magentaBright('fingerprint')}   - The fingerprint for logging in to ADT Pulse portal`,
      `    {'arm' | 'night' | 'off' | 'stay'} ${chalk.magentaBright('armFrom')}       - Specify the current system arm state`,
      `    {'arm' | 'night' | 'off' | 'stay'} ${chalk.magentaBright('armTo')}         - Specify the arm state you would like to set`,
      `    {boolean}                          ${chalk.magentaBright('isAlarmActive')} - If the alarm system is ringing`,
      `    {string}                           ${chalk.magentaBright('methodId')}      - Which device to request a verification code from (usually "SMS" or "EMAIL")`,
      `    {string}                           ${chalk.magentaBright('otpCode')}       - The one-time password code received from the verification method`,
      `    {string}                           ${chalk.magentaBright('deviceName')}    - The name to use when saving as a trusted device after verification`,
      '',
      chalk.bold('Before you use the API, set the instances using this command:'),
      `    ${chalk.yellowBright(`repl.setApiInstance(${chalk.magentaBright('subdomain')}, ${chalk.magentaBright('username')}, ${chalk.magentaBright('password')}, ${chalk.magentaBright('fingerprint')});`)}`,
      `    ${chalk.yellowBright(`repl.setAuthInstance(${chalk.magentaBright('subdomain')}, ${chalk.magentaBright('username')}, ${chalk.magentaBright('password')});`)}`,
      '',
      chalk.bold('Once the API instance is set, interact with the portal using these methods:'),
      `    ${chalk.yellowBright('await api.login();')}`,
      `    ${chalk.yellowBright('await api.logout();')}`,
      `    ${chalk.yellowBright('await api.getGatewayInformation();')}`,
      `    ${chalk.yellowBright('await api.getPanelInformation();')}`,
      `    ${chalk.yellowBright('await api.getPanelStatus();')}`,
      `    ${chalk.yellowBright(`await api.setPanelStatus(${chalk.magentaBright('armFrom')}, ${chalk.magentaBright('armTo')}, ${chalk.magentaBright('isAlarmActive')});`)}`,
      `    ${chalk.yellowBright('await api.getSensorsInformation();')}`,
      `    ${chalk.yellowBright('await api.getSensorsStatus();')}`,
      `    ${chalk.yellowBright('await api.getOrbSecurityButtons();')}`,
      `    ${chalk.yellowBright('await api.performSyncCheck();')}`,
      `    ${chalk.yellowBright('await api.performKeepAlive();')}`,
      `    ${chalk.yellowBright('      api.isAuthenticated();')}`,
      `    ${chalk.yellowBright('      api.resetSession();')}`,
      '',
      chalk.bold('Once the auth instance is set, interact with the portal using these methods:'),
      `    ${chalk.yellowBright('await auth.getVerificationMethods();')}`,
      `    ${chalk.yellowBright(`await auth.requestCode(${chalk.magentaBright('methodId')});`)}`,
      `    ${chalk.yellowBright(`await auth.validateCode(${chalk.magentaBright('otpCode')});`)}`,
      `    ${chalk.yellowBright('await auth.getTrustedDevices();')}`,
      `    ${chalk.yellowBright(`await auth.addTrustedDevice(${chalk.magentaBright('deviceName')});`)}`,
      `    ${chalk.yellowBright('await auth.completeSignIn();')}`,
      `    ${chalk.yellowBright('await auth.getSensors();')}`,
      `    ${chalk.yellowBright('      auth.getFingerprint();')}`,
      '',
      chalk.bold('You may also wrap the above methods with this to see the entire response:'),
      `    ${chalk.yellowBright(`console.log(util.inspect(${chalk.magentaBright('replace me without the ending semi-colon')}, false, null, true));`)}`,
      chalk.bold('A small reference for REPL commands:'),
      `    ${chalk.yellowBright('.exit')}`,
      `    ${chalk.yellowBright('.help')}`,
      '',
    ].join('\n'));

    return;
  }

  /**
   * CLI - Repl - Display Startup Header.
   *
   * Prints the welcome banner when the REPL starts, including the project
   * links and the usage warnings meant for advanced users.
   *
   * @private
   *
   * @returns {Cli_Repl_ADTPulseRepl_DisplayStartupHeader_Returns}
   *
   * @since 1.0.0
   */
  private static displayStartupHeader(): Cli_Repl_ADTPulseRepl_DisplayStartupHeader_Returns {
    const identity: Cli_Repl_ADTPulseRepl_DisplayStartupHeader_Identity = resolveCliIdentity();

    console.info([
      CLIHeader.render([
        chalk.cyanBright('ADT Pulse for Homebridge Plugin REPL'),
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
      'Welcome to the REPL interface for ADT Pulse for Homebridge. This interface',
      'allows you to interact with the ADT Pulse portal via the included API and is designed',
      `for advanced users only. ${chalk.redBright('PLEASE USE WITH CAUTION, NO WARRANTY IS PROVIDED.')}`,
      '',
      `${chalk.yellowBright('NOTICE')}: The API gathers anonymous analytics to detect potential bugs or issues.`,
      '        All personally identifiable information will be redacted.',
    ].join('\n'));

    return;
  }
}

/**
 * CLI - Repl - Adt Pulse Repl.
 *
 * Instantiates the REPL entry point so it can be launched as a script and
 * exported for consumers that need to start the interactive console.
 *
 * @since 1.0.0
 */
const adtPulseRepl = new ADTPulseRepl();

export default adtPulseRepl;
